import mongoose from 'mongoose';

// Defina a interface para o documento Card
interface ICard {
  numbers: number[]; // Array de números da cartela
  campaignId: string; // ID da campanha
  status: 'available' | 'reserved' | 'sold'; // Status da cartela
}

// Defina o esquema do Mongoose
const cardSchema = new mongoose.Schema<ICard>({
  numbers: { type: [Number], required: true }, // Campo obrigatório (array de números)
  campaignId: { type: String, required: true }, // Campo obrigatório
  status: {
    type: String,
    enum: ['available', 'reserved', 'sold'],
    default: 'available',
  },
});

// Exporte o modelo
export default mongoose.model<ICard>('Card', cardSchema);