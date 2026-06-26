import { useState, useEffect } from 'react'
import { getActivityLevel, getLadderContent, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'

export default function DelayedRecall({ activityId, level, exposure = 0, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)
  const levelData = getLadderContent(activityId, exposure, lang, 2) || getActivityLevel(activityId, level, lang)
  const rounds = levelData?.rounds || []
  const showDuration = levelData?.showDuration || 5000

  const [rIndex, setRIndex] = useState(0)
  const [phase, setPhase] = useState('show') // show | distract | recall | result
  const [timeLeft, setTimeLeft] = useState(Math.ceil(showDuration / 1000))
  const [distractIndex, setDistractIndex] = useState(0)
  const [distractInput, setDistractInput] = useState('')
  const [recalled, setRecalled] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const round = rounds[rIndex]

  // Countdown while showing the items
  useEffect(() => {
    if (phase !== 'show') return
    setTimeLeft(Math.ceil(showDuration / 1000))
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval)
          setPhase('distract')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [phase, rIndex, showDuration])

  if (done) {
    queueMicrotask(() => onDone(score, rounds.length))
    return null
  }

  if (!round) return null
  const distraction = round.distraction || []
  const distractQ = distraction[distractIndex]

  function submitDistraction() {
    // We don't score the distraction — it's just to create a delay.
    if (distractIndex + 1 >= distraction.length) {
      setPhase('recall')
    } else {
      setDistractIndex(i => i + 1)
    }
    setDistractInput('')
  }

  function checkRecall() {
    const words = recalled.toLowerCase().split(/[\s,،]+/).filter(Boolean)
    const correct = round.items.filter(itm =>
      words.some(w => itm.toLowerCase().includes(w) || w.includes(itm.toLowerCase().slice(0, 3)))
    ).length
    setScore(s => s + (correct >= Math.ceil(round.items.length * 0.6) ? 1 : 0))
    setSubmitted(true)
  }

  function next() {
    setRecalled('')
    setSubmitted(false)
    setDistractIndex(0)
    setPhase('show')
    if (rIndex + 1 >= rounds.length) setDone(true)
    else setRIndex(i => i + 1)
  }

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{pickField(activity, 'title', lang)}</div>
        <span className="level-badge">{t('level')} {levelData?.level || level}</span>
      </div>

      <div className="progress-dots">
        {rounds.map((_, i) => (
          <div key={i} className={`progress-dot ${i < rIndex ? 'done' : i === rIndex ? 'current' : ''}`} />
        ))}
      </div>

      {phase === 'show' && (
        <div className="card text-center" style={{ marginTop: 20 }}>
          <p className="text-muted mb-16">{t('rememberItems')}</p>
          <div className="flex gap-12 wrap" style={{ justifyContent: 'center', marginBottom: 20 }}>
            {round.items.map((itm, i) => (
              <span key={i} style={{
                padding: '12px 20px', borderRadius: 12, fontSize: 24, fontWeight: 700,
                background: 'var(--bg)', color: 'var(--primary)', border: '2px solid var(--border)'
              }}>{itm}</span>
            ))}
          </div>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700, margin: '0 auto'
          }}>{timeLeft}</div>
        </div>
      )}

      {phase === 'distract' && distractQ && (
        <div className="card" style={{ marginTop: 20 }}>
          <p className="text-muted mb-8">{t('quickQuestion', { i: distractIndex + 1, n: distraction.length })}</p>
          <h3 className="mb-16">{distractQ.question}</h3>
          <input
            className="textarea"
            style={{ minHeight: 'unset', height: 56, fontSize: 22 }}
            value={distractInput}
            onChange={e => setDistractInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && distractInput.trim()) submitDistraction() }}
            placeholder={t('typeAnswer')}
            autoFocus
          />
          <button className="btn btn-primary w-full mt-16" onClick={submitDistraction} disabled={!distractInput.trim()}>
            {t('next')}
          </button>
        </div>
      )}

      {phase === 'recall' && !submitted && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 className="mb-8">{t('whatItemsStart')}</h3>
          <p className="text-muted mb-16">{t('typeItemsComma')}</p>
          <textarea
            className="textarea"
            rows={4}
            value={recalled}
            onChange={e => setRecalled(e.target.value)}
            placeholder="e.g. Apple, Bus, Dog"
            autoFocus
          />
          <button className="btn btn-primary w-full mt-16" onClick={checkRecall} disabled={!recalled.trim()}>
            {t('checkAnswers')}
          </button>
          <button className="btn btn-ghost w-full" style={{ marginTop: 10 }} onClick={() => { setDistractIndex(0); setPhase('show') }}>
            {t('showAgain')}
          </button>
        </div>
      )}

      {phase === 'recall' && submitted && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 className="mb-16">{t('itemsWere')}</h3>
          <div className="flex gap-12 wrap mb-24">
            {round.items.map((itm, i) => {
              const typed = recalled.toLowerCase()
              const found = typed.includes(itm.toLowerCase()) || typed.includes(itm.toLowerCase().slice(0, 4))
              return (
                <span key={i} style={{
                  padding: '8px 16px', borderRadius: 10, fontSize: 22, fontWeight: 600,
                  background: found ? '#EAFAF1' : '#FDEDEC',
                  color: found ? 'var(--success)' : 'var(--error)',
                  border: `2px solid ${found ? 'var(--success)' : 'var(--error)'}`
                }}>
                  {found ? '✓' : '✗'} {itm}
                </span>
              )
            })}
          </div>
          <button className="btn btn-primary" onClick={next}>
            {rIndex + 1 < rounds.length ? t('nextArrow') : t('finish')}
          </button>
        </div>
      )}
    </div>
  )
}
