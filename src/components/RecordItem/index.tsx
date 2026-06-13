import React from 'react';
import { View, Text } from '@tarojs/components';
import { TrainingRecord } from '../../types';
import { formatDuration } from '../../utils';
import styles from './index.module.scss';

interface RecordItemProps {
  record: TrainingRecord;
  planName: string;
  onClick?: () => void;
}

const RecordItem: React.FC<RecordItemProps> = ({ record, planName, onClick }) => {
  return (
    <View className={styles.item} onClick={onClick}>
      <View className={styles.status}>
        {record.success ? (
          <Text className={styles.successIcon}>✓</Text>
        ) : (
          <Text className={styles.failIcon}>✗</Text>
        )}
      </View>
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.planName}>{planName}</Text>
          <Text className={styles.date}>{record.date}</Text>
        </View>
        <View className={styles.details}>
          <Text className={styles.detail}>⏱ {formatDuration(record.duration)}</Text>
          <Text className={styles.detail}>📍 {record.environment}</Text>
        </View>
        {record.notes && (
          <Text className={styles.notes} numberOfLines={1}>{record.notes}</Text>
        )}
      </View>
    </View>
  );
};

export default RecordItem;
