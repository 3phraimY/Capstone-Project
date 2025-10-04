import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title')
  const page = searchParams.get('page')
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/omdb/searchResults?title=${encodeURIComponent(title || '')}&page=${encodeURIComponent(page || '1')}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    }
  )
  return NextResponse.json(await backendRes.json(), {
    status: backendRes.status
  })
}
