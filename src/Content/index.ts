import idData from '@app/Content/id.json' with { type: 'json' }
import enData from '@app/Content/en.json' with { type: 'json' }
import arData from '@app/Content/ar.json' with { type: 'json' }
import bnData from '@app/Content/bn.json' with { type: 'json' }
import deData from '@app/Content/de.json' with { type: 'json' }
import esData from '@app/Content/es.json' with { type: 'json' }
import faData from '@app/Content/fa.json' with { type: 'json' }
import frData from '@app/Content/fr.json' with { type: 'json' }
import hiData from '@app/Content/hi.json' with { type: 'json' }
import itData from '@app/Content/it.json' with { type: 'json' }
import jaData from '@app/Content/ja.json' with { type: 'json' }
import koData from '@app/Content/ko.json' with { type: 'json' }
import msData from '@app/Content/ms.json' with { type: 'json' }
import ptData from '@app/Content/pt.json' with { type: 'json' }
import ruData from '@app/Content/ru.json' with { type: 'json' }
import thData from '@app/Content/th.json' with { type: 'json' }
import tlData from '@app/Content/tl.json' with { type: 'json' }
import trData from '@app/Content/tr.json' with { type: 'json' }
import urData from '@app/Content/ur.json' with { type: 'json' }
import viData from '@app/Content/vi.json' with { type: 'json' }
import zhData from '@app/Content/zh.json' with { type: 'json' }
import type * as Types from '@app/Types.ts'

/** All-category filter value. */
export const categoryAll = 'all'

/** Locale to quote entries. */
const langEntries: [string, Types.QuoteEntry[]][] = [
  ['id', idData as Types.QuoteEntry[]],
  ['en', enData as Types.QuoteEntry[]],
  ['ar', arData as Types.QuoteEntry[]],
  ['bn', bnData as Types.QuoteEntry[]],
  ['de', deData as Types.QuoteEntry[]],
  ['es', esData as Types.QuoteEntry[]],
  ['fa', faData as Types.QuoteEntry[]],
  ['fr', frData as Types.QuoteEntry[]],
  ['hi', hiData as Types.QuoteEntry[]],
  ['it', itData as Types.QuoteEntry[]],
  ['ja', jaData as Types.QuoteEntry[]],
  ['ko', koData as Types.QuoteEntry[]],
  ['ms', msData as Types.QuoteEntry[]],
  ['pt', ptData as Types.QuoteEntry[]],
  ['ru', ruData as Types.QuoteEntry[]],
  ['th', thData as Types.QuoteEntry[]],
  ['tl', tlData as Types.QuoteEntry[]],
  ['tr', trData as Types.QuoteEntry[]],
  ['ur', urData as Types.QuoteEntry[]],
  ['vi', viData as Types.QuoteEntry[]],
  ['zh', zhData as Types.QuoteEntry[]]
]
/** Per-lang quote number to text. */
const quotesByLanguage = new Map<string, Map<number, string>>()
/** Per-lang quote number to title. */
const titleByLanguage = new Map<string, Map<number, string>>()
/** Per-lang quote number to explanation. */
const explanationByLanguage = new Map<string, Map<number, string>>()
/** Per-lang quote number to category. */
const categoryByLanguage = new Map<string, Map<number, string>>()
for (const [langCode, quoteEntriesForLang] of langEntries) {
  quotesByLanguage.set(
    langCode,
    new Map(quoteEntriesForLang.map((entry) => [entry.no, entry.text]))
  )
  titleByLanguage.set(
    langCode,
    new Map(quoteEntriesForLang.map((entry) => [entry.no, entry.title]))
  )
  explanationByLanguage.set(
    langCode,
    new Map(quoteEntriesForLang.map((entry) => [entry.no, entry.explanation]))
  )
  const categoryMap = new Map<number, string>()
  for (const quoteEntry of quoteEntriesForLang) {
    if (quoteEntry.category.length > 0) {
      categoryMap.set(quoteEntry.no, quoteEntry.category)
    }
  }
  categoryByLanguage.set(langCode, categoryMap)
}

/** Sorted unique quote numbers. */
const allQuoteNumbers: number[] = Array.from(
  new Set(
    langEntries.flatMap(([, quoteEntriesForLang]) => quoteEntriesForLang.map((entry) => entry.no))
  )
).sort((first, second) => first - second)

/**
 * Merged quotes by number and language.
 * @description Locale JSONs for app list.
 */
export const quotes: Types.QuoteData[] = allQuoteNumbers.map((quoteNo) => {
  const quoteDataByLang: Record<string, string> = {}
  for (const [langCode] of langEntries) {
    const quoteText = quotesByLanguage.get(langCode)?.get(quoteNo)
    if (quoteText !== undefined) {
      quoteDataByLang[langCode] = quoteText
    }
  }
  return { no: quoteNo, data: quoteDataByLang }
})

/**
 * Category label for quote and language.
 * @param no - Quote number
 * @param lang - Language code
 * @returns Category label or empty
 */
export function getCategoryForQuote(quoteNo: number, langCode: string): string {
  return categoryByLanguage.get(langCode)?.get(quoteNo) ?? ''
}

/**
 * Quote detail for number and language.
 * @param no - Quote number
 * @param lang - Language code
 * @returns Title, text, explanation, category
 */
export function getQuoteDetail(
  quoteNo: number,
  langCode: string
): { title: string; text: string; explanation: string; category: string } {
  const quoteText = quotesByLanguage.get(langCode)?.get(quoteNo) ?? ''
  const quoteTitle = titleByLanguage.get(langCode)?.get(quoteNo) ?? ''
  const quoteExplanation = explanationByLanguage.get(langCode)?.get(quoteNo) ?? ''
  const quoteCategory = categoryByLanguage.get(langCode)?.get(quoteNo) ?? ''
  return {
    title: quoteTitle,
    text: quoteText,
    explanation: quoteExplanation,
    category: quoteCategory
  }
}

/**
 * Sorted category labels for language.
 * @param lang - Language code
 * @returns Sorted category labels
 */
export function getCategoryList(langCode: string): string[] {
  const categoryMapForLang = categoryByLanguage.get(langCode)
  if (!categoryMapForLang) {
    return []
  }
  const uniqueCategorySet = new Set<string>()
  for (const categoryLabel of categoryMapForLang.values()) {
    if (categoryLabel.length > 0) {
      uniqueCategorySet.add(categoryLabel)
    }
  }
  return Array.from(uniqueCategorySet).sort((first, second) => first.localeCompare(second))
}
