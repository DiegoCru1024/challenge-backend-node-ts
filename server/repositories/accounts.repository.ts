import { IAccount } from '../interfaces/account';
import Accounts from '../models/accounts';

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
  async create(
    accountData: Omit<IAccount, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<IAccount> {
    const account = new Accounts(accountData);
    return await account.save();
  }

  async findById(id: string): Promise<IAccount | null> {
    return await Accounts.findById(id);
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
