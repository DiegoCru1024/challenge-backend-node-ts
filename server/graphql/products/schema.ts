import { gql } from "apollo-server-express";

export const schema = gql`
  type Product {
    id: ID!
    name: String!
    sku: String!
    stock: Int!
    accountId: String!
    createdAt: String
    updatedAt: String
  }

  type PaginatedProducts {
    data: [Product!]!
    page: Int!
    limit: Int!
    totalPages: Int!
    total: Int!
  }

  type PurchaseResult {
    success: Boolean!
    message: String!
    product: Product
  }

  input CreateProductInput {
    name: String!
    sku: String!
    stock: Int!
    accountId: String!
  }

  input ProductsFilterInput {
    accountId: String!
    page: Int = 1
    limit: Int = 10
  }

  extend type Query {
    product(id: ID!): Product
    productsByAccount(filter: ProductsFilterInput!): PaginatedProducts!
  }

  extend type Mutation {
    createProduct(input: CreateProductInput!): Product!
    purchaseProduct(accountId: ID!, productId: ID!, quantity: Int!): PurchaseResult!
  }
`;
