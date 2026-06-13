import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useAppContext } from '../../store/context';
import { calculateStreak } from '../../utils';
import { mockDailyStats } from '../../data/records';
import StatCard from '../../components/StatCard';
import styles from './index.module.scss';

const StatsPage: React.FC = () => {
  const { pets, plans, records, currentPetId } = useAppContext();

  const currentPet = useMemo(() => {
    return pets.find(p => p.id === currentPetId) || pets[0];
  }, [pets, currentPetId]);

  const petRecords = useMemo(() => {
    return records.filter(r => r.petId === currentPet?.id);
  }, [records, currentPet]);

  const stats = useMemo(() => {
    const totalRecords = petRecords.length;
    const successRecords = petRecords.filter(r => r.success).length;
    const successRate = totalRecords > 0 ? Math.round((successRecords / totalRecords) * 100) : 0;
    const totalDuration = petRecords.reduce((sum, r) => sum + r.duration, 0);
    const streak = calculateStreak(petRecords);

    const planStats = plans
      .filter(p => p.petId === currentPet?.id)
      .map(plan => {
        const planRecords = petRecords.filter(r => r.planId === plan.id);
        const successCount = planRecords.filter(r => r.success).length;
        const rate = planRecords.length > 0 ? Math.round((successCount / planRecords.length) * 100) : 0;
        return { ...plan, rate, total: planRecords.length };
      })
      .filter(p => p.total > 0)
      .sort((a, b) => a.rate - b.rate);

    const hardestActions = planStats.slice(0, 3);

    return {
      totalRecords,
      successRecords,
      successRate,
      totalDuration,
      streak,
      hardestActions,
      avgDuration: totalRecords > 0 ? Math.round(totalDuration / totalRecords) : 0
    };
  }, [petRecords, plans, currentPet]);

  const maxBarHeight = 200;

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>{currentPet?.name}的训练数据</Text>
        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{stats.streak}</Text>
            <Text className={styles.statLabel}>连续天数</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{stats.totalRecords}</Text>
            <Text className={styles.statLabel}>总训练次数</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{stats.successRate}%</Text>
            <Text className={styles.statLabel}>总成功率</Text>
          </View>
        </View>
      </View>

      <ScrollView scrollY className={styles.content}>
        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text className={styles.title}>成功率曲线</Text>
          </View>
          <View className={styles.chartCard}>
            <View className={styles.chart}>
              {mockDailyStats.map((item, index) => {
                const successHeight = (item.successCount / Math.max(item.totalCount, 1)) * maxBarHeight;
                const failHeight = ((item.totalCount - item.successCount) / Math.max(item.totalCount, 1)) * maxBarHeight;
                return (
                  <View key={index} className={styles.barWrapper}>
                    <View style={{ display: 'flex', alignItems: 'flex-end', height: `${maxBarHeight}rpx` }}>
                      <View 
                        className={styles.bar}
                        style={{ height: `${successHeight}rpx` }}
                      />
                    </View>
                    <Text className={styles.dateLabel}>{item.date}</Text>
                  </View>
                );
              })}
            </View>
            <View className={styles.legend}>
              <View className={styles.legendItem}>
                <View className={`${styles.legendDot} ${styles.legendDotSuccess}`} />
                <Text className={styles.legendText}>成功</Text>
              </View>
              <View className={styles.legendItem}>
                <View className={`${styles.legendDot} ${styles.legendDotFail}`} />
                <Text className={styles.legendText}>失败</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text className={styles.title}>最难的动作</Text>
          </View>
          <View className={styles.hardestList}>
            {stats.hardestActions.length > 0 ? (
              stats.hardestActions.map((item, index) => (
                <View key={item.id} className={styles.hardestItem}>
                  <View 
                    className={`${styles.rank} ${
                      index === 0 ? styles.rankFirst : 
                      index === 1 ? styles.rankSecond : 
                      index === 2 ? styles.rankThird : ''
                    }`}
                  >
                    {index + 1}
                  </View>
                  <View className={styles.planInfo}>
                    <Text className={styles.planName}>{item.name}</Text>
                    <Text className={styles.planRate}>
                      成功率 <Text className={styles.rateValue}>{item.rate}%</Text> ({item.total}次训练)
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.hardestItem}>
                <Text style={{ color: '#B2BEC3', textAlign: 'center', width: '100%' }}>
                  暂无训练数据
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text className={styles.title}>历史数据</Text>
          </View>
          <View className={styles.historyCard}>
            <View className={styles.historyItem}>
              <Text className={styles.historyLabel}>成功次数</Text>
              <Text className={styles.historyValue}>{stats.successRecords}次</Text>
            </View>
            <View className={styles.historyItem}>
              <Text className={styles.historyLabel}>总训练时长</Text>
              <Text className={styles.historyValue}>{stats.totalDuration}分钟</Text>
            </View>
            <View className={styles.historyItem}>
              <Text className={styles.historyLabel}>平均时长</Text>
              <Text className={styles.historyValue}>{stats.avgDuration}分钟/次</Text>
            </View>
            <View className={styles.historyItem}>
              <Text className={styles.historyLabel}>训练计划数</Text>
              <Text className={styles.historyValue}>{plans.filter(p => p.petId === currentPet?.id).length}个</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default StatsPage;
