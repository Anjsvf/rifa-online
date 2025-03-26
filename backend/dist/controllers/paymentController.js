"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelPayment = exports.getPaymentStatus = exports.processPayment = void 0;
const Payment_1 = __importDefault(require("../model/Payment"));
const Reservation_1 = __importDefault(require("../model/Reservation"));
const paymentService_1 = require("../services/paymentService");
const stripeService_1 = require("../services/stripeService");
const processPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { method, reservationId, campaignId, amount, paymentType } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        }
        else {
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
            campaign = yield Campaign.findOne({
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
        }
        else {
            // Verifica se a reserva existe e pertence ao usuário
            reservation = yield Reservation_1.default.findOne({
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
            existingPayment = yield Payment_1.default.findOne({
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
        }
        else {
            existingPayment = yield Payment_1.default.findOne({
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
        const payment = new Payment_1.default({
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
            const pixDetails = yield (0, paymentService_1.generatePixCode)(payment);
            payment.paymentDetails.pixCode = pixDetails.code;
            payment.paymentDetails.pixQRCode = pixDetails.qrCode;
        }
        else if (method === 'Boleto') {
            const boletoDetails = yield (0, paymentService_1.generateBoleto)(payment);
            payment.paymentDetails.boletoCode = boletoDetails.code;
            payment.paymentDetails.boletoUrl = boletoDetails.url;
            payment.paymentDetails.expirationDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 dias
        }
        else if (method === 'Stripe') {
            try {
                const stripeSession = yield (0, stripeService_1.createStripeCheckoutSession)(payment);
                payment.paymentDetails.stripeSessionId = stripeSession.sessionId;
                payment.paymentDetails.expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
                // Salvar o pagamento e atualizar a reserva ou campanha
                yield payment.save();
                // Atualizar o status de pagamento da reserva ou campanha
                if (paymentType === 'campaign_publication' && campaign) {
                    campaign.paymentStatus = 'pending';
                    yield campaign.save();
                }
                else if (reservation) {
                    reservation.paymentStatus = 'pending';
                    yield reservation.save();
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
            }
            catch (error) {
                console.error('Erro ao processar pagamento Stripe:', error);
                res.status(500).json({ message: 'Erro ao processar pagamento com Stripe' });
                return;
            }
        }
        yield payment.save();
        // Atualizar o status de pagamento da reserva ou campanha
        if (paymentType === 'campaign_publication' && campaign) {
            campaign.paymentStatus = 'pending';
            yield campaign.save();
        }
        else if (reservation) {
            reservation.paymentStatus = 'pending';
            yield reservation.save();
        }
        res.status(201).json({
            success: true,
            paymentId: payment._id,
            paymentDetails: payment.paymentDetails
        });
    }
    catch (error) {
        console.error('Erro ao processar pagamento:', error);
        res.status(500).json({ message: 'Erro ao processar pagamento' });
    }
});
exports.processPayment = processPayment;
const getPaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { paymentId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Usuário não autenticado' });
            return;
        }
        const payment = yield Payment_1.default.findOne({
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
    }
    catch (error) {
        console.error('Erro ao buscar status do pagamento:', error);
        res.status(500).json({ message: 'Erro ao buscar status do pagamento' });
    }
});
exports.getPaymentStatus = getPaymentStatus;
const cancelPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { paymentId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Usuário não autenticado' });
            return;
        }
        const payment = yield Payment_1.default.findOne({
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
        yield payment.save();
        yield Reservation_1.default.findByIdAndUpdate(payment.reservationId, {
            paymentStatus: 'cancelled'
        });
        res.json({ message: 'Pagamento cancelado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao cancelar pagamento:', error);
        res.status(500).json({ message: 'Erro ao cancelar pagamento' });
    }
});
exports.cancelPayment = cancelPayment;
