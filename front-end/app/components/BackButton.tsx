'use client'
import { useRouter } from 'next/navigation'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'

export default function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className='btn btn-circle btn-ghost absolute top-4 left-4'
      aria-label='Go back'
      type='button'
    >
      <ArrowUturnLeftIcon className='h-6 w-6' />
    </button>
  )
}
