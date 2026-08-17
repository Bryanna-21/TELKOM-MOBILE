import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { OfflineStorage } from './offlineStorage';
import { USSD } from './ussdEngine';
import { NETWORK_STATES } from '../constants/theme';

export class NetworkRouter {
  constructor() {
    this.state = NETWORK_STATES.OFFLINE;
    this.apiBase = process.env.EXPO_PUBLIC_API_URL || '';
    this.listeners = [];
    this.unsubscribe = null;
  }

  async init() {
    await OfflineStorage.initDB();
    this.updateState(await NetInfo.fetch());
    this.unsubscribe = NetInfo.addEventListener((state) => this.updateState(state));
    return this;
  }

  updateState(state) {
    if (state.isConnected === true && state.isInternetReachable !== false) {
      this.state = NETWORK_STATES.ONLINE;
      void this.syncPendingOperations();
    } else if (state.isConnected === true) {
      this.state = NETWORK_STATES.GSM_FALLBACK;
    } else {
      this.state = NETWORK_STATES.OFFLINE;
    }
    this.listeners.forEach((callback) => callback(this.state));
  }

  async executeOperation(operation) {
    if (this.state === NETWORK_STATES.ONLINE && this.apiBase) return this.executeOnline(operation);
    if (this.state === NETWORK_STATES.GSM_FALLBACK) return this.executeGSMFallback(operation);
    return this.executeOffline(operation);
  }

  async executeOnline(operation) {
    try {
      const response = await axios({
        method: operation.method || 'POST',
        url: `${this.apiBase}${operation.endpoint}`,
        data: operation.data,
        headers: operation.token ? { Authorization: `Bearer ${operation.token}` } : {},
        timeout: 15000,
      });
      if (response.data?.balance !== undefined) {
        await OfflineStorage.cacheBalance(operation.balanceType || 'general', Number(response.data.balance) || 0);
      }
      return { success: true, data: response.data, mode: 'online' };
    } catch (error) {
      console.warn('Online request failed:', error.message);
      return this.executeGSMFallback(operation);
    }
  }

  async executeGSMFallback(operation) {
    try {
      let result;
      switch (operation.type) {
        case 'send_money': result = await USSD.sendMoney(operation.data.phone, operation.data.amount, operation.data.pin); break;
        case 'buy_airtime': result = await USSD.buyAirtime(operation.data.amount); break;
        case 'pay_bill': result = await USSD.payBill(operation.data.billNumber, operation.data.amount, operation.data.account); break;
        case 'check_balance': result = await USSD.checkBalance(); break;
        default: throw new Error('Unsupported operation for GSM fallback');
      }
      if (result?.success) {
        await OfflineStorage.saveTransaction({ type: operation.type, amount: operation.data?.amount,
          recipient: operation.data?.phone || operation.data?.billNumber, status: 'processed_gsm',
          reference: `gsm_${Date.now()}` });
        return { success: true, data: result, mode: 'gsm_fallback' };
      }
      return this.executeOffline(operation);
    } catch (error) {
      console.warn('GSM fallback failed:', error.message);
      return this.executeOffline(operation);
    }
  }

  async executeOffline(operation) {
    if (operation.type === 'check_balance' || operation.type === 'history') {
      const balance = await OfflineStorage.getCachedBalance(operation.balanceType || 'general');
      return { success: true, data: { balance }, mode: 'offline',
        note: 'Showing cached data. Connect to the internet for the latest balance.' };
    }
    await OfflineStorage.saveTransaction({ type: operation.type, amount: operation.data?.amount,
      recipient: operation.data?.phone || operation.data?.billNumber, status: 'queued',
      reference: `offline_${Date.now()}` });
    return { success: true, mode: 'offline', data: { queued: true },
      note: 'Transaction queued and will be processed when a connection is restored.' };
  }

  async syncPendingOperations() {
    if (this.state !== NETWORK_STATES.ONLINE || !this.apiBase) return;
    const pending = await OfflineStorage.getOfflineTransactions();
    for (const transaction of pending.filter((t) => t.is_synced === 0)) {
      try {
        await axios.post(`${this.apiBase}/transactions/sync`, transaction, { timeout: 15000 });
        await OfflineStorage.markSynced(transaction.id);
      } catch (error) {
        console.warn('Sync failed for transaction:', transaction.id, error.message);
      }
    }
  }

  addListener(callback) {
    this.listeners.push(callback);
    return () => { this.listeners = this.listeners.filter((listener) => listener !== callback); };
  }

  getNetworkState() { return this.state; }

  destroy() {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.listeners = [];
  }
}
