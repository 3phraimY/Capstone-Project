'use client'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className='btn btn-circle btn-ghost absolute top-4 left-4'
      aria-label='Go back'
      type='button'
    >
      <span className='text-2xl'>←</span>
    </button>
  )
}
