import { useState } from 'react'
import { getOrderedLevels, ladderWindow, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'

export default function CopyText({ activityId, level, exposure = 0, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)
  // Passages are tagged by language inside one array, so gather across all
  // levels, filter to this language, then walk the ladder by exposure.
  const allPassages = getOrderedLevels(activityId, lang).flatMap(l => l.passages || [])
  const wantedPassages = allPassages.filter(p => p.lang === (lang === 'hi' ? 'hi' : 'en'))
  const passages = ladderWindow(wantedPassages.length ? wantedPassages : allPassages, exposure, 2)

  const [pIndex, setPIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const passage = passages[pIndex]
  if (!passage || done) {
    if (done) {
      return (
        <div className="page">
          <div className="complete-screen">
            <div style={{ fontSize: 60 }}>✏️</div>
            <h2>{t('wellDone')}</h2>
            <div className="score-circle">
              {score}<span>/{passages.length}</span>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => onDone(score, passages.length)}>
              {t('backToActivities')}
            </button>
          </div>
        </div>
      )
    }
    return null
  }

  // Normalise for comparison: collapse whitespace, trim
  function normalise(str) {
    return str.replace(/\s+/g, ' ').trim().toLowerCase()
  }

  function checkAnswer() {
    const correct = normalise(typed) === normalise(passage.text)
    if (correct) setScore(s => s + 1)
    setSubmitted(true)
  }

  function next() {
    setTyped('')
    setSubmitted(false)
    if (pIndex + 1 >= passages.length) setDone(true)
    else setPIndex(i => i + 1)
  }

  const isCorrect = submitted && normalise(typed) === normalise(passage.text)
  const isHindi = passage.lang === 'hi'

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{pickField(activity, 'title', lang)}</div>
        <span className="level-badge">{t('level')} {level}</span>
      </div>

      <div className="progress-dots">
        {passages.map((_, i) => (
          <div key={i} className={`progress-dot ${i < pIndex ? 'done' : i === pIndex ? 'current' : ''}`} />
        ))}
      </div>

      <div className="instruction-box">{t('copyInstruction')}</div>

      <div className="card mb-16">
        <div className={isHindi ? 'hindi' : 'text-lg'} style={{ lineHeight: 1.9, whiteSpace: 'pre-line' }}>
          {passage.text}
        </div>
      </div>

      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 12 }}>{t('copyAbove')}</p>
        <textarea
          className="textarea"
          rows={4}
          value={typed}
          onChange={e => setTyped(e.target.value)}
          disabled={submitted}
          placeholder={t('typeHere')}
          style={isHindi ? { fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 24 } : {}}
          lang={isHindi ? 'hi' : 'en'}
        />

        {submitted && (
          <div style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 10,
            background: isCorrect ? 'var(--ok-bg)' : 'var(--err-bg)',
            color: isCorrect ? 'var(--success)' : 'var(--error)',
            fontWeight: 600,
            fontSize: 18
          }}>
            {isCorrect ? `✓ ${t('perfect')}` : `✗ ${t('notQuiteDiff')}`}
          </div>
        )}

        <div className="flex gap-12 mt-16">
          {!submitted
            ? <button className="btn btn-primary" onClick={checkAnswer} disabled={!typed.trim()}>{t('check')}</button>
            : <button className="btn btn-primary" onClick={next}>{pIndex + 1 < passages.length ? t('nextArrow') : t('finish')}</button>
          }
        </div>
      </div>
    </div>
  )
}
