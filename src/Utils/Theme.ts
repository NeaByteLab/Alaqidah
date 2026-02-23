import type * as Types from '@app/Types.ts'
import Storage from '@app/Utils/Storage.ts'

/** Theme DOM attribute name. */
const themeAttribute = 'data-theme'
/** Theme localStorage key. */
const themeStorageKey = 'aqidah-theme'

/**
 * UI theme management.
 * @description Persistence and document attribute.
 */
export default class Theme {
  /**
   * Get active theme mode.
   * @returns Current theme mode
   */
  static getTheme(): Types.ThemeMode {
    const storedTheme = Storage.getItem(themeStorageKey)
    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme
    }
    return getSystemPreference()
  }

  /**
   * Apply stored theme to document.
   */
  static init(): void {
    applyTheme(Theme.getTheme())
  }

  /**
   * Set and persist theme.
   * @param themeMode - Target theme mode
   */
  static setTheme(themeMode: Types.ThemeMode): void {
    Storage.setItem(themeStorageKey, themeMode)
    applyTheme(themeMode)
  }

  /**
   * Toggle theme mode.
   * @returns New theme mode
   */
  static toggle(): Types.ThemeMode {
    const nextThemeMode = Theme.getTheme() === 'dark' ? 'light' : 'dark'
    Theme.setTheme(nextThemeMode)
    return nextThemeMode
  }
}

/**
 * Set document theme attribute.
 * @param themeMode - Theme to apply
 */
function applyTheme(themeMode: Types.ThemeMode): void {
  document.documentElement.setAttribute(themeAttribute, themeMode)
}

/**
 * Detect system color preference.
 * @returns Dark or light from media
 */
function getSystemPreference(): Types.ThemeMode {
  if (typeof globalThis.window === 'undefined' || !globalThis.window.matchMedia) {
    return 'light'
  }
  return globalThis.window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
