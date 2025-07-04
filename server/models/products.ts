import { Schema } from "mongoose";

import { IProduct } from "../interfaces/product";

import { cnxProducts } from "../db/mongodb";

const productsSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    sku: {
      type: String,
      required: [true, 'El SKU es requerido'],
      unique: true,
      trim: true,
      maxlength: [50, 'El SKU no puede exceder 50 caracteres']
    },
    stock: {
      type: Number,
      required: [true, 'El stock es requerido'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0
    },
    accountId: {
      type: String,
      required: [true, 'El ID de cuenta es requerido']
    }
  },
  { timestamps: true }
);

productsSchema.index({ accountId: 1 });
productsSchema.index({ createdAt: -1 });

const Products = cnxProducts.model<IProduct>("Products", productsSchema);

export default Products;
