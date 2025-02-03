import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import { CalendarMonthView } from '@/features/event/ui/calendar';
import { Event } from '@/types';

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('CalendarMonthView 컴포넌트 테스트', () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '팀 미팅',
      date: '2024-11-15',
      startTime: '10:00',
      endTime: '11:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      notificationTime: 10,
      repeat: {
        type: 'none',
        interval: 0,
      },
    },
  ];

  const mockHolidays = {
    '2024-11-01': '개천절',
  };

  const mockProps = {
    currentDate: new Date('2024-11-15'),
    holidays: mockHolidays,
    notifiedEvents: ['1'],
    events: mockEvents,
  };

  it('월간 달력이 올바르게 렌더링되어야 한다', () => {
    renderWithChakra(<CalendarMonthView {...mockProps} />);

    expect(screen.getByText('2024년 11월')).toBeInTheDocument();

    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    weekDays.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('공휴일이 올바르게 표시되어야 한다', () => {
    renderWithChakra(<CalendarMonthView {...mockProps} />);

    const holiday = screen.getByText('개천절');
    expect(holiday).toBeInTheDocument();
    expect(holiday).toHaveStyle('color: var(--chakra-colors-red-500)');
  });

  it('이벤트가 올바른 날짜에 표시되어야 한다', () => {
    renderWithChakra(<CalendarMonthView {...mockProps} />);

    const eventTitle = screen.getByText('팀 미팅');
    expect(eventTitle).toBeInTheDocument();
  });

  it('빈 날짜 셀은 내용이 없어야 한다', () => {
    renderWithChakra(<CalendarMonthView {...mockProps} />);

    const emptyCells = screen.getAllByRole('cell').filter((cell) => !cell.textContent);
    expect(emptyCells.length).toBeGreaterThan(0);
  });

  it('현재 월의 모든 날짜가 표시되어야 한다', () => {
    renderWithChakra(<CalendarMonthView {...mockProps} />);

    for (let i = 1; i <= 30; i++) {
      const dateText = screen.getByText(i.toString());
      expect(dateText).toBeInTheDocument();
    }
  });

  it('이벤트가 없는 날짜에는 이벤트 박스가 표시되지 않아야 한다', () => {
    renderWithChakra(<CalendarMonthView {...mockProps} />);

    const nonEventDate = '16';
    const nonEventCell = screen
      .getAllByRole('cell')
      .find((cell) => cell.textContent?.includes(nonEventDate));

    const eventBoxes = nonEventCell?.querySelectorAll('[data-testid="calendar-event"]');
    expect(eventBoxes?.length || 0).toBe(0);
  });
});