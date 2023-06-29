import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <>
      <header>
        <h1>RootLayout</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default RootLayout
