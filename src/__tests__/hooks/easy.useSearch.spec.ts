import { act, renderHook } from '@testing-library/react';

import { useSearch } from '@/features/event/model/useSearch.ts';
import { Event } from '@/types';

const events: Event[] = [
  {
    id: '1',
    title: '해리와 과제하기',
    date: '2025-02-04',
    startTime: '18:00',
    endTime: '22:00',
    description: '항해 플러스 7주차 과제하기',
    location: '스파크플러스',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 0,
  },
  {
    id: '2',
    title: '정원이랑 놀기',
    date: '2025-02-24',
    startTime: '15:00',
    endTime: '18:00',
    description: '정원이랑 한 주에 2일은 놀기',
    location: '성수, 뚝섬',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 30,
  },
];

it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, new Date('2025-02-01'), 'month'));

  act(() => {
    result.current.setSearchTerm('');
  });

  expect(result.current.filteredEvents).toEqual(events);
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, new Date('2025-02-01'), 'month'));

  act(() => {
    result.current.setSearchTerm('해리와 과제하기');
  });

  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0].title).toBe('해리와 과제하기');
});

it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, new Date('2025-02-01'), 'month'));

  act(() => {
    result.current.setSearchTerm('해리');
  });
  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0].title).toBe('해리와 과제하기');

  act(() => {
    result.current.setSearchTerm('항해 플러스');
  });
  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0].title).toBe('해리와 과제하기');

  act(() => {
    result.current.setSearchTerm('스파크플러스');
  });
  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0].title).toBe('해리와 과제하기');
});

it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
  const { result: resultMonth } = renderHook(() =>
    useSearch(events, new Date('2025-02-01'), 'month')
  );
  expect(resultMonth.current.filteredEvents).toHaveLength(2);

  const { result: resultWeek } = renderHook(() =>
    useSearch(events, new Date('2025-02-24'), 'week')
  );
  expect(resultWeek.current.filteredEvents).toHaveLength(1);
  expect(resultWeek.current.filteredEvents[0].title).toBe('정원이랑 놀기');
});

it("검색어를 '해리'에서 '정원'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
  const { result } = renderHook(() => useSearch(events, new Date('2025-02-01'), 'month'));

  act(() => {
    result.current.setSearchTerm('해리');
  });
  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0].title).toBe('해리와 과제하기');

  act(() => {
    result.current.setSearchTerm('정원');
  });
  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0].title).toBe('정원이랑 놀기');
});