import { Leaderboard, User } from '@client/api'
import { Box, Grid, Heading, Text } from 'theme-ui'

interface Props {
  currentUser: Pick<User, 'id' | 'displayName'> | null
  leaderboard: Leaderboard
}

const Leaderboard: React.FC<Props> = ({ currentUser, leaderboard }) => {
  const { entries } = leaderboard
  const firstEntry = entries[0] || null
  const isCurrentUserLeading = currentUser
    ? firstEntry?.user.id === currentUser.id
    : false

  return (
    <Box>
      {entries.length === 0 ? (
        <Text>No results for this week.</Text>
      ) : (
        <>
          <Box mb={4}>
            {isCurrentUserLeading && (
              <Text sx={{
                fontSize: 4
              }}>
                Your rivals tremble in the splendor of your mastery of the
                English language.
              </Text>
            )}
          </Box>
          <Heading as="h3" mb={4}>leaders</Heading>
          <Box>
            <Grid gap={0} columns={2} mx={-4}>
              <Box py={2} px={4}>
              <Text sx={{
                fontSize: 1
              }}>user</Text>
              </Box>
              <Box py={2} px={4} sx={{
                borderLeft: '1px solid',
                borderColor: 'muted'
              }}>
              <Text sx={{
                fontSize: 1
              }}>points</Text>
              </Box>
            </Grid>
            {entries.map((entry, index) => {
              const { score, user } = entry
              const isFirstEntry = index === 0
              const fontWeight = isFirstEntry ? 'bold' : 'normal'

              return (
                <Grid
                  key={user.id}
                  columns={2}
                  gap={0}
                  mx={-4}
                  sx={{
                    fontWeight,
                  }}
                >
                  <Box py={3} px={4} sx={{
                    borderTop: "1px solid",
                    borderColor: 'muted'
                  }}>
                  <Text>
                    {isFirstEntry && '👑 '}
                    {user.displayName}{' '}
                    {currentUser && user.id === currentUser.id && <>(you)</>}
                  </Text>
                  </Box>
                  <Box py={3} px={4} sx={{
                    borderLeft: "1px solid",
                    borderTop: "1px solid",
                    borderColor: 'muted'
                  }}>
                  <Text>{score}</Text>
                  </Box>
                </Grid>
              )
            })}
          </Box>
        </>
      )}
    </Box>
  )
}

export default Leaderboard
