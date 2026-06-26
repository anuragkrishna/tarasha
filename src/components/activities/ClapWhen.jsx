import { useState, useRef, useEffect } from 'react'
import { getActivityLevel, getLadderContent, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'

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

  const [phase, setPhase] = useState('intro')      // intro | manual | running | result
  const [status, setStatus] = useState('')          // sub-status text while running
  const [target, setTarget] = useState('')
  const [strikes, setStrikes] = useState(0)
  const [hits, setHits] = useState(0)
  const [autoPass, setAutoPass] = useState(true)
  const [usedMic, setUsedMic] = useState(true)

  // Audio + detection state kept in refs so the rAF loop sees live values.
  const streamRef = useRef(null)
  const ctxRef = useRef(null)
  const rafRef = useRef(null)
  const listenRef = useRef({ open: false, clap: false, voice: false })
  const cancelledRef = useRef(false)
  const threshRef = useRef({ voice: 0.05, clap: 0.14 })

  useEffect(() => () => cleanup(), []) // tidy up on unmount

  function cleanup() {
    cancelledRef.current = true
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    try { window.speechSynthesis?.cancel() } catch {}
    try { streamRef.current?.getTracks().forEach(tr => tr.stop()) } catch {}
    try { ctxRef.current?.close() } catch {}
  }

  // Start the microphone and run a continuous detection loop that flags claps
  // and sustained voice into listenRef while a window is open.
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

      // First ~1.4s: measure the room's noise floor, then set thresholds.
      if (now - t0 < 1400) {
        calib.push(rms)
      } else if (threshRef.current.calibrated !== true) {
        const avg = calib.length ? calib.reduce((a, b) => a + b, 0) / calib.length : 0.01
        threshRef.current = {
          calibrated: true,
          voice: Math.max(0.04, avg * 3),
          clap: Math.max(0.12, avg * 7),
        }
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
              if (listenRef.current.open) listenRef.current.clap = true
            } else if (evtPeak >= voice && dur >= VOICE_MIN_MS) {
              if (listenRef.current.open) listenRef.current.voice = true
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  async function begin() {
    cancelledRef.current = false
    let mic = true
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('no-mic')
      await startMic()
    } catch {
      mic = false
    }
    setUsedMic(mic)
    setPhase('running')
    await runRounds(mic)
  }

  async function runRounds(mic) {
    let localStrikes = 0
    let localHits = 0
    let failed = false

    if (mic) {
      setStatus(t('clapCalibrating'))
      await sleep(1500) // let the detector measure the noise floor
    }

    for (const round of rounds) {
      if (cancelledRef.current) return
      const tgt = round.target
      setTarget(tgt)
      setStatus('')
      await speak(`${t('clapTargetIs')} ${tgt}`, lang)
      await sleep(900)

      for (const word of round.words) {
        if (cancelledRef.current) return
        setStatus(t('clapListening'))
        await speak(word, lang)
        // Open the listening window just after the word is spoken.
        listenRef.current = { open: true, clap: false, voice: false }
        await sleep(WINDOW_MS)
        listenRef.current.open = false
        const { clap, voice } = listenRef.current
        const isTarget = word === tgt

        if (mic) {
          if (isTarget) {
            if (clap) localHits++
            else localStrikes++          // missed the target
          } else if (clap || voice) {
            localStrikes++               // should have stayed quiet
          }
          setHits(localHits)
          setStrikes(localStrikes)
          if (localStrikes >= MAX_STRIKES) { failed = true; break }
        }
        await sleep(700)
      }
      if (failed) break
    }

    const passed = mic ? !failed : true
    setAutoPass(passed)
    setHits(localHits)
    setStrikes(localStrikes)
    cleanup()
    setPhase('result')
  }

  // Caregiver confirms / overrides the final verdict.
  function finish(passed) {
    onDone(passed ? 1 : 0, 1)
  }

  // ---- Screens ----

  if (phase === 'intro') {
    return (
      <div className="page">
        <Header t={t} activity={activity} lang={lang} level={levelData?.level || level} onBack={onBack} />
        <div className="card text-center">
          <div style={{ fontSize: 64, marginBottom: 12 }}>👏</div>
          <p style={{ fontSize: 19, lineHeight: 1.6, marginBottom: 20 }}>
            {t('clapIntro', { n: MAX_STRIKES })}
          </p>
          <p className="text-muted" style={{ fontSize: 15, marginBottom: 20 }}>{t('clapNeedMic')}</p>
          <button className="btn btn-primary btn-lg w-full" onClick={begin}>{t('clapStart')}</button>
        </div>
      </div>
    )
  }

  if (phase === 'running') {
    return (
      <div className="page">
        <Header t={t} activity={activity} lang={lang} level={levelData?.level || level} onBack={() => { cleanup(); onBack() }} />
        <div className="card text-center" style={{ padding: '40px 24px' }}>
          {target && (
            <>
              <p className="text-muted" style={{ fontSize: 16 }}>{t('clapTargetIs')}</p>
              <div style={{ fontSize: 40, fontWeight: 800, margin: '8px 0 24px' }}>{target}</div>
            </>
          )}
          <div style={{ fontSize: 56, marginBottom: 12 }}>🔊</div>
          <p style={{ fontSize: 20, fontWeight: 600 }}>{status || t('clapGetReady')}</p>
          {usedMic && (
            <div className="flex gap-8" style={{ justifyContent: 'center', marginTop: 20 }}>
              {Array.from({ length: MAX_STRIKES }).map((_, i) => (
                <span key={i} style={{ fontSize: 26, opacity: i < strikes ? 1 : 0.25 }}>❌</span>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // result — show the auto verdict, then let the caregiver confirm or override.
  return (
    <div className="page">
      <Header t={t} activity={activity} lang={lang} level={levelData?.level || level} onBack={onBack} />
      <div className="card text-center">
        <div style={{ fontSize: 60, marginBottom: 8 }}>{autoPass ? '🎉' : '💪'}</div>
        <h2 style={{ marginBottom: 12 }}>{autoPass ? t('clapPassed') : t('clapFailed')}</h2>
        {usedMic && (
          <div className="flex gap-8 wrap" style={{ justifyContent: 'center', marginBottom: 16 }}>
            <span style={chip}>✅ {t('clapHits', { n: hits })}</span>
            <span style={chip}>❌ {t('clapStrikes', { n: strikes })}</span>
          </div>
        )}
        <p style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>
          {usedMic ? t('clapConfirm') : t('clapManualPrompt')}
        </p>
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
  padding: '6px 12px', borderRadius: 16, fontSize: 15, fontWeight: 600,
  background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)'
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
