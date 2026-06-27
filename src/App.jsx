import { useState, useEffect, useRef, useCallback } from 'react'
import Dashboard from './components/Dashboard'
import Landing from './components/Landing'
import Progress from './components/Progress'
import CopyText from './components/activities/CopyText'
import MemoryNumbers from './components/activities/MemoryNumbers'
import ReverseCounting from './components/activities/ReverseCounting'
import ItemsRecall from './components/activities/ItemsRecall'
import SentenceRepeat from './components/activities/SentenceRepeat'
import CauseEffect from './components/activities/CauseEffect'
import DailyEventsRecall from './components/activities/DailyEventsRecall'
import PictureStory from './components/activities/PictureStory'
import StoryNarration from './components/activities/StoryNarration'
import DrawingLines from './components/activities/DrawingLines'
import CookingPlan from './components/activities/CookingPlan'
import DelayedRecall from './components/activities/DelayedRecall'
import DescribePicture from './components/activities/DescribePicture'
import BreathCount from './components/activities/BreathCount'
import ClapWhen from './components/activities/ClapWhen'
import SingleQuiz from './components/activities/SingleQuiz'
import LessonSummary from './components/LessonSummary'
import { useProgress } from './hooks/useProgress'
import { useAuth } from './hooks/useAuth'
import { useLang } from './i18n'
import { getMode } from './dailyPlan'
import { applyTextScale, getTextScale } from './hooks/useTextScale'
import { lessonInfo } from './lessons'
import { quizQuestions, interleave, shuffle } from './quiz'
import { ACTIVITIES } from './data/activities'
import { track } from './firebase'

const CATEGORY_OF = Object.fromEntries(ACTIVITIES.map(a => [a.id, a.category]))

// Reorder steps so no two consecutive share a category (recall after recall,
// etc.) — greedily take from the largest remaining group that isn't the last one.
function spreadByCategory(steps) {
  const groups = {}
  for (const s of steps) (groups[s.cat] = groups[s.cat] || []).push(s)
  const out = []
  let last = null
  while (out.length < steps.length) {
    const cats = Object.keys(groups).filter(c => groups[c].length)
    cats.sort((a, b) => groups[b].length - groups[a].length)
    const pick = cats.find(c => c !== last) ?? cats[0]
    out.push(groups[pick].shift())
    last = pick
  }
  return out
}

// Non-quiz activities run as their own step; quiz activities are expanded into
// individual question steps and mixed through the lesson.
const ACTIVITY_COMPONENTS = {
  'copy-text': CopyText,
  'memory-numbers': MemoryNumbers,
  'reverse-counting': ReverseCounting,
  'items-recall': ItemsRecall,
  'sentence-repeat': SentenceRepeat,
  'cause-effect': CauseEffect,
  'daily-events-recall': DailyEventsRecall,
  'picture-story': PictureStory,
  'story-narration': StoryNarration,
  'drawing-lines': DrawingLines,
  'cooking-plan': CookingPlan,
  'delayed-recall': DelayedRecall,
  'describe-picture': DescribePicture,
  'breath-count': BreathCount,
  'clap-when': ClapWhen,
}

// Single-select quiz activities — expanded into individual question steps.
const INTERLEAVE_IDS = new Set(['odd-one-out', 'weights-concept', 'money-transaction', 'categorisation'])

// Build a flat, mixed list of lesson steps: quiz activities become individual
// question steps (interleaved by type so no two same-type questions are adjacent),
// then those are woven through the non-quiz activities so categories alternate.
function buildSteps(items, lang, t) {
  const quizLists = []
  const others = []
  for (const it of items) {
    if (INTERLEAVE_IDS.has(it.id)) {
      const qs = quizQuestions(it, lang, t)
      if (qs.length) quizLists.push(qs.map(q => ({ kind: 'q', id: it.id, level: it.level, question: q, cat: 'Learning' })))
    } else {
      others.push({ kind: 'activity', ...it, cat: CATEGORY_OF[it.id] || 'Other' })
    }
  }
  const quizSteps = interleave(shuffle(quizLists))      // quiz types alternate
  return spreadByCategory([...quizSteps, ...shuffle(others)])
}

