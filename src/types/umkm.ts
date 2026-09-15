export type UMKMApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface UMKMProduct {
  id: string;
  umkmId: string;
  name: string;
  description: string;
  priceIdr: number;
  category: 'culinary' | 'souvenir' | 'craft' | 'fashion' | 'guide';
  imageUrl: string;
  isAvailable: boolean;
}

export interface UMKMPromotion {
  id: string;
  umkmId: string;
  title: string;
  discountPercentage: number;
  minTransactionIdr?: number;
  promoCode: string;
  validUntil: string;
  description: string;
  redemptionCount: number;
}

export interface UMKM {
  id: string;
  ownerId: string;
  ownerName: string;
  businessName: string;
  category: 'culinary' | 'craft' | 'souvenir' | 'homestay' | 'workshop';
  description: string;
  address: string;
  phone: string;
  instagram?: string;
  approvalStatus: UMKMApprovalStatus;
  rejectionReason?: string;
  associatedDestinationIds: string[];
  products: UMKMProduct[];
  promotions: UMKMPromotion[];
  verifiedAt?: string;
  viewsCount: number;
  travelerInteractionsCount: number;
  imageUrl: string;
}
