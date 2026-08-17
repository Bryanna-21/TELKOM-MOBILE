import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';

const KEY_STORAGE_NAME = 'telkom_plus_device_encryption_key';

// A hardcoded key baked into the app bundle gives no real protection — it's
// the same for every install and trivially recoverable from the compiled
// JS. Instead, generate a random key once per device and keep it in
// SecureStore (hardware-backed keychain/keystore), never in source.
let cachedKeyPromise = null;

async function getOrCreateDeviceKey() {
  if (!cachedKeyPromise) {
    cachedKeyPromise = (async () => {
      let key = await SecureStore.getItemAsync(KEY_STORAGE_NAME);
      if (!key) {
        key = CryptoJS.lib.WordArray.random(256 / 8).toString();
        await SecureStore.setItemAsync(KEY_STORAGE_NAME, key);
      }
      return key;
    })();
  }
  return cachedKeyPromise;
}

export class EncryptionService {
  static async encrypt(data) {
    try {
      const key = await getOrCreateDeviceKey();
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  }

  static async decrypt(encryptedData) {
    try {
      const key = await getOrCreateDeviceKey();
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  static async storeSecure(key, value) {
    try {
      const encrypted = await this.encrypt(value);
      await SecureStore.setItemAsync(key, encrypted);
      return true;
    } catch (error) {
      console.error('Secure store error:', error);
      return false;
    }
  }

  static async retrieveSecure(key) {
    try {
      const encrypted = await SecureStore.getItemAsync(key);
      if (!encrypted) return null;
      return await this.decrypt(encrypted);
    } catch (error) {
      console.error('Secure retrieve error:', error);
      return null;
    }
  }
}
