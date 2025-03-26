import Stripe from 'stripe';

declare global {
  namespace Stripe {
    interface MockSession extends Partial<Stripe.Checkout.Session> {
      id: string;
      url?: string;
      payment_status?: string;
    }
  }
}

declare module 'stripe' {
  namespace Stripe {
    interface MockSession extends Partial<Stripe.Checkout.Session> {
      id: string;
      url?: string;
      payment_status?: string;
    }
  }
}