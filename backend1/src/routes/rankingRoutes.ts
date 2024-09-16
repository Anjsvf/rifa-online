import { Router } from 'express';
import { getRankings, addRanking } from '../controllers/rankingController';

const router = Router();

router.get('/', getRankings);
router.post('/', addRanking);

export default router;
