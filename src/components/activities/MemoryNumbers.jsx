import { useState, useEffect } from 'react'
import { getActivityLevel, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'

export default function MemoryNumbers({ activityId, level, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)
  const levelData = getActivityLevel(activityId, level, lang)
  const numbers = levelData?.numbers || []
  const showDuration = levelData?.showDuration || 5000

  const [nIndex, setNIndex] = useState(0)
  const [phase, setPhase] = useState('show') // show | recall | result
  const [timeLeft, setTimeLeft] = useState(Math.ceil(showDuration / 1000))
  const [typed, setTyped] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (phase !== 'show') return
    setTimeLeft(Math.ceil(showDuration / 1000))
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval)
          setPhase('recall')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [phase, nIndex, showDuration])

  if (done) {
    return (
      <div className="page">
        <div className="complete-screen">
          <div style={{ fontSize: 60 }}>🧠</div>
          <h2>{t('wellDone')}</h2>
          <div className="score-circle">{score}<span>/{numbers.length}</span></div>
          <button className="btn btn-primary btn-lg" onClick={() => onDone(score, numbers.length)}>
            {t('backToActivities')}
          </button>
        </div>
      </div>
    )
  }

  const number = numbers[nIndex]

  function submit() {
    const correct = typed.trim() === number
    setIsCorrect(correct)
    if (correct) setScore(s => s + 1)
    setSubmitted(true)
    setPhase('result')
  }

  function next() {
    setTyped('')
    setSubmitted(false)
    setPhase('show')
    if (nIndex + 1 >= numbers.length) setDone(true)
    else setNIndex(i => i + 1)
  }

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{pickField(activity, 'title', lang)}</div>
        <span className="level-badge">{t('level')} {level}</span>
      </div>

      <div className="progress-dots">
        {numbers.map((_, i) => (
          <div key={i} className={`progress-dot ${i < nIndex ? 'done' : i === nIndex ? 'current' : ''}`} />
        ))}
      </div>

      {phase === 'show' && (
        <div className="card text-center" style={{ marginTop: 40 }}>
          <p className="text-muted mb-16">{t('rememberNumber')}</p>
          <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: 8, color: 'var(--primary)', marginBottom: 24 }}>
            {number}
          </div>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 700, margin: '0 auto'
          }}>
            {timeLeft}
          </div>
          <p className="text-muted mt-16">{t('secondsRemaining')}</p>
        </div>
      )}

      {phase === 'recall' && (
        <div className="card" style={{ marginTop: 40 }}>
          <h3 className="mb-16 text-center">{t('whatNumber')}</h3>
          <input
            className="input text-center"
            style={{ fontSize: 36, letterSpacing: 6, marginBottom: 16 }}
            type="tel"
            inputMode="numeric"
            value={typed}
            onChange={e => setTyped(e.target.value.replace(/\D/g, ''))}
            placeholder={t('typeNumber')}
            autoFocus
          />
          <button className="btn btn-primary w-full" onClick={submit} disabled={!typed}>
            {t('submit')}
          </button>
          <button className="btn btn-ghost w-full" style={{ marginTop: 10 }} onClick={() => setPhase('show')}>
            {t('showAgain')}
          </button>
        </div>
      )}

      {phase === 'result' && (
        <div className="card text-center" style={{ marginTop: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{isCorrect ? '✓' : '✗'}</div>
          <h3 style={{ color: isCorrect ? 'var(--success)' : 'var(--error)', marginBottom: 12 }}>
            {isCorrect ? t('correct') : t('notQuite')}
          </h3>
          {!isCorrect && (
            <p style={{ marginBottom: 8 }}>{t('numberWas')} <strong style={{ fontSize: 28, letterSpacing: 4 }}>{number}</strong></p>
          )}
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>{t('youTyped')} <strong>{typed}</strong></p>
          <button className="btn btn-primary" onClick={next}>
            {nIndex + 1 < numbers.length ? t('nextArrow') : t('finish')}
          </button>
        </div>
      )}
    </div>
  )
}
