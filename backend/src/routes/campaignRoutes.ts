import express, { Request, Response } from 'express';
import { auth } from '../middleware/auth';
import { upload } from '../config/multer';
import { createCampaign, getCampaigns, getCampaignById, deleteCampaign, saveCards } from '../controllers/campaignController';
import { Campaign, Card } from '../model';
import { generateCampaignCards } from '../utils/generateCampaignCards';
import { getCampaignCards } from '../controllers/campaignController';

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

const router = express.Router();


router.post('/', auth, upload.single('image'), createCampaign);


router.get('/', auth, getCampaigns);


router.get('/:id', auth, getCampaignById);


router.post('/:campaignId/generate-cards', auth, async (req: AuthRequest, res: Response) => {
  try {
    
    const campaign = await Campaign.findOne({
      _id: req.params.campaignId,
      userId: req.user?.id
    });

    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }
   
    // Verifica se as cartelas já foram geradas para essa campanha
    const existingCards = await Card.find({ campaignId: campaign._id });
    if (existingCards.length > 0) {
      res.status(400).json({ error: 'Cards already generated for this campaign' });
      return;
    }

    // Gera as cartelas e as salva no banco de dados
    const cards = await generateCampaignCards(campaign._id, campaign.quota);
    await Card.insertMany(cards);

    res.json({ message: 'Cards generated successfully' });
  } catch (error) {
    console.error('Error generating cards:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Adicione esta rota para salvar as cartelas
router.post('/:campaignId/cards', auth, saveCards);

router.delete('/:id', auth, deleteCampaign);

export default router;