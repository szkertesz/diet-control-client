import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from 'react-router-dom'
import RootLayout from './components/layout/root-layout'
import DashboardPage from './pages/dashboard-page'
import FoodItemsPage from './pages/food-items-page'
import FoodItemsLayout from './components/layout/food-items-layout'
import EditDatePage from './pages/edit-date-page'
import NewDatePage from './pages/new-date-page'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="dates/:date" element={<EditDatePage />} />
      <Route path="dates/new/:date" element={<NewDatePage />} />
      <Route path="dates/edit/:date" element={<EditDatePage />} />
      <Route path="/food-items" element={<FoodItemsLayout />}>
        <Route index element={<FoodItemsPage />} />
      </Route>
    </Route>
  )
)

function App() {
  return <RouterProvider router={router} />
}

export default App
