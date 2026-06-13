import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '../../store/context';
import { TrainingVideo } from '../../types';
import { generateId } from '../../utils';
import VideoCard from '../../components/VideoCard';
import EmptyState from '../../components/EmptyState';
import styles from './index.module.scss';

const VideoPage: React.FC = () => {
  const { pets, videos, currentPetId, addVideo } = useAppContext();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');

  const currentPet = useMemo(() => {
    return pets.find(p => p.id === currentPetId) || pets[0];
  }, [pets, currentPetId]);

  const petVideos = useMemo(() => {
    return videos.filter(v => v.petId === currentPet?.id);
  }, [videos, currentPet]);

  const handleUpload = () => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.chooseMedia({
        count: 1,
        mediaType: ['video'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFile = res.tempFiles[0];
          setShowUploadModal(true);
          (global as any).__tempVideoPath = tempFile.tempFilePath;
          (global as any).__tempVideoDuration = Math.round(tempFile.duration || 30);
        },
        fail: () => {
          setShowUploadModal(true);
        }
      });
    } else {
      setShowUploadModal(true);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && newVideo.tags.length < 3) {
      setNewVideo(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setNewVideo(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSaveVideo = () => {
    if (!newVideo.title.trim()) {
      Taro.showToast({ title: '请输入视频标题', icon: 'none' });
      return;
    }

    const video: TrainingVideo = {
      id: generateId(),
      planId: '',
      petId: currentPet?.id || '',
      title: newVideo.title,
      coverUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 200)}/400/300`,
      videoUrl: (global as any).__tempVideoPath || '',
      duration: (global as any).__tempVideoDuration || 30,
      createdAt: new Date().toISOString().split('T')[0],
      tags: newVideo.tags
    };

    addVideo(video);
    setShowUploadModal(false);
    setNewVideo({ title: '', tags: [] });
    setTagInput('');
    Taro.showToast({ title: '视频保存成功', icon: 'success' });
  };

  const handleVideoClick = (video: TrainingVideo) => {
    if (video.videoUrl) {
      Taro.previewMedia({
        sources: [{
          url: video.videoUrl,
          type: 'video'
        }],
        current: 0
      });
    } else {
      Taro.showToast({ title: '视频地址无效', icon: 'none' });
    }
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
              onClick={() => handleVideoClick(video)}
            />
          ))
        ) : (
          <EmptyState
            icon='📹'
            title='暂无训练视频'
            description='点击上方按钮上传训练视频'
          />
        )}
      </ScrollView>

      <View className={styles.tip}>
        <Text className={styles.tipText}>
          💡 小贴士：建议每周录制1-2个训练视频，记录进步过程。
        </Text>
      </View>

      {showUploadModal && (
        <View className={styles.modal} onClick={() => setShowUploadModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>保存视频信息</Text>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>视频标题</Text>
              <Input
                className={styles.formInput}
                placeholder='给视频起个标题'
                value={newVideo.title}
                onInput={e => setNewVideo(prev => ({ ...prev, title: e.detail.value }))}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>标签（最多3个）</Text>
              <View className={styles.tagRow}>
                <Input
                  className={styles.tagInput}
                  placeholder='添加标签'
                  value={tagInput}
                  onInput={e => setTagInput(e.detail.value)}
                  onConfirm={handleAddTag}
                />
                <View className={styles.addTagBtn} onClick={handleAddTag}>
                  <Text className={styles.addTagText}>添加</Text>
                </View>
              </View>
              <View className={styles.tagList}>
                {newVideo.tags.map((tag, index) => (
                  <View key={index} className={styles.tagItem}>
                    <Text className={styles.tagText}>{tag}</Text>
                    <Text className={styles.tagRemove} onClick={() => handleRemoveTag(index)}>×</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.btnRow}>
              <View className={styles.cancelBtn} onClick={() => setShowUploadModal(false)}>
                <Text className={styles.cancelBtnText}>取消</Text>
              </View>
              <View className={styles.submitBtn} onClick={handleSaveVideo}>
                <Text className={styles.submitBtnText}>保存</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default VideoPage;
