import { ACTIVITIES } from './data/activities'

// ---- Lesson configuration ----
// A lesson is a short (~10 min) set of activities mixed across the skill pillars
// (= activity categories). Lessons are free-flow: a learner can do as many in a
// row as they like. The first few lessons follow a fixed difficulty ladder; after
// that, each new lesson adapts to past performance and the previous lesson.

export const MIN_ACTIVITIES = 7      // always at least this many
export const TIME_BUDGET_MIN = 14    // keep adding past the minimum until ~14 min
export const MAX_ACTIVITIES = 11     // hard safety cap
export const MAX_PER_PILLAR = 2      // never more than this many of one type per lesson
export const DEFAULT_DURATION = 2    // estimated minutes for an activity

// A few activities take noticeably longer than the 2-min default.
const DURATION_OVERRIDE = {
  'breath-count': 3,
  'story-narration': 3,
  'describe-picture': 3,
  'picture-story': 3,
  'daily-events-recall': 3,
  'cooking-plan': 2.5,
  'clap-when': 3,
}

export function durationOf(id) {
  return DURATION_OVERRIDE[id] ?? DEFAULT_DURATION
}

const CATEGORY_OF = Object.fromEntries(ACTIVITIES.map(a => [a.id, a.category]))

// Highest level an activity actually defines (so a difficulty target never asks
// for a level that doesn't exist and silently falls back to level 1).
const MAX_LEVEL_OF = Object.fromEntries(
  ACTIVITIES.map(a => [a.id, (a.levels || []).reduce((m, l) => Math.max(m, l.level), 1)])
)

function clampLevel(id, level) {
  return Math.max(1, Math.min(level, MAX_LEVEL_OF[id] || 1, 3))
}

// Fisher–Yates shuffle (browser runtime; Math.random is fine here).
function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ---- Prebuilt curriculum: 10 lessons of increasing difficulty ----
// Each is a balanced mix (all 4 pillars represented, max 2 per pillar) run at a
// fixed level. Levels ramp 1 → 2 → 3 across the ten lessons.
export const PREBUILT = [
  { level: 1, ids: ['odd-one-out', 'categorisation', 'memory-numbers', 'clap-when', 'drawing-lines', 'describe-picture', 'copy-text'] },
  { level: 1, ids: ['weights-concept', 'money-transaction', 'items-recall', 'reverse-counting', 'story-narration', 'breath-count', 'clap-when'] },
  { level: 1, ids: ['odd-one-out', 'categorisation', 'sentence-repeat', 'copy-text', 'picture-story', 'drawing-lines', 'describe-picture'] },
  { level: 2, ids: ['weights-concept', 'money-transaction', 'cause-effect', 'memory-numbers', 'daily-events-recall', 'breath-count', 'clap-when'] },
  { level: 2, ids: ['odd-one-out', 'categorisation', 'cooking-plan', 'items-recall', 'story-narration', 'drawing-lines', 'describe-picture'] },
  { level: 2, ids: ['weights-concept', 'money-transaction', 'reverse-counting', 'delayed-recall', 'picture-story', 'breath-count', 'clap-when'] },
  { level: 3, ids: ['odd-one-out', 'money-transaction', 'cause-effect', 'memory-numbers', 'sentence-repeat', 'drawing-lines', 'describe-picture'] },
  { level: 3, ids: ['weights-concept', 'categorisation', 'copy-text', 'items-recall', 'daily-events-recall', 'breath-count', 'clap-when'] },
  { level: 3, ids: ['odd-one-out', 'money-transaction', 'cooking-plan', 'sentence-repeat', 'picture-story', 'drawing-lines', 'describe-picture'] },
  { level: 3, ids: ['weights-concept', 'categorisation', 'cause-effect', 'delayed-recall', 'story-narration', 'breath-count', 'clap-when'] },
]

export const PREBUILT_COUNT = PREBUILT.length

// Info about the next lesson, for display (difficulty label / prebuilt vs adaptive).
export function lessonInfo(completed = 0) {
  if (completed < PREBUILT.length) {
    return { prebuilt: true, level: PREBUILT[completed].level }
  }
  return { prebuilt: false, level: null }
}

