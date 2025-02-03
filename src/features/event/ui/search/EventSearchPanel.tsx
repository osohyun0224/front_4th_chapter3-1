import { FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';

import { useEventContext } from '@/features/event/model/useEventContext';
import EventSearchResults from '@/features/event/ui/search/EventSearchResults';

export const EventSearchPanel = () => {
  const { searchValues, notificationsValues } = useEventContext();

  const { searchTerm, filteredEvents, setSearchTerm } = searchValues;
  const { notifiedEvents } = notificationsValues;

  return (
    <VStack data-testid="event-list" w="500px" h="full" overflowY="auto">
      <FormControl>
        <FormLabel>일정 검색</FormLabel>
        <Input
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FormControl>

      <EventSearchResults filteredEvents={filteredEvents} notifiedEvents={notifiedEvents} />
    </VStack>
  );
};
