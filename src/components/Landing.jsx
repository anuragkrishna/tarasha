import { useLang } from '../i18n'
import { track } from '../firebase'
import './Landing.css'

function GoogleG() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 20, height: 20, flexShrink: 0,
    }}>
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
    </span>
  )
}

export default function Landing({ configured, signIn, onGuest }) {
  const { t, lang, setLang } = useLang()

  const pillars = [
    t('landingPillarMemory'),
    t('landingPillarLearning'),
    t('landingPillarInhibition'),
    t('landingPillarFocus'),
  ]

  return (
    <div className="landing-page">
      {/* Language toggle — top right */}
      <div className="lp-langs">
        {[['en', 'English'], ['hi', 'हिंदी']].map(([code, label]) => (
          <button
            key={code}
            className={`lp-lang ${lang === code ? 'is-active' : ''}`}
            onClick={() => setLang(code)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="lp-stage">
        {/* Left — brain art + pillars */}
        <div className="lp-left">
          <div className="lp-art">
            <img className="lp-brain" src="/brain-hero.png" alt="" />
          </div>
          <div className="lp-pillars">
            {pillars.map((p, i) => (
              <span key={p} style={{ display: 'contents' }}>
                <span className="lp-pillar">{p}</span>
                {i < pillars.length - 1 && <span className="lp-sep" />}
              </span>
            ))}
          </div>
        </div>

        {/* Right — copy + CTAs */}
        <div className="lp-body">
          <div className="lp-eyebrow">{t('landingEyebrow')}</div>
          <h1 className="lp-h">{t('landingHeadline')}</h1>
          <p className="lp-sub">{t('landingSub')}</p>
          <div className="lp-cta">
            <button className="lp-btn-primary" onClick={() => { track('continue_as_guest'); onGuest() }}>
              {t('landingGuest')}
            </button>
            {configured && (
              <button className="lp-btn-ghost" onClick={signIn}>
                <GoogleG /> {t('landingSignIn')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
