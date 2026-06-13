import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useAppContext } from '../../store/context';
import { calculateStreak } from '../../utils';
import PetCard from '../../components/PetCard';
import StatCard from '../../components/StatCard';
import TrainingCard from '../../components/TrainingCard';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const { pets, plans, records, currentPetId, setCurrentPet } = useAppContext();

  const currentPet = useMemo(() => {
    return pets.find(p => p.id === currentPetId) || pets[0];
  }, [pets, currentPetId]);

  const activePlans = useMemo(() => {
    return plans.filter(p => p.petId === currentPet?.id && p.status === 'active');
  }, [plans, currentPet]);

  const todayRecords = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return records.filter(r => r.petId === currentPet?.id && r.date === today);
  }, [records, currentPet]);

  const streak = useMemo(() => {
    const petRecords = records.filter(r => r.petId === currentPet?.id);
    return calculateStreak(petRecords);
  }, [records, currentPet]);

  const todaySuccessRate = useMemo(() => {
    if (todayRecords.length === 0) return 0;
    const successCount = todayRecords.filter(r => r.success).length;
    return Math.round((successCount / todayRecords.length) * 100);
  }, [todayRecords]);

  const navigateToTab = (tabIndex: number) => {
    const app = Taro.getApp();
    if (app?.switchTab) {
      const pages = Taro.getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const pagePath = currentPage?.route || '';
      
      const tabMap: Record<string, string> = {
        '/pages/checkin/index': 3,
        '/pages/video/index': 4
      };
      
      const targetTab = tabMap[pagePath] !== tabIndex ? tabIndex : -1;
      
      if (targetTab >= 0) {
        try {
          Taro.switchTab({ url: tabIndex === 3 ? '/pages/checkin/index' : '/pages/video/index' });
        } catch {
          const tabBar = app.$$global?.tabBar;
          if (tabBar && typeof tabBar.setCurrentIndex === 'function') {
            tabBar.setCurrentIndex(targetTab);
          }
        }
      }
    } else {
      Taro.switchTab({ url: tabIndex === 3 ? '/pages/checkin/index' : '/pages/video/index' });
    }
  };

  const handleGoToCheckin = () => {
    navigateToTab(3);
  };

  const handleGoToVideo = () => {
    navigateToTab(4);
  };

  const handlePlanClick = (planId: string) => {
    Taro.navigateTo({ url: `/pages/training-detail/index?planId=${planId}` });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <ScrollView 
          scrollX 
          className={styles.petSelector}
          showScrollbar={false}
        >
          {pets.map(pet => (
            <PetCard
              key={pet.id}
              pet={pet}
              isSelected={pet.id === currentPetId}
              onClick={() => setCurrentPet(pet.id)}
            />
          ))}
        </ScrollView>

        <View className={styles.welcome}>
          <Text className={styles.welcomeText}>
            {currentPet?.name}今天表现怎么样？
          </Text>
          <Text className={styles.subText}>
            坚持训练，让它成为最棒的伙伴
          </Text>
        </View>

        <View className={styles.statsRow}>
          <StatCard
            title='今日打卡'
            value={todayRecords.length}
            subtitle='次训练'
            icon='🔥'
            color='#FF9B52'
          />
          <StatCard
            title='成功率'
            value={`${todaySuccessRate}%`}
            subtitle={todayRecords.length > 0 ? '今日' : '暂无数据'}
            icon='📊'
            color='#00B894'
          />
          <StatCard
            title='连续天数'
            value={streak}
            subtitle='天'
            icon='🏆'
            color='#74B9FF'
          />
        </View>
      </View>

      <View className={styles.quickActions}>
        <View className={styles.actionItem} onClick={handleGoToCheckin}>
          <View className={styles.actionIcon}>📝</View>
          <Text className={styles.actionText}>快速打卡</Text>
        </View>
        <View className={styles.actionItem} onClick={handleGoToVideo}>
          <View className={styles.actionIcon}>📹</View>
          <Text className={styles.actionText}>上传视频</Text>
        </View>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.title}>进行中的训练</Text>
        <View 
          className={styles.moreBtn}
          onClick={() => Taro.switchTab({ url: '/pages/plan/index' })}
        >
          查看全部 >
        </View>
      </View>

      <View className={styles.planList}>
        {activePlans.slice(0, 3).map(plan => (
          <TrainingCard
            key={plan.id}
            plan={plan}
            onClick={() => handlePlanClick(plan.id)}
          />
        ))}
        {activePlans.length === 0 && (
          <View className={styles.emptyText}>
            <Text>暂无进行中的训练计划</Text>
            <Text>去计划页创建新的训练吧！</Text>
          </View>
        )}
      </View>

      <View className={styles.tips}>
        <Text className={styles.tipsTitle}>💡 今日训练小贴士</Text>
        <Text className={styles.tipsContent}>
          训练时保持耐心，每次训练时间控制在10-15分钟以内。
          成功时及时给予奖励和夸奖，失败时不要惩罚，保持积极态度。
        </Text>
      </View>
    </View>
  );
};

export default HomePage;
