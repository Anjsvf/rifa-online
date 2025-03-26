import express from 'express';
import { auth } from '../middleware/auth';
import { 
  processPayment, 
  getPaymentStatus, 
  cancelPayment 
} from '../controllers/paymentController';
import { stripeWebhookHandler } from '../controllers/webhookController';

const router = express.Router();


router.post('/process', auth, processPayment);

router.get('/status/:paymentId', auth, getPaymentStatus);


router.post('/cancel/:paymentId', auth, cancelPayment);

// Stripe webhook endpoint - no auth middleware as it's called by Stripe
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), stripeWebhookHandler);

export default router;