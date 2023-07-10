import dayjs, { Dayjs } from 'dayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { Typography } from '@mui/material'
import { useState } from 'react'

const DashboardPage = () => {
  const [date, setDate] = useState<Dayjs | null>(dayjs())
  return (
    <>
      <Typography variant="h1">Dashboard</Typography>
      <DateCalendar
        value={date}
        onChange={newDate => setDate(newDate)}
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
