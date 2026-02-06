
export type Availability = 'now' | 'today' | 'tomorrow';

export interface PortfolioItem {
  photo: string;
  title: string;
  description: string;
}

export interface Review {
  id: number;
  providerId: number;
  authorId: number;
  authorName: string;
  rating: number; // 1-5
  comment: string;
  timestamp: number;
}

export interface NewProviderPayload {
  name: string;
  category: string;
  phone: string;
  priceValue: number;
  status: Provider['status'];
  bio: string;
  experience: string;
  specialties: string[];
  certifications: string[];
  photoDataUrl: string;
  latitude: number;
  longitude: number;
}

export interface Provider {
  id: number;
  name: string;
  distance: string;
  distanceValue: number;
  priceValue: number;
  experience: string;
  specialties: string[];
  availability: Availability;
  photoId: string;
  photoDataUrl?: string;
  phone: string;
  whatsapp?: string;
  bio: string;
  certifications: string[];
  completedJobs: number;
  responseTime: string;
  languages: string[];
  category: string;
  portfolio?: PortfolioItem[];
  status: 'active' | 'inactive' | 'pending';
  latitude?: number;
  longitude?: number;
}

export interface Property {
  id: number;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  reviews: number;
  photoId: string;
  description: string;
  hostName: string;
  hostPhone: string;
  amenities: string[];
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  sellerName: string;
  sellerId: number;
  sellerPhone: string;
  photos: string[];
  location: string;
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // Only for mock data simulation
  providerId?: number;
}

export interface ServiceCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  group: 'home' | 'tech' | 'creative' | 'professional' | 'transport' | 'personal' | 'food' | 'security' | 'outdoor' | 'event';
}

export interface BookingRequest {
  providerId: number;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  description: string;
}

export interface ConfirmationData {
  title: string;
  subtitle: string;
  details: { label: string; value: string }[];
  whatsappLink: string;
  pointsEarned: number;
}

export interface BookingHistoryItem {
  id: string;
  type: 'service' | 'property';
  name: string; 
  providerOrHost: string;
  date: string;
  status: 'Completed' | 'Cancelled' | 'Upcoming';
  cost: number;
  icon: string;
}

export interface ChatMessage {
  sender: 'user' | 'provider' | 'system';
  text: string;
  timestamp: number;
}

export interface FavoriteItem {
  type: 'provider' | 'product';
  id: number;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface SiteStats {
  pros: StatItem;
  clients: StatItem;
  items: StatItem;
  support: StatItem;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
}

export interface FooterLabels {
  exploreTitle: string;
  howItWorks: string;
  serviceList: string;
  points: string;
  dashboard: string;
  supportTitle: string;
  helpCenter: string;
  safety: string;
  tos: string;
  contact: string;
}

export interface SiteContent {
  stats: SiteStats;
  socials: SocialLinks;
  footerLabels: FooterLabels;
  tagline: string;
  copyrightYear: string;
  madeIn: string;
  operatingIn: string;
}

export type ViewState = 'welcome' | 'customer' | 'provider' | 'admin' | 'marketplace' | 'history' | 'favorites';
export type Theme = 'light' | 'dark';
