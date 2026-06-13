import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { TrainingVideo } from '../../types';
import styles from './index.module.scss';

interface VideoCardProps {
  video: TrainingVideo;
  onClick?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const formatVideoDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View className={styles.card} onClick={onClick}>
      <View className={styles.coverWrapper}>
        <Image 
          className={styles.cover} 
          src={video.coverUrl} 
          mode='aspectFill'
        />
        <View className={styles.duration}>
          <Text className={styles.durationText}>{formatVideoDuration(video.duration)}</Text>
        </View>
        <View className={styles.playIcon}>▶</View>
      </View>
      <View className={styles.info}>
        <Text className={styles.title} numberOfLines={2}>{video.title}</Text>
        <View className={styles.meta}>
          <Text className={styles.date}>{video.createdAt}</Text>
          <View className={styles.tags}>
            {video.tags.map((tag, index) => (
              <Text key={index} className={styles.tag}>{tag}</Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default VideoCard;
