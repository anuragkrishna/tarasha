import { getActivity } from '../data/activities'
import { useLang, pickField } from '../i18n'
import Icon from './Icon'

function scorePct(score, total) {
  return total > 0 ? Math.round((score / total) * 100) : null
}

function perfColor(pct) {
  if (pct === null) return 'var(--text-muted)'
  if (pct >= 75) return 'var(--success)'
  if (pct >= 50) return 'var(--warning)'
  return 'var(--error)'
}

export default function LessonSummary({ results, lessonNumber, onNext, onDone }) {
  const { t, lang } = useLang()

  const scored = results.filter(r => r.mode === 'measured' && r.total > 0)
  const avg = scored.length
    ? Math.round(scored.reduce((s, r) => s + (r.score / r.total) * 100, 0) / scored.length)
    : null

  return (
    <div className="page" style={{ maxWidth: 560, margin: '0 auto' }}>
      <div className="complete-screen" style={{ minHeight: 'auto', paddingTop: 24 }}>
        <Icon name="celebrate" size={56} color="var(--primary)" style={{ margin: '0 auto' }} />
        <h2>{t('lessonComplete', { n: lessonNumber })}</h2>
        {avg !== null && (
          <div className="score-circle" style={{ width: 120, height: 120, fontSize: 34 }}>
            {avg}<span>%</span>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 8 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
          {t('lessonN', { n: lessonNumber })}
        </div>
        {results.map(({ id, score, total, mode }, i) => {
          const meta = getActivity(id)
          const pct = scorePct(score, total)
          const color = perfColor(pct)
          return (
            <div key={id + '-' + i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0',
              borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none'
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
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{score}/{total}</div>
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

      {/* Sticky action bar so Next/Done stay in view without scrolling. */}
      <div style={{
        position: 'sticky', bottom: 0, zIndex: 5,
        background: 'var(--bg)', paddingTop: 12, paddingBottom: 16, marginTop: 16,
        display: 'flex', flexDirection: 'column', gap: 10,
        boxShadow: '0 -8px 16px -8px rgba(0,0,0,0.12)',
      }}>
        <button className="btn btn-primary btn-lg w-full" onClick={onNext}>
          {t('nextLesson')}
        </button>
        <button className="btn btn-ghost w-full" onClick={onDone}>
          {t('done')}
        </button>
      </div>
    </div>
  )
}
