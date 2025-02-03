import { useInterval } from '@chakra-ui/react';
import { useState } from 'react';

import { Event } from '../../../types';
import { createNotificationMessage, getUpcomingEvents } from '@/features/event/lib/notificationUtils';
import { removeItemAtIndex, extractIdsFromObjects, insertItems } from '@/shared/lib/arrayUtils';

const createNotifications = (events: Event[]) =>
  events.map((event) => ({
    id: event.id,
    message: createNotificationMessage(event),
  }));

export const useNotifications = (events: Event[]) => {
  const [notifications, setNotifications] = useState<{ id: string; message: string }[]>([]);
  const [notifiedEvents, setNotifiedEvents] = useState<string[]>([]);

  const settingNotifications = (upcomingEvents: Event[]) => {
    const upcomingNotifications = createNotifications(upcomingEvents);
    setNotifications((prev) => insertItems(prev, upcomingNotifications));
  };

  const settingNotifiedEvents = (upcomingEvents: Event[]) => {
    const upcomingEventsIds = extractIdsFromObjects(upcomingEvents);
    setNotifiedEvents((prev) => insertItems(prev, upcomingEventsIds));
  };

  const checkUpcomingEvents = () => {
    const now = new Date();
    const upcomingEvents = getUpcomingEvents(events, now, notifiedEvents);
    settingNotifications(upcomingEvents);
    settingNotifiedEvents(upcomingEvents);
  };

  const removeNotification = (index: number) => {
    setNotifications((prev) => removeItemAtIndex(prev, index));
  };

  useInterval(checkUpcomingEvents, 1000); // 1초마다 체크

  return { notifications, notifiedEvents, removeNotification };
};
