import { useState } from 'react'
import { useLang } from '../i18n'
import { PREBUILT, PREBUILT_COUNT } from '../lessons'
import ProfileMenu from './ProfileMenu'
import Icon from './Icon'

// Skill pillars (= activity categories) a lesson mixes across.
const PILLARS = [
  { key: 'Learning', icon: 'brain' },
  { key: 'Short Term Memory', icon: 'puzzle' },
  { key: 'Topic Maintenance', icon: 'target' },
  { key: 'Narration', icon: 'chat' },
]

function PillarChips() {
  const { t } = useLang()
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {PILLARS.map(p => (
        <span
          key={p.key}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--accent-soft)', borderRadius: 999,
            padding: '6px 12px', fontSize: 13, fontWeight: 600, color: 'var(--text)'
          }}
        >
          <Icon name={p.icon} size={16} color="var(--primary-strong)" />{t('cat.' + p.key)}
        </span>
      ))}
    </div>
  )
}

function DifficultyChip({ level }) {
  const { t } = useLang()
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: 'var(--primary)', color: 'var(--on-primary)', borderRadius: 999,
      padding: '4px 10px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap'
    }}>
      <Icon name="cap" size={14} /> {level ? t('lvl.' + level) : t('adaptive')}
    </span>
  )
}

// One tile in the 2-column curriculum grid.
function LessonTile({ n, level, status, count, onStart }) {
  const { t } = useLang()
  const isCurrent = status === 'current'
  const locked = status === 'upcoming'
  const iconName = status === 'done' ? 'check' : status === 'current' ? 'play' : 'lock'
  const iconColor = status === 'done' ? 'var(--success)' : status === 'current' ? 'var(--primary)' : 'var(--muted)'

  return (
    <div
      onClick={locked ? undefined : onStart}
      style={{
        display: 'flex', flexDirection: 'column', gap: 10,
        padding: 16,
        cursor: locked ? 'default' : 'pointer',
        opacity: locked ? 0.7 : 1,
        background: isCurrent ? 'rgba(197,97,60,0.08)' : 'var(--surface)',
        borderRadius: 14,
        border: isCurrent ? '2px solid var(--primary)' : '2px solid var(--border)',
        boxShadow: isCurrent ? 'none' : 'var(--shadow)',
      }}
    >
      <div className="flex items-center justify-between">
        <span style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: iconColor, border: `2px solid ${iconColor}`,
          background: isCurrent ? 'var(--primary)' : 'transparent',
        }}>
          <Icon name={iconName} size={17} color={isCurrent ? 'var(--on-primary)' : iconColor} />
        </span>
        <DifficultyChip level={level} />
      </div>
      <div>
        <div style={{ fontSize: 17, fontWeight: 700 }}>{t('lessonN', { n })}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('lessonItems', { n: count })}</div>
        {locked && <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginTop: 2 }}>{t('locked')}</div>}
        {isCurrent && <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-strong)', marginTop: 2 }}>{t('startLabel')}</div>}
      </div>
    </div>
  )
}

function Curriculum({ progress, onStartLesson }) {
  const { t } = useLang()
  const [showAll, setShowAll] = useState(false)
  const completed = progress.getLessonsCompleted()
  const info = progress.getNextLessonInfo()

  // Only reveal the next lesson or two — don't show a wall of padlocks.
  const visibleCount = showAll ? PREBUILT.length : Math.min(PREBUILT.length, completed + 2)
  const shown = PREBUILT.slice(0, visibleCount)
  const hiddenCount = PREBUILT.length - visibleCount

  return (
    <>
      <div className="mb-16">
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
          {t('curriculumTitle')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {shown.map((plan, i) => {
            const status = i < completed ? 'done' : i === completed ? 'current' : 'upcoming'
            return (
              <LessonTile
                key={i}
                n={i + 1}
                level={plan.level}
                count={plan.ids.length}
                status={status}
                onStart={() => onStartLesson(i)}
              />
            )
          })}
        </div>
        {(hiddenCount > 0 || showAll) && (
          <button
            className="btn btn-ghost w-full"
            style={{ marginTop: 12 }}
            onClick={() => setShowAll(s => !s)}
          >
            {showAll ? t('showFewerLessons') : t('showAllLessons', { n: hiddenCount })}
          </button>
        )}
      </div>

      {/* Once the curriculum is done, every further lesson is adaptive — tap to start. */}
      {completed >= PREBUILT_COUNT && (
        <div
          className="card mb-16"
          onClick={() => onStartLesson(completed)}
          style={{ padding: '24px', border: '2px solid var(--primary)', cursor: 'pointer' }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{t('lessonN', { n: completed + 1 })}</div>
              <div style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 2 }}>{t('lessonSubtitle')}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <Icon name="brain" size={28} color="var(--primary-strong)" />
              <DifficultyChip level={info.level} />
            </div>
          </div>
          <div style={{ marginTop: 14 }}><PillarChips /></div>
        </div>
      )}

      {completed > 0 && (
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>
          {t('lessonsCompleted', { n: completed })}
        </div>
      )}
    </>
  )
}

export default function Dashboard({ onStartLesson, onViewLog, progress, user, authConfigured, signIn, signOut }) {
  const { t } = useLang()

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-16">
        <div>
          <h1>Tarasha</h1>
          <p className="text-muted">{t('lessonTagline')}</p>
        </div>
        <ProfileMenu
          user={user}
          configured={authConfigured}
          signIn={signIn}
          signOut={signOut}
          onViewLog={onViewLog}
        />
      </div>

      <Curriculum progress={progress} onStartLesson={onStartLesson} />

      <div style={{ height: 24 }} />
    </div>
  )
}
