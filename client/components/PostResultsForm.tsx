import { usePostResultsMutation, WordleResultFragment } from "@client/__gql__/api"

interface Props {
  onSubmit: (result: WordleResultFragment) => any
}

const PostResultsForm: React.FC<Props> = ({onSubmit}) => {
  const [postResultsMutation] = usePostResultsMutation()

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        const form = event.target as HTMLFormElement
        const data = new FormData(form)
        const mutationResult = await postResultsMutation({
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
      <textarea
        name="results"
        placeholder="Paste results from Wordle here"
        required
        style={{
          height: 100,
          width: 300,
        }}
      ></textarea>
      <br />
      <button type="submit">Post</button>
    </form>
  )
}

export default PostResultsForm
