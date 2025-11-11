import mongoose, { Schema, Document } from 'mongoose'

export interface IInventory extends Document {
  userId: string
  name: string
  batchNo: string
  expiryDate: Date
  purchasePrice: number
  salePrice: number
  stock: number
}

const InventorySchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  batchNo: { type: String },
  expiryDate: { type: Date },
  purchasePrice: { type: Number, default: 0 },
  salePrice: { type: Number, default: 0 },
  stock: { type: Number, default: 0 }
}, { timestamps: true })

export default (mongoose.models.Inventory as mongoose.Model<IInventory>) || mongoose.model<IInventory>('Inventory', InventorySchema)
