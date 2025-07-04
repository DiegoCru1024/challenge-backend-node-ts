import { productRepository } from '../../repositories/products.repository';
import { accountRepository } from '../../repositories/accounts.repository';
import { createProductSchema, purchaseProductSchema, CreateProductInput } from '../../utils/products.validations';
import { GraphQLError } from 'graphql';

export const mutations = {
  createProduct: async (_: any, { input }: { input: CreateProductInput }) => {
    try {
      const validatedInput = createProductSchema.parse(input);

      const account = await accountRepository.findById(validatedInput.accountId);
      if (!account) {
        throw new GraphQLError('La cuenta especificada no existe', {
          extensions: { code: 'ACCOUNT_NOT_FOUND' }
        });
      }

      const existingProduct = await productRepository.findBySku(validatedInput.sku);
      if (existingProduct) {
        throw new GraphQLError('Ya existe un producto con este SKU', {
          extensions: { code: 'SKU_ALREADY_EXISTS' }
        });
      }

      const newProduct = await productRepository.create(validatedInput);

      return newProduct;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new GraphQLError('Datos de entrada inválidos', {
          extensions: { code: 'INVALID_INPUT', details: error.errors }
        });
      }
      throw error;
    }
  },

  purchaseProduct: async (_: any, { accountId, productId, quantity }: { accountId: string, productId: string, quantity: number }) => {
    try {
      const validatedInput = purchaseProductSchema.parse({ accountId, productId, quantity });

      const account = await accountRepository.findById(validatedInput.accountId);
      if (!account) {
        return {
          success: false,
          message: 'La cuenta especificada no existe',
          product: null
        };
      }

      const product = await productRepository.findById(validatedInput.productId);
      if (!product) {
        return {
          success: false,
          message: 'El producto especificado no existe',
          product: null
        };
      }

      if (product.accountId !== validatedInput.accountId) {
        return {
          success: false,
          message: 'El producto no pertenece a la cuenta especificada',
          product: null
        };
      }

      if (product.stock < validatedInput.quantity) {
        return {
          success: false,
          message: `Stock insuficiente. Stock disponible: ${product.stock}`,
          product: product
        };
      }

      const updatedProduct = await productRepository.decreaseStock(validatedInput.productId, validatedInput.quantity);

      return {
        success: true,
        message: `Compra realizada exitosamente. Cantidad: ${validatedInput.quantity}`,
        product: updatedProduct
      };
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new GraphQLError('Parámetros inválidos', {
          extensions: { code: 'INVALID_INPUT', details: error.errors }
        });
      }
      return {
        success: false,
        message: `Error al procesar la compra: ${error.message}`,
        product: null
      };
    }
  },
};
