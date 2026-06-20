import { useLang } from '../i18n'

export default function LanguageChooser() {
  const { setLang } = useLang()

  const Option = ({ code, label, sub }) => (
    <button
      onClick={() => setLang(code)}
      style={{
        width: '100%', background: 'white', border: '1.5px solid var(--border)',
        borderRadius: 16, padding: '22px 24px', cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        fontSize: 24, fontWeight: 700, color: 'var(--text)',
      }}
    >
      <span>{label}</span>
      <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-muted)' }}>{sub}</span>
    </button>
  )

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🌐</div>
        <h1 style={{ marginBottom: 6 }}>भाषा चुनें</h1>
        <p className="text-muted">Choose a language</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Option code="en" label="English" sub="अंग्रेज़ी" />
        <Option code="hi" label="हिंदी" sub="Hindi" />
      </div>
    </div>
  )
}
