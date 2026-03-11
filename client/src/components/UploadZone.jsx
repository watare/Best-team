import { useRef, useState, useCallback } from 'react'
import './UploadZone.css'

export default function UploadZone({ label, sublabel, slot, onFileSelect, preview, icon, accentColor }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const processFile = useCallback((file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WebP, etc.)')
      return
    }
    onFileSelect(file)
  }, [onFileSelect])

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      inputRef.current?.click()
    }
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    // Reset so the same file can be re-selected
    e.target.value = ''
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setDragging(true)
  }

  const handleDragLeave = (e) => {
    // Only clear if leaving the zone itself (not a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragging(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div
      className={`upload-zone ${dragging ? 'upload-zone--dragging' : ''} ${preview ? 'upload-zone--filled' : ''}`}
      style={{ '--zone-accent': accentColor }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      aria-label={`${label}: ${preview ? 'Image selected. Click to change.' : 'Click or drag to upload an image.'}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="upload-zone__input"
        tabIndex={-1}
        aria-hidden="true"
      />

      {preview ? (
        <div className="upload-zone__preview-wrap">
          <img
            src={preview}
            alt={`${label} preview`}
            className="upload-zone__preview-img"
          />
          <div className="upload-zone__preview-overlay">
            <span className="upload-zone__change-btn">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3 15h12M9 3l4 4-8 8H1v-4L9 3z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Change Image
            </span>
          </div>
          <div className="upload-zone__badge">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="6" fill="currentColor" opacity="0.15" />
              <path d="M4 7l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Ready
          </div>
        </div>
      ) : (
        <div className="upload-zone__empty">
          <div className="upload-zone__icon">
            {icon}
          </div>
          <p className="upload-zone__label">{label}</p>
          {sublabel && <p className="upload-zone__sublabel">{sublabel}</p>}
          <div className="upload-zone__hint">
            <span className="upload-zone__hint-primary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1v10M4 5l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                <path d="M2 15h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
              </svg>
              Drag &amp; drop or <strong>click to browse</strong>
            </span>
            <span className="upload-zone__hint-secondary">JPEG, PNG, WebP supported</span>
          </div>
        </div>
      )}

      {dragging && (
        <div className="upload-zone__drop-indicator" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 8v16M12 16l8-8 8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 30h24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <p>Drop to upload</p>
        </div>
      )}
    </div>
  )
}
