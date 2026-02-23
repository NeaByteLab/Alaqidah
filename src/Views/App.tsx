import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type * as Types from '@app/Types.ts'
import * as Content from '@app/Content/index.ts'
import * as Lang from '@app/Translation/index.ts'
import * as Utils from '@app/Utils/index.ts'
import * as Helper from '@app/Views/Helper.tsx'
import * as Views from '@app/Views/index.tsx'

/** Boolean false for modal closed. */
const defaultFalse = false
/** Boolean true for modal open. */
const defaultTrue = true
const LazyPreview = lazy(() =>
  import('@app/Views/Preview.tsx').then((loadedModule) => ({ default: loadedModule.Preview }))
)
const LazyShare = lazy(() =>
  import('@app/Views/Share.tsx').then((loadedModule) => ({ default: loadedModule.Share }))
)

/**
 * Main app layout and state.
 * @description Renders header, quote grid, footer.
 */
export function App(): React.ReactElement {
  const routerNavigate = useNavigate()
  const { lang: langParam } = useParams<{ lang: string }>()
  const [searchParams] = useSearchParams()
  const currentLang = Helper.parseLang(langParam) ?? Utils.getDefaultLang()
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('query') ?? '')
  const [themeMode, setThemeMode] = useState<Types.ThemeMode>(() => Utils.Theme.getTheme())
  const [aboutModalOpen, setAboutModalOpen] = useState(defaultFalse)
  const [previewDetail, setPreviewDetail] = useState<
    {
      no: number
      title: string
      text: string
      explanation: string
      category: string
    } | null
  >(null)
  const [shareDetail, setShareDetail] = useState<Types.QuoteEntry | null>(null)
  const [copiedQuoteNo, setCopiedQuoteNo] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState(Content.categoryAll)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mainScrollRef = useRef<HTMLElement>(null)
  /** Clear search on Escape */
  const handleKeyDown = useCallback((keyboardEvent: React.KeyboardEvent) => {
    if (keyboardEvent.key === 'Escape') {
      setSearchQuery('')
      ;(keyboardEvent.target as HTMLInputElement).focus()
    }
  }, [])
  /** Navigate to language route; reset category */
  const handleLangChange = useCallback(
    (langCode: Types.LangCode) => {
      setSelectedCategory(Content.categoryAll)
      routerNavigate(`/${langCode}`)
    },
    [routerNavigate]
  )
  /** Copy quote text to clipboard; show check icon briefly */
  const handleCopy = useCallback((quoteText: string, quoteNo: number) => {
    navigator.clipboard?.writeText(quoteText)
    setCopiedQuoteNo(quoteNo)
    const copyFeedbackTimeoutMs = 1500
    setTimeout(() => setCopiedQuoteNo(null), copyFeedbackTimeoutMs)
  }, [])
  /** Toggle theme dark or light */
  const handleThemeToggle = useCallback(() => setThemeMode(Utils.Theme.toggle()), [])
  /** Close about modal */
  const setAboutModalClosed = useCallback(() => setAboutModalOpen(defaultFalse), [])
  /** Open about modal */
  const setAboutModalOpened = useCallback(() => setAboutModalOpen(defaultTrue), [defaultTrue])
  /** Close preview modal */
  const setPreviewClosed = useCallback(() => setPreviewDetail(null), [])
  /** Close share modal */
  const setShareClosed = useCallback(() => setShareDetail(null), [])

  useEffect(() => {
    const handleEscape = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key !== 'Escape') {
        return
      }
      if (shareDetail) {
        setShareDetail(null)
      } else if (previewDetail) {
        setPreviewDetail(null)
      } else if (aboutModalOpen) {
        setAboutModalClosed()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [aboutModalOpen, setAboutModalClosed, previewDetail, shareDetail])

  useEffect(() => {
    if (!Helper.parseLang(langParam)) {
      routerNavigate(`/${Utils.getDefaultLang()}`, { replace: true })
      return
    }
    Utils.setStoredLang(currentLang)
    document.documentElement.lang = currentLang
  }, [currentLang, langParam, routerNavigate])

  useEffect(() => {
    const resolvedCategoryList = Content.getCategoryList(currentLang)
    const isCategoryValid = selectedCategory === Content.categoryAll ||
      resolvedCategoryList.includes(selectedCategory)
    if (!isCategoryValid) {
      setSelectedCategory(Content.categoryAll)
    }
  }, [currentLang])

  const localeStrings = Lang.translationsByLang[currentLang]
  const queryTrimmed = searchQuery.trim().toLowerCase()
  const quotesForLang = Content.quotes.filter(
    (quoteItem) => Helper.getQuoteText(quoteItem, currentLang).length > 0
  )
  const filteredBySearch = quotesForLang.filter((quoteItem) => {
    const quoteText = Helper.getQuoteText(quoteItem, currentLang)
    return (
      !queryTrimmed ||
      quoteText.toLowerCase().includes(queryTrimmed) ||
      String(quoteItem.no).includes(queryTrimmed)
    )
  })
  const categoryList = Content.getCategoryList(currentLang)
  const allCount = quotesForLang.length
  const categoryCounts: Record<string, number> = {}
  categoryList.forEach((categoryLabel) => {
    categoryCounts[categoryLabel] = quotesForLang.filter(
      (quoteEntry) => Content.getCategoryForQuote(quoteEntry.no, currentLang) === categoryLabel
    ).length
  })
  const categories = [
    { id: Content.categoryAll, label: `All (${allCount})` },
    ...categoryList.map((categoryLabel) => ({
      id: categoryLabel,
      label: `${categoryLabel} (${categoryCounts[categoryLabel] ?? 0})`
    }))
  ]
  const filteredQuotes = selectedCategory === Content.categoryAll
    ? filteredBySearch
    : filteredBySearch.filter(
      (quoteEntry) => Content.getCategoryForQuote(quoteEntry.no, currentLang) === selectedCategory
    )

  useEffect(() => {
    const scrollContainer = mainScrollRef.current
    if (!scrollContainer) {
      return
    }
    const cardElements = scrollContainer.querySelectorAll('.quote-card')
    const intersectionObserver = new IntersectionObserver(
      (observerEntries) => {
        observerEntries.forEach((observerEntry) => {
          if (observerEntry.isIntersecting) {
            observerEntry.target.classList.add('visible')
            intersectionObserver.unobserve(observerEntry.target)
          }
        })
      },
      { root: scrollContainer, rootMargin: '0px 0px -40px 0px', threshold: 0 }
    )
    cardElements.forEach((cardElement) => intersectionObserver.observe(cardElement))
    return () => intersectionObserver.disconnect()
  }, [filteredQuotes])

  return (
    <>
      <div className='container'>
        <Views.Header
          themeMode={themeMode}
          onThemeToggle={handleThemeToggle}
          currentLang={currentLang}
          onLangChange={handleLangChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchInputRef={searchInputRef}
          onSearchKeyDown={handleKeyDown}
          translations={localeStrings}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <main ref={mainScrollRef} className='main-scroll'>
          <article className='quote-grid'>
            {filteredQuotes.map((quoteItem) => (
              <div key={quoteItem.no} className='quote-card'>
                <div className='quote-card-inner'>
                  <p className='quote-text'>
                    {queryTrimmed
                      ? Helper.highlightMatches(
                        Helper.getQuoteText(quoteItem, currentLang),
                        queryTrimmed
                      )
                      : Helper.getQuoteText(quoteItem, currentLang)}
                  </p>
                  <div className='quote-actions'>
                    <button
                      type='button'
                      className='quote-action'
                      onClick={() =>
                        setPreviewDetail({
                          no: quoteItem.no,
                          ...Content.getQuoteDetail(quoteItem.no, currentLang)
                        })}
                      aria-label='Preview detail'
                      title='Preview detail'
                    >
                      <svg
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth={2}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        aria-hidden
                      >
                        <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
                        <circle cx='12' cy='12' r='3' />
                      </svg>
                    </button>
                    <button
                      type='button'
                      className='quote-action'
                      onClick={(event) => {
                        handleCopy(Helper.getQuoteText(quoteItem, currentLang), quoteItem.no)
                        ;(event.currentTarget as HTMLElement).blur()
                      }}
                      aria-label='Copy'
                      title='Copy to clipboard'
                    >
                      {copiedQuoteNo === quoteItem.no
                        ? (
                          <svg
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth={2}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            aria-hidden
                            style={{ color: 'var(--accent)' }}
                          >
                            <path d='M20 6L9 17l-5-5' />
                          </svg>
                        )
                        : (
                          <svg
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth={2}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            aria-hidden
                          >
                            <rect width='14' height='14' x='8' y='8' rx='2' ry='2' />
                            <path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' />
                          </svg>
                        )}
                    </button>
                    <button
                      type='button'
                      className='quote-action'
                      onClick={() =>
                        setShareDetail({
                          no: quoteItem.no,
                          ...Content.getQuoteDetail(quoteItem.no, currentLang)
                        })}
                      aria-label='Share'
                      title='Share'
                    >
                      <svg
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth={2}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        aria-hidden
                      >
                        <circle cx='18' cy='5' r='3' />
                        <circle cx='6' cy='12' r='3' />
                        <circle cx='18' cy='19' r='3' />
                        <line x1='8.59' y1='13.51' x2='15.42' y2='17.49' />
                        <line x1='15.41' y1='6.51' x2='8.59' y2='10.49' />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </article>
          <div className={`no-results${filteredQuotes.length === 0 ? ' visible' : ''}`}>
            <svg
              className='no-results-svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden
            >
              <circle cx='12' cy='12' r='10' />
              <path d='M8 8l8 8M16 8l-8 8' />
            </svg>
            <p className='no-results-text'>{localeStrings.noResults}</p>
          </div>
        </main>
      </div>
      <Views.Footer translations={localeStrings} />
      <Views.FAB onClick={setAboutModalOpened} ariaLabel={localeStrings.aboutTitle} />
      <Suspense fallback={null}>
        <LazyPreview
          detail={previewDetail}
          translations={localeStrings}
          onClose={setPreviewClosed}
        />
      </Suspense>
      <Suspense fallback={null}>
        <LazyShare
          detail={shareDetail}
          themeMode={themeMode}
          translations={localeStrings}
          onClose={setShareClosed}
        />
      </Suspense>
      {aboutModalOpen
        ? (
          <div
            className='about-modal-overlay'
            onClick={setAboutModalClosed}
            role='dialog'
            aria-modal='true'
            aria-label={localeStrings.aboutTitle}
          >
            <div
              className='about-modal-content'
              onClick={(clickEvent) => clickEvent.stopPropagation()}
            >
              <div className='about-modal-header'>
                <h2 className='about-modal-title'>{localeStrings.aboutTitle}</h2>
                <button
                  type='button'
                  className='about-modal-close'
                  onClick={setAboutModalClosed}
                  aria-label='Close'
                >
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    aria-hidden
                  >
                    <path d='M18 6L6 18M6 6l12 12' />
                  </svg>
                </button>
              </div>
              <p className='about-modal-body'>{localeStrings.aboutBody}</p>
              <a
                href='https://alaqida.com/'
                target='_blank'
                rel='noopener'
                className='about-modal-link'
              >
                {localeStrings.aboutLinkText} → alaqida.com
              </a>
            </div>
          </div>
        )
        : null}
    </>
  )
}
