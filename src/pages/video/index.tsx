import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '../../store/context';
import VideoCard from '../../components/VideoCard';
import EmptyState from '../../components/EmptyState';
import styles from './index.module.scss';

const VideoPage: React.FC = () => {
  const { pets, videos, currentPetId } = useAppContext();

  const currentPet = useMemo(() => {
    return pets.find(p => p.id === currentPetId) || pets[0];
  }, [pets, currentPetId]);

  const petVideos = useMemo(() => {
    return videos.filter(v => v.petId === currentPet?.id);
  }, [videos, currentPet]);

  const handleUpload = () => {
    Taro.showToast({ 
      title: '请使用手机端上传视频', 
      icon: 'none',
      duration: 2000 
    });
  };

  const handleVideoClick = (videoId: string) => {
    Taro.showToast({ 
      title: '视频播放功能开发中', 
      icon: 'none',
      duration: 2000 
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>{currentPet?.name}的训练视频</Text>
        <Text className={styles.subtitle}>记录训练点滴，方便复盘回顾</Text>
        <View className={styles.uploadBtn} onClick={handleUpload}>
          <Text>📹</Text>
          <Text className={styles.uploadBtnText}>上传训练视频</Text>
        </View>
      </View>

      <ScrollView scrollY className={styles.videoList}>
        <View className={styles.sectionTitle}>
          <Text className={styles.title}>视频列表</Text>
          <Text className={styles.count}>{petVideos.length}个视频</Text>
        </View>

        {petVideos.length > 0 ? (
          petVideos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => handleVideoClick(video.id)}
            />
          ))
        ) : (
          <EmptyState
            icon='📹'
            title='暂无训练视频'
            description='上传训练视频，方便回顾和复盘训练效果'
          />
        )}
      </ScrollView>

      <View className={styles.tip}>
        <Text className={styles.tipText}>
          💡 小贴士：建议每周录制1-2个训练视频，记录进步过程。成功的视频可以帮助你总结经验，失败的视频可以帮你发现问题。
        </Text>
      </View>
    </View>
  );
};

export default VideoPage;
