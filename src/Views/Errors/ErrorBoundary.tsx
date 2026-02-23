import React from 'react'
import type * as Types from '@app/Types.ts'
import { ServerError500 } from '@app/Views/Errors/500.tsx'

/**
 * Catches errors, shows 500 page.
 * @description Error boundary for runtime errors.
 */
export class ErrorBoundary extends React.Component<
  Types.ErrorBoundaryProps,
  Types.ErrorBoundaryState
> {
  constructor(props: Types.ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  /**
   * Sets state when child throws.
   * @returns State with hasError true
   */
  static getDerivedStateFromError(): Types.ErrorBoundaryState {
    return { hasError: true }
  }

  /**
   * Renders children or 500 page.
   * @returns Children or ServerError500
   */
  override render(): React.ReactNode {
    if (this.state.hasError) {
      return <ServerError500 />
    }
    return this.props.children
  }
}
