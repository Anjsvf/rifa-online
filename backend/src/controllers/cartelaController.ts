import { Request, Response } from 'express';
import Cartela from '../models/cartelaModel';

export const createCartela = async (req: Request, res: Response) => {
  const { numbers } = req.body;

  try {
    const newCartela = new Cartela({ numbers });
    await newCartela.save();
    res.status(201).json(newCartela);
  } catch (error) {
    res.status(500).json({ message: 'erro' });
  }
};

export const getCartelas = async (req: Request, res: Response) => {
  try {
    const cartelas = await Cartela.find();
    res.status(200).json(cartelas);
  } catch (error) {
    res.status(500).json({ message: 'erro' });
  }
};
