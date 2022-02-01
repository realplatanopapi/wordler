import WordleResult from '@client/views/dashboard/wordle-result'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Box, Grid, Heading, Text } from 'theme-ui'
import WeekPicker from '@client/views/dashboard/week-picker'
import GroupPicker from '@client/views/dashboard/group-picker'
import {
  useCanPostResultsQuery,
  useGroupsQuery,
  useLeaderboardQuery,
  useResultsQuery,
} from '@client/__gql__/api'
import PostResultsForm from '@client/views/dashboard/post-results-form'
import Leaderboard from '@client/views/dashboard/leaderboard'
import { useMemo } from 'react'
import { Group, User } from '@client/api'
import { formatInTimeZone } from 'date-fns-tz'
import { Section } from '@client/layouts/page'
import Groups from '@client/views/dashboard/groups'
import Link from '@client/components/link'
import { startOfWeek } from 'date-fns'

interface Props {
  user: User
}

const Dashboard: React.FC<Props> = ({ user }) => {
  const router = useRouter()
  const groupId = router.query.groupId as string
  const weekOfStr = router.query.weekOf
  const now = new Date()
  const timezoneOffset = now.getTimezoneOffset()
  const weekOf = weekOfStr
    ? new Date(weekOfStr as string)
    : startOfWeek(now)
  const canPostResultsQuery = useCanPostResultsQuery({
    variables: {
      timezoneOffset,
    }
  })
  const resultsQueryVariables = {
    weekOf,
    groupId,
    timezoneOffset
  }
  const leaderboardQuery = useLeaderboardQuery({
    variables: {
      weekOf,
      timezoneOffset,
    },
  })
  const groupsQuery = useGroupsQuery()
  const resultsQuery = useResultsQuery({
    variables: resultsQueryVariables,
  })

  const canPostResults = canPostResultsQuery.data?.canPostResults === true
  const groups = groupsQuery.data?.groups
  const results = resultsQuery.data?.results
  const leaderboard = leaderboardQuery.data?.leaderboard

  const groupsById: {
    [id: string]: Group
  } | null = useMemo(() => {
    if (!groups) {
      return null
    }

    return groups.reduce((acc, group) => {
      return {
        ...acc,
        [group.id]: group,
      }
    }, {})
  }, [groups])
  const selectedGroup = groupId && groupsById ? groupsById[groupId] : null

  return (
    <>
      <Head>
        <title>Wordler</title>
      </Head>
      <Section sx={{
        mb: 4
      }}>
        <WeekPicker selectedDate={weekOf} />
      </Section>
      <Section
        headingAs="h3"
        heading={`Week of ${formatInTimeZone(weekOf, 'UTC', 'MMM dd')}`}
      >
        {canPostResults && (
          <Section headingAs="h3" heading="Post your results for today">
            <PostResultsForm
              onSubmit={() => {
                canPostResultsQuery.refetch()
                leaderboardQuery.refetch()
                resultsQuery.refetch()
              }}
            />
          </Section>
        )}
        {groups && groups.length > 1 && (
          <Box mb={4}>
            <GroupPicker
              selectedGroupId={groupId}
              groups={groups}
              onChange={(newGroupId) => {
                let newQuery = {
                  ...router.query,
                }
                if (!newGroupId) {
                  delete newQuery.groupId
                } else {
                  newQuery.groupId = newGroupId
                }

                router.replace({
                  query: newQuery,
                })
              }}
            />
          </Box>
        )}
        {selectedGroup && (
          <Heading as="h3" mb={3}>
            {selectedGroup.name}
          </Heading>
        )}
        {leaderboard && (
          <Leaderboard currentUser={user} leaderboard={leaderboard} />
        )}
      </Section>
      {results && results.length > 0 && (
        <Section heading="Submissions">
          <Grid columns={1} gap={2} mx={-4}>
            {results.map((result: any) => {
              return (
                <WordleResult
                  key={result.id}
                  currentUser={user}
                  result={result}
                />
              )
            })}
          </Grid>
        </Section>
      )}
      {user && groups && (
        <Section heading="Your groups">
          <Groups
            groups={groups}
            onStartGroup={() => {
              groupsQuery.refetch()
            }}
          />
        </Section>
      )}
      {user && (
        <Section>
          <Text as="p" mb={2}>
            Signed in as {user.displayName}
          </Text>
          <Text as="p">
            <Link isExternal href="/api/auth/log-out">
              Sign out
            </Link>
          </Text>
        </Section>
      )}
    </>
  )
}

export default Dashboard
