import './globals.css'
import BottomNavBar from './components/BottomNavBar'
import { ChatHistoryProvider } from './context/DiscoverContext'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReelTalk',
  description: 'Discover and discuss movies with ReelTalk!',
  manifest: '/manifest.webmanifest'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        <ChatHistoryProvider>
          <div className='min-h-screen pb-16'>{children}</div>
          <BottomNavBar />
        </ChatHistoryProvider>
      </body>
    </html>
  )
}
