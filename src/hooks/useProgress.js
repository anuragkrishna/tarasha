import { useState, useCallback } from 'react'
import { getMode } from '../dailyPlan'
import { buildLesson, lessonInfo } from '../lessons'
import { ACTIVITIES } from '../data/activities'

const CATEGORY_OF = Object.fromEntries(ACTIVITIES.map(a => [a.id, a.category]))

const STORAGE_KEY = 'learnapp_progress'
const LESSON_KEY = 'learnapp_lessons'
const DEFAULT_LEVEL = 1

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

function loadLessonMeta() {
  try {
    const raw = localStorage.getItem(LESSON_KEY)
    const m = raw ? JSON.parse(raw) : null
    return m && typeof m.completed === 'number' ? m : { completed: 0, lastIds: [] }
  } catch {
    return { completed: 0, lastIds: [] }
  }
}

function saveLessonMeta(m) {
  try { localStorage.setItem(LESSON_KEY, JSON.stringify(m)) } catch {}
}

export function useProgress() {
  const [data, setData] = useState(() => load())
  const [lessonMeta, setLessonMeta] = useState(() => loadLessonMeta())

  // ---- Lessons (free-flow) ----

  // The number of the lesson the learner is about to do (1-based).
  const getLessonNumber = useCallback(() => (lessonMeta.completed || 0) + 1, [lessonMeta])
  const getLessonsCompleted = useCallback(() => lessonMeta.completed || 0, [lessonMeta])

  // Build the next lesson, adapting to past performance and the previous lesson.
  const buildNextLesson = useCallback(() => buildLesson(data, lessonMeta), [data, lessonMeta])

  // Difficulty / prebuilt info for the next lesson (for the dashboard card).
  const getNextLessonInfo = useCallback(() => lessonInfo(lessonMeta.completed || 0), [lessonMeta])

  // Mark a lesson finished: bump the count and remember its activities so the
  // next lesson can avoid repeating them.
  const completeLesson = useCallback((ids) => {
    setLessonMeta(prev => {
      const next = { completed: (prev.completed || 0) + 1, lastIds: ids || [] }
      saveLessonMeta(next)
      return next
    })
  }, [])

  // ---- Per-activity level & results ----

  const getLevel = useCallback((activityId) => {
    return data[activityId]?.level || DEFAULT_LEVEL
  }, [data])

  // What the saved level WOULD become after this result — does not save anything.
  // `baseLevel` is the level the activity was actually played at (progressive
  // lessons may run it above the saved level); falls back to the saved level.
  const computeLevelChange = useCallback((activityId, score, total, baseLevel) => {
    const currentLevel = baseLevel ?? (data[activityId]?.level || DEFAULT_LEVEL)
    const pct = total > 0 ? score / total : 0
    let newLevel = currentLevel
    if (pct >= 0.8 && currentLevel < 3) newLevel = currentLevel + 1
    else if (pct < 0.5 && currentLevel > 1) newLevel = currentLevel - 1
    return { currentLevel, newLevel }
  }, [data])

  // Save a result. `finalLevel` becomes the new saved level; `playedLevel` is
  // recorded in history as the level actually attempted.
  const recordResult = useCallback((activityId, score, total, finalLevel, notes = '', playedLevel = null) => {
    const today = new Date().toISOString().split('T')[0]
    setData(prev => {
      const activity = prev[activityId] || { level: DEFAULT_LEVEL, history: [] }
      const historyEntry = {
        date: today,
        score,
        total,
        level: playedLevel ?? activity.level ?? DEFAULT_LEVEL,
        notes,
        timestamp: Date.now()
      }
      const updated = {
        ...prev,
        [activityId]: {
          ...activity,
          level: finalLevel,
          history: [...(activity.history || []), historyEntry]
        }
      }
      save(updated)
      return updated
    })
  }, [])

  // Directly override the level (caregiver manual control)
  const setLevel = useCallback((activityId, level) => {
    setData(prev => {
      const activity = prev[activityId] || { level: DEFAULT_LEVEL, history: [] }
      const updated = {
        ...prev,
        [activityId]: { ...activity, level: Math.min(3, Math.max(1, level)) }
      }
      save(updated)
      return updated
    })
  }, [])

  // Returns all history across all activities, sorted newest first
  const getFullLog = useCallback(() => {
    const result = []
    Object.entries(data).forEach(([activityId, activity]) => {
      if (activity.history) {
        activity.history.forEach(h => result.push({ activityId, ...h }))
      }
    })
    return result.sort((a, b) => b.timestamp - a.timestamp)
  }, [data])

  const getStreak = useCallback(() => {
    const allDates = new Set()
    Object.values(data).forEach(activity => {
      if (activity.history) {
        activity.history.forEach(h => allDates.add(h.date))
      }
    })
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      if (allDates.has(dateStr)) {
        streak++
      } else {
        break
      }
    }
    return streak
  }, [data])

  // ---- Analytics for the progress view ----

  // Average % over a window of days, optionally filtered by mode ('measured' | 'observed').
  const getAverage = useCallback((days = 7, mode = null) => {
    const cutoff = days ? Date.now() - days * 86400000 : 0
    let sum = 0, n = 0
    Object.entries(data).forEach(([id, activity]) => {
      if (mode && getMode(id) !== mode) return
      ;(activity.history || []).forEach(h => {
        if (h.timestamp >= cutoff && h.total > 0) { sum += h.score / h.total; n++ }
      })
    })
    return n > 0 ? Math.round((sum / n) * 100) : null
  }, [data])

  // Weekly average % per category, for the last `weeks` weeks (oldest → newest).
  const getWeeklyByCategory = useCallback((categories, weeks = 6) => {
    const now = new Date()
    const startOfWeek = (offset) => {
      const d = new Date(now)
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() - d.getDay() - offset * 7) // week starting Sunday
      return d.getTime()
    }
    // Flatten log with resolved category
    const entries = []
    Object.entries(data).forEach(([id, activity]) => {
      const cat = CATEGORY_OF[id]
      ;(activity.history || []).forEach(h => entries.push({ id, cat, ...h }))
    })
    const result = {}
    categories.forEach(c => { result[c] = [] })
    for (let w = weeks - 1; w >= 0; w--) {
      const from = startOfWeek(w)
      const to = startOfWeek(w - 1)
      categories.forEach(cat => {
        const inWeek = entries.filter(e => e.timestamp >= from && e.timestamp < to && e.total > 0 && e.cat === cat)
        const avg = inWeek.length
          ? Math.round(inWeek.reduce((s, e) => s + e.score / e.total, 0) / inWeek.length * 100)
          : null
        result[cat].push({ avg, count: inWeek.length })
      })
    }
    return result
  }, [data])

  // Activities completed (any) over a window.
  const getCompletedDays = useCallback((days = 7) => {
    const cutoff = Date.now() - days * 86400000
    const set = new Set()
    Object.values(data).forEach(a => (a.history || []).forEach(h => { if (h.timestamp >= cutoff) set.add(h.date) }))
    return set.size
  }, [data])

  // Wipe all saved progress, levels, history and lesson count — start fresh.
  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(LESSON_KEY)
    } catch {}
    setData({})
    const fresh = { completed: 0, lastIds: [] }
    setLessonMeta(fresh)
    saveLessonMeta(fresh)
  }, [])

  return {
    getLevel, computeLevelChange, recordResult, setLevel, getFullLog, getStreak,
    getLessonNumber, getLessonsCompleted, getNextLessonInfo, buildNextLesson, completeLesson,
    getAverage, getWeeklyByCategory, getCompletedDays, resetAll,
  }
}
