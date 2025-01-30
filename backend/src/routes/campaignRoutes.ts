import express from "express";
import { auth } from "../middleware/auth";
import { upload } from "../config/multer";
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  deleteCampaign,
  saveCards,
  getCampaignCards 
} from "../controllers/campaignController";

const router = express.Router();

router.post("/", auth, upload.single("image"), createCampaign);
router.get("/", auth, getCampaigns);
router.get("/:id", auth, getCampaignById);
router.get("/:campaignId/cards", auth, getCampaignCards); 
router.delete("/:id", auth, deleteCampaign);
router.post("/:campaignId/cards", auth, saveCards);

export default router;