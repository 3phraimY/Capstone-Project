import './globals.css'
import BottomNavBar from './components/BottomNavBar'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        <div className='min-h-screen pb-16'>{children}</div>
        <BottomNavBar />
      </body>
    </html>
  )
}
