import { Router, Request, Response, NextFunction } from 'express';
import { db } from './database.js';
import { PointService } from './services/PointService.js';
import { SmartGuideService } from './services/SmartGuideService.js';
import { QuizService } from './services/QuizService.js';
import { RewardService } from './services/RewardService.js';
import { TourismInsightService } from './services/TourismInsightService.js';
import { ExploreCategory, UserRole } from '../types/index.js';

export const apiRouter = Router();

// Middleware: Authenticate user from Bearer token
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Default fallback to demo traveler for effortless testing if no token provided
    (req as any).user = db.users[0];
    return next();
  }

  const token = authHeader.split(' ')[1];
  const user = db.getUserByToken(token);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthenticated. Sesi login telah berakhir atau token tidak valid.'
    });
  }

  (req as any).user = user;
  next();
};

// Middleware: Role-Based Authorization
const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated.' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Fitur ini memerlukan hak akses: ${allowedRoles.join(', ')}.`
      });
    }

    next();
  };
};

// ==========================================
// 1. PUBLIC ROUTES
// ==========================================

// GET /api/destinations
apiRouter.get('/destinations', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: db.destinations.filter(d => d.status === 'published')
  });
});

// GET /api/destinations/:slug
apiRouter.get('/destinations/:slug', (req: Request, res: Response) => {
  const destination = db.destinations.find(
    d => d.slug === req.params.slug || d.id === req.params.slug || d.code.toLowerCase() === req.params.slug.toLowerCase()
  );

  if (!destination) {
    return res.status(404).json({ success: false, message: 'Destinasi tidak ditemukan.' });
  }

  const explorePoints = db.explorePoints.filter(
    p => p.destinationId === destination.id && p.status === 'published'
  );
  const events = db.events.filter(e => e.destinationId === destination.id);
  const localDiscoveries = db.localDiscoveries.filter(
    l => l.destinationId === destination.id && l.status === 'published'
  );
  const rewards = db.rewards.filter(r => r.destinationId === destination.id);

  res.json({
    success: true,
    data: {
      destination,
      explorePoints,
      events,
      localDiscoveries,
      rewards
    }
  });
});

// GET /api/destinations/:id/explore-points
apiRouter.get('/destinations/:id/explore-points', (req: Request, res: Response) => {
  const points = db.explorePoints.filter(
    p => p.destinationId === req.params.id && p.status === 'published'
  );
  res.json({ success: true, data: points });
});

// GET /api/destinations/:id/events
apiRouter.get('/destinations/:id/events', (req: Request, res: Response) => {
  const events = db.events.filter(e => e.destinationId === req.params.id);
  res.json({ success: true, data: events });
});

// GET /api/destinations/:id/local-discoveries
apiRouter.get('/destinations/:id/local-discoveries', (req: Request, res: Response) => {
  const local = db.localDiscoveries.filter(
    l => l.destinationId === req.params.id && l.status === 'published'
  );
  res.json({ success: true, data: local });
});

// GET /api/destinations/:id/rewards
apiRouter.get('/destinations/:id/rewards', (req: Request, res: Response) => {
  const rewards = db.rewards.filter(r => r.destinationId === req.params.id);
  res.json({ success: true, data: rewards });
});

// GET /api/scan/:destinationCode (QR Welcome Landing)
apiRouter.get('/scan/:destinationCode', (req: Request, res: Response) => {
  const code = req.params.destinationCode.toUpperCase();
  const destination = db.destinations.find(d => d.code.toUpperCase() === code);

  if (!destination) {
    return res.status(404).json({
      success: false,
      message: `Destinasi dengan kode QR "${code}" tidak ditemukan.`
    });
  }

  res.json({
    success: true,
    data: {
      destination,
      welcomeTitle: `Selamat Datang di ${destination.name}!`,
      welcomeSubtitle: destination.tagline
    }
  });
});

