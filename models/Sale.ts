import mongoose, { Schema, Document } from 'mongoose'

export interface ISale extends Document {
  userId: string
  name: string
  batchNo?: string
  quantity: number
  salePrice: number
  date: Date
}

const SaleSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  batchNo: { type: String },
  quantity: { type: Number, default: 0 },
  salePrice: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
}, { timestamps: true })

export default (mongoose.models.Sale as mongoose.Model<ISale>) || mongoose.model<ISale>('Sale', SaleSchema)
