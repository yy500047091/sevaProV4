import { Router } from 'express';
import { Service } from '../models/Service';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const services = await Service.find();
    res.json({ services });
  } catch {
    res.status(500).json({ error: 'Failed to fetch services.' });
  }
});

export default router;
