import { Category } from '../models/Category';
import { User } from '../models/User';

export async function listCategories() {
  return Category.find({ isActive: true });
}

export async function listProviders(serviceId?: string) {
  // If we wanted to filter by service, we'd need to look up which providers offer it.
  // For now, just return all providers.
  return User.find({ role: 'provider' }).select('-password');
}

export async function getProvider(providerId: string) {
  return User.findById(providerId).select('-password');
}
