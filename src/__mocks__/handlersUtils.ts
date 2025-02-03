import { http, HttpResponse } from 'msw';

import { server } from '../setupTests';
import { Event, EventForm } from '../types';

// ! Hard
// ! 이벤트는 생성, 수정 되면 fetch를 다시 해 상태를 업데이트 합니다. 이를 위한 제어가 필요할 것 같은데요. 어떻게 작성해야 테스트가 병렬로 돌아도 안정적이게 동작할까요?
// ! 아래 이름을 사용하지 않아도 되니, 독립적이게 테스트를 구동할 수 있는 방법을 찾아보세요. 그리고 이 로직을 PR에 설명해주세요.
export const mockCreateEvent = (
  events: Event[] = [],
  eventData: EventForm
): { list: Event[]; createdEvent: Event } => {
  const lastEventId = events.length > 0 ? +events[events.length - 1].id : 0;
  const newEventId = lastEventId + 1;

  const createdEvent = { ...eventData, id: `${newEventId}` };

  events.push(createdEvent);

  return { list: events, createdEvent };
};

export const mockUpdateEvent = (
  events: Event[] = [],
  eventData: Event
): { status: number; updatedEvent?: Event; list: Event[]; message?: string } => {
  const eventIndex = events.findIndex((event) => event.id === eventData.id);

  if (eventIndex === -1) {
    return { status: 404, message: '해당 이벤트를 찾을 수 없습니다.', list: events };
  }

  const updatedEvent = { ...events[eventIndex], ...eventData };
  events[eventIndex] = updatedEvent;

  return { status: 200, updatedEvent, list: events };
};

export const mockDeleteEvent = (
  events: Event[] = [],
  eventId: string
): { status: number; message?: string; list: Event[] } => {
  const index = events.findIndex((event) => event.id === eventId);

  if (index === -1) {
    return { status: 404, message: '해당 이벤트를 찾을 수 없습니다.', list: events };
  }

  events.splice(index, 1);

  return { status: 204, list: events };
};

export const setupEventCreateHandler = (events = [] as Event[]) => {
  const mockEvents = [...events];

  server.use(
    http.get('/api/events', async () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.post('/api/events', async ({ request }) => {
      const eventData = (await request.json()) as EventForm;
      const { createdEvent } = mockCreateEvent(mockEvents, eventData);
      return HttpResponse.json(createdEvent, { status: 201 });
    })
  );
};

export const setupEventUpdateHandler = (events = [] as Event[]) => {
  const mockEvents = [...events];

  server.use(
    http.get('/api/events', async () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.put('/api/events/:id', async ({ request }) => {
      const eventData = (await request.json()) as Event;
      const { updatedEvent, status, message } = mockUpdateEvent(mockEvents, eventData);

      if (status === 404) {
        return HttpResponse.json({ message }, { status });
      }

      return HttpResponse.json(updatedEvent, { status });
    })
  );
};

export const setupEventDeleteHandler = (initialEvents: Event[] = []): void => {
  const mockEvents = [...initialEvents];

  server.use(
    http.get('/api/events', async () => HttpResponse.json({ events: mockEvents })),
    http.delete('/api/events/:id', ({ params }) => {
      const eventId = params.id as string;

      const result = mockDeleteEvent(mockEvents, eventId);

      return result.status === 404
        ? HttpResponse.json({ message: result.message }, { status: 404 })
        : new Response(null, { status: 204 });
    })
  );
};
