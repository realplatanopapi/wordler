import * as Types from '../types.d'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type ResultsQueryVariables = Types.Exact<{
  date?: Types.InputMaybe<Types.Scalars['Date']>
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

export const ResultsDocument = gql`
  query results($date: Date) {
    results(date: $date) {
      id
      createdAt
      user {
        id
        displayName
      }
      guesses
    }
  }
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
