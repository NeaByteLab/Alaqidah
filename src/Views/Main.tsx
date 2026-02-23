import React, { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@app/Views/Errors/index.tsx'
import * as Utils from '@app/Utils/index.ts'
import '@app/Assets/style.css'

const App = lazy(() =>
  import('@app/Views/App.tsx').then((loadedModule) => ({ default: loadedModule.App }))
)
const NotFound404 = lazy(() =>
  import('@app/Views/Errors/404.tsx').then((loadedModule) => ({
    default: loadedModule.NotFound404
  }))
)

/** Loading spinner placeholder element. */
function LoadingSplash(): React.JSX.Element {
  return (
    <div className='loading-splash' role='status' aria-label='Loading'>
      <div className='loading-splash-spinner' />
    </div>
  )
}

/** Root DOM node for React mount. */
const rootDomElement = document.getElementById('root')
if (!rootDomElement) {
  throw new Error('#root not found')
}
Utils.Theme.init()
createRoot(rootDomElement).render(
  <ErrorBoundary>
    <BrowserRouter>
      <Suspense fallback={<LoadingSplash />}>
        <Routes>
          <Route path='/' element={<Navigate to={`/${Utils.getStoredLang()}`} replace />} />
          <Route path='/:lang' element={<App />} />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </ErrorBoundary>
)
