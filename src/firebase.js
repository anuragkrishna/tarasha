// Firebase is optional: the app runs fully as a guest (localStorage only) when
// these env vars aren't set. Once configured, Google sign-in + Firestore cloud
// sync turn on. The web config keys below are NOT secret — they're meant to ship
// in the client; access is protected by Firestore security rules instead.
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics'

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const isFirebaseConfigured = Boolean(cfg.apiKey && cfg.authDomain && cfg.projectId && cfg.appId)

let auth = null
let db = null
let provider = null
let analytics = null
let analyticsQueue = []

if (isFirebaseConfigured) {
  const app = initializeApp(cfg)
  auth = getAuth(app)
  db = getFirestore(app)
  provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })

  // Analytics only loads in supported browser environments.
  if (cfg.measurementId) {
    isSupported().then(ok => {
      if (!ok) return
      analytics = getAnalytics(app)
      analyticsQueue.forEach(([n, p]) => logEvent(analytics, n, p))
      analyticsQueue = []
    }).catch(() => {})
  }
}

export { auth, db }

// Log a GA4 event (anonymous usage only). No-ops when analytics isn't ready/available;
// events fired before analytics loads are buffered and flushed once it does.
export function track(name, params = {}) {
  if (!isFirebaseConfigured || !cfg.measurementId) return
  if (analytics) logEvent(analytics, name, params)
  else analyticsQueue.push([name, params])
}

// Subscribe to auth changes. Calls back with null immediately if not configured.
export function onAuth(cb) {
  if (!auth) { cb(null); return () => {} }
  return onAuthStateChanged(auth, cb)
}

export function signInWithGoogle() {
  if (!auth || !provider) return Promise.reject(new Error('Auth not configured'))
  return signInWithPopup(auth, provider)
}

export function signOutUser() {
  if (!auth) return Promise.resolve()
  return signOut(auth)
}
