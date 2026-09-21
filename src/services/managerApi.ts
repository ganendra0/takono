export type ApiError = { status: number; message: string };

export type ManagerDestination = {
  id: string;
  name: string;
  slug?: string;
  tagline?: string;
  description?: string;
  province?: string;
  regency?: string;
  address?: string;
  status?: string;
  managerId?: string;
  managerName?: string;
  ticketPriceIdr?: number;
  bannerImageUrl?: string;
  operatingHours?: string;
};

export type ManagerExplorePoint = {
  id: string;
  destinationId: string;
  name?: string;
  title?: string;
  category?: string;
  shortSnippet?: string;
  description?: string;
  imageUrl?: string;
  sequenceOrder?: number;
  estimatedMinutes?: number;
  completionPoints?: number;
  pointsReward?: number;
  locationName?: string;
  qrCodeId?: string;
};

export type ManagerQuiz = {
  id: string;
  destinationId: string;
  explorePointId: string;
  title: string;
  description?: string;
  questions?: unknown[];
  totalPointsAvailable?: number;
  pointsPerCorrect?: number;
};

export type ManagerReward = {
  id: string;
  destinationId: string;
  title: string;
  category?: string;
  description?: string;
  pointsCost: number;
  initialStock?: number;
  currentStock?: number;
  imageUrl?: string;
  status?: string;
};

const getToken = (): string | null => {
  try { return localStorage.getItem('takono_auth_token'); } catch { return null; }
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body) headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(path, { ...init, headers });
  } catch {
    throw { status: 0, message: 'Tidak dapat terhubung ke server API.' } satisfies ApiError;
  }

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = typeof body === 'object' && body !== null && 'error' in body
      ? String((body as { error: unknown }).error)
      : `Request gagal (${response.status}).`;
    throw { status: response.status, message } satisfies ApiError;
  }
  return body as T;
}

export const managerApi = {
  getDbStatus: () => request<{ connected: boolean; mode: string; message: string }>('/api/db/status'),
  getDestinations: () => request<ManagerDestination[]>('/api/destinations'),
  getExplorePoints: (destinationId: string) => request<ManagerExplorePoint[]>(`/api/explore-points?destinationId=${encodeURIComponent(destinationId)}`),
  getQuizzes: (destinationId: string) => request<ManagerQuiz[]>(`/api/quizzes?destinationId=${encodeURIComponent(destinationId)}`),
  getRewards: (destinationId: string) => request<ManagerReward[]>(`/api/rewards?destinationId=${encodeURIComponent(destinationId)}`),
  getUmkm: () => request<unknown[]>('/api/umkm'),
  approveUmkm: (id: string) => request<{ success: boolean }>(`/api/umkm/${encodeURIComponent(id)}/approve`, { method: 'PUT' }),
  rejectUmkm: (id: string, reason: string) => request<{ success: boolean }>(`/api/umkm/${encodeURIComponent(id)}/reject`, { method: 'PUT', body: JSON.stringify({ reason }) }),
};

export function apiMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = Number((error as { status: unknown }).status);
    if (status === 401) return 'Sesi login tidak valid. Silakan login kembali.';
    if (status === 403) return 'Anda tidak memiliki izin untuk mengakses data Manager.';
    if (status === 404) return 'Data tidak ditemukan.';
    if (status === 422) return 'Data yang dikirim tidak valid.';
    if (status >= 500) return 'Server sedang bermasalah. Silakan coba lagi.';
  }
  return error instanceof Error ? error.message : 'Gagal memuat data dari server.';
}
