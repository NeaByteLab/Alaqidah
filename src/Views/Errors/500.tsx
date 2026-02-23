import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import * as Helper from '@app/Views/Helper.tsx'
import * as Lang from '@app/Translation/index.ts'
import * as Utils from '@app/Utils/index.ts'

/**
 * Server error page.
 * @description Renders 500 message and home link.
 * @returns 500 page element
 */
export function ServerError500(): React.ReactElement {
  const { pathname: currentPathname } = useLocation()
  const pathSegment = currentPathname.replace(/^\/+|\/+$/g, '').split('/')[0]
  const resolvedLang = Helper.parseLang(pathSegment) ?? Utils.getStoredLang()
  const localeStrings = Lang.translationsByLang[resolvedLang]
  return (
    <div className='error-page'>
      <div className='error-page-inner'>
        <p className='error-page-code'>500</p>
        <h1 className='error-page-title'>{localeStrings.error500Title}</h1>
        <p className='error-page-desc'>{localeStrings.error500Desc}</p>
        <Link to={`/${resolvedLang}`} className='error-page-link'>
          {localeStrings.errorBackHome}
        </Link>
      </div>
    </div>
  )
}
