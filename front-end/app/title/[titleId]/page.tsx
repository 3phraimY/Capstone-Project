import requireUserId from '@/app/components/CheckAuth'
import {
  getDatabaseTitleByImdbId,
  getListTitles
} from '@/app/hooks/listTablesServer'
import { ListType, Title } from '@/app/hooks/listTablesTypes'
import { getOMDbTitleByImdbId } from '@/app/hooks/omdbAPI'
import BackButton from '../../components/BackButton'
import AddToListButtons from './AddToListButtons'
import ClientPosterImage from '../../components/ClientPosterImage'

export default async function TitleDetailsPage({
  params
}: {
  params: { titleId: string }
}) {
  const userId = await requireUserId()
  const { titleId } = await params
  let title: Title | null = await getDatabaseTitleByImdbId(titleId)
  if (!title) title = await getOMDbTitleByImdbId(titleId)

  const [savedList, seenList, exclusionList] = await Promise.all([
    getListTitles(ListType.Saved, userId),
    getListTitles(ListType.Seen, userId),
    getListTitles(ListType.Exclusion, userId)
  ])

  const inSaved = savedList.some(t => t.IMDbId === title?.IMDbId)
  const inSeen = seenList.some(t => t.IMDbId === title?.IMDbId)
  const inExclusion = exclusionList.some(t => t.IMDbId === title?.IMDbId)

  return (
    <div className='relative mx-auto p-8'>
      <BackButton />
      {title ? (
        <>
          <h1 className='mb-2 text-center text-2xl font-bold'>{title.Title}</h1>
          <div className='grid grid-cols-2'>
            <div className='self-center'>
              <ClientPosterImage
                src={title.PosterURL}
                alt={title.Title}
                className='mx-auto mb-4 max-w-[250px] rounded shadow'
              />
            </div>
            <div className='content-center pl-8'>
              <div className='mb-2'>
                <strong>Rating:</strong> {title.Rating}
              </div>
              <div className='mb-2'>
                <strong>Year:</strong> {title.ReleaseYear}
              </div>
              <div className='mb-2'>
                <strong>Runtime:</strong> {title.Runtime}
              </div>
              <div className='mb-2'>
                <strong>Director:</strong> {title.Director}
              </div>
              <div className='mb-2'>
                <strong>Actors:</strong> {title.Actors}
              </div>
            </div>
          </div>
          <AddToListButtons
            title={title}
            inSaved={inSaved}
            inSeen={inSeen}
            inExclusion={inExclusion}
            userId={userId}
          />
          <div className='mb-2'>
            <strong>Plot:</strong> {title.Plot}
          </div>
        </>
      ) : (
        <div className='p-8 text-center'>Title not found.</div>
      )}
    </div>
  )
}
