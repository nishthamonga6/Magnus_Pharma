import mongoose, { Schema, Document } from 'mongoose'

export interface IPurchase extends Document {
  userId: string
  name: string
  batchNo?: string
  quantity: number
  purchasePrice: number
  date: Date
}

const PurchaseSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  batchNo: { type: String },
  quantity: { type: Number, default: 0 },
  purchasePrice: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
}, { timestamps: true })

export default (mongoose.models.Purchase as mongoose.Model<IPurchase>) || mongoose.model<IPurchase>('Purchase', PurchaseSchema)
