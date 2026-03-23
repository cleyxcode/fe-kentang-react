import { useState } from 'react'
import { Download, FlaskConical, Database, Images, CheckCircle, AlertTriangle, Skull, ChevronRight, Loader } from 'lucide-react'
import './DatasetPage.css'

/* ── Dataset manifest ── */
const CLASSES = [
  {
    id: 'Healthy',
    folder: 'Potato___healthy',
    color: '#4ade80',
    glow: 'rgba(74, 222, 128, 0.35)',
    bg: 'rgba(74, 222, 128, 0.07)',
    border: 'rgba(74, 222, 128, 0.3)',
    emoji: '🌿',
    label: 'Daun Sehat',
    icon: CheckCircle,
    severity: 'safe',
    desc: 'Tanaman dalam kondisi optimal, tidak ada tanda penyakit',
    files: [
      '00fc2ee5-729f-4757-8aeb-65c3355874f2___RS_HL 1864.JPG',
      '0b3e5032-8ae8-49ac-8157-a1cac3df01dd___RS_HL 1817.JPG',
      '0be9d721-82f5-42c3-b535-7494afe01dbe___RS_HL 1814.JPG',
      '0f4ebc5a-d646-436a-919d-961342997cde___RS_HL 4183.JPG',
      '1a1184f8-c414-4ead-a4c4-41ae78e29a82___RS_HL 1971.JPG',
      '1ae826e2-5148-47bd-a44c-711ec9cc9c75___RS_HL 1954.JPG',
      '1b434c52-7be4-40c4-90d5-13220f1a3eba___RS_HL 5418.JPG',
      '1dcfeaa9-006d-470c-b3e5-d67609d07d4e___RS_HL 1808.JPG',
      '1f9870b3-899e-46fb-98c9-cfc2ce92895b___RS_HL 1816.JPG',
      '2ccb9ee9-faac-4d32-9af5-29497fa2e028___RS_HL 1837.JPG',
      '2d98cbc8-cbe6-423c-b2ab-3f7f8bcea5d5___RS_HL 1945.JPG',
      '2dee1571-ef6b-40ef-8c46-334e89aad3f1___RS_HL 1950.JPG',
    ],
  },
  {
    id: 'Early Blight',
    folder: 'Potato___Early_blight',
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.35)',
    bg: 'rgba(251, 191, 36, 0.07)',
    border: 'rgba(251, 191, 36, 0.3)',
    emoji: '⚠️',
    label: 'Bercak Daun Awal',
    icon: AlertTriangle,
    severity: 'warning',
    desc: 'Jamur Alternaria solani — bercak coklat gelap berbentuk target',
    files: [
      '00d8f10f-5038-4e0f-bb58-0b885ddc0cc5___RS_Early.B 8722.JPG',
      '0a0744dc-8486-4fbb-a44b-4d63e6db6197___RS_Early.B 7575.JPG',
      '0a47f32c-1724-4c8d-bfe4-986cedd3587b___RS_Early.B 8001.JPG',
      '0a6983a5-895e-4e68-9edb-88adf79211e9___RS_Early.B 9072.JPG',
      '0a79700b-f834-41f5-ae51-6ceda6f67a48___RS_Early.B 8951.JPG',
      '0a8a68ee-f587-4dea-beec-79d02e7d3fa4___RS_Early.B 8461.JPG',
      '0ad3ba53-f01b-403b-a99d-5991eed85045___RS_Early.B 7600.JPG',
      '0bbb8bce-2020-416b-8bd6-c160c2db9921___RS_Early.B 8386.JPG',
      '0c4f6f72-c7a2-42e1-9671-41ab3bf37fe7___RS_Early.B 6752.JPG',
      '0c5b14d9-8b1c-4c39-bb23-1835b5760caa___RS_Early.B 7937.JPG',
      '0caf6a39-3f5f-4201-a4d7-3ea35fdf1303___RS_Early.B 6762.JPG',
      '0d2325ff-4e3e-44bf-9614-e5ad6c23fc16___RS_Early.B 6797.JPG',
      '0d2e2971-f1c9-4278-b35c-91dd8a22a64d___RS_Early.B 7581.JPG',
      '0d987d4a-26bc-4f74-8a16-12f8969dfed8___RS_Early.B 7013.JPG',
      '0d9dbf50-53a9-42b2-8b29-0360fb7dbd98___RS_Early.B 6692.JPG',
      '0ddd62cd-a999-4d58-a8f1-506e1004a595___RS_Early.B 8041.JPG',
    ],
  },
  {
    id: 'Late Blight',
    folder: 'Potato___Late_blight',
    color: '#f87171',
    glow: 'rgba(248, 113, 113, 0.35)',
    bg: 'rgba(248, 113, 113, 0.07)',
    border: 'rgba(248, 113, 113, 0.3)',
    emoji: '🚨',
    label: 'Busuk Daun',
    icon: Skull,
    severity: 'danger',
    desc: 'Phytophthora infestans — penyakit paling destruktif pada kentang',
    files: [
      '00b1f292-23dd-44d4-aad3-c1ffb6a6ad5a___RS_LB 4479.JPG',
      '0acdc2b2-0dde-4073-8542-6fca275ab974___RS_LB 4857.JPG',
      '0b092cda-db8c-489d-8c46-23ac3835310d___RS_LB 4480.JPG',
      '0b2bdc8e-90fd-4bb4-bedb-485502fe8a96___RS_LB 4906.JPG',
      '0c2628d4-8d64-48a9-a157-19a9c902e304___RS_LB 4590.JPG',
      '0c83302d-4233-4e98-8ecf-755a970495bb___RS_LB 4904.JPG',
      '0d8346e1-4624-4979-84e6-1353ca59007a___RS_LB 4079.JPG',
      '0e068694-63b7-4edf-a93d-f2e9f28efaa6___RS_LB 3923.JPG',
      '0e7f0484-16eb-4183-b702-0a5b4f94d015___RS_LB 4000.JPG',
      '0eb24a67-a174-43db-86c7-cca8795942a2___RS_LB 4722.JPG',
      '0eb28ea9-c9e4-4999-9de2-835682241e53___RS_LB 2708.JPG',
      '0f1fb568-1b12-45ef-ad99-c59fa9075693___RS_LB 3242.JPG',
      '0f243024-b1fa-4f96-ac7e-ecaf6dc5bc37___RS_LB 4925.JPG',
      '0f50da52-cb4a-4391-982a-d6cf9c9d9917___RS_LB 2581.JPG',
      '0f6eac3b-d674-4c4d-ab3a-88689feec07f___RS_LB 5232.JPG',
      '0f824e18-3821-486c-81a1-f1f64cf6e767___RS_LB 4894.JPG',
      '0fe7786d-0e2f-4705-839d-898f1d9214b0___RS_LB 2836.JPG',
      '1a5f4258-21df-4334-a933-2ef073c932ba___RS_LB 3089.JPG',
    ],
  },
]

