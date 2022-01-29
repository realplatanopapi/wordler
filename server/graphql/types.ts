import { WordleGuessResult, WordleResult } from "@prisma/client";
import { getById } from "@server/lib/accounts";
import { GraphQLEnumType, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLString, Kind, ValueNode } from "graphql";
import { GraphQLContext } from "./schema";

export const DateType = new GraphQLScalarType<Date | null, string>({
  name: 'Date',
  serialize(value: any) {
    return value.toISOString()
  },
  parseValue(value) {
    return value ? new Date(value as string) : null;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value)
    }
    return null
  },
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    displayName: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
})

export const GroupType = new GraphQLObjectType({
  name: 'Group',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
})

export const WordleGuessResultType = new GraphQLEnumType({
  name: 'WordleGuessResult',
  values: {
    EXACT_MATCH: {
      value: WordleGuessResult.EXACT_MATCH,
    },
    IN_WORD: {
      value: WordleGuessResult.IN_WORD,
    },
    NOT_IN_WORD: {
      value: WordleGuessResult.NOT_IN_WORD,
    }
  }
})

export const WordleAttemptType = new GraphQLObjectType({
  name: 'WordleAttempt',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    guesses: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLNonNull(
            WordleGuessResultType
          )
        )
      )
    }
  }
})

export const WordleResultType = new GraphQLObjectType<WordleResult, GraphQLContext>({
  name: 'WordleResult',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    createdAt: {
      type: new GraphQLNonNull(DateType)
    },
    attempts: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLNonNull(
            WordleAttemptType
          )
        )
      )
    },
    user: {
      type: new GraphQLNonNull(UserType),
      resolve: async (result) => {
        return await getById(result.userId)
      }
    }
  }
})

