import { Request, Response } from 'express';
import { listCategories, listProviders } from '../services/provider.service';

export function categoriesController(_req: Request, res: Response) {
  res.json({ categories: listCategories() });
}

export function providersController(req: Request, res: Response) {
  res.json({ providers: listProviders(req.query.serviceId as string | undefined) });
}
