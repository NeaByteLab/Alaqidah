import React from 'react'
import * as Lang from '@app/Translation/index.ts'
import type * as Types from '@app/Types.ts'

/**
 * Escapes regex special characters.
 * @param sourceString - Raw string to escape
 * @returns Escaped string for RegExp
 */
export function escapeRegex(sourceString: string): string {
  return sourceString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Gets quote text for given language.
 * @param quoteData - Quote content object
 * @param langCode - Target language code
 * @returns Localized text or fallback
 */
export function getQuoteText(quoteData: Types.QuoteData, langCode: Types.LangCode): string {
  return quoteData.data[langCode] ?? quoteData.data['en'] ?? ''
}

/**
 * Highlights search matches in text.
 * @param textToHighlight - Source text
 * @param searchQuery - Search query
 * @returns React node with marked matches
 */
export function highlightMatches(textToHighlight: string, searchQuery: string): React.ReactNode {
  if (!searchQuery) {
    return textToHighlight
  }
  const escapedQuery = escapeRegex(searchQuery)
  const textParts = textToHighlight.split(new RegExp(`(${escapedQuery})`, 'gi'))
  return textParts.map((textPart, partIndex) =>
    textPart.toLowerCase() === searchQuery.toLowerCase()
      ? (
        <mark key={partIndex} className='quote-highlight'>
          {textPart}
        </mark>
      )
      : textPart
  )
}

/**
 * Parses URL lang segment to LangCode.
 * @param langParam - URL segment value
 * @returns LangCode or null
 */
export function parseLang(langParam: string | undefined): Types.LangCode | null {
  const validLangs = new Set(Lang.langList.map((languageOption) => languageOption.code))
  if (langParam && validLangs.has(langParam as Types.LangCode)) {
    return langParam as Types.LangCode
  }
  return null
}
