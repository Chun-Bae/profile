'use client'

import { useActionState } from 'react'
import { authenticate } from './actions'

export default function LoginPage() {
  const [state, action, isPending] = useActionState(authenticate, undefined)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-4 font-sans text-[var(--foreground)]">
      <main className="w-full max-w-sm space-y-8">
        
        <div className="space-y-2 text-center sm:text-left border-b border-[var(--border)] pb-6 mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Private Profile</h1>
          <p className="text-[var(--text-muted)]">This document is password protected.</p>
        </div>
        
        <form action={action} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input 
              id="password"
              type="password" 
              name="password"
              required
              autoFocus
              className="w-full px-3 py-2 bg-transparent border border-[var(--border)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] sm:text-sm transition-shadow"
            />
          </div>
          
          {state?.error && (
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              {state.error}
            </p>
          )}

          <button 
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--accent)] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? 'Authenticating...' : 'View Profile'}
          </button>
        </form>

        <footer className="mt-8 text-center sm:text-left text-xs text-[var(--text-muted)]">
          <p>Please enter the password provided to you to access this site.</p>
        </footer>

      </main>
    </div>
  )
}
