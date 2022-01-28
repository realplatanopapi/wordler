import { PropsWithChildren } from "react";
import { Container } from "theme-ui";

const Page: React.FC<PropsWithChildren<{}>> = ({children}) => {
  return (
    <Container>
      {children}
    </Container>
  )
}

export default Page

