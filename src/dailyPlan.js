import { ACTIVITIES } from './data/activities'

// Activities that are rated by the caregiver (Good / Needs work) rather than auto-scored.
export const OBSERVED_IDS = new Set([
  'daily-events-recall',
  'story-narration',
  'describe-picture',
  'drawing-lines',
  'breath-count',
  'picture-story',
])

export function getMode(id) {
  return OBSERVED_IDS.has(id) ? 'observed' : 'measured'
}

export const PLAN_SIZE = 6

function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

// Per-activity rollup from the progress `data` object:
// data = { [id]: { level, history: [{ date, score, total, timestamp }] } }
export function activityStats(id, data) {
  const h = data?.[id]?.history || []
  const last = h[h.length - 1]
  const recent = h.slice(-3).filter(e => e.total > 0)
  const avgPct = recent.length
    ? recent.reduce((s, e) => s + e.score / e.total, 0) / recent.length
    : null
  return { count: h.length, lastTs: last ? last.timestamp : 0, avgPct }
}

// Deterministic-per-day plan: domain-balanced, weighted toward weak + least-recent skills.
export function buildDailyPlan(data, dateStr, size = PLAN_SIZE) {
  const seed = hashStr(dateStr)
  const now = new Date(dateStr + 'T00:00:00').getTime()

  const scored = ACTIVITIES.map((a, idx) => {
    const { count, lastTs, avgPct } = activityStats(a.id, data)
    const daysSince = lastTs ? (now - lastTs) / 86400000 : 365
    const recency = Math.min(daysSince, 30)          // 0..30, older = higher
    const weakness = avgPct === null ? 0.5 : 1 - avgPct // 0..1, weaker = higher
    const neverBonus = count === 0 ? 10 : 0            // surface untried activities
    const jitter = ((seed + idx * 7919) % 100) / 100   // stable daily variety
    const priority = recency * 1.0 + weakness * 8 + neverBonus + jitter
    return { id: a.id, category: a.category, priority }
  })

  // Group by domain (category) so the plan spreads across skill areas.
  const byCat = {}
  scored.forEach(s => { (byCat[s.category] = byCat[s.category] || []).push(s) })
  Object.values(byCat).forEach(arr => arr.sort((a, b) => b.priority - a.priority))
  const cats = Object.keys(byCat).sort()

  // Round-robin across domains, always taking the highest-priority remaining.
  const plan = []
  let i = 0
  while (plan.length < size && cats.some(c => byCat[c].length)) {
    const c = cats[i % cats.length]
    if (byCat[c].length) plan.push(byCat[c].shift().id)
    i++
  }
  return plan
}
