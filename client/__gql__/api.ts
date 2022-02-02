import * as Types from '../api.d'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type GroupFragment = {
  __typename?: 'Group'
  id: string
  name: string
  inviteLink?: string | null | undefined
}

export type UserFragment = {
  __typename?: 'User'
  id: string
  displayName: string
}

export type WordleResultFragment = {
  __typename?: 'WordleResult'
  id: string
  createdAt: any
  guesses: Array<Array<Types.WordleGuessResult>>
  attemptsUsed: number
  maxAttempts: number
  score: number
  user: { __typename?: 'User'; id: string; displayName: string }
}

export type ResultsQueryVariables = Types.Exact<{
  weekOf: Types.Scalars['Date']
  groupId?: Types.InputMaybe<Types.Scalars['ID']>
  timezoneOffset: Types.Scalars['Int']
}>

export type ResultsQuery = {
  __typename?: 'Query'
  results: Array<{
    __typename?: 'WordleResult'
    id: string
    createdAt: any
    guesses: Array<Array<Types.WordleGuessResult>>
    attemptsUsed: number
    maxAttempts: number
    score: number
    user: { __typename?: 'User'; id: string; displayName: string }
  }>
}

export type PostResultsMutationVariables = Types.Exact<{
  results: Types.Scalars['String']
}>

export type PostResultsMutation = {
  __typename?: 'Mutation'
  postResults?:
    | {
        __typename?: 'WordleResult'
        id: string
        createdAt: any
        guesses: Array<Array<Types.WordleGuessResult>>
        attemptsUsed: number
        maxAttempts: number
        score: number
        user: { __typename?: 'User'; id: string; displayName: string }
      }
    | null
    | undefined
}

export type CanPostResultsQueryVariables = Types.Exact<{
  timezoneOffset: Types.Scalars['Int']
}>

export type CanPostResultsQuery = {
  __typename?: 'Query'
  canPostResults: boolean
}

export type GroupsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GroupsQuery = {
  __typename?: 'Query'
  groups?:
    | Array<{
        __typename?: 'Group'
        id: string
        name: string
        inviteLink?: string | null | undefined
      }>
    | null
    | undefined
}

export type GroupWithInviteCodeQueryVariables = Types.Exact<{
  inviteCode: Types.Scalars['String']
}>

export type GroupWithInviteCodeQuery = {
  __typename?: 'Query'
  groupWithInviteCode?:
    | {
        __typename?: 'Group'
        id: string
        name: string
        inviteLink?: string | null | undefined
      }
    | null
    | undefined
}

export type LeaderboardQueryVariables = Types.Exact<{
  weekOf: Types.Scalars['Date']
  timezoneOffset: Types.Scalars['Int']
}>

export type LeaderboardQuery = {
  __typename?: 'Query'
  leaderboard: {
    __typename?: 'Leaderboard'
    entries: Array<{
      __typename?: 'LeaderboardEntry'
      score: number
      user: { __typename?: 'User'; id: string; displayName: string }
    }>
  }
}

export type StartGroupMutationVariables = Types.Exact<{
  name: Types.Scalars['String']
}>

export type StartGroupMutation = {
  __typename?: 'Mutation'
  startGroup?:
    | {
        __typename?: 'Group'
        id: string
        name: string
        inviteLink?: string | null | undefined
      }
    | null
    | undefined
}

export type JoinGroupMutationVariables = Types.Exact<{
  inviteCode: Types.Scalars['String']
}>

export type JoinGroupMutation = {
  __typename?: 'Mutation'
  joinGroup?:
    | {
        __typename?: 'Group'
        id: string
        name: string
        inviteLink?: string | null | undefined
      }
    | null
    | undefined
}

export const GroupFragmentDoc = gql`
  fragment Group on Group {
    id
    name
    inviteLink
  }
`
export const UserFragmentDoc = gql`
  fragment User on User {
    id
    displayName
  }
`
export const WordleResultFragmentDoc = gql`
  fragment WordleResult on WordleResult {
    id
    createdAt
    user {
      ...User
    }
    guesses
    attemptsUsed
    maxAttempts
    score
  }
  ${UserFragmentDoc}
`
export const ResultsDocument = gql`
  query results($weekOf: Date!, $groupId: ID, $timezoneOffset: Int!) {
    results(
      weekOf: $weekOf
      groupId: $groupId
      timezoneOffset: $timezoneOffset
    ) {
      ...WordleResult
    }
  }
  ${WordleResultFragmentDoc}
`

/**
 * __useResultsQuery__
 *
 * To run a query within a React component, call `useResultsQuery` and pass it any options that fit your needs.
 * When your component renders, `useResultsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResultsQuery({
 *   variables: {
 *      weekOf: // value for 'weekOf'
 *      groupId: // value for 'groupId'
 *      timezoneOffset: // value for 'timezoneOffset'
 *   },
 * });
 */
