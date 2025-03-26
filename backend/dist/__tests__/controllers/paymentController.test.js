"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importDefault(require("mongoose"));
const paymentController_1 = require("../../controllers/paymentController");
const Payment_1 = __importDefault(require("../../model/Payment"));
const Reservation_1 = __importDefault(require("../../model/Reservation"));
const paymentService = __importStar(require("../../services/paymentService"));
const stripeService = __importStar(require("../../services/stripeService"));
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
    let mockRequest;
    let mockResponse;
    let responseObject = {};
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset do objeto de resposta
        responseObject = {};
        // Mock da requisição
        mockRequest = {
            user: { id: new mongoose_1.default.Types.ObjectId().toString() },
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
        it('should return 401 if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mock sem usuário autenticado
            mockRequest.user = undefined;
            // Executar a função
            yield (0, paymentController_1.processPayment)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Usuário não autenticado' });
        }));
        it('should return 400 if reservation payment data is incomplete', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mock com dados incompletos
            mockRequest.body = {
                method: 'PIX',
                // Faltando reservationId
                amount: 100,
                paymentType: 'reservation'
            };
            // Executar a função
            yield (0, paymentController_1.processPayment)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Dados incompletos' });
        }));
        it('should return 400 if campaign payment data is incomplete', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.body = {
                method: 'PIX',
                amount: 100,
                paymentType: 'campaign_publication'
            };
            // Executar a função
            yield (0, paymentController_1.processPayment)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Dados incompletos para pagamento de campanha' });
        }));
        it('should return 400 if payment method is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mock com método de pagamento inválido
            mockRequest.body = {
                method: 'InvalidMethod',
                reservationId: new mongoose_1.default.Types.ObjectId().toString(),
                amount: 100,
                paymentType: 'reservation'
            };
            // Executar a função
            yield (0, paymentController_1.processPayment)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Método de pagamento inválido' });
        }));
        it('should return 404 if reservation is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mock com reserva não encontrada
            mockRequest.body = {
                method: 'PIX',
                reservationId: new mongoose_1.default.Types.ObjectId().toString(),
                amount: 100,
                paymentType: 'reservation'
            };
            // Mock do Reservation.findOne para retornar null
            jest.spyOn(Reservation_1.default, 'findOne').mockResolvedValue(null);
            // Executar a função
            yield (0, paymentController_1.processPayment)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Reserva não encontrada' });
        }));
        it('should return 404 if campaign is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mock com campanha não encontrada
            mockRequest.body = {
                method: 'PIX',
                campaignId: new mongoose_1.default.Types.ObjectId().toString(),
                amount: 100,
                paymentType: 'campaign_publication'
            };
            // Mock do Campaign.findOne para retornar null
            const Campaign = require('../../model/Campaign').default;
            Campaign.findOne.mockResolvedValue(null);
            // Executar a função
            yield (0, paymentController_1.processPayment)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Campanha não encontrada' });
        }));
        it('should return 400 if campaign is already paid', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // Configurar mock com campanha já paga
            mockRequest.body = {
                method: 'PIX',
                campaignId: new mongoose_1.default.Types.ObjectId().toString(),
                amount: 100,
                paymentType: 'campaign_publication'
            };
            // Mock do Campaign.findOne para retornar campanha já paga
            const Campaign = require('../../model/Campaign').default;
            Campaign.findOne.mockResolvedValue({
                _id: mockRequest.body.campaignId,
                userId: (_a = mockRequest.user) === null || _a === void 0 ? void 0 : _a.id,
                paymentStatus: 'completed'
            });
            // Executar a função
            yield (0, paymentController_1.processPayment)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Esta campanha já foi paga' });
        }));
        it('should return 400 if there is a pending payment for the reservation', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // Configurar mock
            mockRequest.body = {
                method: 'PIX',
                reservationId: new mongoose_1.default.Types.ObjectId().toString(),
                amount: 100,
                paymentType: 'reservation'
            };
            // Mock da reserva
            jest.spyOn(Reservation_1.default, 'findOne').mockResolvedValue({
                _id: mockRequest.body.reservationId,
                userId: (_a = mockRequest.user) === null || _a === void 0 ? void 0 : _a.id,
            });
            // Mock do pagamento pendente
            const mockExistingPayment = {
                _id: new mongoose_1.default.Types.ObjectId(),
            };
            jest.spyOn(Payment_1.default, 'findOne').mockResolvedValue(mockExistingPayment);
            // Executar a função
            yield (0, paymentController_1.processPayment)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Já existe um pagamento pendente para esta reserva',
                paymentId: mockExistingPayment._id
            });
        }));
        it('should process PIX payment successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // Configurar mock
            mockRequest.body = {
                method: 'PIX',
                reservationId: new mongoose_1.default.Types.ObjectId().toString(),
                amount: 100,
                paymentType: 'reservation'
            };
            // Mock da reserva
            jest.spyOn(Reservation_1.default, 'findOne').mockResolvedValue({
                _id: mockRequest.body.reservationId,
                userId: (_a = mockRequest.user) === null || _a === void 0 ? void 0 : _a.id,
                save: jest.fn().mockResolvedValue(true),
            });
            // Mock do pagamento (nenhum pagamento pendente)
            jest.spyOn(Payment_1.default, 'findOne').mockResolvedValue(null);
            // Mock do modelo Payment
            const mockPaymentId = new mongoose_1.default.Types.ObjectId();
            const mockPixDetails = {
                code: 'PIX123456',
                qrCode: 'QRPIX123456'
            };
            // Mock do construtor e save do Payment
            jest.spyOn(Payment_1.default.prototype, 'save').mockResolvedValue({
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
            yield (0, paymentController_1.processPayment)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(responseObject).toHaveProperty('success', true);
            expect(responseObject).toHaveProperty('paymentId');
            expect(responseObject).toHaveProperty('paymentDetails');
            expect(responseObject.paymentDetails).toHaveProperty('pixCode', mockPixDetails.code);
            expect(responseObject.paymentDetails).toHaveProperty('pixQRCode', mockPixDetails.qrCode);
        }));
        it('should process Boleto payment successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // Configurar mock
            mockRequest.body = {
                method: 'Boleto',
                reservationId: new mongoose_1.default.Types.ObjectId().toString(),
                amount: 100,
                paymentType: 'reservation'
            };
            // Mock da reserva
            jest.spyOn(Reservation_1.default, 'findOne').mockResolvedValue({
                _id: mockRequest.body.reservationId,
                userId: (_a = mockRequest.user) === null || _a === void 0 ? void 0 : _a.id,
                save: jest.fn().mockResolvedValue(true),
            });
            // Mock do pagamento (nenhum pagamento pendente)
            jest.spyOn(Payment_1.default, 'findOne').mockResolvedValue(null);
            // Mock do modelo Payment
            const mockPaymentId = new mongoose_1.default.Types.ObjectId();
            const mockBoletoDetails = {
                code: 'BOLETO123456',
                url: 'https://example.com/boleto/123456'
            };
            // Mock do construtor e save do Payment
            jest.spyOn(Payment_1.default.prototype, 'save').mockResolvedValue({
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
            yield (0, paymentController_1.processPayment)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(responseObject).toHaveProperty('success', true);
            expect(responseObject).toHaveProperty('paymentId');
            expect(responseObject).toHaveProperty('paymentDetails');
            expect(responseObject.paymentDetails).toHaveProperty('boletoCode', mockBoletoDetails.code);
            expect(responseObject.paymentDetails).toHaveProperty('boletoUrl', mockBoletoDetails.url);
        }));
        it('should process Stripe payment successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // Configurar mock
            mockRequest.body = {
                method: 'Stripe',
                reservationId: new mongoose_1.default.Types.ObjectId().toString(),
                amount: 100,
                paymentType: 'reservation'
            };
            // Mock da reserva
            jest.spyOn(Reservation_1.default, 'findOne').mockResolvedValue({
                _id: mockRequest.body.reservationId,
                userId: (_a = mockRequest.user) === null || _a === void 0 ? void 0 : _a.id,
                save: jest.fn().mockResolvedValue(true),
            });
            // Mock do pagamento (nenhum pagamento pendente)
            jest.spyOn(Payment_1.default, 'findOne').mockResolvedValue(null);
            // Mock do modelo Payment
            const mockPaymentId = new mongoose_1.default.Types.ObjectId();
            const mockStripeSession = {
                sessionId: 'sess_123456789',
                url: 'https://checkout.stripe.com/pay/cs_test_123456789'
            };
            // Mock do construtor e save do Payment
            jest.spyOn(Payment_1.default.prototype, 'save').mockResolvedValue({
                _id: mockPaymentId,
                paymentDetails: {
                    stripeSessionId: mockStripeSession.sessionId,
                    expirationDate: expect.any(Date)
                }
            });
            // Mock do serviço de pagamento Stripe
            jest.spyOn(stripeService, 'createStripeCheckoutSession').mockResolvedValue(mockStripeSession);
            // Executar a função
            yield (0, paymentController_1.processPayment)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(responseObject).toHaveProperty('success', true);
            expect(responseObject).toHaveProperty('paymentId');
            expect(responseObject).toHaveProperty('paymentDetails');
            expect(responseObject.paymentDetails).toHaveProperty('checkoutUrl', mockStripeSession.url);
        }));
        it('should handle Stripe payment error', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // Configurar mock
            mockRequest.body = {
                method: 'Stripe',
                reservationId: new mongoose_1.default.Types.ObjectId().toString(),
                amount: 100,
                paymentType: 'reservation'
            };
            // Mock da reserva
            jest.spyOn(Reservation_1.default, 'findOne').mockResolvedValue({
                _id: mockRequest.body.reservationId,
                userId: (_a = mockRequest.user) === null || _a === void 0 ? void 0 : _a.id,
            });
            // Mock do pagamento (nenhum pagamento pendente)
            jest.spyOn(Payment_1.default, 'findOne').mockResolvedValue(null);
            // Mock do serviço de pagamento Stripe com erro
            jest.spyOn(stripeService, 'createStripeCheckoutSession').mockRejectedValue(new Error('Stripe API error'));
            // Executar a função
            yield (0, paymentController_1.processPayment)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Erro ao processar pagamento com Stripe' });
        }));
    });
    describe('getPaymentStatus', () => {
        it('should return 401 if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mock sem usuário autenticado
            mockRequest.user = undefined;
            // Executar a função
            yield (0, paymentController_1.getPaymentStatus)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Usuário não autenticado' });
        }));
        it('should return 404 if payment is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mock
            mockRequest.params = {
                paymentId: new mongoose_1.default.Types.ObjectId().toString()
            };
            // Mock do Payment.findOne para retornar null
            jest.spyOn(Payment_1.default, 'findOne').mockResolvedValue(null);
            // Executar a função
            yield (0, paymentController_1.getPaymentStatus)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Pagamento não encontrado' });
        }));
        it('should return payment status successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mock
            mockRequest.params = {
                paymentId: new mongoose_1.default.Types.ObjectId().toString()
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
            jest.spyOn(Payment_1.default, 'findOne').mockResolvedValue(mockPayment);
            // Executar a função
            yield (0, paymentController_1.getPaymentStatus)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: mockPayment.status,
                paymentDetails: mockPayment.paymentDetails
            });
        }));
    });
    describe('cancelPayment', () => {
        it('should return 401 if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mock sem usuário autenticado
            mockRequest.user = undefined;
            // Executar a função
            yield (0, paymentController_1.cancelPayment)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Usuário não autenticado' });
        }));
        it('should return 404 if payment is not found or cannot be cancelled', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mock
            mockRequest.params = {
                paymentId: new mongoose_1.default.Types.ObjectId().toString()
            };
            // Mock do Payment.findOne para retornar null
            jest.spyOn(Payment_1.default, 'findOne').mockResolvedValue(null);
            // Executar a função
            yield (0, paymentController_1.cancelPayment)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Pagamento não encontrado ou não pode ser cancelado' });
        }));
        it('should cancel payment successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mock
            mockRequest.params = {
                paymentId: new mongoose_1.default.Types.ObjectId().toString()
            };
            // Mock do pagamento
            const mockPayment = {
                _id: mockRequest.params.paymentId,
                status: 'pending',
                reservationId: new mongoose_1.default.Types.ObjectId(),
                save: jest.fn().mockResolvedValue(true),
                updatedAt: new Date()
            };
            // Mock do Payment.findOne
            jest.spyOn(Payment_1.default, 'findOne').mockResolvedValue(mockPayment);
            // Mock do Reservation.findByIdAndUpdate
            jest.spyOn(Reservation_1.default, 'findByIdAndUpdate').mockResolvedValue({});
            // Executar a função
            yield (0, paymentController_1.cancelPayment)(mockRequest, mockResponse);
            // Verificar resultado
            expect(mockPayment.status).toBe('cancelled');
            expect(mockPayment.save).toHaveBeenCalled();
            expect(Reservation_1.default.findByIdAndUpdate).toHaveBeenCalledWith(mockPayment.reservationId, {
                paymentStatus: 'cancelled'
            });
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Pagamento cancelado com sucesso' });
        }));
    });
});
