import { ServiceCategory, Provider, Property, BookingHistoryItem, User, Product, Review, SiteContent } from './types';

// Using relative path for deployment compatibility
export const LOGO_URL = './logo.png';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  stats: {
    pros: { value: "2,500+", label: "Verified Pros" },
    clients: { value: "15k+", label: "Happy Clients" },
    items: { value: "1,000s", label: "of Items" },
    support: { value: "24h", label: "Support" }
  },
  socials: {
    facebook: "FB",
    instagram: "IG",
    twitter: "TW"
  },
  footerLabels: {
    exploreTitle: "Explore",
    howItWorks: "How it works",
    serviceList: "Service List",
    points: "Points & Rewards",
    dashboard: "Provider Dashboard",
    supportTitle: "Support",
    helpCenter: "Help Center",
    safety: "Safety Guide",
    tos: "Terms of Service",
    contact: "Contact Support"
  },
  tagline: "Making professional services accessible through skill, trust, and community opportunity. Based in Monrovia, serving globally.",
  copyrightYear: "2024",
  madeIn: "Made with ❤️ in Liberia",
  operatingIn: "Operating Globally"
};

export const MOCK_USERS: User[] = [
  { id: 1, name: "Test User", email: "user@lsers.pro", password: "password123", providerId: 1 },
  { id: 2, name: "John Doe", email: "john@test.com", password: "password123" },
  { id: 3, name: "Massa Washington", email: "massa@test.com", password: "password123" },
  { id: 4, name: "AB Motors", email: "ab@test.com", password: "password123" },
  { id: 5, name: "Fatu Kromah", email: "fatu@test.com", password: "password123" }
];

