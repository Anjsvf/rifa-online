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
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const multer_1 = require("../config/multer");
const campaignController_1 = require("../controllers/campaignController");
const model_1 = require("../model");
const generateCampaignCards_1 = require("../utils/generateCampaignCards");
const router = express_1.default.Router();
router.post('/', auth_1.auth, multer_1.upload.single('image'), campaignController_1.createCampaign);
router.get('/', auth_1.auth, campaignController_1.getCampaigns);
router.get('/:id', auth_1.auth, campaignController_1.getCampaignById);
router.post('/:campaignId/generate-cards', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const campaign = yield model_1.Campaign.findOne({
            _id: req.params.campaignId,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        });
        if (!campaign) {
            res.status(404).json({ error: 'Campaign not found' });
            return;
        }
        // Verifica se as cartelas já foram geradas para essa campanha
        const existingCards = yield model_1.Card.find({ campaignId: campaign._id });
        if (existingCards.length > 0) {
            res.status(400).json({ error: 'Cards already generated for this campaign' });
            return;
        }
        // Gera as cartelas e as salva no banco de dados
        const cards = yield (0, generateCampaignCards_1.generateCampaignCards)(campaign._id, campaign.quota);
        yield model_1.Card.insertMany(cards);
        res.json({ message: 'Cards generated successfully' });
    }
    catch (error) {
        console.error('Error generating cards:', error);
        res.status(500).json({ error: 'Server error' });
    }
}));
// Adicione esta rota para salvar as cartelas
router.post('/:campaignId/cards', auth_1.auth, campaignController_1.saveCards);
router.delete('/:id', auth_1.auth, campaignController_1.deleteCampaign);
exports.default = router;
