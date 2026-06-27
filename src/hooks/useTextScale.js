import { useState } from 'react'

const KEY = 'tarasha_textscale'
export const SCALES = { A: 1, 'A+': 1.18, 'A++': 1.36 }

// Scale the whole UI for older eyes. The app uses fixed px sizes, so a root
// zoom is the reliable way to scale everything together (widely supported).
export function applyTextScale(label) {
  const z = SCALES[label] ?? 1
  try {
    const el = document.documentElement
    el.style.zoom = String(z)
    // Full-height containers divide this out so they still match the real screen.
    el.style.setProperty('--zoom', String(z))
  } catch {}
}

export function getTextScale() {
  try { return localStorage.getItem(KEY) || 'A+' } catch { return 'A+' }
}

export function useTextScale() {
  const [scale, setScale] = useState(getTextScale)
  const set = (label) => {
    try { localStorage.setItem(KEY, label) } catch {}
    applyTextScale(label)
    setScale(label)
  }
  return [scale, set]
}
