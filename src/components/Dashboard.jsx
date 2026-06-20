import { getActivity } from '../data/activities'
import { getMode } from '../dailyPlan'
import { useLang, pickField } from '../i18n'

function TodaysPlanCard({ progress, onStartActivity, onStartSession }) {
  const { t, lang } = useLang()
  const plan = progress.getTodayPlan()
  const doneCount = plan.filter(id => progress.isDoneToday(id)).length
  const allDone = doneCount === plan.length
  const pct = plan.length ? Math.round((doneCount / plan.length) * 100) : 0

  return (
    <div className="card mb-16" style={{ padding: '20px 24px', border: '2px solid var(--primary)' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{t('todaysPlan')}</div>
          <div style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 2 }}>
            {allDone ? t('reviewOrPractice') : t('planSubtitle')}
          </div>
        </div>
        <div style={{ fontSize: 26 }}>🗓️</div>
      </div>

      <div style={{ background: 'var(--border)', borderRadius: 8, height: 8, margin: '8px 0 14px', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 8, width: `${pct}%`, background: allDone ? 'var(--success)' : 'var(--primary)', transition: 'width 0.4s ease' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 14 }}>
        {plan.map((id, i) => {
          const meta = getActivity(id)
          const done = progress.isDoneToday(id)
          return (
            <div
              key={id}
              onClick={() => onStartActivity(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', cursor: 'pointer',
                borderBottom: i < plan.length - 1 ? '1px solid var(--border)' : 'none',
                opacity: done ? 0.55 : 1,
              }}
            >
              <span style={{ fontSize: 24, width: 32, textAlign: 'center', flexShrink: 0 }}>{meta?.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 600 }}>{pickField(meta, 'title', lang)}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t(getMode(id))}</div>
              </div>
              <span style={{ fontSize: 20, flexShrink: 0, color: done ? 'var(--success)' : 'var(--border)' }}>
                {done ? '✓' : '○'}
              </span>
            </div>
          )
        })}
      </div>

      {allDone ? (
        <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 700, color: 'var(--success)', padding: '4px 0' }}>
          {t('planAllDone')}
        </div>
      ) : (
        <button className="btn btn-primary btn-lg w-full" onClick={onStartSession}>
          {doneCount > 0 ? t('continueSession') : t('startSession')}
        </button>
      )}
    </div>
  )
}

export default function Dashboard({ onStartActivity, onStartSession, onViewLog, progress }) {
  const { t, lang, setLang } = useLang()
  const locale = lang === 'hi' ? 'hi-IN' : 'en-IN'

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-16">
        <div>
          <h1>Tarasha</h1>
          <p className="text-muted">{new Date().toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Language toggle */}
          <button
            className="btn btn-ghost"
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            style={{ minWidth: 'unset', padding: '12px 16px', minHeight: 'unset' }}
            title="Switch language"
          >
            {lang === 'hi' ? 'EN' : 'हिं'}
          </button>
          <button className="btn btn-ghost" onClick={onViewLog} style={{ minWidth: 'unset', padding: '12px 20px', minHeight: 'unset' }}>
            📊 {t('progress')}
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => { if (window.confirm(t('resetConfirm'))) progress.resetAll() }}
            style={{ minWidth: 'unset', padding: '12px 16px', minHeight: 'unset' }}
            title={t('reset')}
          >
            🔄
          </button>
        </div>
      </div>

      <TodaysPlanCard progress={progress} onStartActivity={onStartActivity} onStartSession={onStartSession} />

      <div style={{ height: 24 }} />
    </div>
  )
}
