import { Linking, Platform } from 'react-native';
import * as SMS from 'expo-sms';
import { USSD_CODES } from '../constants/theme';

export class USSD {
  static async executeUSSD(code, params = {}) {
    const parts = Object.values(params).filter((value) => value !== undefined && value !== null && value !== '');
    const ussdString = parts.length
      ? `${code}${parts.map((value) => `*${String(value).replace(/#/g, '')}`).join('')}#`
      : code;
    try {
      const url = `tel:${encodeURIComponent(ussdString)}`;
      const supported = await Linking.canOpenURL(url);
      if (!supported) return { success: false, error: 'Phone dialer is unavailable on this device.' };
      await Linking.openURL(url);
      return { success: true, method: Platform.OS === 'ios' ? 'phone' : 'ussd', code: ussdString };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async sendSMSFallback(message, recipients = ['544']) {
    try {
      if (!(await SMS.isAvailableAsync())) return { success: false, error: 'SMS is not available.' };
      const result = await SMS.sendSMSAsync(recipients, message);
      return { success: result.result === 'sent', method: 'sms', message };
    } catch (error) { return { success: false, error: error.message }; }
  }

  static checkBalance() { return this.executeUSSD(USSD_CODES.CHECK_BALANCE); }
  static sendMoney(phone, amount, pin) {
    return this.executeUSSD(USSD_CODES.SEND_MONEY, { action: 1, phone: String(phone).replace(/^\+254/, ''), amount, pin });
  }
  static buyAirtime(amount) { return this.executeUSSD(USSD_CODES.BUY_AIRTIME, { amount }); }
  static payBill(billNumber, amount, account) {
    return this.executeUSSD(USSD_CODES.PAY_BILL, { billNumber, amount, account });
  }
}
