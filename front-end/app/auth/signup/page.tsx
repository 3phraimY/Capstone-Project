import SignupForm from './SignupForm'

export default function SignupPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <h1 className='mb-6 text-2xl font-bold'>Sign Up</h1>
      <SignupForm />
    </div>
  )
}
