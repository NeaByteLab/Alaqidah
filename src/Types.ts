import type { ReactNode } from 'react'

/**
 * Error boundary props.
 * @description Children to render or catch.
 */
export interface ErrorBoundaryProps {
  children: ReactNode
}

/**
 * Error boundary state.
 * @description Tracks whether child threw.
 */
export interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * UI strings for one locale.
 * @description Localized text keys for app.
 */
export type I18nEntry = {
  /** About aqidah body text */
  aboutBody: string
  /** Source link label text */
  aboutLinkText: string
  /** About section title */
  aboutTitle: string
  /** Error 404 description */
  error404Desc: string
  /** Error 404 title */
  error404Title: string
  /** Error 500 description */
  error500Desc: string
  /** Error 500 title */
  error500Title: string
  /** Back to home link label */
  errorBackHome: string
  /** Language selector label */
  languageLabel: string
  /** Creator credit text */
  madeBy: string
  /** No results message */
  noResults: string
  /** Search placeholder text */
  placeholder: string
  /** Preview modal aria label */
  previewModalAria: string
  /** Preview section label: category */
  previewLabelCategory: string
  /** Preview section label: explanation */
  previewLabelExplanation: string
  /** Preview section label: quote */
  previewLabelQuote: string
  /** Search input aria label */
  searchAria: string
  /** Share content choice prompt */
  shareContentPrompt: string
  /** Share canvas label: explanation section */
  shareLabelExplanation: string
  /** Share canvas label: quote section */
  shareLabelQuote: string
  /** Share modal aria label */
  shareModalAria: string
  /** Share modal title */
  shareModalTitle: string
  /** Share point title fallback (e.g. "Point") */
  sharePointLabel: string
  /** Share option: quote and explanation */
  shareQuoteAndExplanation: string
  /** Share option: quote only */
  shareQuoteOnly: string
  /** Share button: save as image */
  shareSaveAsImage: string
  /** Share button: saving state */
  shareSaving: string
  /** Data source description */
  sourceDesc: string
  /** Source link label */
  sourceLabel: string
}

/**
 * Supported locale codes.
 * @description Language codes for translations.
 */
export type LangCode =
  | 'ar'
  | 'bn'
  | 'de'
  | 'en'
  | 'es'
  | 'fa'
  | 'fr'
  | 'hi'
  | 'id'
  | 'it'
  | 'ja'
  | 'ko'
  | 'ms'
  | 'pt'
  | 'ru'
  | 'th'
  | 'tl'
  | 'tr'
  | 'ur'
  | 'vi'
  | 'zh'

/**
 * Language option for selectors.
 * @description Code, label, display name.
 */
export type LangOption = { code: LangCode; label: string; name: string }

/**
 * Quote data structure.
 * @description Number and lang-to-text map.
 */
export type QuoteData = { no: number; data: Record<string, string> }

/**
 * Raw quote entry from JSON.
 * @description Source data for one point.
 */
export type QuoteEntry = {
  /** Quote point number */
  no: number
  /** Quote or point title */
  title: string
  /** Quote body text */
  text: string
  /** Explanation or commentary */
  explanation: string
  /** Category label */
  category: string
}

/**
 * Application theme modes.
 * @description Dark or light theme.
 */
export type ThemeMode = 'dark' | 'light'
