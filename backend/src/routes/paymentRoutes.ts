import express from 'express';
import { auth } from '../middleware/auth';
import { 
  processPayment, 
  getPaymentStatus, 
  cancelPayment 
} from '../controllers/paymentController';

const router = express.Router();


router.post('/process', auth, processPayment);

router.get('/status/:paymentId', auth, getPaymentStatus);


router.post('/cancel/:paymentId', auth, cancelPayment);

export default router;