"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Defina o esquema do Mongoose
const cardSchema = new mongoose_1.default.Schema({
    numbers: { type: [Number], required: true }, // Campo obrigatório (array de números)
    campaignId: { type: String, required: true }, // Campo obrigatório
    status: {
        type: String,
        enum: ['available', 'reserved', 'sold'],
        default: 'available',
    },
});
// Exporte o modelo
exports.default = mongoose_1.default.model('Card', cardSchema);
