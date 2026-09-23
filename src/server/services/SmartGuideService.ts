import { db } from '../database.js';
import { ExploreCategory, ExplorePoint, UserDestinationProgress } from '../../types/index.js';

export interface WalkingRoute {
  origin: [number, number];
  destination: [number, number];
  distanceMeters: number;
  estimatedWalkingMinutes: number;
  waypoints: [number, number][];
}

export class SmartGuideService {
  /**
   * Calculate distance between two coordinates in meters using the Haversine formula
   */
  static calculateDistanceMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  }

  /**
   * Get user's journey progress for a specific destination
   */
  static getUserJourneyProgress(userId: string, destinationId: string): UserDestinationProgress {
    return db.getDestinationProgress(userId, destinationId);
  }

  /**
   * Get recommended points filtered by user preferences and completion status
   */
  static getRecommendedPoints(
    userId: string,
    destinationId: string,
    userPreferences: ExploreCategory[] = []
  ): ExplorePoint[] {
    const allPoints = db.explorePoints.filter(
      p => p.destinationId === destinationId && p.status === 'published'
    );
    const completedIds = db.getCompletedPoints(userId, destinationId);

    // Filter uncompleted points first
    const uncompleted = allPoints.filter(p => !completedIds.includes(p.id));

    if (userPreferences.length === 0) {
      return uncompleted.length > 0 ? uncompleted : allPoints;
    }

    // Sort by matching preference
    const matched = uncompleted.filter(p => userPreferences.includes(p.category));
    const rest = uncompleted.filter(p => !userPreferences.includes(p.category));

    return [...matched, ...rest];
  }

  /**
   * Determine the single next best recommended point
   */
  static getNextRecommendation(
    userId: string,
    destinationId: string,
    currentCoords?: [number, number],
    userPreferences: ExploreCategory[] = []
  ): { point: ExplorePoint | null; distanceMeters?: number; reason: string } {
    const recommended = this.getRecommendedPoints(userId, destinationId, userPreferences);

    if (recommended.length === 0) {
      return {
        point: null,
        reason: 'Selamat! Kamu telah menjelajahi seluruh Explore Point di destinasi ini.'
      };
    }

    // If current coordinate is available, choose the closest uncompleted point that fits preference
    if (currentCoords) {
      const [uLat, uLng] = currentCoords;
      let closestPoint = recommended[0];
      let minDistance = this.calculateDistanceMeters(
        uLat,
        uLng,
        closestPoint.latitude,
        closestPoint.longitude
      );

      for (const p of recommended) {
        const dist = this.calculateDistanceMeters(uLat, uLng, p.latitude, p.longitude);
        if (dist < minDistance) {
          minDistance = dist;
          closestPoint = p;
        }
      }

      return {
        point: closestPoint,
        distanceMeters: minDistance,
        reason: `Rekomendasi titik terdekat (${minDistance}m) berdasarkan preferensi jelajahmu`
      };
    }

    return {
      point: recommended[0],
      reason: 'Rekomendasi titik berikutnya berdasarkan rute ideal jelajah destinasi'
    };
  }

  /**
   * Calculate simulated walking route with smooth polyline waypoints along zoo paths
   */
  static calculateWalkingRoute(
    fromCoord: [number, number],
    toCoord: [number, number]
  ): WalkingRoute {
    const distanceMeters = this.calculateDistanceMeters(
      fromCoord[0],
      fromCoord[1],
      toCoord[0],
      toCoord[1]
    );

    // Walking speed ~ 4.5 km/h ≈ 75 m/min
    const estimatedWalkingMinutes = Math.max(1, Math.ceil(distanceMeters / 70));

    // Generate realistic intermediate walking waypoints along park pathway curve
    const midLat = (fromCoord[0] + toCoord[0]) / 2 + (Math.sin(fromCoord[1]) * 0.0001);
    const midLng = (fromCoord[1] + toCoord[1]) / 2 + (Math.cos(fromCoord[0]) * 0.0001);

    const waypoints: [number, number][] = [
      fromCoord,
      [fromCoord[0] + (midLat - fromCoord[0]) * 0.5, fromCoord[1] + (midLng - fromCoord[1]) * 0.5],
      [midLat, midLng],
      [toCoord[0] - (toCoord[0] - midLat) * 0.5, toCoord[1] - (toCoord[1] - midLng) * 0.5],
      toCoord
    ];

    return {
      origin: fromCoord,
      destination: toCoord,
      distanceMeters,
      estimatedWalkingMinutes,
      waypoints
    };
  }

  /**
   * Get points within radius (e.g. within 50m for arrival detection)
   */
  static getNearbyExplorePoints(
    destinationId: string,
    currentCoords: [number, number],
    radiusMeters: number = 50
  ): { point: ExplorePoint; distanceMeters: number; isArrived: boolean }[] {
    const points = db.explorePoints.filter(
      p => p.destinationId === destinationId && p.status === 'published'
    );

    return points
      .map(point => {
        const distanceMeters = this.calculateDistanceMeters(
          currentCoords[0],
          currentCoords[1],
          point.latitude,
          point.longitude
        );
        return {
          point,
          distanceMeters,
          isArrived: distanceMeters <= radiusMeters
        };
      })
      .filter(item => item.distanceMeters <= radiusMeters * 3)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }
}