// GET /api/scan/explore/:secureToken (Secure QR Validation for Explore Point)
apiRouter.get('/scan/explore/:secureToken', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const token = req.params.secureToken;

  const point = db.explorePoints.find(p => p.secureToken === token);
  if (!point) {
    return res.status(404).json({
      success: false,
      message: 'Kode QR Explore Point tidak valid atau telah kedaluwarsa.'
    });
  }

  const destination = db.destinations.find(d => d.id === point.destinationId);
  const alreadyCompleted = db.hasUserCompletedActivity(user.id, 'explore_point_discovered', point.id);

  let pointAwardResult = null;
  if (!alreadyCompleted) {
    pointAwardResult = PointService.awardPoints(
      user.id,
      point.destinationId,
      'explore_point_discovered',
      point.id,
      point.pointsReward,
      `Menemukan Explore Point: ${point.name}`,
      `Menjelajahi ${point.name}`
    );
  }

  res.json({
    success: true,
    data: {
      explorePoint: point,
      destination,
      alreadyCompleted,
      awardResult: pointAwardResult,
      message: alreadyCompleted 
        ? `Titik "${point.name}" sudah pernah kamu temukan sebelumnya!` 
        : `Luar biasa! Kamu berhasil menemukan "${point.name}" dan memperoleh +${point.pointsReward} Jejak Points!`
    }
  });
});

// ==========================================
// 2. AUTHENTICATION & DEMO ROLE SWITCHER
// ==========================================

// POST /api/auth/login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = db.getUserByEmail(email || '');

  if (!user) {
    return res.status(422).json({
      success: false,
      message: 'Email atau password yang kamu masukkan salah.'
    });
  }

  const token = `sanctum_token_${user.role}_${Date.now()}`;
  db.activeTokens.set(token, user.id);

  res.json({
    success: true,
    data: {
      user: {
        ...user,
        pointsBalance: db.getUserPointsBalance(user.id)
      },
      token
    }
  });
});

// POST /api/auth/register
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(422).json({
      success: false,
      message: 'Nama lengkap dan email wajib diisi.'
    });
  }

  if (db.getUserByEmail(email)) {
    return res.status(422).json({
      success: false,
      message: 'Email ini sudah terdaftar. Silakan login.'
    });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name,
    email,
    role: 'traveler' as UserRole,
    pointsBalance: 0,
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);

  const token = `sanctum_token_traveler_${Date.now()}`;
  db.activeTokens.set(token, newUser.id);

  res.status(201).json({
    success: true,
    data: {
      user: newUser,
      token
    }
  });
});

// GET /api/auth/me
apiRouter.get('/auth/me', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({
    success: true,
    data: {
      ...user,
      pointsBalance: db.getUserPointsBalance(user.id)
    }
  });
});

// POST /api/auth/switch-demo-role (Tester convenience tool)
apiRouter.post('/auth/switch-demo-role', (req: Request, res: Response) => {
  const { role } = req.body;
  const targetUser = db.users.find(u => u.role === role);

  if (!targetUser) {
    return res.status(404).json({ success: false, message: 'Role demo tidak ditemukan.' });
  }

  const token = `sanctum_token_${targetUser.role}`;
  db.activeTokens.set(token, targetUser.id);

  res.json({
    success: true,
    data: {
      user: {
        ...targetUser,
        pointsBalance: db.getUserPointsBalance(targetUser.id)
      },
      token
    }
  });
});

// ==========================================
// 3. TRAVELER EXPERIENCE ROUTES
// ==========================================

// GET /api/me/points
apiRouter.get('/me/points', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const balance = db.getUserPointsBalance(user.id);
  const transactions = db.pointTransactions
    .filter(t => t.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({
    success: true,
    data: {
      balance,
      transactions
    }
  });
});

// GET /api/me/activities
apiRouter.get('/me/activities', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const activities = db.activities
    .filter(a => a.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({
    success: true,
    data: activities
  });
});

