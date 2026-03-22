import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Leaf, Zap, Microscope, CloudUpload, FlaskConical,
  RefreshCw, FileImage, XCircle, Code, ChevronDown,
  Activity, Copy, Check, Wifi, WifiOff, Loader
} from 'lucide-react'
import './App.css'

const API_BASE = 'https://node-js-potato-be-e7k2.vercel.app'

const DISEASE_CONFIG = {
  Healthy: {
    color: '#4ade80',
    glow: 'rgba(74, 222, 128, 0.35)',
    bg: 'rgba(74, 222, 128, 0.07)',
    border: 'rgba(74, 222, 128, 0.3)',
    severity: 'safe',
    emoji: '🌿',
    label: 'Daun Sehat',
    desc: 'Tanaman kentang dalam kondisi optimal. Tidak ditemukan indikasi penyakit pada daun.',
    action: 'Pertahankan kondisi perawatan saat ini.',
  },
  'Early Blight': {
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.35)',
    bg: 'rgba(251, 191, 36, 0.07)',
    border: 'rgba(251, 191, 36, 0.3)',
    severity: 'warning',
    emoji: '⚠️',
    label: 'Bercak Daun Awal',
    desc: 'Disebabkan oleh jamur Alternaria solani. Muncul bercak coklat gelap berbentuk target pada daun.',
    action: 'Gunakan fungisida berbasis tembaga. Buang daun yang terinfeksi segera.',
  },
  'Late Blight': {
    color: '#f87171',
    glow: 'rgba(248, 113, 113, 0.35)',
    bg: 'rgba(248, 113, 113, 0.07)',
    border: 'rgba(248, 113, 113, 0.3)',
    severity: 'danger',
    emoji: '🚨',
    label: 'Busuk Daun',
    desc: 'Disebabkan oleh Phytophthora infestans. Penyakit paling destruktif pada kentang, menyebar sangat cepat.',
    action: 'Tindakan darurat diperlukan. Isolasi tanaman dan gunakan fungisida sistemik.',
  },
}

const CODE_TABS = [
  {
    label: 'cURL',
    lang: 'bash',
    code: `curl -X POST ${API_BASE}/predict \\
  -F "image=@/path/to/daun.jpg"`,
  },
  {
    label: 'JavaScript',
    lang: 'js',
    code: `const formData = new FormData();
formData.append('image', fileInput.files[0]);

const res = await fetch('${API_BASE}/predict', {
  method: 'POST',
  body: formData,
});

const data = await res.json();
// { class, confidence, all_predictions }`,
  },
  {
    label: 'Python',
    lang: 'python',
    code: `import requests

with open('daun.jpg', 'rb') as f:
    res = requests.post(
        '${API_BASE}/predict',
        files={'image': f}
    )

print(res.json())
# {'class': 'Early Blight', 'confidence': '94.27%', ...}`,
  },
]

/* ─── Sub-components ─── */

function HealthIndicator({ status }) {
  return (
    <div className={`health-indicator status-${status}`}>
      {status === 'online' ? (
        <><Wifi size={13} /><span>API Online</span></>
      ) : status === 'checking' ? (
        <><Loader size={13} className="spin" /><span>Connecting…</span></>
      ) : (
        <><WifiOff size={13} /><span>API Offline</span></>
      )}
    </div>
  )
}

