import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '../../store/context';
import { getTargetTypeIcon } from '../../utils';
import { targetTypeLabels } from '../../data/plans';
import styles from './index.module.scss';

const nextPlanSuggestions: Array<{ type: string; name: string; desc: string }> = [
  { type: 'recall', name: '召回训练', desc: '进阶版召回，加强远距离唤回能力' },
  { type: 'heel', name: '随行训练', desc: '学习跟随主人步伐行走' },
  { type: 'fetch', name: '取物训练', desc: '培养取回物品的能力' }
];

const CertificatePage: React.FC = () => {
  const { pets, plans } = useAppContext();

  const planId = useMemo(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = (currentPage as any)?.options || {};
    return options.planId || '';
  }, []);

  const plan = useMemo(() => {
    return plans.find(p => p.id === planId);
  }, [plans, planId]);

  const pet = useMemo(() => {
    if (!plan) return null;
    return pets.find(p => p.id === plan.petId);
  }, [pets, plan]);

  const currentDate = useMemo(() => {
    const date = new Date();
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }, []);

  if (!plan || !pet) {
    return (
      <View className={styles.container}>
        <Text>证书不存在</Text>
      </View>
    );
  }

  const handleStartPlan = (type: string) => {
    Taro.switchTab({ url: '/pages/plan/index' });
  };

  const handleShare = () => {
    Taro.showShareMenu();
    Taro.showToast({ title: '请点击右上角分享', icon: 'none' });
  };

  return (
    <View className={styles.container}>
      <ScrollView scrollY>
        <View className={styles.certificate}>
          <View className={styles.certificateBorder}>
            <View className={styles.certificateHeader}>
              <Text className={styles.certificateIcon}>🏆</Text>
              <Text className={styles.certificateTitle}>训练证书</Text>
              <Text className={styles.certificateSubtitle}>TRAINING CERTIFICATE</Text>
            </View>

            <View className={styles.certificateBody}>
              <Text className={styles.petName}>{pet.name}</Text>
              <Text className={styles.planName}>{plan.name}</Text>
              <Text className={styles.date}>完成日期：{currentDate}</Text>
            </View>

            <View className={styles.certificateFooter}>
              <Text className={styles.congrats}>🎉 恭喜完成训练！</Text>
              <Text className={styles.suggestion}>
                💡 训练建议：{'\n'}
                1. 继续保持每日训练习惯{'\n'}
                2. 巩固已学技能，增加复杂环境下的练习{'\n'}
                3. 适当增加训练难度，挑战进阶技能
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>推荐下一步训练</Text>
          <View className={styles.nextPlanList}>
            {nextPlanSuggestions.map((item, index) => (
              <View 
                key={index} 
                className={styles.nextPlanItem}
                onClick={() => handleStartPlan(item.type)}
              >
                <View className={styles.planIcon}>
                  {getTargetTypeIcon(item.type)}
                </View>
                <View className={styles.planInfo}>
                  <Text className={styles.planNameText}>{item.name}</Text>
                  <Text className={styles.planDesc}>{item.desc}</Text>
                </View>
                <View className={styles.startBtn}>开始</View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.shareBtn} onClick={handleShare}>
          <Text>🎉</Text>
          <Text className={styles.shareBtnText}>分享证书</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default CertificatePage;
