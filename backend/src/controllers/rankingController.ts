import { Request, Response } from 'express';
import User from '../model/User';

export const getRanking = async (req: Request, res: Response) => {
  try {
  
    const users = await User.find().sort({ score: -1 }).limit(10);

   
    const rankingData = users.map((user, index) => ({
      id: user._id,
      name: user.firstName,
      prizes: user.score || 0, 
    }));

    res.status(200).json(rankingData);
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    res.status(500).json({ error: 'Erro ao buscar ranking.' });
  }
};