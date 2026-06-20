import { useState } from 'react'
import { getActivityLevel, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'

export default function PictureStory({ activityId, level, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)
  const levelData = getActivityLevel(activityId, level, lang)
  const stories = levelData?.stories || []

  const [stIndex, setStIndex] = useState(0)
  const [phase, setPhase] = useState('view') // view | recall | rate
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <div className="page">
        <div className="complete-screen">
          <div style={{ fontSize: 60 }}>🖼️</div>
          <h2>{t('wonderful')}</h2>
          <div className="score-circle">{score}<span>/{stories.length}</span></div>
          <button className="btn btn-primary btn-lg" onClick={() => onDone(score, stories.length)}>
            {t('backToActivities')}
          </button>
        </div>
      </div>
    )
  }

  const story = stories[stIndex]

  function rate(good) {
    if (good) setScore(s => s + 1)
    setAnswer('')
    setPhase('view')
    if (stIndex + 1 >= stories.length) setDone(true)
    else setStIndex(i => i + 1)
  }

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{pickField(activity, 'title', lang)}</div>
        <span className="level-badge">{t('level')} {level}</span>
      </div>

      <div className="progress-dots">
        {stories.map((_, i) => (
          <div key={i} className={`progress-dot ${i < stIndex ? 'done' : i === stIndex ? 'current' : ''}`} />
        ))}
      </div>

      {phase === 'view' && (
        <>
          <div className="card mb-16">
            <h3 className="mb-20">{story.title}</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {story.panels.map((panel, i) => (
                <div key={i} style={{
                  flex: '1 1 120px', minWidth: 100,
                  background: 'var(--bg)', borderRadius: 14,
                  padding: '16px 12px', textAlign: 'center',
                  border: '2px solid var(--border)'
                }}>
                  <div style={{ fontSize: 52 }}>{panel.emoji}</div>
                  <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.4 }}>
                    {panel.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="instruction-box mb-16">{t('lookPicturesRemember')}</div>
          <button className="btn btn-primary btn-lg w-full" onClick={() => setPhase('recall')}>
            {t('tellStory')}
          </button>
        </>
      )}

      {phase === 'recall' && (
        <div className="card">
          <h3 className="mb-8">{t('tellStoryOwnWords')}</h3>
          <p className="text-muted mb-16">{t('whatHappenedSaw')}</p>
          <textarea
            className="textarea"
            rows={5}
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder={t('tellStoryHere')}
            autoFocus
          />
          <button
            className="btn btn-primary w-full mt-16"
            onClick={() => setPhase('rate')}
            disabled={!answer.trim()}
          >
            {t('done')}
          </button>
        </div>
      )}

      {phase === 'rate' && (
        <div className="card">
          <h3 className="mb-16">{t('whatSheSaid')}</h3>
          <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <p style={{ fontSize: 20, fontStyle: 'italic', lineHeight: 1.7 }}>"{answer}"</p>
          </div>
          <p style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)' }}>{t('caregiverHowNarration')}</p>
          <div className="flex gap-12">
            <button className="btn btn-success w-full" onClick={() => rate(true)}>{t('good')}</button>
            <button className="btn btn-error w-full" onClick={() => rate(false)}>{t('needsWork')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
