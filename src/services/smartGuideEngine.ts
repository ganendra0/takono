import { ExplorePoint } from '../types/destination';
import { Journey } from '../types/journey';

export interface SmartGuideRecommendation {
  recommendedPoint: ExplorePoint | null;
  reason: string;
  badge: string;
  unvisitedCount: number;
  totalPoints: number;
  completionPercentage: number;
  suggestedRoute: ExplorePoint[];
}

/**
 * Rule-Based Recommendation Engine as defined in Section 9 & 10 of TAKONO Architecture.
 * Priorities:
 * 1. Explore points not yet visited
 * 2. Sequence order established by destination manager
 * 3. Manager special recommendation tag
 * 4. Operational & category variety
 */
export function calculateSmartGuideRecommendation(
  destinationPoints: ExplorePoint[],
  currentJourney?: Journey,
  currentPointId?: string
): SmartGuideRecommendation {
  const publishedPoints = destinationPoints
    .filter((p) => p.status === 'published')
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder);

  if (publishedPoints.length === 0) {
    return {
      recommendedPoint: null,
      reason: 'Belum ada titik jelajah yang dipublikasikan pada destinasi ini.',
      badge: 'Belum Ada Data',
      unvisitedCount: 0,
      totalPoints: 0,
      completionPercentage: 0,
      suggestedRoute: [],
    };
  }

  const completedPointIds = new Set(
    currentJourney?.visitedPoints
      .filter((vp) => !!vp.completedAt)
      .map((vp) => vp.explorePointId) || []
  );

  const unvisitedPoints = publishedPoints.filter((p) => !completedPointIds.has(p.id));
  const completionPercentage = Math.round(
    ((publishedPoints.length - unvisitedPoints.length) / publishedPoints.length) * 100
  );

  if (unvisitedPoints.length === 0) {
    return {
      recommendedPoint: null,
      reason: 'Selamat! Anda telah menuntaskan seluruh titik jelajah di destinasi ini. Silakan kunjungi Local Discovery UMKM atau selesaikan Album Jelajah Anda.',
      badge: 'Jelajah Tuntas',
      unvisitedCount: 0,
      totalPoints: publishedPoints.length,
      completionPercentage: 100,
      suggestedRoute: publishedPoints,
    };
  }

  // Determine next point:
  // If user is currently viewing a point, prefer next unvisited point in sequence
  let nextCandidate: ExplorePoint | null = null;
  let recommendationReason = '';
  let recommendationBadge = '';

  if (currentPointId) {
    const currentIndex = publishedPoints.findIndex((p) => p.id === currentPointId);
    if (currentIndex !== -1) {
      // Look for next unvisited in sequence forward
      for (let i = currentIndex + 1; i < publishedPoints.length; i++) {
        if (!completedPointIds.has(publishedPoints[i].id)) {
          nextCandidate = publishedPoints[i];
          recommendationReason = `Titik berikutnya dalam alur urutan jelajah resmi (#${nextCandidate.sequenceOrder})`;
          recommendationBadge = 'Alur Sekuensial';
          break;
        }
      }
    }
  }

  // If not found forward or not on a specific point, check manager recommendation first among unvisited
  if (!nextCandidate) {
    const managerFav = unvisitedPoints.find((p) => p.isManagerRecommended);
    if (managerFav) {
      nextCandidate = managerFav;
      recommendationReason = 'Rekomendasi kurasi utama dari Pengelola Destinasi untuk pengalaman budaya terbaik';
      recommendationBadge = 'Pilihan Manajer';
    }
  }

  // Fallback to the lowest sequence number unvisited
  if (!nextCandidate) {
    nextCandidate = unvisitedPoints[0];
    recommendationReason = `Titik terdekat yang belum Anda kunjungi dalam rute (${nextCandidate.locationName})`;
    recommendationBadge = 'Rute Terdekat';
  }

  return {
    recommendedPoint: nextCandidate,
    reason: recommendationReason,
    badge: recommendationBadge,
    unvisitedCount: unvisitedPoints.length,
    totalPoints: publishedPoints.length,
    completionPercentage,
    suggestedRoute: publishedPoints,
  };
}
