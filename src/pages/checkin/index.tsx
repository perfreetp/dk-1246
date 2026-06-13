import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '../../store/context';
import { TrainingRecord } from '../../types';
import { generateId } from '../../utils';
import RecordItem from '../../components/RecordItem';
import styles from './index.module.scss';

const CheckinPage: React.FC = () => {
  const { pets, plans, records, currentPetId, addRecord, updatePlanProgress } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newRecord, setNewRecord] = useState({
    planId: '',
    success: true as boolean,
    duration: 10,
    environment: '室内',
    notes: ''
  });

  const currentPet = useMemo(() => {
    return pets.find(p => p.id === currentPetId) || pets[0];
  }, [pets, currentPetId]);

  const activePlans = useMemo(() => {
    return plans.filter(p => p.petId === currentPet?.id && p.status === 'active');
  }, [plans, currentPet]);

  const selectedDateStr = useMemo(() => {
    return selectedDate.toISOString().split('T')[0];
  }, [selectedDate]);

  const dateRecords = useMemo(() => {
    return records.filter(r => r.petId === currentPet?.id && r.date === selectedDateStr);
  }, [records, currentPet, selectedDateStr]);

  const todayStats = useMemo(() => {
    const total = dateRecords.length;
    const success = dateRecords.filter(r => r.success).length;
    return { total, success, rate: total > 0 ? Math.round((success / total) * 100) : 0 };
  }, [dateRecords]);

  const formatDateDisplay = (date: Date): { date: string; weekday: string } => {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return {
      date: `${month}月${day}日`,
      weekday: weekdays[date.getDay()]
    };
  };

  const dateDisplay = formatDateDisplay(selectedDate);

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleSubmitRecord = () => {
    if (!newRecord.planId) {
      Taro.showToast({ title: '请选择训练计划', icon: 'none' });
      return;
    }

    const plan = plans.find(p => p.id === newRecord.planId);
    if (!plan) return;

    const record: TrainingRecord = {
      id: generateId(),
      planId: newRecord.planId,
      petId: currentPet?.id || '',
      date: selectedDateStr,
      success: newRecord.success,
      duration: newRecord.duration,
      environment: newRecord.environment,
      notes: newRecord.notes,
      createdBy: currentPet?.members[0]?.id || '',
      createdAt: new Date().toISOString()
    };

    addRecord(record);

    if (newRecord.success) {
      const newProgress = plan.progress + 1;
      updatePlanProgress(plan.id, newProgress);

      if (newProgress >= plan.totalDays) {
        Taro.showModal({
          title: '🎉 训练达标！',
          content: `${plan.name}训练目标已完成！可以去"计划"页面查看证书。`,
          showCancel: false,
          confirmText: '好的'
        });
      } else {
        Taro.showToast({ title: '打卡成功', icon: 'success' });
      }
    } else {
      Taro.showToast({ title: '记录已保存', icon: 'success' });
    }

    setShowModal(false);
    setNewRecord({
      planId: '',
      success: true,
      duration: 10,
      environment: '室内',
      notes: ''
    });
  };

  const getPlanName = (planId: string): string => {
    const plan = plans.find(p => p.id === planId);
    return plan?.name || '未知计划';
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.dateNav}>
          <View className={styles.navBtn} onClick={handlePrevDay}>◀</View>
          <View>
            <Text className={styles.currentDate}>{dateDisplay.date}</Text>
            <Text className={styles.weekday}>{dateDisplay.weekday}</Text>
          </View>
          <View className={styles.navBtn} onClick={handleNextDay}>▶</View>
        </View>

        <View className={styles.todayStats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{todayStats.total}</Text>
            <Text className={styles.statLabel}>训练次数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{todayStats.success}</Text>
            <Text className={styles.statLabel}>成功次数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{todayStats.rate}%</Text>
            <Text className={styles.statLabel}>成功率</Text>
          </View>
        </View>
      </View>

      <ScrollView scrollY className={styles.recordList}>
        <View className={styles.sectionTitle}>
          <Text className={styles.title}>训练记录</Text>
          <Text className={styles.count}>{dateRecords.length}条</Text>
        </View>

        {dateRecords.length > 0 ? (
          dateRecords.map(record => (
            <RecordItem
              key={record.id}
              record={record}
              planName={getPlanName(record.planId)}
            />
          ))
        ) : (
          <View className={styles.empty}>
            <Text className={styles.emptyText}>暂无训练记录</Text>
            <Text className={styles.emptyHint}>点击右下角按钮开始打卡</Text>
          </View>
        )}
      </ScrollView>

      <View className={styles.floatingBtn} onClick={() => setShowModal(true)}>
        <Text className={styles.floatingIcon}>+</Text>
        <Text className={styles.floatingText}>打卡</Text>
      </View>

      {showModal && (
        <View className={styles.modal} onClick={() => setShowModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>训练打卡</Text>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>选择训练计划</Text>
              <View className={styles.planSelect}>
                {activePlans.map(plan => (
                  <View
                    key={plan.id}
                    className={`${styles.planItem} ${newRecord.planId === plan.id ? styles.planItemActive : ''}`}
                    onClick={() => setNewRecord(prev => ({ ...prev, planId: plan.id }))}
                  >
                    <Text className={styles.planText}>{plan.name}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>训练结果</Text>
              <View className={styles.resultRow}>
                <View 
                  className={`${styles.resultBtn} ${styles.successBtn} ${newRecord.success && styles.resultBtnActive}`}
                  onClick={() => setNewRecord(prev => ({ ...prev, success: true }))}
                >
                  <Text className={styles.resultIcon}>✓</Text>
                  <Text className={styles.resultText}>成功</Text>
                </View>
                <View 
                  className={`${styles.resultBtn} ${styles.failBtn} ${!newRecord.success && styles.resultBtnActive}`}
                  onClick={() => setNewRecord(prev => ({ ...prev, success: false }))}
                >
                  <Text className={styles.resultIcon}>✗</Text>
                  <Text className={styles.resultText}>失败</Text>
                </View>
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>训练时长（分钟）</Text>
              <View className={styles.durationRow}>
                <Input
                  className={styles.formInput}
                  type='number'
                  value={String(newRecord.duration)}
                  onInput={e => setNewRecord(prev => ({ ...prev, duration: Number(e.detail.value) }))}
                />
                <Text className={styles.durationUnit}>分钟</Text>
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>训练环境</Text>
              <Input
                className={styles.formInput}
                placeholder='如：室内客厅、户外公园'
                value={newRecord.environment}
                onInput={e => setNewRecord(prev => ({ ...prev, environment: e.detail.value }))}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>备注</Text>
              <Textarea
                className={styles.formTextarea}
                placeholder='记录训练中的表现、遇到的问题等'
                value={newRecord.notes}
                onInput={e => setNewRecord(prev => ({ ...prev, notes: e.detail.value }))}
              />
            </View>

            <View className={styles.btnRow}>
              <View className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                <Text className={styles.cancelBtnText}>取消</Text>
              </View>
              <View className={styles.submitBtn} onClick={handleSubmitRecord}>
                <Text className={styles.submitBtnText}>确认打卡</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CheckinPage;
