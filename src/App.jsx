import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Leaf, Zap, CloudUpload, FlaskConical, RefreshCw,
  FileImage, XCircle, Activity, Loader,
  ArrowRight, CheckCircle2, AlertTriangle, AlertOctagon,
  ChevronRight, Cpu, Shield,
} from 'lucide-react'
import './App.css'

const API_BASE = 'https://node-js-potato-be-e7k2.vercel.app'

const DISEASE_CONFIG = {
  Healthy: {
    color: '#10b981',
    glow: 'rgba(16,185,129,0.28)',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.22)',
    severity: 'safe',
    Icon: CheckCircle2,
    label: 'Daun Sehat',
    desc: 'Tanaman kentang dalam kondisi optimal. Tidak ditemukan indikasi penyakit pada daun.',
    action: 'Pertahankan kondisi perawatan saat ini.',
  },
  'Early Blight': {
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.28)',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.22)',
    severity: 'warning',
    Icon: AlertTriangle,
    label: 'Bercak Daun Awal',
    desc: 'Disebabkan oleh jamur Alternaria solani. Muncul bercak coklat gelap berbentuk target pada daun.',
    action: 'Gunakan fungisida berbasis tembaga. Buang daun yang terinfeksi segera.',
  },
  'Late Blight': {
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.28)',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.22)',
    severity: 'danger',
    Icon: AlertOctagon,
    label: 'Busuk Daun',
    desc: 'Disebabkan oleh Phytophthora infestans. Penyakit paling destruktif pada kentang, menyebar sangat cepat.',
    action: 'Tindakan darurat diperlukan. Isolasi tanaman dan gunakan fungisida sistemik.',
  },
}

/* ─── StatusBadge ─── */
function StatusBadge({ status }) {
  return (
    <div className={`status-badge st-${status}`}>
      {status === 'checking'
        ? <Loader size={11} className="spin" />
        : <span className="st-dot" />}
      <span>
        {status === 'online' ? 'API Online' : status === 'checking' ? 'Connecting…' : 'API Offline'}
      </span>
    </div>
  )
}

/* ─── ConfidenceBar ─── */
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
        <div className="conf-fill" style={{ width: `${w}%`, background: color, boxShadow: `0 0 8px ${color}55` }} />
      </div>
      <span className="conf-val" style={{ color }}>{value}</span>
    </div>
  )
}

