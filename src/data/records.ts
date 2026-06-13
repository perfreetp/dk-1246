import { TrainingRecord, DailyStats } from '../types';

export const mockRecords: TrainingRecord[] = [
  {
    id: '1',
    planId: '1',
    petId: '1',
    date: '2024-02-10',
    success: true,
    duration: 10,
    environment: '室内阳台',
    notes: '表现很好，尿对位置3次',
    createdBy: '1',
    createdAt: '2024-02-10 10:30:00'
  },
  {
    id: '2',
    planId: '1',
    petId: '1',
    date: '2024-02-10',
    success: true,
    duration: 8,
    environment: '室内客厅',
    notes: '偶尔分心，整体不错',
    createdBy: '2',
    createdAt: '2024-02-10 15:00:00'
  },
  {
    id: '3',
    planId: '2',
    petId: '1',
    date: '2024-02-10',
    success: false,
    duration: 5,
    environment: '户外公园',
    notes: '太兴奋了，无法集中注意力',
    createdBy: '1',
    createdAt: '2024-02-10 18:00:00'
  },
  {
    id: '4',
    planId: '3',
    petId: '1',
    date: '2024-02-09',
    success: true,
    duration: 15,
    environment: '室内',
    notes: '召回成功率80%',
    createdBy: '1',
    createdAt: '2024-02-09 09:00:00'
  },
  {
    id: '5',
    planId: '4',
    petId: '2',
    date: '2024-02-10',
    success: true,
    duration: 3,
    environment: '安静房间',
    notes: '第一次尝试，还不错',
    createdBy: '1',
    createdAt: '2024-02-10 20:00:00'
  }
];

export const mockDailyStats: DailyStats[] = [
  { date: '02-04', totalCount: 4, successCount: 3, successRate: 75 },
  { date: '02-05', totalCount: 5, successCount: 4, successRate: 80 },
  { date: '02-06', totalCount: 3, successCount: 2, successRate: 67 },
  { date: '02-07', totalCount: 6, successCount: 5, successRate: 83 },
  { date: '02-08', totalCount: 4, successCount: 4, successRate: 100 },
  { date: '02-09', totalCount: 5, successCount: 4, successRate: 80 },
  { date: '02-10', totalCount: 5, successCount: 4, successRate: 80 }
];