// Rolled-up recent stats for one activity from the progress `data` object.
function activityStats(id, data) {
  const h = data?.[id]?.history || []
  const last = h[h.length - 1]
  const recent = h.slice(-3).filter(e => e.total > 0)
  const avgPct = recent.length
    ? recent.reduce((s, e) => s + e.score / e.total, 0) / recent.length
    : null
  return { count: h.length, lastTs: last ? last.timestamp : 0, avgPct }
}

// Adaptive lesson: mix across pillars, target weak areas, avoid the previous
// lesson's activities, and nudge difficulty up on mastered activities.
function buildAdaptiveLesson(data, lessonMeta) {
  const lastIds = new Set(lessonMeta.lastIds || [])
  const now = Date.now()

  const scored = ACTIVITIES.map(a => {
    const { count, lastTs, avgPct } = activityStats(a.id, data)
    const daysSince = lastTs ? (now - lastTs) / 86400000 : 365
    const recency = Math.min(daysSince, 30)              // older = higher
    const weakness = avgPct === null ? 0.5 : 1 - avgPct  // weaker = higher → targets weak areas
    const neverBonus = count === 0 ? 10 : 0              // surface untried activities
    const jitter = Math.random()                         // fresh variety each lesson
    const repeatPenalty = lastIds.has(a.id) ? -100 : 0   // avoid repeating the previous lesson
    const priority = recency * 1.0 + weakness * 8 + neverBonus + jitter + repeatPenalty

    // Progressive difficulty: once an activity is being done well, push it up a level.
    const savedLevel = data?.[a.id]?.level || 1
    const boost = avgPct !== null && avgPct >= 0.8 ? 1 : 0
    const level = clampLevel(a.id, savedLevel + boost)

    return { id: a.id, category: a.category, priority, level, duration: durationOf(a.id) }
  })

  // Group by pillar (= category) so the lesson spreads across skill areas.
  const byCat = {}
  scored.forEach(s => { (byCat[s.category] = byCat[s.category] || []).push(s) })
  Object.values(byCat).forEach(arr => arr.sort((a, b) => b.priority - a.priority))

  // Rotate which pillar leads each lesson, for variety across lessons.
  let cats = Object.keys(byCat).sort()
  if (cats.length) {
    const rot = (lessonMeta.completed || 0) % cats.length
    cats = cats.slice(rot).concat(cats.slice(0, rot))
  }

  const lesson = []
  const perCat = {}
  let totalMin = 0
  const take = (pick) => {
    lesson.push(pick)
    perCat[pick.category] = (perCat[pick.category] || 0) + 1
    totalMin += pick.duration
  }
  const full = () => lesson.length >= MIN_ACTIVITIES && totalMin >= TIME_BUDGET_MIN

  // Pass 1 — coverage: one activity from each pillar so every lesson is mixed.
  for (const c of cats) {
    if (lesson.length >= MAX_ACTIVITIES) break
    if (byCat[c].length) take(byCat[c].shift())
  }

  // Pass 2 — fill by global priority, but never exceed MAX_PER_PILLAR of one type.
  const pool = cats.flatMap(c => byCat[c]).sort((a, b) => b.priority - a.priority)
  while (!full() && lesson.length < MAX_ACTIVITIES && pool.length) {
    const idx = pool.findIndex(p => (perCat[p.category] || 0) < MAX_PER_PILLAR)
    if (idx === -1) break
    take(pool.splice(idx, 1)[0])
  }

  return lesson
}

// Build the next lesson.
//   data       — per-activity progress { [id]: { level, history } }
//   lessonMeta — { completed: number, lastIds: string[] }
// Returns an ordered (randomised) list of { id, level }.
export function buildLesson(data, lessonMeta = {}, lessonIndex) {
  // Which lesson to build (0-based). Defaults to the next uncompleted one, but a
  // specific index can be passed to (re)play an already-unlocked prebuilt lesson.
  const idx = lessonIndex == null ? (lessonMeta.completed || 0) : lessonIndex

  let picks
  if (idx < PREBUILT.length) {
    // Prebuilt curriculum lesson at its fixed difficulty.
    const plan = PREBUILT[idx]
    picks = plan.ids.map(id => ({ id, category: CATEGORY_OF[id], level: clampLevel(id, plan.level) }))
  } else {
    picks = buildAdaptiveLesson(data, lessonMeta)
  }

  // Randomise the order so lessons never feel scripted.
  return shuffle(picks).map(({ id, level }) => ({ id, level }))
}