// GET /api/me/album
apiRouter.get('/me/album', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const destination = db.destinations[0]; // KBS default demo
  const progress = db.getDestinationProgress(user.id, destination.id);
  const completedPoints = db.explorePoints.filter(p => progress.completedPointIds.includes(p.id));
  const redemptions = db.redemptions.filter(r => r.userId === user.id);

  res.json({
    success: true,
    data: {
      progress,
      completedPoints,
      redemptions,
      totalPointsEarned: db.pointTransactions
        .filter(t => t.userId === user.id && t.type === 'credit')
        .reduce((sum, t) => sum + t.amount, 0)
    }
  });
});

// GET /api/smart-guide/recommendations
apiRouter.get('/smart-guide/recommendations', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const destinationId = (req.query.destinationId as string) || 'dest_kbs_01';
  const preferences = (req.query.preferences as string)?.split(',').filter(Boolean) as ExploreCategory[] || [];
  
  let userCoords: [number, number] | undefined = undefined;
  if (req.query.lat && req.query.lng) {
    userCoords = [parseFloat(req.query.lat as string), parseFloat(req.query.lng as string)];
  }

  const nextRecommendation = SmartGuideService.getNextRecommendation(
    user.id,
    destinationId,
    userCoords,
    preferences
  );

  const recommendedPoints = SmartGuideService.getRecommendedPoints(
    user.id,
    destinationId,
    preferences
  );

  const progress = SmartGuideService.getUserJourneyProgress(user.id, destinationId);

  // Walking route calculation if next recommendation and user coordinates exist
  let walkingRoute = null;
  if (nextRecommendation.point && userCoords) {
    walkingRoute = SmartGuideService.calculateWalkingRoute(
      userCoords,
      [nextRecommendation.point.latitude, nextRecommendation.point.longitude]
    );
  }

  res.json({
    success: true,
    data: {
      nextRecommendation,
      recommendedPoints,
      progress,
      walkingRoute
    }
  });
});

// GET /api/explore-points/:id
apiRouter.get('/explore-points/:id', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const point = db.explorePoints.find(p => p.id === req.params.id || p.slug === req.params.id);

  if (!point) {
    return res.status(404).json({ success: false, message: 'Explore Point tidak ditemukan.' });
  }

  const alreadyCompleted = db.hasUserCompletedActivity(user.id, 'explore_point_discovered', point.id);
  const quizCompleted = point.quiz 
    ? db.hasUserCompletedActivity(user.id, 'quiz_completed', point.quiz.id) 
    : false;

  res.json({
    success: true,
    data: {
      explorePoint: point,
      alreadyCompleted,
      quizCompleted
    }
  });
});

// POST /api/explore-points/:id/scan (Simulate/Confirm arriving and scanning Explore Point)
apiRouter.post('/explore-points/:id/scan', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const point = db.explorePoints.find(p => p.id === req.params.id);

  if (!point) {
    return res.status(404).json({ success: false, message: 'Explore Point tidak ditemukan.' });
  }

  const alreadyCompleted = db.hasUserCompletedActivity(user.id, 'explore_point_discovered', point.id);
  if (alreadyCompleted) {
    return res.json({
      success: true,
      data: {
        alreadyCompleted: true,
        pointsAwarded: 0,
        newBalance: db.getUserPointsBalance(user.id),
        message: 'Explore Point ini sudah pernah kamu temukan.'
      }
    });
  }

  const result = PointService.awardPoints(
    user.id,
    point.destinationId,
    'explore_point_discovered',
    point.id,
    point.pointsReward,
    `Menemukan titik: ${point.name}`,
    `Jelajah ${point.name}`
  );

  res.json({
    success: true,
    data: {
      alreadyCompleted: false,
      pointsAwarded: result.pointsAwarded,
      newBalance: result.newBalance,
      message: result.message
    }
  });
});

// POST /api/explore-points/:id/quiz/submit (CRITICAL: Server validates correct answer)
apiRouter.post('/explore-points/:id/quiz/submit', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    return res.status(422).json({
      success: false,
      message: 'Format jawaban tidak valid.'
    });
  }

  const result = QuizService.submitQuiz(user.id, req.params.id, answers);
  res.json({
    success: result.success,
    data: result
  });
});

