import { useState, useEffect } from 'react'
import { getActivityLevel, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'

const PHASE_COLOR = { inhale: 'var(--primary)', hold: 'var(--warning)', exhale: 'var(--success)' }

export default function BreathCount({ activityId, level, onDone, onBack }) {
  const { t, lang } = useLang()
  const PHASE_LABEL = { inhale: t('breatheIn'), hold: t('hold'), exhale: t('breatheOut') }
  const activity = getActivity(activityId, lang)
  const levelData = getActivityLevel(activityId, level, lang)
  const target = levelData?.breaths || 3
  const durations = {
    inhale: (levelData?.inhale || 4) * 1000,
    hold: (levelData?.hold || 2) * 1000,
    exhale: (levelData?.exhale || 4) * 1000,
  }

  const [phase, setPhase] = useState('ready') // ready | inhale | hold | exhale | done
  const [breathCount, setBreathCount] = useState(0)
  const [countdown, setCountdown] = useState(0)

  // Phase state machine
  useEffect(() => {
    if (phase === 'ready' || phase === 'done') return
    const dur = durations[phase]
    setCountdown(Math.ceil(dur / 1000))
    const tick = setInterval(() => setCountdown(c => (c > 1 ? c - 1 : c)), 1000)
    const timer = setTimeout(() => {
      if (phase === 'inhale') setPhase('hold')
      else if (phase === 'hold') setPhase('exhale')
      else if (phase === 'exhale') {
        setBreathCount(prev => {
          const next = prev + 1
          if (next >= target) setPhase('done')
          else setPhase('inhale')
          return next
        })
      }
    }, dur)
    return () => { clearTimeout(timer); clearInterval(tick) }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'done') {
    queueMicrotask(() => onDone(target, target))
    return null
  }

  const isActive = phase !== 'ready'
  // Circle scale: large on inhale & hold, small on exhale / ready
  const scale = phase === 'inhale' || phase === 'hold' ? 1 : 0.55
  const transitionDur = phase === 'inhale' ? durations.inhale : phase === 'exhale' ? durations.exhale : 0

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{pickField(activity, 'title', lang)}</div>
        <span className="level-badge">{t('level')} {level}</span>
      </div>

      <div className="instruction-box">
        {t('breathFollow')}
      </div>

      <div className="card text-center" style={{ padding: '32px 24px' }}>
        <p className="text-muted mb-8" style={{ fontSize: 17 }}>
          {t('breathOf', { i: Math.min(breathCount + (isActive ? 1 : 0), target), n: target })}
        </p>

        <div style={{
          height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16
        }}>
          <div style={{
            width: 220, height: 220, borderRadius: '50%',
            background: isActive ? PHASE_COLOR[phase] : 'var(--border)',
            opacity: 0.18,
            position: 'absolute',
            transform: `scale(${scale})`,
            transition: `transform ${transitionDur}ms ease-in-out, background 0.4s`,
          }} />
          <div style={{
            width: 220, height: 220, borderRadius: '50%',
            border: `4px solid ${isActive ? PHASE_COLOR[phase] : 'var(--border)'}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            transform: `scale(${scale})`,
            transition: `transform ${transitionDur}ms ease-in-out, border-color 0.4s`,
          }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: isActive ? PHASE_COLOR[phase] : 'var(--text-muted)' }}>
              {isActive ? PHASE_LABEL[phase] : t('ready')}
            </span>
            {isActive && (
              <span style={{ fontSize: 40, fontWeight: 800, color: PHASE_COLOR[phase], lineHeight: 1.2 }}>
                {countdown}
              </span>
            )}
          </div>
        </div>

        {!isActive ? (
          <button className="btn btn-primary btn-lg w-full" onClick={() => { setBreathCount(0); setPhase('inhale') }}>
            {t('startBreathing')}
          </button>
        ) : (
          <button className="btn btn-ghost w-full" onClick={() => onDone(target, target)}>
            {t('finishEarly')}
          </button>
        )}
      </div>
    </div>
  )
}
