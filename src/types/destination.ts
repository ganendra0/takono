export type DestinationStatus = 'draft' | 'published' | 'archived';
export type ExplorePointStatus = 'draft' | 'published' | 'archived';
export type EventStatus = 'draft' | 'published' | 'ended' | 'cancelled';
export type RewardStatus = 'draft' | 'active' | 'out_of_stock' | 'expired' | 'archived';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  pointsAwarded: number; // default 10 points
}

export interface Quiz {
  id: string;
  explorePointId: string;
  destinationId: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  questions: QuizQuestion[];
  pointsPerCorrect: number;
  totalPointsAvailable: number;
}

export interface ExplorePoint {
  id: string;
  destinationId: string;
  name: string;
  sequenceOrder: number;
  category: 'heritage' | 'nature' | 'craft' | 'culinary' | 'ritual' | 'architecture';
  status: ExplorePointStatus;
  shortDescription: string;
  story: string;
  facts: string[];
  education: {
    culturalNorms: string;
    ecoGuidelines: string;
    etiquette: string;
  };
  activity: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  locationName: string;
  estimatedMinutes: number;
  completionPoints: number; // +5 on completion
  isManagerRecommended?: boolean;
  imageUrl: string;
  qrCodeId: string;
}

export interface DestinationEvent {
  id: string;
  destinationId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: EventStatus;
  qrCodeId: string;
  badgeEarned?: string;
}

export interface DestinationReward {
  id: string;
  destinationId: string;
  umkmId?: string; // Optional partnership with UMKM
  title: string;
  description: string;
  pointsCost: number;
  initialStock: number;
  currentStock: number;
  validUntil: string;
  status: RewardStatus;
  terms: string;
  category: 'voucher' | 'souvenir' | 'workshop' | 'culinary';
  imageUrl: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  province: string;
  regency: string;
  address: string;
  status: DestinationStatus;
  managerId: string;
  managerName: string;
  heroImage: string;
  ticketPriceIdr: number;
  openingHours: string;
  featuredExplorePointsCount?: number;
  connectedUmkmIds: string[];
  qrCodeId: string;
  createdAt: string;
  updatedAt: string;
}
