import { useState, useRef, useEffect } from 'react'
import { useLang } from '../i18n'

export default function ProfileMenu({ user, configured, signIn, signOut, onViewLog, onReset }) {
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

  const close = () => setOpen(false)
  const initial = (user?.displayName || user?.email || '?').trim().charAt(0).toUpperCase()

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
        {user?.photoURL ? (
          <img src={user.photoURL} alt="" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : user ? (
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>{initial}</span>
        ) : (
          <span style={{ fontSize: 22 }}>👤</span>
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
            {user ? (
              <>
                <div style={{ fontSize: 16, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.displayName || t('account')}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-muted)' }}>{t('guest')}</div>
            )}
          </div>

          {configured && !user && (
            <button style={{ ...rowStyle, color: 'var(--primary)', fontWeight: 700 }} onClick={() => { signIn(); close() }}>
              🔑 {t('signInGoogle')}
            </button>
          )}

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

          <button style={rowStyle} onClick={() => { close(); onViewLog() }}>📊 {t('progress')}</button>
          <button style={{ ...rowStyle, color: 'var(--error)' }} onClick={() => { close(); onReset() }}>🔄 {t('reset')}</button>

          {configured && user && (
            <>
              <div style={{ height: 1, background: 'var(--border)', margin: '8px 6px' }} />
              <button style={rowStyle} onClick={() => { signOut(); close() }}>↩️ {t('signOut')}</button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
