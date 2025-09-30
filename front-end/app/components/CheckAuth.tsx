import { redirect } from 'next/navigation'
import { checkAuth, refreshAccessToken } from '@/app/hooks/databaseAuthServer'

export async function requireUserId(): Promise<string> {
  const initial = await checkAuth()
  let authenticated = initial.authenticated
  let user = initial.user
  const hasRefreshToken = initial.hasRefreshToken

  if (!authenticated && hasRefreshToken) {
    await refreshAccessToken()
    const result = await checkAuth()
    authenticated = result.authenticated
    user = result.user
  }

  if (!authenticated || !user) {
    redirect('/auth/login')
  }

  return user
}

export default requireUserId
