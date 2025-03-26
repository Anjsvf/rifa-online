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
const stripeService_1 = require("../../services/stripeService");
const stripe_1 = __importDefault(require("../../config/stripe"));
const Reservation_1 = __importDefault(require("../../model/Reservation"));
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
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Limpar mocks após todos os testes
        jest.restoreAllMocks();
    }));
    describe('createStripeCheckoutSession', () => {
        it('should create a checkout session for reservation payment', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock dos dados de entrada
            const mockPayment = {
                _id: new mongoose_1.default.Types.ObjectId(),
                userId: new mongoose_1.default.Types.ObjectId(),
                reservationId: new mongoose_1.default.Types.ObjectId(),
                amount: 100,
                paymentType: 'reservation',
            };
            // Mock da reserva
            const mockReservation = {
                _id: mockPayment.reservationId,
                numbers: [1, 2, 3],
            };
            // Mock da resposta do Stripe
            const mockStripeSession = {
                id: 'sess_123456789',
                url: 'https://checkout.stripe.com/pay/cs_test_123456789',
            };
            // Configurar mocks
            jest.spyOn(Reservation_1.default, 'findById').mockResolvedValue(mockReservation);
            jest.spyOn(stripe_1.default.checkout.sessions, 'create').mockResolvedValue(mockStripeSession);
            // Executar a função
            const result = yield (0, stripeService_1.createStripeCheckoutSession)(mockPayment);
            // Verificar resultado
            expect(result).toEqual({
                sessionId: mockStripeSession.id,
                url: mockStripeSession.url,
            });
            // Verificar se o Stripe foi chamado com os parâmetros corretos
            expect(stripe_1.default.checkout.sessions.create).toHaveBeenCalledWith({
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
        }));
        it('should create a checkout session for campaign publication payment', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock dos dados de entrada
            const mockPayment = {
                _id: new mongoose_1.default.Types.ObjectId(),
                userId: new mongoose_1.default.Types.ObjectId(),
                campaignId: new mongoose_1.default.Types.ObjectId(),
                amount: 50,
                paymentType: 'campaign_publication',
            };
            // Mock da campanha
            const mockCampaign = {
                _id: mockPayment.campaignId,
                name: 'Campanha Teste',
            };
            // Mock da resposta do Stripe
            const mockStripeSession = {
                id: 'sess_987654321',
                url: 'https://checkout.stripe.com/pay/cs_test_987654321',
            };
            // Configurar mocks
            const Campaign = require('../../model/Campaign').default;
            Campaign.findById.mockResolvedValue(mockCampaign);
            jest.spyOn(stripe_1.default.checkout.sessions, 'create').mockResolvedValue(mockStripeSession);
            // Executar a função
            const result = yield (0, stripeService_1.createStripeCheckoutSession)(mockPayment);
            // Verificar resultado
            expect(result).toEqual({
                sessionId: mockStripeSession.id,
                url: mockStripeSession.url,
            });
            expect(stripe_1.default.checkout.sessions.create).toHaveBeenCalledWith({
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
        }));
        it('should throw an error if campaign is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock dos dados de entrada
            const mockPayment = {
                _id: new mongoose_1.default.Types.ObjectId(),
                userId: new mongoose_1.default.Types.ObjectId(),
                campaignId: new mongoose_1.default.Types.ObjectId(),
                amount: 50,
                paymentType: 'campaign_publication',
            };
            // Configurar mock para retornar null (campanha não encontrada)
            const Campaign = require('../../model/Campaign').default;
            Campaign.findById.mockResolvedValue(null);
            // Executar a função e verificar se lança erro
            yield expect((0, stripeService_1.createStripeCheckoutSession)(mockPayment))
                .rejects
                .toThrow('Campaign not found');
        }));
        it('should throw an error if reservation is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock dos dados de entrada
            const mockPayment = {
                _id: new mongoose_1.default.Types.ObjectId(),
                userId: new mongoose_1.default.Types.ObjectId(),
                reservationId: new mongoose_1.default.Types.ObjectId(),
                amount: 100,
                paymentType: 'reservation',
            };
            // Configurar mock para retornar null (reserva não encontrada)
            jest.spyOn(Reservation_1.default, 'findById').mockResolvedValue(null);
            // Executar a função e verificar se lança erro
            yield expect((0, stripeService_1.createStripeCheckoutSession)(mockPayment))
                .rejects
                .toThrow('Reservation not found');
        }));
        it('should throw an error if payment type is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock dos dados de entrada com tipo de pagamento inválido
            const mockPayment = {
                _id: new mongoose_1.default.Types.ObjectId(),
                userId: new mongoose_1.default.Types.ObjectId(),
                amount: 100,
                paymentType: 'invalid_type',
            };
            // Executar a função e verificar se lança erro
            yield expect((0, stripeService_1.createStripeCheckoutSession)(mockPayment))
                .rejects
                .toThrow('Invalid payment type: missing reservationId or campaignId');
        }));
    });
    describe('verifyStripePayment', () => {
        it('should return payment status from Stripe session', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock da resposta do Stripe
            const mockStripeSession = {
                id: 'sess_123456789',
                payment_status: 'paid',
            };
            // Configurar mock
            jest.spyOn(stripe_1.default.checkout.sessions, 'retrieve').mockResolvedValue(mockStripeSession);
            // Executar a função
            const result = yield (0, stripeService_1.verifyStripePayment)('sess_123456789');
            // Verificar resultado
            expect(result).toEqual({
                status: 'paid',
            });
            // Verificar se o Stripe foi chamado com o parâmetro correto
            expect(stripe_1.default.checkout.sessions.retrieve).toHaveBeenCalledWith('sess_123456789');
        }));
        it('should throw an error if Stripe API fails', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mock para lançar erro
            jest.spyOn(stripe_1.default.checkout.sessions, 'retrieve').mockRejectedValue(new Error('Stripe API error'));
            // Executar a função e verificar se lança erro
            yield expect((0, stripeService_1.verifyStripePayment)('sess_123456789'))
                .rejects
                .toThrow('Stripe API error');
        }));
    });
    describe('handleStripeWebhook', () => {
        it('should handle checkout.session.completed event for reservation payment', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock do evento do Stripe
            const mockEvent = {
                type: 'checkout.session.completed',
                data: {
                    object: {
                        metadata: {
                            paymentId: new mongoose_1.default.Types.ObjectId().toString(),
                            reservationId: new mongoose_1.default.Types.ObjectId().toString(),
                        },
                    },
                },
            };
            // Mock do módulo Payment
            const paymentModule = yield Promise.resolve().then(() => __importStar(require('../../model/Payment')));
            const mockPayment = {
                _id: mockEvent.data.object.metadata.paymentId,
                status: 'pending',
            };
            // Configurar mocks
            paymentModule.default.findByIdAndUpdate = jest.fn().mockResolvedValue(mockPayment);
            jest.spyOn(Reservation_1.default, 'findByIdAndUpdate').mockResolvedValue({});
            // Executar a função
            const result = yield (0, stripeService_1.handleStripeWebhook)(mockEvent);
            // Verificar resultado
            expect(result).toEqual({ received: true });
            // Verificar se os métodos foram chamados com os parâmetros corretos
            expect(paymentModule.default.findByIdAndUpdate).toHaveBeenCalledWith(mockEvent.data.object.metadata.paymentId, {
                status: 'completed',
                updatedAt: expect.any(Date)
            }, { new: true });
            expect(Reservation_1.default.findByIdAndUpdate).toHaveBeenCalledWith(mockEvent.data.object.metadata.reservationId, {
                paymentStatus: 'completed',
                status: 'confirmed'
            });
        }));
        it('should handle checkout.session.completed event for campaign payment', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock do evento do Stripe
            const mockEvent = {
                type: 'checkout.session.completed',
                data: {
                    object: {
                        metadata: {
                            paymentId: new mongoose_1.default.Types.ObjectId().toString(),
                            campaignId: new mongoose_1.default.Types.ObjectId().toString(),
                        },
                    },
                },
            };
            // Mock do módulo Payment
            const paymentModule = yield Promise.resolve().then(() => __importStar(require('../../model/Payment')));
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
            const result = yield (0, stripeService_1.handleStripeWebhook)(mockEvent);
            // Verificar resultado
            expect(result).toEqual({ received: true });
            // Verificar se os métodos foram chamados com os parâmetros corretos
            expect(paymentModule.default.findByIdAndUpdate).toHaveBeenCalledWith(mockEvent.data.object.metadata.paymentId, {
                status: 'completed',
                updatedAt: expect.any(Date)
            }, { new: true });
            expect(Campaign.findByIdAndUpdate).toHaveBeenCalledWith(mockEvent.data.object.metadata.campaignId, {
                paymentStatus: 'completed'
            });
        }));
        it('should handle checkout.session.expired event', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock do evento do Stripe
            const mockEvent = {
                type: 'checkout.session.expired',
                data: {
                    object: {
                        metadata: {
                            paymentId: new mongoose_1.default.Types.ObjectId().toString(),
                            reservationId: new mongoose_1.default.Types.ObjectId().toString(),
                        },
                    },
                },
            };
            // Mock do módulo Payment
            const paymentModule = yield Promise.resolve().then(() => __importStar(require('../../model/Payment')));
            // Configurar mocks
            paymentModule.default.findByIdAndUpdate = jest.fn().mockResolvedValue({});
            jest.spyOn(Reservation_1.default, 'findByIdAndUpdate').mockResolvedValue({});
            // Executar a função
            const result = yield (0, stripeService_1.handleStripeWebhook)(mockEvent);
            // Verificar resultado
            expect(result).toEqual({ received: true });
            // Verificar se os métodos foram chamados com os parâmetros corretos
            expect(paymentModule.default.findByIdAndUpdate).toHaveBeenCalledWith(mockEvent.data.object.metadata.paymentId, {
                status: 'failed',
                updatedAt: expect.any(Date)
            });
            expect(Reservation_1.default.findByIdAndUpdate).toHaveBeenCalledWith(mockEvent.data.object.metadata.reservationId, { paymentStatus: 'failed' });
        }));
    });
});
