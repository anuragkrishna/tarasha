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
  const [showFeedback, setShowFeedback] = useState(false)
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
    if (showFeedback) return
    setSelected(item.label)
    const correct = item.label === question.answer
    if (correct) setScore(s => s + 1)
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      setSelected(null)
      if (qIndex + 1 >= questions.length) setDone(true)
      else setQIndex(i => i + 1)
    }, 1400)
  }

  const isCorrect = selected === question.answer

  return (
    <div className="page">
      {showFeedback && (
        <div className={`feedback-overlay ${isCorrect ? 'correct' : 'wrong'}`}>
          <div className="feedback-icon">{isCorrect ? '✓' : '✗'}</div>
          <div className="feedback-text">
            {isCorrect ? t('correct') : t('answerWas', { a: question.answer })}
          </div>
          {!isCorrect && question.hint && (
            <div style={{ color: 'white', fontSize: 20, opacity: 0.9 }}>{question.hint}</div>
          )}
        </div>
      )}

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
          const cardCorrect = isSelected && isCorrect
          const cardWrong = isSelected && !isCorrect

          return (
            <button
              key={i}
              onClick={() => handleSelect(item)}
              style={{
                background: cardCorrect ? '#EAFAF1' : cardWrong ? '#FDEDEC' : 'white',
                border: `3px solid ${cardCorrect ? 'var(--success)' : cardWrong ? 'var(--error)' : 'var(--border)'}`,
                borderRadius: 20,
                padding: '24px 16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                boxShadow: isSelected ? 'none' : 'var(--shadow)',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <span style={{ fontSize: 72, lineHeight: 1 }}>{item.emoji}</span>
              <span style={{ fontSize: 22, fontWeight: 600, fontFamily: 'inherit' }}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
