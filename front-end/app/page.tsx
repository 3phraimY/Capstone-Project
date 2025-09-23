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
      <div className='my-4 w-full pt-4 text-center text-2xl font-bold'>
        Home
      </div>

      <div className='mt-2 mb-0 ml-4 self-start text-lg font-semibold'>
        <Link
          href={`/myLists/${ListType.Previous}`}
          className='hover:underline'
        >
          Previous Recommendations &gt;
        </Link>
      </div>
      <TitleCarousel titles={PreviousList} />

      <div className='mt-4 mb-0 ml-4 self-start text-lg font-semibold'>
        <Link href={`/myLists/${ListType.Saved}`} className='hover:underline'>
          Saved List &gt;
        </Link>
      </div>
      <TitleCarousel titles={SavedList} />

      <div className='mt-4 mb-0 ml-4 self-start text-lg font-semibold'>
        <Link href={`/myLists/${ListType.Seen}`} className='hover:underline'>
          Seen List &gt;
        </Link>
      </div>
      <TitleCarousel titles={SeenList} />

      <div className='mt-4 mb-0 ml-4 self-start text-lg font-semibold'>
        <Link
          href={`/myLists/${ListType.Exclusion}`}
          className='hover:underline'
        >
          Exclusion List &gt;
        </Link>
      </div>
      <TitleCarousel titles={ExclusionList} />
    </div>
  )
}
