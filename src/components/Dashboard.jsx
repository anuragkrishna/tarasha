import { useLang } from '../i18n'
import { PREBUILT, PREBUILT_COUNT } from '../lessons'
import ProfileMenu from './ProfileMenu'

// Skill pillars (= activity categories) a lesson mixes across.
const PILLARS = [
  { key: 'Learning', icon: '🧠' },
  { key: 'Short Term Memory', icon: '🧩' },
  { key: 'Topic Maintenance', icon: '🎯' },
  { key: 'Narration', icon: '💬' },
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
            padding: '6px 12px', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)'
          }}
        >
          <span>{p.icon}</span>{t('cat.' + p.key)}
        </span>
      ))}
    </div>
  )
}

function DifficultyChip({ level }) {
  const { t } = useLang()
  return (
    <span style={{
      background: 'var(--primary)', color: 'var(--on-primary)', borderRadius: 999,
      padding: '3px 10px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap'
    }}>
      🎓 {level ? t('lvl.' + level) : t('adaptive')}
    </span>
  )
}

// One tile in the 2-column curriculum grid.
function LessonTile({ n, level, status, count, onStart }) {
  const { t } = useLang()
  const isCurrent = status === 'current'
  const locked = status === 'upcoming'
  const icon = status === 'done' ? '✓' : status === 'current' ? '▶' : '🔒'
  const iconColor = status === 'done' ? 'var(--success)' : status === 'current' ? 'var(--primary)' : 'var(--border)'

  return (
    <div
      onClick={locked ? undefined : onStart}
      style={{
        display: 'flex', flexDirection: 'column', gap: 10,
        padding: 16,
        cursor: locked ? 'default' : 'pointer',
        opacity: locked ? 0.55 : 1,
        background: isCurrent ? 'rgba(197,97,60,0.08)' : 'var(--surface)',
        borderRadius: 14,
        border: isCurrent ? '2px solid var(--primary)' : '2px solid var(--border)',
        boxShadow: isCurrent ? 'none' : 'var(--shadow)',
      }}
    >
      <div className="flex items-center justify-between">
        <span style={{
          width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 800, color: iconColor,
          border: `2px solid ${iconColor}`,
        }}>{icon}</span>
        <DifficultyChip level={level} />
      </div>
      <div>
        <div style={{ fontSize: 17, fontWeight: 700 }}>{t('lessonN', { n })}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('lessonItems', { n: count })}</div>
      </div>
    </div>
  )
}

function Curriculum({ progress, onStartLesson }) {
  const { t } = useLang()
  const completed = progress.getLessonsCompleted()
  const info = progress.getNextLessonInfo()

  return (
    <>
      <div className="mb-16">
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
          {t('curriculumTitle')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {PREBUILT.map((plan, i) => {
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
              <div style={{ fontSize: 28 }}>📚</div>
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
