import StartGroupForm from "@client/components/StartGroupForm"
import { Heading } from "theme-ui"

interface Props {
  onCompleteOnboarding: () => any
}

const Onboarding: React.FC<Props> = ({onCompleteOnboarding}) => {
  return (
    <>
    <Heading as="h1" mb={4}>You&apos;re not a group yet.</Heading>
    <Heading as="h2" mb={3}>Start your own group</Heading>
    <StartGroupForm onSubmit={onCompleteOnboarding} />
  </>
  )
}

export default Onboarding