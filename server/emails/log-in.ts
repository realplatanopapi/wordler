interface Email {
  html: string
  text: string,
  subject: string
}

export function buildLoginEmail({ loginUrl }: { loginUrl: string }): Email {
  const html = `
  <html>
    <body>
      <h1>Log in to your Wordler account</h1>
      <p>
        <a href="${loginUrl}">Click here to log in to your Wordler account</a>
      </p>
      <p>
        If the above link isn't working, copy and paste this url into your browser:
      </p>
      <p>
        ${loginUrl}
      </p>
    </body>
  </html>
`

  const text = `Copy and paste this url into your browser: ${loginUrl}`

  return {
    html,
    text,
    subject: 'Log in to your Wordler account',
  }
}
