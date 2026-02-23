import React, { useCallback, useEffect, useRef, useState } from 'react'
import type * as Types from '@app/Types.ts'

/** Canvas layout and style constants. */
const configCanvas = {
  accentWidth: 5,
  bracketInset: 8,
  bracketInsetBottomLeft: 24,
  bracketLineWidth: 2,
  bracketOpacity: 0.22,
  bracketSize: 16,
  borderWidth: 1,
  canvasWidth: 900,
  colorAccent: '#2d8b6f',
  colorDark: {
    card: '#2c2c2e',
    text: '#e8e6e3',
    textSoft: '#98989a',
    border: '#3a3a3c'
  },
  colorLight: {
    card: '#fdfcfa',
    text: '#2c261f',
    textSoft: '#5a5348',
    border: '#d4cfc4'
  },
  contentOffsetAfterLabel: 8,
  explanationFont: '16px "Noto Sans", sans-serif',
  exportPngQuality: 0.92,
  exportScale: 2,
  fontSizeExplanation: 16,
  fontSizeQuote: 16,
  fontSizeTitle: 20,
  labelFont: '700 13px "Noto Sans", sans-serif',
  labelGap: 8,
  labelHeight: 16,
  labelLeftBorderWidth: 3,
  labelPaddingLeft: 8,
  lineBreakReplacement: ' ',
  lineHeightExplanation: 1.72,
  lineHeightQuote: 1.72,
  maxHeight: 1800,
  padding: 32,
  previewContainerMaxHeight: '60vh',
  previewHeight: 200,
  quoteFont: 'italic 16px "Noto Sans", sans-serif',
  quoteIndent: 36,
  quoteMarkFont: '600 36px "Noto Sans", sans-serif',
  quoteMarkOffset: 2,
  quoteMarkOpacity: 0.4,
  radius: 6,
  sectionGap: 20,
  shadowBlur: 8,
  shadowColor: 'rgba(0, 0, 0, 0.06)',
  shadowOffsetY: 2,
  titleBottomGap: 20,
  titleFont: '600 20px "Noto Sans", sans-serif',
  titleLineHeight: 1.3
} as const
/** Max content line width in pixels. */
const maxLineWidth = configCanvas.canvasWidth - configCanvas.padding * 2
/** Max quote text width in px. */
const quoteMaxWidth = maxLineWidth - configCanvas.quoteIndent

/**
 * Slug from text for filename.
 * @param sourceText - Input string to slugify
 * @returns Lowercase hyphenated slug
 */
function slugify(sourceText: string): string {
  return (
    sourceText
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'quote'
  )
}

/**
 * Wraps text to lines by max width.
 * @param canvasContext - Context for measureText
 * @param sourceText - Text to wrap
 * @param maxWidth - Max line width in px
 * @param fontSpec - Font set on context
 * @returns Array of wrapped lines
 */
function wrapText(
  canvasContext: CanvasRenderingContext2D,
  sourceText: string,
  maxWidth: number,
  fontSpec: string
): string[] {
  canvasContext.font = fontSpec
  const wrappedLines: string[] = []
  const paragraphList = sourceText.split(/\n+/)
  for (const textParagraph of paragraphList) {
    const wordList = textParagraph.trim().split(/\s+/).filter(Boolean)
    let currentLine = ''
    for (const currentWord of wordList) {
      const nextLine = currentLine ? currentLine + ' ' + currentWord : currentWord
      const textMetrics = canvasContext.measureText(nextLine)
      if (textMetrics.width <= maxWidth) {
        currentLine = nextLine
      } else {
        if (currentLine) {
          wrappedLines.push(currentLine)
        }
        currentLine = currentWord
      }
    }
    if (currentLine) {
      wrappedLines.push(currentLine)
    }
  }
  return wrappedLines
}

/**
 * Draws share card on canvas.
 * @param canvasContext - Target 2D context
 * @param drawOptions - Quote, labels, theme, scale
 * @returns Total drawn height in px
 */
