export interface Pet {
  id: string;
  name: string;
  avatar: string;
  species: 'dog' | 'cat';
  breed: string;
  age: string;
  weight: string;
  members: PetMember[];
}

export interface PetMember {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'trainer';
}

export interface TrainingPlan {
  id: string;
  petId: string;
  name: string;
  targetType: TrainingTargetType;
  stage: TrainingStage;
  command: string;
  reward: string;
  progress: number;
  totalDays: number;
  createdAt: string;
  status: 'active' | 'completed' | 'paused';
}

export type TrainingTargetType = 
  | 'toilet'      // 定点如厕
  | 'shake'       // 握手
  | 'recall'      // 召回
  | 'stay'        // 安静等待
  | 'sit'         // 坐下
  | 'down'        // 趴下
  | 'heel'        // 随行
  | 'fetch';      // 取物

export type TrainingStage = 'beginner' | 'intermediate' | 'advanced';

export interface TrainingRecord {
  id: string;
  planId: string;
  petId: string;
  date: string;
  success: boolean;
  duration: number;
  environment: string;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export interface TrainingVideo {
  id: string;
  planId: string;
  petId: string;
  title: string;
  coverUrl: string;
  videoUrl: string;
  duration: number;
  createdAt: string;
  tags: string[];
}

export interface Reminder {
  id: string;
  petId: string;
  time: string;
  enabled: boolean;
  days: number[];
}

export interface Certificate {
  id: string;
  petId: string;
  planId: string;
  planName: string;
  completedAt: string;
  nextSuggestion: string;
}

export interface DailyStats {
  date: string;
  totalCount: number;
  successCount: number;
  successRate: number;
}

export interface AppState {
  pets: Pet[];
  plans: TrainingPlan[];
  records: TrainingRecord[];
  videos: TrainingVideo[];
  reminders: Reminder[];
  currentPetId: string | null;
  setCurrentPet: (petId: string) => void;
  addPlan: (plan: TrainingPlan) => void;
  addRecord: (record: TrainingRecord) => void;
  updatePlanProgress: (planId: string, progress: number) => void;
}
