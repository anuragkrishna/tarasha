import { useState, useEffect, useCallback } from 'react'
import Dashboard from './components/Dashboard'
import Landing from './components/Landing'
import Progress from './components/Progress'
import OddOneOut from './components/activities/OddOneOut'
import CopyText from './components/activities/CopyText'
import MemoryNumbers from './components/activities/MemoryNumbers'
import ReverseCounting from './components/activities/ReverseCounting'
import WeightsConcept from './components/activities/WeightsConcept'
import MoneyTransaction from './components/activities/MoneyTransaction'
import ItemsRecall from './components/activities/ItemsRecall'
import SentenceRepeat from './components/activities/SentenceRepeat'
import CauseEffect from './components/activities/CauseEffect'
import DailyEventsRecall from './components/activities/DailyEventsRecall'
import PictureStory from './components/activities/PictureStory'
import StoryNarration from './components/activities/StoryNarration'
import DrawingLines from './components/activities/DrawingLines'
import CookingPlan from './components/activities/CookingPlan'
import Categorisation from './components/activities/Categorisation'
import DelayedRecall from './components/activities/DelayedRecall'
import DescribePicture from './components/activities/DescribePicture'
import BreathCount from './components/activities/BreathCount'
import LanguageChooser from './components/LanguageChooser'
import LessonSummary from './components/LessonSummary'
import { useProgress } from './hooks/useProgress'
import { useAuth } from './hooks/useAuth'
import { getMode } from './dailyPlan'
import { lessonInfo } from './lessons'
import { track } from './firebase'
import { useLang } from './i18n'

const ACTIVITY_COMPONENTS = {
  'odd-one-out': OddOneOut,
  'copy-text': CopyText,
  'memory-numbers': MemoryNumbers,
  'reverse-counting': ReverseCounting,
  'weights-concept': WeightsConcept,
  'money-transaction': MoneyTransaction,
  'items-recall': ItemsRecall,
  'sentence-repeat': SentenceRepeat,
  'cause-effect': CauseEffect,
  'daily-events-recall': DailyEventsRecall,
  'picture-story': PictureStory,
  'story-narration': StoryNarration,
  'drawing-lines': DrawingLines,
  'cooking-plan': CookingPlan,
  'categorisation': Categorisation,
  'delayed-recall': DelayedRecall,
  'describe-picture': DescribePicture,
  'breath-count': BreathCount,
}

export default function App() {
  const [screen, setScreen] = useState('dashboard')
  const [lesson, setLesson] = useState(null)        // [{ id, level }] for the current lesson
  const [lessonIndex, setLessonIndex] = useState(0)
  const [lessonResults, setLessonResults] = useState([]) // [{ id, score, total, level, mode }]
  const [lessonNumber, setLessonNumber] = useState(1)
  const [playedLessonIndex, setPlayedLessonIndex] = useState(0)
  const auth = useAuth()
  const progress = useProgress(auth.user)
  const { lang } = useLang()

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

  // Analytics: app opened (once per load).
  useEffect(() => { track('app_open') }, [])

  // A signed-in user landing on "/" goes straight into the app.
  useEffect(() => {
    if (!isAppRoute && auth.ready && auth.user) navigate('/app')
  }, [isAppRoute, auth.ready, auth.user, navigate])

  // Sign out returns to the landing page.
  const handleSignOut = useCallback(async () => {
    await auth.signOut()
    navigate('/')
  }, [auth, navigate])

  const currentItem = lesson ? lesson[lessonIndex] : null

  // Start a lesson by index (a tile tap), or the next one by default (e.g. "Next
  // lesson" from the summary, where the click event is ignored as the arg).
  function startLesson(lessonIdx) {
    const idx = typeof lessonIdx === 'number' ? lessonIdx : progress.getLessonsCompleted()
    const next = progress.buildNextLesson(idx)
    if (!next.length) { setScreen('dashboard'); return }
    const info = lessonInfo(idx)
    track('lesson_start', { lesson_number: idx + 1, level: info.level || 0, prebuilt: info.prebuilt })
    setPlayedLessonIndex(idx)
    setLessonNumber(idx + 1)
    setLesson(next)
    setLessonIndex(0)
    setLessonResults([])
    setScreen('activity')
  }

  function exitLesson() {
    setLesson(null)
    setLessonIndex(0)
    setLessonResults([])
    setScreen('dashboard')
  }

  // Activity finished — record the result silently and advance straight to the
  // next activity (no intermediate recap screen). Level adjusts in the background.
  function onActivityDone(score, total, notes = '') {
    const item = lesson[lessonIndex]
    const { newLevel } = progress.computeLevelChange(item.id, score, total, item.level)
    progress.recordResult(item.id, score, total, newLevel, notes, item.level)
    const results = [...lessonResults, { id: item.id, score, total, level: item.level, mode: getMode(item.id) }]
    setLessonResults(results)
    track('activity_complete', { activity_id: item.id, score, total, level: item.level })

    const nextIndex = lessonIndex + 1
    if (nextIndex < lesson.length) {
      setLessonIndex(nextIndex)
      setScreen('activity')
    } else {
      progress.completeLesson(lesson.map(q => q.id), playedLessonIndex)
      const scored = results.filter(r => r.mode === 'measured' && r.total > 0)
      const scorePct = scored.length
        ? Math.round(scored.reduce((s, r) => s + (r.score / r.total) * 100, 0) / scored.length)
        : null
      track('lesson_complete', { lesson_number: playedLessonIndex + 1, activities: results.length, score_pct: scorePct })
      setScreen('lessonSummary')
    }
  }

  if (!lang) {
    return <LanguageChooser />
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

  if (screen === 'lessonSummary') {
    return (
      <LessonSummary
        results={lessonResults}
        lessonNumber={lessonNumber}
        onNext={startLesson}
        onDone={exitLesson}
      />
    )
  }

  if (screen === 'activity' && currentItem) {
    const ActivityComponent = ACTIVITY_COMPONENTS[currentItem.id]
    if (!ActivityComponent) { setScreen('dashboard'); return null }
    return (
      <ActivityComponent
        activityId={currentItem.id}
        level={currentItem.level}
        onDone={onActivityDone}
        onBack={exitLesson}
      />
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
