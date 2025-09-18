'use client'
import { useRouter } from 'next/navigation'
import type { Title } from '../hooks/listTables'

export default function TitlePoster({ title }: { title: Title }) {
  const router = useRouter()

  return (
    <button
      className='w-40 cursor-pointer border-none bg-transparent p-0'
      onClick={() => router.push(`/title/${title.IMDbId}`)}
      aria-label={`View details for ${title.Title}`}
      type='button'
    >
      <img
        src={title.PosterURL}
        alt={title.Title}
        className='rounded-box w-full shadow'
      />
    </button>
  )
}
