export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: any
}

export type Group = {
  __typename?: 'Group'
  id: Scalars['ID']
  inviteLink?: Maybe<Scalars['String']>
  name: Scalars['String']
}

export type Leaderboard = {
  __typename?: 'Leaderboard'
  entries: Array<LeaderboardEntry>
}

export type LeaderboardEntry = {
  __typename?: 'LeaderboardEntry'
  score: Scalars['Int']
  user: User
}

export type Mutation = {
  __typename?: 'Mutation'
  joinGroup?: Maybe<Group>
  postResults?: Maybe<WordleResult>
  startGroup?: Maybe<Group>
}

export type MutationJoinGroupArgs = {
  inviteCode: Scalars['String']
}

export type MutationPostResultsArgs = {
  results: Scalars['String']
}

export type MutationStartGroupArgs = {
  name: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  canPostResults: Scalars['Boolean']
  groupWithInviteCode?: Maybe<Group>
  groups?: Maybe<Array<Group>>
  leaderboard: Leaderboard
  results: Array<WordleResult>
  whoami?: Maybe<User>
}

export type QueryCanPostResultsArgs = {
  timezoneOffset: Scalars['Int']
}

export type QueryGroupWithInviteCodeArgs = {
  inviteCode: Scalars['String']
}

export type QueryLeaderboardArgs = {
  timezoneOffset: Scalars['Int']
  weekOf: Scalars['Date']
}

export type QueryResultsArgs = {
  groupId?: InputMaybe<Scalars['ID']>
  timezoneOffset: Scalars['Int']
  weekOf: Scalars['Date']
}

export type User = {
  __typename?: 'User'
  displayName: Scalars['String']
  id: Scalars['ID']
}

export enum WordleGuessResult {
  ExactMatch = 'EXACT_MATCH',
  InWord = 'IN_WORD',
  NotInWord = 'NOT_IN_WORD',
}

export type WordleResult = {
  __typename?: 'WordleResult'
  attemptsUsed: Scalars['Int']
  createdAt: Scalars['Date']
  guesses: Array<Array<WordleGuessResult>>
  id: Scalars['ID']
  maxAttempts: Scalars['Int']
  score: Scalars['Int']
  user: User
}
