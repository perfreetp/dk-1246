import { Pet } from '../types';

export const mockPets: Pet[] = [
  {
    id: '1',
    name: '豆豆',
    avatar: 'https://picsum.photos/id/237/200/200',
    species: 'dog',
    breed: '金毛',
    age: '2岁',
    weight: '30kg',
    members: [
      { id: '1', name: '小明', avatar: 'https://picsum.photos/id/64/200/200', role: 'owner' },
      { id: '2', name: '小红', avatar: 'https://picsum.photos/id/91/200/200', role: 'trainer' }
    ]
  },
  {
    id: '2',
    name: '咪咪',
    avatar: 'https://picsum.photos/id/659/200/200',
    species: 'cat',
    breed: '英短',
    age: '1岁',
    weight: '4kg',
    members: [
      { id: '1', name: '小明', avatar: 'https://picsum.photos/id/64/200/200', role: 'owner' }
    ]
  }
];
