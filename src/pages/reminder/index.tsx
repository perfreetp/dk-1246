import React, { useState, useMemo } from 'react';
import { View, Text, Switch, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '../../store/context';
import { Reminder } from '../../types';
import { generateId } from '../../utils';
import styles from './index.module.scss';

const dayNames = ['一', '二', '三', '四', '五', '六', '日'];

const ReminderPage: React.FC = () => {
  const { pets, reminders, currentPetId, addReminder, updateReminder } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [newReminder, setNewReminder] = useState({
    petId: '',
    timeHour: '09',
    timeMin: '00',
    days: [1, 2, 3, 4, 5, 6, 7]
  });

  const currentPet = useMemo(() => {
    return pets.find(p => p.id === currentPetId) || pets[0];
  }, [pets, currentPetId]);

  const petReminders = useMemo(() => {
    return reminders.filter(r => r.petId === currentPet?.id);
  }, [reminders, currentPet]);

  const handleToggleReminder = (reminder: Reminder) => {
    updateReminder(reminder.id, { enabled: !reminder.enabled });
  };

  const handleToggleDay = (day: number) => {
    setNewReminder(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day].sort()
    }));
  };

  const handleAddReminder = () => {
    if (!newReminder.petId) {
      Taro.showToast({ title: '请选择宠物', icon: 'none' });
      return;
    }
    if (newReminder.days.length === 0) {
      Taro.showToast({ title: '请至少选择一天', icon: 'none' });
      return;
    }

    const time = `${newReminder.timeHour.padStart(2, '0')}:${newReminder.timeMin.padStart(2, '0')}`;
    
    const reminder: Reminder = {
      id: generateId(),
      petId: newReminder.petId,
      time,
      enabled: true,
      days: newReminder.days.sort()
    };

    addReminder(reminder);
    setShowModal(false);
    setNewReminder({
      petId: '',
      timeHour: '09',
      timeMin: '00',
      days: [1, 2, 3, 4, 5, 6, 7]
    });
    Taro.showToast({ title: '提醒设置成功', icon: 'success' });
  };

  const openAddModal = () => {
    setNewReminder(prev => ({ ...prev, petId: currentPet?.id || '' }));
    setShowModal(true);
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>训练提醒</Text>
        <Text className={styles.subtitle}>设置每日训练提醒，养成好习惯</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text className={styles.title}>提醒列表</Text>
            <Text className={styles.count}>{petReminders.length}个</Text>
          </View>
          <View className={styles.reminderList}>
            {petReminders.length > 0 ? (
              petReminders.map(reminder => {
                const pet = pets.find(p => p.id === reminder.petId);
                return (
                  <View key={reminder.id} className={styles.reminderItem}>
                    <View className={styles.petInfo}>
                      <Text className={styles.petName}>{pet?.name || '未知宠物'}</Text>
                      <Text className={styles.reminderTime}>每天 {reminder.time}</Text>
                      <View className={styles.days}>
                        {[1, 2, 3, 4, 5, 6, 7].map(day => (
                          <View 
                            key={day}
                            className={`${styles.day} ${reminder.days.includes(day) ? styles.dayActive : ''}`}
                          >
                            {dayNames[day - 1]}
                          </View>
                        ))}
                      </View>
                    </View>
                    <Switch 
                      className={styles.switch}
                      checked={reminder.enabled}
                      color='#FF9B52'
                      onChange={() => handleToggleReminder(reminder)}
                    />
                  </View>
                );
              })
            ) : (
              <View className={styles.emptyReminder}>
                <Text style={{ color: '#B2BEC3', textAlign: 'center', width: '100%' }}>
                  暂无提醒设置
                </Text>
              </View>
            )}
          </View>
          <View className={styles.addBtn} onClick={openAddModal}>
            <Text>➕</Text>
            <Text className={styles.addBtnText}>添加新提醒</Text>
          </View>
        </View>

        <View className={styles.tip}>
          <Text className={styles.tipTitle}>💡 训练提醒小贴士</Text>
          <Text className={styles.tipText}>
            1. 建议每天固定时间训练，帮助宠物形成习惯{'\n'}
            2. 每次训练控制在10-15分钟{'\n'}
            3. 训练前后不要喂食，保持饥饿感有助于学习{'\n'}
            4. 保持耐心，正向鼓励比惩罚更有效
          </Text>
        </View>
      </View>

      {showModal && (
        <View className={styles.modal} onClick={() => setShowModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>添加训练提醒</Text>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>选择宠物</Text>
              <View className={styles.petGrid}>
                {pets.map(pet => (
                  <View
                    key={pet.id}
                    className={`${styles.dayItem} ${newReminder.petId === pet.id ? styles.dayItemActive : ''}`}
                    onClick={() => setNewReminder(prev => ({ ...prev, petId: pet.id }))}
                  >
                    {pet.name}
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>提醒时间</Text>
              <View className={styles.timePicker}>
                <View className={styles.timeInputWrapper}>
                  <Input
                    className={styles.timeInput}
                    type='number'
                    maxlength={2}
                    value={newReminder.timeHour}
                    onInput={e => {
                      const val = e.detail.value.slice(0, 2);
                      setNewReminder(prev => ({ ...prev, timeHour: val }));
                    }}
                  />
                  <Text className={styles.timeColon}>时</Text>
                </View>
                <Text className={styles.timeSep}>:</Text>
                <View className={styles.timeInputWrapper}>
                  <Input
                    className={styles.timeInput}
                    type='number'
                    maxlength={2}
                    value={newReminder.timeMin}
                    onInput={e => {
                      const val = e.detail.value.slice(0, 2);
                      setNewReminder(prev => ({ ...prev, timeMin: val }));
                    }}
                  />
                  <Text className={styles.timeColon}>分</Text>
                </View>
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>提醒日期</Text>
              <View className={styles.daysGrid}>
                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                  <View
                    key={day}
                    className={`${styles.dayItem} ${newReminder.days.includes(day) ? styles.dayItemActive : ''}`}
                    onClick={() => handleToggleDay(day)}
                  >
                    {dayNames[day - 1]}
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.btnRow}>
              <View className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                <Text className={styles.cancelBtnText}>取消</Text>
              </View>
              <View className={styles.submitBtn} onClick={handleAddReminder}>
                <Text className={styles.submitBtnText}>保存</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ReminderPage;
