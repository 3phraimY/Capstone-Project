import { useState } from 'react'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

interface AuthResponse {
  user?: string
  error?: string
}

interface UseDatabaseAuthResult {
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<AuthResponse | null>
  signUp: (
    email: string,
    password: string,
    full_name?: string
  ) => Promise<AuthResponse | null>
}

export function useDatabaseAuth(): UseDatabaseAuthResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to login')
        return null
      }
      return data
    } catch (err: any) {
      setError(err.message || 'Failed to login')
      return null
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (
    email: string,
    password: string,
    full_name?: string
  ): Promise<AuthResponse | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/signUp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name }),
        credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to sign up')
        return null
      }
      return data
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, login, signUp }
}
