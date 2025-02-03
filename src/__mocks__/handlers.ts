import { http, HttpResponse } from 'msw';

import { mockCreateEvent, mockDeleteEvent, mockUpdateEvent } from './handlersUtils';
import { Event, EventForm } from '../types';
import { events } from './response/events.json' assert { type: 'json' };

// ! HARD
// ! 각 응답에 대한 MSW 핸들러를 작성해주세요. GET 요청은 이미 작성되어 있는 events json을 활용해주세요.

const getAllEvents = () => {
  return HttpResponse.json({ events });
};

const createEvent = async ({ request }: { request: Request }) => {
  const newEventData = (await request.json()) as EventForm;
  const { createdEvent } = mockCreateEvent(events as Event[], newEventData);

  return HttpResponse.json({ success: true, event: createdEvent }, { status: 201 });
};

const updateEvent = async ({ request }: { request: Request }) => {
  const eventToUpdate = (await request.json()) as Event;
  const { status, updatedEvent, message } = mockUpdateEvent(events as Event[], eventToUpdate);

  if (status === 404) {
    return HttpResponse.json({ success: false, message }, { status });
  }

  return HttpResponse.json({ success: true, event: updatedEvent }, { status });
};

const deleteEvent = ({ params }: { params: { id: string } }) => {
  const eventId = params.id;
  mockDeleteEvent(events as Event[], eventId);

  return HttpResponse.json({ success: true }, { status: 204 });
};

export const handlers = [
  http.get('/api/events', getAllEvents),
  http.post('/api/events', createEvent),
  http.put('/api/events/:id', updateEvent),
  http.delete('/api/events/:id', deleteEvent),
];
