import { Category } from '../models/Category';
import { User } from '../models/User';

export async function listCategories() {
  return Category.find({ isActive: true });
}

export async function listProviders(serviceId?: string) {
  const query: any = { role: 'provider' };
  if (serviceId) {
    // Filter providers by service if that field is available.
    query.skills = serviceId;
  }
  return User.find(query).select('-password');
}

export async function getProvider(providerId: string) {
  return User.findById(providerId).select('-password');
}
