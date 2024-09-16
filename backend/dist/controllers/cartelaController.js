"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartelas = exports.createCartela = void 0;
const cartelaModel_1 = __importDefault(require("../models/cartelaModel"));
const createCartela = async (req, res) => {
    const { numbers } = req.body;
    try {
        const newCartela = new cartelaModel_1.default({ numbers });
        await newCartela.save();
        res.status(201).json(newCartela);
    }
    catch (error) {
        res.status(500).json({ message: 'erro' });
    }
};
exports.createCartela = createCartela;
const getCartelas = async (req, res) => {
    try {
        const cartelas = await cartelaModel_1.default.find();
        res.status(200).json(cartelas);
    }
    catch (error) {
        res.status(500).json({ message: 'erro' });
    }
};
exports.getCartelas = getCartelas;
