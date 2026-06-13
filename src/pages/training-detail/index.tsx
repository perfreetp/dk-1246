import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '../../store/context';
import { getTargetTypeIcon, getStageColor, formatDuration } from '../../utils';
import { stageLabels } from '../../data/plans';
import styles from './index.module.scss';

const TrainingDetailPage: React.FC = () => {
  const { plans, records } = useAppContext();
  const [plan, setPlan] = useState<any>(null);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1] as any;
    const options = currentPage?.options || {};
    const planId = options.planId || '';
    
    const foundPlan = plans.find(p => p.id === planId);
    setPlan(foundPlan);
  }, [plans]);

  const planRecords = useMemo(() => {
    if (!plan) return [];
    return records.filter(r => r.planId === plan.id).slice(0, 5);
  }, [records, plan]);

  if (!plan) {
    return (
      <View className={styles.container}>
        <View className={styles.notFound}>
          <Text className={styles.notFoundText}>训练计划不存在</Text>
        </View>
      </View>
    );
  }

  const progressPercent = Math.round((plan.progress / plan.totalDays) * 100);
  const isCompleted = plan.progress >= plan.totalDays;

  const handleStartTraining = () => {
    Taro.switchTab({ url: '/pages/checkin/index' });
  };

  const handleViewCertificate = () => {
    Taro.navigateTo({ 
      url: `/pages/certificate/index?planId=${plan.id}` 
    });
  };

  const handleComplete = () => {
    setShowComplete(true);
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.iconRow}>
          <Text className={styles.icon}>{getTargetTypeIcon(plan.targetType)}</Text>
        </View>
        <Text className={styles.name}>{plan.name}</Text>
        <View className={styles.stage}>
          <Text className={styles.stageTag}>{stageLabels[plan.stage]}</Text>
        </View>

        <View className={styles.progressSection}>
          <View className={styles.progressHeader}>
            <Text className={styles.progressLabel}>训练进度</Text>
            <Text className={styles.progressValue}>{plan.progress}/{plan.totalDays}天</Text>
          </View>
          <View className={styles.progressBar}>
            <View 
              className={styles.progressFill} 
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </View>
        </View>
      </View>

      <ScrollView scrollY className={styles.content}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>训练信息</Text>
          <View className={styles.infoCard}>
            <View className={styles.infoRow}>
              <View className={styles.infoIcon}>📢</View>
              <Text className={styles.infoLabel}>训练口令</Text>
              <Text className={styles.infoValue}>{plan.command}</Text>
            </View>
            <View className={styles.infoRow}>
              <View className={styles.infoIcon}>🎁</View>
              <Text className={styles.infoLabel}>奖励方式</Text>
              <Text className={styles.infoValue}>{plan.reward}</Text>
            </View>
            <View className={styles.infoRow}>
              <View className={styles.infoIcon}>📅</View>
              <Text className={styles.infoLabel}>开始日期</Text>
              <Text className={styles.infoValue}>{plan.createdAt}</Text>
            </View>
            <View className={styles.infoRow}>
              <View className={styles.infoIcon}>📊</View>
              <Text className={styles.infoLabel}>训练状态</Text>
              <Text className={styles.infoValue}>
                {isCompleted ? '已达标 🎉' : '进行中'}
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>最近记录</Text>
          <View className={styles.recordList}>
            {planRecords.length > 0 ? (
              planRecords.map(record => (
                <View key={record.id} className={styles.recordItem}>
                  <View className={`${styles.recordIcon} ${record.success ? styles.recordIconSuccess : styles.recordIconFail}`}>
                    {record.success ? '✓' : '✗'}
                  </View>
                  <View className={styles.recordInfo}>
                    <Text className={styles.recordDate}>{record.date}</Text>
                    <Text className={styles.recordDuration}>
                      {record.environment} · {formatDuration(record.duration)}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.recordItem}>
                <Text style={{ color: '#B2BEC3', textAlign: 'center', width: '100%' }}>
                  暂无训练记录
                </Text>
              </View>
            )}
          </View>
        </View>

        {isCompleted ? (
          <View className={styles.completedSection}>
            <Text className={styles.completedText}>🎉 训练目标已达成！</Text>
            <View className={styles.certificateBtn} onClick={handleViewCertificate}>
              <Text className={styles.certificateBtnText}>🏆 查看训练证书</Text>
            </View>
          </View>
        ) : (
          <View className={styles.actionBtn} onClick={handleStartTraining}>
            <Text className={styles.actionBtnText}>开始训练打卡</Text>
          </View>
        )}
      </ScrollView>

      {showComplete && (
        <View className={styles.completeModal}>
          <View className={styles.modalContent}>
            <Text className={styles.celebration}>🎉</Text>
            <Text className={styles.modalTitle}>恭喜完成训练！</Text>
            <Text className={styles.modalText}>
              {plan.name}训练计划已完成！{'\n'}
              你的宠物真棒！
            </Text>
            <View className={styles.modalBtn} onClick={handleViewCertificate}>
              <Text className={styles.modalBtnText}>查看证书</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default TrainingDetailPage;
