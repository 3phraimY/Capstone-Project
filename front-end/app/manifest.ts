import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ReelTalk',
    short_name: 'ReelTalk',
    description: 'Discover and discuss movies with ReelTalk!',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    screenshots: [
      {
        src: '/screenshots/screenshot.png',
        sizes: '317x607',
        type: 'image/png',
        form_factor: 'wide'
      },
      {
        src: '/screenshots/screenshot.png',
        sizes: '317x607',
        type: 'image/png'
      }
    ]
  }
}
