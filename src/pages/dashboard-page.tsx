import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton'
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay'
import { Typography, Badge } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFilledDates } from '../api/useFilledDates'

dayjs.extend(utc)

const DashboardPage = () => {
  const navigate = useNavigate()
  const initialDate = dayjs()
  const [date, setDate] = useState<Dayjs>(initialDate)
  const [queryDate, setQueryDate] = useState<Dayjs>(initialDate)
  const {filledDates, isLoading, isError} = useFilledDates(queryDate)
  const highlightedDays = filledDates?.map(date => date.get('date'))

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

  const handleMonthChange = (date: Dayjs) => {
    setQueryDate(date)
  }

  const handleDateChange = (newDate: Dayjs) => {
    const isoDate = dayjs
      .utc(newDate)
      .startOf('day')
      .format('YYYY-MM-DD')
    const filledISODates = filledDates?.map(date => date.format('YYYY-MM-DD'))
    const pageType: ('new' | 'edit') = filledISODates?.includes(isoDate) ? 'edit' : 'new'
    setDate(date)
    navigate(`/dates/${pageType}/${isoDate}`)
  }

  return (
    <>
      <Typography variant="h1">Dashboard</Typography>

      {isError ?
      <p>Something went wrong :-/</p> :
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
      />}
    </>
  )
}

export default DashboardPage
