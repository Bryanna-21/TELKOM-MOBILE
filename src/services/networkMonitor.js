import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

class NetworkMonitor {
  constructor() {
    this.isOnline = true;
    this.networkType = 'unknown';
    this.listeners = [];
    this.connectionHistory = [];
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    try {
      const state = await NetInfo.fetch();
      this.updateState(state);

      NetInfo.addEventListener((state) => {
        this.updateState(state);
        this.notifyListeners();
      });

      this.isInitialized = true;
      console.log('📡 Network monitor initialized');
    } catch (error) {
      console.error('❌ Network monitor init failed:', error);
    }
  }

  updateState(state) {
    const wasOnline = this.isOnline;
    this.isOnline = !!(state.isConnected && state.isInternetReachable);
    this.networkType = state.type || 'unknown';
    this.connectionDetails = {
      type: state.type,
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
      details: state.details,
    };

    // Log connection history
    if (wasOnline !== this.isOnline) {
      this.connectionHistory.push({
        timestamp: Date.now(),
        isOnline: this.isOnline,
        type: this.networkType,
      });

      // Keep only last 100 entries
      if (this.connectionHistory.length > 100) {
        this.connectionHistory.shift();
      }
    }
  }

  getStatus() {
    return {
      isOnline: this.isOnline,
      networkType: this.networkType,
      connectionDetails: this.connectionDetails,
    };
  }

  addListener(callback) {
    this.listeners.push(callback);
    // Immediate callback with current state
    callback(this.getStatus());
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(fn => fn !== callback);
  }

  notifyListeners() {
    const status = this.getStatus();
    this.listeners.forEach(callback => callback(status));
  }

  // 🎯 Check if we should use GSM fallback
  shouldUseGSMFallback() {
    return !this.isOnline || this.networkType === 'none' || this.networkType === 'unknown';
  }

  // 📊 Get connection history for debugging
  getConnectionHistory(limit = 20) {
    return this.connectionHistory.slice(-limit);
  }

  // 📈 Get uptime statistics
  getUptimeStats() {
    if (this.connectionHistory.length === 0) return { uptime: '100%', totalSwitches: 0 };

    const onlineEntries = this.connectionHistory.filter(h => h.isOnline);
    const uptime = (onlineEntries.length / this.connectionHistory.length) * 100;
    const totalSwitches = this.connectionHistory.length - 1;

    return {
      uptime: `${uptime.toFixed(1)}%`,
      totalSwitches,
      lastChange: this.connectionHistory[this.connectionHistory.length - 1],
    };
  }
}

export default new NetworkMonitor();
