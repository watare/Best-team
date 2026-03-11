import { useRef, useEffect } from 'react'
import './ResultPanel.css'

export default function ResultPanel({ imageUrl }) {
  const panelRef = useRef(null)

  // Scroll the result into view smoothly when it appears
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [imageUrl])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `faceblend-result-${Date.now()}.jpg`
    link.click()
  }

  return (
    <section className="result-panel" ref={panelRef} aria-label="Blend result">
      {/* Divider */}
      <div className="result-divider" aria-hidden="true">
        <span className="result-divider__line" />
        <span className="result-divider__badge">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 1l1.8 3.6L14 5.6l-3 2.9.7 4.1L8 10.5l-3.7 2.1.7-4.1L2 5.6l4.2-.9L8 1z" fill="currentColor" />
          </svg>
          Result
        </span>
        <span className="result-divider__line" />
      </div>

      {/* Card */}
      <div className="result-card">
        <div className="result-card__header">
          <div className="result-card__title-row">
            <span className="result-card__success-dot" aria-hidden="true" />
            <h2 className="result-card__title">Blend Complete</h2>
          </div>
          <p className="result-card__subtitle">Your face-blended image is ready to download</p>
        </div>

        <div className="result-card__image-wrap">
          <img
            src={imageUrl}
            alt="Face blend result"
            className="result-card__image"
          />
          <div className="result-card__image-glow" aria-hidden="true" />
        </div>

        <div className="result-card__actions">
          <button className="btn-download" onClick={handleDownload}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 2v11M6 9l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 18h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            </svg>
            Download Result
          </button>
        </div>
      </div>
    </section>
  )
}
