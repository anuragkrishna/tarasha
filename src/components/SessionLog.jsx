import { useState } from 'react'
import { ACTIVITIES } from '../data/activities'
import { useLang, pickField } from '../i18n'

const activityIcon = (id) => ACTIVITIES.find(a => a.id === id)?.icon || '📋'

export default function SessionLog({ onBack, progress }) {
  const { t, lang } = useLang()
  const [pin, setPin] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [filterDays, setFilterDays] = useState(7)
  const PIN = '1234'

  const activityName = (id) => pickField(ACTIVITIES.find(a => a.id === id), 'title', lang) || id
  const lvl = (n) => t('lvl.' + n)
  const locale = lang === 'hi' ? 'hi-IN' : 'en-IN'

  const FILTER_OPTIONS = [
    { label: t('last7days'), days: 7 },
    { label: t('last30days'), days: 30 },
    { label: t('allTime'), days: null },
  ]

  const allLog = progress.getFullLog()
  const cutoff = filterDays ? Date.now() - filterDays * 24 * 60 * 60 * 1000 : 0
  const log = allLog.filter(h => h.timestamp >= cutoff)

  const grouped = {}
  log.forEach(entry => {
    if (!grouped[entry.date]) grouped[entry.date] = []
    grouped[entry.date].push(entry)
  })
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  if (!unlocked) {
    const tryUnlock = () => { if (pin === PIN) { setUnlocked(true) } else { alert(t('wrongPin')) } }
    return (
      <div className="page" style={{ maxWidth: 400, margin: '0 auto' }}>
        <div className="activity-header">
          <button className="back-btn" onClick={onBack}>←</button>
          <h2 className="activity-title">{t('sessionLog')}</h2>
        </div>
        <div className="card text-center" style={{ marginTop: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h3 style={{ marginBottom: 8 }}>{t('caregiverView')}</h3>
          <p className="text-muted mb-24">{t('enterPinToView')}</p>
          <input
            className="input text-center"
            type="password"
            inputMode="numeric"
            placeholder={t('enterPin')}
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') tryUnlock() }}
            style={{ marginBottom: 16, fontSize: 28, letterSpacing: 8 }}
          />
          <br />
          <button className="btn btn-primary w-full" onClick={tryUnlock}>
            {t('unlock')}
          </button>
          <p className="text-muted mt-16" style={{ fontSize: 16 }}>{t('defaultPin')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2 className="activity-title">{t('progressLog')}</h2>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-8 mb-16">
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt.label}
            onClick={() => setFilterDays(opt.days)}
            style={{
              padding: '8px 18px', borderRadius: 20, fontSize: 17,
              fontFamily: 'inherit', cursor: 'pointer', fontWeight: 600,
              border: `2px solid ${filterDays === opt.days ? 'var(--primary)' : 'var(--border)'}`,
              background: filterDays === opt.days ? 'var(--primary)' : 'var(--surface)',
              color: filterDays === opt.days ? 'white' : 'var(--text)',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {dates.length === 0 && (
        <div className="card text-center" style={{ marginTop: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p className="text-muted">{t('noActivityPeriod')}</p>
        </div>
      )}

      {dates.map(date => (
        <div key={date}>
          <div className="category-header">
            {new Date(date + 'T00:00:00').toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
            <table className="log-table">
              <thead>
                <tr>
                  <th>{t('colActivity')}</th>
                  <th>{t('colLevel')}</th>
                  <th>{t('colScore')}</th>
                  <th>{t('colResult')}</th>
                  <th>{t('colNotes')}</th>
                </tr>
              </thead>
              <tbody>
                {grouped[date].map((entry, i) => {
                  const pct = entry.total > 0 ? entry.score / entry.total : 0
                  const good = pct >= 0.6
                  return (
                    <tr key={i}>
                      <td>
                        <span style={{ marginRight: 8 }}>{activityIcon(entry.activityId)}</span>
                        <span style={{ fontWeight: 600 }}>{activityName(entry.activityId)}</span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {entry.level} <span style={{ color: 'var(--text-muted)', fontSize: 15 }}>({lvl(entry.level)})</span>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {entry.score}/{entry.total}
                        <span style={{ color: 'var(--text-muted)', fontSize: 15, marginLeft: 4 }}>
                          ({Math.round(pct * 100)}%)
                        </span>
                      </td>
                      <td>
                        <span className={good ? 'badge-good' : 'badge-needs-work'}>
                          {good ? t('good') : t('needsWork')}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 16 }}>
                        {entry.notes || '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div style={{ height: 40 }} />
    </div>
  )
}
