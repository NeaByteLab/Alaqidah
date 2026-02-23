import React from 'react'

/**
 * Floating action button for about.
 * @description Opens about modal.
 * @param props.onClick - Click handler
 * @param props.ariaLabel - Button label and title
 * @returns FAB button element
 */
export function FAB(props: { onClick: () => void; ariaLabel: string }): React.ReactElement {
  const { onClick, ariaLabel } = props
  return (
    <button
      type='button'
      className='floating-about-btn'
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
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
        <circle cx='12' cy='12' r='10' />
        <path d='M12 16v-4M12 8h.01' />
      </svg>
    </button>
  )
}
