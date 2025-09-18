import { cookies } from 'next/headers'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export enum ListType {
  Exclusion = 'exclusion',
  Saved = 'saved',
  Seen = 'seen'
}

export interface Title {
  TitleId: string
  Title: string
  PosterURL: string
  Plot: string
  Type: string
  Actors: string
  IMDbId: string
  Rating: string
  Writer: string
  Runtime: string
  Director: string
  MetaScore: number
  ReleaseYear: number
}

export async function addToList(
  userId: string,
  titleId: string,
  listType: ListType
) {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const res = await fetch(`${BACKEND_URL}/api/list/addToList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: cookieHeader
    },
    credentials: 'include',
    cache: 'no-store',
    body: JSON.stringify({ userId, titleId, listType })
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to add to list')
  }
  return res.json()
}

export async function removeFromList(
  userId: string,
  titleId: string,
  listType: ListType
) {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const res = await fetch(`${BACKEND_URL}/api/list/removeFromList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: cookieHeader
    },
    credentials: 'include',
    cache: 'no-store',
    body: JSON.stringify({ userId, titleId, listType })
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to remove from list')
  }
  return res.json()
}

export async function getListTitles(
  listType: ListType,
  userId: string
): Promise<Title[]> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const params = new URLSearchParams({ listType, userId })
  const res = await fetch(
    `${BACKEND_URL}/api/list/getListTitles?${params.toString()}`,
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
    `${BACKEND_URL}/api/list/findTitleByImdbId?imdbId=${encodeURIComponent(imdbId)}`,
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
