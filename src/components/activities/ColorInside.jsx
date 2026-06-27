import { useRef, useEffect, useState } from 'react'
import { getActivityLevel, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'
import { playCorrect, playWrong, playOutside } from '../../sound'

// Hardcoded hex (Canvas can't read CSS custom properties).
const FILL = '#c5613c'     // colour laid down inside the shape
const STRAY = '#a24a36'    // colour for strokes that left the shape (--error)
const OUTLINE = '#8d7a66'  // the boundary of the confined space
const TINT = 'rgba(141,122,102,0.10)' // faint fill so the space reads as "fill me"
const BRUSH = 9            // brush radius
const MARGIN = 34          // padding from the canvas edge

// ---- Shape geometry + inside test (pure, no AI) ----
function makeShape(type, w, h) {
  if (type === 'square') {
    const side = Math.min(w, h) - 2 * MARGIN
    const x0 = (w - side) / 2, y0 = (h - side) / 2
    return { type, x0, y0, x1: x0 + side, y1: y0 + side }
  }
  if (type === 'triangle') {
    return { type, a: { x: w / 2, y: MARGIN }, b: { x: MARGIN, y: h - MARGIN }, c: { x: w - MARGIN, y: h - MARGIN } }
  }
  return { type: 'circle', cx: w / 2, cy: h / 2, r: Math.min(w, h) / 2 - MARGIN }
}

function sign(p, a, b) { return (p.x - b.x) * (a.y - b.y) - (a.x - b.x) * (p.y - b.y) }

function inShape(p, s) {
  if (!s) return true
  if (s.type === 'circle') return Math.hypot(p.x - s.cx, p.y - s.cy) <= s.r
  if (s.type === 'square') return p.x >= s.x0 && p.x <= s.x1 && p.y >= s.y0 && p.y <= s.y1
  const d1 = sign(p, s.a, s.b), d2 = sign(p, s.b, s.c), d3 = sign(p, s.c, s.a)
  const neg = d1 < 0 || d2 < 0 || d3 < 0
  const pos = d1 > 0 || d2 > 0 || d3 > 0
  return !(neg && pos)
}

function drawShape(ctx, s, w, h) {
  ctx.clearRect(0, 0, w, h)
  ctx.lineWidth = 5
  ctx.lineJoin = 'round'
  ctx.strokeStyle = OUTLINE
  ctx.fillStyle = TINT
  ctx.beginPath()
  if (s.type === 'circle') {
    ctx.arc(s.cx, s.cy, s.r, 0, Math.PI * 2)
  } else if (s.type === 'square') {
    ctx.rect(s.x0, s.y0, s.x1 - s.x0, s.y1 - s.y0)
  } else {
    ctx.moveTo(s.a.x, s.a.y); ctx.lineTo(s.b.x, s.b.y); ctx.lineTo(s.c.x, s.c.y); ctx.closePath()
  }
  ctx.fill()
  ctx.stroke()
}

export default function ColorInside({ activityId, level, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)
  const levelData = getActivityLevel(activityId, level, lang)
  const canvasRef = useRef(null)
  const shapeRef = useRef(null)
  const geomRef = useRef(null)
  const drawing = useRef(false)
  const lastPos = useRef(null)
  const insidePts = useRef([])  // points painted inside (for coverage)
  const slipRef = useRef(0)     // points painted outside the line
  const totalRef = useRef(0)    // all painted points
  const wasInsideRef = useRef(true) // tracks crossings so the buzz fires once per excursion
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [outside, setOutside] = useState(false) // drives the red visual cue

  const type = levelData?.shape || 'circle'

  useEffect(() => {
    const canvas = canvasRef.current, shape = shapeRef.current
    if (!canvas || !shape) return
    const w = canvas.parentElement.clientWidth - 48
    const h = 300
    canvas.width = w; canvas.height = h; shape.width = w; shape.height = h
    const geom = makeShape(type, w, h)
    geomRef.current = geom
    drawShape(shape.getContext('2d'), geom, w, h)
  }, [type])

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches ? e.touches[0] : e
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
  }

  function paintPoint(ctx, p) {
    const inside = inShape(p, geomRef.current)
    totalRef.current++
    ctx.beginPath()
    ctx.arc(p.x, p.y, BRUSH, 0, Math.PI * 2)
    if (inside) {
      ctx.fillStyle = FILL
      insidePts.current.push(p)
    } else {
      ctx.fillStyle = STRAY
      slipRef.current++
      setOutside(true)                       // note stays up while strays are on canvas
      if (wasInsideRef.current) playOutside() // buzz once each time we cross out
    }
    ctx.fill()
    wasInsideRef.current = inside
  }

  // Sub-sample along the stroke so fast moves are still classified accurately.
  function addStroke(from, to) {
    const ctx = canvasRef.current.getContext('2d')
    const dist = Math.hypot(to.x - from.x, to.y - from.y)
    const steps = Math.max(1, Math.round(dist / 4))
    for (let i = 1; i <= steps; i++) {
      const k = i / steps
      paintPoint(ctx, { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k })
    }
  }

  function startDraw(e) {
    e.preventDefault()
    if (checked) return
    drawing.current = true
    const p = getPos(e, canvasRef.current)
    lastPos.current = p
    paintPoint(canvasRef.current.getContext('2d'), p)
  }
  function draw(e) {
    e.preventDefault()
    if (!drawing.current) return
    const p = getPos(e, canvasRef.current)
    addStroke(lastPos.current, p)
    lastPos.current = p
  }
  function stopDraw(e) { e.preventDefault(); drawing.current = false }

  function clearCanvas() {
    const c = canvasRef.current
    c.getContext('2d').clearRect(0, 0, c.width, c.height)
    insidePts.current = []; slipRef.current = 0; totalRef.current = 0
    wasInsideRef.current = true
    setOutside(false)
  }

  // Coverage: share of the shape's interior that actually got painted.
  function coverage() {
    const s = geomRef.current
    const c = canvasRef.current
    if (!s || !c) return 0
    const step = 16
    let total = 0, covered = 0
    for (let y = 0; y < c.height; y += step) {
      for (let x = 0; x < c.width; x += step) {
        const cell = { x, y }
        if (!inShape(cell, s)) continue
        total++
        for (const p of insidePts.current) {
          if (Math.hypot(p.x - x, p.y - y) <= BRUSH + step / 2) { covered++; break }
        }
      }
    }
    return total ? covered / total : 0
  }

  function check() {
    const cov = coverage()
    const total = totalRef.current
    const slipRate = total ? slipRef.current / total : 0
    const inhibition = Math.max(0, 1 - slipRate * 2.5) // staying inside dominates the score
    const sc = Math.max(0, Math.min(1, 0.55 * cov + 0.45 * inhibition))
    setScore(sc)
    setChecked(true)
    if (sc >= 0.6) playCorrect(); else playWrong()
  }

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{pickField(activity, 'title', lang)}</div>
        <span className="level-badge">{t('level')} {level}</span>
      </div>

      <div className="instruction-box">
        {levelData?.label} — {t('colorRule')}
      </div>

      <div className="card" style={{ position: 'relative', padding: 24, cursor: 'crosshair', touchAction: 'none' }}>
        <div style={{
          position: 'relative', borderRadius: 12, overflow: 'hidden',
          background: 'var(--surface)',
          border: `3px solid ${outside ? 'var(--error)' : 'var(--border)'}`,
          transition: 'border-color 0.15s',
        }}>
          <canvas ref={shapeRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />
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
        {/* Persistent note: stays up as long as any stroke is outside the line. */}
        <div style={{ minHeight: 30, marginTop: 10, textAlign: 'center' }}>
          {outside && !checked && (
            <span style={{
              display: 'inline-block',
              background: 'var(--error)', color: '#fff', padding: '6px 16px',
              borderRadius: 20, fontWeight: 700, fontSize: 15,
            }}>
              ⚠ {t('colorSlip')}
            </span>
          )}
        </div>
      </div>

      {/* Reserved space so the button stays put whether or not the score shows. */}
      <div style={{ minHeight: 84, marginTop: 16, display: 'flex', alignItems: 'center' }}>
        {checked && (
          <div style={{
            width: '100%', padding: 16, borderRadius: 12,
            background: 'var(--ok-bg)', color: 'var(--success)',
            fontWeight: 700, textAlign: 'center',
          }}>
            <div style={{ fontSize: 30 }}>{Math.round(score * 100)}%</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{t('colorAvgLabel')}</div>
          </div>
        )}
      </div>

      {checked ? (
        <button className="btn btn-primary btn-lg w-full" onClick={() => onDone(score, 1)}>
          {t('nextQuestion')}
        </button>
      ) : (
        <div className="flex gap-12">
          <button className="btn btn-ghost" onClick={clearCanvas}>{t('clear')}</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={check}>
            {t('check')}
          </button>
        </div>
      )}
    </div>
  )
}
