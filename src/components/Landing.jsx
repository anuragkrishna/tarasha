import { useLang } from '../i18n'
import { track } from '../firebase'

function GoogleG() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 24, height: 24, borderRadius: 5, background: '#fff', flexShrink: 0,
    }}>
      <svg width="15" height="15" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
    </span>
  )
}

export default function Landing({ configured, signIn, onGuest }) {
  const { t, lang, setLang } = useLang()

  const navyBtn = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8,
    padding: '11px 20px', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, background: '#E8E8E8',
    }}>
      {/* Language options */}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 10, display: 'flex', gap: 8 }}>
        {[['en', 'English'], ['hi', 'हिंदी']].map(([code, label]) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            style={{
              borderRadius: 999, padding: '8px 16px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              border: '2px solid var(--primary)',
              background: lang === code ? 'var(--primary)' : 'transparent',
              color: lang === code ? '#fff' : 'var(--primary)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center',
        gap: 56, maxWidth: 1040, width: '100%',
      }}>
        {/* Left — brain */}
        <div style={{ flex: '1 1 320px', display: 'flex', justifyContent: 'center' }}>
          <img src="/brain.png" alt="" style={{ width: '100%', maxWidth: 440, height: 'auto' }} />
        </div>

        {/* Right — headline + buttons */}
        <div style={{ flex: '1 1 360px', minWidth: 280 }}>
          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1.1, fontWeight: 800,
            color: 'var(--accent)', margin: 0, letterSpacing: -1,
          }}>
            {t('landingHeadline')}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 36 }}>
            {configured && (
              <button style={navyBtn} onClick={signIn}>
                <GoogleG /> {t('landingSignIn')}
              </button>
            )}
            <button style={navyBtn} onClick={() => { track('continue_as_guest'); onGuest() }}>
              {t('landingGuest')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