export default function App() {
  const [screen, setScreen] = useState('dashboard')
  const [steps, setSteps] = useState([])
  const [stepIndex, setStepIndex] = useState(0)
  const [lessonResults, setLessonResults] = useState([]) // [{ id, score, total, level, mode }]
  const [lessonNumber, setLessonNumber] = useState(1)
  const [playedLessonIndex, setPlayedLessonIndex] = useState(0)
  const auth = useAuth()
  const progress = useProgress(auth.user)
  const { t, lang } = useLang()

  const outcomesRef = useRef([])  // non-quiz outcomes: { id, score, total, level, notes }
  const quizAggRef = useRef({})   // quiz src -> { score, total, level }
  const handledRef = useRef(-1)   // guards double auto-advance for the current step

  // Light path routing: "/" = landing, "/app" = the app.
  const [path, setPath] = useState(() => window.location.pathname)
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  const navigate = useCallback((to) => {
    if (window.location.pathname !== to) window.history.pushState({}, '', to)
    setPath(to)
  }, [])
  const isAppRoute = path.startsWith('/app')

  useEffect(() => { track('app_open') }, [])

  // The landing page is always standard size; the app uses the chosen text size.
  useEffect(() => {
    applyTextScale(isAppRoute ? getTextScale() : 'A')
  }, [isAppRoute])

  useEffect(() => {
    if (!isAppRoute && auth.ready && auth.user) navigate('/app')
  }, [isAppRoute, auth.ready, auth.user, navigate])

  const handleSignOut = useCallback(async () => {
    await auth.signOut()
    navigate('/')
  }, [auth, navigate])

  // Start a lesson by index (a tile tap), or the next one by default.
  function startLesson(lessonIdx) {
    const idx = typeof lessonIdx === 'number' ? lessonIdx : progress.getLessonsCompleted()
    // Guests may only play lesson 1; any later lesson requires a Google sign-in.
    if (!auth.user && auth.configured && idx >= 1) {
      setScreen('gate')
      return
    }
    const built = progress.buildNextLesson(idx)
    if (!built.length) { setScreen('dashboard'); return }
    const info = lessonInfo(idx)
    track('lesson_start', { lesson_number: idx + 1, level: info.level || 0, prebuilt: info.prebuilt })
    setPlayedLessonIndex(idx)
    setLessonNumber(idx + 1)
    // Tag each activity with its exposure so the ladder serves tougher questions.
    const withExposure = built.map(it => ({ ...it, exposure: progress.getExposure(it.id) }))
    const newSteps = buildSteps(withExposure, lang, t)
    outcomesRef.current = []
    quizAggRef.current = {}
    for (const s of newSteps) {
      if (s.kind === 'q') {
        const a = quizAggRef.current[s.id] || { score: 0, total: 0, level: s.level }
        a.total += 1
        quizAggRef.current[s.id] = a
      }
    }
    handledRef.current = -1
    setSteps(newSteps)
    setStepIndex(0)
    setLessonResults([])
    setScreen('activity')
  }

  function exitLesson() {
    setSteps([])
    setStepIndex(0)
    setLessonResults([])
    setScreen('dashboard')
  }

  // Record one activity's result (level adjusts in the background) → summary row.
  function recordOne(id, score, total, level, notes = '') {
    const { newLevel } = progress.computeLevelChange(id, score, total, level)
    progress.recordResult(id, score, total, newLevel, notes, level)
    track('activity_complete', { activity_id: id, score, total, level })
    return { id, score, total, level, mode: getMode(id) }
  }

  function advance() {
    const n = stepIndex + 1
    if (n < steps.length) setStepIndex(n)
    else finishLesson()
  }

  function onQuizStepDone(step, correct) {
    const a = quizAggRef.current[step.id]
    if (a && correct) a.score += 1
    advance()
  }

  function onActivityStepDone(step, score, total, notes = '') {
    if (handledRef.current === stepIndex) return  // ignore repeat auto-advance fires
    handledRef.current = stepIndex
    outcomesRef.current.push({ id: step.id, score, total, level: step.level, notes })
    advance()
  }

  // All steps done — record everything once and show the single result screen.
  function finishLesson() {
    const rows = []
    for (const o of outcomesRef.current) rows.push(recordOne(o.id, o.score, o.total, o.level, o.notes))
    for (const [id, a] of Object.entries(quizAggRef.current)) rows.push(recordOne(id, a.score, a.total, a.level))
    progress.completeLesson(rows.map(r => r.id), playedLessonIndex)
    const scored = rows.filter(r => r.mode === 'measured' && r.total > 0)
    const scorePct = scored.length
      ? Math.round(scored.reduce((s, r) => s + (r.score / r.total) * 100, 0) / scored.length)
      : null
    track('lesson_complete', { lesson_number: playedLessonIndex + 1, activities: rows.length, score_pct: scorePct })
    setLessonResults(rows)
    setScreen('lessonSummary')
  }

  if (!isAppRoute) {
    return (
      <Landing
        configured={auth.configured}
        signIn={auth.signIn}
        onGuest={() => navigate('/app')}
      />
    )
  }

  if (screen === 'log') {
    return <Progress onBack={() => setScreen('dashboard')} progress={progress} />
  }

  if (screen === 'gate') {
    return (
      <div className="page">
        <div className="complete-screen">
          <div style={{ fontSize: 60 }}>🔒</div>
          <h2>{t('gateTitle')}</h2>
          <p className="text-muted" style={{ maxWidth: 340 }}>{t('gateSub')}</p>
          {auth.user ? (
            <button className="btn btn-primary btn-lg" onClick={() => startLesson()}>{t('continueBtn')}</button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={auth.signIn}>{t('signInGoogle')}</button>
          )}
          <button className="btn btn-ghost" onClick={() => setScreen('dashboard')}>{t('backToActivities')}</button>
        </div>
      </div>
    )
  }

  if (screen === 'lessonSummary') {
    return (
      <LessonSummary
        results={lessonResults}
        lessonNumber={lessonNumber}
        onNext={startLesson}
        onRetry={() => startLesson(playedLessonIndex)}
        onDone={exitLesson}
      />
    )
  }

  if (screen === 'activity') {
    const step = steps[stepIndex]
    if (!step) { setScreen('dashboard'); return null }
    const pct = steps.length ? Math.round((stepIndex / steps.length) * 100) : 0
    const bar = (
      <div className="lesson-progress"><div style={{ width: `${pct}%` }} /></div>
    )
    if (step.kind === 'q') {
      return (
        <>
          {bar}
          <SingleQuiz
            question={step.question}
            isLast={stepIndex + 1 >= steps.length}
            onNext={(correct) => onQuizStepDone(step, correct)}
            onBack={exitLesson}
          />
        </>
      )
    }
    const ActivityComponent = ACTIVITY_COMPONENTS[step.id]
    if (!ActivityComponent) { setScreen('dashboard'); return null }
    return (
      <>
        {bar}
        <ActivityComponent
          activityId={step.id}
          level={step.level}
          exposure={step.exposure || 0}
          onDone={(score, total, notes) => onActivityStepDone(step, score, total, notes)}
          onBack={exitLesson}
        />
      </>
    )
  }

  return (
    <Dashboard
      onStartLesson={startLesson}
      onViewLog={() => setScreen('log')}
      progress={progress}
      user={auth.user}
      authConfigured={auth.configured}
      signIn={auth.signIn}
      signOut={handleSignOut}
    />
  )
}
