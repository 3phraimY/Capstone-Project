import requireUserId from '@/app/components/CheckAuth'
import { getListTitles } from '@/app/hooks/listTablesServer'
import { ListType, Title } from '@/app/hooks/listTablesTypes'
import TitlePoster from '@/app/components/TitlePoster'
import BackButton from '../../components/BackButton'

const LIST_LABELS: Record<ListType, string> = {
  [ListType.Saved]: 'Saved List',
  [ListType.Seen]: 'Seen List',
  [ListType.Exclusion]: 'Exclusion List',
  [ListType.Previous]: 'Previous Recommendations'
}

function isListType(value: string): value is ListType {
  return Object.values(ListType).includes(value as ListType)
}

export default async function MyListPage({
  params
}: {
  params: { listName: string }
}) {
  const userId = await requireUserId()
  const { listName } = await params

  if (!isListType(listName)) {
    return <div className='p-8 text-center'>Invalid list type.</div>
  }

  const titles = await getListTitles(listName, userId)

  return (
    <div className='relative mx-auto max-w-4xl p-8'>
      <BackButton />
      <h1 className='mb-6 text-2xl font-bold capitalize'>
        {LIST_LABELS[listName]}
      </h1>
      {titles.length === 0 ? (
        <div className='text-center text-gray-500'>No titles in this list.</div>
      ) : (
        <div className='flex flex-wrap justify-start gap-6'>
          {titles.map(title => (
            <TitlePoster key={title.TitleId} title={title} />
          ))}
        </div>
      )}
    </div>
  )
}
