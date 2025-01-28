import express from 'express';
import { getReservations } from '../controllers/reservationController';
import { auth } from '../middleware/auth'; 

const router = express.Router();

router.get('/', auth, getReservations);

export default router;