function drawCard(
  canvasContext: CanvasRenderingContext2D,
  drawOptions: {
    quoteText: string
    includeExplanation: boolean
    explanationText: string
    pointLabel: string
    labelQuote: string
    labelExplanation: string
    isDark: boolean
    scale?: number
  }
): number {
  const {
    quoteText,
    includeExplanation,
    explanationText,
    pointLabel,
    labelQuote,
    labelExplanation,
    isDark
  } = drawOptions
  const scaleFactor = drawOptions.scale ?? 1
  const canvasConfig = configCanvas
  const normalizeLineBreaks = (sourceText: string) =>
    sourceText.replace(/\s*<br\s*\/?>\s*/gi, canvasConfig.lineBreakReplacement)
  const normalizedQuote = normalizeLineBreaks(quoteText)
  const normalizedExplanation = normalizeLineBreaks(explanationText)
  const themeColors = isDark ? canvasConfig.colorDark : canvasConfig.colorLight
  const lineHeightQuotePixels = canvasConfig.fontSizeQuote * canvasConfig.lineHeightQuote
  const lineHeightExplanationPixels = canvasConfig.fontSizeExplanation *
    canvasConfig.lineHeightExplanation
  const titleHeight = canvasConfig.fontSizeTitle * canvasConfig.titleLineHeight
  const quoteLines = wrapText(canvasContext, normalizedQuote, quoteMaxWidth, canvasConfig.quoteFont)
  let explanationLines: string[] = []
  if (includeExplanation && normalizedExplanation.trim()) {
    explanationLines = wrapText(
      canvasContext,
      normalizedExplanation.trim(),
      quoteMaxWidth,
      canvasConfig.explanationFont
    )
  }
  const quoteLabelBlock = canvasConfig.labelHeight + canvasConfig.labelGap
  const explanationLabelBlock = explanationLines.length > 0
    ? canvasConfig.labelGap + canvasConfig.labelHeight + canvasConfig.labelGap
    : 0
  const titleBlock = canvasConfig.padding + titleHeight + canvasConfig.titleBottomGap
  const quoteBlock = quoteLabelBlock +
    canvasConfig.contentOffsetAfterLabel +
    quoteLines.length * lineHeightQuotePixels
  const explanationBlock = explanationLines.length > 0
    ? explanationLabelBlock +
      canvasConfig.contentOffsetAfterLabel +
      explanationLines.length * lineHeightExplanationPixels
    : 0
  const totalHeight = Math.min(
    titleBlock + quoteBlock + explanationBlock + canvasConfig.padding,
    canvasConfig.maxHeight
  )
  const canvasElement = canvasContext.canvas
  const cardWidth = canvasConfig.canvasWidth
  const cardHeight = totalHeight
  canvasElement.width = cardWidth * scaleFactor
  canvasElement.height = cardHeight * scaleFactor
  if (scaleFactor !== 1) {
    canvasContext.scale(scaleFactor, scaleFactor)
  }
  canvasContext.save()
  canvasContext.shadowColor = canvasConfig.shadowColor
  canvasContext.shadowBlur = canvasConfig.shadowBlur
  canvasContext.shadowOffsetY = canvasConfig.shadowOffsetY
  canvasContext.beginPath()
  canvasContext.moveTo(canvasConfig.accentWidth, 0)
  canvasContext.lineTo(cardWidth - canvasConfig.radius, 0)
  canvasContext.quadraticCurveTo(cardWidth, 0, cardWidth, canvasConfig.radius)
  canvasContext.lineTo(cardWidth, cardHeight - canvasConfig.radius)
  canvasContext.quadraticCurveTo(cardWidth, cardHeight, cardWidth - canvasConfig.radius, cardHeight)
  canvasContext.lineTo(canvasConfig.accentWidth, cardHeight)
  canvasContext.closePath()
  canvasContext.fillStyle = themeColors.card
  canvasContext.fill()
  canvasContext.restore()
  canvasContext.fillStyle = canvasConfig.colorAccent
  canvasContext.fillRect(0, 0, canvasConfig.accentWidth, cardHeight)
  canvasContext.strokeStyle = themeColors.border
  canvasContext.lineWidth = canvasConfig.borderWidth
  canvasContext.beginPath()
  canvasContext.moveTo(canvasConfig.accentWidth, 0)
  canvasContext.lineTo(cardWidth - canvasConfig.radius, 0)
  canvasContext.quadraticCurveTo(cardWidth, 0, cardWidth, canvasConfig.radius)
  canvasContext.lineTo(cardWidth, cardHeight - canvasConfig.radius)
  canvasContext.quadraticCurveTo(cardWidth, cardHeight, cardWidth - canvasConfig.radius, cardHeight)
  canvasContext.lineTo(canvasConfig.accentWidth, cardHeight)
  canvasContext.closePath()
  canvasContext.stroke()
  canvasContext.save()
  canvasContext.globalAlpha = canvasConfig.quoteMarkOpacity
  canvasContext.fillStyle = canvasConfig.colorAccent
  canvasContext.font = canvasConfig.quoteMarkFont
  canvasContext.textBaseline = 'top'
  canvasContext.fillText(
    '"',
    canvasConfig.padding + canvasConfig.quoteMarkOffset,
    canvasConfig.padding + canvasConfig.quoteMarkOffset
  )
  canvasContext.restore()
  canvasContext.save()
  canvasContext.strokeStyle = canvasConfig.colorAccent
  canvasContext.lineWidth = canvasConfig.bracketLineWidth
  canvasContext.globalAlpha = canvasConfig.bracketOpacity
  canvasContext.beginPath()
  canvasContext.moveTo(
    cardWidth - canvasConfig.bracketInset - canvasConfig.bracketSize,
    canvasConfig.bracketInset
  )
  canvasContext.lineTo(cardWidth - canvasConfig.bracketInset, canvasConfig.bracketInset)
  canvasContext.lineTo(
    cardWidth - canvasConfig.bracketInset,
    canvasConfig.bracketInset + canvasConfig.bracketSize
  )
  canvasContext.stroke()
  canvasContext.beginPath()
  canvasContext.moveTo(
    canvasConfig.bracketInsetBottomLeft,
    cardHeight - canvasConfig.bracketInset - canvasConfig.bracketSize
  )
  canvasContext.lineTo(canvasConfig.bracketInsetBottomLeft, cardHeight - canvasConfig.bracketInset)
  canvasContext.lineTo(
    canvasConfig.bracketInsetBottomLeft + canvasConfig.bracketSize,
    cardHeight - canvasConfig.bracketInset
  )
  canvasContext.stroke()
  canvasContext.restore()
  canvasContext.fillStyle = themeColors.text
  canvasContext.font = canvasConfig.titleFont
  canvasContext.textBaseline = 'top'
  canvasContext.textAlign = 'center'
  const titleTop = canvasConfig.padding
  canvasContext.fillText(pointLabel, cardWidth / 2, titleTop, maxLineWidth)
  canvasContext.textAlign = 'left'
  const contentLeft = canvasConfig.padding + canvasConfig.accentWidth
  const labelTextLeft = contentLeft + canvasConfig.labelLeftBorderWidth +
    canvasConfig.labelPaddingLeft
  let currentY = canvasConfig.padding + titleHeight + canvasConfig.titleBottomGap
  canvasContext.font = canvasConfig.labelFont
  canvasContext.fillStyle = canvasConfig.colorAccent
  canvasContext.fillRect(
    contentLeft,
    currentY,
    canvasConfig.labelLeftBorderWidth,
    canvasConfig.labelHeight
  )
  canvasContext.textBaseline = 'middle'
  canvasContext.fillText(
    labelQuote,
    labelTextLeft,
    currentY + canvasConfig.labelHeight / 2,
    maxLineWidth - canvasConfig.accentWidth
  )
  canvasContext.textBaseline = 'top'
  currentY += quoteLabelBlock + canvasConfig.contentOffsetAfterLabel
  canvasContext.font = canvasConfig.quoteFont
  canvasContext.fillStyle = themeColors.text
  for (const quoteLine of quoteLines) {
    canvasContext.fillText(
      quoteLine,
      canvasConfig.padding + canvasConfig.quoteIndent,
      currentY,
      quoteMaxWidth
    )
    currentY += lineHeightQuotePixels
  }
  if (explanationLines.length > 0) {
    currentY += canvasConfig.sectionGap
    canvasContext.font = canvasConfig.labelFont
    canvasContext.fillStyle = canvasConfig.colorAccent
    canvasContext.fillRect(
      contentLeft,
      currentY,
      canvasConfig.labelLeftBorderWidth,
      canvasConfig.labelHeight
    )
    canvasContext.textBaseline = 'middle'
    canvasContext.fillText(
      labelExplanation,
      labelTextLeft,
      currentY + canvasConfig.labelHeight / 2,
      maxLineWidth - canvasConfig.accentWidth
    )
    canvasContext.textBaseline = 'top'
    currentY += canvasConfig.labelHeight + canvasConfig.labelGap +
      canvasConfig.contentOffsetAfterLabel
    canvasContext.font = canvasConfig.explanationFont
    canvasContext.fillStyle = themeColors.text
    for (const explanationLine of explanationLines) {
      canvasContext.fillText(
        explanationLine,
        canvasConfig.padding + canvasConfig.quoteIndent,
        currentY,
        quoteMaxWidth
      )
      currentY += lineHeightExplanationPixels
    }
  }
  return currentY + canvasConfig.padding
}