// GET /api/events
apiRouter.get('/events', (req: Request, res: Response) => {
  res.json({ success: true, data: db.events });
});

// POST /api/events/:id/participate
apiRouter.post('/events/:id/participate', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const event = db.events.find(e => e.id === req.params.id);

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event tidak ditemukan.' });
  }

  const alreadyParticipated = db.hasUserCompletedActivity(user.id, 'event_participated', event.id);
  if (alreadyParticipated) {
    return res.status(422).json({
      success: false,
      message: 'Kamu sudah mendaftar/berpartisipasi pada event ini sebelumnya.'
    });
  }

  const awardResult = PointService.awardPoints(
    user.id,
    event.destinationId,
    'event_participated',
    event.id,
    event.pointsReward,
    `Partisipasi event: ${event.title}`,
    `Partisipasi Event ${event.title}`
  );

  res.json({
    success: true,
    data: {
      event,
      pointsAwarded: awardResult.pointsAwarded,
      newBalance: awardResult.newBalance,
      message: `Berhasil mendaftar event! Kamu mendapatkan +${event.pointsReward} Jejak Points.`
    }
  });
});

// GET /api/rewards
apiRouter.get('/rewards', (req: Request, res: Response) => {
  res.json({ success: true, data: db.rewards });
});

// POST /api/rewards/:id/redeem
apiRouter.post('/rewards/:id/redeem', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = RewardService.redeemReward(user.id, req.params.id);

  if (!result.success) {
    return res.status(422).json(result);
  }

  res.json({
    success: true,
    data: result
  });
});

// POST /api/local-discoveries/:id/visit
apiRouter.post('/local-discoveries/:id/visit', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  const partner = db.localDiscoveries.find(l => l.id === req.params.id);

  if (!partner) {
    return res.status(404).json({ success: false, message: 'Mitra Local Discovery tidak ditemukan.' });
  }

  const alreadyVisited = db.hasUserCompletedActivity(user.id, 'local_discovery_visited', partner.id);
  if (alreadyVisited) {
    return res.json({
      success: true,
      data: {
        pointsAwarded: 0,
        message: 'Kamu sudah pernah mencatat kunjungan ke mitra ini.'
      }
    });
  }

  const award = PointService.awardPoints(
    user.id,
    partner.destinationId,
    'local_discovery_visited',
    partner.id,
    partner.pointsReward || 10,
    `Kunjungan mitra lokal: ${partner.name}`,
    `Local Discovery: ${partner.name}`
  );

  res.json({
    success: true,
    data: {
      pointsAwarded: award.pointsAwarded,
      newBalance: award.newBalance,
      message: award.message
    }
  });
});

// ==========================================
// 4. DESTINATION MANAGER ROUTES
// ==========================================

// GET /api/manager/dashboard
apiRouter.get('/manager/dashboard', authenticate, authorize(['destination_manager', 'super_admin']), (req: Request, res: Response) => {
  const user = (req as any).user;
  const destinationId = user.destinationId || 'dest_kbs_01';
  const destination = db.destinations.find(d => d.id === destinationId);
  const stats = TourismInsightService.getAggregatedStats(destinationId);

  res.json({
    success: true,
    data: {
      destination,
      stats,
      terminologyDisclaimer: 'Data ini merupakan "Aktivitas Pengguna TAKONO" pada destinasi dan bukan total seluruh pengunjung fisik.'
    }
  });
});

// CRUD /api/manager/explore-points
apiRouter.get('/manager/explore-points', authenticate, authorize(['destination_manager', 'super_admin']), (req: Request, res: Response) => {
  const user = (req as any).user;
  const destinationId = user.destinationId || 'dest_kbs_01';
  const points = db.explorePoints.filter(p => p.destinationId === destinationId);
  res.json({ success: true, data: points });
});

