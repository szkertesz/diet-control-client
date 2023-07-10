import { Outlet, NavLink } from 'react-router-dom'
import { Box, Container, Link } from '@mui/material'

const RootLayout = () => {
  return (
    <>
      <header>
        <Container>
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
            <Link to="/food-items" component={NavLink}>
              Foodbank
            </Link>
          </Box>
        </Container>
      </header>
      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  )
}

export default RootLayout
