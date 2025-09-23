import DiscoverPageClient from './DiscoverPageClient'
import requireUserId from '@/app/components/CheckAuth'
import { ListType } from '../hooks/listTablesTypes'
import { getListTitles } from '../hooks/listTablesServer'

export default async function DiscoverPage() {
  const userId = await requireUserId()

  const [SavedList, SeenList, ExclusionList, PreviousList] = await Promise.all([
    getListTitles(ListType.Saved, userId),
    getListTitles(ListType.Seen, userId),
    getListTitles(ListType.Exclusion, userId),
    getListTitles(ListType.Previous, userId)
  ])

  return <DiscoverPageClient userId={userId} />
}