export const MOCK_REVIEWS: Review[] = [
  { id: 1, providerId: 1, authorId: 2, authorName: "John Doe", rating: 5, comment: "Absolutely phenomenal work! The wiring was done perfectly and they were very professional. Highly recommend.", timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2 },
  { id: 2, providerId: 1, authorId: 3, authorName: "Massa Washington", rating: 4, comment: "Great service, very knowledgeable. They arrived on time and fixed the issue quickly. Would use again.", timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5 },
  { id: 3, providerId: 2, authorId: 5, authorName: "Fatu Kromah", rating: 5, comment: "Fixed my leaking pipe in under an hour. Very clean work and fair pricing. A lifesaver!", timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1 },
  { id: 4, providerId: 3, authorId: 2, authorName: "John Doe", rating: 3, comment: "Did an okay job hanging the shelves, but was a bit late.", timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10 },
  { id: 5, providerId: 13, authorId: 3, authorName: "Massa Washington", rating: 5, comment: "My PC is running faster than ever! They identified the problem right away and had it fixed the same day.", timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3 },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Slightly Used iPhone 13 Pro",
    price: 650,
    description: "Excellent condition iPhone 13 Pro, 256GB in Sierra Blue. No scratches on the screen, battery health at 92%. Comes with original box.",
    sellerName: "John Doe",
    sellerId: 2,
    sellerPhone: "+231776966080",
    photos: ["https://images.unsplash.com/photo-1632569623239-2d9d136fa5a5?w=400&h=400&fit=crop"],
    location: "Sinkor, Monrovia",
    condition: "Used - Like New"
  },
  {
    id: 2,
    title: "Hand-carved Wooden Mask",
    price: 45,
    description: "Beautiful, authentic Liberian wooden mask, perfect for home decor. Carved from local mahogany by a master artisan.",
    sellerName: "Massa Washington",
    sellerId: 3,
    sellerPhone: "+231776966081",
    photos: ["https://images.unsplash.com/photo-1534399124424-023a7b539c27?w=400&h=400&fit=crop"],
    location: "Waterside Market",
    condition: "New"
  },
  {
    id: 3,
    title: "Toyota RAV4 2018",
    price: 18500,
    description: "Reliable and well-maintained 2018 Toyota RAV4. Low mileage, clean interior, recently serviced. Great for Liberian roads.",
    sellerName: "AB Motors",
    sellerId: 4,
    sellerPhone: "+231776966082",
    photos: ["https://images.unsplash.com/photo-1594053097223-f42aa39f2caf?w=400&h=400&fit=crop"],
    location: "Paynesville",
    condition: "Used - Good"
  },
  {
    id: 4,
    title: "Brand New Samsung 55\" Smart TV",
    price: 800,
    description: "Unopened Samsung 55-inch Crystal UHD 4K Smart TV. Won it in a raffle, but already have a good TV. My loss is your gain!",
    sellerName: "Fatu Kromah",
    sellerId: 5,
    sellerPhone: "+231776966083",
    photos: ["https://images.unsplash.com/photo-1622219890522-132d74a496a7?w=400&h=400&fit=crop"],
    location: "Congo Town",
    condition: "New"
  }
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'electrician', title: 'Electrician', icon: '⚡', description: 'Wiring & Repairs', group: 'home' },
  { id: 'plumber', title: 'Plumber', icon: '🔧', description: 'Pipes & Fixtures', group: 'home' },
  { id: 'handyman', title: 'Handyman', icon: '🔨', description: 'General Repairs', group: 'home' },
  { id: 'cleaner', title: 'Cleaner', icon: '🧹', description: 'Home & Office', group: 'home' },
  { id: 'painter', title: 'Painter', icon: '🎨', description: 'Interior & Exterior', group: 'home' },
  { id: 'carpenter', title: 'Carpenter', icon: '🪚', description: 'Wood & Furniture', group: 'home' },
  { id: 'mason', title: 'Mason', icon: '🧱', description: 'Bricks & Concrete', group: 'home' },
  { id: 'roofer', title: 'Roofer', icon: '🏠', description: 'Roof Repair', group: 'home' },
  { id: 'welder', title: 'Welder', icon: '🔥', description: 'Metal Work', group: 'home' },
  { id: 'hvac', title: 'HVAC Tech', icon: '❄️', description: 'AC & Heating', group: 'home' },
  { id: 'property-mgmt', title: 'Property Manager', icon: '🏢', description: 'Airbnb & Rentals', group: 'professional' },
  { id: 'short-term-support', title: 'Hosting Support', icon: '🔑', description: 'Short-term Rentals', group: 'home' },
  { id: 'computer-repair', title: 'Computer Repair', icon: '💻', description: 'Hardware & Software', group: 'tech' },
  { id: 'software-dev', title: 'Software Dev', icon: '👨‍💻', description: 'Apps & Websites', group: 'tech' },
  { id: 'phone-repair', title: 'Phone Repair', icon: '📱', description: 'Mobile Devices', group: 'tech' },
  { id: 'tv-repair', title: 'TV Repair', icon: '📺', description: 'Electronics', group: 'tech' },
  { id: 'network-setup', title: 'Network Setup', icon: '🌐', description: 'WiFi & Internet', group: 'tech' },
  { id: 'graphics-design', title: 'Graphics Design', icon: '🎨', description: 'Logos & Branding', group: 'creative' },
  { id: 'photography', title: 'Photography', icon: '📸', description: 'Events & Portraits', group: 'creative' },
  { id: 'videography', title: 'Videography', icon: '🎥', description: 'Video Production', group: 'creative' },
  { id: 'music-producer', title: 'Music Producer', icon: '🎵', description: 'Audio & Beats', group: 'creative' },
  { id: 'dj', title: 'DJ Services', icon: '🎧', description: 'Events & Parties', group: 'creative' },
  { id: 'tutor', title: 'Tutor', icon: '📚', description: 'Academic Help', group: 'professional' },
  { id: 'freelance-writer', title: 'Freelance Writer', icon: '✍️', description: 'Content & Articles', group: 'professional' },
  { id: 'translator', title: 'Translator', icon: '🌍', description: 'Language Services', group: 'professional' },
  { id: 'accountant', title: 'Accountant', icon: '💰', description: 'Tax & Bookkeeping', group: 'professional' },
  { id: 'legal-advisor', title: 'Legal Advisor', icon: '⚖️', description: 'Legal Consultation', group: 'professional' },
  { id: 'driver', title: 'Driver', icon: '🚗', description: 'Transportation', group: 'transport' },
  { id: 'delivery', title: 'Delivery', icon: '📦', description: 'Package & Food', group: 'transport' },
  { id: 'moving', title: 'Moving Service', icon: '📦', description: 'Relocation Help', group: 'transport' },
  { id: 'mechanic', title: 'Auto Mechanic', icon: '🔧', description: 'Car Repair', group: 'transport' },
  { id: 'motorcycle-repair', title: 'Motorcycle Repair', icon: '🏍️', description: 'Bike Maintenance', group: 'transport' },
  { id: 'barber', title: 'Barber', icon: '✂️', description: 'Hair Cutting', group: 'personal' },
  { id: 'hairstylist', title: 'Hair Stylist', icon: '💇‍♀️', description: 'Hair & Beauty', group: 'personal' },
  { id: 'makeup-artist', title: 'Makeup Artist', icon: '💄', description: 'Beauty & Events', group: 'personal' },
  { id: 'massage-therapist', title: 'Massage Therapist', icon: '💆', description: 'Wellness & Relaxation', group: 'personal' },
  { id: 'fitness-trainer', title: 'Fitness Trainer', icon: '💪', description: 'Personal Training', group: 'personal' },
  { id: 'chef', title: 'Personal Chef', icon: '👨‍🍳', description: 'Cooking Services', group: 'food' },
  { id: 'catering', title: 'Catering', icon: '🍽️', description: 'Event Food', group: 'food' },
  { id: 'baker', title: 'Baker', icon: '🧁', description: 'Cakes & Pastries', group: 'food' },
  { id: 'security-guard', title: 'Security Guard', icon: '🛡️', description: 'Property Protection', group: 'security' },
  { id: 'locksmith', title: 'Locksmith', icon: '🔐', description: 'Lock & Key Services', group: 'security' },
  { id: 'gardener', title: 'Gardener', icon: '🌱', description: 'Landscaping', group: 'outdoor' },
  { id: 'pest-control', title: 'Pest Control', icon: '🐛', description: 'Extermination', group: 'outdoor' },
  { id: 'event-planner', title: 'Event Planner', icon: '🎉', description: 'Party Organization', group: 'event' },
  { id: 'decorator', title: 'Decorator', icon: '🎈', description: 'Event Decoration', group: 'event' },
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 1,
    title: "Luxury Oceanview Villa",
    location: "Monrovia, Robertsfield Hwy",
    pricePerNight: 150,
    rating: 4.9,
    reviews: 42,
    photoId: "1564013799-b1ddec28a941",
    description: "Experience the ultimate beach getaway in our stunning 3-bedroom villa. Featuring panoramic ocean views, private beach access, and a fully equipped modern kitchen.",
    hostName: "Kema Johnson",
    hostPhone: "+231776966080",
    amenities: ["Free WiFi", "Private Pool", "Air Conditioning", "Security 24/7"]
  },
  {
    id: 2,
    title: "Modern City Apartment",
    location: "Sinkor, 12th Street",
    pricePerNight: 85,
    rating: 4.7,
    reviews: 128,
    photoId: "1502672260266-1c1ef2d93688",
    description: "Perfect for business travelers, this sleek apartment is located in the heart of Sinkor. Close to UN offices, restaurants, and shopping centers.",
    hostName: "Musa Kamara",
    hostPhone: "+231776966081",
    amenities: ["High-speed Internet", "Work Space", "Generator Backup", "Laundry"]
  },
  {
    id: 3,
    title: "Peaceful Garden Cottage",
    location: "Paynesville, Rehab",
    pricePerNight: 65,
    rating: 4.8,
    reviews: 15,
    photoId: "1580587771525-78b9ec3bca4b",
    description: "Tucked away in a quiet neighborhood, this cozy cottage is surrounded by lush tropical gardens. A perfect retreat for couples or solo travelers.",
    hostName: "Sarah Doe",
    hostPhone: "+231776966082",
    amenities: ["Tropical Garden", "Breakfast Included", "Kitchenette", "Free Parking"]
  },
  {
    id: 4,
    title: "Executive Penthouse Suite",
    location: "Mamba Point",
    pricePerNight: 210,
    rating: 5.0,
    reviews: 8,
    photoId: "1512917774080-9991f1c4c750",
    description: "The most exclusive stay in Mamba Point. Overlooking the Atlantic Ocean, this penthouse offers world-class luxury and unmatched privacy.",
    hostName: "Ambassador Suites",
    hostPhone: "+231776966083",
    amenities: ["Private Elevator", "Concierge", "Gym Access", "Rooftop Terrace"]
  }
];

