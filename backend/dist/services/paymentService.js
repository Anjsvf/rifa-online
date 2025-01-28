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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPaymentStatus = exports.generateBoleto = exports.generatePixCode = void 0;
// Gera um código PIX mockado
const generatePixCode = (payment) => __awaiter(void 0, void 0, void 0, function* () {
    const mockPixCode = `PIX${Date.now()}${payment._id.toString().slice(-6)}`;
    const mockQRCode = `QR${mockPixCode}`;
    return {
        code: mockPixCode,
        qrCode: mockQRCode
    };
});
exports.generatePixCode = generatePixCode;
const generateBoleto = (payment) => __awaiter(void 0, void 0, void 0, function* () {
    const mockBoletoCode = `34191.79001 01043.510047 91020.150008 7 ${Date.now()}`;
    const mockBoletoUrl = `https://example.com/boleto/${payment._id}`;
    return {
        code: mockBoletoCode,
        url: mockBoletoUrl
    };
});
exports.generateBoleto = generateBoleto;
const checkPaymentStatus = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        status: 'pending',
        lastCheck: new Date()
    };
});
exports.checkPaymentStatus = checkPaymentStatus;