const TOTAL = CLASSES.reduce((s, c) => s + c.files.length, 0)

/* Extract short label from filename e.g. "HL 1864" */
function shortLabel(filename) {
  const m = filename.match(/___RS_(.*?)\.JPG$/i)
  return m ? m[1] : filename.slice(0, 8)
}

/* ── Component ── */
export default function DatasetPage({ onTestImage }) {
  const [activeTab, setActiveTab] = useState('all')
  const [loadingFile, setLoadingFile] = useState(null)
  const [imgErrors, setImgErrors] = useState({})

  const visibleClasses = activeTab === 'all'
    ? CLASSES
    : CLASSES.filter(c => c.id === activeTab)

  const handleTest = async (cls, filename) => {
    const key = `${cls.folder}/${filename}`
    setLoadingFile(key)
    try {
      const url = `/dataset/${cls.folder}/${encodeURIComponent(filename)}`
      const res = await fetch(url)
      const blob = await res.blob()
      const file = new File([blob], filename, { type: 'image/jpeg' })
      const preview = URL.createObjectURL(blob)
      onTestImage(file, preview)
    } catch (e) {
      console.error('Failed to load test image:', e)
    } finally {
      setLoadingFile(null)
    }
  }

  const handleImgError = (key) => {
    setImgErrors(prev => ({ ...prev, [key]: true }))
  }

  return (
    <div className="dataset-page">
      {/* ── Page Header ── */}
      <div className="ds-header">
        <div className="ds-header-inner">
          <div className="section-eyebrow">
            <Database size={11} />
            <span>Sample Dataset</span>
          </div>
          <h2 className="section-h2 ds-title">Dataset Gambar<br /><em>Daun Kentang</em></h2>
          <p className="ds-subtitle">
            Koleksi gambar sampel dari tiga kelas penyakit daun kentang.
            Unduh gambar untuk diuji coba langsung pada model AI.
          </p>

          {/* Stats row */}
          <div className="ds-stats">
            <div className="ds-stat">
              <span className="ds-stat-val">{TOTAL}</span>
              <span className="ds-stat-key">Total Gambar</span>
            </div>
            <div className="ds-stat-sep" />
            <div className="ds-stat">
              <span className="ds-stat-val">3</span>
              <span className="ds-stat-key">Kelas Penyakit</span>
            </div>
            <div className="ds-stat-sep" />
            <div className="ds-stat">
              <span className="ds-stat-val mono-val">JPG</span>
              <span className="ds-stat-key">Format</span>
            </div>
            <div className="ds-stat-sep" />
            <div className="ds-stat">
              <span className="ds-stat-val mono-val">300×300</span>
              <span className="ds-stat-key">Resolusi</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="ds-tabs-wrap">
        <div className="ds-tabs">
          <button
            className={`ds-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <Images size={14} />
            Semua
            <span className="ds-tab-count">{TOTAL}</span>
          </button>
          {CLASSES.map(cls => (
            <button
              key={cls.id}
              className={`ds-tab ds-tab-cls ${activeTab === cls.id ? 'active' : ''}`}
              style={{ '--tc': cls.color, '--tg': cls.glow }}
              onClick={() => setActiveTab(cls.id)}
            >
              <span className="ds-tab-dot" style={{ background: cls.color }} />
              {cls.id}
              <span className="ds-tab-count">{cls.files.length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Class Sections ── */}
      <div className="ds-content">
        {visibleClasses.map(cls => (
          <section
            key={cls.id}
            className={`ds-class-section sev-${cls.severity}`}
            style={{ '--cc': cls.color, '--cg': cls.glow, '--cb': cls.bg, '--cbr': cls.border }}
          >
            {/* Class header */}
            <div className="dcs-header">
              <div className="dcs-left">
                <span className="dcs-emoji">{cls.emoji}</span>
                <div className="dcs-info">
                  <h3 className="dcs-name">{cls.id}</h3>
                  <p className="dcs-label">{cls.label}</p>
                </div>
              </div>
              <div className="dcs-right">
                <span className="dcs-desc">{cls.desc}</span>
                <div className="dcs-badge">
                  <span className="dcs-count">{cls.files.length}</span>
                  <span>gambar</span>
                </div>
              </div>
            </div>

            {/* Image grid */}
            <div className="ds-grid">
              {cls.files.map(filename => {
                const key = `${cls.folder}/${filename}`
                const imgUrl = `/dataset/${cls.folder}/${encodeURIComponent(filename)}`
                const isLoading = loadingFile === key
                const hasError = imgErrors[key]

                return (
                  <div key={filename} className="ds-card">
                    {/* Thumbnail */}
                    <div className="ds-thumb">
                      {hasError ? (
                        <div className="ds-thumb-err">
                          <Images size={24} />
                          <span>No preview</span>
                        </div>
                      ) : (
                        <img
                          src={imgUrl}
                          alt={shortLabel(filename)}
                          loading="lazy"
                          onError={() => handleImgError(key)}
                        />
                      )}
                      <div className="ds-thumb-overlay">
                        <span className="ds-filename">{shortLabel(filename)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ds-card-actions">
                      <a
                        className="ds-btn ds-btn-dl"
                        href={imgUrl}
                        download={filename}
                        title="Unduh gambar"
                      >
                        <Download size={13} />
                        <span>Unduh</span>
                      </a>
                      <button
                        className="ds-btn ds-btn-test"
                        onClick={() => handleTest(cls, filename)}
                        disabled={isLoading}
                        title="Gunakan untuk uji coba AI"
                      >
                        {isLoading ? (
                          <><Loader size={13} className="spin" /><span>Loading…</span></>
                        ) : (
                          <><FlaskConical size={13} /><span>Uji Coba</span></>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Section glow accent */}
            <div className="dcs-glow" />
          </section>
        ))}
      </div>

      {/* ── How to Use ── */}
      <div className="ds-howto">
        <div className="ds-howto-inner">
          <h3 className="ds-howto-title">Cara Menggunakan Dataset</h3>
          <div className="ds-steps">
            <div className="ds-step">
              <span className="ds-step-num">01</span>
              <div>
                <strong>Pilih Gambar</strong>
                <p>Browse koleksi gambar daun kentang berdasarkan kelas penyakit yang ingin diuji.</p>
              </div>
            </div>
            <ChevronRight size={16} className="ds-step-arrow" />
            <div className="ds-step">
              <span className="ds-step-num">02</span>
              <div>
                <strong>Unduh atau Uji Langsung</strong>
                <p>Klik <em>Unduh</em> untuk menyimpan gambar, atau <em>Uji Coba</em> untuk langsung mengirim ke model AI.</p>
              </div>
            </div>
            <ChevronRight size={16} className="ds-step-arrow" />
            <div className="ds-step">
              <span className="ds-step-num">03</span>
              <div>
                <strong>Lihat Hasil Prediksi</strong>
                <p>Model EfficientNet akan menganalisis gambar dan menampilkan prediksi beserta tingkat kepercayaannya.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
