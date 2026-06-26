import { useState } from 'react'
import { getOrderedLevels, getActivity } from '../../data/activities'
import { useLang, pickField } from '../../i18n'

const MAX_Q_PER_TYPE = 2 // each activity type contributes at most this many questions per lesson

// Take `n` items from the bank starting at the exposure offset, wrapping at the
// end — so each repeat of an activity serves the next, tougher questions.
function ladderWindow(bank, exposure, n) {
  if (!bank.length) return []
  const span = Math.min(n, bank.length)
  const start = ((exposure * n) % bank.length + bank.length) % bank.length
  const out = []
  for (let i = 0; i < span; i++) out.push(bank[(start + i) % bank.length])
  return out
}

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Round-robin the per-source question lists so consecutive questions come from
// different activities: A, B, A, B, ... (tail repeats only if one list is longer).
function interleave(lists) {
  const out = []
  const max = lists.reduce((m, l) => Math.max(m, l.length), 0)
  for (let i = 0; i < max; i++) {
    for (const l of lists) if (i < l.length) out.push(l[i])
  }
  return out
}

// Collapse each quiz activity's questions into one common shape so a single
// renderer can show them, whatever the source activity.
function normalizeSource(src, lang, t) {
  const activity = getActivity(src.id, lang)
  const title = pickField(activity, 'title', lang)
  const icon = activity?.icon || '•'
  const levels = getOrderedLevels(src.id, lang)
  const exposure = src.exposure || 0

  // Categorisation is shaped as rounds of items. Flatten to one item bank
  // (easy→hard across all levels), then walk it by exposure.
  if (src.id === 'categorisation') {
    const bank = levels.flatMap(l =>
      (l.rounds || []).flatMap(r => r.items.map(item => ({ item, cats: r.categories })))
    )
    return ladderWindow(bank, exposure, MAX_Q_PER_TYPE).map(({ item, cats }) => ({
      src: src.id, title, icon,
      subject: { emoji: item.emoji, label: item.label },
      prompt: t('whichGroup'),
      layout: 'grid',
      options: shuffle(cats.map(c => ({ label: c.label, emoji: c.emoji }))),
      answer: item.category,
    }))
  }

  // odd-one-out / weights / money — one question bank across all levels.
  const bank = levels.flatMap(l => l.questions || [])
  return ladderWindow(bank, exposure, MAX_Q_PER_TYPE).map(q => {
    if (src.id === 'odd-one-out') {
      return {
        src: src.id, title, icon,
        prompt: t('whichOdd'),
        layout: 'grid',
        options: shuffle(q.items.map(it => ({ label: it.label, emoji: it.emoji }))),
        answer: q.answer,
        hint: q.hint,
      }
    }
    // weights / money — plain text options
    return {
      src: src.id, title, icon,
      prompt: q.question,
      layout: 'list',
      options: shuffle((q.options || []).map(o => ({ label: o }))),
      answer: q.answer,
      hint: q.hint,
    }
  })
}

