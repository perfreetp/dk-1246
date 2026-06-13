import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import { AppState, Pet, TrainingPlan, TrainingRecord, TrainingVideo, Reminder } from '../types';
import { mockPets } from '../data/pets';
import { mockPlans } from '../data/plans';
import { mockRecords } from '../data/records';
import { mockVideos } from '../data/videos';

interface AppContextState extends AppState {
  addVideo: (video: TrainingVideo) => void;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (reminderId: string, updates: Partial<Reminder>) => void;
  deleteReminder: (reminderId: string) => void;
  completePlan: (planId: string) => void;
}

const STORAGE_KEYS = {
  plans: 'pet_training_plans',
  records: 'pet_training_records',
  videos: 'pet_training_videos',
  reminders: 'pet_training_reminders',
  currentPetId: 'pet_training_current_pet'
};

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const data = Taro.getStorageSync(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key: string, data: any) => {
  try {
    Taro.setStorageSync(key, JSON.stringify(data));
  } catch (e) {
    console.error('[Storage] Failed to save:', key, e);
  }
};

const AppContext = createContext<AppContextState>({
  pets: mockPets,
  plans: mockPlans,
  records: mockRecords,
  videos: mockVideos,
  reminders: [
    { id: '1', petId: '1', time: '09:00', enabled: true, days: [1, 2, 3, 4, 5, 6, 7] },
    { id: '2', petId: '2', time: '20:00', enabled: true, days: [1, 3, 5, 7] }
  ],
  currentPetId: '1',
  setCurrentPet: () => {},
  addPlan: () => {},
  addRecord: () => {},
  updatePlanProgress: () => {},
  addVideo: () => {},
  addReminder: () => {},
  updateReminder: () => {},
  deleteReminder: () => {},
  completePlan: () => {}
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pets] = useState<Pet[]>(mockPets);
  const [plans, setPlans] = useState<TrainingPlan[]>(() => loadFromStorage(STORAGE_KEYS.plans, mockPlans));
  const [records, setRecords] = useState<TrainingRecord[]>(() => loadFromStorage(STORAGE_KEYS.records, mockRecords));
  const [videos, setVideos] = useState<TrainingVideo[]>(() => loadFromStorage(STORAGE_KEYS.videos, mockVideos));
  const [reminders, setReminders] = useState<Reminder[]>(() => loadFromStorage(STORAGE_KEYS.reminders, [
    { id: '1', petId: '1', time: '09:00', enabled: true, days: [1, 2, 3, 4, 5, 6, 7] },
    { id: '2', petId: '2', time: '20:00', enabled: true, days: [1, 3, 5, 7] }
  ]));
  const [currentPetId, setCurrentPetId] = useState<string | null>(() => loadFromStorage(STORAGE_KEYS.currentPetId, '1'));

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.plans, plans);
  }, [plans]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.records, records);
  }, [records]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.videos, videos);
  }, [videos]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.reminders, reminders);
  }, [reminders]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.currentPetId, currentPetId);
  }, [currentPetId]);

  const setCurrentPet = useCallback((petId: string) => {
    setCurrentPetId(petId);
  }, []);

  const addPlan = useCallback((plan: TrainingPlan) => {
    setPlans(prev => {
      const newPlans = [...prev, plan];
      return newPlans;
    });
  }, []);

  const addRecord = useCallback((record: TrainingRecord) => {
    setRecords(prev => {
      const newRecords = [record, ...prev];
      return newRecords;
    });
  }, []);

  const updatePlanProgress = useCallback((planId: string, progress: number) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id === planId) {
        const updatedPlan = { ...plan, progress };
        if (progress >= plan.totalDays && plan.status === 'active') {
          updatedPlan.status = 'completed';
        }
        return updatedPlan;
      }
      return plan;
    }));
  }, []);

  const addVideo = useCallback((video: TrainingVideo) => {
    setVideos(prev => {
      const newVideos = [video, ...prev];
      return newVideos;
    });
  }, []);

  const addReminder = useCallback((reminder: Reminder) => {
    setReminders(prev => [...prev, reminder]);
  }, []);

  const updateReminder = useCallback((reminderId: string, updates: Partial<Reminder>) => {
    setReminders(prev => prev.map(r => 
      r.id === reminderId ? { ...r, ...updates } : r
    ));
  }, []);

  const deleteReminder = useCallback((reminderId: string) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
  }, []);

  const completePlan = useCallback((planId: string) => {
    setPlans(prev => prev.map(plan => 
      plan.id === planId ? { ...plan, status: 'completed' as const } : plan
    ));
  }, []);

  return (
    <AppContext.Provider
      value={{
        pets,
        plans,
        records,
        videos,
        reminders,
        currentPetId,
        setCurrentPet,
        addPlan,
        addRecord,
        updatePlanProgress,
        addVideo,
        addReminder,
        updateReminder,
        deleteReminder,
        completePlan
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
