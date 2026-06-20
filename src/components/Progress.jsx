import { useState } from 'react'
import { ACTIVITIES, getActivity } from '../data/activities'
import { getMode } from '../dailyPlan'
import { useLang, pickField } from '../i18n'

const CATEGORIES = ['Learning', 'Short Term Memory', 'Topic Maintenance', 'Narration']
const CATEGORY_OF = Object.fromEntries(ACTIVITIES.map(a => [a.id, a.category]))

function barColor(pct) {
  if (pct === null || pct === undefined) return 'var(--border)'
  if (pct >= 75) return 'var(--success)'
  if (pct >= 50) return 'var(--warning)'
  return 'var(--error)'
}

function StatCard({ label, value, suffix, sub }) {
  return (
    <div className="card" style={{ flex: 1, textAlign: 'center', padding: '18px 12px', marginBottom: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontSize: 34, fontWeight: 800, margin: '6px 0', color: value === null ? 'var(--text-muted)' : 'var(--text)' }}>
        {value === null ? '–' : value}{value !== null && suffix ? <span style={{ fontSize: 18 }}>{suffix}</span> : null}
      </div>
      {sub && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  )
}

function TrendsTab({ progress, t, lang }) {
  const measured = progress.getAverage(7, 'measured')
  const observed = progress.getAverage(7, 'observed')
  const daysActive = progress.getCompletedDays(7)
  const streak = progress.getStreak()
  const weekly = progress.getWeeklyByCategory(CATEGORIES, 6)

  return (
    <div>
      {/* Consistency */}
      <div className="flex gap-12 mb-16">
        <StatCard label={t('measuredAvg')} value={measured} suffix="%" sub={t('last7')} />
        <StatCard label={t('observedRate')} value={observed} suffix="%" sub={t('last7')} />
      </div>
      <div className="flex gap-12 mb-24">
        <StatCard label={t('consistency')} value={daysActive} sub={t('daysActive', { n: daysActive, d: 7 })} />
        <StatCard label="🔥" value={streak} sub={t('dayStreak', { n: streak })} />
      </div>

      {/* Per-domain weekly trends */}
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
        {t('domainTrends')} <span style={{ textTransform: 'none', fontWeight: 400 }}>· {t('weeklyTrend')}</span>
      </div>
      {CATEGORIES.map(cat => {
        const series = weekly[cat] || []
        const hasData = series.some(w => w.avg !== null)
        return (
          <div key={cat} className="card mb-12" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{t('cat.' + cat)}</div>
            {hasData ? (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 72 }}>
                {series.map((w, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2, height: 14 }}>
                      {w.avg !== null ? `${w.avg}` : ''}
                    </div>
                    <div style={{
                      width: '100%', maxWidth: 28, borderRadius: 6,
                      height: `${w.avg !== null ? Math.max(w.avg, 4) : 4}%`,
                      minHeight: w.avg !== null ? 4 : 3,
                      background: w.avg !== null ? barColor(w.avg) : 'var(--border)',
                      transition: 'height 0.3s',
                    }} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: 15 }}>{t('notEnoughData')}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function LogTab({ progress, t, lang }) {
  const [filterDays, setFilterDays] = useState(7)
  const lvl = (n) => t('lvl.' + n)
  const locale = lang === 'hi' ? 'hi-IN' : 'en-IN'
  const FILTERS = [
    { label: t('last7days'), days: 7 },
    { label: t('last30days'), days: 30 },
    { label: t('allTime'), days: null },
  ]
  const cutoff = filterDays ? Date.now() - filterDays * 86400000 : 0
  const log = progress.getFullLog().filter(h => h.timestamp >= cutoff)
  const grouped = {}
  log.forEach(e => { (grouped[e.date] = grouped[e.date] || []).push(e) })
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))
  const name = (id) => pickField(getActivity(id), 'title', lang) || id

  return (
    <div>
      <div className="flex gap-8 mb-16">
        {FILTERS.map(opt => (
          <button key={opt.label} onClick={() => setFilterDays(opt.days)} style={{
            padding: '8px 18px', borderRadius: 20, fontSize: 16, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 600,
            border: `2px solid ${filterDays === opt.days ? 'var(--primary)' : 'var(--border)'}`,
            background: filterDays === opt.days ? 'var(--primary)' : 'var(--surface)',
            color: filterDays === opt.days ? 'white' : 'var(--text)',
          }}>{opt.label}</button>
        ))}
      </div>

      {dates.length === 0 && (
        <div className="card text-center" style={{ marginTop: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p className="text-muted">{t('noActivityPeriod')}</p>
        </div>
      )}

      {dates.map(date => (
        <div key={date}>
          <div className="category-header">
            {new Date(date + 'T00:00:00').toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
            <table className="log-table">
              <thead>
                <tr><th>{t('colActivity')}</th><th>{t('colLevel')}</th><th>{t('colScore')}</th><th>{t('colResult')}</th></tr>
              </thead>
              <tbody>
                {grouped[date].map((entry, i) => {
                  const pct = entry.total > 0 ? entry.score / entry.total : 0
                  const good = pct >= 0.6
                  const observed = getMode(entry.activityId) === 'observed'
                  return (
                    <tr key={i}>
                      <td>
                        <span style={{ marginRight: 8 }}>{getActivity(entry.activityId)?.icon || '📋'}</span>
                        <span style={{ fontWeight: 600 }}>{name(entry.activityId)}</span>
                        {entry.notes ? <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{entry.notes}</div> : null}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{entry.level} <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>({lvl(entry.level)})</span></td>
                      <td style={{ fontWeight: 700 }}>
                        {observed ? '—' : `${entry.score}/${entry.total}`}
                        {!observed && <span style={{ color: 'var(--text-muted)', fontSize: 14, marginLeft: 4 }}>({Math.round(pct * 100)}%)</span>}
                      </td>
                      <td><span className={good ? 'badge-good' : 'badge-needs-work'}>{good ? t('good') : t('needsWork')}</span></td>
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

function ReportTab({ progress, t, lang }) {
  const [copied, setCopied] = useState(false)
  const locale = lang === 'hi' ? 'hi-IN' : 'en-IN'
  const now = Date.now()
  const from = now - 7 * 86400000
  const log = progress.getFullLog().filter(h => h.timestamp >= from)

  const fromStr = new Date(from).toLocaleDateString(locale, { day: 'numeric', month: 'short' })
  const toStr = new Date(now).toLocaleDateString(locale, { day: 'numeric', month: 'short' })

  const daysActive = progress.getCompletedDays(7)
  const measured = progress.getAverage(7, 'measured')
  const observed = progress.getAverage(7, 'observed')

  // per-domain avg (7d)
  const byCat = {}
  CATEGORIES.forEach(c => { byCat[c] = { sum: 0, n: 0 } })
  log.forEach(e => {
    if (e.total <= 0) return
    const c = CATEGORY_OF[e.activityId]
    if (byCat[c]) { byCat[c].sum += e.score / e.total; byCat[c].n++ }
  })

  // notes + levels
  const notes = log.filter(e => e.notes && e.notes.trim())
  const practised = [...new Set(log.map(e => e.activityId))]

  function buildText() {
    const lines = []
    lines.push(`${t('weeklyReport')}: ${fromStr} – ${toStr}`)
    lines.push('')
    lines.push(`${t('reportDaysActive')}: ${daysActive}/7`)
    lines.push(`${t('reportSessions')}: ${log.length}`)
    lines.push(`${t('reportMeasured')}: ${measured === null ? '–' : measured + '%'}`)
    lines.push(`${t('reportObserved')}: ${observed === null ? '–' : observed + '%'}`)
    lines.push('')
    lines.push(`${t('reportByDomain')}:`)
    CATEGORIES.forEach(c => {
      const avg = byCat[c].n ? Math.round(byCat[c].sum / byCat[c].n * 100) + '%' : '–'
      lines.push(`  • ${t('cat.' + c)}: ${avg}`)
    })
    lines.push('')
    lines.push(`${t('reportNotes')}:`)
    if (notes.length) notes.forEach(e => lines.push(`  • ${pickField(getActivity(e.activityId), 'title', lang)}: ${e.notes}`))
    else lines.push(`  ${t('reportNoNotes')}`)
    return lines.join('\n')
  }

  function copy() {
    try {
      navigator.clipboard.writeText(buildText())
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  const Row = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <strong>{value}</strong>
    </div>
  )

  return (
    <div>
      <div className="flex gap-8 mb-16">
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => window.print()}>{t('printReport')}</button>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={copy}>{copied ? t('copied') : t('copyReport')}</button>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 4 }}>{t('weeklyReport')}</h3>
        <p className="text-muted mb-16">{t('reportRange', { from: fromStr, to: toStr })}</p>

        <Row label={t('reportDaysActive')} value={`${daysActive}/7`} />
        <Row label={t('reportSessions')} value={log.length} />
        <Row label={t('reportMeasured')} value={measured === null ? '–' : `${measured}%`} />
        <Row label={t('reportObserved')} value={observed === null ? '–' : `${observed}%`} />

        <div style={{ fontWeight: 700, margin: '18px 0 8px' }}>{t('reportByDomain')}</div>
        {CATEGORIES.map(c => {
          const avg = byCat[c].n ? Math.round(byCat[c].sum / byCat[c].n * 100) : null
          return <Row key={c} label={t('cat.' + c)} value={avg === null ? '–' : `${avg}%`} />
        })}

        <div style={{ fontWeight: 700, margin: '18px 0 8px' }}>{t('reportNotes')}</div>
        {notes.length ? notes.map((e, i) => (
          <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{pickField(getActivity(e.activityId), 'title', lang)} · {e.date}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 15 }}>{e.notes}</div>
          </div>
        )) : <p className="text-muted">{t('reportNoNotes')}</p>}

        <div style={{ fontWeight: 700, margin: '18px 0 8px' }}>{t('reportLevels')}</div>
        <div className="flex gap-8 wrap">
          {practised.map(id => (
            <span key={id} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '6px 12px', fontSize: 14 }}>
              {getActivity(id)?.icon} {pickField(getActivity(id), 'title', lang)} · {t('lvl.' + progress.getLevel(id))}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Progress({ onBack, progress }) {
  const { t, lang } = useLang()
  const [pin, setPin] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [tab, setTab] = useState('trends')
  const PIN = '1234'

  if (!unlocked) {
    const tryUnlock = () => { if (pin === PIN) setUnlocked(true); else alert(t('wrongPin')) }
    return (
      <div className="page" style={{ maxWidth: 400, margin: '0 auto' }}>
        <div className="activity-header">
          <button className="back-btn" onClick={onBack}>←</button>
          <h2 className="activity-title">{t('progress')}</h2>
        </div>
        <div className="card text-center" style={{ marginTop: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h3 style={{ marginBottom: 8 }}>{t('caregiverView')}</h3>
          <p className="text-muted mb-24">{t('enterPinToView')}</p>
          <input
            className="input text-center" type="password" inputMode="numeric"
            placeholder={t('enterPin')} value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') tryUnlock() }}
            style={{ marginBottom: 16, fontSize: 28, letterSpacing: 8 }}
          />
          <button className="btn btn-primary w-full" onClick={tryUnlock}>{t('unlock')}</button>
          <p className="text-muted mt-16" style={{ fontSize: 16 }}>{t('defaultPin')}</p>
        </div>
      </div>
    )
  }

  const TABS = [
    { id: 'trends', label: t('tabTrends') },
    { id: 'log', label: t('tabLog') },
    { id: 'report', label: t('tabReport') },
  ]

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2 className="activity-title">{t('progress')}</h2>
      </div>

      <div className="flex gap-8 mb-16">
        {TABS.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{
            flex: 1, padding: '10px 8px', borderRadius: 12, fontSize: 17, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 700,
            border: `2px solid ${tab === tb.id ? 'var(--primary)' : 'var(--border)'}`,
            background: tab === tb.id ? 'var(--primary)' : 'var(--surface)',
            color: tab === tb.id ? 'white' : 'var(--text)',
          }}>{tb.label}</button>
        ))}
      </div>

      {tab === 'trends' && <TrendsTab progress={progress} t={t} lang={lang} />}
      {tab === 'log' && <LogTab progress={progress} t={t} lang={lang} />}
      {tab === 'report' && <ReportTab progress={progress} t={t} lang={lang} />}
    </div>
  )
}
