import { useState } from 'react'
import { getActivityLevel, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'

function buildSequence(start, step, count) {
  const seq = []
  for (let i = 0; i < count + 1; i++) seq.push(start - i * step)
  return seq
}

export default function ReverseCounting({ activityId, level, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)
  const levelData = getActivityLevel(activityId, level, lang)
  const sequences = levelData?.sequences || []

  const [sIndex, setSIndex] = useState(0)
  const [step, setStep] = useState(0)  // which number in sequence we're on (step 0 is shown)
  const [typed, setTyped] = useState('')
  const [feedback, setFeedback] = useState(null) // null | 'correct' | 'wrong'
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [done, setDone] = useState(false)

  const seq = sequences[sIndex]
  if (!seq || done) {
    if (done) {
      return (
        <div className="page">
          <div className="complete-screen">
            <div style={{ fontSize: 60 }}>🔢</div>
            <h2>{t('wellDone')}</h2>
            <div className="score-circle">{score}<span>/{attempts}</span></div>
            <button className="btn btn-primary btn-lg" onClick={() => onDone(score, attempts)}>
              {t('backToActivities')}
            </button>
          </div>
        </div>
      )
    }
    return null
  }

  const fullSeq = buildSequence(seq.start, seq.step, seq.count)
  // step 0 = showing first number, steps 1..count = asking for next
  const shown = fullSeq.slice(0, step + 1)
  const nextCorrect = fullSeq[step + 1]

  function submit() {
    const correct = parseInt(typed) === nextCorrect
    setAttempts(a => a + 1)
    if (correct) setScore(s => s + 1)
    setFeedback(correct ? 'correct' : 'wrong')
    setTimeout(() => {
      setFeedback(null)
      setTyped('')
      const newStep = step + 1
      if (newStep >= seq.count) {
        // Sequence done, move to next
        if (sIndex + 1 >= sequences.length) setDone(true)
        else { setSIndex(i => i + 1); setStep(0) }
      } else {
        setStep(newStep)
      }
    }, 1000)
  }

  return (
    <div className="page">
      {feedback && (
        <div className={`feedback-overlay ${feedback}`}>
          <div className="feedback-icon">{feedback === 'correct' ? '✓' : '✗'}</div>
          <div className="feedback-text">
            {feedback === 'correct' ? t('correct') : t('answerWas', { a: nextCorrect })}
          </div>
        </div>
      )}

      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{pickField(activity, 'title', lang)}</div>
        <span className="level-badge">{t('level')} {level}</span>
      </div>

      <div className="instruction-box">
        {levelData.description} — {t('startingFrom')} <strong>{seq.start}</strong>
      </div>

      <div className="card mb-16">
        <p className="text-muted mb-12" style={{ fontSize: 18 }}>{t('numbersSoFar')}</p>
        <div className="flex gap-12 wrap">
          {shown.map((n, i) => (
            <span key={i} style={{
              fontSize: 32, fontWeight: 700,
              background: i === shown.length - 1 ? 'var(--primary)' : 'var(--bg)',
              color: i === shown.length - 1 ? 'white' : 'var(--text)',
              padding: '8px 16px', borderRadius: 10,
              border: '2px solid var(--border)'
            }}>{n}</span>
          ))}
          <span style={{
            fontSize: 32, fontWeight: 700,
            padding: '8px 16px', borderRadius: 10,
            border: '2px dashed var(--primary)',
            color: 'var(--primary)', minWidth: 64, textAlign: 'center'
          }}>?</span>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-16">{t('fillGap')}</h3>
        <input
          className="input"
          style={{ fontSize: 36, textAlign: 'center', marginBottom: 16 }}
          type="tel"
          inputMode="numeric"
          value={typed}
          onChange={e => setTyped(e.target.value.replace(/\D/g, ''))}
          placeholder="?"
          autoFocus
          onKeyDown={e => e.key === 'Enter' && typed && submit()}
        />
        <button className="btn btn-primary w-full" onClick={submit} disabled={!typed}>
          {t('submit')}
        </button>
      </div>

      <div className="text-center mt-16 text-muted">
        {t('sequenceOf', { i: sIndex + 1, n: sequences.length })}
      </div>
    </div>
  )
}
