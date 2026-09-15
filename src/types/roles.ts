export type UserRole = 'traveler' | 'manager' | 'umkm' | 'government' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  pointsBalance: number;
  assignedDestinationId?: string; // For manager
  umkmId?: string; // For UMKM owner
  agencyName?: string; // For government (e.g. Dinas Pariwisata DIY / Bali)
}
