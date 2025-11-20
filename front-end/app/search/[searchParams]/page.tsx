'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { searchOMDb, OMDbSearchResult } from '../../hooks/omdbAPI'
import TitlePoster from '../../components/TitlePoster'
import type { Title } from '../../hooks/listTablesTypes'

export default function SearchPage() {
  const router = useRouter()
  const params = useParams()
  const initialQuery =
    typeof params.searchParams === 'string' && params.searchParams !== '-'
      ? decodeURIComponent(params.searchParams)
      : ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<OMDbSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery)
    } else {
      setResults([])
      setSearched(false)
      setError(null)
    }
  }, [initialQuery])

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      return
    }
    setLoading(true)
    setError(null)
    setSearched(false)
    try {
      const data = await searchOMDb(searchTerm)
      if (data && data.Response === 'True') {
        setResults(data.Search)
      } else {
        setResults([])
        setError(data?.Error || 'No results found')
      }
    } catch {
      setError('Failed to fetch results')
      setResults([])
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.replace(
      `/search/${query.trim() ? encodeURIComponent(query.trim()) : '-'}`
    )
  }

  const toTitle = (result: OMDbSearchResult): Title => ({
    TitleId: result.imdbID,
    Title: result.Title,
    PosterURL:
      result.Poster !== 'N/A'
        ? result.Poster
        : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930',
    Plot: '',
    Type: result.Type,
    Actors: '',
    IMDbId: result.imdbID,
    Rating: '',
    Writer: '',
    Runtime: '',
    Director: '',
    MetaScore: 0,
    ReleaseYear: parseInt(result.Year) || 0
  })

  return (
    <>
      <div className='mx-auto max-w-2xl p-8'>
        <form className='mb-6 flex gap-2' onSubmit={onSubmit}>
          <input
            className='input input-bordered w-full'
            type='text'
            placeholder='Search for a movie or show...'
            value={query}
            onChange={e => setQuery(e.target.value)}
            required
          />
          <button
            className='btn btn-accent rounded'
            type='submit'
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        {error && <div className='text-error mb-4'>{error}</div>}
        {searched && !loading && results.length === 0 && !error && (
          <div className='text-center text-gray-500'>No results found.</div>
        )}
      </div>
      <div className='flex flex-wrap place-content-center gap-6'>
        {results.map(result => (
          <TitlePoster
            key={result.imdbID}
            title={toTitle(result)}
            className='relative aspect-[0.64] w-[40%] max-w-[160px] overflow-hidden rounded shadow'
          />
        ))}
      </div>
    </>
  )
}
