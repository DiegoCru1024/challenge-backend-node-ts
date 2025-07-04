import { accountRepository } from '../../repositories/accounts.repository';
import {
  accountIdSchema,
  accountsFilterSchema,
} from '../../utils/accounts.validations';
import { GraphQLError } from 'graphql';

export const queries = {
  account: async (_: any, { id }: { id: string }) => {
    try {
      const validatedId = accountIdSchema.parse(id);

      const account = await accountRepository.findById(validatedId);

      if (!account) {
        throw new GraphQLError('Cuenta no encontrada', {
          extensions: { code: 'ACCOUNT_NOT_FOUND' },
        });
      }

      return account;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new GraphQLError('ID inválido', {
          extensions: { code: 'INVALID_INPUT', details: error.errors },
        });
      }
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
