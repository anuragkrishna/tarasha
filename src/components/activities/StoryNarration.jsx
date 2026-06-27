import { useState } from 'react'
import { getActivityLevel, getLadderContent, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'

export default function StoryNarration({ activityId, level, exposure = 0, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)
  const levelData = getLadderContent(activityId, exposure, lang, 1) || getActivityLevel(activityId, level, lang)
  const stories = levelData?.stories || []
  // One story per day (rotates daily)
  const dayIdx = Math.floor(Date.now() / 86400000)
  const story = stories.length ? stories[dayIdx % stories.length] : null

  const [phase, setPhase] = useState('view') // view | narrate | rate
  const [panelIndex, setPanelIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answer, setAnswer] = useState('')
  const [done, setDone] = useState(false)

  if (done) {
    queueMicrotask(() => onDone(score, 1))
    return null
  }

  if (!story) return null
  const panel = story.panels[panelIndex]
  const isLastPanel = panelIndex === story.panels.length - 1

  function nextPanel() {
    if (isLastPanel) setPhase('narrate')
    else setPanelIndex(i => i + 1)
  }

  function rate(good) {
    if (good) setScore(1)
    setDone(true)
  }

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{pickField(activity, 'title', lang)}</div>
        <span className="level-badge">{t('level')} {levelData?.level || level}</span>
      </div>

      {phase === 'view' && (
        <>
          <div className="card text-center" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 8 }}>{story.title}</h3>
            <p className="text-muted" style={{ fontSize: 17 }}>
              {t('imageOf', { i: panelIndex + 1, n: story.panels.length })}
            </p>
          </div>

          {/* Big single image panel */}
          <div style={{
            background: 'var(--surface)',
            borderRadius: 20,
            padding: '40px 24px',
            textAlign: 'center',
            marginBottom: 20,
            boxShadow: 'var(--shadow)',
            border: '3px solid var(--border)',
          }}>
            <div style={{ fontSize: 100, marginBottom: 20 }}>{panel.emoji}</div>
            <p style={{ fontSize: 22, color: 'var(--text)', lineHeight: 1.5 }}>{panel.caption}</p>
          </div>

          {/* Thumbnail strip of all panels */}
          <div className="flex gap-8 wrap mb-20" style={{ justifyContent: 'center' }}>
            {story.panels.map((p, i) => (
              <div key={i} style={{
                width: 56, height: 56, borderRadius: 10,
                background: i === panelIndex ? 'var(--primary)' : i < panelIndex ? 'var(--ok-bg)' : 'var(--bg)',
                border: `2px solid ${i === panelIndex ? 'var(--primary)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, cursor: 'pointer'
              }} onClick={() => setPanelIndex(i)}>
                {i < panelIndex ? '✓' : p.emoji}
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-lg w-full" onClick={nextPanel}>
            {isLastPanel ? t('tellStory') : t('nextImage')}
          </button>
        </>
      )}

      {phase === 'narrate' && (
        <div className="card">
          <h3 className="mb-8">{story.prompt || t('tellStoryOwnWords')}</h3>
          <p className="text-muted mb-16" style={{ fontSize: 17 }}>{t('whatHappenedSaw')}</p>
          <textarea
            className="textarea"
            rows={6}
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
