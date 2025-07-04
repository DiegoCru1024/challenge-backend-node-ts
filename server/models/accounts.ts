import { Schema } from "mongoose";

import { IAccount } from "../interfaces/account";

import { cnxAccounts } from "../db/mongodb";

const accountsSchema = new Schema<IAccount>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [255, 'El email no puede exceder 255 caracteres'],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Debe ser un email válido']
    },
  },
  { timestamps: true }
);

accountsSchema.index({ name: 1 });
accountsSchema.index({ createdAt: -1 });

const Accounts = cnxAccounts.model<IAccount>("Accounts", accountsSchema);

export default Accounts;