function CodeBlock({ tabs }) {
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(tabs[active].code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="code-block">
      <div className="code-topbar">
        <div className="code-tabs">
          {tabs.map((t, i) => (
            <button
              key={i}
              className={`code-tab ${active === i ? 'active' : ''}`}
              onClick={() => setActive(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button className="copy-btn" onClick={copy}>
          {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
        </button>
      </div>
      <pre className="code-pre">
        <code>{tabs[active].code}</code>
      </pre>
    </div>
  )
}

function ConfidenceBar({ label, value, color, isTop }) {
  const [w, setW] = useState(0)
  const pct = parseFloat(value)

  useEffect(() => {
    const t = setTimeout(() => setW(pct), 120)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div className={`conf-row ${isTop ? 'is-top' : ''}`}>
      <div className="conf-label-wrap">
        <span className="conf-dot" style={{ background: color }} />
        <span className="conf-name">{label}</span>
      </div>
      <div className="conf-track">
        <div
          className="conf-fill"
          style={{ width: `${w}%`, background: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
      <span className="conf-val" style={{ color }}>{value}</span>
    </div>
  )
}

function ScanRings() {
  return (
    <div className="scan-rings" aria-hidden="true">
      <div className="ring r1" />
      <div className="ring r2" />
      <div className="ring r3" />
      <div className="ring r4" />
      <div className="scan-core">
        <Microscope size={52} />
      </div>
      <div className="scan-sweep" />
      <div className="scan-cross">
        <div className="sc-h" /><div className="sc-v" />
      </div>
    </div>
  )
}

/* ─── Main App ─── */

export default function App() {
  const [apiStatus, setApiStatus] = useState('checking')
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [showCode, setShowCode] = useState(false)
  const fileRef = useRef()
  const resultRef = useRef()

  /* Health check */
  useEffect(() => {
    fetch(`${API_BASE}/`)
      .then(r => setApiStatus(r.ok ? 'online' : 'offline'))
      .catch(() => setApiStatus('offline'))
  }, [])

  /* File handler */
  const handleFile = (f) => {
    if (!f) return
    if (!['image/jpeg', 'image/png'].includes(f.type)) {
      setError('Hanya file JPG atau PNG yang didukung.')
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('Ukuran file melebihi batas 5MB.')
      return
    }
    setError(null)
    setResult(null)
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [])

  /* Predict */
  const predict = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await fetch(`${API_BASE}/predict`, { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Gagal memproses gambar.')
      setResult(data)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  const cfg = result ? DISEASE_CONFIG[result.class] : null

  return (
    <div className="app">
      {/* Atmospheric background layers */}
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-glow glow-top" aria-hidden="true" />
      <div className="bg-glow glow-mid" aria-hidden="true" />

      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-mark">
              <Leaf size={18} />
            </div>
            <span className="logo-name">TaterScan</span>
            <span className="logo-tag">v1.0</span>
          </div>
          <nav className="header-nav">
            <HealthIndicator status={apiStatus} />
            <a href="#scan" className="nav-link">Deteksi</a>
            <a href="#docs" className="nav-link">API Docs</a>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-text">
          <div className="hero-eyebrow">
            <Zap size={11} />
            <span>EfficientNet · ONNX Runtime · Vercel Serverless</span>
          </div>
          <h1 className="hero-h1">
            Diagnosis Penyakit<br />
            <em>Daun Kentang</em><br />
            Berbasis AI
          </h1>
          <p className="hero-p">
            Upload foto daun kentang dan dapatkan diagnosis instan dengan
            model deep learning EfficientNet — deteksi tiga kelas penyakit
            secara akurat dalam hitungan detik.
          </p>
          <div className="hero-meta">
            <div className="meta-item">
              <span className="meta-val">3</span>
              <span className="meta-key">Kelas</span>
            </div>
            <div className="meta-sep" />
            <div className="meta-item">
              <span className="meta-val">300×300</span>
              <span className="meta-key">Input</span>
            </div>
            <div className="meta-sep" />
            <div className="meta-item">
              <span className="meta-val">5 MB</span>
              <span className="meta-key">Maks. Ukuran</span>
            </div>
          </div>
          <a href="#scan" className="cta-btn">
            <CloudUpload size={16} />
            Mulai Analisis
          </a>
        </div>
        <div className="hero-visual">
          <ScanRings />
        </div>
      </section>

      {/* ── Disease Classes ── */}
      <section className="diseases-section">
        <div className="section-eyebrow">Kelas yang Dapat Dideteksi</div>
        <div className="disease-grid">
          {Object.entries(DISEASE_CONFIG).map(([key, d]) => (
            <div
              key={key}
              className={`disease-card sev-${d.severity}`}
              style={{ '--dc': d.color, '--dg': d.glow }}
            >
              <div className="dc-emoji">{d.emoji}</div>
              <div className="dc-body">
                <h3 className="dc-name">{key}</h3>
                <p className="dc-label">{d.label}</p>
                <p className="dc-desc">{d.desc}</p>
              </div>
              <div className="dc-glow" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Upload & Results ── */}
      <section className="scan-section" id="scan">
        <div className="section-eyebrow">Analisis Gambar</div>
        <h2 className="section-h2">Upload Foto Daun Kentang</h2>

        <div className="scan-layout">
          {/* Left: upload */}
          <div className="upload-col">
            <div
              className={`dropzone ${dragging ? 'dragging' : ''} ${preview ? 'has-file' : ''}`}
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onClick={() => !preview && fileRef.current?.click()}
            >
              {preview ? (
                <div className="file-preview">
                  <img src={preview} alt="Preview daun" />
                  <div className="preview-overlay">
                    <button className="change-file-btn" onClick={(e) => { e.stopPropagation(); reset() }}>
                      <RefreshCw size={15} /> Ganti Gambar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="dz-idle">
                  <div className="dz-icon-wrap">
                    <CloudUpload size={36} />
                  </div>
                  <p className="dz-title">{dragging ? 'Lepaskan gambar di sini' : 'Drag & Drop gambar'}</p>
                  <p className="dz-sub">atau <span className="dz-browse">klik untuk browse</span></p>
                  <div className="dz-formats">
                    <span>JPG</span><span>PNG</span><span>Max 5 MB</span>
                  </div>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>

            {error && (
              <div className="error-banner">
                <XCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            {file && !loading && (
              <button className="analyze-btn" onClick={predict}>
                <FlaskConical size={17} />
                Analisis Sekarang
              </button>
            )}

            {loading && (
              <button className="analyze-btn loading" disabled>
                <div className="btn-spinner" />
                Menganalisis…
              </button>
            )}
          </div>

          {/* Right: results */}
          <div ref={resultRef} className={`result-col ${result || loading ? 'visible' : ''}`}>
            {loading && (
              <div className="result-loading">
                <div className="pulse-bars">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="pb" style={{ animationDelay: `${i * 0.09}s` }} />
                  ))}
                </div>
                <p className="loading-txt">Model menganalisis gambar…</p>
                <span className="loading-sub">EfficientNet sedang bekerja</span>
              </div>
            )}

            {result && cfg && !loading && (
              <div className="result-card" style={{ '--rc': cfg.color, '--rg': cfg.glow, '--rb': cfg.bg, '--rbr': cfg.border }}>
                <div className="result-header">
                  <div className="result-emoji">{cfg.emoji}</div>
                  <div className="result-meta">
                    <span className="result-class">{result.class}</span>
                    <span className="result-label-txt">{cfg.label}</span>
                  </div>
                  <div className="result-conf-badge">
                    <span className="rcb-val">{result.confidence}</span>
                    <span className="rcb-key">confidence</span>
                  </div>
                </div>

                <p className="result-desc-txt">{cfg.desc}</p>

                <div className="result-action">
                  <Activity size={13} />
                  {cfg.action}
                </div>

                <div className="result-bars">
                  <h4 className="bars-title">Distribusi Prediksi</h4>
                  {Object.entries(result.all_predictions).map(([cls, val]) => (
                    <ConfidenceBar
                      key={cls}
                      label={cls}
                      value={val}
                      color={DISEASE_CONFIG[cls]?.color || '#aaa'}
                      isTop={cls === result.class}
                    />
                  ))}
                </div>

                <button className="new-scan-btn" onClick={reset}>
                  <RefreshCw size={14} /> Scan Baru
                </button>
              </div>
            )}

            {!result && !loading && (
              <div className="result-empty">
                <FileImage size={52} />
                <p>Hasil analisis akan muncul di sini</p>
                <span>Upload gambar daun dan klik Analisis</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── API Documentation ── */}
      <section className="docs-section" id="docs">
        <div className="section-eyebrow">Integrasi API</div>
        <h2 className="section-h2">Dokumentasi Endpoint</h2>

        <div className="base-url-bar">
          <span className="bub-label">Base URL</span>
          <code className="bub-url">{API_BASE}</code>
          <HealthIndicator status={apiStatus} />
        </div>

        <div className="endpoint-list">
          {/* GET / */}
          <div className="endpoint-item">
            <div className="ep-top">
              <span className="ep-method get">GET</span>
              <code className="ep-path">/</code>
              <span className="ep-desc">Health check — cek status server</span>
            </div>
            <div className="ep-body">
              <div className="ep-col">
                <h5>Response 200</h5>
                <pre className="ep-pre">{`{
  "status": "✅ Server berjalan!",
  "message": "Potato Disease Detection API (Node.js + ONNX)"
}`}</pre>
              </div>
            </div>
          </div>

          {/* POST /predict */}
          <div className="endpoint-item">
            <div className="ep-top">
              <span className="ep-method post">POST</span>
              <code className="ep-path">/predict</code>
              <span className="ep-desc">Deteksi penyakit dari foto daun kentang</span>
            </div>
            <div className="ep-body">
              <div className="ep-col">
                <h5>Request — multipart/form-data</h5>
                <table className="ep-table">
                  <thead>
                    <tr><th>Field</th><th>Tipe</th><th>Keterangan</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>image</code></td>
                      <td>file</td>
                      <td>JPG/PNG, maks 5 MB</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="ep-col">
                <h5>Response 200</h5>
                <pre className="ep-pre">{`{
  "class": "Early Blight",
  "confidence": "94.27%",
  "all_predictions": {
    "Early Blight": "94.27%",
    "Late Blight": "4.51%",
    "Healthy": "1.22%"
  }
}`}</pre>
              </div>
            </div>
          </div>

          {/* Errors */}
          <div className="endpoint-item">
            <div className="ep-top">
              <span className="ep-method err">4xx / 5xx</span>
              <code className="ep-path">Error Responses</code>
            </div>
            <div className="ep-body">
              <div className="ep-col full">
                <table className="ep-table">
                  <thead>
                    <tr><th>Status</th><th>Kondisi</th><th>Response</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>400</td><td>Tidak ada gambar</td><td><code>{`{"detail":"Tidak ada gambar yang diunggah."}`}</code></td></tr>
                    <tr><td>400</td><td>Format bukan JPG/PNG</td><td><code>{`{"detail":"Hanya file JPG/PNG yang diizinkan."}`}</code></td></tr>
                    <tr><td>400</td><td>File &gt; 5MB</td><td><code>{`{"detail":"Ukuran file melebihi batas 5MB."}`}</code></td></tr>
                    <tr><td>500</td><td>Gagal proses model</td><td><code>{`{"detail":"Gagal memproses gambar: ..."}`}</code></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Code examples */}
        <div className="code-examples">
          <button className="code-toggle" onClick={() => setShowCode(!showCode)}>
            <Code size={15} />
            <span>Contoh Kode</span>
            <ChevronDown size={15} className={`chev ${showCode ? 'open' : ''}`} />
          </button>
          {showCode && (
            <div className="code-panel">
              <CodeBlock tabs={CODE_TABS} />
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Leaf size={15} />
            <span>TaterScan</span>
          </div>
          <p>Potato Disease Detection · EfficientNet + ONNX Runtime · Vercel Serverless</p>
          <code className="footer-url">{API_BASE}</code>
        </div>
      </footer>
    </div>
  )
}
