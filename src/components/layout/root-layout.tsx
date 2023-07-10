import { Outlet, NavLink } from 'react-router-dom'
import { Box, Link } from '@mui/material'

const RootLayout = () => {
  return (
    <>
      <header>
        <Box
          component={'nav'}
          sx={{
            typography: 'body1',
            '& > :not(:last-child)': {
              mr: 2,
            },
          }}
        >
          <Link to="/" component={NavLink}>
            Dashboard
          </Link>
          <Link to="/items" component={NavLink}>
            Foodbank
          </Link>
        </Box>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default RootLayout
