import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from 'react-router-dom'
import RootLayout from './components/layout/root-layout'
import DashboardPage from './pages/dashboard-page'
import EditItemPage from './pages/edit-item-page'
import NewItemPage from './pages/new-item-page'
import FoodItemsPage from './pages/list-items-page'
import FoodItemsLayout from './components/layout/food-items-layout'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="/food-items" element={<FoodItemsLayout />}>
        <Route index element={<FoodItemsPage />} />
        <Route path="/food-items/new" element={<NewItemPage />} />
        <Route path="/food-items/edit" element={<EditItemPage />} />
      </Route>
    </Route>
  )
)

function App() {
  return <RouterProvider router={router} />
}

export default App
