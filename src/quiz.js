import { getOrderedLevels, getActivity } from './data/activities'

export const MAX_Q_PER_TYPE = 2 // each quiz type contributes at most this many questions per lesson

export function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Round-robin a set of lists: A0, B0, A1, B1, … so adjacent items differ in list.
export function interleave(lists) {
  const out = []
  const max = lists.reduce((m, l) => Math.max(m, l.length), 0)
  for (let i = 0; i < max; i++) {
    for (const l of lists) if (i < l.length) out.push(l[i])
  }
  return out
}

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

// Normalize one quiz activity into a list of common-shaped question objects,
// walked along its difficulty ladder by exposure and capped per type.
export function quizQuestions(item, lang, t) {
  const activity = getActivity(item.id, lang)
  const title = pickTitle(activity, lang)
  const icon = activity?.icon || '•'
  const levels = getOrderedLevels(item.id, lang)
  const exposure = item.exposure || 0

  if (item.id === 'categorisation') {
    const bank = levels.flatMap(l =>
      (l.rounds || []).flatMap(r => r.items.map(it => ({ it, cats: r.categories })))
    )
    return ladderWindow(bank, exposure, MAX_Q_PER_TYPE).map(({ it, cats }) => ({
      src: item.id, title, icon,
      subject: { emoji: it.emoji, label: it.label },
      prompt: t('whichGroup'),
      layout: 'grid',
      options: shuffle(cats.map(c => ({ label: c.label, emoji: c.emoji }))),
      answer: it.category,
    }))
  }

  const bank = levels.flatMap(l => l.questions || [])
  return ladderWindow(bank, exposure, MAX_Q_PER_TYPE).map(q => {
    if (item.id === 'odd-one-out') {
      return {
        src: item.id, title, icon,
        prompt: t('whichOdd'),
        layout: 'grid',
        options: shuffle(q.items.map(o => ({ label: o.label, emoji: o.emoji }))),
        answer: q.answer,
        hint: q.hint,
      }
    }
    return {
      src: item.id, title, icon,
      prompt: q.question,
      layout: 'list',
      options: shuffle((q.options || []).map(o => ({ label: o }))),
      answer: q.answer,
      hint: q.hint,
    }
  })
}

function pickTitle(obj, lang) {
  if (!obj) return ''
  return lang === 'hi' ? (obj.title_hi || obj.title) : obj.title
}
