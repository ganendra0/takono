import { 
  Destination, 
  ExplorePoint, 
  DestinationEvent, 
  LocalDiscovery, 
  Reward, 
  RewardRedemption, 
  PointTransaction, 
  UserActivity, 
  User, 
  UserRole,
  TourismStats 
} from '../types/index.js';

// Production integration: Can point to external Laravel backend via VITE_API_URL or local proxy
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '') + '/api';

export class ApiClient {
  private static getToken(): string | null {
    return localStorage.getItem('takono_token');
  }

  public static setToken(token: string) {
    localStorage.setItem('takono_token', token);
  }

  public static removeToken() {
    localStorage.removeItem('takono_token');
  }

  private static async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; message?: string }> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      const json = await response.json();
      return json;
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Gagal menghubungi server TAKONO'
      };
    }
  }

  // --- Auth ---
  static async getCurrentUser() {
    return this.request<User>('/auth/me');
  }

  static async login(email: string, password?: string) {
    const res = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.success && res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  static async register(name: string, email: string) {
    const res = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email })
    });
    if (res.success && res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  static async switchDemoRole(role: UserRole) {
    const res = await this.request<{ user: User; token: string }>('/auth/switch-demo-role', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
    if (res.success && res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  // --- Destinations ---
  static async getDestinations() {
    return this.request<Destination[]>('/destinations');
  }

  static async getDestinationBySlug(slug: string) {
    return this.request<{
      destination: Destination;
      explorePoints: ExplorePoint[];
      events: DestinationEvent[];
      localDiscoveries: LocalDiscovery[];
      rewards: Reward[];
    }>(`/destinations/${slug}`);
  }

  static async scanDestinationQR(code: string) {
    return this.request<{ destination: Destination; welcomeTitle: string; welcomeSubtitle: string }>(
      `/scan/${code}`
    );
  }

  static async scanExplorePointToken(secureToken: string) {
    return this.request<{
      explorePoint: ExplorePoint;
      destination: Destination;
      alreadyCompleted: boolean;
      message: string;
      awardResult?: any;
    }>(`/scan/explore/${secureToken}`);
  }

  // --- Traveler ---
  static async getMyPoints() {
    return this.request<{ balance: number; transactions: PointTransaction[] }>('/me/points');
  }

  static async getMyActivities() {
    return this.request<UserActivity[]>('/me/activities');
  }

  static async getMyAlbum() {
    return this.request<{
      progress: any;
      completedPoints: ExplorePoint[];
      redemptions: RewardRedemption[];
      totalPointsEarned: number;
    }>('/me/album');
  }

  static async getSmartGuideRecommendations(params?: {
    destinationId?: string;
    preferences?: string[];
    lat?: number;
    lng?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.destinationId) query.set('destinationId', params.destinationId);
    if (params?.preferences?.length) query.set('preferences', params.preferences.join(','));
    if (params?.lat && params?.lng) {
      query.set('lat', params.lat.toString());
      query.set('lng', params.lng.toString());
    }
    return this.request<{
      nextRecommendation: { point: ExplorePoint | null; distanceMeters?: number; reason: string };
      recommendedPoints: ExplorePoint[];
      progress: any;
      walkingRoute: any;
    }>(`/smart-guide/recommendations?${query.toString()}`);
  }

  static async getExplorePoint(idOrSlug: string) {
    return this.request<{
      explorePoint: ExplorePoint;
      alreadyCompleted: boolean;
      quizCompleted: boolean;
    }>(`/explore-points/${idOrSlug}`);
  }

  static async simulateScanPoint(pointId: string) {
    return this.request<{
      alreadyCompleted: boolean;
      pointsAwarded: number;
      newBalance: number;
      message: string;
    }>(`/explore-points/${pointId}/scan`, { method: 'POST' });
  }

  static async submitQuiz(explorePointId: string, answers: { questionId: string; selectedOptionId: string }[]) {
    return this.request<{
      isCorrect: boolean;
      score: number;
      pointsAwarded: number;
      explanation: string;
      alreadyCompleted: boolean;
      message: string;
    }>(`/explore-points/${explorePointId}/quiz/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  }

  static async getEvents() {
    return this.request<DestinationEvent[]>('/events');
  }

  static async participateEvent(eventId: string) {
    return this.request<{ event: DestinationEvent; pointsAwarded: number; message: string }>(
      `/events/${eventId}/participate`,
      { method: 'POST' }
    );
  }

  static async getRewards() {
    return this.request<Reward[]>('/rewards');
  }

  static async redeemReward(rewardId: string) {
    return this.request<{
      redemption: RewardRedemption;
      remainingBalance: number;
      message: string;
    }>(`/rewards/${rewardId}/redeem`, { method: 'POST' });
  }

  static async visitLocalDiscovery(partnerId: string) {
    return this.request<{ pointsAwarded: number; newBalance: number; message: string }>(
      `/local-discoveries/${partnerId}/visit`,
      { method: 'POST' }
    );
  }

  // --- Manager ---
  static async getManagerDashboard() {
    return this.request<{ destination: Destination; stats: TourismStats; terminologyDisclaimer: string }>(
      '/manager/dashboard'
    );
  }

  static async getManagerExplorePoints() {
    return this.request<ExplorePoint[]>('/manager/explore-points');
  }

  static async createExplorePoint(pointData: Partial<ExplorePoint>) {
    return this.request<ExplorePoint>('/manager/explore-points', {
      method: 'POST',
      body: JSON.stringify(pointData)
    });
  }

  static async updateExplorePoint(id: string, pointData: Partial<ExplorePoint>) {
    return this.request<ExplorePoint>(`/manager/explore-points/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pointData)
    });
  }

  static async deleteExplorePoint(id: string) {
    return this.request(`/manager/explore-points/${id}`, { method: 'DELETE' });
  }

  // --- Government ---
  static async getGovernmentDashboard() {
    return this.request<{
      stats: TourismStats;
      insights: any[];
      dataTransparency: any;
    }>('/government/dashboard');
  }

  static async getGovernmentDestinations() {
    return this.request<{ destination: Destination; stats: TourismStats }[]>('/government/destinations');
  }

  static async getGovernmentInsights() {
    return this.request<any[]>('/government/insights');
  }

  static async getGovernmentReports() {
    return this.request<any>('/government/reports');
  }
}
