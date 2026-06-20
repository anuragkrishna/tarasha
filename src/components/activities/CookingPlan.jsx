import { useState, useMemo } from 'react'
import { getActivityLevel, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function CookingPlan({ activityId, level, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)
  const levelData = getActivityLevel(activityId, level, lang)
  const recipes = levelData?.recipes || []

  const [rIndex, setRIndex] = useState(0)
  const [selected, setSelected] = useState([]) // user's ordered selection
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const recipe = recipes[rIndex]
  const shuffled = useMemo(() => recipe ? shuffle(recipe.steps) : [], [rIndex, recipe])

  if (done) {
    return (
      <div className="page">
        <div className="complete-screen">
          <div style={{ fontSize: 60 }}>🍳</div>
          <h2>{t('wellDone')}</h2>
          <div className="score-circle">{score}<span>/{recipes.length}</span></div>
          <button className="btn btn-primary btn-lg" onClick={() => onDone(score, recipes.length)}>
            {t('backToActivities')}
          </button>
        </div>
      </div>
    )
  }

  if (!recipe) return null

  const remaining = shuffled.filter(s => !selected.includes(s))

  function selectStep(step) {
    if (submitted) return
    setSelected(s => [...s, step])
  }

  function removeStep(index) {
    if (submitted) return
    setSelected(s => s.filter((_, i) => i !== index))
  }

  function submit() {
    const correct = selected.every((step, i) => step === recipe.steps[i])
    if (correct) setScore(s => s + 1)
    setSubmitted(true)
  }

  function next() {
    setSelected([])
    setSubmitted(false)
    if (rIndex + 1 >= recipes.length) setDone(true)
    else setRIndex(i => i + 1)
  }

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{pickField(activity, 'title', lang)}</div>
        <span className="level-badge">{t('level')} {level}</span>
      </div>

      <div className="instruction-box">
        {t('arrangeSteps')} — <strong>{recipe.dish}</strong>
      </div>

      {/* User's order */}
      <div className="card mb-16">
        <p style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)', fontSize: 18 }}>{t('yourOrder')}</p>
        {selected.length === 0 && (
          <p className="text-muted" style={{ fontSize: 18, fontStyle: 'italic' }}>{t('tapStepAdd')}</p>
        )}
        {selected.map((step, i) => {
          const isCorrect = submitted && step === recipe.steps[i]
          const isWrong = submitted && step !== recipe.steps[i]
          return (
            <div
              key={i}
              onClick={() => removeStep(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 10, marginBottom: 8,
                background: isCorrect ? '#EAFAF1' : isWrong ? '#FDEDEC' : '#E6F7F4',
                border: `2px solid ${isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : 'var(--primary)'}`,
                cursor: submitted ? 'default' : 'pointer', fontSize: 19
              }}
            >
              <span style={{
                background: isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : 'var(--primary)',
                color: 'white', borderRadius: '50%',
                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 16, flexShrink: 0
              }}>{i + 1}</span>
              {step}
              {!submitted && <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>✕</span>}
            </div>
          )
        })}
      </div>

      {/* Available steps */}
      {!submitted && (
        <div className="card mb-16">
          <p style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)', fontSize: 18 }}>{t('stepsTapAdd')}</p>
          {remaining.map((step, i) => (
            <button
              key={i}
              onClick={() => selectStep(step)}
              style={{
                width: '100%', textAlign: 'left', padding: '12px 16px',
                borderRadius: 10, marginBottom: 8, fontSize: 19,
                background: 'var(--surface)', border: '2px solid var(--border)',
                fontFamily: 'inherit', cursor: 'pointer',
              }}
            >
              {step}
            </button>
          ))}
          {remaining.length === 0 && (
            <p className="text-muted" style={{ fontStyle: 'italic' }}>{t('allStepsPlaced')}</p>
          )}
        </div>
      )}

      {submitted && (
        <div className="card mb-16">
          <p style={{ fontWeight: 700, marginBottom: 12 }}>{t('correctOrder')}</p>
          {recipe.steps.map((step, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, alignItems: 'center',
              padding: '10px 14px', borderRadius: 10, marginBottom: 6,
              background: '#EAFAF1', border: '2px solid var(--success)', fontSize: 19
            }}>
              <span style={{
                background: 'var(--success)', color: 'white', borderRadius: '50%',
                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 15, flexShrink: 0
              }}>{i + 1}</span>
              {step}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-12">
        {!submitted ? (
          <button
            className="btn btn-primary w-full"
            onClick={submit}
            disabled={selected.length < recipe.steps.length}
          >
            {t('checkOrder')}
          </button>
        ) : (
          <button className="btn btn-primary w-full" onClick={next}>
            {rIndex + 1 < recipes.length ? t('nextArrow') : t('finish')}
          </button>
        )}
      </div>
    </div>
  )
}
