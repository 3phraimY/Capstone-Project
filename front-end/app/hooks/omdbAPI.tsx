import { cookies } from 'next/headers'
import type { Title } from './listTables'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function getOMDbTitleByImdbId(
  imdbId: string
): Promise<Title | null> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const res = await fetch(
    `${BACKEND_URL}/api/omdb/findTitle?id=${encodeURIComponent(imdbId)}`,
    {
      method: 'GET',
      headers: { cookie: cookieHeader },
      credentials: 'include',
      cache: 'no-store'
    }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data as Title
}
