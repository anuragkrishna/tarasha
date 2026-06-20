import { useState, useEffect } from 'react'
import { getActivityLevel, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'

export default function SentenceRepeat({ activityId, level, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)
  const levelData = getActivityLevel(activityId, level, lang)
  const allSentences = levelData?.sentences || []
  const wantedSentences = allSentences.filter(s => s.lang === (lang === 'hi' ? 'hi' : 'en'))
  const sentences = wantedSentences.length ? wantedSentences : allSentences
  const showDuration = levelData?.showDuration || 5000

  const [sIndex, setSIndex] = useState(0)
  const [phase, setPhase] = useState('show')
  const [timeLeft, setTimeLeft] = useState(Math.ceil(showDuration / 1000))
  const [typed, setTyped] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (phase !== 'show') return
    setTimeLeft(Math.ceil(showDuration / 1000))
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); setPhase('recall'); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [phase, sIndex, showDuration])

  if (done) {
    return (
      <div className="page">
        <div className="complete-screen">
          <div style={{ fontSize: 60 }}>💬</div>
          <h2>{t('wellDone')}</h2>
          <div className="score-circle">{score}<span>/{sentences.length}</span></div>
          <button className="btn btn-primary btn-lg" onClick={() => onDone(score, sentences.length)}>
            {t('backToActivities')}
          </button>
        </div>
      </div>
    )
  }

  const sentence = sentences[sIndex]
  const isHindi = sentence?.lang === 'hi'

  function normalise(s) {
    return s.replace(/[।,.?!]/g, '').replace(/\s+/g, ' ').trim().toLowerCase()
  }

  function submit() {
    const correct = normalise(typed) === normalise(sentence.text)
    if (correct) setScore(s => s + 1)
    setSubmitted(true)
  }

  function next() {
    setTyped('')
    setSubmitted(false)
    setPhase('show')
    if (sIndex + 1 >= sentences.length) setDone(true)
    else setSIndex(i => i + 1)
  }

  const isCorrect = submitted && normalise(typed) === normalise(sentence.text)

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{pickField(activity, 'title', lang)}</div>
        <span className="level-badge">{t('level')} {level}</span>
      </div>

      <div className="progress-dots">
        {sentences.map((_, i) => (
          <div key={i} className={`progress-dot ${i < sIndex ? 'done' : i === sIndex ? 'current' : ''}`} />
        ))}
      </div>

      {phase === 'show' && (
        <div className="card text-center" style={{ marginTop: 40 }}>
          <p className="text-muted mb-16">{t('readSentence')}</p>
          <div className={isHindi ? 'hindi' : 'text-xl'} style={{ marginBottom: 24, lineHeight: 1.7 }}>
            {sentence.text}
          </div>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700, margin: '0 auto'
          }}>{timeLeft}</div>
        </div>
      )}

      {phase === 'recall' && !submitted && (
        <div className="card" style={{ marginTop: 40 }}>
          <h3 className="mb-16">{t('typeSentence')}</h3>
          <textarea
            className="textarea"
            rows={3}
            value={typed}
            onChange={e => setTyped(e.target.value)}
            placeholder={isHindi ? 'यहाँ टाइप करें...' : 'Type the sentence here...'}
            autoFocus
            style={isHindi ? { fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 26 } : {}}
            lang={isHindi ? 'hi' : 'en'}
          />
          <button className="btn btn-primary w-full mt-16" onClick={submit} disabled={!typed.trim()}>
            {t('check')}
          </button>
        </div>
      )}

      {submitted && (
        <div className="card" style={{ marginTop: 40 }}>
          <div style={{
            padding: 12, borderRadius: 10, marginBottom: 16,
            background: isCorrect ? '#EAFAF1' : '#FDEDEC',
            color: isCorrect ? 'var(--success)' : 'var(--error)',
            fontWeight: 600, fontSize: 20
          }}>
            {isCorrect ? `✓ ${t('correct')}` : `✗ ${t('notQuite')}`}
          </div>
          {!isCorrect && (
            <>
              <p style={{ fontWeight: 600, marginBottom: 6 }}>{t('sentenceWas')}</p>
              <div className={isHindi ? 'hindi' : 'text-lg'} style={{ marginBottom: 16, color: 'var(--success)' }}>
                {sentence.text}
              </div>
            </>
          )}
          <button className="btn btn-primary" onClick={next}>
            {sIndex + 1 < sentences.length ? t('nextArrow') : t('finish')}
          </button>
        </div>
      )}
    </div>
  )
}
