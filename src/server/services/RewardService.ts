import { db } from '../database.js';
import { PointService } from './PointService.js';
import { RewardRedemption } from '../../types/index.js';

export class RewardService {
  /**
   * Redeem reward using Jejak Points in a transactional operation.
   * Checks point balance, reward quota, and active validity date.
   */
  static redeemReward(
    userId: string,
    rewardId: string
  ): {
    success: boolean;
    redemption?: RewardRedemption;
    remainingBalance: number;
    message: string;
  } {
    const reward = db.rewards.find(r => r.id === rewardId);
    const currentBalance = db.getUserPointsBalance(userId);

    if (!reward) {
      return {
        success: false,
        remainingBalance: currentBalance,
        message: 'Reward tidak ditemukan.'
      };
    }

    if (reward.status !== 'active') {
      return {
        success: false,
        remainingBalance: currentBalance,
        message: 'Reward saat ini sedang tidak aktif atau persediaan habis.'
      };
    }

    if (reward.quota <= reward.claimedCount) {
      return {
        success: false,
        remainingBalance: currentBalance,
        message: 'Maaf, kuota reward ini telah habis ditukarkan.'
      };
    }

    // Check validity date
    if (new Date(reward.validUntil) < new Date()) {
      return {
        success: false,
        remainingBalance: currentBalance,
        message: 'Masa berlaku penukaran reward ini sudah berakhir.'
      };
    }

    // Check balance
    if (currentBalance < reward.pointsRequired) {
      return {
        success: false,
        remainingBalance: currentBalance,
        message: `Poin tidak mencukupi. Kamu memiliki ${currentBalance} poin, diperlukan ${reward.pointsRequired} poin.`
      };
    }

    // Deduct points safely
    const debitResult = PointService.debitPoints(
      userId,
      reward.pointsRequired,
      reward.id,
      `Penukaran reward: ${reward.name}`
    );

    if (!debitResult.success) {
      return {
        success: false,
        remainingBalance: currentBalance,
        message: debitResult.message
      };
    }

    // Decrement remaining quota
    reward.claimedCount += 1;
    if (reward.claimedCount >= reward.quota) {
      reward.status = 'out_of_stock';
    }

    // Generate unique verifiable redemption voucher code
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const redemptionCode = `TAKONO-${reward.name.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}-${randomCode}`;

    const redemption: RewardRedemption = {
      id: `red_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      rewardId: reward.id,
      rewardName: reward.name,
      partner: reward.partner,
      redemptionCode,
      pointsSpent: reward.pointsRequired,
      claimedAt: new Date().toISOString(),
      status: 'active'
    };

    db.redemptions.push(redemption);

    return {
      success: true,
      redemption,
      remainingBalance: debitResult.newBalance,
      message: `Selamat! Berhasil menukarkan "${reward.name}". Simpan kode voucher kamu.`
    };
  }
}
