// Hand-drawn line-icon set — consistent stroke, rounded caps, colour via
// currentColor so icons inherit clay/ink tokens. Replaces system emoji in UI.
const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

const PATHS = {
  back: <path d="M14 6l-6 6 6 6" {...STROKE} />,
  play: <path d="M8 5v14l11-7z" fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />,
  lock: (
    <g {...STROKE}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </g>
  ),
  check: <path d="M5 13l4 4 10-11" {...STROKE} />,
  x: <path d="M7 7l10 10M17 7L7 17" {...STROKE} />,
  speaker: (
    <g {...STROKE}>
      <path d="M4 9.5v5h3.5L13 19V5L7.5 9.5z" />
      <path d="M16 9a4.5 4.5 0 0 1 0 6" />
      <path d="M18.5 6.5a8 8 0 0 1 0 11" />
    </g>
  ),
  mic: (
    <g {...STROKE}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <path d="M12 17v4M9 21h6" />
    </g>
  ),
  replay: (
    <g {...STROKE}>
      <path d="M19 12a7 7 0 1 1-2-4.9" />
      <path d="M19 4v4h-4" />
    </g>
  ),
  hint: (
    <g {...STROKE}>
      <path d="M12 3a6 6 0 0 0-3.8 10.6c.7.6 1.1 1.3 1.3 2.1h5c.2-.8.6-1.5 1.3-2.1A6 6 0 0 0 12 3z" />
      <path d="M9.5 18h5M10.5 21h3" />
    </g>
  ),
  clap: (
    <g {...STROKE}>
      <path d="M9.5 21c-2.8 0-4.7-2-4.4-4.8l.6-4.6a1 1 0 0 1 2 .2l.4 3" />
      <path d="M14.5 21c2.8 0 4.7-2 4.4-4.8l-.6-4.6a1 1 0 0 0-2 .2l-.4 3" />
      <path d="M12 3v3M8 4.2l1.2 2.2M16 4.2l-1.2 2.2" />
    </g>
  ),
  brain: (
    <g {...STROKE}>
      <path d="M12 5.5a3 3 0 0 0-5.6.8 2.8 2.8 0 0 0-.9 5 3 3 0 0 0 1.7 4.6A2.8 2.8 0 0 0 12 18z" />
      <path d="M12 5.5a3 3 0 0 1 5.6.8 2.8 2.8 0 0 1 .9 5 3 3 0 0 1-1.7 4.6A2.8 2.8 0 0 1 12 18z" />
    </g>
  ),
  puzzle: <path d="M6 6h3.2a1.6 1.6 0 1 1 3.1 0H16v3.2a1.6 1.6 0 1 0 0 3.1V16h-3.2a1.6 1.6 0 1 1-3.1 0H6v-3.2a1.6 1.6 0 1 0 0-3.1z" {...STROKE} />,
  target: (
    <g {...STROKE}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </g>
  ),
  chat: <path d="M5 6.5h14v9H9.5L5 20z" {...STROKE} />,
  cap: (
    <g {...STROKE}>
      <path d="M3 9l9-4 9 4-9 4z" />
      <path d="M7 11v3.5c0 1.2 2.6 2.5 5 2.5s5-1.3 5-2.5V11" />
    </g>
  ),
  celebrate: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" {...STROKE} />,
}

export default function Icon({ name, size = 24, color, style, title }) {
  const node = PATHS[name]
  if (!node) return null
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      role={title ? 'img' : 'presentation'} aria-label={title} aria-hidden={title ? undefined : true}
      style={{ color, display: 'block', flexShrink: 0, ...style }}
    >
      {node}
    </svg>
  )
}
