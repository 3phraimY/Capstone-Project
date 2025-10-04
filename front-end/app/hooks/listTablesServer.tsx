import { cookies } from 'next/headers'
import { Title, ListType } from './listTablesTypes'

export async function getListTitles(
  listType: ListType,
  userId: string
): Promise<Title[]> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const params = new URLSearchParams({ listType, userId })
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/list/getListTitles?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        cookie: cookieHeader
      },
      credentials: 'include',
      cache: 'no-store'
    }
  )
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to get list titles')
  }
  const data = await res.json()
  return data.titles as Title[]
}

export async function getDatabaseTitleByImdbId(
  imdbId: string
): Promise<Title | null> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/list/findTitleByImdbId?imdbId=${encodeURIComponent(imdbId)}`,
    {
      method: 'GET',
      headers: { cookie: cookieHeader },
      credentials: 'include',
      cache: 'no-store'
    }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.title as Title
}
