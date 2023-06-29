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
import ItemListPage from './pages/list-items-page'
import ItemsLayout from './components/layout/items-layout'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="/items" element={<ItemsLayout />}>
        <Route index element={<ItemListPage />} />
        <Route path="/items/new" element={<NewItemPage />} />
        <Route path="/items/edit" element={<EditItemPage />} />
      </Route>
    </Route>
  )
)

function App() {
  return <RouterProvider router={router} />
}

export default App
