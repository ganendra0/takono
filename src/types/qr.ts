export type QRTargetType = 'destination' | 'explore_point' | 'event' | 'content';

export interface QRCodeData {
  id: string; // e.g. QR-DEST-PENGLIPURAN
  code: string;
  targetType: QRTargetType;
  destinationId: string;
  targetId: string; // ID of destination, explorePoint, event, or content
  title: string;
  description: string;
  scansCount: number;
  lastScannedAt?: string;
  createdAt: string;
}

export type QRResolutionStatus = 
  | 'success' 
  | 'invalid_code' 
  | 'target_not_found' 
  | 'destination_unavailable';

export interface QRResolutionResult {
  status: QRResolutionStatus;
  message: string;
  qrData?: QRCodeData;
  destinationId?: string;
  targetType?: QRTargetType;
  targetId?: string;
  journeyId?: string;
}
