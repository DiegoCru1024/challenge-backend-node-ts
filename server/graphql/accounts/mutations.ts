import { accountRepository } from '../../repositories/accounts.repository';
import {
  createAccountSchema,
  CreateAccountInput,
} from '../../utils/accounts.validations';
import { GraphQLError } from 'graphql';

export const mutations = {
  createAccount: async (_: any, { input }: { input: CreateAccountInput }) => {
    try {
      const validatedInput = createAccountSchema.parse(input);

      const existingAccount = await accountRepository.findByEmail(
        validatedInput.email
      );
      if (existingAccount) {
        throw new GraphQLError('Ya existe una cuenta con este email', {
          extensions: { code: 'EMAIL_ALREADY_EXISTS' },
        });
      }

      const newAccount = await accountRepository.create(validatedInput);

      return newAccount;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new GraphQLError('Datos de entrada inválidos', {
          extensions: { code: 'INVALID_INPUT', details: error.errors },
        });
      }
      throw error;
    }
  },
};
