import React, { useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '../../store/context';
import styles from './index.module.scss';

const PetDetailPage: React.FC = () => {
  const { pets, plans, records, currentPetId } = useAppContext();

  const pet = useMemo(() => {
    return pets.find(p => p.id === currentPetId) || pets[0];
  }, [pets, currentPetId]);

  const petPlans = useMemo(() => {
    return plans.filter(p => p.petId === pet?.id);
  }, [plans, pet]);

  const petRecords = useMemo(() => {
    return records.filter(r => r.petId === pet?.id);
  }, [records, pet]);

  if (!pet) {
    return (
      <View className={styles.container}>
        <Text>宠物不存在</Text>
      </View>
    );
  }

  const getRoleLabel = (role: string) => {
    return role === 'owner' ? '主人' : '训练师';
  };

  const handleAddMember = () => {
    Taro.showToast({ title: '邀请功能开发中', icon: 'none' });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Image className={styles.avatar} src={pet.avatar} mode='aspectFill' />
        <Text className={styles.name}>{pet.name}</Text>
        <Text className={styles.breed}>{pet.breed}</Text>
        <View className={styles.info}>
          <View className={styles.infoItem}>
            <Text className={styles.infoValue}>{pet.age}</Text>
            <Text className={styles.infoLabel}>年龄</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoValue}>{pet.weight}</Text>
            <Text className={styles.infoLabel}>体重</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoValue}>{petPlans.length}</Text>
            <Text className={styles.infoLabel}>训练计划</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoValue}>{petRecords.length}</Text>
            <Text className={styles.infoLabel}>训练记录</Text>
          </View>
        </View>
      </View>

      <ScrollView scrollY className={styles.content}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>家庭成员</Text>
          <View className={styles.memberList}>
            {pet.members.map(member => (
              <View key={member.id} className={styles.memberItem}>
                <Image className={styles.memberAvatar} src={member.avatar} mode='aspectFill' />
                <View className={styles.memberInfo}>
                  <Text className={styles.memberName}>{member.name}</Text>
                  <Text className={styles.memberRole}>
                    <Text className={styles.roleTag}>{getRoleLabel(member.role)}</Text>
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View className={styles.actionBtn} onClick={handleAddMember}>
            <Text>👥</Text>
            <Text className={styles.actionBtnText}>邀请新成员</Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>训练统计</Text>
          <View className={styles.tip}>
            <Text className={styles.tipTitle}>💡 {pet.name}的训练进度</Text>
            <Text className={styles.tipText}>
              {pet.name}正在学习 {petPlans.length} 个技能，{'\n'}
              已完成训练记录 {petRecords.length} 条。{'\n'}
              继续保持，{pet.name}会越来越棒的！
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PetDetailPage;
