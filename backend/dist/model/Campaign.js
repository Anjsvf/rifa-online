"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const campaignSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    quota: { type: Number, required: true },
    price: { type: Number, required: true },
    phone: { type: String, required: true },
    prizeType: { type: String, required: true },
    customPrize: { type: String },
    image: { type: String, required: true },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.default = mongoose_1.default.model('Campaign', campaignSchema);
