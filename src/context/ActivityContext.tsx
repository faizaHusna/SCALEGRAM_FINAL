// FILE: src/context/ActivityContext.tsx
import { useActivityLogic } from '@/hooks/Activity/useActivityLogic';
import React, { createContext, useContext } from 'react';
import { RefreshControl } from 'react-native';

type ActivityContextType = ReturnType<typeof useActivityLogic>;
const ActivityContext = createContext<ActivityContextType | null>(null);

export const ActivityProvider = ({ children }: { children: React.ReactNode }) => {
  const activity = useActivityLogic();
  return (
    <ActivityContext.Provider value={activity}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useGlobalActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) throw new Error('useGlobalActivity harus di dalam ActivityProvider');
  return context;
};

export const useAutoRefresh = () => {
  const { refreshing, handleRefresh } = useGlobalActivity();
  return {
    refreshControl: (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefresh}
        tintColor="#5C5CFF"
      />
    )
  };
};