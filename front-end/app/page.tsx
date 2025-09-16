import CheckAuth from './components/CheckAuth'

export default function Home() {
  return (
    <CheckAuth>
      {userId => (
        <>
          <div>Home</div>
          <button className='btn btn-accent'>test</button>
        </>
      )}
    </CheckAuth>
  )
}
