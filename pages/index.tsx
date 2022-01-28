import WordleResult from "@client/components/WordleResult";
import { getResultsForUser } from "@server/lib/wordles";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import type { NextPage } from "next";
import { getById } from "../server/lib/accounts";
import { cookieConfig } from "../server/lib/auth";
interface HomePageProps {
  user: any;
  wordleResults: any;
  [key: string]: any;
}

export const getServerSideProps = withIronSessionSsr<HomePageProps>(
  async ({ req }) => {
    const userId = req.session.userId;
    if (!userId) {
      return {
        props: {
          user: null,
          wordleResults: null,
        },
      };
    }

    const user = await getById(userId);
    if (!user) {
      return {
        props: {
          user: null,
          wordleResults: null,
        },
      };
    }

    return {
      props: {
        user: {
          displayName: user.displayName,
        },
        wordleResults: (await getResultsForUser(user)).map((result) => {
          return {
            id: result.id,
            attempts: result.attempts.map((attempt) => {
              return {
                guesses: attempt.guesses,
              };
            }),
          };
        }),
      },
    };
  },
  cookieConfig
);

const Home: NextPage<HomePageProps> = ({ user, wordleResults }) => {
  if (user) {
    return (
      <div>
        <p>Signed in as {user.displayName}</p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/api/auth/logout">Sign out</a>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.target as HTMLFormElement);
            axios.post("/api/results", {
              results: data.get("results"),
            });
          }}
        >
          <textarea name="results"></textarea>
          <button type="submit">Save</button>
        </form>
        {wordleResults.map((result: any) => {
          console.log({
            result,
          });
          return <WordleResult key={result.id} result={result} />;
        })}
      </div>
    );
  }

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/api/auth/twitter/authorize">Sign in with Twitter</a>
    </div>
  );
};

export default Home;
