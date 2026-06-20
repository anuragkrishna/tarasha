import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Progress from './components/Progress'
import ResultScreen from './components/ResultScreen'
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
import SessionSummary from './components/SessionSummary'
import { useProgress } from './hooks/useProgress'
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
  const [currentActivityId, setCurrentActivityId] = useState(null)
  const [pendingResult, setPendingResult] = useState(null) // { score, total, currentLevel, newLevel, notes }
  const [sessionQueue, setSessionQueue] = useState(null)    // ids for today's guided session
  const [sessionIndex, setSessionIndex] = useState(0)
  const progress = useProgress()
  const { lang } = useLang()
  const inSession = sessionQueue !== null

  // Single activity from the catalog (not a guided session)
  function startActivity(id) {
    setSessionQueue(null)
    setCurrentActivityId(id)
    setScreen('activity')
  }

  // Guided session: run today's plan, skipping anything already done today
  function startSession() {
    const plan = progress.getTodayPlan()
    const queue = plan.filter(id => !progress.isDoneToday(id))
    setSessionQueue(queue)
    setSessionIndex(0)
    if (queue.length === 0) {
      setScreen('sessionSummary')
    } else {
      setCurrentActivityId(queue[0])
      setScreen('activity')
    }
  }

  function exitSession() {
    setSessionQueue(null)
    setSessionIndex(0)
    setCurrentActivityId(null)
    setPendingResult(null)
    setScreen('dashboard')
  }

  // Called when an activity finishes — show result screen before saving
  function onActivityDone(score, total, notes = '') {
    const { currentLevel, newLevel } = progress.computeLevelChange(currentActivityId, score, total)
    setPendingResult({ score, total, currentLevel, newLevel, notes })
    setScreen('result')
  }

  // Called from ResultScreen with the caregiver's chosen final level
  function onResultConfirmed(finalLevel, notes) {
    progress.recordResult(currentActivityId, pendingResult.score, pendingResult.total, finalLevel, notes)
    setPendingResult(null)
    if (inSession) {
      const nextIndex = sessionIndex + 1
      if (nextIndex < sessionQueue.length) {
        setSessionIndex(nextIndex)
        setCurrentActivityId(sessionQueue[nextIndex])
        setScreen('activity')
      } else {
        setCurrentActivityId(null)
        setScreen('sessionSummary')
      }
    } else {
      setCurrentActivityId(null)
      setScreen('dashboard')
    }
  }

  if (!lang) {
    return <LanguageChooser />
  }

  if (screen === 'log') {
    return <Progress onBack={() => setScreen('dashboard')} progress={progress} />
  }

  if (screen === 'sessionSummary') {
    return (
      <SessionSummary
        queue={sessionQueue || []}
        progress={progress}
        onDone={exitSession}
      />
    )
  }

  if (screen === 'result' && pendingResult) {
    return (
      <ResultScreen
        activityId={currentActivityId}
        result={pendingResult}
        onConfirm={onResultConfirmed}
        sessionStep={inSession ? { index: sessionIndex, total: sessionQueue.length } : null}
      />
    )
  }

  if (screen === 'activity' && currentActivityId) {
    const ActivityComponent = ACTIVITY_COMPONENTS[currentActivityId]
    if (!ActivityComponent) { setScreen('dashboard'); return null }
    const level = progress.getLevel(currentActivityId)
    return (
      <ActivityComponent
        activityId={currentActivityId}
        level={level}
        onDone={onActivityDone}
        onBack={inSession ? exitSession : () => { setScreen('dashboard'); setCurrentActivityId(null) }}
      />
    )
  }

  return (
    <Dashboard
      onStartActivity={startActivity}
      onStartSession={startSession}
      onViewLog={() => setScreen('log')}
      progress={progress}
    />
  )
}
