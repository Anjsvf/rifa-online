import { Request, Response } from 'express';
import Ranking from '../models/rankingModel';

export const getRankings = async (req: Request, res: Response) => {
  try {
    const rankings = await Ranking.find().populate('userId', 'email');
    res.status(200).json(rankings);
  } catch (error) {
    res.status(500).json({ message: 'error' });
  }
};

export const addRanking = async (req: Request, res: Response) => {
  const { userId, score } = req.body;

  if (!userId || typeof score !== 'number') {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const newRanking = new Ranking({ userId, score });
    await newRanking.save();
    res.status(201).json(newRanking);
  } catch (error) {
    res.status(500).json({ message: 'error'});
  }
};
