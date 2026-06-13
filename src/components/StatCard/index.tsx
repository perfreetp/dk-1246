import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon,
  color = '#FF9B52' 
}) => {
  return (
    <View className={styles.card}>
      {icon && (
        <View className={styles.iconWrapper} style={{ backgroundColor: `${color}15` }}>
          <Text className={styles.icon}>{icon}</Text>
        </View>
      )}
      <Text className={styles.title}>{title}</Text>
      <Text className={styles.value} style={{ color }}>{value}</Text>
      {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

export default StatCard;
