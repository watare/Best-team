import { useRef, useEffect } from 'react'
import './ResultPanel.css'

export default function ResultPanel({ imageUrl, originalUrl }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [imageUrl])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `tryon-result-${Date.now()}.jpg`
    link.click()
  }

  return (
    <section className="result-panel" ref={panelRef} aria-label="Try-on result">
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
            <h2 className="result-card__title">Try-On Complete</h2>
          </div>
          <p className="result-card__subtitle">Your virtual fitting result is ready</p>
        </div>

        <div className="result-card__comparison">
          {originalUrl && (
            <div className="result-card__compare-col">
              <span className="result-card__compare-label">Before</span>
              <img src={originalUrl} alt="Original photo" className="result-card__image" />
            </div>
          )}
          <div className="result-card__compare-col">
            {originalUrl && <span className="result-card__compare-label result-card__compare-label--after">After</span>}
            <div className="result-card__image-wrap">
              <img src={imageUrl} alt="Virtual try-on result" className="result-card__image" />
              <div className="result-card__image-glow" aria-hidden="true" />
            </div>
          </div>
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
