import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import * as Lang from '@app/Translation/index.ts'
import * as Utils from '@app/Utils/index.ts'
import * as Helper from '@app/Views/Helper.tsx'

/**
 * Not found page.
 * @description Renders 404 message and home link.
 * @returns 404 page element
 */
export function NotFound404(): React.ReactElement {
  const { pathname: currentPathname } = useLocation()
  const pathSegment = currentPathname.replace(/^\/+|\/+$/g, '').split('/')[0]
  const resolvedLang = Helper.parseLang(pathSegment) ?? Utils.getStoredLang()
  const localeStrings = Lang.translationsByLang[resolvedLang]
  return (
    <div className='error-page'>
      <div className='error-page-inner'>
        <p className='error-page-code'>404</p>
        <h1 className='error-page-title'>{localeStrings.error404Title}</h1>
        <p className='error-page-desc'>{localeStrings.error404Desc}</p>
        <Link to={`/${resolvedLang}`} className='error-page-link'>
          {localeStrings.errorBackHome}
        </Link>
      </div>
    </div>
  )
}
