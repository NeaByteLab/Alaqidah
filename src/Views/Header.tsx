import React from 'react'
import * as Lang from '@app/Translation/index.ts'
import type * as Types from '@app/Types.ts'

/**
 * Header with theme, lang, search, category.
 * @description App header controls and filters.
 * @param props.themeMode - Current theme
 * @param props.onThemeToggle - Theme toggle handler
 * @param props.currentLang - Current language code
 * @param props.onLangChange - Language change handler
 * @param props.searchQuery - Search input value
 * @param props.onSearchChange - Search change handler
 * @param props.searchInputRef - Ref for search input
 * @param props.onSearchKeyDown - Search keydown handler
 * @param props.translations - Header UI strings
 * @param props.categories - Category options with id and label
 * @param props.selectedCategory - Selected category id
 * @param props.onCategoryChange - Category change handler
 * @returns Header React element
 */
export function Header(props: {
  themeMode: Types.ThemeMode
  onThemeToggle: () => void
  currentLang: Types.LangCode
  onLangChange: (langCode: Types.LangCode) => void
  searchQuery: string
  onSearchChange: (searchValue: string) => void
  searchInputRef: React.RefObject<HTMLInputElement | null>
  onSearchKeyDown: (keyboardEvent: React.KeyboardEvent<HTMLInputElement>) => void
  translations: Pick<Types.I18nEntry, 'placeholder' | 'searchAria' | 'languageLabel'>
  categories: { id: string; label: string }[]
  selectedCategory: string
  onCategoryChange: (id: string) => void
}): React.ReactElement {
  const {
    themeMode,
    onThemeToggle,
    currentLang,
    onLangChange,
    searchQuery,
    onSearchChange,
    searchInputRef,
    onSearchKeyDown,
    translations,
    categories,
    selectedCategory,
    onCategoryChange
  } = props
  return (
    <header>
      <div className='header-row'>
        <div className='header-controls'>
          <button
            type='button'
            className='theme-toggle'
            onClick={onThemeToggle}
            aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={themeMode === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {themeMode === 'dark'
              ? (
                <svg
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  aria-hidden
                >
                  <circle cx='12' cy='12' r='5' />
                  <path d='M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42' />
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
                  <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
                </svg>
              )}
          </button>
          <div className='lang-select-wrap'>
            <img
              src={`/flags/${currentLang}.png`}
              alt=''
              className='lang-flag'
              width={24}
              height={18}
              aria-hidden
            />
            <select
              id='lang-select'
              className='lang-select'
              value={currentLang}
              onChange={(changeEvent) => onLangChange(changeEvent.target.value as Types.LangCode)}
              aria-label={translations.languageLabel}
              title={translations.languageLabel}
            >
              {Lang.langList.map(({ code: langCode, name: langName }) => (
                <option key={langCode} value={langCode}>
                  {langName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={`search-wrap${searchQuery ? ' has-value' : ''}`}>
          <div className='search-input-row'>
            <div className='search-input-cell'>
              <input
                ref={searchInputRef}
                id='quote-search'
                type='search'
                className='search-input'
                placeholder={translations.placeholder}
                aria-label={translations.searchAria}
                value={searchQuery}
                onChange={(changeEvent) => onSearchChange(changeEvent.target.value)}
                onKeyDown={onSearchKeyDown}
                autoComplete='off'
              />
              <svg
                className='search-icon'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
                aria-hidden
              >
                <circle cx='11' cy='11' r='8' />
                <path d='m21 21-4.35-4.35' />
              </svg>
              {searchQuery
                ? (
                  <button
                    type='button'
                    className='search-clear'
                    onClick={() => {
                      onSearchChange('')
                      searchInputRef.current?.focus()
                    }}
                    aria-label='Clear search'
                    title='Clear search'
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
                )
                : null}
            </div>
            <div className='category-select-wrap'>
              <svg
                className='category-select-icon'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
                aria-hidden
              >
                <polygon points='22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' />
              </svg>
              <select
                className='category-select'
                value={selectedCategory}
                onChange={(changeEvent) => onCategoryChange(changeEvent.target.value)}
                aria-label='Filter by category'
                title='Filter by category'
              >
                {categories.map((categoryOption) => (
                  <option key={categoryOption.id} value={categoryOption.id}>
                    {categoryOption.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
