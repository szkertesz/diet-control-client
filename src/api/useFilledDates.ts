import dayjs, { Dayjs } from "dayjs"
import { getData } from "./client"
import useSWR from 'swr'

export const useFilledDates = (date: Dayjs) => {
    const isoDate = date.format('YYYY-MM-DD')
    const { data, error, isLoading } = useSWR(`api/dates/filled/${isoDate}`, getData)

    return {
      filledDates: data?.map(date => dayjs.utc(date.date).startOf('day')),
      isLoading,
      isError: error
    }
  }
