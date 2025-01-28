import mongoose from 'mongoose';


export interface IPayment {
  _id: mongoose.Types.ObjectId;
  reservationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  method: 'PIX' | 'Boleto';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentDetails: {
    pixCode?: string;
    pixQRCode?: string;
    boletoCode?: string;
    boletoUrl?: string;
    expirationDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}


const paymentSchema = new mongoose.Schema<IPayment>(
  {
    reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['PIX', 'Boleto'], required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending'
    },
    paymentDetails: {
      pixCode: String,
      pixQRCode: String,
      boletoCode: String,
      boletoUrl: String,
      expirationDate: { type: Date, required: true }
    }
  },
  { timestamps: true } 
);


export default mongoose.model<IPayment>('Payment', paymentSchema);