export function useResultsQuery(
  baseOptions: Apollo.QueryHookOptions<ResultsQuery, ResultsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ResultsQuery, ResultsQueryVariables>(
    ResultsDocument,
    options
  )
}
export function useResultsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ResultsQuery, ResultsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ResultsQuery, ResultsQueryVariables>(
    ResultsDocument,
    options
  )
}
export type ResultsQueryHookResult = ReturnType<typeof useResultsQuery>
export type ResultsLazyQueryHookResult = ReturnType<typeof useResultsLazyQuery>
export type ResultsQueryResult = Apollo.QueryResult<
  ResultsQuery,
  ResultsQueryVariables
>
export const PostResultsDocument = gql`
  mutation postResults($results: String!) {
    postResults(results: $results) {
      ...WordleResult
    }
  }
  ${WordleResultFragmentDoc}
`
export type PostResultsMutationFn = Apollo.MutationFunction<
  PostResultsMutation,
  PostResultsMutationVariables
>

/**
 * __usePostResultsMutation__
 *
 * To run a mutation, you first call `usePostResultsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostResultsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postResultsMutation, { data, loading, error }] = usePostResultsMutation({
 *   variables: {
 *      results: // value for 'results'
 *   },
 * });
 */
export function usePostResultsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PostResultsMutation,
    PostResultsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<PostResultsMutation, PostResultsMutationVariables>(
    PostResultsDocument,
    options
  )
}
export type PostResultsMutationHookResult = ReturnType<
  typeof usePostResultsMutation
>
export type PostResultsMutationResult =
  Apollo.MutationResult<PostResultsMutation>
export type PostResultsMutationOptions = Apollo.BaseMutationOptions<
  PostResultsMutation,
  PostResultsMutationVariables
>
export const CanPostResultsDocument = gql`
  query canPostResults($timezoneOffset: Int!) {
    canPostResults(timezoneOffset: $timezoneOffset)
  }
`

/**
 * __useCanPostResultsQuery__
 *
 * To run a query within a React component, call `useCanPostResultsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCanPostResultsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCanPostResultsQuery({
 *   variables: {
 *      timezoneOffset: // value for 'timezoneOffset'
 *   },
 * });
 */
export function useCanPostResultsQuery(
  baseOptions: Apollo.QueryHookOptions<
    CanPostResultsQuery,
    CanPostResultsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<CanPostResultsQuery, CanPostResultsQueryVariables>(
    CanPostResultsDocument,
    options
  )
}
export function useCanPostResultsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CanPostResultsQuery,
    CanPostResultsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<CanPostResultsQuery, CanPostResultsQueryVariables>(
    CanPostResultsDocument,
    options
  )
}
export type CanPostResultsQueryHookResult = ReturnType<
  typeof useCanPostResultsQuery
>
export type CanPostResultsLazyQueryHookResult = ReturnType<
  typeof useCanPostResultsLazyQuery
>
export type CanPostResultsQueryResult = Apollo.QueryResult<
  CanPostResultsQuery,
  CanPostResultsQueryVariables
>
export const GroupsDocument = gql`
  query groups {
    groups {
      ...Group
    }
  }
  ${GroupFragmentDoc}
`

/**
 * __useGroupsQuery__
 *
 * To run a query within a React component, call `useGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGroupsQuery(
  baseOptions?: Apollo.QueryHookOptions<GroupsQuery, GroupsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GroupsQuery, GroupsQueryVariables>(
    GroupsDocument,
    options
  )
}
export function useGroupsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GroupsQuery, GroupsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GroupsQuery, GroupsQueryVariables>(
    GroupsDocument,
    options
  )
}
export type GroupsQueryHookResult = ReturnType<typeof useGroupsQuery>
export type GroupsLazyQueryHookResult = ReturnType<typeof useGroupsLazyQuery>
export type GroupsQueryResult = Apollo.QueryResult<
  GroupsQuery,
  GroupsQueryVariables
>
export const GroupWithInviteCodeDocument = gql`
  query groupWithInviteCode($inviteCode: String!) {
    groupWithInviteCode(inviteCode: $inviteCode) {
      ...Group
    }
  }
  ${GroupFragmentDoc}
`

/**
 * __useGroupWithInviteCodeQuery__
 *
 * To run a query within a React component, call `useGroupWithInviteCodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGroupWithInviteCodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGroupWithInviteCodeQuery({
 *   variables: {
 *      inviteCode: // value for 'inviteCode'
 *   },
 * });
 */
