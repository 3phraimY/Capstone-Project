export type GeminiMessage = {
  role: 'user' | 'model'
  parts: { text: string }[]
}

export type GeminiChatResponse = {
  response: string
  error?: string
}

export type GeminiMCPResponse = {
  result: string
  error?: string
}

export async function sendGeminiMessage(
  message: string,
  history?: GeminiMessage[]
): Promise<GeminiChatResponse> {
  const res = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ message, history })
  })
  return res.json()
}

export async function sendGeminiMCP(
  contentMessage: string,
  userId: string,
  history?: GeminiMessage[]
): Promise<GeminiMCPResponse> {
  const body: any = { contentMessage, userId }
  if (history && history.length > 0) {
    body.history = history
  }

  const res = await fetch('/api/gemini/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  })
  return res.json()
}
