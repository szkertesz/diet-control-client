import dayjs, { Dayjs } from 'dayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay'
import { Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DashboardPage = () => {
  const [date, setDate] = useState<Dayjs | null>(dayjs())
  const navigate = useNavigate()

  function handleDateChange(newDate: Dayjs | null) {
    const isoDate = newDate?.toISOString().substring(0, 10)
    setDate(newDate)
    navigate(`/dates/new/${isoDate}`)
  }

  return (
    <>
      <Typography variant="h1">Dashboard</Typography>
      <DateCalendar
        value={date}
        onChange={newDate => handleDateChange(newDate)}
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
