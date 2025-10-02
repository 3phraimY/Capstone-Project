import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie') || ''
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/checkAuthentication`,
    {
      method: 'GET',
      headers: { cookie: cookieHeader },
      credentials: 'include'
    }
  )
  const data = await backendRes.json()
  return NextResponse.json(data, { status: backendRes.status })
}
