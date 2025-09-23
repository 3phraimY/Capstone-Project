'use client'
import { useTransition } from 'react'
import { ListType, Title } from '@/app/hooks/listTablesTypes'
import { useRouter } from 'next/navigation'
import { addToList, removeFromList } from '@/app/hooks/listTablesClient'

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
    <div className='mb-4 flex flex-wrap justify-center gap-2'>
      <button
        className={`btn ${inSaved ? 'btn-success' : 'btn-outline'}`}
        disabled={isPending}
        onClick={() => handleToggle(ListType.Saved, inSaved)}
      >
        {inSaved ? 'In Saved' : 'Add to Saved'}
      </button>
      <button
        className={`btn ${inSeen ? 'btn-info' : 'btn-outline'}`}
        disabled={isPending}
        onClick={() => handleToggle(ListType.Seen, inSeen)}
      >
        {inSeen ? 'In Seen' : 'Add to Seen'}
      </button>
      <button
        className={`btn ${inExclusion ? 'btn-warning' : 'btn-outline'}`}
        disabled={isPending}
        onClick={() => handleToggle(ListType.Exclusion, inExclusion)}
      >
        {inExclusion ? 'In Exclusion' : 'Add to Exclusion'}
      </button>
    </div>
  )
}
