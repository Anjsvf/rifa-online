import stripe from '../config/stripe';
import { IPayment } from '../model/Payment';
import Reservation from '../model/Reservation';

interface StripeSessionResponse {
  sessionId: string;
  url: string;
}

/**
 * Creates a Stripe checkout session for a payment
 */
export const createStripeCheckoutSession = async (payment: IPayment): Promise<StripeSessionResponse> => {
  try {
    // Prepare line items and metadata based on payment type
    let lineItems;
    const metadata: any = {
      paymentId: payment._id.toString(),
      userId: payment.userId.toString(),
    };

    // Handle different payment types
    if (payment.paymentType === 'campaign_publication' && payment.campaignId) {
      // Get campaign details for campaign payment
      const Campaign = require('../model/Campaign').default;
      const campaign = await Campaign.findById(payment.campaignId);
      
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      lineItems = [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Publicação de campanha: ${campaign.name}`,
              description: `Publicação de campanha de rifa`,
            },
            unit_amount: Math.round(payment.amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ];

      // Add campaignId to metadata
      metadata.campaignId = payment.campaignId.toString();
    } else if (payment.reservationId) {
      // Get reservation details for reservation payment
      const reservation = await Reservation.findById(payment.reservationId);
      
      if (!reservation) {
        throw new Error('Reservation not found');
      }

      lineItems = [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Reserva de números para rifa`,
              description: `Números: ${reservation.numbers.join(', ')}`,
            },
            unit_amount: Math.round(payment.amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ];

      // Add reservationId to metadata
      metadata.reservationId = payment.reservationId.toString();
    } else {
      throw new Error('Invalid payment type: missing reservationId or campaignId');
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
      metadata: metadata,
    });

    return {
      sessionId: session.id,
      url: session.url as string,
    };
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    throw error;
  }
};

/**
 * Verifies a Stripe payment session status
 */
export const verifyStripePayment = async (sessionId: string): Promise<{ status: string }> => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    return {
      status: session.payment_status, // 'paid', 'unpaid', etc.
    };
  } catch (error) {
    console.error('Error verifying Stripe payment:', error);
    throw error;
  }
};

/**
 * Handles Stripe webhook events
 */
export const handleStripeWebhook = async (event: any) => {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Update payment status in database
        if (session.metadata?.paymentId) {
          const payment = await import('../model/Payment').then(module => module.default);
          const updatedPayment = await payment.findByIdAndUpdate(
            session.metadata.paymentId,
            { 
              status: 'completed',
              updatedAt: new Date()
            },
            { new: true }
          );
          
          // Verificar se é um pagamento de campanha ou reserva
          if (updatedPayment) {
            if (session.metadata.reservationId) {
              // Update reservation status
              await Reservation.findByIdAndUpdate(
                session.metadata.reservationId,
                { 
                  paymentStatus: 'completed',
                  status: 'confirmed'
                }
              );
            } else if (session.metadata.campaignId) {
              // Update campaign status
              const Campaign = require('../model/Campaign').default;
              await Campaign.findByIdAndUpdate(
                session.metadata.campaignId,
                { 
                  paymentStatus: 'completed'
                }
              );
            }
          }
        }
        break;
        
      case 'checkout.session.expired':
        // Handle expired sessions
        const expiredSession = event.data.object;
        if (expiredSession.metadata?.paymentId) {
          const payment = await import('../model/Payment').then(module => module.default);
          await payment.findByIdAndUpdate(
            expiredSession.metadata.paymentId,
            { 
              status: 'failed',
              updatedAt: new Date()
            }
          );
          
          // Verificar se é um pagamento de campanha ou reserva
          if (expiredSession.metadata.reservationId) {
            await Reservation.findByIdAndUpdate(
              expiredSession.metadata.reservationId,
              { paymentStatus: 'failed' }
            );
          } else if (expiredSession.metadata.campaignId) {
            // Update campaign status
            const Campaign = require('../model/Campaign').default;
            await Campaign.findByIdAndUpdate(
              expiredSession.metadata.campaignId,
              { paymentStatus: 'failed' }
            );
          }
        }
        break;
    }
    
    return { received: true };
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    throw error;
  }
};