import mongoose from 'mongoose';
import { Card } from '../services/cardGenerator.ts';

const cardSchema = new mongoose.Schema<Card>({
  number: { type: Number, required: true },
  campaignId: { type: String, required: true },
  status: {
    type: String,
    enum: ['available', 'reserved', 'sold'],
    default: 'available'
  }
});

export default mongoose.model<Card>('Card', cardSchema);