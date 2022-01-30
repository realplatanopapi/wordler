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
          <Heading as="h3" mb={3}>leaderboard</Heading>
          <Grid>
            <Grid columns={2} gap={2}>
              <Text>user</Text>
              <Text>points</Text>
            </Grid>
            {entries.map((entry, index) => {
              const { score, user } = entry
              const isFirstEntry = index === 0
              const fontWeight = isFirstEntry ? 'bold' : 'normal'

              return (
                <Grid
                  key={user.id}
                  columns={2}
                  gap={2}
                  sx={{
                    fontWeight,
                  }}
                >
                  <Text>
                    {isFirstEntry && '👑 '}
                    {user.displayName}{' '}
                    {currentUser && user.id === currentUser.id && <>(you)</>}
                  </Text>
                  <Text>{score}</Text>
                </Grid>
              )
            })}
          </Grid>
        </>
      )}
    </Box>
  )
}

export default Leaderboard
