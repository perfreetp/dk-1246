import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { TrainingPlan } from '../../types';
import { targetTypeLabels, stageLabels } from '../../data/plans';
import { getTargetTypeIcon, getStageColor } from '../../utils';
import styles from './index.module.scss';

interface TrainingCardProps {
  plan: TrainingPlan;
  onClick?: () => void;
}

const TrainingCard: React.FC<TrainingCardProps> = ({ plan, onClick }) => {
  const progressPercent = Math.round((plan.progress / plan.totalDays) * 100);
  const stageColor = getStageColor(plan.stage);

  return (
    <View className={styles.card} onClick={onClick}>
      <View className={styles.header}>
        <View className={styles.iconWrapper}>
          <Text className={styles.icon}>{getTargetTypeIcon(plan.targetType)}</Text>
        </View>
        <View className={styles.titleWrapper}>
          <Text className={styles.name}>{plan.name}</Text>
          <View className={styles.tags}>
            <Text 
              className={styles.tag}
              style={{ backgroundColor: stageColor }}
            >
              {stageLabels[plan.stage]}
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.item}>
          <Text className={styles.label}>口令</Text>
          <Text className={styles.value}>{plan.command}</Text>
        </View>
        <View className={styles.item}>
          <Text className={styles.label}>奖励</Text>
          <Text className={styles.value}>{plan.reward}</Text>
        </View>
      </View>

      <View className={styles.progress}>
        <View className={styles.progressHeader}>
          <Text className={styles.progressLabel}>训练进度</Text>
          <Text className={styles.progressValue}>{plan.progress}/{plan.totalDays}天</Text>
        </View>
        <View className={styles.progressBar}>
          <View 
            className={styles.progressFill} 
            style={{ width: `${progressPercent}%` }}
          />
        </View>
      </View>
    </View>
  );
};

export default TrainingCard;
