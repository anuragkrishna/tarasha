import { useState, useEffect, useCallback } from 'react'
import { onAuth, signInWithGoogle, signOutUser, isFirebaseConfigured, track } from '../firebase'

// Tracks the signed-in Google user (or null for guest). `ready` flips true once
// the initial auth state is known, so the UI doesn't flash the wrong state.
export function useAuth() {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(!isFirebaseConfigured)

  useEffect(() => {
    const unsub = onAuth(u => {
      setUser(u)
      setReady(true)
    })
    return unsub
  }, [])

  const signIn = useCallback(() => signInWithGoogle().then(() => track('login', { method: 'google' })).catch(() => {}), [])
  const signOut = useCallback(() => signOutUser(), [])

  return { user, ready, signIn, signOut, configured: isFirebaseConfigured }
}
