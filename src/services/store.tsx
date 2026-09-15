import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_DESTINATIONS,
  INITIAL_EXPLORE_POINTS,
  INITIAL_QUIZZES,
  INITIAL_REWARDS,
  INITIAL_EVENTS,
  INITIAL_UMKM,
  INITIAL_QR_CODES,
  INITIAL_JOURNEYS,
  INITIAL_POINT_TRANSACTIONS,
  INITIAL_ANALYTICS_EVENTS,
} from '../data/initialData';
import { UserProfile, UserRole } from '../types/roles';
import {
  Destination,
  ExplorePoint,
  Quiz,
  DestinationReward,
  DestinationEvent,
  DestinationStatus,
  ExplorePointStatus,
} from '../types/destination';
import { Journey, VisitedExplorePointRecord, QuizAttemptRecord } from '../types/journey';
import { UMKM, UMKMApprovalStatus, UMKMProduct, UMKMPromotion } from '../types/umkm';
import { PointTransaction, PointTransactionType } from '../types/points';
import { QRCodeData, QRResolutionResult } from '../types/qr';
import { AnalyticsEvent, AnalyticsEventType, AggregatedDestinationMetric, GovernmentIntelligenceReport } from '../types/analytics';

export interface DbStatusInfo {
  database: 'MySQL';
  connected: boolean;
  host: string;
  port: number;
  databaseName: string;
  mode: 'mysql_live' | 'memory_fallback';
  message: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  agencyName?: string;
  umkmName?: string;
}

interface TakonoStoreContextType {
  // Current session & Auth
  currentUser: UserProfile;
  switchUserRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  allUsers: UserProfile[];
  users: UserProfile[];
  authToken: string | null;
  dbStatus: DbStatusInfo | null;
  checkDbStatus: () => Promise<DbStatusInfo | null>;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: UserProfile }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message: string; user?: UserProfile }>;
  logout: () => void;

  // Destinations
  destinations: Destination[];
  getDestination: (id: string) => Destination | undefined;
  updateDestinationStatus: (id: string, status: DestinationStatus) => void;
  updateDestination: (idOrDest: string | (Partial<Destination> & { id: string }), maybePartial?: Partial<Destination>) => void;
  createDestination: (dest: Omit<Destination, 'id' | 'createdAt' | 'updatedAt' | 'qrCodeId'>) => Destination;

  // Explore Points
  explorePoints: ExplorePoint[];
  getExplorePointsByDestination: (destId: string) => ExplorePoint[];
  getExplorePoint: (id: string) => ExplorePoint | undefined;
  saveExplorePoint: (point: Partial<ExplorePoint> & { destinationId: string; name: string }) => ExplorePoint;
  addExplorePoint: (point: Partial<ExplorePoint> & { destinationId: string; name: string }) => ExplorePoint;
  updateExplorePoint: (id: string, partial: Partial<ExplorePoint>) => ExplorePoint;
  updateExplorePointStatus: (id: string, status: ExplorePointStatus) => void;

  // Quizzes
  quizzes: Quiz[];
  getQuizByExplorePoint: (pointId: string) => Quiz | undefined;
  saveQuiz: (quiz: Partial<Quiz> & { explorePointId: string; destinationId: string; title: string }) => Quiz;
  addQuiz: (quiz: Partial<Quiz> & { explorePointId: string; destinationId: string; title: string }) => Quiz;
  updateQuiz: (id: string, partial: Partial<Quiz>) => Quiz;

  // Rewards
  rewards: DestinationReward[];
  getRewardsByDestination: (destId: string) => DestinationReward[];
  saveReward: (reward: Partial<DestinationReward> & { destinationId: string; title: string }) => DestinationReward;
  addReward: (reward: Partial<DestinationReward> & { destinationId: string; title: string }) => DestinationReward;
  updateReward: (id: string, partial: Partial<DestinationReward>) => DestinationReward;

  // Events
  events: DestinationEvent[];
  getEventsByDestination: (destId: string) => DestinationEvent[];
  saveEvent: (event: Partial<DestinationEvent> & { destinationId: string; title: string }) => DestinationEvent;
  addEvent: (event: Partial<DestinationEvent> & { destinationId: string; title: string }) => DestinationEvent;

  // UMKM
  umkmList: UMKM[];
  getApprovedUMKMByDestination: (destId: string) => UMKM[];
  getUMKMById: (id: string) => UMKM | undefined;
  updateUMKMApproval: (umkmId: string, status: UMKMApprovalStatus, rejectionReason?: string) => void;
  approveUMKM: (umkmId: string) => void;
  rejectUMKM: (umkmId: string, rejectionReason?: string) => void;
  updateUMKMProfile: (umkm: Partial<UMKM> & { id: string }) => void;
  addUMKMProduct: (umkmId: string, product: { name: string; description: string; priceIdr: number; imageUrl: string; category?: any; isAvailable?: boolean }) => void;
  addUMKMPromotion: (umkmId: string, promo: { title: string; description: string; discountPercentage: number; promoCode: string; validUntil: string; isActive?: boolean }) => void;

  // Journeys
  journeys: Journey[];
  activeJourney: Journey | null;
  getTravelerJourneys: (travelerId: string) => Journey[];
  startOrResumeJourney: (destinationId: string) => Journey | { error: string };
  recordPointInteraction: (
    explorePointId: string,
    action: 'view' | 'interact' | 'complete'
  ) => { success: boolean; pointsAwarded?: number };
  submitQuizAttempt: (
    quizId: string,
    selectedAnswers: number[]
  ) => { success: boolean; pointsEarned: number; message: string; alreadyCompleted?: boolean };
  redeemReward: (
    rewardId: string
  ) => { success: boolean; message: string; claimCode?: string };
  endJourney: (journeyId: string, notes?: string) => { success: boolean; message: string };
  leaveDestination: () => void;

  // Points Ledger
  pointTransactions: PointTransaction[];
  getTravelerTransactions: (travelerId: string) => PointTransaction[];

  // QR Engine
  qrCodes: QRCodeData[];
  resolveQRCode: (rawCode: string) => QRResolutionResult;
  generateQRCode: (targetType: QRCodeData['targetType'], destinationId: string, targetId: string, title: string, description: string) => QRCodeData;

  // Analytics
  analyticsEvents: AnalyticsEvent[];
  logAnalyticsEvent: (type: AnalyticsEventType, targetId?: string, destinationId?: string, metadata?: Record<string, unknown>) => void;
  getDestinationMetrics: (destinationId: string) => AggregatedDestinationMetric;
  getGovernmentReport: () => GovernmentIntelligenceReport;

  // Active view navigation helper
  activeRoute: string;
  navigateTo: (route: string) => void;
  qrModalOpen: boolean;
  setQrModalOpen: (open: boolean) => void;
  activeQrTargetCode: string | null;
  simulateScanCode: (code: string) => void;
}

