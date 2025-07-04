import { IProduct } from '../interfaces/product';
import Products from '../models/products';

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

export class ProductRepository {
  async create(
    productData: Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<IProduct> {
    const product = new Products(productData);
    return await product.save();
  }

  async findById(id: string): Promise<IProduct | null> {
    return await Products.findById(id);
  }

  async findBySku(sku: string): Promise<IProduct | null> {
    return await Products.findOne({ sku });
  }

  async findByAccountId(
    accountId: string,
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<PaginatedResult<IProduct>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const filter = { accountId };

    const [data, total] = await Promise.all([
      Products.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Products.countDocuments(filter),
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

  async updateStock(id: string, newStock: number): Promise<IProduct | null> {
    return await Products.findByIdAndUpdate(
      id,
      { stock: newStock },
      { new: true, runValidators: true }
    );
  }

  async decreaseStock(id: string, quantity: number): Promise<IProduct | null> {
    const product = await Products.findById(id);
    if (!product) {
      return null;
    }

    if (product.stock < quantity) {
      throw new Error('Stock insuficiente');
    }

    const newStock = product.stock - quantity;
    return await this.updateStock(id, newStock);
  }
}

export const productRepository = new ProductRepository();
