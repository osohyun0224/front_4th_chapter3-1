import { setupDateWithTime, cleanupDateMock } from '../dateTimeMockUtils';

import {
  createNotificationMessage,
  getUpcomingEvents,
} from '@/features/event/lib/notificationUtils';
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
    notificationTime: 30,
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

describe('getUpcomingEvents', () => {
  beforeEach(() => {
    setupDateWithTime('2025-02-04', '17:30:00');
  });

  afterEach(() => {
    cleanupDateMock();
  });

  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    setupDateWithTime('2025-02-04', '17:30:00');
    const upcomingEvents = getUpcomingEvents(events, new Date(), []);
    expect(upcomingEvents).toHaveLength(1);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    setupDateWithTime('2025-02-04', '17:30:00');
    const upcomingEvents = getUpcomingEvents(events, new Date(), ['1']);
    expect(upcomingEvents).toHaveLength(0);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    setupDateWithTime('2025-02-04', '17:00:00');
    const upcomingEvents = getUpcomingEvents(events, new Date(), []);
    expect(upcomingEvents).toHaveLength(0);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    setupDateWithTime('2025-02-04', '18:30:00');
    const upcomingEvents = getUpcomingEvents(events, new Date(), []);
    expect(upcomingEvents).toHaveLength(0);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const message = createNotificationMessage(events[0]);
    expect(message).toBe('30분 후 해리와 과제하기 일정이 시작됩니다.');
  });
});
