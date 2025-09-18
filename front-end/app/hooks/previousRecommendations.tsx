import { cookies } from 'next/headers'
import type { Title } from './listTables'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export interface PreviousRecommendation {
  PreviousRecommendationItemId: string
  RecommendedDate: string
  Title: Title
}

export async function getPreviousRecommendations(
  userId: string
): Promise<PreviousRecommendation[]> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const params = new URLSearchParams({ userId })
  const res = await fetch(
    `${BACKEND_URL}/api/previousRecommendations/getAll?${params.toString()}`,
    {
      method: 'GET',
      headers: { cookie: cookieHeader },
      credentials: 'include',
      cache: 'no-store'
    }
  )
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to get previous recommendations')
  }
  const data = await res.json()
  return data.recommendations as PreviousRecommendation[]
}
