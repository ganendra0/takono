import { db } from '../database.js';
import { ActivityType, PointTransaction, UserActivity } from '../../types/index.js';

export class PointService {
  /**
   * Safe transaction method to award points.
   * Ensures idempotency: a user cannot receive points twice for the exact same activity.
   */
  static awardPoints(
    userId: string,
    destinationId: string,
    sourceType: ActivityType,
    sourceId: string,
    amount: number,
    description: string,
    activityTitle: string
  ): { success: boolean; message: string; pointsAwarded: number; newBalance: number } {
    // 1. Check idempotency (prevent duplicate point exploitation)
    const alreadyCompleted = db.hasUserCompletedActivity(userId, sourceType, sourceId);
    if (alreadyCompleted) {
      const currentBalance = db.getUserPointsBalance(userId);
      return {
        success: false,
        message: 'Aktivitas ini sudah pernah diselesaikan sebelumnya. Poin tidak dapat diklaim dua kali.',
        pointsAwarded: 0,
        newBalance: currentBalance
      };
    }

    // 2. Create Ledger Transaction
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const pointTransaction: PointTransaction = {
      id: transactionId,
      userId,
      type: 'credit',
      sourceType,
      sourceId,
      amount,
      description,
      createdAt: new Date().toISOString()
    };
    db.pointTransactions.push(pointTransaction);

    // 3. Record User Activity Log
    const activityId = `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const userActivity: UserActivity = {
      id: activityId,
      userId,
      destinationId,
      type: sourceType,
      referenceId: sourceId,
      title: activityTitle,
      pointsEarned: amount,
      createdAt: new Date().toISOString()
    };
    db.activities.push(userActivity);

    // 4. Update user cache balance
    const user = db.getUserById(userId);
    const newBalance = db.getUserPointsBalance(userId);
    if (user) {
      user.pointsBalance = newBalance;
    }

    return {
      success: true,
      message: `Selamat! Kamu mendapatkan +${amount} Jejak Points.`,
      pointsAwarded: amount,
      newBalance
    };
  }

  /**
   * Safe transaction method to debit points (e.g. for reward redemptions).
   */
  static debitPoints(
    userId: string,
    amount: number,
    sourceId: string,
    description: string
  ): { success: boolean; message: string; newBalance: number } {
    const currentBalance = db.getUserPointsBalance(userId);

    if (currentBalance < amount) {
      return {
        success: false,
        message: `Jejak Points tidak mencukupi. Saldo kamu saat ini ${currentBalance} poin, dibutuhkan ${amount} poin.`,
        newBalance: currentBalance
      };
    }

    // Ledger debit entry
    const transactionId = `tx_deb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const pointTransaction: PointTransaction = {
      id: transactionId,
      userId,
      type: 'debit',
      sourceType: 'reward_redeemed',
      sourceId,
      amount,
      description,
      createdAt: new Date().toISOString()
    };
    db.pointTransactions.push(pointTransaction);

    const user = db.getUserById(userId);
    const newBalance = db.getUserPointsBalance(userId);
    if (user) {
      user.pointsBalance = newBalance;
    }

    return {
      success: true,
      message: `Berhasil menggunakan ${amount} Jejak Points.`,
      newBalance
    };
  }
}