apiRouter.post('/manager/explore-points', authenticate, authorize(['destination_manager', 'super_admin']), (req: Request, res: Response) => {
  const user = (req as any).user;
  const destinationId = user.destinationId || 'dest_kbs_01';
  const { name, category, description, story, educationalContent, latitude, longitude, estimatedDuration, pointsReward } = req.body;

  const newPoint = {
    id: `exp_${Date.now()}`,
    destinationId,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: category || 'Edukasi',
    description: description || '',
    story: story || '',
    educationalContent: educationalContent || '',
    funFacts: ['Fakta edukasi baru ditambahkan'],
    image: '/src/assets/images/hero_takono_tourism_1790168118274.jpg',
    latitude: parseFloat(latitude) || -7.2961,
    longitude: parseFloat(longitude) || 112.7368,
    estimatedDuration: estimatedDuration || '15 menit',
    difficulty: 'Mudah' as const,
    secureToken: `token_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    pointsReward: parseInt(pointsReward) || 10,
    status: 'published' as const
  };

  db.explorePoints.push(newPoint);
  res.status(201).json({ success: true, data: newPoint });
});

apiRouter.put('/manager/explore-points/:id', authenticate, authorize(['destination_manager', 'super_admin']), (req: Request, res: Response) => {
  const index = db.explorePoints.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Explore point tidak ditemukan.' });
  }

  db.explorePoints[index] = { ...db.explorePoints[index], ...req.body };
  res.json({ success: true, data: db.explorePoints[index] });
});

apiRouter.delete('/manager/explore-points/:id', authenticate, authorize(['destination_manager', 'super_admin']), (req: Request, res: Response) => {
  db.explorePoints = db.explorePoints.filter(p => p.id !== req.params.id);
  res.json({ success: true, message: 'Explore point berhasil dihapus.' });
});

// ==========================================
// 5. GOVERNMENT / TOURISM INTELLIGENCE ROUTES
// ==========================================

// GET /api/government/dashboard
apiRouter.get('/government/dashboard', authenticate, authorize(['government', 'super_admin']), (req: Request, res: Response) => {
  const stats = TourismInsightService.getAggregatedStats();
  const insights = TourismInsightService.getActionableInsights();

  res.json({
    success: true,
    data: {
      stats,
      insights,
      dataTransparency: {
        dataSource: 'Aktivitas agregat pengguna platform TAKONO',
        collectedMetrics: [
          'Explore Point interaction',
          'Quiz participation',
          'Event engagement',
          'Reward activity',
          'Local Discovery activity'
        ],
        privacySafeguards: 'Tidak mengumpulkan atau menampilkan password, kontak pribadi, maupun profil individual wisatawan.'
      }
    }
  });
});

// GET /api/government/destinations
apiRouter.get('/government/destinations', authenticate, authorize(['government', 'super_admin']), (req: Request, res: Response) => {
  const destinationsWithStats = db.destinations.map(dest => {
    const stats = TourismInsightService.getAggregatedStats(dest.id);
    return {
      destination: dest,
      stats
    };
  });

  res.json({ success: true, data: destinationsWithStats });
});

// GET /api/government/insights
apiRouter.get('/government/insights', authenticate, authorize(['government', 'super_admin']), (req: Request, res: Response) => {
  const insights = TourismInsightService.getActionableInsights();
  res.json({ success: true, data: insights });
});

// GET /api/government/reports
apiRouter.get('/government/reports', authenticate, authorize(['government', 'super_admin']), (req: Request, res: Response) => {
  const stats = TourismInsightService.getAggregatedStats();
  const destinations = db.destinations;

  res.json({
    success: true,
    data: {
      generatedAt: new Date().toISOString(),
      reportingPeriod: '1 - 23 September 2026',
      totalActivities: stats.totalPlatformActivities,
      topDestination: 'Kebun Binatang Surabaya (KBS)',
      popularCategories: stats.popularCategories,
      destinationsSummary: destinations.map(d => ({
        id: d.id,
        name: d.name,
        city: d.city,
        totalPoints: db.explorePoints.filter(p => p.destinationId === d.id).length,
        totalEvents: db.events.filter(e => e.destinationId === d.id).length,
        totalLocalPartners: db.localDiscoveries.filter(l => l.destinationId === d.id).length
      }))
    }
  });
});
