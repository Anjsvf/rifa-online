import { Request, Response } from 'express';
import Reservation from '../model/Reservation';

export const getReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await Reservation.find()
      .populate('campaignId', 'name') 
      .populate('userId', 'firstName lastName'); 

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    res.status(500).json({ message: 'Erro ao buscar reservas.' });
  }
};