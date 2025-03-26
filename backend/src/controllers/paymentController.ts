import { AuthRequest } from '../middleware/auth';
import {  Response } from 'express';
import Payment from '../model/Payment';
import Reservation from '../model/Reservation';
import { generatePixCode, generateBoleto } from '../services/paymentService';
import { createStripeCheckoutSession, } from '../services/stripeService';


export const processPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { method, reservationId, campaignId, amount, paymentType } = req.body;
    const userId = req.user?.id;

    
    if (!userId) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    // Verificar se é um pagamento de campanha ou reserva
    if (paymentType === 'campaign_publication') {
      if (!method || !campaignId || !amount) {
        res.status(400).json({ message: 'Dados incompletos para pagamento de campanha' });
        return;
      }
    } else {
      if (!method || !reservationId || !amount) {
        res.status(400).json({ message: 'Dados incompletos' });
        return;
      }
    }

    if (!['PIX', 'Boleto', 'Stripe'].includes(method)) {
      res.status(400).json({ message: 'Método de pagamento inválido' });
      return;
    }

    // Verifica se é um pagamento de campanha ou reserva
    let reservation = null;
    let campaign = null;
    
    if (paymentType === 'campaign_publication') {
      // Importar o modelo de Campaign
      const Campaign = require('../model/Campaign').default;
      
      // Verificar se a campanha existe e pertence ao usuário
      campaign = await Campaign.findOne({
        _id: campaignId,
        userId: userId
      });
      
      if (!campaign) {
        res.status(404).json({ message: 'Campanha não encontrada' });
        return;
      }
      
      // Verificar se a campanha já foi paga
      if (campaign.paymentStatus === 'completed') {
        res.status(400).json({ message: 'Esta campanha já foi paga' });
        return;
      }
    } else {
      // Verifica se a reserva existe e pertence ao usuário
      reservation = await Reservation.findOne({
        _id: reservationId,
        userId: userId
      });

      if (!reservation) {
        res.status(404).json({ message: 'Reserva não encontrada' });
        return;
      }
    }

    
    // Verificar se já existe um pagamento pendente para esta reserva ou campanha
    let existingPayment;
    
    if (paymentType === 'campaign_publication') {
      existingPayment = await Payment.findOne({
        campaignId,
        status: 'pending'
      });
      
      if (existingPayment) {
        res.status(400).json({ 
          message: 'Já existe um pagamento pendente para esta campanha',
          paymentId: existingPayment._id
        });
        return;
      }
    } else {
      existingPayment = await Payment.findOne({
        reservationId,
        status: 'pending'
      });
      
      if (existingPayment) {
        res.status(400).json({ 
          message: 'Já existe um pagamento pendente para esta reserva',
          paymentId: existingPayment._id
        });
        return;
      }
    }

    // Cria um novo pagamento
    const payment = new Payment({
      reservationId: paymentType === 'campaign_publication' ? null : reservationId,
      campaignId: paymentType === 'campaign_publication' ? campaignId : null,
      userId,
      amount,
      method,
      paymentType: paymentType || 'reservation',
      paymentDetails: {
        pixCode: '',
        pixQRCode: '',
        boletoCode: '',
        boletoUrl: '',
        stripeSessionId: '',
        stripePaymentIntentId: '',
        expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
      }
    });

    // Gera detalhes do pagamento com base no método
    if (method === 'PIX') {
      const pixDetails = await generatePixCode(payment);
      payment.paymentDetails.pixCode = pixDetails.code;
      payment.paymentDetails.pixQRCode = pixDetails.qrCode;
    } else if (method === 'Boleto') {
      const boletoDetails = await generateBoleto(payment);
      payment.paymentDetails.boletoCode = boletoDetails.code;
      payment.paymentDetails.boletoUrl = boletoDetails.url;
      payment.paymentDetails.expirationDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 dias
    } else if (method === 'Stripe') {
      try {
        const stripeSession = await createStripeCheckoutSession(payment);
        payment.paymentDetails.stripeSessionId = stripeSession.sessionId;
        payment.paymentDetails.expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
        
        // Salvar o pagamento e atualizar a reserva ou campanha
        await payment.save();
        
        // Atualizar o status de pagamento da reserva ou campanha
        if (paymentType === 'campaign_publication' && campaign) {
          campaign.paymentStatus = 'pending';
          await campaign.save();
        } else if (reservation) {
          reservation.paymentStatus = 'pending';
          await reservation.save();
        }
        
        // Retornar a URL de checkout do Stripe
        res.status(201).json({
          success: true,
          paymentId: payment._id,
          paymentDetails: {
            checkoutUrl: stripeSession.url
          }
        });
        return;
      } catch (error) {
        console.error('Erro ao processar pagamento Stripe:', error);
        res.status(500).json({ message: 'Erro ao processar pagamento com Stripe' });
        return;
      }
    }

    
    await payment.save();

    // Atualizar o status de pagamento da reserva ou campanha
    if (paymentType === 'campaign_publication' && campaign) {
      campaign.paymentStatus = 'pending';
      await campaign.save();
    } else if (reservation) {
      reservation.paymentStatus = 'pending';
      await reservation.save();
    }

    
    res.status(201).json({
      success: true,
      paymentId: payment._id,
      paymentDetails: payment.paymentDetails
    });

  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    res.status(500).json({ message: 'Erro ao processar pagamento' });
  }
};


export const getPaymentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { paymentId } = req.params;
    const userId = req.user?.id;

    
    if (!userId) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

  
    const payment = await Payment.findOne({
      _id: paymentId,
      userId
    });

    if (!payment) {
      res.status(404).json({ message: 'Pagamento não encontrado' });
      return;
    }

    // Retorna o status do pagamento
    res.json({
      status: payment.status,
      paymentDetails: payment.paymentDetails
    });

  } catch (error) {
    console.error('Erro ao buscar status do pagamento:', error);
    res.status(500).json({ message: 'Erro ao buscar status do pagamento' });
  }
};


export const cancelPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { paymentId } = req.params;
    const userId = req.user?.id;

  
    if (!userId) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    
    const payment = await Payment.findOne({
      _id: paymentId,
      userId,
      status: 'pending'
    });

    if (!payment) {
      res.status(404).json({ message: 'Pagamento não encontrado ou não pode ser cancelado' });
      return;
    }

    
    payment.status = 'cancelled';
    payment.updatedAt = new Date();
    await payment.save();

    
    await Reservation.findByIdAndUpdate(payment.reservationId, {
      paymentStatus: 'cancelled'
    });

    
    res.json({ message: 'Pagamento cancelado com sucesso' });

  } catch (error) {
    console.error('Erro ao cancelar pagamento:', error);
    res.status(500).json({ message: 'Erro ao cancelar pagamento' });
  }
};