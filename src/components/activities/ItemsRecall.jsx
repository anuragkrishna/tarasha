import { useState, useEffect } from 'react'
import { getActivityLevel, getLadderContent, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'

export default function ItemsRecall({ activityId, level, exposure = 0, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)
  const levelData = getLadderContent(activityId, exposure, lang, 2) || getActivityLevel(activityId, level, lang)
  const lists = levelData?.lists || []
  const showDuration = levelData?.showDuration || 3000

  const [lIndex, setLIndex] = useState(0)
  const [itemIndex, setItemIndex] = useState(0)
  const [phase, setPhase] = useState('show') // show | recall | result
  const [timeLeft, setTimeLeft] = useState(Math.ceil(showDuration / 1000))
  const [recalled, setRecalled] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (phase !== 'show') return
    setTimeLeft(Math.ceil(showDuration / 1000))
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval)
          setItemIndex(i => {
            const list = lists[lIndex]
            if (i + 1 >= list.length) {
              setPhase('recall')
              return i
            }
            return i + 1
          })
          return Math.ceil(showDuration / 1000)
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [phase, itemIndex, lIndex, showDuration, lists])

  if (done) {
    queueMicrotask(() => onDone(score, lists.length))
    return null
  }

  const currentList = lists[lIndex]

  function checkRecall() {
    const words = recalled.toLowerCase().split(/[\s,،]+/).filter(Boolean)
    const correct = currentList.filter(item =>
      words.some(w => item.toLowerCase().includes(w) || w.includes(item.toLowerCase().slice(0, 3)))
    ).length
    setScore(s => s + (correct >= Math.ceil(currentList.length * 0.6) ? 1 : 0))
    setSubmitted(true)
  }

  function next() {
    setRecalled('')
    setSubmitted(false)
    setItemIndex(0)
    setPhase('show')
    if (lIndex + 1 >= lists.length) setDone(true)
    else setLIndex(i => i + 1)
  }

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{pickField(activity, 'title', lang)}</div>
        <span className="level-badge">{t('level')} {levelData?.level || level}</span>
      </div>

      <div className="progress-dots">
        {lists.map((_, i) => (
          <div key={i} className={`progress-dot ${i < lIndex ? 'done' : i === lIndex ? 'current' : ''}`} />
        ))}
      </div>

      {phase === 'show' && (
        <div className="card text-center" style={{ marginTop: 20 }}>
          <p className="text-muted mb-8">{t('rememberItem', { i: itemIndex + 1, n: currentList.length })}</p>
          <div style={{ fontSize: 56, fontWeight: 700, color: 'var(--primary)', marginBottom: 16 }}>
            {currentList[itemIndex]}
          </div>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--primary)', color: 'var(--on-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700, margin: '0 auto'
          }}>{timeLeft}</div>
        </div>
      )}

      {phase === 'recall' && !submitted && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 className="mb-8">{t('whatItems')}</h3>
          <p className="text-muted mb-16">{t('typeItemsComma')}</p>
          <textarea
            className="textarea"
            rows={4}
            value={recalled}
            onChange={e => setRecalled(e.target.value)}
            placeholder="e.g. Apple, Chair, Dog"
            autoFocus
          />
          <button className="btn btn-primary w-full mt-16" onClick={checkRecall} disabled={!recalled.trim()}>
            {t('checkAnswers')}
          </button>
          <button className="btn btn-ghost w-full" style={{ marginTop: 10 }} onClick={() => { setItemIndex(0); setPhase('show') }}>
            {t('showAgain')}
          </button>
        </div>
      )}

      {phase === 'recall' && submitted && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 className="mb-16">{t('itemsWere')}</h3>
          <div className="flex gap-12 wrap mb-24">
            {currentList.map((item, i) => {
              const typed = recalled.toLowerCase()
              const found = typed.includes(item.toLowerCase()) || typed.includes(item.toLowerCase().slice(0, 4))
              return (
                <span key={i} style={{
                  padding: '8px 16px', borderRadius: 10, fontSize: 22, fontWeight: 600,
                  background: found ? 'var(--ok-bg)' : 'var(--err-bg)',
                  color: found ? 'var(--success)' : 'var(--error)',
                  border: `2px solid ${found ? 'var(--success)' : 'var(--error)'}`
                }}>
                  {found ? '✓' : '✗'} {item}
                </span>
              )
            })}
          </div>
          <button className="btn btn-primary" onClick={next}>
            {lIndex + 1 < lists.length ? t('nextArrow') : t('finish')}
          </button>
        </div>
      )}
    </div>
  )
}
