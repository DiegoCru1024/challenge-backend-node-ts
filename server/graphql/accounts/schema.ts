import { gql } from "apollo-server-express";

export const schema = gql`
  type Account {
    id: ID!
    name: String!
    email: String!
    createdAt: String
    updatedAt: String
  }

  type PaginatedAccounts {
    data: [Account!]!
    page: Int!
    limit: Int!
    totalPages: Int!
    total: Int!
  }

  input CreateAccountInput {
    name: String!
    email: String!
  }

  input AccountsFilterInput {
    name: String
    page: Int = 1
    limit: Int = 10
  }

  extend type Query {
    account(id: ID!): Account
    accounts(filter: AccountsFilterInput): PaginatedAccounts!
  }

  extend type Mutation {
    createAccount(input: CreateAccountInput!): Account!
  }
`;
