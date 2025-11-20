'use client'
import { useTransition } from 'react'
import { ListType, Title } from '@/app/hooks/listTablesTypes'
import { useRouter } from 'next/navigation'
import { addToList, removeFromList } from '@/app/hooks/listTablesClient'
import {
  BookmarkIcon,
  HandThumbUpIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline'

export default function AddToListButtons({
  title,
  inSaved,
  inSeen,
  inExclusion,
  userId
}: {
  title: Title
  inSaved: boolean
  inSeen: boolean
  inExclusion: boolean
  userId: string
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggle = (listType: ListType, inList: boolean) => {
    startTransition(async () => {
      if (inList) {
        await removeFromList(userId, title.TitleId, listType)
      } else {
        await addToList(userId, title, listType)
      }
      router.refresh()
    })
  }

  return (
    <div className='mw-200 mb-4 grid grid-cols-3 flex-wrap justify-center gap-2 place-self-center'>
      <div>
        <button
          className={`btn flex items-center gap-2 place-self-center rounded ${inSaved ? 'btn-success' : 'btn-outline'}`}
          disabled={isPending}
          onClick={() => handleToggle(ListType.Saved, inSaved)}
        >
          <BookmarkIcon className='h-5 w-5' />
        </button>
        <div className='justify-self-center'>
          {inSaved ? 'Watch Next' : 'Watch Next'}
        </div>
      </div>
      <div>
        <button
          className={`btn flex items-center gap-2 place-self-center rounded ${inSeen ? 'btn-info' : 'btn-outline'}`}
          disabled={isPending}
          onClick={() => handleToggle(ListType.Seen, inSeen)}
        >
          <HandThumbUpIcon className='h-5 w-5' />
        </button>
        <div className='justify-self-center'>
          {inSeen ? 'Favorites' : 'Favorites'}
        </div>
      </div>
      <div>
        <button
          className={`btn flex items-center gap-2 place-self-center rounded ${inExclusion ? 'btn-error' : 'btn-outline'}`}
          disabled={isPending}
          onClick={() => handleToggle(ListType.Exclusion, inExclusion)}
        >
          <NoSymbolIcon className='h-5 w-5' />
        </button>
        <div className='justify-self-center'>
          {inExclusion ? 'Exclusion' : 'Exclusion'}
        </div>
      </div>
    </div>
  )
}
