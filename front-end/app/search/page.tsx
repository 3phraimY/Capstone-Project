'use client'

import { useState } from 'react'
import { searchOMDb, OMDbSearchResult } from '../hooks/omdbAPI'
import TitlePoster from '../components/TitlePoster'
import type { Title } from '../hooks/listTables'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<OMDbSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSearched(false)
    try {
      const data = await searchOMDb(query)
      if (data && data.Response === 'True') {
        setResults(data.Search)
      } else {
        setResults([])
        setError(data?.Error || 'No results found')
      }
    } catch (err: any) {
      setError('Failed to fetch results')
      setResults([])
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  // Map OMDbSearchResult to Title type for TitlePoster
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
    <div className='mx-auto max-w-2xl p-8'>
      <h1 className='mb-6 text-2xl font-bold'>Search OMDb Titles</h1>
      <form className='mb-6 flex gap-2' onSubmit={handleSearch}>
        <input
          className='input input-bordered w-full'
          type='text'
          placeholder='Search for a movie or show...'
          value={query}
          onChange={e => setQuery(e.target.value)}
          required
        />
        <button className='btn btn-accent' type='submit' disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <div className='text-error mb-4'>{error}</div>}
      {searched && !loading && results.length === 0 && !error && (
        <div className='text-center text-gray-500'>No results found.</div>
      )}
      <div className='flex flex-wrap gap-6'>
        {results.map(result => (
          <TitlePoster key={result.imdbID} title={toTitle(result)} />
        ))}
      </div>
    </div>
  )
}
