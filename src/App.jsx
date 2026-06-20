import { useState } from 'react'
import Dashboard from './components/Dashboard'
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
import { getMode } from './dailyPlan'
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
  const progress = useProgress()
  const { lang } = useLang()

  const currentItem = lesson ? lesson[lessonIndex] : null

  // Build and start the next lesson (adapts to past performance + previous lesson)
  function startLesson() {
    const next = progress.buildNextLesson()
    if (!next.length) { setScreen('dashboard'); return }
    setLessonNumber(progress.getLessonNumber())
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

    const nextIndex = lessonIndex + 1
    if (nextIndex < lesson.length) {
      setLessonIndex(nextIndex)
      setScreen('activity')
    } else {
      progress.completeLesson(lesson.map(q => q.id))
      setScreen('lessonSummary')
    }
  }

  if (!lang) {
    return <LanguageChooser />
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
    />
  )
}
