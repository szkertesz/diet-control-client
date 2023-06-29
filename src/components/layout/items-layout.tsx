import { Outlet } from 'react-router-dom'

const ItemsLayout = () => {
  return (
    <section>
      <h2>Items layout</h2>
      <Outlet />
    </section>
  )
}

export default ItemsLayout
