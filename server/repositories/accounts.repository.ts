import { IAccount } from '../interfaces/account';
import Accounts from '../models/accounts';
import { createModuleLogger } from '../utils/logger.utils';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

export class AccountRepository {
  private logger = createModuleLogger('AccountRepository');
  async create(
    accountData: Omit<IAccount, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<IAccount> {
    try {
      const account = new Accounts(accountData);
      const savedAccount = await account.save();
      this.logger.info('Account created successfully', { id: savedAccount.id });
      return savedAccount;
    } catch (error) {
      this.logger.error('Error creating account', {
        error,
        email: accountData.email,
      });
      throw error;
    }
  }

  async findById(id: string): Promise<IAccount | null> {
    try {
      this.logger.debug('Finding account by ID', { id });
      const account = await Accounts.findById(id);
      if (account) {
        this.logger.debug('Account found', { id });
      } else {
        this.logger.warn('Account not found', { id });
      }
      return account;
    } catch (error) {
      this.logger.error('Error finding account by ID', { error, id });
      throw error;
    }
  }

  async findByEmail(email: string): Promise<IAccount | null> {
    return await Accounts.findOne({ email });
  }

  async findWithPagination(
    nameFilter?: string,
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<PaginatedResult<IAccount>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (nameFilter) {
      filter.name = { $regex: nameFilter, $options: 'i' };
    }

    const [data, total] = await Promise.all([
      Accounts.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Accounts.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      page,
      limit,
      totalPages,
      total,
    };
  }
}

export const accountRepository = new AccountRepository();
