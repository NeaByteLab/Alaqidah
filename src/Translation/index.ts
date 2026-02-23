import arData from '@app/Translation/ar.json' with { type: 'json' }
import bnData from '@app/Translation/bn.json' with { type: 'json' }
import deData from '@app/Translation/de.json' with { type: 'json' }
import enData from '@app/Translation/en.json' with { type: 'json' }
import esData from '@app/Translation/es.json' with { type: 'json' }
import faData from '@app/Translation/fa.json' with { type: 'json' }
import frData from '@app/Translation/fr.json' with { type: 'json' }
import hiData from '@app/Translation/hi.json' with { type: 'json' }
import idData from '@app/Translation/id.json' with { type: 'json' }
import itData from '@app/Translation/it.json' with { type: 'json' }
import jaData from '@app/Translation/ja.json' with { type: 'json' }
import koData from '@app/Translation/ko.json' with { type: 'json' }
import msData from '@app/Translation/ms.json' with { type: 'json' }
import ptData from '@app/Translation/pt.json' with { type: 'json' }
import ruData from '@app/Translation/ru.json' with { type: 'json' }
import thData from '@app/Translation/th.json' with { type: 'json' }
import tlData from '@app/Translation/tl.json' with { type: 'json' }
import trData from '@app/Translation/tr.json' with { type: 'json' }
import urData from '@app/Translation/ur.json' with { type: 'json' }
import viData from '@app/Translation/vi.json' with { type: 'json' }
import zhData from '@app/Translation/zh.json' with { type: 'json' }
import type * as Types from '@app/Types.ts'

/** Translations by language code. */
export const translationsByLang: Record<Types.LangCode, Types.I18nEntry> = {
  ar: arData as Types.I18nEntry,
  bn: bnData as Types.I18nEntry,
  de: deData as Types.I18nEntry,
  en: enData as Types.I18nEntry,
  es: esData as Types.I18nEntry,
  fa: faData as Types.I18nEntry,
  fr: frData as Types.I18nEntry,
  hi: hiData as Types.I18nEntry,
  id: idData as Types.I18nEntry,
  it: itData as Types.I18nEntry,
  ja: jaData as Types.I18nEntry,
  ko: koData as Types.I18nEntry,
  ms: msData as Types.I18nEntry,
  pt: ptData as Types.I18nEntry,
  ru: ruData as Types.I18nEntry,
  th: thData as Types.I18nEntry,
  tl: tlData as Types.I18nEntry,
  tr: trData as Types.I18nEntry,
  ur: urData as Types.I18nEntry,
  vi: viData as Types.I18nEntry,
  zh: zhData as Types.I18nEntry
}

/** Available language list. */
export const langList: Types.LangOption[] = [
  { code: 'ar', label: 'AR', name: 'العربية' },
  { code: 'bn', label: 'BN', name: 'বাংলা' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'fa', label: 'FA', name: 'فارسی' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'hi', label: 'HI', name: 'हिन्दी' },
  { code: 'id', label: 'ID', name: 'Bahasa Indonesia' },
  { code: 'it', label: 'IT', name: 'Italiano' },
  { code: 'ja', label: 'JA', name: '日本語' },
  { code: 'ko', label: 'KO', name: '한국어' },
  { code: 'ms', label: 'MS', name: 'Bahasa Melayu' },
  { code: 'pt', label: 'PT', name: 'Português' },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'th', label: 'TH', name: 'ไทย' },
  { code: 'tl', label: 'TL', name: 'Tagalog' },
  { code: 'tr', label: 'TR', name: 'Türkçe' },
  { code: 'ur', label: 'UR', name: 'اردو' },
  { code: 'vi', label: 'VI', name: 'Tiếng Việt' },
  { code: 'zh', label: 'ZH', name: '中文' }
]
