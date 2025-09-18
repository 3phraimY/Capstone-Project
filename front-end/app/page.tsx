import CheckAuth from './components/CheckAuth'
import { getListTitles, ListType } from './hooks/listTables'
import TitleCarousel from './components/TitleCarousel'
import { getPreviousRecommendations } from './hooks/previousRecommendations'

export default function Home() {
  return (
    <CheckAuth>
      {async userId => {
        const SavedList = await getListTitles(ListType.Saved, userId)
        const SeenList = await getListTitles(ListType.Seen, userId)
        const ExclusionList = await getListTitles(ListType.Exclusion, userId)
        const previousRecs = await getPreviousRecommendations(userId)
        return (
          <div className='flex w-full flex-col items-center'>
            <div className='my-4 w-full text-center text-2xl font-bold'>
              Home
            </div>

            <div className='mt-4 mb-0 ml-4 self-start text-lg font-semibold'>
              Previous Recommendations
            </div>
            <TitleCarousel titles={previousRecs.map(r => r.Title)} />

            <div className='mt-4 mb-0 ml-4 self-start text-lg font-semibold'>
              Saved List
            </div>
            <TitleCarousel titles={SavedList} />

            <div className='mt-4 mb-0 ml-4 self-start text-lg font-semibold'>
              Seen List
            </div>
            <TitleCarousel titles={SeenList} />

            <div className='mt-4 mb-0 ml-4 self-start text-lg font-semibold'>
              Exclusion List
            </div>
            <TitleCarousel titles={ExclusionList} />
          </div>
        )
      }}
    </CheckAuth>
  )
}
