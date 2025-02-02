import { act, renderHook } from '@testing-library/react';

import { useNotifications } from  '../../hooks/useNotifications.ts';
import { Event } from '../../types.ts';

import { createNotificationMessage } from '../../utils/notificationUtils.ts';
import { setupDateMock, cleanupDateMock } from '../dateTimeMockUtils';


const events: Event[] = [
  {
    id: '1',
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

describe('useNotifications', () => {
  beforeEach(() => {
    setupDateMock('2025-02-24T14:30:00');
  });

  afterEach(() => {
    cleanupDateMock();
  });

  it('초기 상태에서는 알림이 없어야 한다', () => {
    const { result } = renderHook(() => useNotifications(events));
    expect(result.current.notifications).toEqual([]);
  });

  it('지정된 시간이 된 경우 알림이 새롭게 생성되어 추가된다', () => {
    const { result } = renderHook(() => useNotifications(events));
    expect(result.current.notifications).toEqual([]);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.notifications).toEqual([
      { id: '1', message: createNotificationMessage(events[0]) },
    ]);
  });

  it('index를 기준으로 알림을 적절하게 제거할 수 있다', () => {
    const { result } = renderHook(() => useNotifications(events));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.notifications).toEqual([
      { id: '1', message: createNotificationMessage(events[0]) },
    ]);

    act(() => {
      result.current.removeNotification(0);
    });

    expect(result.current.notifications).toEqual([]);
  });

  it('이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다', () => {
    const { result } = renderHook(() => useNotifications(events));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const notification = [{ id: '1', message: createNotificationMessage(events[0]) }];

    expect(result.current.notifications).toEqual(notification);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.notifications).toEqual(notification);
  });
});
