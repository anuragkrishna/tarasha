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

// ---- Objective trace scoring (pure geometry, no AI) ----
const TOLERANCE = 28 // px; how far a stroke may stray and still count as "on the line"

function distToSegment(p, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y
  const len2 = dx * dx + dy * dy
  if (len2 === 0) return Math.hypot(p.x - a.x, p.y - a.y)
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy))
}

function distToPaths(p, paths) {
  let min = Infinity
  for (const path of paths) {
    for (let i = 0; i < path.length - 1; i++) {
      const d = distToSegment(p, path[i], path[i + 1])
      if (d < min) min = d
    }
  }
  return min
}

// Evenly sample the guide lines so we can measure how much of them got traced
function samplePaths(paths, spacing = 8) {
  const samples = []
  for (const path of paths) {
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i], b = path[i + 1]
      const len = Math.hypot(b.x - a.x, b.y - a.y)
      const n = Math.max(1, Math.round(len / spacing))
      for (let s = 0; s <= n; s++) {
        const t = s / n
        samples.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
      }
    }
  }
  return samples
}

// Returns 0..1. Combines coverage (did they trace the whole line?)
// and accuracy (did they stay on it?).
function scoreTrace(points, paths) {
  if (!points || points.length < 2 || !paths.length) return 0
  // accuracy: share of drawn points that landed near a guide line
  let onTrack = 0
  for (const p of points) if (distToPaths(p, paths) <= TOLERANCE) onTrack++
  const accuracy = onTrack / points.length
  // coverage: share of the guide line that has a stroke near it
  const samples = samplePaths(paths)
  let covered = 0
  for (const s of samples) {
    for (const p of points) {
      if (Math.hypot(p.x - s.x, p.y - s.y) <= TOLERANCE) { covered++; break }
    }
  }
  const coverage = covered / samples.length
  return 0.6 * coverage + 0.4 * accuracy
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
  const strokePoints = useRef([]) // points drawn this round
  const pathsRef = useRef([])     // current round's guide geometry
  const roundScores = useRef([])  // objective 0..1 score per round
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
    pathsRef.current = paths
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
    const pos = getPos(e, canvasRef.current)
    lastPos.current = pos
    strokePoints.current.push(pos)
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
    ctx.strokeStyle = '#1B2A4E'
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.stroke()
    lastPos.current = pos
    strokePoints.current.push(pos)
  }

  function stopDraw(e) {
    e.preventDefault()
    drawing.current = false
  }

  function clearCanvas() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    strokePoints.current = []
  }

  function next() {
    // Score this round before clearing the captured strokes
    roundScores.current.push(scoreTrace(strokePoints.current, pathsRef.current))
    clearCanvas()
    if (round + 1 >= TOTAL_ROUNDS) setDone(true)
    else setRound(r => r + 1)
  }

  if (done) {
    const scores = roundScores.current
    queueMicrotask(() => onDone(scores.reduce((a, b) => a + b, 0), TOTAL_ROUNDS))
    return null
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
