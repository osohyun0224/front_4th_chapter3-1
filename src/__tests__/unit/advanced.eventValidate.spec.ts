import {
  validateEvent,
  validateRequiredEventData,
  validateTime,
} from '@/features/event/lib/eventValidate';
import { EventForm } from '@/types';

describe('Event Validation 검증 테스트', () => {
  const validEvent: EventForm = {
    title: '회의',
    date: '2024-10-15',
    startTime: '09:00',
    endTime: '10:00',
    repeat: { type: 'none', interval: 0 },
    description: '팀 미팅',
    location: '회의실 A',
    category: '업무',
    notificationTime: 10,
  };

  describe('validateRequiredEventData', () => {
    it('모든 필수 필드가 있으면 true를 반환한다', () => {
      expect(validateRequiredEventData(validEvent)).toBe(true);
    });
  });

  describe('validateTime', () => {
    it('시작 시간이 종료 시간보다 이르면 true를 반환한다', () => {
      expect(validateTime('09:00', '10:00', null, null)).toBe(true);
    });

    it('시작 시간이 종료 시간과 같으면 false를 반환한다', () => {
      expect(validateTime('09:00', '09:00', null, null)).toBe(false);
    });

    it('시작 시간이 종료 시간보다 늦으면 false를 반환한다', () => {
      expect(validateTime('10:00', '09:00', null, null)).toBe(false);
    });
  });

  describe('validateEvent', () => {
    const validInput = {
      event: validEvent,
      error: { startTimeError: null, endTimeError: null },
    };

    it('모든 검증을 통과하면 모두 true를 반환한다', () => {
      const result = validateEvent(validInput);
      expect(result).toEqual({ required: true, time: true });
    });

    it('필수 필드가 누락되면 required가 false를 반환한다', () => {
      const result = validateEvent({
        event: { ...validEvent, title: '' },
        error: { startTimeError: null, endTimeError: null },
      });
      expect(result).toEqual({ required: false, time: true });
    });

    it('시간이 유효하지 않으면 time이 false를 반환한다', () => {
      const result = validateEvent({
        event: { ...validEvent, startTime: '10:00', endTime: '09:00' },
        error: { startTimeError: null, endTimeError: null },
      });
      expect(result).toEqual({ required: true, time: false });
    });

    it('시간 에러가 있으면 time이 false를 반환한다', () => {
      const result = validateEvent({
        event: validEvent,
        error: { startTimeError: '시간 오류', endTimeError: null },
      });
      expect(result).toEqual({ required: true, time: false });
    });

    it('모든 검증이 실패하면 모두 false를 반환한다', () => {
      const result = validateEvent({
        event: { ...validEvent, title: '', startTime: '10:00', endTime: '09:00' },
        error: { startTimeError: '시간 오류', endTimeError: null },
      });
      expect(result).toEqual({ required: false, time: false });
    });
  });
});
