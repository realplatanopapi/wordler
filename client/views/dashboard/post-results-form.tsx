import ErrorCodeMessage from "@client/components/error-code-message"
import { getGraphqlErrorCode } from "@client/utils"
import { usePostResultsMutation, WordleResultFragment } from "@client/__gql__/api"
import { Button, Textarea } from "theme-ui"

interface Props {
  onSubmit: (result: WordleResultFragment) => any
}

const PostResultsForm: React.FC<Props> = ({onSubmit}) => {
  const [postResults, postResultsResult] = usePostResultsMutation()

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        const form = event.target as HTMLFormElement
        const data = new FormData(form)
        const mutationResult = await postResults({
          variables: {
            results: data.get("results") as string
          }
        })
        const wordleResult = mutationResult.data?.postResults
        if (wordleResult) {
          onSubmit(wordleResult)
          form.reset()
        }
      }}
    >
      <ErrorCodeMessage code={getGraphqlErrorCode(postResultsResult.error)} />
      <Textarea
        name="results"
        placeholder="Paste results from Wordle here"
        required
        style={{
          height: 200,
          width: 300,
        }}
      ></Textarea>
      <br />
      <Button type="submit">Post</Button>
    </form>
  )
}

export default PostResultsForm
