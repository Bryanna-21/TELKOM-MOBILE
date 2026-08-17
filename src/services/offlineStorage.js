import * as SQLite from 'expo-sqlite';

let dbPromise;
const getDB = () => dbPromise ??= SQLite.openDatabaseAsync('telkom_plus.db');

export class OfflineStorage {
  static async initDB() {
    const db = await getDB();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, amount REAL, recipient TEXT,
        status TEXT, timestamp INTEGER, reference TEXT, is_synced INTEGER DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS cached_balances (
        id INTEGER PRIMARY KEY AUTOINCREMENT, balance_type TEXT UNIQUE, amount REAL, updated_at INTEGER
      );
      CREATE TABLE IF NOT EXISTS merchant_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT, lat REAL, lng REAL, category TEXT
      );
    `);
  }

  static async saveTransaction(t) {
    const db = await getDB();
    const result = await db.runAsync(
      `INSERT INTO transactions (type,amount,recipient,status,timestamp,reference,is_synced)
       VALUES (?,?,?,?,?,?,0)`,
      t.type ?? '', Number(t.amount) || 0, t.recipient ?? '', t.status ?? 'pending', Date.now(), t.reference ?? ''
    );
    return result.lastInsertRowId;
  }

  static async getOfflineTransactions() {
    return (await getDB()).getAllAsync('SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 100');
  }

  static async markSynced(id) {
    await (await getDB()).runAsync('UPDATE transactions SET is_synced=1,status=? WHERE id=?', 'synced', id);
  }

  static async cacheBalance(type, amount) {
    await (await getDB()).runAsync(
      `INSERT INTO cached_balances (balance_type,amount,updated_at) VALUES (?,?,?)
       ON CONFLICT(balance_type) DO UPDATE SET amount=excluded.amount,updated_at=excluded.updated_at`,
      type, Number(amount) || 0, Date.now()
    );
  }

  static async getCachedBalance(type) {
    const row = await (await getDB()).getFirstAsync('SELECT amount FROM cached_balances WHERE balance_type=?', type);
    return Number(row?.amount) || 0;
  }
}
