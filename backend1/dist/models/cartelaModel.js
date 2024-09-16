"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cartelaSchema = new mongoose_1.default.Schema({
    numbers: {
        type: [Number],
        required: true,
    },
});
const Cartela = mongoose_1.default.model('Cartela', cartelaSchema);
exports.default = Cartela;
