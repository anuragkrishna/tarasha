// Tiny Web Audio cue library — no audio files, no network. Used for answer
// feedback (correct / wrong) and the "out of bounds" buzz in Color the Shape.

let ctx = null
function ac() {
  if (ctx) return ctx
  const C = window.AudioContext || window.webkitAudioContext
  if (C) ctx = new C()
  return ctx
}

function tone(freq, start, dur, type = 'sine', gain = 0.16) {
  const c = ac()
  if (!c) return
  const t0 = c.currentTime + start
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

function wake() {
  const c = ac()
  if (c && c.state === 'suspended') c.resume()
}

// Bright, rising two-note chime.
export function playCorrect() {
  wake()
  tone(523.25, 0, 0.12)      // C5
  tone(783.99, 0.1, 0.20)    // G5
}

// Soft, falling two-note tone — clearly "not right" without being harsh.
export function playWrong() {
  wake()
  tone(311.13, 0, 0.18, 'triangle', 0.14) // Eb4
  tone(220.0, 0.12, 0.26, 'triangle', 0.14) // A3
}

// Short low buzz the moment a stroke crosses outside the boundary.
export function playOutside() {
  wake()
  tone(196.0, 0, 0.14, 'square', 0.1) // G3
}
