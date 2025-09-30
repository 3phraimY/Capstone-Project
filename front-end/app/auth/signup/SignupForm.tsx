'use client'
import { useState } from 'react'
import { useDatabaseAuth } from '@/app/hooks/databaseAuthClient'
import { useRouter } from 'next/navigation'

export default function SignupForm() {
  const { signUp, loading, error } = useDatabaseAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [Username, setUsername] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    const result = await signUp(email, password, Username)
    if (result && !result.error) {
      setSuccess(true)
      window.location.href = '/'
    }
  }

  return (
    <div className='relative'>
      {loading && (
        <div className='pointer-events-none fixed inset-0 z-50 flex items-center justify-center'>
          <span className='loading loading-spinner text-info h-16 w-16 drop-shadow-lg'></span>
        </div>
      )}

      <form className='mx-auto max-w-sm space-y-4' onSubmit={handleSubmit}>
        <div>
          <label className='mb-1 block font-semibold'>User Name</label>
          <input
            className='input input-bordered w-full'
            type='text'
            value={Username}
            onChange={e => setUsername(e.target.value)}
            required
            autoComplete='name'
          />
        </div>
        <div>
          <label className='mb-1 block font-semibold'>Email</label>
          <input
            className='input input-bordered w-full'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete='email'
          />
        </div>
        <div>
          <label className='mb-1 block font-semibold'>Password</label>
          <input
            className='input input-bordered w-full'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete='new-password'
          />
        </div>
        <button
          className='btn btn-accent flex w-full items-center justify-center'
          type='submit'
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        {error && <div className='text-error'>{error}</div>}
        {success && <div className='text-success'>Signup successful!</div>}
      </form>
    </div>
  )
}
