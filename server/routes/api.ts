import { Router, Request, Response } from 'express';
import {
  isConnectedToMySQL,
  pool,
  inMemoryStore,
  getDbStatus,
} from '../db';

const router = Router();

// ==========================================
// 1. DATABASE & HEALTH STATUS
// ==========================================
router.get('/db/status', async (req: Request, res: Response) => {
  const status = await getDbStatus();
  res.json(status);
});

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), platform: 'TAKONO Tourism Ecosystem' });
});

// ==========================================
// 2. DESTINATIONS
// ==========================================
router.get('/destinations', async (req: Request, res: Response) => {
  try {
    if (isConnectedToMySQL && pool) {
      const [rows]: any = await pool.query('SELECT * FROM destinations ORDER BY created_at DESC');
      const formatted = rows.map((r: any) => ({
        ...r,
        galleryImages: typeof r.gallery_images === 'string' ? JSON.parse(r.gallery_images) : r.gallery_images,
        rulesSummary: typeof r.rules_summary === 'string' ? JSON.parse(r.rules_summary) : r.rules_summary,
        managerName: r.manager_name,
        managerId: r.manager_id,
        ticketPriceIdr: r.ticket_price_idr,
        bannerImageUrl: r.banner_image_url,
        contactPhone: r.contact_phone,
        contactEmail: r.contact_email,
        operatingHours: r.operating_hours,
      }));
      res.json(formatted);
    } else {
      res.json(inMemoryStore.destinations);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/destinations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isConnectedToMySQL && pool) {
      const [rows]: any = await pool.query('SELECT * FROM destinations WHERE id = ? OR slug = ?', [id, id]);
      if (rows.length === 0) {
        res.status(404).json({ error: 'Destinasi tidak ditemukan' });
        return;
      }
      const r = rows[0];
      res.json({
        ...r,
        galleryImages: typeof r.gallery_images === 'string' ? JSON.parse(r.gallery_images) : r.gallery_images,
        rulesSummary: typeof r.rules_summary === 'string' ? JSON.parse(r.rules_summary) : r.rules_summary,
        managerName: r.manager_name,
        managerId: r.manager_id,
        ticketPriceIdr: r.ticket_price_idr,
        bannerImageUrl: r.banner_image_url,
      });
    } else {
      const dest = inMemoryStore.destinations.find((d) => d.id === id || d.slug === id);
      if (!dest) {
        res.status(404).json({ error: 'Destinasi tidak ditemukan' });
        return;
      }
      res.json(dest);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/destinations', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = data.id || `dest-${Date.now()}`;
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newDest = {
      ...data,
      id,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isConnectedToMySQL && pool) {
      await pool.query(
        `INSERT INTO destinations (id, name, slug, tagline, description, category, province, regency, district, village, manager_name, manager_id, contact_phone, contact_email, status, ticket_price_idr, banner_image_url, gallery_images, rules_summary, operating_hours)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          data.name,
          slug,
          data.tagline || '',
          data.description || '',
          data.category || 'Desa Adat & Budaya',
          data.province,
          data.regency,
          data.district,
          data.village,
          data.managerName || 'Pengelola',
          data.managerId || 'manager-1',
          data.contactPhone || '',
          data.contactEmail || '',
          data.status || 'published',
          data.ticketPriceIdr || 0,
          data.bannerImageUrl || '',
          JSON.stringify(data.galleryImages || []),
          JSON.stringify(data.rulesSummary || []),
          data.operatingHours || '08:00 - 18:00 WITA',
        ]
      );
    } else {
      inMemoryStore.destinations.unshift(newDest);
    }

    res.status(201).json(newDest);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. EXPLORE POINTS
// ==========================================
router.get('/explore-points', async (req: Request, res: Response) => {
  try {
    const { destinationId } = req.query;
    if (isConnectedToMySQL && pool) {
      const sql = destinationId
        ? 'SELECT * FROM explore_points WHERE destination_id = ? ORDER BY sequence_order ASC'
        : 'SELECT * FROM explore_points ORDER BY sequence_order ASC';
      const [rows]: any = await pool.query(sql, destinationId ? [destinationId] : []);
      const formatted = rows.map((r: any) => ({
        ...r,
        rulesAndEtiquette: typeof r.rules_and_etiquette === 'string' ? JSON.parse(r.rules_and_etiquette) : r.rules_and_etiquette,
        destinationId: r.destination_id,
        shortSnippet: r.short_snippet,
        culturalStory: r.cultural_story,
        qrCodeId: r.qr_code_id,
        pointsReward: r.points_reward,
        imageUrl: r.image_url,
        sequenceOrder: r.sequence_order,
      }));
      res.json(formatted);
    } else {
      const list = destinationId
        ? inMemoryStore.explorePoints.filter((p) => p.destinationId === destinationId)
        : inMemoryStore.explorePoints;
      res.json(list);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/explore-points', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = data.id || `pt-${Date.now()}`;
    const qrCodeId = data.qrCodeId || `QR-EXP-${id.toUpperCase()}`;

    const newPoint = {
      ...data,
      id,
      qrCodeId,
      createdAt: new Date().toISOString(),
    };

    if (isConnectedToMySQL && pool) {
      await pool.query(
        `INSERT INTO explore_points (id, destination_id, name, category, zone_type, short_snippet, description, cultural_story, rules_and_etiquette, qr_code_id, points_reward, status, image_url, sequence_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          data.destinationId,
          data.name,
          data.category || 'Cagar Budaya',
          data.zoneType || 'Zona Utama',
          data.shortSnippet || '',
          data.description || '',
          data.culturalStory || '',
          JSON.stringify(data.rulesAndEtiquette || []),
          qrCodeId,
          data.pointsReward || 25,
          data.status || 'active',
          data.imageUrl || '',
          data.sequenceOrder || 1,
        ]
      );
    } else {
      inMemoryStore.explorePoints.push(newPoint);
    }

    res.status(201).json(newPoint);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. QUIZZES
// ==========================================
router.get('/quizzes', async (req: Request, res: Response) => {
  try {
    const { explorePointId, destinationId } = req.query;
    if (isConnectedToMySQL && pool) {
      let sql = 'SELECT * FROM quizzes WHERE 1=1';
      const params: any[] = [];
      if (explorePointId) {
        sql += ' AND explore_point_id = ?';
        params.push(explorePointId);
      }
      if (destinationId) {
        sql += ' AND destination_id = ?';
        params.push(destinationId);
      }
      const [rows]: any = await pool.query(sql, params);
      const formatted = rows.map((r: any) => ({
        ...r,
        questions: typeof r.questions === 'string' ? JSON.parse(r.questions) : r.questions,
        explorePointId: r.explore_point_id,
        destinationId: r.destination_id,
        pointsPerCorrect: r.points_per_correct,
        isActive: Boolean(r.is_active),
      }));
      res.json(formatted);
    } else {
      let list = inMemoryStore.quizzes;
      if (explorePointId) list = list.filter((q) => q.explorePointId === explorePointId);
      if (destinationId) list = list.filter((q) => q.destinationId === destinationId);
      res.json(list);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. UMKM
// ==========================================
router.get('/umkm', async (req: Request, res: Response) => {
  try {
    const { destinationId, status } = req.query;
    if (isConnectedToMySQL && pool) {
      let sql = 'SELECT * FROM umkm WHERE 1=1';
      const params: any[] = [];
      if (status) {
        sql += ' AND approval_status = ?';
        params.push(status);
      }
      const [rows]: any = await pool.query(sql, params);

      // fetch products and promotions
      const result: any[] = [];
      for (const r of rows) {
        const [prods]: any = await pool.query('SELECT * FROM umkm_products WHERE umkm_id = ?', [r.id]);
        const [promos]: any = await pool.query('SELECT * FROM umkm_promotions WHERE umkm_id = ?', [r.id]);
        result.push({
          id: r.id,
          businessName: r.business_name,
          ownerName: r.owner_name,
          ownerId: r.owner_id,
          category: r.category,
          address: r.address,
          phone: r.phone,
          instagram: r.instagram,
          description: r.description,
          imageUrl: r.image_url,
          approvalStatus: r.approval_status,
          rejectionReason: r.rejection_reason,
          associatedDestinationIds: typeof r.associated_destination_ids === 'string' ? JSON.parse(r.associated_destination_ids) : r.associated_destination_ids,
          viewsCount: r.views_count,
          travelerInteractionsCount: r.traveler_interactions_count,
          products: prods.map((p: any) => ({
            id: p.id,
            umkmId: p.umkm_id,
            name: p.name,
            description: p.description,
            priceIdr: p.price_idr,
            category: p.category,
            imageUrl: p.image_url,
            isAvailable: Boolean(p.is_available),
          })),
          promotions: promos.map((p: any) => ({
            id: p.id,
            umkmId: p.umkm_id,
            title: p.title,
            description: p.description,
            discountPercentage: p.discount_percentage,
            promoCode: p.promo_code,
            validUntil: p.valid_until,
            redemptionCount: p.redemption_count,
            isActive: Boolean(p.is_active),
          })),
        });
      }

      if (destinationId) {
        res.json(result.filter((u) => u.associatedDestinationIds?.includes(destinationId)));
      } else {
        res.json(result);
      }
    } else {
      let list = inMemoryStore.umkm;
      if (status) list = list.filter((u) => u.approvalStatus === status);
      if (destinationId) list = list.filter((u) => u.associatedDestinationIds.includes(destinationId as string));
      res.json(list);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/umkm/:id/approve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isConnectedToMySQL && pool) {
      await pool.query('UPDATE umkm SET approval_status = "approved", verified_at = NOW() WHERE id = ?', [id]);
    } else {
      const found = inMemoryStore.umkm.find((u) => u.id === id);
      if (found) {
        found.approvalStatus = 'approved';
        found.verifiedAt = new Date().toISOString();
      }
    }
    res.json({ success: true, message: 'UMKM berhasil disetujui!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/umkm/:id/reject', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    if (isConnectedToMySQL && pool) {
      await pool.query('UPDATE umkm SET approval_status = "rejected", rejection_reason = ? WHERE id = ?', [reason || 'Tidak memenuhi kriteria', id]);
    } else {
      const found = inMemoryStore.umkm.find((u) => u.id === id);
      if (found) {
        found.approvalStatus = 'rejected';
        found.rejectionReason = reason;
      }
    }
    res.json({ success: true, message: 'Pendaftaran UMKM ditolak.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/umkm/:id/products', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const prod = req.body;
    const prodId = prod.id || `prod-${Date.now()}`;

    if (isConnectedToMySQL && pool) {
      await pool.query(
        `INSERT INTO umkm_products (id, umkm_id, name, description, price_idr, category, image_url, is_available)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [prodId, id, prod.name, prod.description || '', prod.priceIdr || 0, prod.category || 'culinary', prod.imageUrl || '', prod.isAvailable ?? true]
      );
    } else {
      const found = inMemoryStore.umkm.find((u) => u.id === id);
      if (found) {
        found.products.push({
          id: prodId,
          umkmId: id,
          name: prod.name,
          description: prod.description || '',
          priceIdr: prod.priceIdr || 0,
          category: prod.category || 'culinary',
          imageUrl: prod.imageUrl || '',
          isAvailable: prod.isAvailable ?? true,
        });
      }
    }
    res.status(201).json({ success: true, id: prodId, message: 'Produk berhasil ditambahkan.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. REWARDS & REDEMPTION
// ==========================================
router.get('/rewards', async (req: Request, res: Response) => {
  try {
    const { destinationId } = req.query;
    if (isConnectedToMySQL && pool) {
      const sql = destinationId ? 'SELECT * FROM rewards WHERE destination_id = ?' : 'SELECT * FROM rewards';
      const [rows]: any = await pool.query(sql, destinationId ? [destinationId] : []);
      const formatted = rows.map((r: any) => ({
        id: r.id,
        destinationId: r.destination_id,
        title: r.title,
        category: r.category,
        description: r.description,
        pointsCost: r.points_cost,
        initialStock: r.initial_stock,
        currentStock: r.current_stock,
        partnerUmkmId: r.partner_umkm_id,
        discountValueIdr: r.discount_value_idr,
        imageUrl: r.image_url,
        status: r.status,
      }));
      res.json(formatted);
    } else {
      const list = destinationId
        ? inMemoryStore.rewards.filter((r) => r.destinationId === destinationId)
        : inMemoryStore.rewards;
      res.json(list);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/rewards/redeem', async (req: Request, res: Response) => {
  try {
    const { userId, rewardId } = req.body;
    if (!userId || !rewardId) {
      res.status(400).json({ error: 'userId dan rewardId wajib diisi.' });
      return;
    }

    if (isConnectedToMySQL && pool) {
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();

        // 1. Check user points
        const [users]: any = await conn.query('SELECT * FROM users WHERE id = ? FOR UPDATE', [userId]);
        if (users.length === 0) throw new Error('Pengguna tidak ditemukan');
        const user = users[0];

        // 2. Check reward
        const [rewards]: any = await conn.query('SELECT * FROM rewards WHERE id = ? FOR UPDATE', [rewardId]);
        if (rewards.length === 0) throw new Error('Reward tidak ditemukan');
        const reward = rewards[0];

        if (reward.current_stock <= 0) throw new Error('Stok reward telah habis');
        if (user.points_balance < reward.points_cost) {
          throw new Error(`Saldo poin tidak mencukupi (${user.points_balance} / ${reward.points_cost} poin)`);
        }

        // 3. Deduct points and reduce stock
        await conn.query('UPDATE users SET points_balance = points_balance - ? WHERE id = ?', [reward.points_cost, userId]);
        await conn.query('UPDATE rewards SET current_stock = current_stock - 1 WHERE id = ?', [rewardId]);

        // 4. Create transaction record
        const claimCode = `TK-RWD-${Math.floor(1000 + Math.random() * 9000)}`;
        const txId = `tx-${Date.now()}`;
        await conn.query(
          `INSERT INTO point_transactions (id, user_id, points_change, type, description, destination_id)
           VALUES (?, ?, ?, 'reward_redemption', ?, ?)`,
          [txId, userId, -reward.points_cost, `Penukaran Reward: ${reward.title} (Kode: ${claimCode})`, reward.destination_id]
        );

        await conn.commit();
        res.json({ success: true, claimCode, message: `Reward berhasil ditukarkan! Kode klaim: ${claimCode}` });
      } catch (e: any) {
        await conn.rollback();
        res.status(400).json({ error: e.message });
      } finally {
        conn.release();
      }
    } else {
      // In-memory fallback
      const user = inMemoryStore.users.find((u) => u.id === userId);
      const reward = inMemoryStore.rewards.find((r) => r.id === rewardId);
      if (!user) { res.status(404).json({ error: 'Pengguna tidak ditemukan' }); return; }
      if (!reward) { res.status(404).json({ error: 'Reward tidak ditemukan' }); return; }
      if (reward.currentStock <= 0) { res.status(400).json({ error: 'Stok reward telah habis' }); return; }
      if (user.pointsBalance < reward.pointsCost) {
        res.status(400).json({ error: `Saldo poin tidak mencukupi (${user.pointsBalance} / ${reward.pointsCost} poin)` });
        return;
      }

      user.pointsBalance -= reward.pointsCost;
      reward.currentStock -= 1;
      const claimCode = `TK-RWD-${Math.floor(1000 + Math.random() * 9000)}`;

      inMemoryStore.pointTransactions.unshift({
        id: `tx-${Date.now()}`,
        travelerId: userId,
        pointsChange: -reward.pointsCost,
        type: 'reward_redemption',
        description: `Penukaran Reward: ${reward.title} (Kode: ${claimCode})`,
        timestamp: new Date().toISOString(),
        destinationId: reward.destinationId,
      } as any);

      res.json({ success: true, claimCode, message: `Reward berhasil ditukarkan! Kode klaim: ${claimCode}` });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7. JOURNEYS & CHECK-IN
// ==========================================
router.get('/journeys', async (req: Request, res: Response) => {
  try {
    const { travelerId } = req.query;
    if (isConnectedToMySQL && pool) {
      const sql = travelerId ? 'SELECT * FROM journeys WHERE traveler_id = ?' : 'SELECT * FROM journeys';
      const [rows]: any = await pool.query(sql, travelerId ? [travelerId] : []);
      const formatted = rows.map((r: any) => ({
        ...r,
        travelerId: r.traveler_id,
        destinationId: r.destination_id,
        startedAt: r.started_at,
        lastActivityAt: r.last_activity_at,
        completedAt: r.completed_at,
        visitedPoints: typeof r.visited_points === 'string' ? JSON.parse(r.visited_points) : r.visited_points || [],
        completedQuizzes: typeof r.completed_quizzes === 'string' ? JSON.parse(r.completed_quizzes) : r.completed_quizzes || [],
        claimedRewards: typeof r.claimed_rewards === 'string' ? JSON.parse(r.claimed_rewards) : r.claimed_rewards || [],
        earnedPointsTotal: r.earned_points_total,
      }));
      res.json(formatted);
    } else {
      const list = travelerId
        ? inMemoryStore.journeys.filter((j) => j.travelerId === travelerId)
        : inMemoryStore.journeys;
      res.json(list);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/journeys/start', async (req: Request, res: Response) => {
  try {
    const { travelerId, destinationId } = req.body;
    if (!travelerId || !destinationId) {
      res.status(400).json({ error: 'travelerId dan destinationId wajib diisi.' });
      return;
    }

    const journeyId = `jrn-${Date.now()}`;
    const newJourney = {
      id: journeyId,
      travelerId,
      destinationId,
      status: 'active',
      startedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      visitedPoints: [],
      completedQuizzes: [],
      claimedRewards: [],
      earnedPointsTotal: 0,
      notes: '',
    };

    if (isConnectedToMySQL && pool) {
      await pool.query(
        `INSERT INTO journeys (id, traveler_id, destination_id, status, visited_points, completed_quizzes, claimed_rewards, earned_points_total)
         VALUES (?, ?, ?, 'active', '[]', '[]', '[]', 0)`,
        [journeyId, travelerId, destinationId]
      );
    } else {
      inMemoryStore.journeys.unshift(newJourney as any);
    }

    res.status(201).json(newJourney);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 8. POINT TRANSACTIONS
// ==========================================
router.get('/points/transactions', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (isConnectedToMySQL && pool) {
      const sql = userId
        ? 'SELECT id, user_id AS travelerId, points_change AS pointsChange, type, description, journey_id AS journeyId, destination_id AS destinationId, timestamp FROM point_transactions WHERE user_id = ? ORDER BY timestamp DESC'
        : 'SELECT id, user_id AS travelerId, points_change AS pointsChange, type, description, journey_id AS journeyId, destination_id AS destinationId, timestamp FROM point_transactions ORDER BY timestamp DESC';
      const [rows]: any = await pool.query(sql, userId ? [userId] : []);
      res.json(rows);
    } else {
      const list = userId
        ? inMemoryStore.pointTransactions.filter((tx) => tx.travelerId === userId)
        : inMemoryStore.pointTransactions;
      res.json(list);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
