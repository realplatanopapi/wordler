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

export type Query = {
  __typename?: 'Query'
  results: Array<WordleResult>
}

export type QueryResultsArgs = {
  date?: InputMaybe<Scalars['Date']>
  groupId?: InputMaybe<Scalars['String']>
}

export type User = {
  __typename?: 'User'
  displayName: Scalars['String']
  id: Scalars['ID']
}

export type WordleAttempt = {
  __typename?: 'WordleAttempt'
  guesses: Array<WordleGuessResult>
  id: Scalars['ID']
}

export enum WordleGuessResult {
  ExactMatch = 'EXACT_MATCH',
  InWord = 'IN_WORD',
  NotInWord = 'NOT_IN_WORD',
}

export type WordleResult = {
  __typename?: 'WordleResult'
  attempts: Array<WordleAttempt>
  createdAt: Scalars['Date']
  id: Scalars['ID']
  user: User
}
