import mongoose from 'mongoose';
import { Campaign } from '../types';

const campaignSchema = new mongoose.Schema<Campaign>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  quota: { type: Number, required: true },
  price: { type: Number, required: true },
  phone: { type: String, required: true },
  prizeType: { type: String, required: true },
  customPrize: { type: String },
  image: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'],
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<Campaign>('Campaign', campaignSchema);