import requireUserId from '@/app/components/CheckAuth'
import { getDatabaseTitleByImdbId } from '@/app/hooks/listTables'
import { getOMDbTitleByImdbId } from '@/app/hooks/omdbAPI'
import type { Title } from '@/app/hooks/listTables'
import BackButton from '../../components/BackButton'

export default async function TitleDetailsPage({
  params
}: {
  params: { titleId: string }
}) {
  const userId = await requireUserId()
  const { titleId } = await params
  let title: Title | null = await getDatabaseTitleByImdbId(titleId)
  if (!title) title = await getOMDbTitleByImdbId(titleId)

  return (
    <div className='relative mx-auto max-w-xl p-8'>
      <BackButton />
      {title ? (
        <>
          <img
            src={title.PosterURL}
            alt={title.Title}
            className='rounded-box mx-auto mb-4 w-64 shadow'
          />
          <h1 className='mb-2 text-2xl font-bold'>{title.Title}</h1>
          <div className='mb-2'>
            <strong>Plot:</strong> {title.Plot}
          </div>
          <div className='mb-2'>
            <strong>Actors:</strong> {title.Actors}
          </div>
          <div className='mb-2'>
            <strong>Director:</strong> {title.Director}
          </div>
          <div className='mb-2'>
            <strong>Year:</strong> {title.ReleaseYear}
          </div>
          <div className='mb-2'>
            <strong>Rating:</strong> {title.Rating}
          </div>
          <div className='mb-2'>
            <strong>Runtime:</strong> {title.Runtime}
          </div>
        </>
      ) : (
        <div className='p-8 text-center'>Title not found.</div>
      )}
    </div>
  )
}
