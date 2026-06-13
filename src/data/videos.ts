import { TrainingVideo } from '../types';

const DEMO_VIDEO = 'https://www.w3schools.com/html/mov_bbb.mp4';

export const mockVideos: TrainingVideo[] = [
  {
    id: 'mock-1',
    planId: '1',
    petId: '1',
    title: '定点如厕训练第5天',
    coverUrl: 'https://picsum.photos/id/1025/400/300',
    videoUrl: DEMO_VIDEO,
    duration: 45,
    createdAt: '2024-02-08',
    tags: ['突破', '进步']
  },
  {
    id: 'mock-2',
    planId: '2',
    petId: '1',
    title: '握手训练第一次成功',
    coverUrl: 'https://picsum.photos/id/237/400/300',
    videoUrl: DEMO_VIDEO,
    duration: 30,
    createdAt: '2024-02-05',
    tags: ['首次', '成功']
  },
  {
    id: 'mock-3',
    planId: '3',
    petId: '1',
    title: '召回训练户外实拍',
    coverUrl: 'https://picsum.photos/id/1026/400/300',
    videoUrl: DEMO_VIDEO,
    duration: 60,
    createdAt: '2024-02-07',
    tags: ['户外', '进阶']
  }
];
