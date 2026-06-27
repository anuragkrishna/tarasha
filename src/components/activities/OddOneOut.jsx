import { useState } from 'react'
import { getActivityLevel, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'

export default function OddOneOut({ activityId, level, onDone, onBack }) {
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
          <div style={{ fontSize: 60 }}>🎉</div>
          <h2>{t('wellDone')}</h2>
          <div className="score-circle">
            {score}<span>/{questions.length}</span>
          </div>
          <p className="text-muted">{t('youGot', { score, total: questions.length })}</p>
          <button className="btn btn-primary btn-lg" onClick={() => onDone(score, questions.length)}>
            {t('backToActivities')}
          </button>
        </div>
      </div>
    )
  }

  if (!question) return null

  function handleSelect(item) {
    if (answered) return
    setSelected(item.label)
    if (item.label === question.answer) setScore(s => s + 1)
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

      <div className="card text-center mb-16">
        <p style={{ fontSize: 22, fontWeight: 600 }}>
          {t('oddTitleQ', { i: qIndex + 1, n: questions.length })}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {question.items.map((item, i) => {
          const isSelected = selected === item.label
          const isAnswer = item.label === question.answer
          // After answering: highlight the right answer green and a wrong pick red.
          const cardCorrect = answered && isAnswer
          const cardWrong = answered && isSelected && !isAnswer

          return (
            <button
              key={i}
              onClick={() => handleSelect(item)}
              style={{
                background: cardCorrect ? 'var(--ok-bg)' : cardWrong ? 'var(--err-bg)' : 'var(--surface)',
                border: `3px solid ${cardCorrect ? 'var(--success)' : cardWrong ? 'var(--error)' : 'var(--border)'}`,
                borderRadius: 20,
                padding: '24px 16px',
                cursor: answered ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                boxShadow: answered ? 'none' : 'var(--shadow)',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <span style={{ fontSize: 72, lineHeight: 1 }}>{item.emoji}</span>
              <span style={{ fontSize: 22, fontWeight: 600, fontFamily: 'inherit' }}>{item.label}</span>
            </button>
          )
        })}
      </div>

      {answered && (
        <>
          <div style={{
            marginTop: 16, padding: 14, borderRadius: 12,
            background: isCorrect ? 'var(--ok-bg)' : 'var(--err-bg)',
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
