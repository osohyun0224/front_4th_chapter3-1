import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton, Select, HStack } from '@chakra-ui/react';

import { useEventContext } from '@/features/event/model/useEventContext';

const CalendarViewSelector = () => {
  const { calendarViewValues } = useEventContext();
  const { view, setView, navigate } = calendarViewValues;

  return (
    <HStack mx="auto" justifyContent="space-between">
      <IconButton
        aria-label="Previous"
        icon={<ChevronLeftIcon />}
        onClick={() => navigate('prev')}
      />
      <Select
        aria-label="view"
        value={view}
        onChange={(e) => setView(e.target.value as 'week' | 'month')}
      >
        <option value="week">Week</option>
        <option value="month">Month</option>
      </Select>
      <IconButton aria-label="Next" icon={<ChevronRightIcon />} onClick={() => navigate('next')} />
    </HStack>
  );
};

export default CalendarViewSelector;
