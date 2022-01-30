import {Box, Flex} from 'theme-ui'
import Link from '@client/components/Link'
import { DateUTC, getStartOfWeek, getToday } from '@common/utils/time'
import { addDays, subDays, format } from 'date-fns'
import { useRouter } from 'next/router'
import startOfDay from 'date-fns/startOfDay'

interface Props {
  selectedDate: DateUTC
}

const formatDateForDisplay = (date: DateUTC) => {
  return `${format(date, 'MMM')} ${date.getUTCDate()}`
}

const DateLink: React.FC<{date: DateUTC, prefix?: string, suffix?: string}> = ({date, prefix, suffix}) => {
  const router = useRouter()
  const link = `${date.getUTCFullYear()}-${format(date, 'MM')}-${date.getUTCDate()}`
  const display = formatDateForDisplay(date)

  const href = {
    pathname: router.pathname,
    query: {
      ...router.query,
      date: link
    }
  }

  return (
    <Link href={href}>{prefix}Week of {display}{suffix}</Link>
  )
}

const DatePicker: React.FC<Props> = ({
  selectedDate
}) => {
  const startOfThisWeek = getStartOfWeek(getToday())
  const nextDate = selectedDate < startOfThisWeek ? addDays(selectedDate, 7) : null
  const previousDate = subDays(selectedDate, 7)

  return (
    <Flex sx={{
      flexDirection: 'column'
    }}>
      <DateLink date={previousDate} prefix="<< " />
      <Box my={2}>
        {
          selectedDate == startOfThisWeek ? `This week` : (
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