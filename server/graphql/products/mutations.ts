import { productRepository } from '../../repositories/products.repository';
import { accountRepository } from '../../repositories/accounts.repository';
import {
  createProductSchema,
  purchaseProductSchema,
  CreateProductInput,
} from '../../validations/products.validations';
import { GraphQLError } from 'graphql';
import { createModuleLogger } from '../../utils/logger.utils';

const logger = createModuleLogger('ProductMutations');

export const mutations = {
  createProduct: async (_: any, { input }: { input: CreateProductInput }) => {
    try {
      const validatedInput = createProductSchema.parse(input);

      const account = await accountRepository.findById(
        validatedInput.accountId
      );
      if (!account) {
        logger.warn('Product creation failed - account not found', {
          accountId: validatedInput.accountId,
        });
        throw new GraphQLError('La cuenta especificada no existe', {
          extensions: { code: 'ACCOUNT_NOT_FOUND' },
        });
      }

      const existingProduct = await productRepository.findBySku(
        validatedInput.sku
      );
      if (existingProduct) {
        logger.warn('Product creation failed - SKU already exists', {
          sku: validatedInput.sku,
        });
        throw new GraphQLError('Ya existe un producto con este SKU', {
          extensions: { code: 'SKU_ALREADY_EXISTS' },
        });
      }

      const newProduct = await productRepository.create(validatedInput);

      logger.info('Product created successfully via GraphQL', {
        id: newProduct.id,
        sku: newProduct.sku,
        accountId: newProduct.accountId,
      });

      return newProduct;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        logger.warn('Invalid input data for product creation', {
          input,
          error: error.errors,
        });
        throw new GraphQLError('Datos de entrada inválidos', {
          extensions: { code: 'INVALID_INPUT', details: error.errors },
        });
      }
      logger.error('Error in createProduct mutation', {
        input,
        error: error.message,
      });
      throw error;
    }
  },

  purchaseProduct: async (
    _: any,
    {
      accountId,
      productId,
      quantity,
    }: { accountId: string; productId: string; quantity: number }
  ) => {
    try {
      const validatedInput = purchaseProductSchema.parse({
        accountId,
        productId,
        quantity,
      });

      const account = await accountRepository.findById(
        validatedInput.accountId
      );
      if (!account) {
        logger.warn('Purchase failed - account not found', {
          accountId: validatedInput.accountId,
        });
        return {
          success: false,
          message: 'La cuenta especificada no existe',
          product: null,
        };
      }

      const product = await productRepository.findById(
        validatedInput.productId
      );
      if (!product) {
        logger.warn('Purchase failed - product not found', {
          productId: validatedInput.productId,
        });
        return {
          success: false,
          message: 'El producto especificado no existe',
          product: null,
        };
      }

      if (product.accountId !== validatedInput.accountId) {
        logger.warn('Purchase failed - product does not belong to account', {
          productId: validatedInput.productId,
          accountId: validatedInput.accountId,
          productAccountId: product.accountId,
        });
        return {
          success: false,
          message: 'El producto no pertenece a la cuenta especificada',
          product: null,
        };
      }

      if (product.stock < validatedInput.quantity) {
        logger.warn('Purchase failed - insufficient stock', {
          productId: validatedInput.productId,
          requestedQuantity: validatedInput.quantity,
          availableStock: product.stock,
        });
        return {
          success: false,
          message: `Stock insuficiente. Stock disponible: ${product.stock}`,
          product: product,
        };
      }

      const updatedProduct = await productRepository.decreaseStock(
        validatedInput.productId,
        validatedInput.quantity
      );

      logger.info('Purchase completed successfully', {
        productId: validatedInput.productId,
        accountId: validatedInput.accountId,
        quantity: validatedInput.quantity,
        newStock: updatedProduct?.stock,
      });

      return {
        success: true,
        message: `Compra realizada exitosamente. Cantidad: ${validatedInput.quantity}`,
        product: updatedProduct,
      };
    } catch (error: any) {
      if (error.name === 'ZodError') {
        logger.warn('Invalid input data for product purchase', {
          accountId,
          productId,
          quantity,
          error: error.errors,
        });
        throw new GraphQLError('Parámetros inválidos', {
          extensions: { code: 'INVALID_INPUT', details: error.errors },
        });
      }
      logger.error('Error in purchaseProduct mutation', {
        accountId,
        productId,
        quantity,
        error: error.message,
      });
      return {
        success: false,
        message: `Error al procesar la compra: ${error.message}`,
        product: null,
      };
    }
  },
};
