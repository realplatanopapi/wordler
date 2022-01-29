import { WordleGuessResult, WordleResult } from "@prisma/client";
import { getById } from "@server/lib/accounts";
import { GraphQLEnumType, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLString, Kind, ValueNode } from "graphql";

export const DateType = new GraphQLScalarType<Date, string>({
  name: 'Date',
  serialize(value: any) {
    return value.toISOString()
  },
  parseValue(value) {
    return new Date(value as string);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value)
    }
    return new Date()
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

export const WordleResultType = new GraphQLObjectType<any, WordleResult>({
  name: 'WordleResult',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    createdAt: {
      type: new GraphQLNonNull(DateType)
    },
    guesses: {
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
      resolve: async (_source, _args, result) => {
        return await getById(result.userId)
      }
    }
  }
})

