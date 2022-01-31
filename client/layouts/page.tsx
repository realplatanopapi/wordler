import React, { PropsWithChildren } from 'react'
import { Box, Container, Heading, ThemeUIStyleObject } from 'theme-ui'

export type SectionProps = PropsWithChildren<{
  heading?: string
  headingAs?: 'h1' | 'h2' | 'h3' | 'h4'
  sx?: ThemeUIStyleObject
}>

export const Section: React.FC<SectionProps> = ({
  heading,
  headingAs = 'h3',
  children,
  sx,
}) => {
  return (
    <Box
      as="section"
      sx={{
        mb: 5,
        ...sx,
      }}
    >
      {heading && (
        <Heading as={headingAs} mb={3}>
          {heading}
        </Heading>
      )}
      {children}
    </Box>
  )
}

export type PageProps = PropsWithChildren<{
  header?: React.ReactNode
}>

const Page: React.FC<PageProps> = ({ children, header }) => {
  return (
    <Container>
      {header}
      {children}
    </Container>
  )
}

export default Page
