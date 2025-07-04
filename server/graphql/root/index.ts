import { gql } from 'apollo-server-express';

import {
  schema as accountsSchema,
  queries as accountsQueries,
  mutations as accountsMutations,
} from '../accounts';

import {
  schema as productsSchema,
  queries as productsQueries,
  mutations as productsMutations,
} from '../products';

const rootTypeDefs = gql`
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }
`;

export const typeDefs = [rootTypeDefs, accountsSchema, productsSchema];

export const resolvers: any = {
  Query: {
    ...accountsQueries,
    ...productsQueries,
  },
  Mutation: {
    ...accountsMutations,
    ...productsMutations,
  },
};
