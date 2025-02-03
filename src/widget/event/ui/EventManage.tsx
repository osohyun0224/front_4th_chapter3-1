import { Flex } from '@chakra-ui/react';

import { EventForm, CalendarMain } from '@/features/event/ui';
import { EventSearchPanel } from '@/features/event/ui/search/EventSearchPanel';

export const EventManage = () => {
  return (
    <Flex gap={6} h="full">
      <EventForm />
      <CalendarMain />
      <EventSearchPanel />
    </Flex>
  );
};
