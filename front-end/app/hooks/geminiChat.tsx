export type GeminiMessage = {
  role: 'user' | 'model'
  parts: { text: string }[]
}

export type GeminiChatResponse = {
  response: string
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
