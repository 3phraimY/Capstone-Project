'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNavBar() {
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/auth')

  return (
    <nav className='bg-base-200 border-base-300 fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t'>
      {isAuthPage ? null : (
        <>
          <Link
            href='/'
            className={pathname === '/' ? 'text-accent font-bold' : ''}
          >
            Home
          </Link>
          <Link
            href='/search/-'
            className={
              pathname.startsWith('/search') ? 'text-accent font-bold' : ''
            }
          >
            Search
          </Link>
          <Link
            href='/discover'
            className={
              pathname.startsWith('/discover') ? 'text-accent font-bold' : ''
            }
          >
            Discover
          </Link>
        </>
      )}
    </nav>
  )
}
