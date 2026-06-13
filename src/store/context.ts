import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
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

const initialState = {
  pets: mockPets,
  plans: mockPlans,
  records: mockRecords,
  videos: mockVideos,
  reminders: [
    { id: '1', petId: '1', time: '09:00', enabled: true, days: [1, 2, 3, 4, 5, 6, 7] },
    { id: '2', petId: '2', time: '20:00', enabled: true, days: [1, 3, 5, 7] }
  ] as Reminder[],
  currentPetId: '1',
  setCurrentPet: () => {},
  addPlan: () => {},
  addRecord: () => {},
  updatePlanProgress: () => {}
};

const AppContext = createContext<AppContextState>({
  ...initialState,
  addVideo: () => {},
  addReminder: () => {},
  updateReminder: () => {},
  deleteReminder: () => {},
  completePlan: () => {}
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>(initialState.pets);
  const [plans, setPlans] = useState<TrainingPlan[]>(initialState.plans);
  const [records, setRecords] = useState<TrainingRecord[]>(initialState.records);
  const [videos, setVideos] = useState<TrainingVideo[]>(initialState.videos);
  const [reminders, setReminders] = useState<Reminder[]>(initialState.reminders);
  const [currentPetId, setCurrentPetId] = useState<string | null>('1');

  const setCurrentPet = useCallback((petId: string) => {
    setCurrentPetId(petId);
  }, []);

  const addPlan = useCallback((plan: TrainingPlan) => {
    setPlans(prev => [...prev, plan]);
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
    setVideos(prev => [video, ...prev]);
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
