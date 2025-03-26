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
exports.stripeWebhookHandler = void 0;
const stripeService_1 = require("../services/stripeService");
const stripe_1 = __importDefault(require("../config/stripe"));
/**
 * Handles Stripe webhook events
 */
const stripeWebhookHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = req.headers['stripe-signature'];
    if (!signature) {
        res.status(400).json({ message: 'Stripe signature missing' });
        return;
    }
    try {
        // Verify the event came from Stripe
        const event = stripe_1.default.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        // Process the event
        const result = yield (0, stripeService_1.handleStripeWebhook)(event);
        res.json(result);
    }
    catch (error) {
        console.error('Webhook error:', error);
        res.status(400).json({ message: 'Webhook error', error: error.message });
    }
});
exports.stripeWebhookHandler = stripeWebhookHandler;
