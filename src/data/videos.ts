import { TrainingVideo } from '../types';

export const mockVideos: TrainingVideo[] = [
  {
    id: '1',
    planId: '1',
    petId: '1',
    title: '定点如厕第5天突破',
    coverUrl: 'https://picsum.photos/id/1025/400/300',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: 45,
    createdAt: '2024-02-08',
    tags: ['突破', '进步']
  },
  {
    id: '2',
    planId: '2',
    petId: '1',
    title: '握手训练第一次成功',
    coverUrl: 'https://picsum.photos/id/237/400/300',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    duration: 30,
    createdAt: '2024-02-05',
    tags: ['首次', '成功']
  },
  {
    id: '3',
    planId: '3',
    petId: '1',
    title: '召回训练户外实拍',
    coverUrl: 'https://picsum.photos/id/1026/400/300',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: 60,
    createdAt: '2024-02-07',
    tags: ['户外', '进阶']
  }
];
