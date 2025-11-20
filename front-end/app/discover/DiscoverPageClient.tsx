'use client'
import { useRef, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  getGeminiRecommendations,
  GeminiMCPResponse,
  GeminiRecommendation,
  GeminiMessage
} from '../hooks/geminiChat'
import TitlePoster from '../components/TitlePoster'
import { useChatHistory } from '../context/DiscoverContext'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { ListType } from '../hooks/listTablesTypes'
import { addToList } from '../hooks/listTablesClient'

export type GeminiChatEntry = {
  message: GeminiMessage
  recommendations: GeminiRecommendation[] | null
}

export default function DiscoverPageClient({ userId }: { userId: string }) {
  const { chatEntries, setChatEntries } = useChatHistory()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const chatStartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatStartRef.current) {
      chatStartRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatEntries])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return

    setLoading(true)
    setError(null)

    // Add user entry
    const userEntry: GeminiChatEntry = {
      message: { role: 'user', parts: [{ text: search }] },
      recommendations: null
    }

    try {
      const res: GeminiMCPResponse = await getGeminiRecommendations(
        search,
        userId,
        chatEntries.map(entry => entry.message).concat(userEntry.message)
      )
      // Add model entry with recommendations
      const modelEntry: GeminiChatEntry = {
        message: { role: 'model', parts: [{ text: res.result }] },
        recommendations: res.recommendations
      }
      setChatEntries([...chatEntries, userEntry, modelEntry])
      setSearch('')

      if (res.recommendations && res.recommendations.length > 0) {
        Promise.all(
          res.recommendations.map(rec =>
            rec.Title
              ? addToList(userId, rec.Title, ListType.Previous).catch(() => {})
              : Promise.resolve()
          )
        )
      }
    } catch (err) {
      setError(`Failed to get response: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative min-h-screen w-full pb-20'>
      <div className='mt-6 overflow-y-auto px-2 text-left'>
        {chatEntries.length === 0 && (
          <p className='text-lg text-gray-600'>
            Start your discovery journey! A chat response window will appear
            here soon.
          </p>
        )}
        {chatEntries.map((entry, idx) => {
          const isLatest = idx === chatEntries.length - 1
          return (
            <div
              key={idx}
              ref={isLatest ? chatStartRef : undefined}
              className={`mb-2 rounded p-2 ${
                entry.message.role === 'user'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-green-100 text-green-900'
              }`}
            >
              <strong>
                {entry.message.role === 'user' ? 'You' : 'Gemini'}:
              </strong>{' '}
              {entry.message.role === 'model' &&
              entry.recommendations &&
              entry.recommendations.length > 0 ? (
                entry.recommendations.map(rec => (
                  <div
                    key={rec.imbdId}
                    className='mb-4 flex flex-row items-start gap-4'
                  >
                    <div className='flex w-1/2 justify-center'>
                      <TitlePoster
                        title={rec.Title!}
                        className='h-[250px] w-[160px] rounded shadow'
                      />
                    </div>
                    <div className='w-1/2'>
                      <strong className='text-lg'>
                        {rec.Title?.Title || rec.title}
                      </strong>{' '}
                      <span className='text-gray-500'>({rec.year})</span>
                      <div className='mt-2 text-base'>{rec.reason}</div>
                    </div>
                  </div>
                ))
              ) : (
                <ReactMarkdown>{entry.message.parts[0].text}</ReactMarkdown>
              )}
            </div>
          )
        })}
      </div>
      {loading && <div className='text-accent mt-4'>Loading...</div>}
      {error && <div className='text-error mt-4'>{error}</div>}
      <form
        className='bg-base-100 border-base-300 fixed right-0 bottom-15 left-0 mx-auto flex w-full items-center gap-2 border-t p-4'
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
        <button
          className='btn btn-accent rounded'
          type='submit'
          disabled={loading}
        >
          <PaperAirplaneIcon className='h-5 w-5' />
        </button>
      </form>
    </div>
  )
}
