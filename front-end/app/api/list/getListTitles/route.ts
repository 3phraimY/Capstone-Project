import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const listType = searchParams.get('listType')
  const userId = searchParams.get('userId')
  const cookieHeader = req.headers.get('cookie') || ''

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/list/getListTitles?listType=${encodeURIComponent(listType || '')}&userId=${encodeURIComponent(userId || '')}`,
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
