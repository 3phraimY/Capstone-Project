import { Title } from './listTablesTypes'
import { getOMDbTitleByImdbId } from './omdbAPI'

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
  recommendations: GeminiRecommendation[]
  error?: string
}

export type GeminiRecommendation = {
  title: string
  year: string
  imbdId: string
  Title: Title | null
  reason: string
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

export async function getGeminiRecommendations(
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
  const mcpResponse: GeminiMCPResponse = await res.json()
  mcpResponse.recommendations = parseGeminiJsonBlock(mcpResponse.result) ?? []

  mcpResponse.recommendations = await Promise.all(
    mcpResponse.recommendations.map(async rec => {
      const omdbTitle = await getOMDbTitleByImdbId(rec.imbdId)
      return { ...rec, Title: omdbTitle }
    })
  )

  return mcpResponse
}

function parseGeminiJsonBlock(result: string): GeminiRecommendation[] | null {
  const match = result.match(/```json\s*([\s\S]+?)\s*```/)
  if (!match) return null
  try {
    return JSON.parse(match[1]) as GeminiRecommendation[]
  } catch {
    return null
  }
}
