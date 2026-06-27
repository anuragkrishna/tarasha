import { useState, useRef } from 'react'
import { getActivityLevel, getLadderContent, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'
import Icon from '../Icon'

const SpeechRec = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)

export default function DescribePicture({ activityId, level, exposure = 0, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)
  const levelData = getLadderContent(activityId, exposure, lang, 1) || getActivityLevel(activityId, level, lang)
  const scenes = levelData?.scenes || []
  const sentenceTarget = levelData?.sentenceTarget || 2
  // One picture per day (rotates daily)
  const dayIdx = Math.floor(Date.now() / 86400000)
  const scene = scenes.length ? scenes[dayIdx % scenes.length] : null

  const [phase, setPhase] = useState('describe') // describe | rate
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  // Voice-to-text: dictate the answer (primary input); typing is the fallback.
  function dictate() {
    if (!SpeechRec) return
    if (listening) { recRef.current?.stop(); return }
    const r = new SpeechRec()
    r.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    r.interimResults = false
    r.onresult = (e) => {
      const text = Array.from(e.results).map(x => x[0].transcript).join(' ')
      setAnswer(a => (a ? a.trim() + ' ' : '') + text)
    }
    r.onend = () => setListening(false)
    r.onerror = () => setListening(false)
    recRef.current = r
    setListening(true)
    r.start()
  }

  if (done) {
    queueMicrotask(() => onDone(score, 1))
    return null
  }

  if (!scene) return null

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

      {/* Big scene */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 20,
        padding: '36px 24px',
        textAlign: 'center',
        marginBottom: 16,
        boxShadow: 'var(--shadow)',
        border: '3px solid var(--border)',
      }}>
        <div style={{ fontSize: 110, marginBottom: 10 }}>{scene.emoji}</div>
        <h3>{scene.title}</h3>
      </div>

      {phase === 'describe' && (
        <div className="card">
          <h3 className="mb-8">{scene.prompt}</h3>
          <p className="text-muted mb-12" style={{ fontSize: 16 }}>
            {sentenceTarget > 1 ? t('sentencesTarget', { n: sentenceTarget }) : t('sentenceTarget', { n: sentenceTarget })}
          </p>
          {scene.hints && (
            <div className="flex gap-8 wrap mb-16">
              {scene.hints.map((h, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', borderRadius: 16, fontSize: 14, fontWeight: 600,
                  background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)'
                }}><Icon name="hint" size={14} color="var(--primary-strong)" /> {h}</span>
              ))}
            </div>
          )}
          {SpeechRec && (
            <button
              className="btn btn-ghost w-full mb-12"
              onClick={dictate}
              style={{ justifyContent: 'center', borderColor: listening ? 'var(--error)' : 'var(--primary)' }}
            >
              <Icon name="mic" size={22} color={listening ? 'var(--error)' : 'var(--primary-strong)'} />
              {listening ? t('describeListening') : t('describeSpeak')}
            </button>
          )}
          <textarea
            className="textarea"
            rows={5}
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder={t('writeDescription')}
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
          <p style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)' }}>{t('caregiverHowDescription')}</p>
          <div className="flex gap-12">
            <button className="btn btn-success w-full" onClick={() => rate(true)}>{t('good')}</button>
            <button className="btn btn-error w-full" onClick={() => rate(false)}>{t('needsWork')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
