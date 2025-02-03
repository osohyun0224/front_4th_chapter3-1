import { Heading, VStack } from '@chakra-ui/react';

import { useEventContext } from '@/features/event/model/useEventContext';
import { CalendarMonthView, CalendarWeekView } from '@/features/event/ui/calendar';
import CalendarViewSelector from '@/features/event/ui/calendar/CalendarViewSelector';

export const CalendarMain = () => {
  const { notificationsValues, calendarViewValues, searchValues } = useEventContext();

  const { view, currentDate, holidays } = calendarViewValues;
  const { filteredEvents } = searchValues;
  const { notifiedEvents } = notificationsValues;

  return (
    <VStack flex={1} spacing={5} align="stretch">
      <Heading>일정 보기</Heading>
      <CalendarViewSelector />
      {view === 'week' && (
        <CalendarWeekView
          currentDate={currentDate}
          events={filteredEvents}
          notifiedEvents={notifiedEvents}
          holidays={holidays}
        />
      )}
      {view === 'month' && (
        <CalendarMonthView
          currentDate={currentDate}
          events={filteredEvents}
          notifiedEvents={notifiedEvents}
          holidays={holidays}
        />
      )}
    </VStack>
  );
};
