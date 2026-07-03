import { Router } from 'express';
import { categoriesController, providersController } from '../controllers/provider.controller';

const router = Router();

router.get('/categories', categoriesController);
router.get('/providers', providersController);

export default router;
