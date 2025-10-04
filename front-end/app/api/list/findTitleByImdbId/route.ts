import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const imdbId = searchParams.get('imdbId')
  const cookieHeader = req.headers.get('cookie') || ''

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/list/findTitleByImdbId?imdbId=${encodeURIComponent(imdbId || '')}`,
    {
      method: 'GET',
      headers: {
        cookie: cookieHeader,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      cache: 'no-store'
    }
  )

  const response = NextResponse.json(await backendRes.json(), {
    status: backendRes.status
  })
  const setCookie = backendRes.headers.get('set-cookie')
  if (setCookie) response.headers.set('set-cookie', setCookie)
  return response
}
