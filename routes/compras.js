import { Router } from 'express';
import { comprasPost } from '../controllers/compras.js';

const router = Router();

router.post('/', comprasPost);




export default router;