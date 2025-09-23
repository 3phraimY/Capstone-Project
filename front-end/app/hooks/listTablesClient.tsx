import { ListType, Title } from './listTablesTypes'

const FALLBACK_POSTER =
  'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'

function checkImage(url: string): Promise<boolean> {
  return new Promise(resolve => {
    const img = new window.Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

export async function addToList(
  userId: string,
  title: Title,
  listType: ListType
) {
  let posterUrl = title.PosterURL
  if (typeof window !== 'undefined' && posterUrl) {
    const valid = await checkImage(posterUrl)
    if (!valid) posterUrl = FALLBACK_POSTER
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/list/addToList`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        listType,
        userId,
        Title: title.Title,
        Year: String(title.ReleaseYear),
        Rated: title.Rating,
        Runtime: title.Runtime,
        Director: title.Director,
        Writer: title.Writer,
        Actors: title.Actors,
        Plot: title.Plot,
        Poster: posterUrl,
        Metascore: String(title.MetaScore),
        imdbID: title.IMDbId,
        Type: title.Type
      })
    }
  )
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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/list/removeFromList`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId, titleId, listType })
    }
  )
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to remove from list')
  }
  return res.json()
}
