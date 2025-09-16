import { redirect } from 'next/navigation'
import { checkAuth, refreshAccessToken } from '@/app/hooks/databaseAuthServer'

export default async function CheckAuth({
  children
}: {
  children: (userId: string) => React.ReactNode
}) {
  let { authenticated, user, hasRefreshToken } = await checkAuth()

  // If not authenticated but has refresh token, try to refresh and check again
  if (!authenticated && hasRefreshToken) {
    await refreshAccessToken()
    const result = await checkAuth()
    authenticated = result.authenticated
    user = result.user
  }

  if (!authenticated || !user) {
    redirect('/auth/login')
  }

  return <>{children(user)}</>
}