const TakonoStoreContext = createContext<TakonoStoreContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'takono_v2_';

function getStoredOrInitial<T>(key: string, initial: T): T {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return initial;
}

export const TakonoStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => getStoredOrInitial('users', INITIAL_USERS));
  const [currentUserId, setCurrentUserId] = useState<string>(() => users[0]?.id || 'user-traveler-1');
  
  const [destinations, setDestinations] = useState<Destination[]>(() => getStoredOrInitial('destinations', INITIAL_DESTINATIONS));
  const [explorePoints, setExplorePoints] = useState<ExplorePoint[]>(() => getStoredOrInitial('explore_points', INITIAL_EXPLORE_POINTS));
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => getStoredOrInitial('quizzes', INITIAL_QUIZZES));
  const [rewards, setRewards] = useState<DestinationReward[]>(() => getStoredOrInitial('rewards', INITIAL_REWARDS));
  const [events, setEvents] = useState<DestinationEvent[]>(() => getStoredOrInitial('events', INITIAL_EVENTS));
  const [umkmList, setUmkmList] = useState<UMKM[]>(() => getStoredOrInitial('umkm_list', INITIAL_UMKM));
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>(() => getStoredOrInitial('qr_codes', INITIAL_QR_CODES));
  const [journeys, setJourneys] = useState<Journey[]>(() => getStoredOrInitial('journeys', INITIAL_JOURNEYS));
  const [pointTransactions, setPointTransactions] = useState<PointTransaction[]>(() => getStoredOrInitial('point_tx', INITIAL_POINT_TRANSACTIONS));
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>(() => getStoredOrInitial('analytics_events', INITIAL_ANALYTICS_EVENTS));

  const [activeRoute, setActiveRoute] = useState<string>('/traveler/home');
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);
  const [activeQrTargetCode, setActiveQrTargetCode] = useState<string | null>(null);

  // Authentication & Database Status
  const [dbStatus, setDbStatus] = useState<DbStatusInfo | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('takono_auth_token'));

  const checkDbStatus = async (): Promise<DbStatusInfo | null> => {
    try {
      const res = await fetch('/api/db/status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
        return data;
      }
    } catch {
      // ignore
    }
    return null;
  };

  useEffect(() => {
    checkDbStatus();

    // Verify authenticated user from token if available
    const token = localStorage.getItem('takono_auth_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.user) {
            setUsers((prev) => {
              const exists = prev.find((u) => u.id === data.user.id);
              if (exists) {
                return prev.map((u) => (u.id === data.user.id ? { ...u, ...data.user } : u));
              }
              return [data.user, ...prev];
            });
            setCurrentUserId(data.user.id);
          }
        })
        .catch(() => {});
    }

    // Auto-detect URL parameter for physical gate QR redirects (e.g. ?scan=TAKONO:DEST:dest-penglipuran or ?dest=dest-penglipuran)
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const scanCode = searchParams.get('scan');
      const destId = searchParams.get('dest');
      if (scanCode) {
        setTimeout(() => simulateScanCode(scanCode), 300);
      } else if (destId) {
        setTimeout(() => startOrResumeJourney(destId), 300);
      }
    } catch {
      // ignore
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Gagal login.' };
      }
      setAuthToken(data.token);
      localStorage.setItem('takono_auth_token', data.token);
      setUsers((prev) => {
        const exists = prev.find((u) => u.id === data.user.id);
        if (exists) {
          return prev.map((u) => (u.id === data.user.id ? { ...u, ...data.user } : u));
        }
        return [data.user, ...prev];
      });
      setCurrentUserId(data.user.id);

      if (data.user.role === 'traveler') navigateTo('/traveler/home');
      else navigateTo(`/${data.user.role}/dashboard`);

      return { success: true, message: data.message || 'Login berhasil!', user: data.user };
    } catch (err: any) {
      return { success: false, message: 'Tidak dapat terhubung ke server API: ' + err.message };
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Gagal mendaftar akun.' };
      }
      setAuthToken(data.token);
      localStorage.setItem('takono_auth_token', data.token);
      setUsers((prev) => [data.user, ...prev]);
      setCurrentUserId(data.user.id);

      if (data.user.role === 'traveler') navigateTo('/traveler/home');
      else navigateTo(`/${data.user.role}/dashboard`);

      return { success: true, message: data.message || 'Pendaftaran berhasil!', user: data.user };
    } catch (err: any) {
      return { success: false, message: 'Tidak dapat terhubung ke server API: ' + err.message };
    }
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('takono_auth_token');
    setCurrentUserId('user-traveler-1');
    navigateTo('/traveler/home');
  };

  // Sync state to local storage
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'destinations', JSON.stringify(destinations)); }, [destinations]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'explore_points', JSON.stringify(explorePoints)); }, [explorePoints]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'quizzes', JSON.stringify(quizzes)); }, [quizzes]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'rewards', JSON.stringify(rewards)); }, [rewards]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'umkm_list', JSON.stringify(umkmList)); }, [umkmList]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'qr_codes', JSON.stringify(qrCodes)); }, [qrCodes]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'journeys', JSON.stringify(journeys)); }, [journeys]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'point_tx', JSON.stringify(pointTransactions)); }, [pointTransactions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PREFIX + 'analytics_events', JSON.stringify(analyticsEvents)); }, [analyticsEvents]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  // Active journey for current traveler (first active journey found, or null)
  const activeJourney = currentUser.role === 'traveler'
    ? journeys.find((j) => j.travelerId === currentUser.id && j.status === 'active') || null
    : null;

  // Switch role and navigate to appropriate domain home
  const switchUserRole = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUserId(targetUser.id);
      switch (role) {
        case 'traveler':
          setActiveRoute('/traveler/home');
          break;
        case 'manager':
          setActiveRoute('/manager/dashboard');
          break;
        case 'umkm':
          setActiveRoute('/umkm/dashboard');
          break;
        case 'government':
          setActiveRoute('/government/dashboard');
          break;
        case 'admin':
          setActiveRoute('/admin/dashboard');
          break;
      }
    }
  };

  const switchUser = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      setCurrentUserId(targetUser.id);
    }
  };

  const navigateTo = (route: string) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logging analytics
  const logAnalyticsEvent = (
    type: AnalyticsEventType,
    targetId?: string,
    destinationId?: string,
    metadata?: Record<string, unknown>
  ) => {
    const newEvent: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventType: type,
      userId: currentUser.id,
      userRole: currentUser.role,
      destinationId,
      targetId,
      journeyId: activeJourney?.id,
      metadata,
      timestamp: new Date().toISOString(),
    };
    setAnalyticsEvents((prev) => [newEvent, ...prev]);
  };

  // Point transaction ledger (ATOMIC)
  const executePointTransaction = (
    travelerId: string,
    amount: number,
    type: PointTransactionType,
    description: string,
    journeyId?: string,
    destinationId?: string
  ): { success: boolean; newBalance: number } => {
    const traveler = users.find((u) => u.id === travelerId);
    if (!traveler) return { success: false, newBalance: 0 };

    const currentBal = traveler.pointsBalance;
    const nextBal = currentBal + amount;
    if (nextBal < 0) {
      return { success: false, newBalance: currentBal }; // prevent negative balance
    }

    const tx: PointTransaction = {
      id: `ptx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      travelerId,
      journeyId,
      destinationId,
      amount,
      type,
      description,
      balanceAfter: nextBal,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) =>
      prev.map((u) => (u.id === travelerId ? { ...u, pointsBalance: nextBal } : u))
    );
    setPointTransactions((prev) => [tx, ...prev]);

    return { success: true, newBalance: nextBal };
  };

  // Destination actions
  const getDestination = (id: string) => destinations.find((d) => d.id === id);

  const updateDestinationStatus = (id: string, status: DestinationStatus) => {
    setDestinations((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status, updatedAt: new Date().toISOString() } : d
      )
    );
  };

  const updateDestination = (
    idOrDest: string | (Partial<Destination> & { id: string }),
    maybePartial?: Partial<Destination>
  ) => {
    const targetId = typeof idOrDest === 'string' ? idOrDest : idOrDest.id;
    const partialData = typeof idOrDest === 'string' ? (maybePartial || {}) : idOrDest;

    setDestinations((prev) =>
      prev.map((d) =>
        d.id === targetId ? { ...d, ...partialData, updatedAt: new Date().toISOString() } : d
      )
    );
  };

  const createDestination = (
    dest: Omit<Destination, 'id' | 'createdAt' | 'updatedAt' | 'qrCodeId'>
  ): Destination => {
    const id = `dest-${Date.now()}`;
    const qrCodeId = `QR-DEST-${id.toUpperCase()}`;
    const newDest: Destination = {
      ...dest,
      id,
      qrCodeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Auto-generate initial QR Code
    const qrData: QRCodeData = {
      id: qrCodeId,
      code: `TAKONO:DEST:${id}`,
      targetType: 'destination',
      destinationId: id,
      targetId: id,
      title: `Pintu Gerbang ${dest.name}`,
      description: `Scan QR untuk check-in dan memulai Journey di ${dest.name}`,
      scansCount: 0,
      createdAt: new Date().toISOString(),
    };

    setDestinations((prev) => [newDest, ...prev]);
    setQrCodes((prev) => [qrData, ...prev]);
    return newDest;
  };

  // Explore Points actions
  const getExplorePointsByDestination = (destId: string) =>
    explorePoints.filter((p) => p.destinationId === destId).sort((a, b) => a.sequenceOrder - b.sequenceOrder);

  const getExplorePoint = (id: string) => explorePoints.find((p) => p.id === id);

  const saveExplorePoint = (
    pointData: Partial<ExplorePoint> & { destinationId: string; name: string }
  ): ExplorePoint => {
    if (pointData.id) {
      // Update
      let updated: ExplorePoint | undefined;
      setExplorePoints((prev) =>
        prev.map((p) => {
          if (p.id === pointData.id) {
            updated = { ...p, ...pointData } as ExplorePoint;
            return updated;
          }
          return p;
        })
      );
      return updated!;
    } else {
      // Create
      const id = `pt-${Date.now()}`;
      const qrCodeId = `QR-POINT-${id.toUpperCase()}`;
      const existingPoints = getExplorePointsByDestination(pointData.destinationId);
      const newPoint: ExplorePoint = {
        id,
        destinationId: pointData.destinationId,
        name: pointData.name,
        sequenceOrder: pointData.sequenceOrder || existingPoints.length + 1,
        category: pointData.category || 'heritage',
        status: pointData.status || 'published',
        shortDescription: pointData.shortDescription || '',
        story: pointData.story || '',
        facts: pointData.facts || [],
        education: pointData.education || {
          culturalNorms: 'Hormati adat istiadat dan etika setempat.',
          ecoGuidelines: 'Jaga kebersihan dan tidak membuang sampah sembarangan.',
          etiquette: 'Berpakaian sopan dan patuhi tata tertib.',
        },
        activity: pointData.activity || 'Amati dan pelajari keunikan titik ini.',
        coordinates: pointData.coordinates || { lat: -8.45, lng: 115.35 },
        locationName: pointData.locationName || 'Area Destinasi',
        estimatedMinutes: pointData.estimatedMinutes || 15,
        completionPoints: 5,
        isManagerRecommended: pointData.isManagerRecommended || false,
        imageUrl: pointData.imageUrl || 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&auto=format&fit=crop&q=80',
        qrCodeId,
      };

      // Create QR Code for this explore point
      const qrData: QRCodeData = {
        id: qrCodeId,
        code: `TAKONO:POINT:${id}`,
        targetType: 'explore_point',
        destinationId: pointData.destinationId,
        targetId: id,
        title: `Plakat ${newPoint.name}`,
        description: `Scan di lokasi untuk membuka kisah budaya dan kuis interaktif.`,
        scansCount: 0,
        createdAt: new Date().toISOString(),
      };

      setExplorePoints((prev) => [...prev, newPoint]);
      setQrCodes((prev) => [qrData, ...prev]);
      return newPoint;
    }
  };

  const updateExplorePointStatus = (id: string, status: ExplorePointStatus) => {
    setExplorePoints((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  // Quizzes actions
  const getQuizByExplorePoint = (pointId: string) =>
    quizzes.find((q) => q.explorePointId === pointId);

  const saveQuiz = (
    quizData: Partial<Quiz> & { explorePointId: string; destinationId: string; title: string }
  ): Quiz => {
    if (quizData.id) {
      let updated: Quiz | undefined;
      setQuizzes((prev) =>
        prev.map((q) => {
          if (q.id === quizData.id) {
            updated = { ...q, ...quizData } as Quiz;
            return updated;
          }
          return q;
        })
      );
      return updated!;
    } else {
      const id = `quiz-${Date.now()}`;
      const newQuiz: Quiz = {
        id,
        explorePointId: quizData.explorePointId,
        destinationId: quizData.destinationId,
        title: quizData.title,
        description: quizData.description || 'Uji pemahaman Anda tentang titik jelajah ini.',
        status: quizData.status || 'published',
        questions: quizData.questions || [],
        pointsPerCorrect: quizData.pointsPerCorrect || 10,
        totalPointsAvailable: (quizData.questions?.length || 1) * (quizData.pointsPerCorrect || 10),
      };
      setQuizzes((prev) => [...prev, newQuiz]);
      return newQuiz;
    }
  };

  // Rewards actions
  const getRewardsByDestination = (destId: string) =>
    rewards.filter((r) => r.destinationId === destId);

  const saveReward = (
    rewardData: Partial<DestinationReward> & { destinationId: string; title: string }
  ): DestinationReward => {
    if (rewardData.id) {
      let updated: DestinationReward | undefined;
      setRewards((prev) =>
        prev.map((r) => {
          if (r.id === rewardData.id) {
            updated = { ...r, ...rewardData } as DestinationReward;
            return updated;
          }
          return r;
        })
      );
      return updated!;
    } else {
      const id = `rwd-${Date.now()}`;
      const newReward: DestinationReward = {
        id,
        destinationId: rewardData.destinationId,
        umkmId: rewardData.umkmId,
        title: rewardData.title,
        description: rewardData.description || '',
        pointsCost: rewardData.pointsCost || 25,
        initialStock: rewardData.initialStock || 50,
        currentStock: rewardData.currentStock ?? rewardData.initialStock ?? 50,
        validUntil: rewardData.validUntil || '2026-12-31',
        status: rewardData.status || 'active',
        terms: rewardData.terms || 'Tunjukkan voucher di kasir atau pengelola.',
        category: rewardData.category || 'voucher',
        imageUrl: rewardData.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      };
      setRewards((prev) => [...prev, newReward]);
      return newReward;
    }
  };

  // Events actions
  const getEventsByDestination = (destId: string) =>
    events.filter((e) => e.destinationId === destId);

  const saveEvent = (
    eventData: Partial<DestinationEvent> & { destinationId: string; title: string }
  ): DestinationEvent => {
    if (eventData.id) {
      let updated: DestinationEvent | undefined;
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id === eventData.id) {
            updated = { ...e, ...eventData } as DestinationEvent;
            return updated;
          }
          return e;
        })
      );
      return updated!;
    } else {
      const id = `evt-${Date.now()}`;
      const qrCodeId = `QR-EVT-${id.toUpperCase()}`;
      const newEvent: DestinationEvent = {
        id,
        destinationId: eventData.destinationId,
        title: eventData.title,
        date: eventData.date || new Date().toISOString().split('T')[0],
        time: eventData.time || '10:00 - 12:00',
        location: eventData.location || 'Area Destinasi',
        description: eventData.description || '',
        status: eventData.status || 'published',
        qrCodeId,
        badgeEarned: eventData.badgeEarned,
      };
      setEvents((prev) => [...prev, newEvent]);
      return newEvent;
    }
  };

  // UMKM actions
  const getApprovedUMKMByDestination = (destId: string) =>
    umkmList.filter(
      (u) =>
        u.approvalStatus === 'approved' &&
        u.associatedDestinationIds.includes(destId)
    );

  const getUMKMById = (id: string) => umkmList.find((u) => u.id === id);

  const updateUMKMApproval = (
    umkmId: string,
    status: UMKMApprovalStatus,
    rejectionReason?: string
  ) => {
    setUmkmList((prev) =>
      prev.map((u) =>
        u.id === umkmId
          ? {
              ...u,
              approvalStatus: status,
              rejectionReason,
              verifiedAt: status === 'approved' ? new Date().toISOString() : u.verifiedAt,
            }
          : u
      )
    );
  };

  const approveUMKM = (umkmId: string) => {
    updateUMKMApproval(umkmId, 'approved');
  };

  const rejectUMKM = (umkmId: string, rejectionReason?: string) => {
    updateUMKMApproval(umkmId, 'rejected', rejectionReason);
  };

  const updateUMKMProfile = (umkmData: Partial<UMKM> & { id: string }) => {
    setUmkmList((prev) =>
      prev.map((u) => (u.id === umkmData.id ? { ...u, ...umkmData } : u))
    );
  };

  const addUMKMProduct = (
    umkmId: string,
    product: { name: string; description: string; priceIdr: number; imageUrl: string; category?: any; isAvailable?: boolean }
  ) => {
    setUmkmList((prev) =>
      prev.map((u) => {
        if (u.id === umkmId) {
          const newProd: UMKMProduct = {
            id: `prod-${Date.now()}`,
            umkmId,
            name: product.name,
            description: product.description,
            priceIdr: product.priceIdr,
            category: product.category || 'culinary',
            imageUrl: product.imageUrl,
            isAvailable: product.isAvailable ?? true,
          };
          return {
            ...u,
            products: [...u.products, newProd],
          };
        }
        return u;
      })
    );
  };

  const addUMKMPromotion = (
    umkmId: string,
    promo: { title: string; description: string; discountPercentage: number; promoCode: string; validUntil: string; isActive?: boolean }
  ) => {
    setUmkmList((prev) =>
      prev.map((u) => {
        if (u.id === umkmId) {
          const newPromo: UMKMPromotion = {
            id: `promo-${Date.now()}`,
            umkmId,
            title: promo.title,
            description: promo.description,
            discountPercentage: promo.discountPercentage,
            promoCode: promo.promoCode,
            validUntil: promo.validUntil,
            redemptionCount: 0,
          };
          return {
            ...u,
            promotions: [...u.promotions, newPromo],
          };
        }
        return u;
      })
    );
  };

  // Journeys & Traveler actions (FLOW B, C, E, F, G, H)
  const getTravelerJourneys = (travelerId: string) =>
    journeys.filter((j) => j.travelerId === travelerId);

  // START OR RESUME JOURNEY (Section 7: Don't create duplicate journey if active exists!)
  const startOrResumeJourney = (destinationId: string): Journey | { error: string } => {
    const dest = destinations.find((d) => d.id === destinationId);
    if (!dest) return { error: 'Destinasi tidak ditemukan.' };
    if (dest.status !== 'published') {
      return { error: 'Destinasi ini sedang dalam persiapan (belum dipublikasikan).' };
    }

    // Check if traveler already has an active journey for this destination
    const existing = journeys.find(
      (j) => j.travelerId === currentUser.id && j.destinationId === destinationId && j.status === 'active'
    );

    if (existing) {
      logAnalyticsEvent('journey_resume', existing.id, destinationId);
      return existing;
    }

    // Create new journey
    const newJourney: Journey = {
      id: `journey-${destinationId}-${Date.now()}`,
      travelerId: currentUser.id,
      destinationId,
      status: 'active',
      startedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      visitedPoints: [],
      completedQuizzes: [],
      earnedPointsTotal: 0,
      claimedRewards: [],
      discoveredUmkmIds: [],
      albumStamps: [],
      personalNotes: '',
    };

    setJourneys((prev) => [newJourney, ...prev]);
    logAnalyticsEvent('journey_start', newJourney.id, destinationId);
    return newJourney;
  };

  // Record point interaction: VIEW -> INTERACT -> COMPLETE (Section 12)
  const recordPointInteraction = (
    explorePointId: string,
    action: 'view' | 'interact' | 'complete'
  ): { success: boolean; pointsAwarded?: number } => {
    if (!activeJourney) return { success: false };

    const point = explorePoints.find((p) => p.id === explorePointId);
    if (!point) return { success: false };

    const now = new Date().toISOString();
    let pointsAwarded = 0;

    setJourneys((prev) =>
      prev.map((j) => {
        if (j.id !== activeJourney.id) return j;

        const existingRecord = j.visitedPoints.find((vp) => vp.explorePointId === explorePointId);
        let updatedVisited: VisitedExplorePointRecord[];

        if (existingRecord) {
          if (action === 'complete' && !existingRecord.completedAt) {
            pointsAwarded = point.completionPoints || 5;
            executePointTransaction(
              currentUser.id,
              pointsAwarded,
              'explore_point',
              `Menuntaskan eksplorasi & materi etika: ${point.name}`,
              j.id,
              j.destinationId
            );
          }

          updatedVisited = j.visitedPoints.map((vp) =>
            vp.explorePointId === explorePointId
              ? {
                  ...vp,
                  interactedAt: action === 'interact' ? now : vp.interactedAt,
                  completedAt: action === 'complete' ? now : vp.completedAt,
                }
              : vp
          );
        } else {
          // First view
          updatedVisited = [
            ...j.visitedPoints,
            {
              explorePointId,
              viewedAt: now,
              interactedAt: action === 'interact' ? now : undefined,
              completedAt: action === 'complete' ? now : undefined,
            },
          ];

          if (action === 'complete') {
            pointsAwarded = point.completionPoints || 5;
            executePointTransaction(
              currentUser.id,
              pointsAwarded,
              'explore_point',
              `Menuntaskan eksplorasi & materi etika: ${point.name}`,
              j.id,
              j.destinationId
            );
          }
        }

        // Add stamp to album if completed
        let updatedStamps = j.albumStamps;
        if (action === 'complete' && !j.albumStamps.some((s) => s.explorePointId === explorePointId)) {
          updatedStamps = [
            ...j.albumStamps,
            {
              id: `stamp-${Date.now()}`,
              explorePointId,
              explorePointName: point.name,
              earnedAt: now,
              iconName: point.category,
              category: point.category,
            },
          ];
        }

        return {
          ...j,
          lastActivityAt: now,
          visitedPoints: updatedVisited,
          earnedPointsTotal: j.earnedPointsTotal + pointsAwarded,
          albumStamps: updatedStamps,
        };
      })
    );

    logAnalyticsEvent(
      action === 'view'
        ? 'explore_point_view'
        : action === 'interact'
        ? 'explore_point_interact'
        : 'explore_point_complete',
      explorePointId,
      point.destinationId
    );

    return { success: true, pointsAwarded };
  };

  // MINI QUIZ SUBMISSION (Section 13: check previous attempt, prevent duplicate points!)
  const submitQuizAttempt = (
    quizId: string,
    selectedAnswers: number[]
  ): { success: boolean; pointsEarned: number; message: string; alreadyCompleted?: boolean } => {
    if (!activeJourney) {
      return { success: false, pointsEarned: 0, message: 'Tidak ada Journey aktif.' };
    }

    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) {
      return { success: false, pointsEarned: 0, message: 'Kuis tidak ditemukan.' };
    }

    // CHECK PREVIOUS ATTEMPT (Section 13: Already completed? NO double points!)
    const previousAttempt = activeJourney.completedQuizzes.find((cq) => cq.quizId === quizId);
    if (previousAttempt) {
      return {
        success: true,
        pointsEarned: 0,
        alreadyCompleted: true,
        message: 'Kuis ini sudah pernah Anda selesaikan sebelumnya. Points tidak dapat diberikan berulang.',
      };
    }

    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const pointsEarned = correctCount * quiz.pointsPerCorrect;
    const now = new Date().toISOString();

    if (pointsEarned > 0) {
      executePointTransaction(
        currentUser.id,
        pointsEarned,
        'quiz',
        `Menjawab kuis dengan tepat: ${quiz.title}`,
        activeJourney.id,
        quiz.destinationId
      );
    }

    const attemptRecord: QuizAttemptRecord = {
      quizId,
      explorePointId: quiz.explorePointId,
      completedAt: now,
      score: correctCount,
      maxScore: quiz.questions.length,
      pointsEarned,
      selectedAnswers,
    };

    setJourneys((prev) =>
      prev.map((j) =>
        j.id === activeJourney.id
          ? {
              ...j,
              lastActivityAt: now,
              completedQuizzes: [...j.completedQuizzes, attemptRecord],
              earnedPointsTotal: j.earnedPointsTotal + pointsEarned,
            }
          : j
      )
    );

    logAnalyticsEvent('quiz_submit', quizId, quiz.destinationId, {
      score: correctCount,
      maxScore: quiz.questions.length,
      pointsEarned,
    });

    return {
      success: true,
      pointsEarned,
      message:
        correctCount === quiz.questions.length
          ? `Luar biasa! Jawaban Anda sempurna (+${pointsEarned} Jejak Points)`
          : `Kuis selesai. Anda menjawab ${correctCount} dari ${quiz.questions.length} soal (+${pointsEarned} Jejak Points)`,
    };
  };

  // REWARD REDEMPTION (Section 15: Atomic check, deduct points, reduce stock, claim code)
  const redeemReward = (
    rewardId: string
  ): { success: boolean; message: string; claimCode?: string } => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return { success: false, message: 'Reward tidak ditemukan.' };

    if (reward.status !== 'active' || reward.currentStock <= 0) {
      return { success: false, message: 'Stok reward telah habis atau sudah tidak aktif.' };
    }

    if (currentUser.pointsBalance < reward.pointsCost) {
      return {
        success: false,
        message: `Saldo Jejak Points tidak mencukupi. Anda membutuhkan ${reward.pointsCost} poin (Saldo Anda: ${currentUser.pointsBalance} poin).`,
      };
    }

    // Atomic transaction: deduct points
    const tx = executePointTransaction(
      currentUser.id,
      -reward.pointsCost,
      'reward_redemption',
      `Penukaran Reward: ${reward.title}`,
      activeJourney?.id,
      reward.destinationId
    );

    if (!tx.success) {
      return { success: false, message: 'Gagal memproses transaksi poin.' };
    }

    // Generate unique redemption code
    const claimCode = `TK-RWD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    // Reduce stock
    setRewards((prev) =>
      prev.map((r) =>
        r.id === rewardId
          ? {
              ...r,
              currentStock: r.currentStock - 1,
              status: r.currentStock - 1 <= 0 ? 'out_of_stock' : r.status,
            }
          : r
      )
    );

    // Record in active journey if present
    if (activeJourney) {
      setJourneys((prev) =>
        prev.map((j) =>
          j.id === activeJourney.id
            ? {
                ...j,
                claimedRewards: [
                  ...j.claimedRewards,
                  {
                    id: `clm-${Date.now()}`,
                    rewardId,
                    rewardTitle: reward.title,
                    pointsPaid: reward.pointsCost,
                    claimedAt: now,
                    redemptionCode: claimCode,
                    status: 'claimed',
                  },
                ],
              }
            : j
        )
      );
    }

    logAnalyticsEvent('reward_claim', rewardId, reward.destinationId, {
      pointsPaid: reward.pointsCost,
      claimCode,
    });

    return {
      success: true,
      claimCode,
      message: `Berhasil menukarkan reward! Kode klaim Anda: ${claimCode}`,
    };
  };

  // End Journey & Finalize Album
  const endJourney = (journeyId: string, notes?: string): { success: boolean; message: string } => {
    const journey = journeys.find((j) => j.id === journeyId);
    if (!journey) return { success: false, message: 'Journey tidak ditemukan.' };

    const now = new Date().toISOString();
    setJourneys((prev) =>
      prev.map((j) =>
        j.id === journeyId
          ? {
              ...j,
              status: 'completed',
              completedAt: now,
              lastActivityAt: now,
              personalNotes: notes ?? j.personalNotes,
            }
          : j
      )
    );

    logAnalyticsEvent('journey_end', journeyId, journey.destinationId);
    return {
      success: true,
      message: 'Perjalanan Anda telah selesai diarsipkan ke dalam Album Jelajah!',
    };
  };

  // Leave active destination (returns traveler to Entrance Gate Scan view)
  const leaveDestination = () => {
    if (activeJourney) {
      setJourneys((prev) =>
        prev.map((j) =>
          j.id === activeJourney.id
            ? { ...j, status: 'completed' as const, completedAt: new Date().toISOString() }
            : j
        )
      );
    }
    navigateTo('/traveler/home');
  };

  // QR RESOLUTION FLOW (Section 6: Friendly errors, no database raw dump)
  const resolveQRCode = (rawCode: string): QRResolutionResult => {
    const trimmed = rawCode.trim();
    const qr = qrCodes.find((q) => q.code === trimmed || q.id === trimmed);

    if (!qr) {
      return {
        status: 'invalid_code',
        message: 'Kode QR tidak dikenali atau belum terdaftar pada sistem resmi TAKONO.',
      };
    }

    // Check Destination Status
    const dest = destinations.find((d) => d.id === qr.destinationId);
    if (!dest || dest.status !== 'published') {
      return {
        status: 'destination_unavailable',
        message: `Destinasi (${dest?.name || 'Terkait'}) saat ini belum dipublikasikan atau sedang ditutup sementara oleh pengelola.`,
        qrData: qr,
      };
    }

    // Track QR Scan count
    setQrCodes((prev) =>
      prev.map((q) =>
        q.id === qr.id
          ? { ...q, scansCount: q.scansCount + 1, lastScannedAt: new Date().toISOString() }
          : q
      )
    );

    logAnalyticsEvent('qr_scan', qr.targetId, qr.destinationId, { targetType: qr.targetType });

    // Create or resume journey for traveler
    if (currentUser.role === 'traveler') {
      const journeyResult = startOrResumeJourney(qr.destinationId);
      const journeyId = 'id' in journeyResult ? journeyResult.id : undefined;

      return {
        status: 'success',
        message: `QR Valid: ${qr.title}`,
        qrData: qr,
        destinationId: qr.destinationId,
        targetType: qr.targetType,
        targetId: qr.targetId,
        journeyId,
      };
    }

    return {
      status: 'success',
      message: `QR Valid: ${qr.title}`,
      qrData: qr,
      destinationId: qr.destinationId,
      targetType: qr.targetType,
      targetId: qr.targetId,
    };
  };

  const generateQRCode = (
    targetType: QRCodeData['targetType'],
    destinationId: string,
    targetId: string,
    title: string,
    description: string
  ): QRCodeData => {
    const id = `QR-${targetType.toUpperCase()}-${Date.now()}`;
    const code = `TAKONO:${targetType.toUpperCase()}:${targetId}`;
    const newQR: QRCodeData = {
      id,
      code,
      targetType,
      destinationId,
      targetId,
      title,
      description,
      scansCount: 0,
      createdAt: new Date().toISOString(),
    };
    setQrCodes((prev) => [newQR, ...prev]);
    return newQR;
  };

  const simulateScanCode = (code: string) => {
    setActiveQrTargetCode(code);
    setQrModalOpen(true);
  };

  // Destination Manager Analytics
  const getDestinationMetrics = (destinationId: string): AggregatedDestinationMetric => {
    const dest = destinations.find((d) => d.id === destinationId);
    const destJourneys = journeys.filter((j) => j.destinationId === destinationId);
    const destScans = qrCodes
      .filter((q) => q.destinationId === destinationId)
      .reduce((acc, curr) => acc + curr.scansCount, 0);

    let completions = 0;
    let quizAttempts = 0;
    let correctSum = 0;
    let maxScoreSum = 0;
    let pointsDist = 0;
    let rewardsClaimed = 0;

    destJourneys.forEach((j) => {
      completions += j.visitedPoints.filter((vp) => !!vp.completedAt).length;
      quizAttempts += j.completedQuizzes.length;
      j.completedQuizzes.forEach((cq) => {
        correctSum += cq.score;
        maxScoreSum += cq.maxScore;
      });
      pointsDist += j.earnedPointsTotal;
      rewardsClaimed += j.claimedRewards.length;
    });

    const avgQuizScore = maxScoreSum > 0 ? Math.round((correctSum / maxScoreSum) * 100) : 0;
    const connectedUmkms = umkmList.filter((u) => u.associatedDestinationIds.includes(destinationId));
    const totalUmkmViews = connectedUmkms.reduce((acc, u) => acc + u.viewsCount, 0);

    return {
      destinationId,
      destinationName: dest?.name || 'Destinasi',
      totalVisitors: destJourneys.length,
      totalQrScans: destScans,
      totalExplorePointCompletions: completions,
      totalQuizAttempts: quizAttempts,
      averageQuizScorePercent: avgQuizScore,
      totalPointsDistributed: pointsDist,
      totalRewardsClaimed: rewardsClaimed,
      totalUmkmViews,
      activeJourneysCount: destJourneys.filter((j) => j.status === 'active').length,
    };
  };

  // Government Tourism Intelligence
  const getGovernmentReport = (): GovernmentIntelligenceReport => {
    const totalVisitors = journeys.length;
    const activeDests = destinations.filter((d) => d.status === 'published').length;

    // Category distribution
    const categoryMap: Record<string, number> = {};
    explorePoints.forEach((p) => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
    });

    const topVisitedExploreCategories = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      count,
    }));

    // Calculate UMKM economic impact estimate
    const approvedUmkm = umkmList.filter((u) => u.approvalStatus === 'approved');
    const totalPromoRedemptions = approvedUmkm.reduce((acc, u) => {
      const redemptions = u.promotions.reduce((pAcc, p) => pAcc + p.redemptionCount, 0);
      return acc + redemptions;
    }, 0);
    const umkmEconomicImpactIdr = totalPromoRedemptions * 45000 + approvedUmkm.length * 2500000;

    const destinationRankings = destinations.map((d) => {
      const metrics = getDestinationMetrics(d.id);
      const points = getExplorePointsByDestination(d.id);
      const completionRate =
        points.length > 0 && metrics.totalVisitors > 0
          ? Math.min(100, Math.round((metrics.totalExplorePointCompletions / (points.length * metrics.totalVisitors)) * 100))
          : 0;

      return {
        destinationId: d.id,
        destinationName: d.name,
        province: d.province,
        visitorCount: metrics.totalVisitors,
        completionRate,
        economicImpactIdr: metrics.totalRewardsClaimed * 35000 + metrics.totalVisitors * d.ticketPriceIdr,
      };
    });

    return {
      period: 'Tahun 2026 — Kuartal I',
      totalVisitorsProvinceWide: totalVisitors,
      activeDestinationsCount: activeDests,
      totalEcoCultureComplianceScore: 94,
      topVisitedExploreCategories,
      umkmEconomicImpactIdr,
      destinationRankings,
    };
  };

  const getTravelerTransactions = (travelerId: string) =>
    pointTransactions.filter((tx) => tx.travelerId === travelerId);

  return (
    <TakonoStoreContext.Provider
      value={{
        currentUser,
        switchUserRole,
        switchUser,
        allUsers: users,
        users,
        destinations,
        getDestination,
        updateDestinationStatus,
        updateDestination,
        createDestination,
        explorePoints,
        getExplorePointsByDestination,
        getExplorePoint,
        saveExplorePoint,
        addExplorePoint: saveExplorePoint,
        updateExplorePoint: (id: string, partial: Partial<ExplorePoint>) =>
          saveExplorePoint({ ...partial, id, destinationId: partial.destinationId || '', name: partial.name || '' }),
        updateExplorePointStatus,
        quizzes,
        getQuizByExplorePoint,
        saveQuiz,
        addQuiz: saveQuiz,
        updateQuiz: (id: string, partial: Partial<Quiz>) =>
          saveQuiz({ ...partial, id, explorePointId: partial.explorePointId || '', destinationId: partial.destinationId || '', title: partial.title || '' }),
        rewards,
        getRewardsByDestination,
        saveReward,
        addReward: saveReward,
        updateReward: (id: string, partial: Partial<DestinationReward>) =>
          saveReward({ ...partial, id, destinationId: partial.destinationId || '', title: partial.title || '' }),
        events,
        getEventsByDestination,
        saveEvent,
        addEvent: saveEvent,
        umkmList,
        getApprovedUMKMByDestination,
        getUMKMById,
        updateUMKMApproval,
        approveUMKM,
        rejectUMKM,
        updateUMKMProfile,
        addUMKMProduct,
        addUMKMPromotion,
        journeys,
        activeJourney,
        getTravelerJourneys,
        startOrResumeJourney,
        recordPointInteraction,
        submitQuizAttempt,
        redeemReward,
        endJourney,
        leaveDestination,
        pointTransactions,
        getTravelerTransactions,
        qrCodes,
        resolveQRCode,
        generateQRCode,
        analyticsEvents,
        logAnalyticsEvent,
        getDestinationMetrics,
        getGovernmentReport,
        activeRoute,
        navigateTo,
        qrModalOpen,
        setQrModalOpen,
        activeQrTargetCode,
        simulateScanCode,
        authToken,
        dbStatus,
        checkDbStatus,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        login,
        register,
        logout,
      }}
    >
      {children}
    </TakonoStoreContext.Provider>
  );
};

export const useTakonoStore = () => {
  const context = useContext(TakonoStoreContext);
  if (!context) {
    throw new Error('useTakonoStore must be used within a TakonoStoreProvider');
  }
  return context;
};
