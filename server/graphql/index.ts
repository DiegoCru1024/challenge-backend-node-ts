import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { typeDefs, resolvers } from './root';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

async function startApolloServer(app: any) {
  const apolloServer = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        tabs: [
          {
            endpoint: '/graphql',
            name: 'Consultar Cuentas',
            query: `# Obtener todas las cuentas con paginación
                      query GetAccounts {
                        accounts(filter: { page: 1, limit: 10 }) {
                          data {
                            id
                            name
                            email
                            createdAt
                            updatedAt
                          }
                          page
                          limit
                          totalPages
                          total
                        }
                      }`,
          },
          {
            endpoint: '/graphql',
            name: 'Consultar Cuenta por ID',
            query: `# Obtener una cuenta específica por ID
                      query GetAccount($id: ID!) {
                        account(id: $id) {
                          id
                          name
                          email
                          createdAt
                          updatedAt
                        }
                      }`,
            variables: JSON.stringify({ id: 'ACCOUNT_ID_AQUI' }, null, 2),
          },
          {
            endpoint: '/graphql',
            name: 'Crear Cuenta',
            query: `# Crear una nueva cuenta
                      mutation CreateAccount($input: CreateAccountInput!) {
                        createAccount(input: $input) {
                          id
                          name
                          email
                          createdAt
                          updatedAt
                        }
                      }`,
            variables: JSON.stringify(
              {
                input: {
                  name: 'Juan Pérez',
                  email: 'juan.perez@example.com',
                },
              },
              null,
              2
            ),
          },
          {
            endpoint: '/graphql',
            name: 'Consultar Productos por Cuenta',
            query: `# Obtener productos de una cuenta específica
                      query GetProductsByAccount($filter: ProductsFilterInput!) {
                        productsByAccount(filter: $filter) {
                          data {
                            id
                            name
                            sku
                            stock
                            accountId
                            createdAt
                            updatedAt
                          }
                          page
                          limit
                          totalPages
                          total
                        }
                      }`,
            variables: JSON.stringify(
              {
                filter: {
                  accountId: 'ACCOUNT_ID_AQUI',
                  page: 1,
                  limit: 10,
                },
              },
              null,
              2
            ),
          },
          {
            endpoint: '/graphql',
            name: 'Crear Producto',
            query: `# Crear un nuevo producto
                      mutation CreateProduct($input: CreateProductInput!) {
                        createProduct(input: $input) {
                          id
                          name
                          sku
                          stock
                          accountId
                          createdAt
                          updatedAt
                        }
                      }`,
            variables: JSON.stringify(
              {
                input: {
                  name: 'Laptop Dell XPS 13',
                  sku: 'DELL-XPS13-001',
                  stock: 50,
                  accountId: 'ACCOUNT_ID_AQUI',
                },
              },
              null,
              2
            ),
          },
          {
            endpoint: '/graphql',
            name: 'Comprar Producto',
            query: `# Realizar una compra de producto
                      mutation PurchaseProduct($accountId: ID!, $productId: ID!, $quantity: Int!) {
                        purchaseProduct(
                          accountId: $accountId
                          productId: $productId
                          quantity: $quantity
                        ) {
                          success
                          message
                          product {
                            id
                            name
                            sku
                            stock
                            accountId
                          }
                        }
                      }`,
            variables: JSON.stringify(
              {
                accountId: 'ACCOUNT_ID_AQUI',
                productId: 'PRODUCT_ID_AQUI',
                quantity: 2,
              },
              null,
              2
            ),
          },
        ],
      }),
    ],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });
}

export { startApolloServer };
