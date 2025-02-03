import { Heading, Text, VStack } from '@chakra-ui/react';

import { CalendarDay } from './CalendarDay';

import {
  formatDate,
  formatMonth,
  getEventsForDay,
  getWeeksAtMonth,
} from '@/shared/lib/date/dateUtils';
import { weekDays } from '@/shared/config/date';
import { Table } from '@/shared/ui';
import { Event } from '@/types';

type CalendarMonthViewProps = {
  currentDate: Date;

  events: Event[];
  notifiedEvents: string[];
  holidays: Record<string, string>;
};

export const CalendarMonthView = ({
  currentDate,

  events,
  notifiedEvents,
  holidays,
}: CalendarMonthViewProps) => {
  const weeks = getWeeksAtMonth(currentDate);

  return (
    <VStack data-testid="month-view" align="stretch" w="full" spacing={4}>
      <Heading size="md">{formatMonth(currentDate)}</Heading>
      <Table.Container variant="simple" w="full">
        <Table.Header>
          <Table.Row>
            {weekDays.map((day) => (
              <Table.Th key={day} width="14.28%">
                {day}
              </Table.Th>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {weeks.map((week, weekIndex) => (
            <Table.Row key={weekIndex}>
              {week.map((day, dayIndex) => {
                const dateString = day ? formatDate(currentDate, day) : '';
                const holiday = holidays[dateString];

                return (
                  <Table.Cell
                    key={dayIndex}
                    height="100px"
                    verticalAlign="top"
                    width="14.28%"
                    position="relative"
                  >
                    {day && (
                      <>
                        <Text fontWeight="bold">{day}</Text>
                        {holiday && (
                          <Text color="red.500" fontSize="sm">
                            {holiday}
                          </Text>
                        )}
                        {getEventsForDay(events, day).map((event) => {
                          const isNotified = notifiedEvents.includes(event.id);
                          return (
                            <CalendarDay key={event.id} event={event} isNotified={isNotified} />
                          );
                        })}
                      </>
                    )}
                  </Table.Cell>
                );
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Container>
    </VStack>
  );
};
