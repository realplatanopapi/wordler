import { Leaderboard } from "@client/api"
import { Box, Flex, Grid, Text } from "theme-ui"

interface Props {
  leaderboard: Leaderboard
}

const Leaderboard: React.FC<Props> = ({leaderboard}) => {
  const {entries} = leaderboard

  return (
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
          
          return (
            <Grid key={user.id} columns={2}>
              <Text>
                {
                  index === 0 && (
                    '👑 '
                  )
                }
                {user.displayName}
              </Text>
              <Text>
                {score}
              </Text>
            </Grid>
          )
        })
      }
    </Grid>
  )
}

export default Leaderboard
