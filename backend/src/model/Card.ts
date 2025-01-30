import mongoose from 'mongoose';


interface ICard {
  numbers: number[]; 
  campaignId: string; 
  status: 'available' | 'reserved' | 'sold'; 
}


const cardSchema = new mongoose.Schema<ICard>({
  numbers: { type: [Number], required: true }, 
  campaignId: { type: String, required: true }, 
  status: {
    type: String,
    enum: ['available', 'reserved', 'sold'],
    default: 'available',
  },
});


export default mongoose.model<ICard>('Card', cardSchema);