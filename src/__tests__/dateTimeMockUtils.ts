import { vi } from 'vitest';

export const setupDateMock = (dateString: string) => {
  vi.useFakeTimers();
  const date = new Date(dateString);
  vi.setSystemTime(date);
};

export const cleanupDateMock = () => {
  vi.useRealTimers();
};