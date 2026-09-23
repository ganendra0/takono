// TAKONO Domain Types & Data Contracts

export type UserRole = 'traveler' | 'destination_manager' | 'government' | 'super_admin';

export type ExploreCategory = 
  | 'Edukasi'
  | 'Sejarah'
  | 'Budaya'
  | 'Kuliner'
  | 'Keluarga'
  | 'Alam'
  | 'Foto'
  | 'Santai';

export type LocalDiscoveryCategory = 
  | 'Kuliner'
  | 'Oleh-oleh'
  | 'Produk Lokal'
  | 'Lainnya';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  destinationId?: string; // Assigned destination for destination_manager
  institution?: string; // For government, e.g. "Dinas Kebudayaan & Pariwisata Surabaya"
  pointsBalance: number;
  createdAt: string;
}

export interface DestinationFacility {
  id: string;
  name: string;
  icon: string;
  latitude: number;
  longitude: number;
  description?: string;
}

export interface Destination {
  id: string;
  name: string;
  code: string; // e.g., "KBS"
  slug: string;
  tagline: string;
  description: string;
  heroImage: string;
  gallery: string[];
  address: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  boundaryCoordinates: [number, number][];
  operatingHours: string;
  ticketInfo: string;
  contactPhone: string;
  contactEmail: string;
  facilities: DestinationFacility[];
  status: 'published' | 'draft';
  isDemo: boolean;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string; // Validated on server
  explanation: string;
  points: number;
}

export interface Quiz {
  id: string;
  explorePointId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface ExplorePoint {
  id: string;
  destinationId: string;
  name: string;
  slug: string;
  category: ExploreCategory;
  description: string;
  story: string;
  educationalContent: string;
  funFacts: string[];
  image: string;
  latitude: number;
  longitude: number;
  estimatedDuration: string; // e.g. "15-20 menit"
  difficulty: 'Mudah' | 'Sedang' | 'Menantang';
  secureToken: string; // Unique signed token for /scan/explore/{secureToken}
  pointsReward: number; // e.g. 10
  status: 'published' | 'draft';
  audioGuideUrl?: string;
  quiz?: Quiz;
}

export interface DestinationEvent {
  id: string;
  destinationId: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  time: string;
  location: string;
  organizer: string;
  pointsReward: number;
  status: 'published' | 'upcoming' | 'completed';
}

export interface LocalDiscovery {
  id: string;
  destinationId: string;
  name: string;
  category: LocalDiscoveryCategory;
  description: string;
  image: string;
  address: string;
  latitude: number;
  longitude: number;
  operatingHours: string;
  contact: string;
  phone?: string;
  promotion: string;
  rewardText?: string;
  status: 'published' | 'draft';
  pointsReward?: number;
}

export interface Reward {
  id: string;
  destinationId: string;
  name: string;
  category?: string;
  partner: string;
  description: string;
  image: string;
  pointsRequired: number;
  quota: number;
  stock?: number;
  claimedCount: number;
  validUntil: string;
  terms: string[] | string;
  status: 'active' | 'out_of_stock' | 'expired';
}

export interface RewardRedemption {
  id: string;
  userId: string;
  rewardId: string;
  rewardName: string;
  rewardTitle?: string;
  partner: string;
  redemptionCode: string;
  voucherCode?: string;
  pointsSpent: number;
  claimedAt: string;
  expiresAt?: string;
  status: 'active' | 'used' | 'expired';
}

export type ActivityType = 
  | 'explore_point_discovered'
  | 'quiz_completed'
  | 'event_participated'
  | 'local_discovery_visited'
  | 'reward_redeemed';

export interface PointTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  sourceType: ActivityType;
  sourceId: string;
  amount: number;
  description: string;
  balanceAfter?: number;
  createdAt: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  destinationId: string;
  type: ActivityType;
  referenceId: string;
  title: string;
  pointsEarned: number;
  createdAt: string;
}

export interface UserDestinationProgress {
  destinationId: string;
  destinationName: string;
  totalExplorePoints: number;
  completedExplorePoints: number;
  completedPointIds: string[];
  lastVisitedAt: string;
}

export interface TourismStats {
  totalPlatformActivities: number;
  activeExploreSessions: number;
  totalExplorePointsDiscovered?: number;
  totalQuizzesCompleted?: number;
  totalQuizSubmissions: number;
  totalEventParticipations: number;
  totalRewardsRedeemed?: number;
  totalRewardRedemptions: number;
  totalLocalDiscoveryVisits: number;
  popularCategories: { category: string; count: number; percentage?: number }[];
  activityTrendsByDay: { date: string; count: number }[];
  hourlyActivityPeak: { hour: string; count: number }[];
}
