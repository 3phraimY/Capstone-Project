'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'

export default function BottomNavBar() {
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/auth')

  return (
    <nav className='bg-base-200 border-base-300 fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t'>
      {isAuthPage ? null : (
        <>
          <Link
            href='/'
            className={`flex items-center gap-1 ${
              pathname === '/' ? 'text-accent font-bold' : ''
            }`}
          >
            <HomeIcon className='h-5 w-5' />
            Home
          </Link>
          <Link
            href='/search/-'
            className={`flex items-center gap-1 ${
              pathname.startsWith('/search') ? 'text-accent font-bold' : ''
            }`}
          >
            <MagnifyingGlassIcon className='h-5 w-5' />
            Search
          </Link>
          <Link
            href='/discover'
            className={`flex items-center gap-1 ${pathname.startsWith('/discover') ? 'text-accent font-bold' : ''}`}
          >
            <RocketLaunchIcon className='h-5 w-5' />
            Discover
          </Link>
        </>
      )}
    </nav>
  )
}
