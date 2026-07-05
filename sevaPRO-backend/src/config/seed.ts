import { User } from '../models/User';
import { Service } from '../models/Service';
import { Category } from '../models/Category';

const CATEGORIES = [
  { name: 'Cleaning', icon: '🧹', color: '#DBEAFE' },
  { name: 'Plumbing', icon: '🔧', color: '#FEE2E2' },
  { name: 'Electrical', icon: '⚡', color: '#FEF3C7' },
  { name: 'Appliance', icon: '📺', color: '#E0E7FF' },
  { name: 'Carpentry', icon: '🪚', color: '#FFEDD5' },
  { name: 'Painting', icon: '🖌️', color: '#FCE7F3' },
  { name: 'Pest Control', icon: '🪲', color: '#DCFCE7' },
  { name: 'Salon', icon: '💇', color: '#FAE8FF' },
];

const SERVICES_DATA = [
  { name: 'Deep Cleaning', catName: 'Cleaning', description: 'Deep cleaning for your entire home by professionals', price: 1749, duration: 120, icon: '🏠', checklist: ['Reach on time', 'Bring equipment', 'Start work', 'Complete all rooms', 'Final check'] },
  { name: 'Car Wash', catName: 'Cleaning', description: 'Complete exterior and interior car cleaning service', price: 499, duration: 60, icon: '🚗', checklist: ['Foam wash', 'Interior vacuum', 'Tyre polish'] },
  { name: 'Leak Repair', catName: 'Plumbing', description: 'Fix leaks, pipe issues, drainage problems and more', price: 349, duration: 90, icon: '🔧', checklist: ['Inspect leak', 'Replace washers', 'Test flow'] },
  { name: 'Fan Installation', catName: 'Electrical', description: 'Wiring, switches, fans, lighting installation & repair', price: 299, duration: 60, icon: '⚡', checklist: ['Turn off main', 'Mount fixture', 'Check wiring'] },
  { name: 'AC Service', catName: 'Appliance', description: 'AC servicing, gas refilling and deep cleaning', price: 599, duration: 90, icon: '❄️', checklist: ['Clean filters', 'Check gas level', 'Clean coils'] },
];

export async function seedDatabase() {
  const catCount = await Category.countDocuments();
  if (catCount === 0) {
    await Category.insertMany(CATEGORIES);
    console.log('✅ Seeded categories');
  }

  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    const cats = await Category.find();
    const catMap = new Map(cats.map(c => [c.name, c._id]));
    
    const servicesToInsert = SERVICES_DATA.map(s => ({
      name: s.name,
      description: s.description,
      price: s.price,
      duration: s.duration,
      icon: s.icon,
      checklist: s.checklist,
      categoryId: catMap.get(s.catName)
    }));
    await Service.insertMany(servicesToInsert);
    console.log('✅ Seeded services');
  }

  const adminExists = await User.findOne({ email: 'admin@seva.com' });
  if (!adminExists) {
    await User.create({ name: 'Admin', email: 'admin@seva.com', password: 'Admin@123', role: 'admin' });
    console.log('✅ Seeded admin user');
  }

  const providerExists = await User.findOne({ email: 'provider@seva.com' });
  if (!providerExists) {
    await User.create({ name: 'Rohit Sharma', email: 'provider@seva.com', password: 'Provider@123', role: 'provider', phone: '+919876543210', rating: 4.8, totalJobs: 124, profileImage: 'https://i.pravatar.cc/150?u=rohit' });
    console.log('✅ Seeded provider user');
  }
}