export default function MixedQuiz({ sources, onDone, onBack }) {
  const { t, lang } = useLang()

  // Build the interleaved deck once (shuffled questions + options), and the
  // per-source totals we need to report each activity's score back.
  const [{ questions, totals }] = useState(() => {
    // Each source yields up to MAX_Q_PER_TYPE questions (walked along its
    // difficulty ladder by exposure). Shuffle the type order, then round-robin
    // them so no two questions of the same type land next to each other.
    const lists = shuffle(sources.map(s => normalizeSource(s, lang, t)))
    const deck = interleave(lists)
    const totals = {}
    for (const q of deck) totals[q.src] = (totals[q.src] || 0) + 1
    return { questions: deck, totals }
  })

  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)
  const [tally, setTally] = useState({}) // srcId -> correct count
  const [done, setDone] = useState(false)

  const question = questions[qIndex]

  if (done) {
    const perSource = sources.map(s => ({
      id: s.id,
      level: s.level,
      score: tally[s.id] || 0,
      total: totals[s.id] || 0,
    }))
    const score = perSource.reduce((a, r) => a + r.score, 0)
    const total = perSource.reduce((a, r) => a + r.total, 0)
    return (
      <div className="page">
        <div className="complete-screen">
          <div style={{ fontSize: 60 }}>🎉</div>
          <h2>{t('wellDone')}</h2>
          <div className="score-circle">{score}<span>/{total}</span></div>
          <p className="text-muted">{t('youGot', { score, total })}</p>
          <button className="btn btn-primary btn-lg" onClick={() => onDone(perSource)}>
            {t('backToActivities')}
          </button>
        </div>
      </div>
    )
  }

  if (!question) return null

  // First tap just picks an option; the Check button grades it.
  function handleSelect(opt) {
    if (checked) return
    setSelected(opt.label)
  }

  function check() {
    if (selected == null || checked) return
    if (selected === question.answer) {
      setTally(s => ({ ...s, [question.src]: (s[question.src] || 0) + 1 }))
    }
    setChecked(true)
  }

  function next() {
    setChecked(false)
    setSelected(null)
    if (qIndex + 1 >= questions.length) setDone(true)
    else setQIndex(i => i + 1)
  }

  const isCorrect = selected === question.answer
  const isLast = qIndex + 1 >= questions.length

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{sources.length > 1 ? t('mixedTitle') : (question.title || t('mixedTitle'))}</div>
        <span className="level-badge">{qIndex + 1}/{questions.length}</span>
      </div>

      <div className="progress-dots">
        {questions.map((_, i) => (
          <div key={i} className={`progress-dot ${i < qIndex ? 'done' : i === qIndex ? 'current' : ''}`} />
        ))}
      </div>

      {/* Which activity this question is from — makes the mix visible */}
      <div className="flex" style={{ justifyContent: 'center', marginBottom: 10 }}>
        <span style={{
          padding: '6px 14px', borderRadius: 16, fontSize: 15, fontWeight: 700,
          background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)'
        }}>{question.icon} {question.title}</span>
      </div>

      <div className="card text-center mb-16">
        {question.subject && (
          <>
            <div style={{ fontSize: 80, lineHeight: 1, marginBottom: 8 }}>{question.subject.emoji}</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>{question.subject.label}</div>
          </>
        )}
        <p style={{ fontSize: 22, fontWeight: 600 }}>{question.prompt}</p>
      </div>

      {question.layout === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {question.options.map((opt, i) => {
            const s = optionStyle(opt, selected, checked, question.answer)
            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                style={{
                  background: s.bg, border: `3px solid ${s.border}`,
                  borderRadius: 20, padding: '24px 16px',
                  cursor: checked ? 'default' : 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                  boxShadow: checked ? 'none' : 'var(--shadow)',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                <span style={{ fontSize: 72, lineHeight: 1 }}>{opt.emoji}</span>
                <span style={{ fontSize: 22, fontWeight: 600, fontFamily: 'inherit' }}>{opt.label}</span>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {question.options.map((opt, i) => {
            const s = optionStyle(opt, selected, checked, question.answer)
            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                style={{
                  background: s.bg, border: `3px solid ${s.border}`,
                  borderRadius: 16, padding: '20px 18px',
                  cursor: checked ? 'default' : 'pointer',
                  fontSize: 22, fontWeight: 600, fontFamily: 'inherit', textAlign: 'center',
                  boxShadow: checked ? 'none' : 'var(--shadow)',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Feedback appears on the same screen, right above the button. */}
      {checked && (
        <div style={{
          marginTop: 16, padding: 14, borderRadius: 12,
          background: isCorrect ? '#EAFAF1' : '#FDEDEC',
          color: isCorrect ? 'var(--success)' : 'var(--error)',
          fontWeight: 600, fontSize: 19, textAlign: 'center',
        }}>
          {isCorrect ? `✓ ${t('correct')}` : `✗ ${t('answerWas', { a: question.answer })}`}
          {!isCorrect && question.hint && (
            <div style={{ fontSize: 16, opacity: 0.9, marginTop: 4 }}>{question.hint}</div>
          )}
        </div>
      )}

      {/* One button: "Check" until graded, then "Next question". */}
      {checked ? (
        <button className="btn btn-primary btn-lg w-full" style={{ marginTop: 16 }} onClick={next}>
          {isLast ? t('finish') : t('nextQuestion')}
        </button>
      ) : (
        <button
          className="btn btn-primary btn-lg w-full"
          style={{ marginTop: 16, opacity: selected == null ? 0.5 : 1 }}
          disabled={selected == null}
          onClick={check}
        >
          {t('check')}
        </button>
      )}
    </div>
  )
}

// Option card colours: selected (pre-check) highlights blue; after Check the
// correct answer turns green and a wrong pick turns red.
function optionStyle(opt, selected, checked, answer) {
  const isSelected = selected === opt.label
  const isAnswer = opt.label === answer
  if (checked && isAnswer) return { bg: '#EAFAF1', border: 'var(--success)' }
  if (checked && isSelected && !isAnswer) return { bg: '#FDEDEC', border: 'var(--error)' }
  if (!checked && isSelected) return { bg: '#EAF1FB', border: 'var(--primary)' }
  return { bg: 'white', border: 'var(--border)' }
}
