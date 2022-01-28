import { IronSessionData } from 'iron-session'

declare module 'iron-session' {
  interface IronSessionData {
    inviteCode?: string
    userId?: string
  }
}
