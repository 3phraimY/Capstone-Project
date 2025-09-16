import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <h1 className='mb-6 text-2xl font-bold'>Login</h1>
      <LoginForm />
    </div>
  )
}
