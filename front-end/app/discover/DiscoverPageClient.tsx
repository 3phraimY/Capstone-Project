'use client'
import { useState } from 'react'

export default function DiscoverPageClient({ userId }: { userId?: string }) {
  const [search, setSearch] = useState('')

  return (
    <div className='relative mx-auto min-h-screen max-w-2xl p-8 pb-20'>
      <h1 className='mb-6 text-center text-2xl font-bold'>Discover</h1>
      <div className='bg-base-200 rounded-box p-6 text-center'>
        <p className='text-lg text-gray-600'>
          Start your discovery journey! A chat response window will appear here
          soon.
        </p>
      </div>
      <form
        className='bg-base-100 border-base-300 fixed right-0 bottom-20 left-0 mx-auto flex max-w-2xl items-center gap-2 border-t p-4'
        style={{ zIndex: 100 }}
        onSubmit={e => {
          e.preventDefault()
          // handle search here
        }}
      >
        <input
          type='text'
          className='input input-bordered w-full'
          placeholder='Type your search or prompt...'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className='btn btn-accent' type='submit'>
          Search
        </button>
      </form>
    </div>
  )
}
