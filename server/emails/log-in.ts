interface Email {
  html: string
  subject: string
}

export function buildLoginEmail({
  loginUrl
}: {
  loginUrl: string
}): Email {
  const html = `
  <html>
    <body>
      <a href="${loginUrl}">Click here to log in to your Wordler account</a>
    </body>
  </html>
`

  return {
    html,
    subject: 'Log in to your Wordler account'
  }
}