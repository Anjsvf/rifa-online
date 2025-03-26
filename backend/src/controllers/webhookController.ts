import { Request, Response } from 'express';
import { handleStripeWebhook } from '../services/stripeService';
import stripe from '../config/stripe';

/**
 * Handles Stripe webhook events
 */
export const stripeWebhookHandler = async (req: Request, res: Response): Promise<void> => {
  const signature = req.headers['stripe-signature'] as string;
  
  if (!signature) {
    res.status(400).json({ message: 'Stripe signature missing' });
    return;
  }

  try {
    // Verify the event came from Stripe
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    // Process the event
    const result = await handleStripeWebhook(event);
    
    res.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ message: 'Webhook error', error: (error as Error).message });
  }
};