import { useState } from 'react'
import { getActivityLevel, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'

export default function Categorisation({ activityId, level, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)
  const levelData = getActivityLevel(activityId, level, lang)
  const rounds = levelData?.rounds || []

  const [rIndex, setRIndex] = useState(0)
  const [itemIndex, setItemIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  // total = every item across every round
  const totalItems = rounds.reduce((sum, r) => sum + r.items.length, 0)

  if (done) {
    return (
      <div className="page">
        <div className="complete-screen">
          <div style={{ fontSize: 60 }}>🎉</div>
          <h2>{t('wellSorted')}</h2>
          <div className="score-circle">{score}<span>/{totalItems}</span></div>
          <p className="text-muted">{t('youGot', { score, total: totalItems })}</p>
          <button className="btn btn-primary btn-lg" onClick={() => onDone(score, totalItems)}>
            {t('backToActivities')}
          </button>
        </div>
      </div>
    )
  }

  const round = rounds[rIndex]
  if (!round) return null
  const item = round.items[itemIndex]

  function handleSelect(category) {
    if (showFeedback) return
    setSelected(category.label)
    if (category.label === item.category) setScore(s => s + 1)
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      setSelected(null)
      const lastItem = itemIndex + 1 >= round.items.length
      if (!lastItem) {
        setItemIndex(i => i + 1)
      } else if (rIndex + 1 >= rounds.length) {
        setDone(true)
      } else {
        setRIndex(i => i + 1)
        setItemIndex(0)
      }
    }, 1200)
  }

  const isCorrect = selected === item.category

  return (
    <div className="page">
      {showFeedback && (
        <div className={`feedback-overlay ${isCorrect ? 'correct' : 'wrong'}`}>
          <div className="feedback-icon">{isCorrect ? '✓' : '✗'}</div>
          <div className="feedback-text">
            {isCorrect ? t('correct') : t('isA', { label: item.label, category: item.category })}
          </div>
        </div>
      )}

      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{pickField(activity, 'title', lang)}</div>
        <span className="level-badge">{t('level')} {level}</span>
      </div>

      <div className="progress-dots">
        {round.items.map((_, i) => (
          <div key={i} className={`progress-dot ${i < itemIndex ? 'done' : i === itemIndex ? 'current' : ''}`} />
        ))}
      </div>

      <div className="card text-center mb-16">
        <p className="text-muted mb-8" style={{ fontSize: 16 }}>
          {t('sortPrompt', { i: rIndex + 1, n: rounds.length })}
        </p>
        <div style={{ fontSize: 80, lineHeight: 1, marginBottom: 8 }}>{item.emoji}</div>
        <div style={{ fontSize: 26, fontWeight: 700 }}>{item.label}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: round.categories.length > 2 ? '1fr 1fr' : '1fr 1fr', gap: 16 }}>
        {round.categories.map((cat, i) => {
          const isSelected = selected === cat.label
          const cardCorrect = isSelected && isCorrect
          const cardWrong = isSelected && !isCorrect
          return (
            <button
              key={i}
              onClick={() => handleSelect(cat)}
              style={{
                background: cardCorrect ? '#EAFAF1' : cardWrong ? '#FDEDEC' : 'white',
                border: `3px solid ${cardCorrect ? 'var(--success)' : cardWrong ? 'var(--error)' : 'var(--border)'}`,
                borderRadius: 20,
                padding: '20px 16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                boxShadow: isSelected ? 'none' : 'var(--shadow)',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <span style={{ fontSize: 48, lineHeight: 1 }}>{cat.emoji}</span>
              <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'inherit' }}>{cat.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
