import { Request, Response } from 'express';
import { listCategories, listProviders } from '../services/provider.service';

export async function categoriesController(_req: Request, res: Response) {
  const categories = await listCategories();
  res.json({ categories });
}

export async function providersController(req: Request, res: Response) {
  const providers = await listProviders(req.query.serviceId as string | undefined);
  res.json({ providers });
}