export function useGroupWithInviteCodeQuery(
  baseOptions: Apollo.QueryHookOptions<
    GroupWithInviteCodeQuery,
    GroupWithInviteCodeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    GroupWithInviteCodeQuery,
    GroupWithInviteCodeQueryVariables
  >(GroupWithInviteCodeDocument, options)
}
export function useGroupWithInviteCodeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GroupWithInviteCodeQuery,
    GroupWithInviteCodeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    GroupWithInviteCodeQuery,
    GroupWithInviteCodeQueryVariables
  >(GroupWithInviteCodeDocument, options)
}
export type GroupWithInviteCodeQueryHookResult = ReturnType<
  typeof useGroupWithInviteCodeQuery
>
export type GroupWithInviteCodeLazyQueryHookResult = ReturnType<
  typeof useGroupWithInviteCodeLazyQuery
>
export type GroupWithInviteCodeQueryResult = Apollo.QueryResult<
  GroupWithInviteCodeQuery,
  GroupWithInviteCodeQueryVariables
>
export const LeaderboardDocument = gql`
  query leaderboard($weekOf: Date!, $timezoneOffset: Int!) {
    leaderboard(weekOf: $weekOf, timezoneOffset: $timezoneOffset) {
      entries {
        user {
          ...User
        }
        score
      }
    }
  }
  ${UserFragmentDoc}
`

/**
 * __useLeaderboardQuery__
 *
 * To run a query within a React component, call `useLeaderboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useLeaderboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLeaderboardQuery({
 *   variables: {
 *      weekOf: // value for 'weekOf'
 *      timezoneOffset: // value for 'timezoneOffset'
 *   },
 * });
 */
export function useLeaderboardQuery(
  baseOptions: Apollo.QueryHookOptions<
    LeaderboardQuery,
    LeaderboardQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<LeaderboardQuery, LeaderboardQueryVariables>(
    LeaderboardDocument,
    options
  )
}
export function useLeaderboardLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LeaderboardQuery,
    LeaderboardQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<LeaderboardQuery, LeaderboardQueryVariables>(
    LeaderboardDocument,
    options
  )
}
export type LeaderboardQueryHookResult = ReturnType<typeof useLeaderboardQuery>
export type LeaderboardLazyQueryHookResult = ReturnType<
  typeof useLeaderboardLazyQuery
>
export type LeaderboardQueryResult = Apollo.QueryResult<
  LeaderboardQuery,
  LeaderboardQueryVariables
>
export const StartGroupDocument = gql`
  mutation startGroup($name: String!) {
    startGroup(name: $name) {
      ...Group
    }
  }
  ${GroupFragmentDoc}
`
export type StartGroupMutationFn = Apollo.MutationFunction<
  StartGroupMutation,
  StartGroupMutationVariables
>

/**
 * __useStartGroupMutation__
 *
 * To run a mutation, you first call `useStartGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startGroupMutation, { data, loading, error }] = useStartGroupMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useStartGroupMutation(
  baseOptions?: Apollo.MutationHookOptions<
    StartGroupMutation,
    StartGroupMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<StartGroupMutation, StartGroupMutationVariables>(
    StartGroupDocument,
    options
  )
}
export type StartGroupMutationHookResult = ReturnType<
  typeof useStartGroupMutation
>
export type StartGroupMutationResult = Apollo.MutationResult<StartGroupMutation>
export type StartGroupMutationOptions = Apollo.BaseMutationOptions<
  StartGroupMutation,
  StartGroupMutationVariables
>
export const JoinGroupDocument = gql`
  mutation joinGroup($inviteCode: String!) {
    joinGroup(inviteCode: $inviteCode) {
      ...Group
    }
  }
  ${GroupFragmentDoc}
`
export type JoinGroupMutationFn = Apollo.MutationFunction<
  JoinGroupMutation,
  JoinGroupMutationVariables
>

/**
 * __useJoinGroupMutation__
 *
 * To run a mutation, you first call `useJoinGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinGroupMutation, { data, loading, error }] = useJoinGroupMutation({
 *   variables: {
 *      inviteCode: // value for 'inviteCode'
 *   },
 * });
 */
export function useJoinGroupMutation(
  baseOptions?: Apollo.MutationHookOptions<
    JoinGroupMutation,
    JoinGroupMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<JoinGroupMutation, JoinGroupMutationVariables>(
    JoinGroupDocument,
    options
  )
}
export type JoinGroupMutationHookResult = ReturnType<
  typeof useJoinGroupMutation
>
export type JoinGroupMutationResult = Apollo.MutationResult<JoinGroupMutation>
export type JoinGroupMutationOptions = Apollo.BaseMutationOptions<
  JoinGroupMutation,
  JoinGroupMutationVariables
>
