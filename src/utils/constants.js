// 🎯 App Constants
export const APP_CONFIG = {
  VERSION: '1.0.0',
  BUILD: 1,
  PLATFORM: 'react-native',
};

// 🌐 API Endpoints
export const API = {
  BASE_URL: process.env.TELKOM_CORE_API_URL || 'https://api.telkom.co.ke/v1',
  SANDBOX_URL: process.env.TELKOM_SANDBOX_API_URL || 'https://sandbox.api.telkom.co.ke/v1',
  ENDPOINTS: {
    DASHBOARD: '/dashboard',
    BALANCE: '/balance',
    TRANSACTIONS: '/transactions',
    SEND_MONEY: '/transactions/send',
    PAY_BILL: '/payments/paybill',
    BUY_BUNDLE: '/bundles/buy',
    ZIADA_POINTS: '/ziada/points',
    SUPPORT: '/support',
  },
};

// 📱 USSD Codes
export const USSD = {
  CHECK_BALANCE: '*544#',
  SEND_MONEY: '*334#',
  BUY_AIRTIME: '*544#',
  PAY_BILL: '*522#',
  ZIADA_REWARDS: '*460#',
};

// 🎨 UI Constants
export const UI = {
  COLORS: {
    PRIMARY: '#005CA9',
    SECONDARY: '#FF6600',
    SUCCESS: '#4CD964',
    DANGER: '#FF3B30',
    WARNING: '#FF9500',
    INFO: '#007AFF',
    DARK: '#1A1A1A',
    LIGHT: '#F5F7FA',
    GRAY: '#8E8E93',
  },
  FONTS: {
    REGULAR: 'System',
    BOLD: 'System-Bold',
    LIGHT: 'System-Light',
  },
};

// 🔐 Security Constants
export const SECURITY = {
  SESSION_TIMEOUT: 300000, // 5 minutes
  MAX_PIN_ATTEMPTS: 5,
  ENCRYPTION_KEY: process.env.ENCRYPTION_MASTER_KEY || 'default_key',
  BIOMETRIC_REQUIRED: true,
};

// 📦 Bundle Constants
export const BUNDLES = {
  DATA: {
    '50MB': 50,
    '100MB': 100,
    '500MB': 500,
    '1GB': 1024,
    '2GB': 2048,
    '5GB': 5120,
    '10GB': 10240,
  },
  VOICE: {
    '30min': 30,
    '60min': 60,
    '120min': 120,
    '240min': 240,
  },
  SMS: {
    '100': 100,
    '250': 250,
    '500': 500,
    '1000': 1000,
  },
};

// 📊 Transaction Types
export const TRANSACTION_TYPES = {
  SEND_MONEY: 'send_money',
  RECEIVE_MONEY: 'receive_money',
  BUY_AIRTIME: 'buy_airtime',
  BUY_DATA: 'buy_data',
  PAY_BILL: 'pay_bill',
  ZIADA_REDEEM: 'ziada_redeem',
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
};

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  QUEUED: 'queued',
  SYNCING: 'syncing',
};
