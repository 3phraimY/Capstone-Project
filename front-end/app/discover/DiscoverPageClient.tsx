'use client'
import { useRef, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { sendGeminiMessage, GeminiMessage } from '../hooks/geminiChat'

export default function DiscoverPageClient({ userId }: { userId?: string }) {
  const [search, setSearch] = useState('')
  const [chatHistory, setChatHistory] = useState<GeminiMessage[]>([])
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const chatStartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatStartRef.current) {
      chatStartRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatHistory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return

    setLoading(true)
    setError(null)

    const newHistory = [
      ...chatHistory,
      { role: 'user', parts: [{ text: search }] }
    ]

    try {
      const res = await sendGeminiMessage(search, chatHistory)
      setResponse(res.response)
      setChatHistory([
        ...newHistory,
        { role: 'model', parts: [{ text: res.response }] }
      ])
      setSearch('')
    } catch (err) {
      setError('Failed to get response.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative min-h-screen w-full pb-20'>
      <h1 className='mb-6 text-center text-2xl font-bold'>Discover</h1>
      <div className='mt-6 overflow-y-auto px-2 text-left'>
        {chatHistory.length === 0 && (
          <p className='text-lg text-gray-600'>
            Start your discovery journey! A chat response window will appear
            here soon.
          </p>
        )}
        {chatHistory.map((msg, idx) => {
          const isLatest = idx === chatHistory.length - 1
          return (
            <div
              key={idx}
              ref={isLatest ? chatStartRef : undefined}
              className={`mb-2 rounded p-2 ${
                msg.role === 'user'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-green-100 text-green-900'
              }`}
            >
              <strong>{msg.role === 'user' ? 'You' : 'Gemini'}:</strong>{' '}
              {msg.role === 'model' ? (
                <ReactMarkdown
                  components={{
                    hr: ({ ...props }) => (
                      <hr
                        {...props}
                        style={{
                          border: 'none',
                          borderTop: '2px solid #ccc',
                          margin: '1.5em 0'
                        }}
                      />
                    )
                  }}
                >
                  {msg.parts[0].text}
                </ReactMarkdown>
              ) : (
                msg.parts[0].text
              )}
            </div>
          )
        })}
      </div>
      {loading && <div className='text-accent mt-4'>Loading...</div>}
      {error && <div className='text-error mt-4'>{error}</div>}
      <form
        className='bg-base-100 border-base-300 fixed right-0 bottom-10 left-0 mx-auto flex w-full items-center gap-2 border-t p-4'
        style={{ zIndex: 100 }}
        onSubmit={handleSubmit}
      >
        <input
          type='text'
          className='input input-bordered w-full'
          placeholder='Type your search or prompt...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          disabled={loading}
        />
        <button className='btn btn-accent' type='submit' disabled={loading}>
          {loading ? 'Sending...' : 'Search'}
        </button>
      </form>
    </div>
  )
}
