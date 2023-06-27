import { Router } from 'express';
import { comprasPost, webhookPost } from '../controllers/compras.js';

const router = Router();

router.post('/', comprasPost);
router.post('/webhook', webhookPost);




export default router;