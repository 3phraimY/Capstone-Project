import './globals.css'
import BottomNavBar from './components/BottomNavBar'
import { ChatHistoryProvider } from './context/DiscoverContext'

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
