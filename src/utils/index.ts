export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}-${day}`;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}小时${mins > 0 ? `${mins}分钟` : ''}`;
};

export const getTargetTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    toilet: '🚽',
    shake: '🤝',
    recall: '📢',
    stay: '🤫',
    sit: '🪑',
    down: '⬇️',
    heel: '🚶',
    fetch: '🎾'
  };
  return icons[type] || '📝';
};

export const getStageColor = (stage: string): string => {
  const colors: Record<string, string> = {
    beginner: '#00B894',
    intermediate: '#FDCB6E',
    advanced: '#E17055'
  };
  return colors[stage] || '#B2BEC3';
};

export const calculateStreak = (records: { date: string }[]): number => {
  if (records.length === 0) return 0;
  
  const dates = [...new Set(records.map(r => r.date))].sort().reverse();
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < dates.length; i++) {
    const recordDate = new Date(dates[i]);
    recordDate.setHours(0, 0, 0, 0);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    if (recordDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
