import { useState } from 'react'
import { getActivityLevel, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'

export default function WeightsConcept({ activityId, level, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)
  const levelData = getActivityLevel(activityId, level, lang)
  const questions = levelData?.questions || []

  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const question = questions[qIndex]

  if (done) {
    return (
      <div className="page">
        <div className="complete-screen">
          <div style={{ fontSize: 60 }}>⚖️</div>
          <h2>{t('wellDone')}</h2>
          <div className="score-circle">{score}<span>/{questions.length}</span></div>
          <button className="btn btn-primary btn-lg" onClick={() => onDone(score, questions.length)}>
            {t('backToActivities')}
          </button>
        </div>
      </div>
    )
  }

  if (!question) return null

  function handleSelect(opt) {
    if (answered) return
    setSelected(opt)
    if (opt === question.answer) setScore(s => s + 1)
    setAnswered(true)
  }

  function next() {
    setAnswered(false)
    setSelected(null)
    if (qIndex + 1 >= questions.length) setDone(true)
    else setQIndex(i => i + 1)
  }

  const isCorrect = selected === question.answer
  const isLast = qIndex + 1 >= questions.length

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{pickField(activity, 'title', lang)}</div>
        <span className="level-badge">{t('level')} {level}</span>
      </div>

      <div className="progress-dots">
        {questions.map((_, i) => (
          <div key={i} className={`progress-dot ${i < qIndex ? 'done' : i === qIndex ? 'current' : ''}`} />
        ))}
      </div>

      <div className="card text-center" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚖️</div>
        <h2 style={{ fontSize: 24 }}>{question.question}</h2>
        {question.hint && level === 1 && (
          <p className="text-muted mt-8" style={{ fontSize: 17 }}>{question.hint}</p>
        )}
      </div>

      <div className="choice-grid"
        style={question.options.length === 2 ? { gridTemplateColumns: '1fr 1fr' } : { gridTemplateColumns: 'repeat(2, 1fr)' }}
      >
        {question.options.map((opt, i) => {
          // After answering: highlight the right answer green and a wrong pick red.
          const cls = answered
            ? (opt === question.answer ? 'correct' : opt === selected ? 'wrong' : '')
            : ''
          return (
            <button
              key={i}
              className={`choice-btn ${cls}`}
              style={{ fontSize: question.options.length === 2 ? 28 : 22 }}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <>
          <div style={{
            marginTop: 20, padding: 14, borderRadius: 12,
            background: isCorrect ? '#EAFAF1' : '#FDEDEC',
            color: isCorrect ? 'var(--success)' : 'var(--error)',
            fontWeight: 600, fontSize: 19, textAlign: 'center',
          }}>
            {isCorrect ? `✓ ${t('correct')}` : `✗ ${t('answerWas', { a: question.answer })}`}
            {!isCorrect && question.hint && (
              <div style={{ fontSize: 16, opacity: 0.9, marginTop: 4 }}>{question.hint}</div>
            )}
          </div>
          <button className="btn btn-primary btn-lg w-full" style={{ marginTop: 16 }} onClick={next}>
            {isLast ? t('finish') : t('nextQuestion')}
          </button>
        </>
      )}
    </div>
  )
}
