import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const imdbId = searchParams.get('id')
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/omdb/findTitle?id=${encodeURIComponent(imdbId || '')}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'force-cache'
    }
  )
  return NextResponse.json(await backendRes.json(), {
    status: backendRes.status
  })
}
