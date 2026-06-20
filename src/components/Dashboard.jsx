import { useLang } from '../i18n'
import { PREBUILT, PREBUILT_COUNT } from '../lessons'

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
            background: 'var(--bg-muted, #f1f3f5)', borderRadius: 999,
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
      background: 'var(--primary)', color: '#fff', borderRadius: 999,
      padding: '3px 10px', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap'
    }}>
      🎓 {level ? t('lvl.' + level) : t('adaptive')}
    </span>
  )
}

// One row in the 5-lesson curriculum ladder.
function LadderRow({ n, level, status, count, onStart, last }) {
  const { t } = useLang()
  const isCurrent = status === 'current'
  const icon = status === 'done' ? '✓' : status === 'current' ? '▶' : '🔒'
  const iconColor = status === 'done' ? 'var(--success)' : status === 'current' ? 'var(--primary)' : 'var(--border)'

  return (
    <div
      onClick={isCurrent ? onStart : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px',
        cursor: isCurrent ? 'pointer' : 'default',
        opacity: status === 'upcoming' ? 0.5 : 1,
        background: isCurrent ? 'var(--primary-soft, rgba(0,0,0,0.03))' : 'transparent',
        borderRadius: 12,
        border: isCurrent ? '2px solid var(--primary)' : '2px solid transparent',
        borderBottom: !isCurrent && !last ? '1px solid var(--border)' : undefined,
      }}
    >
      <span style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 800, color: iconColor,
        border: `2px solid ${iconColor}`,
      }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 700 }}>{t('lessonN', { n })}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('lessonItems', { n: count })}</div>
      </div>
      <DifficultyChip level={level} />
    </div>
  )
}

function Curriculum({ progress, onStartLesson }) {
  const { t } = useLang()
  const completed = progress.getLessonsCompleted()
  const info = progress.getNextLessonInfo()

  return (
    <>
      <div className="card mb-16" style={{ padding: '8px 8px 12px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, padding: '12px 12px 6px' }}>
          {t('curriculumTitle')}
        </div>
        {PREBUILT.map((plan, i) => {
          const status = i < completed ? 'done' : i === completed ? 'current' : 'upcoming'
          return (
            <LadderRow
              key={i}
              n={i + 1}
              level={plan.level}
              count={plan.ids.length}
              status={status}
              onStart={onStartLesson}
              last={i === PREBUILT.length - 1}
            />
          )
        })}
      </div>

      {/* Once the curriculum is done, every further lesson is adaptive. */}
      {completed >= PREBUILT_COUNT && (
        <div className="card mb-16" style={{ padding: '24px', border: '2px solid var(--primary)' }}>
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
          <div style={{ margin: '14px 0 16px' }}><PillarChips /></div>
          <button className="btn btn-primary btn-lg w-full" onClick={onStartLesson}>
            {t('startLesson')}
          </button>
        </div>
      )}

      {completed < PREBUILT_COUNT && (
        <button className="btn btn-primary btn-lg w-full" onClick={onStartLesson}>
          {t('startLessonN', { n: completed + 1 })}
        </button>
      )}

      {completed > 0 && (
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>
          {t('lessonsCompleted', { n: completed })}
        </div>
      )}
    </>
  )
}

export default function Dashboard({ onStartLesson, onViewLog, progress }) {
  const { t, lang, setLang } = useLang()

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-16">
        <div>
          <h1>Tarasha</h1>
          <p className="text-muted">{t('lessonTagline')}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Language toggle */}
          <button
            className="btn btn-ghost"
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            style={{ minWidth: 'unset', padding: '12px 16px', minHeight: 'unset' }}
            title="Switch language"
          >
            {lang === 'hi' ? 'EN' : 'हिं'}
          </button>
          <button className="btn btn-ghost" onClick={onViewLog} style={{ minWidth: 'unset', padding: '12px 20px', minHeight: 'unset' }}>
            📊 {t('progress')}
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => { if (window.confirm(t('resetConfirm'))) progress.resetAll() }}
            style={{ minWidth: 'unset', padding: '12px 16px', minHeight: 'unset' }}
            title={t('reset')}
          >
            🔄
          </button>
        </div>
      </div>

      <Curriculum progress={progress} onStartLesson={onStartLesson} />

      <div style={{ height: 24 }} />
    </div>
  )
}
