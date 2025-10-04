import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const cookieHeader = req.headers.get('cookie') || ''
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/list/addToList`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: cookieHeader
      },
      body: JSON.stringify(body),
      credentials: 'include'
    }
  )
  // Forward Set-Cookie headers from backend to client if present
  const response = NextResponse.json(await backendRes.json(), {
    status: backendRes.status
  })
  const setCookie = backendRes.headers.get('set-cookie')
  if (setCookie) response.headers.set('set-cookie', setCookie)
  return response
}
