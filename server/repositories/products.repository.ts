import { IProduct } from '../interfaces/product';
import Products from '../models/products';
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

export class ProductRepository {
  private logger = createModuleLogger('ProductRepository');
  async create(
    productData: Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<IProduct> {
    try {
      const product = new Products(productData);
      const savedProduct = await product.save();
      this.logger.info('Product created successfully', { id: savedProduct.id, sku: savedProduct.sku });
      return savedProduct;
    } catch (error) {
      this.logger.error('Error creating product', { error, sku: productData.sku });
      throw error;
    }
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
    try {
      this.logger.info('Updating product stock', { id, newStock });
      const updatedProduct = await Products.findByIdAndUpdate(
        id,
        { stock: newStock },
        { new: true, runValidators: true }
      );

      if (updatedProduct) {
        this.logger.info('Product stock updated successfully', {
          id,
          oldStock: updatedProduct.stock,
          newStock
        });
      } else {
        this.logger.warn('Product not found for stock update', { id });
      }

      return updatedProduct;
    } catch (error) {
      this.logger.error('Error updating product stock', { error, id, newStock });
      throw error;
    }
  }

  async decreaseStock(id: string, quantity: number): Promise<IProduct | null> {
    try {
      this.logger.info('Attempting to decrease product stock', { id, quantity });

      const product = await Products.findById(id);
      if (!product) {
        this.logger.warn('Product not found for stock decrease', { id });
        return null;
      }

      if (product.stock < quantity) {
        this.logger.warn('Insufficient stock for decrease operation', {
          id,
          currentStock: product.stock,
          requestedQuantity: quantity
        });
        throw new Error('Stock insuficiente');
      }

      const newStock = product.stock - quantity;
      this.logger.info('Decreasing stock', {
        id,
        currentStock: product.stock,
        quantity,
        newStock
      });

      return await this.updateStock(id, newStock);
    } catch (error) {
      this.logger.error('Error decreasing product stock', { error, id, quantity });
      throw error;
    }
  }
}

export const productRepository = new ProductRepository();
