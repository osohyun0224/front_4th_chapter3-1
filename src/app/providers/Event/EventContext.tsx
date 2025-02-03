import { createContext } from 'react';

import { useCalendarView } from '@/features/event/model/useCalendarView';
import { useEventForm } from '@/features/event/model/useEventForm';
import { useEventOperations } from '@/features/event/model/useEventOperations';
import { useNotifications } from '@/features/event/model/useNotifications';
import { useSearch } from '@/features/event/model/useSearch';
import { Event, EventForm } from '@/types';

export type EventContextType = {
  formValues: ReturnType<typeof useEventForm> & {
    eventFormData: Event | EventForm;
  };
  operationsValues: ReturnType<typeof useEventOperations>;
  notificationsValues: ReturnType<typeof useNotifications>;
  calendarViewValues: ReturnType<typeof useCalendarView>;
  searchValues: ReturnType<typeof useSearch>;
  state: {
    isOverlapDialogOpen: boolean;
    handleCloseOverlapDialog: () => void;
    overlappingEvents: Event[];
    handleOverlap: () => void;
  };
};

export const EventContext = createContext<EventContextType | undefined>(undefined);
