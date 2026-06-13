import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '../../store/context';
import { TrainingPlan, TrainingTargetType, TrainingStage } from '../../types';
import { targetTypeLabels, stageLabels } from '../../data/plans';
import { getTargetTypeIcon, generateId } from '../../utils';
import TrainingCard from '../../components/TrainingCard';
import EmptyState from '../../components/EmptyState';
import styles from './index.module.scss';

type TabType = 'active' | 'completed';

const PlanPage: React.FC = () => {
  const { pets, plans, currentPetId, addPlan } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [showModal, setShowModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    targetType: 'toilet' as TrainingTargetType,
    stage: 'beginner' as TrainingStage,
    command: '',
    reward: '',
    totalDays: 14
  });

  const currentPet = useMemo(() => {
    return pets.find(p => p.id === currentPetId) || pets[0];
  }, [pets, currentPetId]);

  const filteredPlans = useMemo(() => {
    return plans.filter(p => {
      if (p.petId !== currentPet?.id) return false;
      if (activeTab === 'active') {
        return p.status === 'active';
      }
      return p.status === 'completed';
    });
  }, [plans, currentPet, activeTab]);

  const targetTypes: TrainingTargetType[] = [
    'toilet', 'shake', 'recall', 'stay', 'sit', 'down', 'heel', 'fetch'
  ];

  const stages: TrainingStage[] = ['beginner', 'intermediate', 'advanced'];

  const handleAddPlan = () => {
    if (!newPlan.name || !newPlan.command || !newPlan.reward) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    const plan: TrainingPlan = {
      id: generateId(),
      petId: currentPet?.id || '',
      name: newPlan.name,
      targetType: newPlan.targetType,
      stage: newPlan.stage,
      command: newPlan.command,
      reward: newPlan.reward,
      progress: 0,
      totalDays: newPlan.totalDays,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    addPlan(plan);
    setShowModal(false);
    setNewPlan({
      name: '',
      targetType: 'toilet',
      stage: 'beginner',
      command: '',
      reward: '',
      totalDays: 14
    });
    Taro.showToast({ title: '创建成功', icon: 'success' });
  };

  const handlePlanClick = (planId: string) => {
    Taro.navigateTo({ url: `/pages/training-detail/index?planId=${planId}` });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.tabs}>
          <View 
            className={`${styles.tab} ${activeTab === 'active' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('active')}
          >
            进行中
          </View>
          <View 
            className={`${styles.tab} ${activeTab === 'completed' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            已完成
          </View>
        </View>
      </View>

      <ScrollView scrollY className={styles.planList}>
        <View className={styles.sectionTitle}>
          <Text className={styles.title}>
            {activeTab === 'active' ? '进行中的训练' : '已完成的训练'}
          </Text>
          <Text className={styles.count}>{filteredPlans.length}个计划</Text>
        </View>

        {filteredPlans.map(plan => (
          <TrainingCard
            key={plan.id}
            plan={plan}
            onClick={() => handlePlanClick(plan.id)}
          />
        ))}

        {filteredPlans.length === 0 && (
          <EmptyState
            icon={activeTab === 'active' ? '🎯' : '🏆'}
            title={activeTab === 'active' ? '暂无进行中的训练' : '暂无已完成的训练'}
            description={activeTab === 'active' ? '点击下方按钮创建新的训练计划' : ''}
          />
        )}

        {activeTab === 'active' && (
          <View className={styles.addBtn} onClick={() => setShowModal(true)}>
            <Text>➕</Text>
            <Text className={styles.addBtnText}>创建新训练计划</Text>
          </View>
        )}
      </ScrollView>

      {showModal && (
        <View className={styles.modal} onClick={() => setShowModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>创建训练计划</Text>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>训练目标</Text>
              <View className={styles.targetGrid}>
                {targetTypes.map(type => (
                  <View
                    key={type}
                    className={`${styles.targetItem} ${newPlan.targetType === type ? styles.targetItemActive : ''}`}
                    onClick={() => setNewPlan(prev => ({ ...prev, targetType: type }))}
                  >
                    <Text className={styles.targetIcon}>{getTargetTypeIcon(type)}</Text>
                    <Text className={styles.targetText}>{targetTypeLabels[type]}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>计划名称</Text>
              <Input
                className={styles.formInput}
                placeholder='给计划起个名字'
                value={newPlan.name}
                onInput={e => setNewPlan(prev => ({ ...prev, name: e.detail.value }))}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>训练阶段</Text>
              <View className={styles.stageRow}>
                {stages.map(stage => (
                  <View
                    key={stage}
                    className={`${styles.stageItem} ${newPlan.stage === stage ? styles.stageItemActive : ''}`}
                    onClick={() => setNewPlan(prev => ({ ...prev, stage }))}
                  >
                    <Text className={styles.stageText}>{stageLabels[stage]}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>训练口令</Text>
              <Input
                className={styles.formInput}
                placeholder='如：过来、坐下、握手'
                value={newPlan.command}
                onInput={e => setNewPlan(prev => ({ ...prev, command: e.detail.value }))}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>奖励方式</Text>
              <Input
                className={styles.formInput}
                placeholder='如：小零食3颗、夸奖'
                value={newPlan.reward}
                onInput={e => setNewPlan(prev => ({ ...prev, reward: e.detail.value }))}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>训练天数</Text>
              <Input
                className={styles.formInput}
                type='number'
                placeholder='计划训练天数'
                value={String(newPlan.totalDays)}
                onInput={e => setNewPlan(prev => ({ ...prev, totalDays: Number(e.detail.value) }))}
              />
            </View>

            <View className={styles.btnRow}>
              <View className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                <Text className={styles.cancelBtnText}>取消</Text>
              </View>
              <View className={styles.submitBtn} onClick={handleAddPlan}>
                <Text className={styles.submitBtnText}>创建计划</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default PlanPage;
