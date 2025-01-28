import mongoose from 'mongoose';
import { Reservation } from '../types';

const reservationSchema = new mongoose.Schema<Reservation>({
  campaignId: { type: String, required: true },
  userId: { type: String, required: true },
  numbers: [{ type: Number, required: true }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<Reservation>('Reservation', reservationSchema);