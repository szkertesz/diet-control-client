// import dayjs, { Dayjs } from 'dayjs'
import { getData } from './client'
import useSWR from 'swr'

export const useFoodItems = () => {
  const { data, error, isLoading } = useSWR(`api/food/`, getData)

  return {
    foodItems: data,
    isLoading,
    isError: error,
  }
}
