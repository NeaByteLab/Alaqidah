import React from 'react'
import type * as Types from '@app/Types.ts'

/**
 * Footer with source link and credit.
 * @description App footer UI.
 * @param props.translations - Footer UI strings
 * @returns Footer React element
 */
export function Footer(props: {
  translations: Pick<Types.I18nEntry, 'sourceLabel' | 'sourceDesc' | 'madeBy'>
}): React.ReactElement {
  const { translations } = props
  return (
    <footer>
      <div className='footer-inner'>
        <div className='footer-links'>
          <span>{translations.sourceLabel}</span>
          <a href='https://alaqida.com/' target='_blank' rel='noopener'>
            {translations.sourceDesc}
          </a>
        </div>
        <div className='footer-credit'>
          {translations.madeBy}{' '}
          <a href='https://github.com/NeaByteLab' target='_blank' rel='noopener'>
            NeaByteLab
          </a>
        </div>
      </div>
    </footer>
  )
}
