import { useState, useRef, useEffect } from 'react'
import { getActivityLevel, getLadderContent, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'
import Icon from '../Icon'

const MAX_STRIKES = 3
const WINDOW_MS = 1800   // listening window after each word (generous, slow pace)
const CLAP_MAX_MS = 180  // a clap is a short, sharp burst
const VOICE_MIN_MS = 220 // sustained sound = talking, not a clap

// Speak text and resolve when finished (with a safety timeout in case the
// browser never fires onend, which happens on some mobile browsers).
function speak(text, lang) {
  return new Promise(resolve => {
    try {
      const synth = window.speechSynthesis
      if (!synth) return resolve()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
      u.rate = 0.8
      let done = false
      const finish = () => { if (!done) { done = true; resolve() } }
      u.onend = finish
      u.onerror = finish
      synth.speak(u)
      setTimeout(finish, 2200)
    } catch { resolve() }
  })
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

export default function ClapWhen({ activityId, level, exposure = 0, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)
  const levelData = getLadderContent(activityId, exposure, lang, 1) || getActivityLevel(activityId, level, lang)
  const rounds = levelData?.rounds || []

  const [phase, setPhase] = useState('ready')       // ready | running | result
  const [mode, setMode] = useState('tap')           // tap (default, accessible) | clap (mic)
  const [started, setStarted] = useState(false)     // first round begun (locks mode)
  const [tapActive, setTapActive] = useState(true)
  const [status, setStatus] = useState('')
  const [target, setTarget] = useState(rounds[0]?.target || '')
  const [strikes, setStrikes] = useState(0)
  const [hits, setHits] = useState(0)
  const [autoPass, setAutoPass] = useState(true)
  const [pulse, setPulse] = useState(0)             // bumps to retrigger the ripple

  const streamRef = useRef(null)
  const ctxRef = useRef(null)
  const rafRef = useRef(null)
  const listenRef = useRef({ open: false, clap: false, voice: false })
  const tapRef = useRef(false)
  const windowOpenRef = useRef(false)
  const cancelledRef = useRef(false)
  const threshRef = useRef({ voice: 0.05, clap: 0.14 })
  const beginResolveRef = useRef(null)
  const responderRef = useRef('tap')
  const setupRef = useRef(false)

  useEffect(() => { startFlow(); return cleanup }, []) // run the lesson once
  // eslint-disable-next-line react-hooks/exhaustive-deps

  function cleanup() {
    cancelledRef.current = true
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    try { window.speechSynthesis?.cancel() } catch {}
    try { streamRef.current?.getTracks().forEach(tr => tr.stop()) } catch {}
    try { ctxRef.current?.close() } catch {}
  }

  async function startMic() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false }
    })
    streamRef.current = stream
    const Ctx = window.AudioContext || window.webkitAudioContext
    const ctx = new Ctx()
    ctxRef.current = ctx
    await ctx.resume()
    const srcNode = ctx.createMediaStreamSource(stream)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 1024
    srcNode.connect(analyser)
    const buf = new Float32Array(analyser.fftSize)

    let inEvent = false, evtStart = 0, evtPeak = 0
    const calib = []
    const t0 = performance.now()

    const tick = () => {
      if (cancelledRef.current) return
      analyser.getFloatTimeDomainData(buf)
      let sum = 0
      for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i]
      const rms = Math.sqrt(sum / buf.length)
      const now = performance.now()
      if (now - t0 < 1400) {
        calib.push(rms)
      } else if (threshRef.current.calibrated !== true) {
        const avg = calib.length ? calib.reduce((a, b) => a + b, 0) / calib.length : 0.01
        threshRef.current = { calibrated: true, voice: Math.max(0.04, avg * 3), clap: Math.max(0.12, avg * 7) }
      } else {
        const { voice, clap } = threshRef.current
        if (!inEvent) {
          if (rms > voice) { inEvent = true; evtStart = now; evtPeak = rms }
        } else {
          if (rms > evtPeak) evtPeak = rms
          if (rms < voice * 0.6) {
            inEvent = false
            const dur = now - evtStart
            if (evtPeak >= clap && dur <= CLAP_MAX_MS) {
              if (windowOpenRef.current) { listenRef.current.clap = true; setPulse(p => p + 1) }
            } else if (evtPeak >= voice && dur >= VOICE_MIN_MS) {
              if (windowOpenRef.current) listenRef.current.voice = true
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const targetLabel = mode === 'tap' ? t('clapTapTargetIs') : t('clapTargetIs')
  const ruleText = mode === 'tap' ? t('clapRuleTap') : t('clapRuleClap')

  // A tap: gives instant ripple feedback, and counts if a window is open.
  function tapped() {
    if (windowOpenRef.current) tapRef.current = true
    setPulse(p => p + 1)
  }

  function waitForBegin() { return new Promise(res => { beginResolveRef.current = res }) }
  function replayTarget() { speak(`${targetLabel} ${target}`, lang) }

  // Begin a round. On the first round this is the user gesture that sets up the
  // mic (clap mode); if that fails it falls back to tap.
  async function onBeginRound() {
    if (!setupRef.current) {
      setupRef.current = true
      setStarted(true)
      if (mode === 'clap') {
        try {
          if (!navigator.mediaDevices?.getUserMedia) throw new Error('no-mic')
          await startMic()
          responderRef.current = 'mic'
          setTapActive(false)
        } catch {
          responderRef.current = 'tap'
          setTapActive(true)
        }
      } else {
        responderRef.current = 'tap'
        setTapActive(true)
      }
    }
    const r = beginResolveRef.current; beginResolveRef.current = null; r && r()
  }

  async function startFlow() {
    cancelledRef.current = false
    let localStrikes = 0, localHits = 0, failed = false

    for (const round of rounds) {
      if (cancelledRef.current) return
      const tgt = round.target
      setTarget(tgt)
      setStatus('')
      setPhase('ready')
      await waitForBegin()
      if (cancelledRef.current) return
      const isMic = responderRef.current === 'mic'
      setPhase('running')
      if (isMic && !threshRef.current.calibrated) await sleep(1400)

      for (const word of round.words) {
        if (cancelledRef.current) return
        setStatus(t('clapPlaying'))
        await speak(word, lang)
        setStatus(t('clapListening'))
        if (isMic) {
          listenRef.current = { open: true, clap: false, voice: false }
          windowOpenRef.current = true
        } else {
          tapRef.current = false
          windowOpenRef.current = true
        }
        await sleep(WINDOW_MS)
        windowOpenRef.current = false
        let responded, voice = false
        if (isMic) {
          listenRef.current.open = false
          responded = listenRef.current.clap
          voice = listenRef.current.voice
        } else {
          responded = tapRef.current
        }
        const isTarget = word === tgt
        if (isTarget) {
          if (responded) localHits++
          else localStrikes++
        } else if (responded || voice) {
          localStrikes++
        }
        setHits(localHits)
        setStrikes(localStrikes)
        if (localStrikes >= MAX_STRIKES) { failed = true; break }
        await sleep(700)
      }
      if (failed) break
    }

    setAutoPass(!failed)
    setHits(localHits)
    setStrikes(localStrikes)
    cleanup()
    setPhase('result')
  }

  function finish(passed) { onDone(passed ? 1 : 0, 1) }

  // ---- Screens ----

  if (phase === 'ready') {
    return (
      <div className="page">
        <Header t={t} activity={activity} lang={lang} level={levelData?.level || level} onBack={() => { cleanup(); onBack() }} />
        <div className="card text-center" style={{ padding: '32px 24px' }}>
          <Icon name="clap" size={56} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: 18, lineHeight: 1.6, marginBottom: 18 }}>
            {mode === 'tap' ? t('clapIntroTap', { n: MAX_STRIKES }) : t('clapIntro', { n: MAX_STRIKES })}
          </p>
          <p className="text-muted" style={{ fontSize: 16 }}>{targetLabel}</p>
          <div style={{ fontSize: 40, fontWeight: 800, margin: '6px 0 20px' }}>{target}</div>
          <button className="btn btn-ghost w-full" style={{ marginBottom: 12 }} onClick={replayTarget}>
            <Icon name="replay" size={22} color="var(--primary-strong)" /> {t('clapReplay')}
          </button>
          <button className="btn btn-primary btn-lg w-full" onClick={onBeginRound}>{t('clapBegin')}</button>
          {!started && (
            <button
              className="btn btn-ghost w-full"
              style={{ marginTop: 10 }}
              onClick={() => setMode(mode === 'tap' ? 'clap' : 'tap')}
            >
              {mode === 'tap' ? t('clapSwitchToClap') : t('clapSwitchToTap')}
            </button>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'running') {
    return (
      <div className="page">
        <Header t={t} activity={activity} lang={lang} level={levelData?.level || level} onBack={() => { cleanup(); onBack() }} />
        <div className="card text-center" style={{ padding: '32px 24px' }}>
          {/* Instruction lives on the task screen now */}
          <p className="text-muted" style={{ fontSize: 16, marginBottom: 18 }}>{ruleText}</p>
          <p className="text-muted" style={{ fontSize: 15 }}>{targetLabel}</p>
          <div style={{ fontSize: 38, fontWeight: 800, margin: '4px 0 20px' }}>{target}</div>

          <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!tapActive && <span key={pulse} className="ripple" />}
            <Icon name="speaker" size={52} color="var(--primary)" />
          </div>
          <p style={{ fontSize: 20, fontWeight: 600 }}>{status || t('clapGetReady')}</p>

          <div className="flex gap-8" style={{ justifyContent: 'center', marginTop: 20 }}>
            {Array.from({ length: MAX_STRIKES }).map((_, i) => (
              <Icon key={i} name="x" size={26} color="var(--error)" style={{ opacity: i < strikes ? 1 : 0.25 }} />
            ))}
          </div>
        </div>

        {tapActive && (
          <div style={{ position: 'relative', marginTop: 20 }}>
            <button
              className="tap-btn"
              onClick={tapped}
              style={{
                position: 'relative', overflow: 'hidden',
                width: '100%', minHeight: 130, borderRadius: 20,
                background: 'var(--primary)', color: 'var(--on-primary)', border: 'none',
                fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                boxShadow: '0 6px 18px var(--primary-glow)',
              }}
            >
              <span key={pulse} className="ripple" style={{ background: 'rgba(255,255,255,0.4)' }} />
              <Icon name="clap" size={34} color="var(--on-primary)" /> {t('clapTapBtn')}
            </button>
          </div>
        )}
      </div>
    )
  }

  // result — auto verdict + caregiver confirm/override.
  return (
    <div className="page">
      <Header t={t} activity={activity} lang={lang} level={levelData?.level || level} onBack={onBack} />
      <div className="card text-center">
        <Icon name={autoPass ? 'celebrate' : 'clap'} size={56} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
        <h2 style={{ marginBottom: 12 }}>{autoPass ? t('clapPassed') : t('clapFailed')}</h2>
        <div className="flex gap-8 wrap" style={{ justifyContent: 'center', marginBottom: 16 }}>
          <span style={chip}><Icon name="check" size={16} color="var(--success)" /> {t('clapHits', { n: hits })}</span>
          <span style={chip}><Icon name="x" size={16} color="var(--error)" /> {t('clapStrikes', { n: strikes })}</span>
        </div>
        <p style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>{t('clapConfirm')}</p>
        <div className="flex gap-12">
          <button className={`btn w-full ${autoPass ? 'btn-success' : 'btn-ghost'}`} onClick={() => finish(true)}>
            {t('clapPass')}
          </button>
          <button className={`btn w-full ${!autoPass ? 'btn-error' : 'btn-ghost'}`} onClick={() => finish(false)}>
            {t('clapFail')}
          </button>
        </div>
      </div>
    </div>
  )
}

const chip = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '6px 12px', borderRadius: 16, fontSize: 15, fontWeight: 600,
  background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)'
}

function Header({ t, activity, lang, level, onBack }) {
  return (
    <div className="activity-header">
      <button className="back-btn" onClick={onBack}>←</button>
      <div className="activity-title">{pickField(activity, 'title', lang)}</div>
      <span className="level-badge">{t('level')} {level}</span>
    </div>
  )
}
