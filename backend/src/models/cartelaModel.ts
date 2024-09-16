import mongoose, { Document } from 'mongoose';

interface ICartela extends Document {
  numbers: number[];
}

const cartelaSchema = new mongoose.Schema<ICartela>({
  numbers: {
    type: [Number],
    required: true,
  },
});

const Cartela = mongoose.model<ICartela>('Cartela', cartelaSchema);

export default Cartela;
