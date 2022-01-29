import {Box, Flex} from 'theme-ui'
import Link from '@client/components/Link'
import { DateUTC, getToday } from '@common/utils/time'
import { addDays, subDays, format } from 'date-fns'

interface Props {
  selectedDate: DateUTC
}

const formatDateForDisplay = (date: DateUTC) => {
  return `${format(date, 'MMM')} ${date.getUTCDate()}`
}

const DateLink: React.FC<{date: DateUTC, prefix?: string, suffix?: string}> = ({date, prefix, suffix}) => {
  const link = `${date.getUTCFullYear()}-${format(date, 'MM')}-${date.getUTCDate()}`
  const display = formatDateForDisplay(date)

  return (
    <Link href={`?date=${link}`}>{prefix}{display}{suffix}</Link>
  )
}

const DatePicker: React.FC<Props> = ({
  selectedDate
}) => {
  const today = getToday()
  const nextDate = selectedDate < today ? addDays(selectedDate, 1) : null
  const previousDate = subDays(selectedDate, 1)

  return (
    <Flex sx={{
      flexDirection: 'column'
    }}>
      <DateLink date={previousDate} prefix="<< " />
      <Box my={2}>
        {
          selectedDate == today ? 'Today' : (
            formatDateForDisplay(selectedDate)
          )
        }
      </Box>
      {
        nextDate ? (
          <>
            <DateLink date={nextDate} suffix=' >>' />
          </>
        ) : (
          <div></div>
        )
      }
    </Flex>
  )
}

export default DatePicker