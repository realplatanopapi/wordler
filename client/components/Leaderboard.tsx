import { Leaderboard, User } from "@client/api"
import { Box, Grid, Text } from "theme-ui"

interface Props {
  currentUser: User
  leaderboard: Leaderboard
}

const Leaderboard: React.FC<Props> = ({currentUser, leaderboard}) => {
  const {entries} = leaderboard
  const firstEntry = entries[0] || null
  const isCurrentUserLeading = firstEntry.user.id === currentUser.id

  return (
    <Box>
      <Box mb={4}>
        {
          isCurrentUserLeading && (
            <Text>Your rivals tremble in the splendor of your mastery of the English language.</Text>
          )
        }
      </Box>
      <Grid>
        <Grid columns={2} sx={{
          borderBottomColor: 'muted',
          borderBottomStyle: 'solid',
          borderBottomWidth: 1
        }}>
          <Text>user</Text>
          <Text>score</Text>
        </Grid>
        {
          entries.map((entry, index) => {
            const {score, user} = entry
            const isFirstEntry = index === 0
            const fontWeight = isFirstEntry ? 'bold' : 'normal'
            
            return (
              <Grid key={user.id} columns={2} sx={{
                fontWeight
              }}>
                <Text>
                  {
                    isFirstEntry && (
                      '👑 '
                    )
                  }
                  {user.displayName} {
                    user.id === currentUser.id && (
                      <>(you)</>
                    )
                  }
                </Text>
                <Text>
                  {score}
                </Text>
              </Grid>
            )
          })
        }
      </Grid>
    </Box>
  )
}

export default Leaderboard
