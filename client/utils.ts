import { ApolloError } from "@apollo/client";

export async function copyToClipboard(text: string) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
}

export function getGraphqlErrorCode(error?: ApolloError): string | null {
  if (!error) {
    return null
  }

  const errorsWithCodes = error.graphQLErrors.filter(error => {
    return typeof error.extensions.code === 'string'
  })

  if (!errorsWithCodes.length) {
    return null
  }

  return errorsWithCodes[0].extensions.code as string
}

export const ERROR_CODE_MESSAGES: {
  [code: string]: string
} = Object.freeze({
  NAME_ALREADY_TAKEN: 'Name already taken.'
})
