import mongoose from 'mongoose';


export interface IPayment {
  _id: mongoose.Types.ObjectId;
  reservationId?: mongoose.Types.ObjectId;
  campaignId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  method: 'PIX' | 'Boleto' | 'Stripe';
  paymentType: 'reservation' | 'campaign_publication';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentDetails: {
    pixCode?: string;
    pixQRCode?: string;
    boletoCode?: string;
    boletoUrl?: string;
    stripeSessionId?: string;
    stripePaymentIntentId?: string;
    expirationDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}


const paymentSchema = new mongoose.Schema<IPayment>(
  {
    reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: false },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['PIX', 'Boleto', 'Stripe'], required: true },
    paymentType: { type: String, enum: ['reservation', 'campaign_publication'], required: true },
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
      stripeSessionId: String,
      stripePaymentIntentId: String,
      expirationDate: { type: Date, required: true }
    }
  },
  { timestamps: true } 
);


export default mongoose.model<IPayment>('Payment', paymentSchema);