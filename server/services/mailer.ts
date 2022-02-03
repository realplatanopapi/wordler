import config from '@server/config'
import nodemailer from 'nodemailer'

const mailer = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 465,
  secure: true, // use TLS
  auth: {
    user: 'apikey',
    pass: config.get('sendgridApiKey')
  },
})

export default mailer
