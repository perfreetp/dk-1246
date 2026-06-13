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
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [modalData, setModalData] = useState({
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
    setModalData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day].sort()
    }));
  };

  const openAddModal = () => {
    setEditingReminder(null);
    setModalData({
      petId: currentPet?.id || '',
      timeHour: '09',
      timeMin: '00',
      days: [1, 2, 3, 4, 5, 6, 7]
    });
    setShowModal(true);
  };

  const openEditModal = (reminder: Reminder) => {
    const [hour, min] = reminder.time.split(':');
    setEditingReminder(reminder);
    setModalData({
      petId: reminder.petId,
      timeHour: hour || '09',
      timeMin: min || '00',
      days: [...reminder.days]
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!modalData.petId) {
      Taro.showToast({ title: '请选择宠物', icon: 'none' });
      return;
    }
    if (modalData.days.length === 0) {
      Taro.showToast({ title: '请至少选择一天', icon: 'none' });
      return;
    }

    const time = `${modalData.timeHour.padStart(2, '0')}:${modalData.timeMin.padStart(2, '0')}`;

    if (editingReminder) {
      updateReminder(editingReminder.id, {
        time,
        days: modalData.days.sort()
      });
      Taro.showToast({ title: '修改成功', icon: 'success' });
    } else {
      const reminder: Reminder = {
        id: generateId(),
        petId: modalData.petId,
        time,
        enabled: true,
        days: modalData.days.sort()
      };
      addReminder(reminder);
      Taro.showToast({ title: '添加成功', icon: 'success' });
    }

    setShowModal(false);
    setEditingReminder(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingReminder(null);
  };

  const getPetName = (petId: string): string => {
    const pet = pets.find(p => p.id === petId);
    return pet?.name || '未知宠物';
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
              petReminders.map(reminder => (
                <View key={reminder.id} className={styles.reminderItem}>
                  <View 
                    className={styles.reminderContent}
                    onClick={() => openEditModal(reminder)}
                  >
                    <View className={styles.petInfo}>
                      <Text className={styles.petName}>{getPetName(reminder.petId)}</Text>
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
                  </View>
                  <Switch 
                    className={styles.switch}
                    checked={reminder.enabled}
                    color='#FF9B52'
                    onChange={() => handleToggleReminder(reminder)}
                  />
                </View>
              ))
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
        <View className={styles.modal} onClick={handleCancel}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>
              {editingReminder ? '编辑提醒' : '添加训练提醒'}
            </Text>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>选择宠物</Text>
              <View className={styles.petGrid}>
                {pets.map(pet => (
                  <View
                    key={pet.id}
                    className={`${styles.dayItem} ${modalData.petId === pet.id ? styles.dayItemActive : ''}`}
                    onClick={() => setModalData(prev => ({ ...prev, petId: pet.id }))}
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
                    value={modalData.timeHour}
                    onInput={e => {
                      const val = e.detail.value.slice(0, 2);
                      setModalData(prev => ({ ...prev, timeHour: val }));
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
                    value={modalData.timeMin}
                    onInput={e => {
                      const val = e.detail.value.slice(0, 2);
                      setModalData(prev => ({ ...prev, timeMin: val }));
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
                    className={`${styles.dayItem} ${modalData.days.includes(day) ? styles.dayItemActive : ''}`}
                    onClick={() => handleToggleDay(day)}
                  >
                    {dayNames[day - 1]}
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.btnRow}>
              <View className={styles.cancelBtn} onClick={handleCancel}>
                <Text className={styles.cancelBtnText}>取消</Text>
              </View>
              <View className={styles.submitBtn} onClick={handleSave}>
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
