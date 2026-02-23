import React from 'react'
import type * as Types from '@app/Types.ts'

/**
 * Quote detail preview modal.
 * @description Detail title, text, explanation, category.
 * @param props.detail - Quote no, title, text, explanation, category or null
 * @param props.translations - Preview labels (quote, explanation, category, aria, point)
 * @param props.onClose - Close handler
 * @returns Modal element or null
 */
export function Preview(props: {
  detail: {
    no: number
    title: string
    text: string
    explanation: string
    category: string
  } | null
  translations: Pick<
    Types.I18nEntry,
    | 'previewLabelQuote'
    | 'previewLabelExplanation'
    | 'previewLabelCategory'
    | 'previewModalAria'
    | 'sharePointLabel'
  >
  onClose: () => void
}): React.ReactElement | null {
  const { detail: quoteDetail, translations, onClose } = props
  if (!quoteDetail) {
    return null
  }
  return (
    <div
      className='about-modal-overlay'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-label={translations.previewModalAria}
    >
      <div className='preview-modal-content' onClick={(clickEvent) => clickEvent.stopPropagation()}>
        <div className='preview-modal-header'>
          <h2 className='preview-modal-main-title'>
            {quoteDetail.title || `${translations.sharePointLabel} ${quoteDetail.no}`}
          </h2>
          <button type='button' className='about-modal-close' onClick={onClose} aria-label='Close'>
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
        <div className='preview-modal-body'>
          {quoteDetail.text
            ? (
              <section className='preview-modal-section'>
                <h3 className='preview-modal-label'>{translations.previewLabelQuote}</h3>
                <p className='preview-modal-text'>{quoteDetail.text}</p>
              </section>
            )
            : null}
          {quoteDetail.explanation
            ? (
              <section className='preview-modal-section'>
                <h3 className='preview-modal-label'>{translations.previewLabelExplanation}</h3>
                <div className='preview-modal-explanation'>
                  {quoteDetail.explanation
                    .split(/<br\s*\/?>\s*<br\s*\/?>/i)
                    .map((paragraphText, paragraphIndex) => (
                      <p key={paragraphIndex}>
                        {paragraphText.replace(/<br\s*\/?>/gi, '\n')}
                      </p>
                    ))}
                </div>
              </section>
            )
            : null}
          {quoteDetail.category
            ? (
              <section className='preview-modal-section preview-modal-section--category'>
                <h3 className='preview-modal-label'>{translations.previewLabelCategory}</h3>
                <span className='preview-modal-category'>{quoteDetail.category}</span>
              </section>
            )
            : null}
        </div>
      </div>
    </div>
  )
}
