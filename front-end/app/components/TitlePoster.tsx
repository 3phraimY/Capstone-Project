'use client'
import { useRouter } from 'next/navigation'
import type { Title } from '../hooks/listTablesTypes'
import ClientPosterImage from './ClientPosterImage'

export default function TitlePoster({
  title,
  className
}: {
  title: Title
  className?: string
}) {
  const router = useRouter()

  return (
    <button
      className={`cursor-pointer border-none bg-transparent p-0 ${className}`}
      onClick={() => router.push(`/title/${title.IMDbId}`)}
      aria-label={`View details for ${title.Title}`}
      type='button'
    >
      <ClientPosterImage
        src={title.PosterURL}
        alt={title.Title}
        className='h-full w-full rounded object-cover'
      />
    </button>
  )
}
