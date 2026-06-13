import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, Pet, TrainingPlan, TrainingRecord, TrainingVideo, Reminder } from '../types';
import { mockPets } from '../data/pets';
import { mockPlans } from '../data/plans';
import { mockRecords } from '../data/records';
import { mockVideos } from '../data/videos';

const initialState: AppState = {
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
  updatePlanProgress: () => {}
};

const AppContext = createContext<AppState>(initialState);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>(initialState.pets);
  const [plans, setPlans] = useState<TrainingPlan[]>(initialState.plans);
  const [records, setRecords] = useState<TrainingRecord[]>(initialState.records);
  const [videos, setVideos] = useState<TrainingVideo[]>(initialState.videos);
  const [reminders, setReminders] = useState<Reminder[]>(initialState.reminders);
  const [currentPetId, setCurrentPetId] = useState<string | null>('1');

  const setCurrentPet = (petId: string) => {
    setCurrentPetId(petId);
  };

  const addPlan = (plan: TrainingPlan) => {
    setPlans(prev => [...prev, plan]);
  };

  const addRecord = (record: TrainingRecord) => {
    setRecords(prev => [...prev, record]);
  };

  const updatePlanProgress = (planId: string, progress: number) => {
    setPlans(prev => prev.map(plan => 
      plan.id === planId ? { ...plan, progress } : plan
    ));
  };

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
        updatePlanProgress
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
