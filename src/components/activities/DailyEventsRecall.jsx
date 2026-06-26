import { useState } from 'react'
import { getActivity } from '../../data/activities'
import ClockCanvas from './ClockCanvas'
import { useLang, pickField } from '../../i18n'

export default function DailyEventsRecall({ activityId, level, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)

  const formatClock = (clock) => {
    if (!clock) return ''
    if (clock.minute === 0) return t('oClock', { h: clock.hour })
    return `${clock.hour}:${String(clock.minute).padStart(2, '0')}`
  }
  const timeSlots = activity?.timeSlots || []

  // Pick 3 time slots based on current time (uses numeric start24 so it works in any language)
  const hour = new Date().getHours()
  const relevantSlots = timeSlots.filter(slot => slot.start24 <= hour).slice(-3)

  const slots = relevantSlots.length >= 2 ? relevantSlots : timeSlots.slice(0, 3)

  const [sIndex, setSIndex] = useState(0)
  const [step, setStep] = useState('clock') // clock | talk
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [caregiverRating, setCaregiverRating] = useState(null)

  if (done) {
    queueMicrotask(() => onDone(score, slots.length))
    return null
  }

  const slot = slots[sIndex]

  function submitAnswer() {
    setSubmitted(true)
  }

  function rate(good) {
    setCaregiverRating(good)
    if (good) setScore(s => s + 1)
    setTimeout(() => {
      setAnswer('')
      setSubmitted(false)
      setCaregiverRating(null)
      setStep('clock')
      if (sIndex + 1 >= slots.length) setDone(true)
      else setSIndex(i => i + 1)
    }, 800)
  }

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{pickField(activity, 'title', lang)}</div>
        <span className="level-badge">{t('level')} {level}</span>
      </div>

      <div className="progress-dots">
        {slots.map((_, i) => (
          <div key={i} className={`progress-dot ${i < sIndex ? 'done' : i === sIndex ? 'current' : ''}`} />
        ))}
      </div>

      <div className="card text-center" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 72 }}>{slot.icon}</div>
        <h2 style={{ marginTop: 8 }}>{slot.label}</h2>
        <p className="text-muted">{slot.time}</p>
      </div>

      {step === 'clock' && slot.clock ? (
        <div className="card text-center">
          <h3 className="mb-8">{t('drawClockFor', { time: formatClock(slot.clock) })}</h3>
          <p className="text-muted mb-16" style={{ fontSize: 16 }}>
            {t('drawClockSub')}
          </p>
          <ClockCanvas resetKey={`${sIndex}`} />
          <button className="btn btn-primary w-full mt-16" onClick={() => setStep('talk')}>
            {t('doneDrawing')}
          </button>
        </div>
      ) : (
      <div className="card">
        <h3 className="mb-16">{slot.prompt}</h3>
        {!submitted ? (
          <>
            <textarea
              className="textarea"
              rows={4}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder={t('talkPlaceholder')}
              autoFocus
            />
            <button
              className="btn btn-primary w-full mt-16"
              onClick={submitAnswer}
              disabled={!answer.trim()}
            >
              {t('doneTalking')}
            </button>
          </>
        ) : (
          <div>
            <div className="card" style={{ background: 'var(--bg)', marginBottom: 20 }}>
              <p style={{ fontSize: 20, fontStyle: 'italic', lineHeight: 1.7 }}>"{answer}"</p>
            </div>
            <p style={{ fontWeight: 700, marginBottom: 12, fontSize: 18, color: 'var(--text-muted)' }}>
              {t('caregiverHowRecall')}
            </p>
            <div className="flex gap-12">
              <button className="btn btn-success w-full" onClick={() => rate(true)}>
                {t('goodRecall')}
              </button>
              <button className="btn btn-error w-full" onClick={() => rate(false)}>
                {t('needsWork')}
              </button>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  )
}
