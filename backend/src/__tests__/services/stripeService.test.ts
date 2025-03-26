import mongoose from 'mongoose';
import { createStripeCheckoutSession, verifyStripePayment, handleStripeWebhook } from '../../services/stripeService';
import stripe from '../../config/stripe';

import Reservation from '../../model/Reservation';

// Mock das dependências
jest.mock('../../config/stripe', () => ({
  checkout: {
    sessions: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
  },
}));

jest.mock('../../model/Reservation');

// Mock para o módulo Campaign que é importado dinamicamente
jest.mock('../../model/Campaign', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

// Mock para o módulo Payment que é importado dinamicamente
jest.mock('../../model/Payment', () => ({
  __esModule: true,
  default: {
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('Stripe Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Limpar mocks após todos os testes
    jest.restoreAllMocks();
  });

  describe('createStripeCheckoutSession', () => {
    it('should create a checkout session for reservation payment', async () => {
      // Mock dos dados de entrada
      const mockPayment = {
        _id: new mongoose.Types.ObjectId(),
        userId: new mongoose.Types.ObjectId(),
        reservationId: new mongoose.Types.ObjectId(),
        amount: 100,
        paymentType: 'reservation',
      };

      // Mock da reserva
      const mockReservation = {
        _id: mockPayment.reservationId,
        numbers: [1, 2, 3],
      };

      // Mock da resposta do Stripe
      const mockStripeSession: Stripe.MockSession = {
        id: 'sess_123456789',
        url: 'https://checkout.stripe.com/pay/cs_test_123456789',
      };

      // Configurar mocks
      jest.spyOn(Reservation, 'findById').mockResolvedValue(mockReservation);
      jest.spyOn(stripe.checkout.sessions, 'create').mockResolvedValue(mockStripeSession as any);

      // Executar a função
      const result = await createStripeCheckoutSession(mockPayment as any);

      // Verificar resultado
      expect(result).toEqual({
        sessionId: mockStripeSession.id,
        url: mockStripeSession.url,
      });

      // Verificar se o Stripe foi chamado com os parâmetros corretos
      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: 'Reserva de números para rifa',
                description: 'Números: 1, 2, 3',
              },
              unit_amount: 10000, // 100 * 100 (centavos)
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: expect.any(String),
        cancel_url: expect.any(String),
        metadata: {
          paymentId: mockPayment._id.toString(),
          userId: mockPayment.userId.toString(),
          reservationId: mockPayment.reservationId.toString(),
        },
      });
    });

    it('should create a checkout session for campaign publication payment', async () => {
      // Mock dos dados de entrada
      const mockPayment = {
        _id: new mongoose.Types.ObjectId(),
        userId: new mongoose.Types.ObjectId(),
        campaignId: new mongoose.Types.ObjectId(),
        amount: 50,
        paymentType: 'campaign_publication',
      };

      // Mock da campanha
      const mockCampaign = {
        _id: mockPayment.campaignId,
        name: 'Campanha Teste',
      };

      // Mock da resposta do Stripe
      const mockStripeSession: Stripe.MockSession = {
        id: 'sess_987654321',
        url: 'https://checkout.stripe.com/pay/cs_test_987654321',
      };

      // Configurar mocks
      const Campaign = require('../../model/Campaign').default;
      Campaign.findById.mockResolvedValue(mockCampaign);
      jest.spyOn(stripe.checkout.sessions, 'create').mockResolvedValue(mockStripeSession as any);

      // Executar a função
      const result = await createStripeCheckoutSession(mockPayment as any);

      // Verificar resultado
      expect(result).toEqual({
        sessionId: mockStripeSession.id,
        url: mockStripeSession.url,
      });

      
      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: 'Publicação de campanha: Campanha Teste',
                description: 'Publicação de campanha de rifa',
              },
              unit_amount: 5000, // 50 * 100 (centavos)
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: expect.any(String),
        cancel_url: expect.any(String),
        metadata: {
          paymentId: mockPayment._id.toString(),
          userId: mockPayment.userId.toString(),
          campaignId: mockPayment.campaignId.toString(),
        },
      });
    });

    it('should throw an error if campaign is not found', async () => {
      // Mock dos dados de entrada
      const mockPayment = {
        _id: new mongoose.Types.ObjectId(),
        userId: new mongoose.Types.ObjectId(),
        campaignId: new mongoose.Types.ObjectId(),
        amount: 50,
        paymentType: 'campaign_publication',
      };

      // Configurar mock para retornar null (campanha não encontrada)
      const Campaign = require('../../model/Campaign').default;
      Campaign.findById.mockResolvedValue(null);

      // Executar a função e verificar se lança erro
      await expect(createStripeCheckoutSession(mockPayment as any))
        .rejects
        .toThrow('Campaign not found');
    });

    it('should throw an error if reservation is not found', async () => {
      // Mock dos dados de entrada
      const mockPayment = {
        _id: new mongoose.Types.ObjectId(),
        userId: new mongoose.Types.ObjectId(),
        reservationId: new mongoose.Types.ObjectId(),
        amount: 100,
        paymentType: 'reservation',
      };

      // Configurar mock para retornar null (reserva não encontrada)
      jest.spyOn(Reservation, 'findById').mockResolvedValue(null);

      // Executar a função e verificar se lança erro
      await expect(createStripeCheckoutSession(mockPayment as any))
        .rejects
        .toThrow('Reservation not found');
    });

    it('should throw an error if payment type is invalid', async () => {
      // Mock dos dados de entrada com tipo de pagamento inválido
      const mockPayment = {
        _id: new mongoose.Types.ObjectId(),
        userId: new mongoose.Types.ObjectId(),
        amount: 100,
        paymentType: 'invalid_type',
      };

      // Executar a função e verificar se lança erro
      await expect(createStripeCheckoutSession(mockPayment as any))
        .rejects
        .toThrow('Invalid payment type: missing reservationId or campaignId');
    });
  });

  describe('verifyStripePayment', () => {
    it('should return payment status from Stripe session', async () => {
      // Mock da resposta do Stripe
      const mockStripeSession: Stripe.MockSession = {
        id: 'sess_123456789',
        payment_status: 'paid',
      };

      // Configurar mock
      jest.spyOn(stripe.checkout.sessions, 'retrieve').mockResolvedValue(mockStripeSession as any);

      // Executar a função
      const result = await verifyStripePayment('sess_123456789');

      // Verificar resultado
      expect(result).toEqual({
        status: 'paid',
      });

      // Verificar se o Stripe foi chamado com o parâmetro correto
      expect(stripe.checkout.sessions.retrieve).toHaveBeenCalledWith('sess_123456789');
    });

    it('should throw an error if Stripe API fails', async () => {
      // Configurar mock para lançar erro
      jest.spyOn(stripe.checkout.sessions, 'retrieve').mockRejectedValue(new Error('Stripe API error'));

      // Executar a função e verificar se lança erro
      await expect(verifyStripePayment('sess_123456789'))
        .rejects
        .toThrow('Stripe API error');
    });
  });

  describe('handleStripeWebhook', () => {
    it('should handle checkout.session.completed event for reservation payment', async () => {
      // Mock do evento do Stripe
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: {
              paymentId: new mongoose.Types.ObjectId().toString(),
              reservationId: new mongoose.Types.ObjectId().toString(),
            },
          },
        },
      };

      // Mock do módulo Payment
      const paymentModule = await import('../../model/Payment');
      const mockPayment = {
        _id: mockEvent.data.object.metadata.paymentId,
        status: 'pending',
      };

      // Configurar mocks
      paymentModule.default.findByIdAndUpdate = jest.fn().mockResolvedValue(mockPayment);
      jest.spyOn(Reservation, 'findByIdAndUpdate').mockResolvedValue({});

      // Executar a função
      const result = await handleStripeWebhook(mockEvent);

      // Verificar resultado
      expect(result).toEqual({ received: true });

      // Verificar se os métodos foram chamados com os parâmetros corretos
      expect(paymentModule.default.findByIdAndUpdate).toHaveBeenCalledWith(
        mockEvent.data.object.metadata.paymentId,
        { 
          status: 'completed',
          updatedAt: expect.any(Date)
        },
        { new: true }
      );

      expect(Reservation.findByIdAndUpdate).toHaveBeenCalledWith(
        mockEvent.data.object.metadata.reservationId,
        { 
          paymentStatus: 'completed',
          status: 'confirmed'
        }
      );
    });

    it('should handle checkout.session.completed event for campaign payment', async () => {
      // Mock do evento do Stripe
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: {
              paymentId: new mongoose.Types.ObjectId().toString(),
              campaignId: new mongoose.Types.ObjectId().toString(),
            },
          },
        },
      };

      // Mock do módulo Payment
      const paymentModule = await import('../../model/Payment');
      const mockPayment = {
        _id: mockEvent.data.object.metadata.paymentId,
        status: 'pending',
      };

      // Mock do módulo Campaign
      const Campaign = require('../../model/Campaign').default;

      // Configurar mocks
      paymentModule.default.findByIdAndUpdate = jest.fn().mockResolvedValue(mockPayment);
      Campaign.findByIdAndUpdate.mockResolvedValue({});

      // Executar a função
      const result = await handleStripeWebhook(mockEvent);

      // Verificar resultado
      expect(result).toEqual({ received: true });

      // Verificar se os métodos foram chamados com os parâmetros corretos
      expect(paymentModule.default.findByIdAndUpdate).toHaveBeenCalledWith(
        mockEvent.data.object.metadata.paymentId,
        { 
          status: 'completed',
          updatedAt: expect.any(Date)
        },
        { new: true }
      );

      expect(Campaign.findByIdAndUpdate).toHaveBeenCalledWith(
        mockEvent.data.object.metadata.campaignId,
        { 
          paymentStatus: 'completed'
        }
      );
    });

    it('should handle checkout.session.expired event', async () => {
      // Mock do evento do Stripe
      const mockEvent = {
        type: 'checkout.session.expired',
        data: {
          object: {
            metadata: {
              paymentId: new mongoose.Types.ObjectId().toString(),
              reservationId: new mongoose.Types.ObjectId().toString(),
            },
          },
        },
      };

      // Mock do módulo Payment
      const paymentModule = await import('../../model/Payment');

      // Configurar mocks
      paymentModule.default.findByIdAndUpdate = jest.fn().mockResolvedValue({});
      jest.spyOn(Reservation, 'findByIdAndUpdate').mockResolvedValue({});

      // Executar a função
      const result = await handleStripeWebhook(mockEvent);

      // Verificar resultado
      expect(result).toEqual({ received: true });

      // Verificar se os métodos foram chamados com os parâmetros corretos
      expect(paymentModule.default.findByIdAndUpdate).toHaveBeenCalledWith(
        mockEvent.data.object.metadata.paymentId,
        { 
          status: 'failed',
          updatedAt: expect.any(Date)
        }
      );

      expect(Reservation.findByIdAndUpdate).toHaveBeenCalledWith(
        mockEvent.data.object.metadata.reservationId,
        { paymentStatus: 'failed' }
      );
    });
  });
});