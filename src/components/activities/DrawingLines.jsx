import { useRef, useEffect, useState } from 'react'
import { getActivityLevel, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'

const GUIDES = {
  horizontal: (w, h) => [
    [{ x: 40, y: h * 0.35 }, { x: w - 40, y: h * 0.35 }],
    [{ x: 40, y: h * 0.65 }, { x: w - 40, y: h * 0.65 }],
  ],
  diagonal: (w, h) => [
    [{ x: 40, y: 40 }, { x: w - 40, y: h - 40 }],
    [{ x: w - 40, y: 40 }, { x: 40, y: h - 40 }],
  ],
  zigzag: (w, h) => {
    const pts = []
    const steps = 6
    for (let i = 0; i <= steps; i++) {
      pts.push({ x: 40 + (i * (w - 80)) / steps, y: i % 2 === 0 ? h * 0.25 : h * 0.75 })
    }
    return [pts]
  }
}

function drawGuide(ctx, paths, w, h) {
  ctx.clearRect(0, 0, w, h)
  ctx.setLineDash([12, 10])
  ctx.strokeStyle = '#BBBBBB'
  ctx.lineWidth = 4
  paths.forEach(path => {
    ctx.beginPath()
    ctx.moveTo(path[0].x, path[0].y)
    for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y)
    ctx.stroke()
  })
  ctx.setLineDash([])
}

export default function DrawingLines({ activityId, level, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)
  const levelData = getActivityLevel(activityId, level, lang)
  const canvasRef = useRef(null)
  const guideRef = useRef(null)
  const drawing = useRef(false)
  const lastPos = useRef(null)
  const [round, setRound] = useState(0)
  const [done, setDone] = useState(false)
  const TOTAL_ROUNDS = 3

  const type = levelData?.type || 'horizontal'

  useEffect(() => {
    const canvas = canvasRef.current
    const guide = guideRef.current
    if (!canvas || !guide) return
    const w = canvas.parentElement.clientWidth - 48
    const h = 300
    canvas.width = w; canvas.height = h
    guide.width = w; guide.height = h
    const paths = GUIDES[type](w, h)
    drawGuide(guide.getContext('2d'), paths, w, h)
  }, [round, type])

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches ? e.touches[0] : e
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
  }

  function startDraw(e) {
    e.preventDefault()
    drawing.current = true
    lastPos.current = getPos(e, canvasRef.current)
  }

  function draw(e) {
    e.preventDefault()
    if (!drawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = '#14B8A6'
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.stroke()
    lastPos.current = pos
  }

  function stopDraw(e) {
    e.preventDefault()
    drawing.current = false
  }

  function clearCanvas() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  function next() {
    clearCanvas()
    if (round + 1 >= TOTAL_ROUNDS) setDone(true)
    else setRound(r => r + 1)
  }

  if (done) {
    return (
      <div className="page">
        <div className="complete-screen">
          <div style={{ fontSize: 60 }}>✏️</div>
          <h2>{t('greatFocus')}</h2>
          <div className="score-circle">{TOTAL_ROUNDS}<span>/{TOTAL_ROUNDS}</span></div>
          <button className="btn btn-primary btn-lg" onClick={() => onDone(TOTAL_ROUNDS, TOTAL_ROUNDS)}>
            {t('backToActivities')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{pickField(activity, 'title', lang)}</div>
        <span className="level-badge">{t('level')} {level}</span>
      </div>

      <div className="instruction-box">
        {levelData?.label} — {t('traceLine')}
      </div>

      <div className="card" style={{ position: 'relative', padding: 24, cursor: 'crosshair', touchAction: 'none' }}>
        <p className="text-muted mb-8" style={{ fontSize: 17 }}>{t('roundOf', { i: round + 1, n: TOTAL_ROUNDS })}</p>
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#FAFAFA', border: '2px solid var(--border)' }}>
          {/* Guide canvas (dotted lines) */}
          <canvas
            ref={guideRef}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
          />
          {/* Drawing canvas */}
          <canvas
            ref={canvasRef}
            style={{ display: 'block' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
        </div>
      </div>

      <div className="flex gap-12 mt-16">
        <button className="btn btn-ghost" onClick={clearCanvas}>{t('clear')}</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={next}>
          {round + 1 < TOTAL_ROUNDS ? t('nextRound') : t('finish')}
        </button>
      </div>
    </div>
  )
}
