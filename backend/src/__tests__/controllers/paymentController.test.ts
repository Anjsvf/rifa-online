import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { processPayment, getPaymentStatus, cancelPayment } from '../../controllers/paymentController';
import Payment from '../../model/Payment';
import Reservation from '../../model/Reservation';
import * as paymentService from '../../services/paymentService';
import * as stripeService from '../../services/stripeService';


jest.mock('../../model/Payment');
jest.mock('../../model/Reservation');
jest.mock('../../services/paymentService');
jest.mock('../../services/stripeService');

// Mock para o módulo Campaign que é importado dinamicamente
jest.mock('../../model/Campaign', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('Payment Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any = {};

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset do objeto de resposta
    responseObject = {};
    
    // Mock da requisição
    mockRequest = {
      user: { id: new mongoose.Types.ObjectId().toString() },
      body: {},
      params: {},
    };
    
    // Mock da resposta
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      }),
    };
  });

  describe('processPayment', () => {
    it('should return 401 if user is not authenticated', async () => {
      // Configurar mock sem usuário autenticado
      mockRequest.user = undefined;
      
      // Executar a função
      await processPayment(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Usuário não autenticado' });
    });

    it('should return 400 if reservation payment data is incomplete', async () => {
      // Configurar mock com dados incompletos
      mockRequest.body = {
        method: 'PIX',
        // Faltando reservationId
        amount: 100,
        paymentType: 'reservation'
      };
      
      // Executar a função
      await processPayment(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Dados incompletos' });
    });

    it('should return 400 if campaign payment data is incomplete', async () => {
  
      mockRequest.body = {
        method: 'PIX',
        
        amount: 100,
        paymentType: 'campaign_publication'
      };
      
      // Executar a função
      await processPayment(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Dados incompletos para pagamento de campanha' });
    });

    it('should return 400 if payment method is invalid', async () => {
      // Configurar mock com método de pagamento inválido
      mockRequest.body = {
        method: 'InvalidMethod',
        reservationId: new mongoose.Types.ObjectId().toString(),
        amount: 100,
        paymentType: 'reservation'
      };
      
      // Executar a função
      await processPayment(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Método de pagamento inválido' });
    });

    it('should return 404 if reservation is not found', async () => {
      // Configurar mock com reserva não encontrada
      mockRequest.body = {
        method: 'PIX',
        reservationId: new mongoose.Types.ObjectId().toString(),
        amount: 100,
        paymentType: 'reservation'
      };
      
      // Mock do Reservation.findOne para retornar null
      jest.spyOn(Reservation, 'findOne').mockResolvedValue(null);
      
      // Executar a função
      await processPayment(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Reserva não encontrada' });
    });

    it('should return 404 if campaign is not found', async () => {
      // Configurar mock com campanha não encontrada
      mockRequest.body = {
        method: 'PIX',
        campaignId: new mongoose.Types.ObjectId().toString(),
        amount: 100,
        paymentType: 'campaign_publication'
      };
      
      // Mock do Campaign.findOne para retornar null
      const Campaign = require('../../model/Campaign').default;
      Campaign.findOne.mockResolvedValue(null);
      
      // Executar a função
      await processPayment(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Campanha não encontrada' });
    });

    it('should return 400 if campaign is already paid', async () => {
      // Configurar mock com campanha já paga
      mockRequest.body = {
        method: 'PIX',
        campaignId: new mongoose.Types.ObjectId().toString(),
        amount: 100,
        paymentType: 'campaign_publication'
      };
      
      // Mock do Campaign.findOne para retornar campanha já paga
      const Campaign = require('../../model/Campaign').default;
      Campaign.findOne.mockResolvedValue({
        _id: mockRequest.body.campaignId,
        userId: mockRequest.user?.id,
        paymentStatus: 'completed'
      });
      
      // Executar a função
      await processPayment(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Esta campanha já foi paga' });
    });

    it('should return 400 if there is a pending payment for the reservation', async () => {
      // Configurar mock
      mockRequest.body = {
        method: 'PIX',
        reservationId: new mongoose.Types.ObjectId().toString(),
        amount: 100,
        paymentType: 'reservation'
      };
      
      // Mock da reserva
      jest.spyOn(Reservation, 'findOne').mockResolvedValue({
        _id: mockRequest.body.reservationId,
        userId: mockRequest.user?.id,
      });
      
      // Mock do pagamento pendente
      const mockExistingPayment = {
        _id: new mongoose.Types.ObjectId(),
      };
      jest.spyOn(Payment, 'findOne').mockResolvedValue(mockExistingPayment as any);
      
      // Executar a função
      await processPayment(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Já existe um pagamento pendente para esta reserva',
        paymentId: mockExistingPayment._id
      });
    });

    it('should process PIX payment successfully', async () => {
      // Configurar mock
      mockRequest.body = {
        method: 'PIX',
        reservationId: new mongoose.Types.ObjectId().toString(),
        amount: 100,
        paymentType: 'reservation'
      };
      
      // Mock da reserva
      jest.spyOn(Reservation, 'findOne').mockResolvedValue({
        _id: mockRequest.body.reservationId,
        userId: mockRequest.user?.id,
        save: jest.fn().mockResolvedValue(true),
      });
      
      // Mock do pagamento (nenhum pagamento pendente)
      jest.spyOn(Payment, 'findOne').mockResolvedValue(null);
      
      // Mock do modelo Payment
      const mockPaymentId = new mongoose.Types.ObjectId();
      const mockPixDetails = {
        code: 'PIX123456',
        qrCode: 'QRPIX123456'
      };
      
      // Mock do construtor e save do Payment
      jest.spyOn(Payment.prototype, 'save').mockResolvedValue({
        _id: mockPaymentId,
        paymentDetails: {
          pixCode: mockPixDetails.code,
          pixQRCode: mockPixDetails.qrCode,
          expirationDate: expect.any(Date)
        }
      });
      
      // Mock do serviço de pagamento PIX
      jest.spyOn(paymentService, 'generatePixCode').mockResolvedValue(mockPixDetails);
      
      // Executar a função
      await processPayment(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject).toHaveProperty('success', true);
      expect(responseObject).toHaveProperty('paymentId');
      expect(responseObject).toHaveProperty('paymentDetails');
      expect(responseObject.paymentDetails).toHaveProperty('pixCode', mockPixDetails.code);
      expect(responseObject.paymentDetails).toHaveProperty('pixQRCode', mockPixDetails.qrCode);
    });

    it('should process Boleto payment successfully', async () => {
      // Configurar mock
      mockRequest.body = {
        method: 'Boleto',
        reservationId: new mongoose.Types.ObjectId().toString(),
        amount: 100,
        paymentType: 'reservation'
      };
      
      // Mock da reserva
      jest.spyOn(Reservation, 'findOne').mockResolvedValue({
        _id: mockRequest.body.reservationId,
        userId: mockRequest.user?.id,
        save: jest.fn().mockResolvedValue(true),
      });
      
      // Mock do pagamento (nenhum pagamento pendente)
      jest.spyOn(Payment, 'findOne').mockResolvedValue(null);
      
      // Mock do modelo Payment
      const mockPaymentId = new mongoose.Types.ObjectId();
      const mockBoletoDetails = {
        code: 'BOLETO123456',
        url: 'https://example.com/boleto/123456'
      };
      
      // Mock do construtor e save do Payment
      jest.spyOn(Payment.prototype, 'save').mockResolvedValue({
        _id: mockPaymentId,
        paymentDetails: {
          boletoCode: mockBoletoDetails.code,
          boletoUrl: mockBoletoDetails.url,
          expirationDate: expect.any(Date)
        }
      });
      
      // Mock do serviço de pagamento Boleto
      jest.spyOn(paymentService, 'generateBoleto').mockResolvedValue(mockBoletoDetails);
      
      // Executar a função
      await processPayment(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject).toHaveProperty('success', true);
      expect(responseObject).toHaveProperty('paymentId');
      expect(responseObject).toHaveProperty('paymentDetails');
      expect(responseObject.paymentDetails).toHaveProperty('boletoCode', mockBoletoDetails.code);
      expect(responseObject.paymentDetails).toHaveProperty('boletoUrl', mockBoletoDetails.url);
    });

    it('should process Stripe payment successfully', async () => {
      // Configurar mock
      mockRequest.body = {
        method: 'Stripe',
        reservationId: new mongoose.Types.ObjectId().toString(),
        amount: 100,
        paymentType: 'reservation'
      };
      
      // Mock da reserva
      jest.spyOn(Reservation, 'findOne').mockResolvedValue({
        _id: mockRequest.body.reservationId,
        userId: mockRequest.user?.id,
        save: jest.fn().mockResolvedValue(true),
      });
      
      // Mock do pagamento (nenhum pagamento pendente)
      jest.spyOn(Payment, 'findOne').mockResolvedValue(null);
      
      // Mock do modelo Payment
      const mockPaymentId = new mongoose.Types.ObjectId();
      const mockStripeSession = {
        sessionId: 'sess_123456789',
        url: 'https://checkout.stripe.com/pay/cs_test_123456789'
      };
      
      // Mock do construtor e save do Payment
      jest.spyOn(Payment.prototype, 'save').mockResolvedValue({
        _id: mockPaymentId,
        paymentDetails: {
          stripeSessionId: mockStripeSession.sessionId,
          expirationDate: expect.any(Date)
        }
      });
      
      // Mock do serviço de pagamento Stripe
      jest.spyOn(stripeService, 'createStripeCheckoutSession').mockResolvedValue(mockStripeSession);
      
      // Executar a função
      await processPayment(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject).toHaveProperty('success', true);
      expect(responseObject).toHaveProperty('paymentId');
      expect(responseObject).toHaveProperty('paymentDetails');
      expect(responseObject.paymentDetails).toHaveProperty('checkoutUrl', mockStripeSession.url);
    });

    it('should handle Stripe payment error', async () => {
      // Configurar mock
      mockRequest.body = {
        method: 'Stripe',
        reservationId: new mongoose.Types.ObjectId().toString(),
        amount: 100,
        paymentType: 'reservation'
      };
      
      // Mock da reserva
      jest.spyOn(Reservation, 'findOne').mockResolvedValue({
        _id: mockRequest.body.reservationId,
        userId: mockRequest.user?.id,
      });
      
      // Mock do pagamento (nenhum pagamento pendente)
      jest.spyOn(Payment, 'findOne').mockResolvedValue(null);
      
      // Mock do serviço de pagamento Stripe com erro
      jest.spyOn(stripeService, 'createStripeCheckoutSession').mockRejectedValue(new Error('Stripe API error'));
      
      // Executar a função
      await processPayment(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Erro ao processar pagamento com Stripe' });
    });
  });

  describe('getPaymentStatus', () => {
    it('should return 401 if user is not authenticated', async () => {
      // Configurar mock sem usuário autenticado
      mockRequest.user = undefined;
      
      // Executar a função
      await getPaymentStatus(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Usuário não autenticado' });
    });

    it('should return 404 if payment is not found', async () => {
      // Configurar mock
      mockRequest.params = {
        paymentId: new mongoose.Types.ObjectId().toString()
      };
      
      // Mock do Payment.findOne para retornar null
      jest.spyOn(Payment, 'findOne').mockResolvedValue(null);
      
      // Executar a função
      await getPaymentStatus(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Pagamento não encontrado' });
    });

    it('should return payment status successfully', async () => {
      // Configurar mock
      mockRequest.params = {
        paymentId: new mongoose.Types.ObjectId().toString()
      };
      
      // Mock do pagamento
      const mockPayment = {
        _id: mockRequest.params.paymentId,
        status: 'pending',
        paymentDetails: {
          pixCode: 'PIX123456',
          pixQRCode: 'QRPIX123456',
          expirationDate: new Date()
        }
      };
      
      // Mock do Payment.findOne
      jest.spyOn(Payment, 'findOne').mockResolvedValue(mockPayment as any);
      
      // Executar a função
      await getPaymentStatus(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: mockPayment.status,
        paymentDetails: mockPayment.paymentDetails
      });
    });
  });

  describe('cancelPayment', () => {
    it('should return 401 if user is not authenticated', async () => {
      // Configurar mock sem usuário autenticado
      mockRequest.user = undefined;
      
      // Executar a função
      await cancelPayment(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Usuário não autenticado' });
    });

    it('should return 404 if payment is not found or cannot be cancelled', async () => {
      // Configurar mock
      mockRequest.params = {
        paymentId: new mongoose.Types.ObjectId().toString()
      };
      
      // Mock do Payment.findOne para retornar null
      jest.spyOn(Payment, 'findOne').mockResolvedValue(null);
      
      // Executar a função
      await cancelPayment(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Pagamento não encontrado ou não pode ser cancelado' });
    });

    it('should cancel payment successfully', async () => {
      // Configurar mock
      mockRequest.params = {
        paymentId: new mongoose.Types.ObjectId().toString()
      };
      
      // Mock do pagamento
      const mockPayment = {
        _id: mockRequest.params.paymentId,
        status: 'pending',
        reservationId: new mongoose.Types.ObjectId(),
        save: jest.fn().mockResolvedValue(true),
        updatedAt: new Date()
      };
      
      // Mock do Payment.findOne
      jest.spyOn(Payment, 'findOne').mockResolvedValue(mockPayment as any);
      
      // Mock do Reservation.findByIdAndUpdate
      jest.spyOn(Reservation, 'findByIdAndUpdate').mockResolvedValue({} as any);
      
      // Executar a função
      await cancelPayment(mockRequest as any, mockResponse as any);
      
      // Verificar resultado
      expect(mockPayment.status).toBe('cancelled');
      expect(mockPayment.save).toHaveBeenCalled();
      expect(Reservation.findByIdAndUpdate).toHaveBeenCalledWith(mockPayment.reservationId, {
        paymentStatus: 'cancelled'
      });
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Pagamento cancelado com sucesso' });
    });
  });
});