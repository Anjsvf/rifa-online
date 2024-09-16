"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCampaign = void 0;
const campaignModel_1 = __importDefault(require("../models/campaignModel"));
const createCampaign = async (req, res) => {
    try {
        const { name, quota, price, phone, prizeType, customPrize } = req.body;
        const image = req.file?.path;
        const newCampaign = new campaignModel_1.default({
            name,
            quota,
            price,
            phone,
            prizeType,
            customPrize,
            image,
        });
        const savedCampaign = await newCampaign.save();
        res.status(201).json(savedCampaign);
        // Aguarda 2 minutos e depois gera as cartelas
        setTimeout(() => {
        }, 120000);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao criar a campanha', error });
    }
};
exports.createCampaign = createCampaign;
const generateCards = async (campaignId) => {
    try {
        // Lógica para gerar cartelas
        console.log(`Cartelas geradas para a campanha ${campaignId}`);
    }
    catch (error) {
        console.error('Erro ao gerar as cartelas:', error);
    }
};
