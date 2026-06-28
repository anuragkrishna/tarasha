import { useRef, useEffect, useState } from 'react'
import { getActivityLevel, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'
import { playCorrect, playWrong, playOutside } from '../../sound'

// Hardcoded hex (Canvas can't read CSS custom properties).
const INK = '#c5613c'      // colour the learner writes with, inside the box
const STRAY = '#a24a36'    // strokes that left the box (--error)
const OUTLINE = '#8d7a66'  // the box boundary (the confined space)
const GUIDE = 'rgba(141,122,102,0.26)' // faint target character to trace over
const BRUSH = 9
const MARGIN = 30

const DIGITS = '0123456789'.split('')
const LETTERS_EN = 'ABCDEFGHJKLMNPRT'.split('') // distinct, easy-to-read glyphs
const LETTERS_HI = ['क', 'ख', 'ग', 'घ', 'च', 'ज', 'ट', 'म', 'र', 'स', 'न', 'प', 'ल', 'भ']

function pickOne(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function buildTarget(kind, lang) {
  if (kind === 'letter') return pickOne(lang === 'hi' ? LETTERS_HI : LETTERS_EN)
  if (kind === 'number2') return pickOne(DIGITS) + pickOne(DIGITS)
  return pickOne(DIGITS)
}

function makeBox(w, h) {
  return { x0: MARGIN, y0: MARGIN, x1: w - MARGIN, y1: h - MARGIN }
}
function inBox(p, b) {
  return b && p.x >= b.x0 && p.x <= b.x1 && p.y >= b.y0 && p.y <= b.y1
}

// Render the faint target character, collect its "ink" points (so coverage is
// measured against the actual glyph, not free scribbling), then draw the box.
function drawGuide(ctx, chars, box, w, h) {
  ctx.clearRect(0, 0, w, h)
  const boxH = box.y1 - box.y0
  const cx = (box.x0 + box.x1) / 2, cy = (box.y0 + box.y1) / 2
  ctx.fillStyle = GUIDE
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `900 ${Math.floor(boxH * 0.74)}px Georgia, "Noto Sans Devanagari", serif`
  ctx.fillText(chars, cx, cy)

  const data = ctx.getImageData(0, 0, w, h).data
  const pts = []
  const step = 7
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] > 40) pts.push({ x, y })
    }
  }

  ctx.lineWidth = 5
  ctx.strokeStyle = OUTLINE
  ctx.strokeRect(box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0)
  return pts
}

export default function WriteInside({ activityId, level, onDone, onBack }) {
  const { t, lang } = useLang()
  const activity = getActivity(activityId, lang)
  const levelData = getActivityLevel(activityId, level, lang)
  const canvasRef = useRef(null)
  const guideRef = useRef(null)
  const boxRef = useRef(null)
  const glyphPtsRef = useRef([])
  const drawing = useRef(false)
  const lastPos = useRef(null)
  const insidePts = useRef([])   // points written inside the box
  const slipRef = useRef(0)      // points that left the box
  const totalRef = useRef(0)
  const wasInsideRef = useRef(true)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [outside, setOutside] = useState(false)

  const kind = levelData?.kind || 'digit'
  const targetRef = useRef(null)
  if (targetRef.current == null) targetRef.current = buildTarget(kind, lang)
  const target = targetRef.current

  useEffect(() => {
    const canvas = canvasRef.current, guide = guideRef.current
    if (!canvas || !guide) return
    const w = canvas.parentElement.clientWidth - 48
    const h = 300
    canvas.width = w; canvas.height = h; guide.width = w; guide.height = h
    const box = makeBox(w, h)
    boxRef.current = box
    glyphPtsRef.current = drawGuide(guide.getContext('2d'), target, box, w, h)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches ? e.touches[0] : e
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
  }

  function paintPoint(ctx, p) {
    const inside = inBox(p, boxRef.current)
    totalRef.current++
    ctx.beginPath()
    ctx.arc(p.x, p.y, BRUSH, 0, Math.PI * 2)
    if (inside) {
      ctx.fillStyle = INK
      insidePts.current.push(p)
    } else {
      ctx.fillStyle = STRAY
      slipRef.current++
      setOutside(true)
      if (wasInsideRef.current) playOutside()
    }
    ctx.fill()
    wasInsideRef.current = inside
  }

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

  // Coverage: share of the target glyph that got traced over.
  function coverage() {
    const glyph = glyphPtsRef.current
    if (!glyph.length) return 0
    let covered = 0
    for (const g of glyph) {
      for (const p of insidePts.current) {
        if (Math.hypot(p.x - g.x, p.y - g.y) <= BRUSH + 6) { covered++; break }
      }
    }
    return covered / glyph.length
  }

  function check() {
    const cov = coverage()
    const total = totalRef.current
    const slipRate = total ? slipRef.current / total : 0
    const inhibition = Math.max(0, 1 - slipRate * 2.5) // staying inside the box dominates
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
        {levelData?.label} — {t('writeRule')}
      </div>

      <div className="card" style={{ position: 'relative', padding: 24, cursor: 'crosshair', touchAction: 'none' }}>
        <div style={{
          position: 'relative', borderRadius: 12, overflow: 'hidden',
          background: 'var(--surface)',
          border: `3px solid ${outside ? 'var(--error)' : 'var(--border)'}`,
          transition: 'border-color 0.15s',
        }}>
          <canvas ref={guideRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />
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
        {/* Persistent note: stays up as long as any stroke is outside the box. */}
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
            <div style={{ fontSize: 15, fontWeight: 600 }}>{t('writeAvgLabel')}</div>
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
