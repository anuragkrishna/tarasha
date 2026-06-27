import { useState } from 'react'
import { useLang } from '../../i18n'

// Option card colours: selected (pre-check) highlights blue; after Check the
// correct answer turns green and a wrong pick turns red.
function optionStyle(opt, selected, checked, answer) {
  const isSelected = selected === opt.label
  const isAnswer = opt.label === answer
  if (checked && isAnswer) return { bg: 'var(--ok-bg)', border: 'var(--success)' }
  if (checked && isSelected && !isAnswer) return { bg: 'var(--err-bg)', border: 'var(--error)' }
  if (!checked && isSelected) return { bg: 'var(--pick-bg)', border: 'var(--primary)' }
  return { bg: 'var(--surface)', border: 'var(--border)' }
}

// One quiz question. Tap to select, Check to grade (feedback on the same screen),
// then the button advances via onNext(isCorrect). isLast tweaks the label only.
export default function SingleQuiz({ question, isLast, onNext, onBack }) {
  const { t } = useLang()
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)

  const isCorrect = selected === question.answer

  function check() {
    if (selected == null || checked) return
    setChecked(true)
  }

  return (
    <div className="page">
      <div className="activity-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="activity-title">{question.icon} {question.title}</div>
        <span className="level-badge" />
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
                onClick={() => !checked && setSelected(opt.label)}
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
                onClick={() => !checked && setSelected(opt.label)}
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

      {/* Reserved space so the button stays put whether or not feedback shows. */}
      <div style={{ minHeight: 72, marginTop: 16, display: 'flex', alignItems: 'center' }}>
        {checked && (
          <div style={{
            width: '100%', padding: 14, borderRadius: 12,
            background: isCorrect ? 'var(--ok-bg)' : 'var(--err-bg)',
            color: isCorrect ? 'var(--success)' : 'var(--error)',
            fontWeight: 600, fontSize: 19, textAlign: 'center',
          }}>
            {isCorrect ? `✓ ${t('correct')}` : `✗ ${t('answerWas', { a: question.answer })}`}
            {!isCorrect && question.hint && (
              <div style={{ fontSize: 16, opacity: 0.9, marginTop: 4 }}>{question.hint}</div>
            )}
          </div>
        )}
      </div>

      {checked ? (
        <button className="btn btn-primary btn-lg w-full" onClick={() => onNext(isCorrect)}>
          {isLast ? t('finish') : t('nextQuestion')}
        </button>
      ) : (
        <button
          className="btn btn-primary btn-lg w-full"
          style={{ opacity: selected == null ? 0.5 : 1 }}
          disabled={selected == null}
          onClick={check}
        >
          {t('check')}
        </button>
      )}
    </div>
  )
}
