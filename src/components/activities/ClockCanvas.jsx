import { useRef, useEffect } from 'react'
import { useLang } from '../../i18n'

// Draws a blank analog clock face (circle, hour numbers, center dot) as a guide.
function drawFace(ctx, size) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 16
  ctx.clearRect(0, 0, size, size)

  // outer circle
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.strokeStyle = '#999'
  ctx.lineWidth = 4
  ctx.stroke()

  // hour numbers
  ctx.fillStyle = '#555'
  ctx.font = `bold ${Math.round(size * 0.09)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (let n = 1; n <= 12; n++) {
    const angle = (n / 12) * Math.PI * 2 - Math.PI / 2
    const nx = cx + Math.cos(angle) * (r - 22)
    const ny = cy + Math.sin(angle) * (r - 22)
    ctx.fillText(String(n), nx, ny)
  }

  // center dot
  ctx.beginPath()
  ctx.arc(cx, cy, 5, 0, Math.PI * 2)
  ctx.fillStyle = '#555'
  ctx.fill()
}

export default function ClockCanvas({ resetKey }) {
  const { t } = useLang()
  const drawRef = useRef(null)
  const faceRef = useRef(null)
  const drawing = useRef(false)
  const lastPos = useRef(null)

  useEffect(() => {
    const draw = drawRef.current
    const face = faceRef.current
    if (!draw || !face) return
    const size = Math.min(draw.parentElement.clientWidth, 320)
    draw.width = size; draw.height = size
    face.width = size; face.height = size
    drawFace(face.getContext('2d'), size)
    // clear any prior strokes when the round changes
    draw.getContext('2d').clearRect(0, 0, size, size)
  }, [resetKey])

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect()
    const t = e.touches ? e.touches[0] : e
    return { x: t.clientX - rect.left, y: t.clientY - rect.top }
  }

  function start(e) { e.preventDefault(); drawing.current = true; lastPos.current = getPos(e, drawRef.current) }
  function move(e) {
    e.preventDefault()
    if (!drawing.current) return
    const ctx = drawRef.current.getContext('2d')
    const pos = getPos(e, drawRef.current)
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = '#c5613c'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.stroke()
    lastPos.current = pos
  }
  function stop(e) { e.preventDefault(); drawing.current = false }

  function clear() {
    const c = drawRef.current
    c.getContext('2d').clearRect(0, 0, c.width, c.height)
  }

  return (
    <div>
      <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto', borderRadius: 12, overflow: 'hidden', background: 'var(--surface)', border: '2px solid var(--border)', touchAction: 'none' }}>
        <canvas ref={faceRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />
        <canvas
          ref={drawRef}
          style={{ display: 'block', cursor: 'crosshair' }}
          onMouseDown={start} onMouseMove={move} onMouseUp={stop} onMouseLeave={stop}
          onTouchStart={start} onTouchMove={move} onTouchEnd={stop}
        />
      </div>
      <button className="btn btn-ghost mt-16" onClick={clear} style={{ width: '100%' }}>{t('clearClock')}</button>
    </div>
  )
}