/* ─── HeroVisual — dashboard mockup card ─── */
function HeroVisual() {
  return (
    <div className="hero-visual">
      {/* floating chips */}
      <div className="hv-chip hv-chip-1">
        <CheckCircle2 size={13} />
        <span>Confidence 94.2%</span>
      </div>
      <div className="hv-chip hv-chip-2">
        <Zap size={13} />
        <span>Response &lt; 1s</span>
      </div>

      <div className="hv-card">
        {/* window chrome */}
        <div className="hv-chrome">
          <div className="hv-dots">
            <span /><span /><span />
          </div>
          <span className="hv-chrome-title">TaterScan · Analysis Engine</span>
          <div className="hv-live">
            <span className="hv-pulse" />
            Live
          </div>
        </div>

        {/* body */}
        <div className="hv-body">
          {/* left: leaf preview + scan */}
          <div className="hv-preview-col">
            <div className="hv-img-wrap">
              <Leaf size={38} />
              <div className="hv-scan-line" />
            </div>
            <div className="hv-img-label">daun_kentang.jpg</div>
          </div>

          {/* right: metrics + bars */}
          <div className="hv-metrics">
            <div className="hv-row">
              <span className="hv-key">Model</span>
              <span className="hv-val">EfficientNet-B0</span>
            </div>
            <div className="hv-row">
              <span className="hv-key">Runtime</span>
              <span className="hv-val">ONNX · 48ms</span>
            </div>
            <div className="hv-row">
              <span className="hv-key">Input</span>
              <span className="hv-val">300 × 300 px</span>
            </div>
            <div className="hv-sep" />
            <div className="hv-result-label">Distribusi Prediksi</div>
            {[
              { name: 'Healthy', pct: 82, color: '#10b981' },
              { name: 'E. Blight', pct: 12, color: '#f59e0b' },
              { name: 'L. Blight', pct: 6,  color: '#ef4444' },
            ].map(r => (
              <div key={r.name} className="hv-bar-row">
                <span className="hv-bar-name">{r.name}</span>
                <div className="hv-bar">
                  <div className="hv-bar-fill" style={{ width: `${r.pct}%`, background: r.color }} />
                </div>
                <span className="hv-bar-pct" style={{ color: r.color }}>{r.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* result footer */}
        <div className="hv-footer">
          <div className="hv-result-chip">
            <CheckCircle2 size={13} />
            <span>Healthy — Daun Sehat</span>
          </div>
          <span className="hv-conf">94.2% confidence</span>
        </div>
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
  const fileRef = useRef()
  const resultRef = useRef()

  useEffect(() => {
    fetch(`${API_BASE}/`)
      .then(r => setApiStatus(r.ok ? 'online' : 'offline'))
      .catch(() => setApiStatus('offline'))
  }, [])

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
      {/* ── Backgrounds ── */}
      <div className="dot-bg" aria-hidden="true" />
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon"><Leaf size={16} /></div>
            <span className="logo-name">TaterScan</span>
            <span className="logo-ver">v1.0</span>
          </div>
          <nav className="header-nav">
            <a href="#penyakit" className="nav-link">Penyakit</a>
            <a href="#scan" className="nav-link">Deteksi</a>
            <StatusBadge status={apiStatus} />
            <a href="#scan" className="btn-nav">
              Mulai Analisis <ArrowRight size={14} />
            </a>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <Zap size={12} />
              <span>EfficientNet · ONNX Runtime · Vercel Serverless</span>
            </div>
            <h1 className="hero-h1">
              Diagnosis <em>Penyakit Daun</em><br />
              Kentang Berbasis AI
            </h1>
            <p className="hero-p">
              Upload foto daun kentang dan dapatkan diagnosis instan dengan model deep learning
              EfficientNet — deteksi tiga kelas penyakit secara akurat dalam hitungan detik.
            </p>
            <div className="hero-stats">
              <div className="h-stat">
                <span className="h-stat-val">3</span>
                <span className="h-stat-key">Kelas Penyakit</span>
              </div>
              <div className="h-stat-div" />
              <div className="h-stat">
                <span className="h-stat-val">300px</span>
                <span className="h-stat-key">Resolusi Input</span>
              </div>
              <div className="h-stat-div" />
              <div className="h-stat">
                <span className="h-stat-val">5 MB</span>
                <span className="h-stat-key">Maks. Ukuran</span>
              </div>
            </div>
            <div className="hero-actions">
              <a href="#scan" className="btn-hero">
                Mulai Analisis
                <ArrowRight size={16} />
              </a>
              <a href="#penyakit" className="btn-ghost">
                Lihat Kelas
                <ChevronRight size={15} />
              </a>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* ── Tech Strip ── */}
      <div className="tech-strip">
        {['EfficientNet-B0', 'ONNX Runtime', 'Node.js', 'React 19', 'Vercel Edge', 'TensorFlow'].map((t, i) => (
          <div key={t} className="tech-item">
            {i > 0 && <span className="tech-dot" />}
            <span>{t}</span>
          </div>
        ))}
      </div>

      {/* ── Disease Cards ── */}
      <section className="diseases-section" id="penyakit">
        <div className="section-inner">
          <div className="section-label">Kelas yang Dapat Dideteksi</div>
          <h2 className="section-h2">Tiga Kondisi Daun Kentang</h2>
          <p className="section-sub">
            Model dilatih untuk mengenali tiga kondisi utama daun kentang dengan akurasi tinggi menggunakan dataset PlantVillage.
          </p>
          <div className="disease-grid">
            {Object.entries(DISEASE_CONFIG).map(([key, d]) => {
              const Icon = d.Icon
              return (
                <div
                  key={key}
                  className="disease-card"
                  style={{ '--dc': d.color, '--dc-bg': d.bg, '--dc-border': d.border, '--dc-glow': d.glow }}
                >
                  <div className="dc-accent-bar" />
                  <div className="dc-icon">
                    <Icon size={22} />
                  </div>
                  <h3 className="dc-name">{key}</h3>
                  <span className="dc-label">{d.label}</span>
                  <p className="dc-desc">{d.desc}</p>
                  <div className="dc-action">
                    <Activity size={13} className="dc-action-icon" />
                    <span>{d.action}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Scan Section ── */}
      <section className="scan-section" id="scan">
        <div className="section-inner">
          <div className="section-label">Analisis Gambar</div>
          <h2 className="section-h2">Upload & Diagnosa Sekarang</h2>
          <p className="section-sub">
            Upload foto daun kentang dalam format JPG atau PNG, lalu klik Analisis untuk mendapatkan diagnosis instan dari model AI.
          </p>

          <div className="scan-grid">
            {/* ─ Upload Panel ─ */}
            <div className="scan-panel">
              <div className="panel-header">
                <div className="panel-icon"><CloudUpload size={15} /></div>
                <span>Upload Gambar</span>
              </div>

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
                      <button className="change-btn" onClick={(e) => { e.stopPropagation(); reset() }}>
                        <RefreshCw size={14} /> Ganti Gambar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="dz-idle">
                    <div className="dz-icon"><CloudUpload size={30} /></div>
                    <p className="dz-title">{dragging ? 'Lepaskan gambar di sini' : 'Drag & Drop gambar'}</p>
                    <p className="dz-sub">atau <span className="dz-browse">klik untuk browse</span></p>
                    <div className="dz-tags">
                      <span className="dz-tag">JPG</span>
                      <span className="dz-tag">PNG</span>
                      <span className="dz-tag">Max 5 MB</span>
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
                <div className="error-msg">
                  <XCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              {file && !loading && (
                <button className="analyze-btn" onClick={predict}>
                  <FlaskConical size={16} />
                  Analisis Sekarang
                </button>
              )}

              {loading && (
                <button className="analyze-btn is-loading" disabled>
                  <div className="btn-spinner" />
                  Menganalisis…
                </button>
              )}

              <div className="upload-info">
                <div className="uinfo-item"><Cpu size={13} /><span>EfficientNet-B0 · ONNX</span></div>
                <div className="uinfo-item"><Shield size={13} /><span>File tidak disimpan</span></div>
              </div>
            </div>

            {/* ─ Result Panel ─ */}
            <div ref={resultRef} className="scan-panel result-panel">
              <div className="panel-header">
                <div className="panel-icon result-panel-icon"><FlaskConical size={15} /></div>
                <span>Hasil Analisis</span>
              </div>

              {!result && !loading && (
                <div className="result-empty">
                  <FileImage size={48} />
                  <p>Hasil analisis akan muncul di sini</p>
                  <span>Upload gambar daun dan klik Analisis</span>
                </div>
              )}

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
                <div
                  className="result-card"
                  style={{ '--rc': cfg.color, '--rc-bg': cfg.bg, '--rc-border': cfg.border, '--rc-glow': cfg.glow }}
                >
                  <div className="rc-top">
                    <div className="rc-icon">
                      <cfg.Icon size={22} />
                    </div>
                    <div className="rc-meta">
                      <span className="rc-class">{result.class}</span>
                      <span className="rc-sublabel">{cfg.label}</span>
                    </div>
                    <div className="rc-badge">
                      <span className="rcb-val">{result.confidence}</span>
                      <span className="rcb-key">confidence</span>
                    </div>
                  </div>

                  <p className="rc-desc">{cfg.desc}</p>

                  <div className="rc-action">
                    <Activity size={13} className="rc-action-icon" />
                    <span>{cfg.action}</span>
                  </div>

                  <div className="rc-bars">
                    <div className="bars-title">Distribusi Prediksi</div>
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

                  <button className="rescan-btn" onClick={reset}>
                    <RefreshCw size={14} /> Scan Baru
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="logo-icon"><Leaf size={14} /></div>
            <span>TaterScan</span>
          </div>
          <p className="footer-copy">Potato Disease Detection · EfficientNet + ONNX Runtime · Vercel Serverless</p>
          <div className="footer-right">
            <StatusBadge status={apiStatus} />
          </div>
        </div>
      </footer>
    </div>
  )
}
