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
exports.saveCards = exports.deleteCampaign = exports.getCampaignById = exports.getCampaigns = exports.createCampaign = exports.getCampaignCards = void 0;
const Campaign_1 = __importDefault(require("../model/Campaign"));
const Card_1 = __importDefault(require("../model/Card"));
const generateCampaignCards_1 = require("../utils/generateCampaignCards");
const fileUtils_1 = require("../utils/fileUtils");
const path_1 = __importDefault(require("path"));
const getCampaignCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaignId } = req.params;
        const cards = yield Card_1.default.find({ campaignId });
        if (cards.length === 0) {
            res
                .status(404)
                .json({ error: "Nenhuma cartela encontrada para esta campanha." });
            return;
        }
        res.status(200).json(cards);
    }
    catch (error) {
        console.error("Erro ao buscar cartelas:", error);
        res.status(500).json({ error: "Erro ao buscar cartelas." });
    }
});
exports.getCampaignCards = getCampaignCards;
const createCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const price = parseFloat(req.body.price.replace(/[^0-9,]/g, "").replace(",", "."));
        if (isNaN(price)) {
            res.status(400).json({ error: "Invalid price format" });
            return;
        }
        const campaign = new Campaign_1.default(Object.assign(Object.assign({}, req.body), { price, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, image: req.file ? `/uploads/${req.file.filename}` : null }));
        yield campaign.save();
        const cards = yield (0, generateCampaignCards_1.generateCampaignCards)(campaign._id, parseInt(req.body.quota));
        yield Card_1.default.insertMany(cards);
        res.status(201).json(campaign);
    }
    catch (error) {
        console.error("Error creating campaign:", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.createCampaign = createCampaign;
const getCampaigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const campaigns = yield Campaign_1.default.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
        res.json(campaigns);
    }
    catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getCampaigns = getCampaigns;
const getCampaignById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = yield Campaign_1.default.findById(req.params.id);
        if (!campaign) {
            res.status(404).json({ error: "Campaign not found" });
            return;
        }
        res.json(campaign);
    }
    catch (error) {
        console.error("Error fetching campaign details:", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getCampaignById = getCampaignById;
const deleteCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const campaign = yield Campaign_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        });
        if (!campaign) {
            res.status(404).json({ error: 'Campanha não encontrada.' });
            return;
        }
        yield Card_1.default.deleteMany({ campaignId: req.params.id });
        if (campaign.image) {
            const imagePath = path_1.default.resolve(__dirname, '..', '..', 'uploads', path_1.default.basename(campaign.image));
            yield (0, fileUtils_1.deleteFile)(imagePath);
        }
        res.status(200).json({ message: 'Campanha excluída com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao excluir campanha:', error);
        res.status(500).json({ error: 'Erro ao excluir campanha.' });
    }
});
exports.deleteCampaign = deleteCampaign;
const saveCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cards } = req.body;
        // Lógica para salvar as cartelas
        yield Card_1.default.insertMany(cards);
        res.status(201).json({ message: 'Cartelas salvas com sucesso' });
    }
    catch (error) {
        console.error('Erro ao salvar as cartelas:', error);
        res.status(500).json({ message: 'Erro ao salvar as cartelas' });
    }
});
exports.saveCards = saveCards;
