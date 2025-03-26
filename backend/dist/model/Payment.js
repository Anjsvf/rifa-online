"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const paymentSchema = new mongoose_1.default.Schema({
    reservationId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Reservation', required: false },
    campaignId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Campaign', required: false },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['PIX', 'Boleto', 'Stripe'], required: true },
    paymentType: { type: String, enum: ['reservation', 'campaign_publication'], required: true },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    paymentDetails: {
        pixCode: String,
        pixQRCode: String,
        boletoCode: String,
        boletoUrl: String,
        stripeSessionId: String,
        stripePaymentIntentId: String,
        expirationDate: { type: Date, required: true }
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Payment', paymentSchema);
