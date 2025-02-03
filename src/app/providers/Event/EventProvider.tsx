import React, { useCallback, useMemo, useState } from 'react';

import { EventContext } from './EventContext';

import { findOverlappingEvents } from '@/features/event/lib/eventOverlap';
import { createEventFormData } from '@/features/event/lib/eventUtils';
import { useCalendarView } from '@/features/event/model/useCalendarView';
import { useEventForm } from '@/features/event/model/useEventForm';
import { useEventOperations } from '@/features/event/model/useEventOperations';
import { useNotifications } from '@/features/event/model/useNotifications';
import { useSearch } from '@/features/event/model/useSearch';
import { Event } from '@/types';

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const formValues = useEventForm();

  const operationsValues = useEventOperations(Boolean(formValues.editingEvent), () =>
    formValues.setEditingEvent(null)
  );

  const notificationsValues = useNotifications(operationsValues.events);
  const calendarViewValues = useCalendarView();
  const searchValues = useSearch(
    operationsValues.events,
    calendarViewValues.currentDate,
    calendarViewValues.view
  );

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  const eventFormData = useMemo(() => {
    return createEventFormData({
      formState: formValues.formState,
      repeatState: formValues.repeatState,
      startTime: formValues.startTime,
      endTime: formValues.endTime,
      editingEvent: formValues.editingEvent,
    });
  }, [formValues]);

  const handleOverlapDialogOpen = useCallback((events: Event[]) => {
    setIsOverlapDialogOpen(true);
    setOverlappingEvents(events);
  }, []);

  const handleCloseOverlapDialog = useCallback(() => {
    setIsOverlapDialogOpen(false);
  }, []);

  const handleOverlap = useCallback(() => {
    const overlapping = findOverlappingEvents(eventFormData, operationsValues.events);
    if (overlapping.length > 0) {
      handleOverlapDialogOpen(overlapping);
      return;
    }
  }, [eventFormData, operationsValues.events, handleOverlapDialogOpen]);

  const state = useMemo(
    () => ({
      isOverlapDialogOpen,
      handleCloseOverlapDialog,
      overlappingEvents,
      handleOverlap,
    }),
    [isOverlapDialogOpen, overlappingEvents, handleOverlap, handleCloseOverlapDialog]
  );

  const values = useMemo(
    () => ({
      formValues: { ...formValues, eventFormData },
      operationsValues,
      state,
      notificationsValues,
      calendarViewValues,
      searchValues,
    }),
    [
      formValues,
      operationsValues,
      state,
      notificationsValues,
      calendarViewValues,
      searchValues,
      eventFormData,
    ]
  );

  return <EventContext.Provider value={values}>{children}</EventContext.Provider>;
};

export default EventProvider;
