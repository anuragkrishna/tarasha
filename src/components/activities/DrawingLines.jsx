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
const TOLERANCE = 16   // px; how far a stroke may stray and still count as "on the line"
const COVER_TOL = 11   // px; a guide point counts as covered only if a stroke is this close
                       // (tighter than TOLERANCE so a missed segment actually lowers the score)

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
  // coverage: share of the guide line that has a stroke close to it
  const samples = samplePaths(paths, 6)
  let covered = 0
  for (const s of samples) {
    for (const p of points) {
      if (Math.hypot(p.x - s.x, p.y - s.y) <= COVER_TOL) { covered++; break }
    }
  }
  const coverage = covered / samples.length
  return 0.7 * coverage + 0.3 * accuracy
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
  const strokePoints = useRef([]) // points drawn so far
  const pathsRef = useRef([])     // current guide geometry
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0) // objective 0..1 accuracy

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
  }, [type])

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

  function check() {
    setScore(scoreTrace(strokePoints.current, pathsRef.current))
    setChecked(true)
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

      {checked && (
        <div style={{
          marginTop: 16, padding: 16, borderRadius: 12,
          background: '#EAFAF1', color: 'var(--success)',
          fontWeight: 700, textAlign: 'center',
        }}>
          <div style={{ fontSize: 30 }}>{Math.round(score * 100)}%</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{t('drawAvgLabel')}</div>
        </div>
      )}

      {checked ? (
        <button className="btn btn-primary btn-lg w-full mt-16" onClick={() => onDone(score, 1)}>
          {t('nextQuestion')}
        </button>
      ) : (
        <div className="flex gap-12 mt-16">
          <button className="btn btn-ghost" onClick={clearCanvas}>{t('clear')}</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={check}>
            {t('check')}
          </button>
        </div>
      )}
    </div>
  )
}