const generateMockProviders = (): Provider[] => {
  const providers: Provider[] = [];
  let idCounter = 1;

  const photoBatch = [
    "1507003211-a90c1637-c24c-4608-8d2e-71fbb9226f2c",
    "1438761681-c6cb0372-6b8c-4b42-96dc-4fdfba394b65",
    "1500648767791-00dcc994a43e",
    "1494790108-ea87e2ac-c304-4554-aa09-f8c8093e5610",
    "1472099645-e36c4e4a70f6",
    "1539571696357-5a69c17a67c6",
    "1506794778202-cad84cf45f1d",
    "1544005313-94ddf0286df2"
  ];

  const portfolioSamples = [
    { photo: "https://images.unsplash.com/photo-1581092160607-ee22621ddbb3?w=800&h=600&fit=crop", title: "Smart Home Installation", description: "Complete rewiring and smart control panel integration for a luxury villa." },
    { photo: "https://images.unsplash.com/photo-1504148455328-497c1121d494?w=800&h=600&fit=crop", title: "Modern Lighting Design", description: "Architectural lighting setup for a high-end restaurant in Monrovia." },
    { photo: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop", title: "Kitchen Renovation", description: "Full plumbing and appliance installation for a modern home makeover." }
  ];

  SERVICE_CATEGORIES.forEach(cat => {
    providers.push({
      id: idCounter++,
      name: `Expert ${cat.title} 1`,
      distance: (0.5 + Math.random() * 5).toFixed(1) + " miles",
      distanceValue: 0.5 + Math.random() * 4.5,
      priceValue: 30 + Math.floor(Math.random() * 100),
      experience: (3 + Math.floor(Math.random() * 10)) + " years",
      specialties: cat.description.split(" & "),
      availability: "now",
      photoId: photoBatch[idCounter % photoBatch.length],
      phone: "+23177" + Math.floor(1000000 + Math.random() * 9000000),
      bio: `Professional ${cat.title} with extensive experience in ${cat.description}. Highly recommended in the community for high-quality workmanship and reliability.`,
      certifications: ["Verified Professional", "Safe Work Certified"],
      completedJobs: 50 + Math.floor(Math.random() * 500),
      responseTime: "15 mins",
      languages: ["English"],
      category: cat.id,
      portfolio: portfolioSamples,
      status: 'active',
      latitude: 6.31 + (Math.random() - 0.5) * 0.1,
      longitude: -10.8 + (Math.random() - 0.5) * 0.15,
    });
  });

  return providers;
};

export const MOCK_PROVIDERS: Provider[] = generateMockProviders();

export const MOCK_BOOKING_HISTORY: BookingHistoryItem[] = [
  {
    id: "bh1",
    type: "service",
    name: "Plumbing Service",
    providerOrHost: "Expert Plumber 1",
    date: "2024-07-15",
    status: "Completed",
    cost: 75,
    icon: "🔧"
  },
  {
    id: "bh2",
    type: "property",
    name: "Luxury Oceanview Villa",
    providerOrHost: "Kema Johnson",
    date: "2024-07-20",
    status: "Upcoming",
    cost: 450,
    icon: "🏡"
  },
  {
    id: "bh3",
    type: "service",
    name: "Electrician",
    providerOrHost: "Expert Electrician 1",
    date: "2024-06-01",
    status: "Completed",
    cost: 120,
    icon: "⚡"
  },
  {
    id: "bh4",
    type: "service",
    name: "Graphics Design",
    providerOrHost: "Expert Graphics Design 1",
    date: "2024-05-25",
    status: "Cancelled",
    cost: 250,
    icon: "🎨"
  },
    {
    id: "bh5",
    type: "property",
    name: "Modern City Apartment",
    providerOrHost: "Musa Kamara",
    date: "2024-04-10",
    status: "Completed",
    cost: 170,
    icon: "🏢"
  },
];