import { Router } from 'express';
import { createCartela, getCartelas } from '../controllers/cartelaController';

const router = Router();

router.post('/', createCartela);
router.get('/', getCartelas);

export default router;
