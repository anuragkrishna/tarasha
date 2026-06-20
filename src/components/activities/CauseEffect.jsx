import { useState, useMemo, Fragment } from 'react'
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

export default function CauseEffect({ activityId, level, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)
  const levelData = getActivityLevel(activityId, level, lang)
  const pairs = levelData?.pairs || []

  const shuffledEffects = useMemo(() => shuffle(pairs.map(p => p.effect)), [pairs])

  const [selected, setSelected] = useState(null) // index in causes
  const [matched, setMatched] = useState({}) // cause index -> effect
  const [wrong, setWrong] = useState(null)
  const [done, setDone] = useState(false)
  const [score, setScore] = useState(0)

  function selectCause(i) {
    if (matched[i]) return
    setSelected(i)
  }

  function selectEffect(effect) {
    if (selected === null) return
    const correctEffect = pairs[selected].effect
    if (effect === correctEffect) {
      setMatched(m => ({ ...m, [selected]: effect }))
      setScore(s => s + 1)
      setSelected(null)
      if (Object.keys(matched).length + 1 >= pairs.length) {
        setTimeout(() => setDone(true), 600)
      }
    } else {
      setWrong(effect)
      setTimeout(() => setWrong(null), 800)
    }
  }

  if (done) {
    return (
      <div className="page">
        <div className="complete-screen">
          <div style={{ fontSize: 60 }}>↔️</div>
          <h2>{t('wellDone')}</h2>
          <div className="score-circle">{score}<span>/{pairs.length}</span></div>
          <button className="btn btn-primary btn-lg" onClick={() => onDone(score, pairs.length)}>
            {t('backToActivities')}
          </button>
        </div>
      </div>
    )
  }

  const matchedEffects = Object.values(matched)

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{pickField(activity, 'title', lang)}</div>
        <span className="level-badge">{t('level')} {level}</span>
      </div>

      <div className="instruction-box">
        {t('causeEffectInstruction')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 10, rowGap: 10, alignItems: 'stretch' }}>
        {/* Column headers */}
        <div style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: 15, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('causeLabel')}</div>
        <div style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: 15, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('effectLabel')}</div>

        {pairs.map((pair, i) => {
          const effect = shuffledEffects[i]
          const causeMatched = matched[i] !== undefined
          const causeSelected = selected === i
          const effectMatched = matchedEffects.includes(effect)
          const effectWrong = wrong === effect
          const cellBase = {
            width: '100%', height: '100%', minHeight: 64,
            padding: '12px 10px', borderRadius: 12, fontSize: 16, lineHeight: 1.3,
            fontFamily: 'inherit', textAlign: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }
          return (
            <Fragment key={i}>
              <button
                onClick={() => selectCause(i)}
                style={{
                  ...cellBase,
                  cursor: causeMatched ? 'default' : 'pointer',
                  border: `3px solid ${causeSelected ? 'var(--primary)' : causeMatched ? 'var(--success)' : 'var(--border)'}`,
                  background: causeSelected ? '#E6F7F4' : causeMatched ? '#EAFAF1' : 'var(--surface)',
                  fontWeight: causeSelected ? 700 : 500,
                  opacity: causeMatched ? 0.7 : 1,
                }}
              >
                {causeMatched ? '✓ ' : ''}{pair.cause}
              </button>
              <button
                onClick={() => !effectMatched && selectEffect(effect)}
                style={{
                  ...cellBase,
                  cursor: effectMatched ? 'default' : 'pointer',
                  border: `3px solid ${effectWrong ? 'var(--error)' : effectMatched ? 'var(--success)' : selected !== null ? 'var(--primary)' : 'var(--border)'}`,
                  background: effectWrong ? '#FDEDEC' : effectMatched ? '#EAFAF1' : selected !== null ? '#E6F7F4' : 'var(--surface)',
                  fontWeight: 500,
                  opacity: effectMatched ? 0.7 : 1,
                }}
              >
                {effectMatched ? '✓ ' : ''}{effect}
              </button>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
