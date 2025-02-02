import { Event } from '../../types';

import { getFilteredEvents } from '../../utils/eventUtils';

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

describe('getFilteredEvents', () => {
  it("검색어 '해리'에 맞는 이벤트만 반환한다", () => {
    const filteredEvents = getFilteredEvents(events, '해리', new Date('2025-02-04'), 'week');
    expect(filteredEvents).toHaveLength(1);
    expect(filteredEvents[0].title).toBe('해리와 과제하기');
  });

  it('주간 뷰에서 2025-02-04 주의 이벤트만 반환한다', () => {
    const filteredEvents = getFilteredEvents(events, '', new Date('2025-02-04'), 'week');
    expect(filteredEvents).toHaveLength(1);
  });

  it('월간 뷰에서 2025년 2월의 모든 이벤트를 반환한다', () => {
    const filteredEvents = getFilteredEvents(events, '', new Date('2025-02-01'), 'month');
    expect(filteredEvents).toHaveLength(2);
  });

  it("검색어 '과제'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const filteredEvents = getFilteredEvents(events, '과제', new Date('2025-02-04'), 'week');
    expect(filteredEvents).toHaveLength(1);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const filteredEvents = getFilteredEvents(events, '', new Date('2025-02-24'), 'week');
    expect(filteredEvents).toHaveLength(1);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const filteredEvents = getFilteredEvents(events, 'HARRY', new Date('2025-02-04'), 'week');
    expect(filteredEvents).toHaveLength(0);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const filteredEvents = getFilteredEvents(events, '', new Date('2025-02-01'), 'month');
    expect(filteredEvents).toHaveLength(2);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const filteredEvents = getFilteredEvents([], '', new Date('2025-02-01'), 'month');
    expect(filteredEvents).toHaveLength(0);
  });
});