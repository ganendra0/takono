export type AnalyticsEventType =
  | 'qr_scan'
  | 'destination_view'
  | 'journey_start'
  | 'journey_resume'
  | 'journey_end'
  | 'explore_point_view'
  | 'explore_point_interact'
  | 'explore_point_complete'
  | 'quiz_submit'
  | 'reward_claim'
  | 'umkm_view'
  | 'umkm_product_view'
  | 'umkm_promo_click';

export interface AnalyticsEvent {
  id: string;
  eventType: AnalyticsEventType;
  userId?: string;
  userRole?: string;
  destinationId?: string;
  targetId?: string;
  journeyId?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface AggregatedDestinationMetric {
  destinationId: string;
  destinationName: string;
  totalVisitors: number;
  totalQrScans: number;
  totalExplorePointCompletions: number;
  totalQuizAttempts: number;
  averageQuizScorePercent: number;
  totalPointsDistributed: number;
  totalRewardsClaimed: number;
  totalUmkmViews: number;
  activeJourneysCount: number;
}

export interface GovernmentIntelligenceReport {
  period: string;
  totalVisitorsProvinceWide: number;
  activeDestinationsCount: number;
  totalEcoCultureComplianceScore: number;
  topVisitedExploreCategories: { category: string; count: number }[];
  umkmEconomicImpactIdr: number;
  destinationRankings: {
    destinationId: string;
    destinationName: string;
    province: string;
    visitorCount: number;
    completionRate: number;
    economicImpactIdr: number;
  }[];
}
