import { useState, useRef, useEffect } from 'react'
import { useLang } from '../i18n'

function GoogleG() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 22, height: 22, borderRadius: 5, background: '#fff', flexShrink: 0,
    }}>
      <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
    </span>
  )
}

export default function ProfileMenu({ user, configured, signIn, signOut, onViewLog }) {
  const { t, lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])

  // Guest mode: just a "Login with Google" button — no dropdown.
  if (!user) {
    if (!configured) return null
    return (
      <button
        onClick={signIn}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8,
          padding: '10px 16px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        <GoogleG /> {t('signInGoogle')}
      </button>
    )
  }

  const close = () => setOpen(false)
  const initial = (user.displayName || user.email || '?').trim().charAt(0).toUpperCase()

  const rowStyle = {
    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
    padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 16, fontFamily: 'inherit', textAlign: 'left', color: 'var(--text)', borderRadius: 10,
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        title={t('account')}
        style={{
          width: 44, height: 44, borderRadius: '50%', padding: 0, minHeight: 'unset', minWidth: 'unset',
          border: '2px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>{initial}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 52, right: 0, zIndex: 50,
          width: 270, background: 'var(--surface)', borderRadius: 14,
          border: '1px solid var(--border)', boxShadow: '0 8px 28px rgba(0,0,0,0.16)',
          padding: 8,
        }}>
          {/* Account */}
          <div style={{ padding: '10px 14px 12px' }}>
            <div style={{ fontSize: 16, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.displayName || t('account')}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border)', margin: '8px 6px' }} />

          {/* Language */}
          <div style={{ padding: '4px 14px 8px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
              {t('languageLabel')}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['en', 'English'], ['hi', 'हिंदी']].map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'inherit',
                    border: `2px solid ${lang === code ? 'var(--primary)' : 'var(--border)'}`,
                    background: lang === code ? 'var(--primary)' : 'var(--surface)',
                    color: lang === code ? '#fff' : 'var(--text)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border)', margin: '8px 6px' }} />

          <button style={rowStyle} onClick={() => { close(); onViewLog() }}>{t('progress')}</button>

          <div style={{ height: 1, background: 'var(--border)', margin: '8px 6px' }} />
          <button style={rowStyle} onClick={() => { signOut(); close() }}>{t('signOut')}</button>
        </div>
      )}
    </div>
  )
}
