export interface VisitedExplorePointRecord {
  explorePointId: string;
  viewedAt: string;
  interactedAt?: string;
  completedAt?: string;
}

export interface QuizAttemptRecord {
  quizId: string;
  explorePointId: string;
  completedAt: string;
  score: number;
  maxScore: number;
  pointsEarned: number;
  selectedAnswers: number[];
}

export interface ClaimedRewardRecord {
  id: string;
  rewardId: string;
  rewardTitle: string;
  pointsPaid: number;
  claimedAt: string;
  redemptionCode: string;
  status: 'claimed' | 'redeemed' | 'expired';
  redeemedAt?: string;
}

export interface AlbumStamp {
  id: string;
  explorePointId: string;
  explorePointName: string;
  earnedAt: string;
  iconName: string;
  category: string;
}

export interface Journey {
  id: string;
  travelerId: string;
  destinationId: string;
  status: 'active' | 'completed';
  startedAt: string;
  lastActivityAt: string;
  completedAt?: string;
  visitedPoints: VisitedExplorePointRecord[];
  completedQuizzes: QuizAttemptRecord[];
  earnedPointsTotal: number;
  claimedRewards: ClaimedRewardRecord[];
  discoveredUmkmIds: string[];
  albumStamps: AlbumStamp[];
  personalNotes?: string;
}
