import { Typography } from '@mui/material'
import { FunctionComponent } from 'react'
import FoodItemsDataGrid from '../components/food-items-data-grid'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FoodItemsPageProps {}

const FoodItemsPage: FunctionComponent<FoodItemsPageProps> = () => {
  return (
    <>
      <Typography variant="h1">Food items</Typography>
      <FoodItemsDataGrid />
    </>
  )
}

export default FoodItemsPage
