export type PointTransactionType = 
  | 'explore_point' 
  | 'quiz' 
  | 'reward_redemption' 
  | 'bonus' 
  | 'event_checkin';

export interface PointTransaction {
  id: string;
  travelerId: string;
  journeyId?: string;
  destinationId?: string;
  amount: number; // positive for earn (+5, +10), negative for redemption (-50)
  type: PointTransactionType;
  description: string;
  balanceAfter: number;
  createdAt: string;
}
