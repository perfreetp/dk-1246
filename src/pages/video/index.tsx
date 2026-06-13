import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Input, Video } from '@tarojs/components';
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
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<TrainingVideo | null>(null);
  const [newVideo, setNewVideo] = useState({
    title: '',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  const [tempVideoPath, setTempVideoPath] = useState('');
  const [tempVideoDuration, setTempVideoDuration] = useState(30);

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
          if (res.tempFiles && res.tempFiles.length > 0) {
            const tempFile = res.tempFiles[0];
            setTempVideoPath(tempFile.tempFilePath);
            setTempVideoDuration(Math.round(tempFile.duration || 30));
            setShowUploadModal(true);
          }
        },
        fail: () => {
          setTempVideoPath('https://www.w3schools.com/html/mov_bbb.mp4');
          setTempVideoDuration(30);
          setShowUploadModal(true);
        }
      });
    } else {
      setTempVideoPath('https://www.w3schools.com/html/mov_bbb.mp4');
      setTempVideoDuration(30);
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
    if (!tempVideoPath) {
      Taro.showToast({ title: '请先选择视频', icon: 'none' });
      return;
    }
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
      videoUrl: tempVideoPath,
      duration: tempVideoDuration,
      createdAt: new Date().toISOString().split('T')[0],
      tags: newVideo.tags
    };

    addVideo(video);
    setShowUploadModal(false);
    setNewVideo({ title: '', tags: [] });
    setTagInput('');
    setTempVideoPath('');
    Taro.showToast({ title: '视频保存成功', icon: 'success' });
  };

  const handleCancelUpload = () => {
    setShowUploadModal(false);
    setNewVideo({ title: '', tags: [] });
    setTagInput('');
    setTempVideoPath('');
  };

  const handleVideoClick = (video: TrainingVideo) => {
    if (!video.videoUrl) {
      Taro.showToast({ title: '视频地址无效', icon: 'none' });
      return;
    }
    setCurrentVideo(video);
    setShowPlayer(true);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setCurrentVideo(null);
  };

  const handlePlayerError = () => {
    Taro.showToast({ title: '视频播放失败，请稍后重试', icon: 'none' });
    setShowPlayer(false);
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
        <View className={styles.modal} onClick={handleCancelUpload}>
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
              <View className={styles.cancelBtn} onClick={handleCancelUpload}>
                <Text className={styles.cancelBtnText}>取消</Text>
              </View>
              <View className={styles.submitBtn} onClick={handleSaveVideo}>
                <Text className={styles.submitBtnText}>保存</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {showPlayer && currentVideo && (
        <View className={styles.playerOverlay} onClick={handleClosePlayer}>
          <View className={styles.playerContainer} onClick={e => e.stopPropagation()}>
            <View className={styles.playerHeader}>
              <Text className={styles.playerTitle}>{currentVideo.title}</Text>
              <Text className={styles.playerClose} onClick={handleClosePlayer}>×</Text>
            </View>
            <Video
              className={styles.videoPlayer}
              src={currentVideo.videoUrl}
              autoplay
              controls
              showCenterPlayBtn
              enableProgressGesture
              onError={handlePlayerError}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default VideoPage;
