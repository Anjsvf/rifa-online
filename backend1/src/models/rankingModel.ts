import mongoose, { Document } from 'mongoose';

interface IRanking extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  score: number;
}

const rankingSchema = new mongoose.Schema<IRanking>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const Ranking = mongoose.model<IRanking>('Ranking', rankingSchema);

export default Ranking;
