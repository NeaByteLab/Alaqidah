import type * as Types from '@app/Types.ts'
import * as Lang from '@app/Translation/index.ts'
import Storage from '@app/Utils/Storage.ts'

/** Fallback language code. */
const defaultLangCode: Types.LangCode = 'en'
/** Language localStorage key. */
const langStorageKey = 'aqidah-lang'

/**
 * Get default language code.
 * @returns Fallback LangCode
 */
export function getDefaultLang(): Types.LangCode {
  return defaultLangCode
}

/**
 * Read stored language preference.
 * @returns Stored or default LangCode
 */
export function getStoredLang(): Types.LangCode {
  const storedLang = Storage.getItem(langStorageKey) as Types.LangCode | null
  if (storedLang && Lang.langList.some((languageOption) => languageOption.code === storedLang)) {
    return storedLang
  }
  return defaultLangCode
}

/**
 * Persist language choice.
 * @param langCode - Language to store
 */
export function setStoredLang(langCode: Types.LangCode): void {
  Storage.setItem(langStorageKey, langCode)
}