/**
 * Share modal with canvas export.
 * @description Quote only or with explanation; export PNG.
 * @param props.detail - Quote entry or null
 * @param props.themeMode - Theme for canvas colors
 * @param props.translations - Share UI strings
 * @param props.onClose - Close handler
 * @returns Modal element or null
 */
export function Share(props: {
  detail: Types.QuoteEntry | null
  themeMode: Types.ThemeMode
  translations: Pick<
    Types.I18nEntry,
    | 'shareModalTitle'
    | 'shareModalAria'
    | 'shareContentPrompt'
    | 'shareQuoteOnly'
    | 'shareQuoteAndExplanation'
    | 'shareSaveAsImage'
    | 'shareSaving'
    | 'shareLabelQuote'
    | 'shareLabelExplanation'
    | 'sharePointLabel'
  >
  onClose: () => void
}): React.ReactElement | null {
  const { detail: quoteDetail, themeMode, translations, onClose } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const initialIncludeExplanation = false
  const initialIsSharing = false
  const [includeExplanation, setIncludeExplanation] = useState(initialIncludeExplanation)
  const [isSharing, setIsSharing] = useState(initialIsSharing)

  useEffect(() => {
    if (!quoteDetail || !canvasRef.current) {
      return
    }
    const previewContext = canvasRef.current.getContext('2d')
    if (!previewContext) {
      return
    }
    drawCard(previewContext, {
      quoteText: quoteDetail.text,
      includeExplanation,
      explanationText: quoteDetail.explanation,
      pointLabel: quoteDetail.title || `${translations.sharePointLabel} ${quoteDetail.no}`,
      labelQuote: translations.shareLabelQuote,
      labelExplanation: translations.shareLabelExplanation,
      isDark: themeMode === 'dark'
    })
  }, [quoteDetail, includeExplanation, themeMode, translations])

  /**
   * Returns PNG blob of share card.
   * @param shouldIncludeExplanation - Include explanation in image.
   * @returns Promise resolving to PNG Blob.
   */
  const exportToBlob = useCallback(
    (shouldIncludeExplanation: boolean): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const exportCanvas = document.createElement('canvas')
        const exportContext = exportCanvas.getContext('2d')
        if (!exportContext || !quoteDetail) {
          reject(new Error('Canvas or detail missing'))
          return
        }
        drawCard(exportContext, {
          quoteText: quoteDetail.text,
          includeExplanation: shouldIncludeExplanation,
          explanationText: quoteDetail.explanation,
          pointLabel: quoteDetail.title || `${translations.sharePointLabel} ${quoteDetail.no}`,
          labelQuote: translations.shareLabelQuote,
          labelExplanation: translations.shareLabelExplanation,
          isDark: themeMode === 'dark',
          scale: configCanvas.exportScale
        })
        exportCanvas.toBlob(
          (exportBlob) => (exportBlob ? resolve(exportBlob) : reject(new Error('Export failed'))),
          'image/png',
          configCanvas.exportPngQuality
        )
      })
    },
    [quoteDetail, themeMode, translations]
  )

  /**
   * Shares or downloads card as image.
   * @returns Promise when done.
   */
  const handleShareAsImage = useCallback(async () => {
    if (!quoteDetail) {
      return
    }
    const isSharingActive = true
    setIsSharing(isSharingActive)
    try {
      const exportBlob = await exportToBlob(includeExplanation)
      const titleSlug = slugify(quoteDetail.title?.trim() || `title-${quoteDetail.no}`)
      const exportFilename = `alaqidah-${titleSlug}.png`
      const shareFile = new File([exportBlob], exportFilename, { type: 'image/png' })
      if (navigator.share && navigator.canShare?.({ files: [shareFile] })) {
        await navigator.share({ files: [shareFile] })
        onClose()
      } else {
        const downloadUrl = URL.createObjectURL(exportBlob)
        const downloadAnchor = document.createElement('a')
        downloadAnchor.href = downloadUrl
        downloadAnchor.download = exportFilename
        downloadAnchor.click()
        URL.revokeObjectURL(downloadUrl)
      }
    } catch {
      // ignore
    } finally {
      const isNotSharingActive = false
      setIsSharing(isNotSharingActive)
    }
  }, [quoteDetail, includeExplanation, exportToBlob, onClose])
  if (!quoteDetail) {
    return null
  }

  return (
    <div
      className='about-modal-overlay'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-label={translations.shareModalAria}
    >
      <div className='preview-modal-content' onClick={(clickEvent) => clickEvent.stopPropagation()}>
        <div className='preview-modal-header'>
          <h2 className='preview-modal-main-title'>{translations.shareModalTitle}</h2>
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
          <p className='preview-modal-text'>{translations.shareContentPrompt}</p>
          <div className='preview-modal-radio'>
            <label>
              <input
                type='radio'
                name='share-content'
                checked={!includeExplanation}
                onChange={() => {
                  const quoteOnly = false
                  setIncludeExplanation(quoteOnly)
                }}
              />
              <span>{translations.shareQuoteOnly}</span>
            </label>
            <label>
              <input
                type='radio'
                name='share-content'
                checked={includeExplanation}
                onChange={() => {
                  const quoteWithExplanation = true
                  setIncludeExplanation(quoteWithExplanation)
                }}
              />
              <span>{translations.shareQuoteAndExplanation}</span>
            </label>
          </div>
          <div style={{ overflow: 'auto', maxHeight: configCanvas.previewContainerMaxHeight }}>
            <canvas
              ref={canvasRef}
              width={configCanvas.canvasWidth}
              height={configCanvas.previewHeight}
              style={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)'
              }}
              aria-hidden
            />
          </div>
          <button
            type='button'
            className='preview-modal-cta'
            onClick={handleShareAsImage}
            disabled={isSharing}
          >
            {isSharing ? translations.shareSaving : translations.shareSaveAsImage}
          </button>
        </div>
      </div>
    </div>
  )
}
