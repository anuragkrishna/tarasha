import { getActivity } from '../data/activities'
import { useLang, pickField } from '../i18n'

export default function ResultScreen({ activityId, result, onConfirm, sessionStep = null }) {
  const { t, lang } = useLang()
  const isLastInSession = sessionStep && sessionStep.index >= sessionStep.total - 1
  const doneLabel = sessionStep ? (isLastInSession ? t('finishSession') : t('nextActivity')) : t('done')
  const activity = getActivity(activityId)
  const { score, total, newLevel } = result
  const pct = total > 0 ? Math.round((score / total) * 100) : 0

  return (
    <div className="page" style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
      {sessionStep && (
        <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, color: 'var(--primary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {t('activityOf', { i: sessionStep.index + 1, n: sessionStep.total })}
        </div>
      )}

      <div className="card text-center mb-16" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{activity?.icon}</div>
        <h2 style={{ marginBottom: 16 }}>{pickField(activity, 'title', lang)}</h2>
        <div className="score-circle" style={{ margin: '0 auto 16px' }}>
          {score}<span>/{total}</span>
        </div>
        <div style={{
          fontSize: 22, fontWeight: 700,
          color: pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--error)'
        }}>
          {t('pctCorrect', { pct })}
        </div>
      </div>

      {/* Level adjusts silently in the background — just continue the day's plan. */}
      <button className="btn btn-primary btn-lg w-full" onClick={() => onConfirm(newLevel, '')}>
        {doneLabel}
      </button>
    </div>
  )
}
