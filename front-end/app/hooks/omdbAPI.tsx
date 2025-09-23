import type { Title } from './listTablesTypes'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function getOMDbTitleByImdbId(
  imdbId: string
): Promise<Title | null> {
  const res = await fetch(
    `${BACKEND_URL}/api/omdb/findTitle?id=${encodeURIComponent(imdbId)}`,
    {
      method: 'GET',
      cache: 'force-cache'
    }
  )
  if (!res.ok) return null
  const data = await res.json()

  return {
    TitleId: data.imdbID || data.imdbId || '',
    Title: data.Title || '',
    PosterURL:
      data.Poster !== 'N/A'
        ? data.Poster
        : 'https://via.placeholder.com/150x220?text=No+Image',
    Plot: data.Plot || '',
    Type: data.Type || '',
    Actors: data.Actors || '',
    IMDbId: data.imdbID || data.imdbId || '',
    Rating: data.Rated || '',
    Writer: data.Writer || '',
    Runtime: data.Runtime || '',
    Director: data.Director || '',
    MetaScore: data.Metascore ? parseInt(data.Metascore) : 0,
    ReleaseYear: data.Year ? parseInt(data.Year) : 0
  }
}

export type OMDbSearchResult = {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export type OMDbSearchResponse = {
  Search: OMDbSearchResult[]
  totalResults: string
  Response: string
  Error?: string
}

export async function searchOMDb(
  title: string,
  page: number = 1
): Promise<OMDbSearchResponse | null> {
  const params = new URLSearchParams({ title, page: page.toString() })
  const res = await fetch(
    `${BACKEND_URL}/api/omdb/searchResults?${params.toString()}`,
    {
      method: 'GET',
      cache: 'no-store'
    }
  )
  if (!res.ok) return null
  return res.json()
}
