import requireUserId from './components/CheckAuth'
import { getListTitles } from './hooks/listTablesServer'
import { ListType } from './hooks/listTablesTypes'
import TitleCarousel from './components/TitleCarousel'
import Link from 'next/link'

export default async function Home() {
  const userId = await requireUserId()
  const [SavedList, SeenList, ExclusionList, PreviousList] = await Promise.all([
    getListTitles(ListType.Saved, userId),
    getListTitles(ListType.Seen, userId),
    getListTitles(ListType.Exclusion, userId),
    getListTitles(ListType.Previous, userId)
  ])

  return (
    <div className='flex w-full flex-col items-center'>
      {PreviousList.length > 0 && (
        <>
          <div className='bg-base-100 mt-2 mb-2 ml-4 self-start text-lg font-semibold'>
            <Link
              href={`/myLists/${ListType.Previous}`}
              className='hover:underline'
            >
              Previous Recommendations &gt;
            </Link>
          </div>

          <TitleCarousel titles={PreviousList.reverse()} />
        </>
      )}

      {SavedList.length > 0 && (
        <>
          <div className='mt-4 mb-2 ml-4 self-start text-lg font-semibold'>
            <Link
              href={`/myLists/${ListType.Saved}`}
              className='hover:underline'
            >
              Watch Next &gt;
            </Link>
          </div>
          <TitleCarousel titles={SavedList.reverse()} />
        </>
      )}

      {SeenList.length > 0 && (
        <>
          <div className='mt-4 mb-2 ml-4 self-start text-lg font-semibold'>
            <Link
              href={`/myLists/${ListType.Seen}`}
              className='hover:underline'
            >
              Favorites &gt;
            </Link>
          </div>
          <TitleCarousel titles={SeenList.reverse()} />
        </>
      )}
      {ExclusionList.length > 0 && (
        <>
          <div className='mt-4 mb-2 ml-4 self-start text-lg font-semibold'>
            <Link
              href={`/myLists/${ListType.Exclusion}`}
              className='hover:underline'
            >
              Exclusion List &gt;
            </Link>
          </div>
          <TitleCarousel titles={ExclusionList.reverse()} />
        </>
      )}
    </div>
  )
}
