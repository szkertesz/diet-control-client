import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay'
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton'
import { Typography, Badge } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getData } from '../api/client'

dayjs.extend(utc)

const DashboardPage = () => {
  const navigate = useNavigate()
  const [date, setDate] = useState<Dayjs>(dayjs())
  const [isLoading, setIsLoading] = useState(false)
  const [filledDates, setFilledDates] = useState<Dayjs[] | null>(null)
  const initialDate = dayjs()
  const highlightedDays = filledDates?.map(date => date.get('date'))

  const getFilledDates = async (date: Dayjs) => {
    try {
      const datesWithData = await fetchFilledDates(date)
      const dates = datesWithData.map(date => dayjs.utc(date.date).startOf('day'))
      setFilledDates(dates)
      setIsLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchFilledDates = async (date: Dayjs) => {
    const isoDate = date.format('YYYY-MM-DD')
    const dates = await getData(`api/dates/filled/${isoDate}`)
    return dates
  }

  const EnhancedCalendarDay = (
    props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
  ) => {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props

    const isSelected =
      !props.outsideCurrentMonth &&
      highlightedDays.indexOf(props.day.date()) >= 0

    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={null}
        color="success"
        variant={isSelected ? 'dot' : 'standard'}
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      </Badge>
    )
  }

  const handleMonthChange = async (date: Dayjs) => {
    setIsLoading(true)
    setFilledDates(null)
    await getFilledDates(date)
  }

  const handleDateChange = (newDate: Dayjs) => {
    const date = dayjs.utc(newDate).startOf('day')
    const isoDate = date.format('YYYY-MM-DD')
    const filledDatesStrings = filledDates?.map(date => date.format('YYYY-MM-DD'))
    const pageType: ('new' | 'edit') = filledDatesStrings?.includes(isoDate) ? 'edit' : 'new'
    setDate(date)
    navigate(`/dates/${pageType}/${isoDate}`)
  }

  useEffect(() => {
    getFilledDates(initialDate)
  }, [])

  return (
    <>
      <Typography variant="h1">Dashboard</Typography>
      <DateCalendar
        value={date}
        onChange={newDate => handleDateChange(newDate as dayjs.Dayjs)}
        onMonthChange={handleMonthChange}
        loading={isLoading}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: EnhancedCalendarDay,
        }}
        slotProps={{
          day: {
            highlightedDays,
          } as any,
        }}
        displayWeekNumber
        sx={{
          '& button': {
            lineHeight: 1,
          },
        }}
      />
    </>
  )
}

export default DashboardPage
