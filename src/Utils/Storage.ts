/**
 * Safe localStorage wrapper.
 * @description Error-handled get, set, remove.
 */
export default class Storage {
  /**
   * Get item from storage.
   * @param storageKey - Storage key name
   * @returns Value or null
   */
  static getItem(storageKey: string): string | null {
    try {
      return localStorage.getItem(storageKey)
    } catch {
      return null
    }
  }

  /**
   * Remove item from storage.
   * @param storageKey - Storage key name
   */
  static removeItem(storageKey: string): void {
    try {
      localStorage.removeItem(storageKey)
    } catch {
      void 0
    }
  }

  /**
   * Set item in storage.
   * @param storageKey - Storage key name
   * @param storageValue - String value
   */
  static setItem(storageKey: string, storageValue: string): void {
    try {
      localStorage.setItem(storageKey, storageValue)
    } catch {
      void 0
    }
  }
}
