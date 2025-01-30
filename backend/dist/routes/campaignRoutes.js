"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const multer_1 = require("../config/multer");
const campaignController_1 = require("../controllers/campaignController");
const router = express_1.default.Router();
router.post("/", auth_1.auth, multer_1.upload.single("image"), campaignController_1.createCampaign);
router.get("/", auth_1.auth, campaignController_1.getCampaigns);
router.get("/:id", auth_1.auth, campaignController_1.getCampaignById);
router.get("/:campaignId/cards", auth_1.auth, campaignController_1.getCampaignCards);
router.delete("/:id", auth_1.auth, campaignController_1.deleteCampaign);
router.post("/:campaignId/cards", auth_1.auth, campaignController_1.saveCards);
exports.default = router;
