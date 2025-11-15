'use client'
import { createContext, useContext, useState } from 'react'
import type { GeminiChatEntry } from '../discover/DiscoverPageClient'

const ChatHistoryContext = createContext<
  | {
      chatEntries: GeminiChatEntry[]
      setChatEntries: React.Dispatch<React.SetStateAction<GeminiChatEntry[]>>
    }
  | undefined
>(undefined)

export function ChatHistoryProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [chatEntries, setChatEntries] = useState<GeminiChatEntry[]>([])
  return (
    <ChatHistoryContext.Provider value={{ chatEntries, setChatEntries }}>
      {children}
    </ChatHistoryContext.Provider>
  )
}

export function useChatHistory() {
  const ctx = useContext(ChatHistoryContext)
  if (!ctx)
    throw new Error('useChatHistory must be used within ChatHistoryProvider')
  return ctx
}
