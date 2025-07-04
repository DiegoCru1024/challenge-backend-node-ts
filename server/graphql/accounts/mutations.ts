import { accountRepository } from '../../repositories/accounts.repository';
import {
  createAccountSchema,
  CreateAccountInput,
} from '../../validations/accounts.validations';
import { GraphQLError } from 'graphql';
import { createModuleLogger } from '../../utils/logger.utils';

const logger = createModuleLogger('AccountMutations');

export const mutations = {
  createAccount: async (_: any, { input }: { input: CreateAccountInput }) => {
    try {
      const validatedInput = createAccountSchema.parse(input);

      const existingAccount = await accountRepository.findByEmail(
        validatedInput.email
      );
      if (existingAccount) {
        logger.warn('Account creation failed - email already exists', { email: validatedInput.email });
        throw new GraphQLError('Ya existe una cuenta con este email', {
          extensions: { code: 'EMAIL_ALREADY_EXISTS' },
        });
      }

      const newAccount = await accountRepository.create(validatedInput);

      logger.info('Account created successfully via GraphQL', {
        id: newAccount.id,
        email: newAccount.email
      });

      return newAccount;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        logger.warn('Invalid input data for account creation', { input, error: error.errors });
        throw new GraphQLError('Datos de entrada inválidos', {
          extensions: { code: 'INVALID_INPUT', details: error.errors },
        });
      }
      logger.error('Error in createAccount mutation', { input, error: error.message });
      throw error;
    }
  },
};
