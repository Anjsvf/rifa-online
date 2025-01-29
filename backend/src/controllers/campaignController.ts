import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Campaign from "../model/Campaign";
import Card from "../model/Card";
import { generateCampaignCards } from "../utils/generateCampaignCards";
import { deleteFile } from "../utils/fileUtils";
import path from 'path';

export const getCampaignCards = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { campaignId } = req.params;

    const cards = await Card.find({ campaignId });

    if (cards.length === 0) {
      res
        .status(404)
        .json({ error: "Nenhuma cartela encontrada para esta campanha." });
      return;
    }

    res.status(200).json(cards);
  } catch (error) {
    console.error("Erro ao buscar cartelas:", error);
    res.status(500).json({ error: "Erro ao buscar cartelas." });
  }
};

export const createCampaign = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const price = parseFloat(
      req.body.price.replace(/[^0-9,]/g, "").replace(",", ".")
    );
    if (isNaN(price)) {
      res.status(400).json({ error: "Invalid price format" });
      return;
    }

    const campaign = new Campaign({
      ...req.body,
      price,
      userId: req.user?.id,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await campaign.save();

    const cards = await generateCampaignCards(
      campaign._id,
      parseInt(req.body.quota)
    );
    await Card.insertMany(cards);

    res.status(201).json(campaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCampaigns = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const campaigns = await Campaign.find({ userId: req.user?.id });
    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCampaignById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }
    res.json(campaign);
  } catch (error) {
    console.error("Error fetching campaign details:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteCampaign = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const campaign = await Campaign.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.id, 
    });

    if (!campaign) {
      res.status(404).json({ error: 'Campanha não encontrada.' });
      return;
    }

  
    await Card.deleteMany({ campaignId: req.params.id });

    
    if (campaign.image) {
      const imagePath = path.resolve(__dirname, '..', '..', 'uploads', path.basename(campaign.image));
      await deleteFile(imagePath);
    }

    res.status(200).json({ message: 'Campanha excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir campanha:', error);
    res.status(500).json({ error: 'Erro ao excluir campanha.' });
  }
};


export const saveCards = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { campaignId } = req.params;
    const { cards } = req.body;

    if (!cards || !Array.isArray(cards)) {
      res.status(400).json({ error: "Dados de cartelas inválidos." });
      return;
    }

    const newCards = cards.map((numbers) => ({
      campaignId,
      numbers,
      status: "available",
    }));

    await Card.insertMany(newCards);
    res.status(201).json({ message: "Cartelas salvas com sucesso!" });
  } catch (error) {
    console.error("Erro ao salvar as cartelas:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};