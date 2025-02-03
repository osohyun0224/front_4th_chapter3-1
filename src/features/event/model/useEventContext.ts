import { useContext } from 'react';
import { EventContext } from '@/app/providers/Event/EventContext';

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext는 EventProvider 내부에서만 사용할 수 있습니다');
  }
  return context;
};