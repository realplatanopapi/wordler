import * as Types from '../api.d'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type WordleResultFragment = {
  __typename?: 'WordleResult'
  id: string
  createdAt: any
  guesses: Array<Array<Types.WordleGuessResult>>
  user: { __typename?: 'User'; id: string; displayName: string }
}

export type ResultsQueryVariables = Types.Exact<{
  date?: Types.InputMaybe<Types.Scalars['Date']>
  groupId?: Types.InputMaybe<Types.Scalars['ID']>
}>

export type ResultsQuery = {
  __typename?: 'Query'
  results: Array<{
    __typename?: 'WordleResult'
    id: string
    createdAt: any
    guesses: Array<Array<Types.WordleGuessResult>>
    user: { __typename?: 'User'; id: string; displayName: string }
  }>
}

export type GroupsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GroupsQuery = {
  __typename?: 'Query'
  groups?:
    | Array<{ __typename?: 'Group'; id: string; name: string }>
    | null
    | undefined
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
        user: { __typename?: 'User'; id: string; displayName: string }
      }
    | null
    | undefined
}

export const WordleResultFragmentDoc = gql`
  fragment WordleResult on WordleResult {
    id
    createdAt
    user {
      id
      displayName
    }
    guesses
  }
`
export const ResultsDocument = gql`
  query results($date: Date, $groupId: ID) {
    results(date: $date, groupId: $groupId) {
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
 *      date: // value for 'date'
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useResultsQuery(
  baseOptions?: Apollo.QueryHookOptions<ResultsQuery, ResultsQueryVariables>
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
export const GroupsDocument = gql`
  query groups {
    groups {
      id
      name
    }
  }
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
