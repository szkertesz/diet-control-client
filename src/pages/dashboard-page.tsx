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
  const [date, setDate] = useState<Dayjs>(dayjs())
  const [isLoading, setIsLoading] = useState(false)
  const [highlightedDays, setHighlightedDays] = useState<number[] | null>([
    1, 2, 28,
  ])
  const navigate = useNavigate()
  const initialDate = dayjs()

  const fetchHighlightedDays = async (date: Dayjs) => {
    try {
      const dates = await fetchFilledDates(date)
      const filledDates = dates?.map(date =>
        new Date(date.date).getDate()
      ) as number[]
      setHighlightedDays(filledDates)
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

  function EnhancedCalendarDay(
    props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
  ) {
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
    setHighlightedDays([])
    await fetchHighlightedDays(date)
  }

  const handleDateChange = (newDate: Dayjs) => {
    // const isoDate = newDate.utc().toISOString()
    const isoDate = dayjs.utc(newDate).format('YYYY-MM-DD')
    setDate(newDate)
    navigate(`/dates/new/${isoDate}`)
  }

  useEffect(() => {
    fetchHighlightedDays(initialDate)
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
