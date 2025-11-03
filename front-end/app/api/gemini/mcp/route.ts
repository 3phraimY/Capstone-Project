import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const MCP_CLIENT_URL = process.env.NEXT_PUBLIC_MCP_CLIENT_URL
  const MCP_CLIENT_BEARER = process.env.MCP_CLIENT_ENDPOINT_BEARER_TOKEN

  const backendRes = await fetch(MCP_CLIENT_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MCP_CLIENT_BEARER}`
    },
    body: JSON.stringify(body)
  })

  const data = await backendRes.json()
  return NextResponse.json(data, { status: backendRes.status })
}
