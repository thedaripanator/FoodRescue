import { useRef, useState } from 'react'

export default function ImageUploader({ onFile, label = 'Upload Food Image' }) {
  const [preview, setPreview] = useState(null)
  const [drag, setDrag] = useState(false)
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setPreview(URL.createObjectURL(file))
    onFile(file)
  }

  const handleChange = (e) => handleFile(e.target.files[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div>
      <div
        id="image-upload-zone"
        className={`image-upload-zone ${drag ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        {!preview ? (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '12px', opacity: 0.5 }}>📷</div>
            <div style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>{label}</div>
            <div className="text-xs text-muted" style={{ marginTop: 6 }}>
              Drag & drop or click to browse
            </div>
            <div className="text-xs text-muted">JPG, PNG, WEBP supported</div>
          </>
        ) : (
          <div onClick={(e) => e.stopPropagation()}>
            <img src={preview} alt="Preview" className="image-preview" />
            <button
              id="change-image-btn"
              className="btn btn-ghost btn-sm"
              style={{ marginTop: 12 }}
              onClick={() => { setPreview(null); inputRef.current?.click() }}
            >
              Change Image
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
