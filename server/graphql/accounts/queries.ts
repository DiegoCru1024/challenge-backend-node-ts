import { accountRepository } from '../../repositories/accounts.repository';
import {
  accountIdSchema,
  accountsFilterSchema,
} from '../../validations/accounts.validations';
import { GraphQLError } from 'graphql';
import { createModuleLogger } from '../../utils/logger.utils';

const logger = createModuleLogger('AccountQueries');

export const queries = {
  account: async (_: any, { id }: { id: string }) => {
    try {
      const validatedId = accountIdSchema.parse(id);

      const account = await accountRepository.findById(validatedId);

      if (!account) {
        logger.warn('Account not found', { id: validatedId });
        throw new GraphQLError('Cuenta no encontrada', {
          extensions: { code: 'ACCOUNT_NOT_FOUND' },
        });
      }

      logger.info('Account query successful', {
        id: validatedId,
        accountEmail: account.email,
      });
      return account;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        logger.warn('Invalid account ID format', { id, error: error.errors });
        throw new GraphQLError('ID inválido', {
          extensions: { code: 'INVALID_INPUT', details: error.errors },
        });
      }
      logger.error('Error in account query', { id, error: error.message });
      throw error;
    }
  },

  accounts: async (_: any, { filter }: { filter?: any }) => {
    try {
      const validatedFilter = accountsFilterSchema.parse(filter || {});

      const result = await accountRepository.findWithPagination(
        validatedFilter.name,
        {
          page: validatedFilter.page,
          limit: validatedFilter.limit,
        }
      );

      logger.info('Accounts query successful', {
        filter: validatedFilter,
        resultCount: result.data.length,
        totalPages: result.totalPages,
      });

      return result;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        logger.warn('Invalid filter parameters', {
          filter,
          error: error.errors,
        });
        throw new GraphQLError('Parámetros de filtro inválidos', {
          extensions: { code: 'INVALID_INPUT', details: error.errors },
        });
      }
      logger.error('Error in accounts query', { filter, error: error.message });
      throw error;
    }
  },
};
