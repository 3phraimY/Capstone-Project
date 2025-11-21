'use client'
import { useState } from 'react'
import { useDatabaseAuth } from '@/app/hooks/databaseAuthClient'

export default function LoginForm() {
  const { login, loading, error } = useDatabaseAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    const result = await login(email, password)
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
            autoComplete='current-password'
          />
        </div>
        <button
          className='btn btn-accent flex w-full items-center justify-center'
          type='submit'
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <div className='text-error'>{error}</div>}
        {success && <div className='text-success'>Login successful!</div>}
      </form>
      <div className='mt-8 flex justify-center'>
        Don&apos;t have an account?{' '}
      </div>
      <button
        className='btn btn-soft flex w-full items-center justify-center border'
        onClick={() => (window.location.href = '/auth/signup')}
      >
        Signup
      </button>
    </div>
  )
}
