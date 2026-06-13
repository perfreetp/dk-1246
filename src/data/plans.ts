import { TrainingPlan } from '../types';

export const mockPlans: TrainingPlan[] = [
  {
    id: '1',
    petId: '1',
    name: '定点如厕训练',
    targetType: 'toilet',
    stage: 'intermediate',
    command: '尿尿',
    reward: '小零食3颗',
    progress: 12,
    totalDays: 21,
    createdAt: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    petId: '1',
    name: '握手技能',
    targetType: 'shake',
    stage: 'beginner',
    command: 'give me paw',
    reward: '零食+夸奖',
    progress: 5,
    totalDays: 14,
    createdAt: '2024-01-20',
    status: 'active'
  },
  {
    id: '3',
    petId: '1',
    name: '召回训练',
    targetType: 'recall',
    stage: 'intermediate',
    command: '过来',
    reward: '最爱零食',
    progress: 8,
    totalDays: 14,
    createdAt: '2024-01-18',
    status: 'active'
  },
  {
    id: '4',
    petId: '2',
    name: '安静等待',
    targetType: 'stay',
    stage: 'beginner',
    command: '等等',
    reward: '猫条',
    progress: 3,
    totalDays: 14,
    createdAt: '2024-02-01',
    status: 'active'
  }
];

export const targetTypeLabels: Record<string, string> = {
  toilet: '定点如厕',
  shake: '握手',
  recall: '召回',
  stay: '安静等待',
  sit: '坐下',
  down: '趴下',
  heel: '随行',
  fetch: '取物'
};

export const stageLabels: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级'
};
