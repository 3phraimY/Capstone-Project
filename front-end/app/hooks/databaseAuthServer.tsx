import { cookies } from 'next/headers'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function checkAuth(): Promise<{
  authenticated: boolean
  user?: string
  hasRefreshToken: boolean
}> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const res = await fetch(`${BACKEND_URL}/api/auth/checkAuthentication`, {
    method: 'GET',
    headers: { cookie: cookieHeader },
    cache: 'no-store',
    credentials: 'include'
  })
  const data = await res.json()
  console.log(data)
  return {
    authenticated: data.authenticated,
    user: data.user,
    hasRefreshToken: data.hasRefreshToken ?? false
  }
}

export async function refreshAccessToken(): Promise<{
  user?: string
  error?: string
}> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const res = await fetch(`${BACKEND_URL}/api/auth/refreshAccessToken`, {
    method: 'POST',
    headers: { cookie: cookieHeader },
    cache: 'no-store',
    credentials: 'include'
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    return { error: data.error || 'Failed to refresh token' }
  }
  const data = await res.json()
  return { user: data.user }
}
