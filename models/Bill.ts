import mongoose, { Schema, Document } from 'mongoose'

type BillItem = {
  name: string
  batchNo?: string
  quantity: number
  price: number
}

export interface IBill extends Document {
  userId: string
  items: BillItem[]
  total: number
  createdAt: Date
}

const BillSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  items: [{ name: String, batchNo: String, quantity: Number, price: Number }],
  total: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true })

export default (mongoose.models.Bill as mongoose.Model<IBill>) || mongoose.model<IBill>('Bill', BillSchema)
