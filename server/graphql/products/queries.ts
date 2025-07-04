import { productRepository } from '../../repositories/products.repository';
import {
  productIdSchema,
  productsFilterSchema,
} from '../../validations/products.validations';
import { GraphQLError } from 'graphql';
import { createModuleLogger } from '../../utils/logger.utils';

const logger = createModuleLogger('ProductQueries');

export const queries = {
  product: async (_: any, { id }: { id: string }) => {
    try {
      const validatedId = productIdSchema.parse(id);

      const product = await productRepository.findById(validatedId);

      if (!product) {
        logger.warn('Product not found', { id: validatedId });
        throw new GraphQLError('Producto no encontrado', {
          extensions: { code: 'PRODUCT_NOT_FOUND' },
        });
      }

      logger.info('Product query successful', { id: validatedId, sku: product.sku });
      return product;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        logger.warn('Invalid product ID format', { id, error: error.errors });
        throw new GraphQLError('ID inválido', {
          extensions: { code: 'INVALID_INPUT', details: error.errors },
        });
      }
      logger.error('Error in product query', { id, error: error.message });
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

      logger.info('Products by account query successful', {
        accountId: validatedFilter.accountId,
        resultCount: result.data.length,
        totalPages: result.totalPages
      });

      return result;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        logger.warn('Invalid filter parameters for products by account', { filter, error: error.errors });
        throw new GraphQLError('Parámetros de filtro inválidos', {
          extensions: { code: 'INVALID_INPUT', details: error.errors },
        });
      }
      logger.error('Error in productsByAccount query', { filter, error: error.message });
      throw error;
    }
  },
};
