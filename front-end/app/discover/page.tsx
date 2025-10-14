import DiscoverPageClient from './DiscoverPageClient'
import requireUserId from '@/app/components/CheckAuth'

export default async function DiscoverPage() {
  const userId = await requireUserId()

  return <DiscoverPageClient userId={userId} />
}
