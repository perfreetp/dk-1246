import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { Pet } from '../../types';
import styles from './index.module.scss';

interface PetCardProps {
  pet: Pet;
  isSelected?: boolean;
  onClick?: () => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, isSelected, onClick }) => {
  return (
    <View 
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
    >
      <View className={styles.avatarWrapper}>
        <Image 
          className={styles.avatar} 
          src={pet.avatar} 
          mode='aspectFill'
        />
        {pet.species === 'dog' && <Text className={styles.badge}>🐕</Text>}
        {pet.species === 'cat' && <Text className={styles.badge}>🐱</Text>}
      </View>
      <View className={styles.info}>
        <Text className={styles.name}>{pet.name}</Text>
        <Text className={styles.breed}>{pet.breed} · {pet.age}</Text>
      </View>
      {pet.members.length > 1 && (
        <View className={styles.members}>
          <Text className={styles.memberCount}>👥 {pet.members.length}</Text>
        </View>
      )}
    </View>
  );
};

export default PetCard;
