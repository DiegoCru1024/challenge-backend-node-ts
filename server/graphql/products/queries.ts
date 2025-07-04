import { productRepository } from '../../repositories/products.repository';
import {
  productIdSchema,
  productsFilterSchema,
} from '../../utils/products.validations';
import { GraphQLError } from 'graphql';

export const queries = {
  product: async (_: any, { id }: { id: string }) => {
    try {
      const validatedId = productIdSchema.parse(id);

      const product = await productRepository.findById(validatedId);

      if (!product) {
        throw new GraphQLError('Producto no encontrado', {
          extensions: { code: 'PRODUCT_NOT_FOUND' },
        });
      }

      return product;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new GraphQLError('ID inválido', {
          extensions: { code: 'INVALID_INPUT', details: error.errors },
        });
      }
      throw error;
    }
  },

  productsByAccount: async (_: any, { filter }: { filter: any }) => {
    try {
      const validatedFilter = productsFilterSchema.parse(filter);

      const result = await productRepository.findByAccountId(
        validatedFilter.accountId,
        {
          page: validatedFilter.page,
          limit: validatedFilter.limit,
        }
      );

      return result;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new GraphQLError('Parámetros de filtro inválidos', {
          extensions: { code: 'INVALID_INPUT', details: error.errors },
        });
      }
      throw error;
    }
  },
};
