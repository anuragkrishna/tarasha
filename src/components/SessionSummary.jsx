import { getActivity } from '../data/activities'
import { getMode } from '../dailyPlan'
import { useLang, pickField } from '../i18n'

function scorePct(score, total) {
  return total > 0 ? Math.round((score / total) * 100) : null
}

function perfColor(pct) {
  if (pct === null) return 'var(--text-muted)'
  if (pct >= 75) return 'var(--success)'
  if (pct >= 50) return 'var(--warning)'
  return 'var(--error)'
}

export default function SessionSummary({ queue, progress, onDone }) {
  const { t, lang } = useLang()
  const today = new Date().toISOString().split('T')[0]
  const todayLog = progress.getFullLog().filter(e => e.date === today)

  // Latest result today for each activity in the session queue
  const rows = queue.map(id => {
    const entry = todayLog.find(e => e.activityId === id)
    return { id, entry }
  }).filter(r => r.entry)

  const scored = rows.filter(r => getMode(r.id) === 'measured' && r.entry.total > 0)
  const avg = scored.length
    ? Math.round(scored.reduce((s, r) => s + (r.entry.score / r.entry.total) * 100, 0) / scored.length)
    : null

  return (
    <div className="page" style={{ maxWidth: 560, margin: '0 auto' }}>
      <div className="complete-screen" style={{ minHeight: 'auto', paddingTop: 24 }}>
        <div style={{ fontSize: 60 }}>🎉</div>
        <h2>{t('sessionComplete')}</h2>
        {avg !== null && (
          <div className="score-circle" style={{ width: 120, height: 120, fontSize: 34 }}>
            {avg}<span>%</span>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 8 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
          {t('todaysSession')}
        </div>
        {rows.map(({ id, entry }, i) => {
          const meta = getActivity(id)
          const mode = getMode(id)
          const pct = scorePct(entry.score, entry.total)
          const color = perfColor(pct)
          return (
            <div key={id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0',
              borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <span style={{ fontSize: 26, width: 34, textAlign: 'center', flexShrink: 0 }}>{meta?.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 600 }}>{pickField(meta, 'title', lang)}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t(mode)}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                {mode === 'measured' && pct !== null ? (
                  <>
                    <div style={{ fontSize: 17, fontWeight: 700, color }}>{pct}%</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{entry.score}/{entry.total}</div>
                  </>
                ) : (
                  <div style={{ fontSize: 15, fontWeight: 700, color: pct >= 50 ? 'var(--success)' : 'var(--warning)' }}>
                    {pct >= 50 ? t('good') : t('needsWork')}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <button className="btn btn-primary btn-lg w-full" onClick={onDone} style={{ marginTop: 8 }}>
        {t('done')}
      </button>
    </div>
  )
}
