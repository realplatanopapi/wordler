import { Flex } from 'theme-ui'
import Link from '@client/components/link'
import { addDays, subDays, format, startOfWeek } from 'date-fns'
import { useRouter } from 'next/router'
import { formatInTimeZone } from 'date-fns-tz'

interface Props {
  selectedDate: Date
}

const DateLink: React.FC<{
  date: Date
  prefix?: string
  suffix?: string
}> = ({ date, prefix, suffix }) => {
  const router = useRouter()
  const link = `${date.getUTCFullYear()}-${format(
    date,
    'MM'
  )}-${date.getUTCDate()}`
  const display = formatInTimeZone(date, 'UTC', 'MMM dd')

  const href = {
    pathname: router.pathname,
    query: {
      ...router.query,
      weekOf: link,
    },
  }

  return (
    <Link href={href}>
      {prefix}Week of {display}
      {suffix}
    </Link>
  )
}

const WeekPicker: React.FC<Props> = ({ selectedDate }) => {
  const startOfThisWeek = startOfWeek(new Date())
  const nextDate =
    selectedDate < startOfThisWeek ? addDays(selectedDate, 7) : null
  const previousDate = subDays(selectedDate, 7)

  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
      }}
    >
      <DateLink date={previousDate} prefix="<< " />
      {nextDate ? (
        <>
          <DateLink date={nextDate} suffix=" >>" />
        </>
      ) : (
        <div></div>
      )}
    </Flex>
  )
}

export default WeekPicker
