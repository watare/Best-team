import { useState, useCallback } from 'react'
import axios from 'axios'
import UploadZone from './components/UploadZone.jsx'
import ResultPanel from './components/ResultPanel.jsx'
import './App.css'

export default function App() {
  const [sourceFile, setSourceFile] = useState(null)
  const [targetFile, setTargetFile] = useState(null)
  const [sourcePreview, setSourcePreview] = useState(null)
  const [targetPreview, setTargetPreview] = useState(null)
  const [resultUrl, setResultUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileSelect = useCallback((slot, file) => {
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    if (slot === 'source') {
      if (sourcePreview) URL.revokeObjectURL(sourcePreview)
      setSourceFile(file)
      setSourcePreview(objectUrl)
    } else {
      if (targetPreview) URL.revokeObjectURL(targetPreview)
      setTargetFile(file)
      setTargetPreview(objectUrl)
    }
    setResultUrl(null)
    setError(null)
  }, [sourcePreview, targetPreview])

  const handleBlend = async () => {
    if (!sourceFile || !targetFile) return
    setLoading(true)
    setError(null)
    setResultUrl(null)

    try {
      const formData = new FormData()
      formData.append('source', sourceFile)
      formData.append('target', targetFile)

      const response = await axios.post('/api/blend', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      })

      const blobUrl = URL.createObjectURL(response.data)
      setResultUrl(blobUrl)
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (sourcePreview) URL.revokeObjectURL(sourcePreview)
    if (targetPreview) URL.revokeObjectURL(targetPreview)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setSourceFile(null)
    setTargetFile(null)
    setSourcePreview(null)
    setTargetPreview(null)
    setResultUrl(null)
    setError(null)
  }

  const canBlend = sourceFile && targetFile && !loading

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="10" cy="16" r="9" fill="#7c3aed" opacity="0.85" />
                <circle cx="22" cy="16" r="9" fill="#4f46e5" opacity="0.85" />
                <ellipse cx="16" cy="16" rx="5" ry="9" fill="#9d5ff5" opacity="0.9" />
              </svg>
            </span>
            <span className="logo-text">FaceBlend <span className="logo-ai">AI</span></span>
          </div>
          <p className="tagline">Seamlessly merge and swap faces with AI precision</p>
        </div>
      </header>

      {/* Main content */}
      <main className="main">
        <div className="container">

          {/* Instructions */}
          <div className="instructions">
            <div className="step">
              <span className="step-num">1</span>
              <span>Upload a <strong>Face Source</strong> — the face to transplant</span>
            </div>
            <div className="step-divider" aria-hidden="true">→</div>
            <div className="step">
              <span className="step-num">2</span>
              <span>Upload a <strong>Face Target</strong> — the body/background image</span>
            </div>
            <div className="step-divider" aria-hidden="true">→</div>
            <div className="step">
              <span className="step-num">3</span>
              <span>Click <strong>Blend Faces</strong> and let AI do the magic</span>
            </div>
          </div>

          {/* Upload zones */}
          <div className="upload-grid">
            <UploadZone
              label="Face Source"
              sublabel="The face to transplant"
              slot="source"
              onFileSelect={(file) => handleFileSelect('source', file)}
              preview={sourcePreview}
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
                <path d="M4 14h20M17 7l7 7-7 7" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <UploadZone
              label="Face Target"
              sublabel="The body / background"
              slot="target"
              onFileSelect={(file) => handleFileSelect('target', file)}
              preview={targetPreview}
              accentColor="#4f46e5"
              icon={
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="4" y="8" width="32" height="26" rx="3" stroke="currentColor" strokeWidth="2" />
                  <circle cx="14" cy="18" r="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 30l8-6 6 5 6-4 8 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
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
              onClick={handleBlend}
              disabled={!canBlend}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Processing…
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" fill="currentColor" opacity="0.15" />
                    <path d="M6 10c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                  </svg>
                  Blend Faces
                </>
              )}
            </button>

            {(sourceFile || targetFile || resultUrl) && !loading && (
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
              <p>Blending faces — this may take a few seconds…</p>
            </div>
          )}

          {/* Result */}
          {resultUrl && !loading && (
            <ResultPanel imageUrl={resultUrl} />
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>FaceBlend AI &mdash; Powered by AI face-swap technology</p>
      </footer>
    </div>
  )
}
