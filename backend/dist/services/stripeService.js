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
exports.handleStripeWebhook = exports.verifyStripePayment = exports.createStripeCheckoutSession = void 0;
const stripe_1 = __importDefault(require("../config/stripe"));
const Reservation_1 = __importDefault(require("../model/Reservation"));
/**
 * Creates a Stripe checkout session for a payment
 */
const createStripeCheckoutSession = (payment) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Prepare line items and metadata based on payment type
        let lineItems;
        const metadata = {
            paymentId: payment._id.toString(),
            userId: payment.userId.toString(),
        };
        // Handle different payment types
        if (payment.paymentType === 'campaign_publication' && payment.campaignId) {
            // Get campaign details for campaign payment
            const Campaign = require('../model/Campaign').default;
            const campaign = yield Campaign.findById(payment.campaignId);
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
        }
        else if (payment.reservationId) {
            // Get reservation details for reservation payment
            const reservation = yield Reservation_1.default.findById(payment.reservationId);
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
        }
        else {
            throw new Error('Invalid payment type: missing reservationId or campaignId');
        }
        // Create a Stripe checkout session
        const session = yield stripe_1.default.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
            metadata: metadata,
        });
        return {
            sessionId: session.id,
            url: session.url,
        };
    }
    catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        throw error;
    }
});
exports.createStripeCheckoutSession = createStripeCheckoutSession;
/**
 * Verifies a Stripe payment session status
 */
const verifyStripePayment = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield stripe_1.default.checkout.sessions.retrieve(sessionId);
        return {
            status: session.payment_status, // 'paid', 'unpaid', etc.
        };
    }
    catch (error) {
        console.error('Error verifying Stripe payment:', error);
        throw error;
    }
});
exports.verifyStripePayment = verifyStripePayment;
/**
 * Handles Stripe webhook events
 */
const handleStripeWebhook = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                // Update payment status in database
                if ((_a = session.metadata) === null || _a === void 0 ? void 0 : _a.paymentId) {
                    const payment = yield Promise.resolve().then(() => __importStar(require('../model/Payment'))).then(module => module.default);
                    const updatedPayment = yield payment.findByIdAndUpdate(session.metadata.paymentId, {
                        status: 'completed',
                        updatedAt: new Date()
                    }, { new: true });
                    // Verificar se é um pagamento de campanha ou reserva
                    if (updatedPayment) {
                        if (session.metadata.reservationId) {
                            // Update reservation status
                            yield Reservation_1.default.findByIdAndUpdate(session.metadata.reservationId, {
                                paymentStatus: 'completed',
                                status: 'confirmed'
                            });
                        }
                        else if (session.metadata.campaignId) {
                            // Update campaign status
                            const Campaign = require('../model/Campaign').default;
                            yield Campaign.findByIdAndUpdate(session.metadata.campaignId, {
                                paymentStatus: 'completed'
                            });
                        }
                    }
                }
                break;
            case 'checkout.session.expired':
                // Handle expired sessions
                const expiredSession = event.data.object;
                if ((_b = expiredSession.metadata) === null || _b === void 0 ? void 0 : _b.paymentId) {
                    const payment = yield Promise.resolve().then(() => __importStar(require('../model/Payment'))).then(module => module.default);
                    yield payment.findByIdAndUpdate(expiredSession.metadata.paymentId, {
                        status: 'failed',
                        updatedAt: new Date()
                    });
                    // Verificar se é um pagamento de campanha ou reserva
                    if (expiredSession.metadata.reservationId) {
                        yield Reservation_1.default.findByIdAndUpdate(expiredSession.metadata.reservationId, { paymentStatus: 'failed' });
                    }
                    else if (expiredSession.metadata.campaignId) {
                        // Update campaign status
                        const Campaign = require('../model/Campaign').default;
                        yield Campaign.findByIdAndUpdate(expiredSession.metadata.campaignId, { paymentStatus: 'failed' });
                    }
                }
                break;
        }
        return { received: true };
    }
    catch (error) {
        console.error('Error handling Stripe webhook:', error);
        throw error;
    }
});
exports.handleStripeWebhook = handleStripeWebhook;
