import express, { Request, Response } from "express";
import { auth } from "../middleware/auth";
import { upload } from "../config/multer";
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  deleteCampaign,
  saveCards,
} from "../controllers/campaignController";

const router = express.Router();

router.post("/", auth, upload.single("image"), createCampaign);
router.get("/", auth, getCampaigns);
router.get("/:id", auth, getCampaignById);
router.delete("/:id", auth, deleteCampaign);
router.post("/:campaignId/cards", auth, saveCards);

export default router;