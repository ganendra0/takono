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

// All requests target Laravel, directly or through Vite's development proxy.
// Development always uses Vite's same-origin proxy, including access over LAN.
const API_BASE = (import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '')).replace(/\/+$/, '') + '/api';
const bundledImages = import.meta.glob('/src/assets/images/*', { eager: true, query: '?url', import: 'default' }) as Record<string,string>;
function resolveImages(value: any): any {
  if (typeof value === 'string') return bundledImages[value] || value;
  if (Array.isArray(value)) return value.map(resolveImages);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key,v])=>[key,resolveImages(v)]));
  return value;
}

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

  static async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; message?: string }> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        signal: options.signal || AbortSignal.timeout(20000),
        headers
      });

      const json = await response.json();
      if (!response.ok) {
        if(response.status===401 && token && !endpoint.startsWith('/auth/login')) { this.removeToken(); window.dispatchEvent(new Event('takono:session-expired')); }
        return { success: false, message: Object.values(json.errors || {}).flat().join(' ') || json.message || 'Permintaan gagal.' };
      }
      return resolveImages(json);
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

  static async updateProfile(data:{name:string;currentPassword?:string;password?:string;passwordConfirmation?:string}) {
    return this.request<User>('/auth/me',{method:'PATCH',body:JSON.stringify(data)});
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

  static async register(name: string, email: string, password: string) {
    const res = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    if (res.success && res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  static async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  static selectDestination(id: string) { localStorage.setItem('takono_destination', id); }
  static async destinationKey(): Promise<string> {
    const selected = localStorage.getItem('takono_destination');
    const res = await this.getDestinations();
    if (selected && res.data?.some(d=>d.id===selected || d.slug===selected)) return selected;
    const id = res.data?.[0]?.id;
    if (id) this.selectDestination(id);
    if (!id) localStorage.removeItem('takono_destination');
    return id || '';
  }

  // --- Destinations ---
  static async getDestinations() {
    return this.request<Destination[]>('/destinations');
  }

  static async getDestinationBySlug(slug?: string) {
    slug = slug || await this.destinationKey();
    if (!slug) return { success: false, data: undefined, message: 'Belum ada destinasi diterbitkan.' };
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
    }>(`/scan/explore/${encodeURIComponent(secureToken)}`, { method: 'POST' });
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
    }>(`/me/album?destinationId=${encodeURIComponent(await this.destinationKey())}`);
  }

  static async getSmartGuideRecommendations(params?: {
    destinationId?: string;
    preferences?: string[];
    lat?: number;
    lng?: number;
  }) {
    const query = new URLSearchParams();
    query.set('destinationId', params?.destinationId || await this.destinationKey());
    if (params?.preferences?.length) query.set('preferences', params.preferences.join(','));
    if (params?.lat != null && params?.lng != null) {
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
    return this.request<DestinationEvent[]>(`/events?destinationId=${await this.destinationKey()}`);
  }

  static async scanEventToken(token: string) {
    return this.request<{ event: DestinationEvent; pointsAwarded: number; message: string }>(
      `/scan/event/${encodeURIComponent(token)}`,
      { method: 'POST' }
    );
  }

  static async getRewards() {
    return this.request<Reward[]>(`/rewards?destinationId=${await this.destinationKey()}`);
  }

  static async redeemReward(rewardId: string, requestId: string) {
    return this.request<{
      redemption: RewardRedemption;
      remainingBalance: number;
      message: string;
    }>(`/rewards/${rewardId}/redeem`, { method: 'POST', body: JSON.stringify({ requestId }) });
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
