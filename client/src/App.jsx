import { useState, useCallback } from 'react'
import axios from 'axios'
import UploadZone from './components/UploadZone.jsx'
import ResultPanel from './components/ResultPanel.jsx'
import './App.css'

const CATEGORIES = [
  { value: 'upper_body', label: 'Top / Shirt / Jacket' },
  { value: 'lower_body', label: 'Pants / Skirt' },
  { value: 'dresses', label: 'Dress / Full outfit' }
]

export default function App() {
  const [personFile, setPersonFile] = useState(null)
  const [garmentFile, setGarmentFile] = useState(null)
  const [personPreview, setPersonPreview] = useState(null)
  const [garmentPreview, setGarmentPreview] = useState(null)
  const [resultUrl, setResultUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('upper_body')
  const [garmentDesc, setGarmentDesc] = useState('')

  const handleFileSelect = useCallback((slot, file) => {
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    if (slot === 'person') {
      if (personPreview) URL.revokeObjectURL(personPreview)
      setPersonFile(file)
      setPersonPreview(objectUrl)
    } else {
      if (garmentPreview) URL.revokeObjectURL(garmentPreview)
      setGarmentFile(file)
      setGarmentPreview(objectUrl)
    }
    setResultUrl(null)
    setError(null)
  }, [personPreview, garmentPreview])

  const handleTryOn = async () => {
    if (!personFile || !garmentFile) return
    setLoading(true)
    setError(null)
    setResultUrl(null)

    try {
      const formData = new FormData()
      formData.append('person', personFile)
      formData.append('garment', garmentFile)
      formData.append('category', category)
      formData.append('garmentDesc', garmentDesc || 'clothing item')

      const response = await axios.post('/api/blend', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
        timeout: 120000
      })

      const blobUrl = URL.createObjectURL(response.data)
      setResultUrl(blobUrl)
    } catch (err) {
      let msg
      if (err.response?.data instanceof Blob) {
        const text = await err.response.data.text()
        try { msg = JSON.parse(text).details || JSON.parse(text).error } catch { msg = text }
      } else {
        msg = err.response?.data?.details || err.message || 'Something went wrong.'
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (personPreview) URL.revokeObjectURL(personPreview)
    if (garmentPreview) URL.revokeObjectURL(garmentPreview)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setPersonFile(null)
    setGarmentFile(null)
    setPersonPreview(null)
    setGarmentPreview(null)
    setResultUrl(null)
    setError(null)
    setGarmentDesc('')
    setCategory('upper_body')
  }

  const canTryOn = personFile && garmentFile && !loading

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="3" y="6" width="26" height="22" rx="3" fill="#7c3aed" opacity="0.85" />
                <circle cx="16" cy="13" r="4" fill="#fff" opacity="0.9" />
                <path d="M8 28c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#fff" opacity="0.7" />
                <path d="M22 8l4-2v8l-4-2" fill="#4f46e5" opacity="0.85" />
              </svg>
            </span>
            <span className="logo-text">TryOn <span className="logo-ai">AI</span></span>
          </div>
          <p className="tagline">Try any outfit on yourself — powered by AI</p>
        </div>
      </header>

      {/* Main content */}
      <main className="main">
        <div className="container">

          {/* Instructions */}
          <div className="instructions">
            <div className="step">
              <span className="step-num">1</span>
              <span>Upload <strong>your photo</strong></span>
            </div>
            <div className="step-divider" aria-hidden="true">→</div>
            <div className="step">
              <span className="step-num">2</span>
              <span>Upload the <strong>clothing</strong> to try</span>
            </div>
            <div className="step-divider" aria-hidden="true">→</div>
            <div className="step">
              <span className="step-num">3</span>
              <span>Click <strong>Try It On</strong></span>
            </div>
          </div>

          {/* Upload zones */}
          <div className="upload-grid">
            <UploadZone
              label="Your Photo"
              sublabel="Full or half-body photo"
              slot="person"
              onFileSelect={(file) => handleFileSelect('person', file)}
              preview={personPreview}
              accentColor="var(--accent)"
              icon={
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="15" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
            />
            <div className="upload-blend-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M7 14h14M17 8l6 6-6 6" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <UploadZone
              label="Clothing Item"
              sublabel="Shirt, dress, pants..."
              slot="garment"
              onFileSelect={(file) => handleFileSelect('garment', file)}
              preview={garmentPreview}
              accentColor="#4f46e5"
              icon={
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M12 6l-8 6 4 2v18h24V14l4-2-8-6-4 4h-8l-4-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M16 6v6h8V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
            />
          </div>

          {/* Category selector */}
          <div className="options-row">
            <div className="option-group">
              <label className="option-label">Category</label>
              <div className="category-pills">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    className={`pill ${category === cat.value ? 'pill--active' : ''}`}
                    onClick={() => setCategory(cat.value)}
                    type="button"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="option-group">
              <label className="option-label" htmlFor="garment-desc">
                Description <span className="option-hint">(optional)</span>
              </label>
              <input
                id="garment-desc"
                type="text"
                className="garment-input"
                placeholder="e.g. blue cotton dress"
                value={garmentDesc}
                onChange={(e) => setGarmentDesc(e.target.value)}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="error-banner" role="alert">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>{error}</span>
              <button className="error-close" onClick={() => setError(null)} aria-label="Dismiss error">×</button>
            </div>
          )}

          {/* Action buttons */}
          <div className="actions">
            <button
              className="btn btn-blend"
              onClick={handleTryOn}
              disabled={!canTryOn}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Generating…
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" fill="currentColor" opacity="0.15" />
                    <path d="M6 10c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                  </svg>
                  Try It On
                </>
              )}
            </button>

            {(personFile || garmentFile || resultUrl) && !loading && (
              <button className="btn btn-reset" onClick={handleReset}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M3 9a6 6 0 1 0 1.5-3.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M3 4.5V9h4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Start Over
              </button>
            )}
          </div>

          {/* Loading message */}
          {loading && (
            <div className="loading-message" role="status" aria-live="polite">
              <div className="loading-dots" aria-hidden="true">
                <span /><span /><span />
              </div>
              <div className="loading-steps">
                <p>1. Resizing your photo to optimal ratio...</p>
                <p>2. Removing garment background...</p>
                <p>3. Running AI virtual try-on...</p>
              </div>
              <p className="loading-hint">This takes 30-45 seconds total</p>
            </div>
          )}

          {/* Result */}
          {resultUrl && !loading && (
            <ResultPanel imageUrl={resultUrl} originalUrl={personPreview} />
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>TryOn AI &mdash; Virtual fitting room powered by IDM-VTON</p>
      </footer>
    </div>
  )
}
