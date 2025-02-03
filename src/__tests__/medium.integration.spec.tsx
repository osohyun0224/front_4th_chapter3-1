import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import App from '../App';
import { setupDateWithTime, cleanupDateMock } from './dateTimeMockUtils';

import {
  setupEventCreateHandler,
  setupEventDeleteHandler,
  setupEventUpdateHandler,
} from '@/__mocks__/handlersUtils';
import { Event, EventForm } from '@/types';

const initialEvents = [
  {
    id: '1',
    title: '기존 회의',
    date: '2024-10-15',
    startTime: '09:00',
    endTime: '10:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
] as Event[];

const renderApp = () => {
  return render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
};

describe('일정 CRUD 및 기본 기능', () => {
  const newEvent = {
    title: '해리와 과제하기',
    date: '2024-10-15',
    startTime: '10:00',
    endTime: '11:00',
    description: '항해 플러스 7주차 과제하기',
    location: '스파크플러스',
    category: '개인',
    notificationTime: 10,
    repeat: {
      type: 'daily',
      interval: 1,
    },
    repeatEndDate: '2024-12-31',
  } as EventForm;

  beforeEach(() => {
    setupDateWithTime('2024-10-01', '00:00:00');
    renderApp();
  });

  afterEach(() => {
    cleanupDateMock();
  });
  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.
    const _initialEvents = [...initialEvents];
    setupEventCreateHandler(_initialEvents);

    // 초기 상태에서 이벤트가 없음을 확인하기!
    await waitFor(() => {
      expect(screen.getByText(/검색 결과가 없습니다/i)).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText('제목');
    const dateInput = screen.getByLabelText('날짜');
    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    const descriptionInput = screen.getByLabelText('설명');
    const locationInput = screen.getByLabelText('위치');
    const categoryInput = screen.getByLabelText('카테고리');
    const repeatCheckbox = screen.getByLabelText('반복 일정');
    const notificationTimeSelect = screen.getByLabelText('알림 설정');
    const repeatEventTypeSelect = screen.queryByLabelText('반복 유형');
    const repeatEventInterval = screen.queryByLabelText('반복 간격');
    const addEventButton = screen.getByTestId('event-submit-button');

    await userEvent.type(titleInput, newEvent.title);
    await userEvent.type(dateInput, newEvent.date);
    await userEvent.type(startTimeInput, newEvent.startTime);
    await userEvent.type(endTimeInput, newEvent.endTime);
    await userEvent.type(descriptionInput, newEvent.description);
    await userEvent.type(locationInput, newEvent.location);
    await userEvent.selectOptions(categoryInput, newEvent.category);
    await userEvent.selectOptions(notificationTimeSelect, newEvent.notificationTime.toString());
    await userEvent.click(repeatCheckbox);

    if (repeatEventTypeSelect) {
      await userEvent.selectOptions(repeatEventTypeSelect, newEvent.repeat.type);
    }
    if (repeatEventInterval) {
      await userEvent.type(repeatEventInterval, newEvent.repeat.interval.toString());
    }

    await userEvent.click(addEventButton);
    const eventList = screen.getByTestId('event-list');

    expect(within(eventList).getByText(newEvent.title)).toBeInTheDocument();
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {
    const firstEvent = initialEvents[0] as Event;

    const updatesEvent = {
      ...firstEvent,
      title: '정원이랑 놀기',
      date: '2024-10-16',
      startTime: '19:00',
      endTime: '20:00',
      description: '정원이랑 한 주에 2일은 놀기',
      location: '성수, 뚝섬',
      category: '개인',
      notificationTime: 120,
      repeat: {
        type: 'monthly',
        interval: 2,
      },
    };

    setupEventUpdateHandler(initialEvents);

    const eventList = screen.getByTestId('event-list');

    // 이벤트 목록이 로드될 때까지 대기하기!
    await waitFor(() => {
      expect(screen.getByText(firstEvent.location)).toBeInTheDocument();
    });

    const editButton = within(eventList).getAllByLabelText(/edit event/i);
    await userEvent.click(editButton[0]);

    const titleInput = screen.getByLabelText('제목');
    const dateInput = screen.getByLabelText('날짜');
    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    const descriptionInput = screen.getByLabelText('설명');
    const locationInput = screen.getByLabelText('위치');
    const categoryInput = screen.getByLabelText('카테고리');
    const notificationTimeSelect = screen.getByLabelText('알림 설정');
    const repeatEventTypeSelect = screen.queryByLabelText('반복 유형');
    const repeatEventInterval = screen.queryByLabelText('반복 간격');

    const addEventButton = screen.getByTestId('event-submit-button');

    expect(titleInput).toHaveValue(firstEvent.title);
    expect(dateInput).toHaveValue(firstEvent.date);
    expect(startTimeInput).toHaveValue(firstEvent.startTime);
    expect(endTimeInput).toHaveValue(firstEvent.endTime);
    expect(descriptionInput).toHaveValue(firstEvent.description);
    expect(locationInput).toHaveValue(firstEvent.location);
    expect(categoryInput).toHaveValue(firstEvent.category);
    expect(notificationTimeSelect).toHaveValue(firstEvent.notificationTime.toString());

    if (repeatEventTypeSelect) {
      expect(repeatEventTypeSelect).toHaveValue(firstEvent.repeat.type);
    }
    if (repeatEventInterval) {
      expect(repeatEventInterval).toHaveValue(firstEvent.repeat.interval.toString());
    }

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, updatesEvent.title);

    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, updatesEvent.date);

    await userEvent.clear(startTimeInput);
    await userEvent.type(startTimeInput, updatesEvent.startTime);

    await userEvent.clear(endTimeInput);
    await userEvent.type(endTimeInput, updatesEvent.endTime);

    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, updatesEvent.description);

    await userEvent.clear(locationInput);
    await userEvent.type(locationInput, updatesEvent.location);

    await userEvent.selectOptions(categoryInput, updatesEvent.category);

    await userEvent.selectOptions(notificationTimeSelect, updatesEvent.notificationTime.toString());

    if (repeatEventTypeSelect) {
      await userEvent.selectOptions(repeatEventTypeSelect, updatesEvent.repeat.type);
    }
    if (repeatEventInterval) {
      await userEvent.type(repeatEventInterval, updatesEvent.repeat.interval.toString());
    }

    await userEvent.click(addEventButton);

    expect(within(eventList).getByText(updatesEvent.title)).toBeInTheDocument();
    expect(within(eventList).getByText(updatesEvent.date)).toBeInTheDocument();
    expect(
      within(eventList).getByText(updatesEvent.startTime, { exact: false })
    ).toBeInTheDocument();
    expect(within(eventList).getByText(updatesEvent.endTime, { exact: false })).toBeInTheDocument();
    expect(within(eventList).getByText(updatesEvent.description)).toBeInTheDocument();
    expect(within(eventList).getByText(updatesEvent.location)).toBeInTheDocument();
    expect(
      within(eventList).getByText(updatesEvent.category, { exact: false })
    ).toBeInTheDocument();
    expect(within(eventList).getByText(/2시간 전/i)).toBeInTheDocument();

    if (repeatEventTypeSelect) {
      expect(repeatEventTypeSelect).toHaveValue(updatesEvent.repeat.type);
    }
    if (repeatEventInterval) {
      expect(repeatEventInterval).toHaveValue(updatesEvent.repeat.interval.toString());
    }
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
    const firstEvent = initialEvents[0] as Event;

    setupEventDeleteHandler(initialEvents);

    const eventList = screen.getByTestId('event-list');
    const searchInput = within(eventList).getByPlaceholderText('검색어를 입력하세요');

    await userEvent.type(searchInput, firstEvent.title);

    const deleteButton = within(eventList).getByLabelText(/delete event/i);
    await userEvent.click(deleteButton);

    expect(within(eventList).queryByText(firstEvent.title)).not.toBeInTheDocument();
  });
});

describe('일정 뷰', () => {
  afterEach(() => {
    cleanupDateMock();
  });

  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {
    setupDateWithTime('2024-10-01', '00:00:00');
    renderApp();

    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'week');

    const weekView = screen.getByTestId('week-view');

    expect(within(weekView).queryByText('기존 회의')).not.toBeInTheDocument();
  });

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {
    setupDateWithTime('2024-10-15', '00:00:00');
    renderApp();

    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'week');

    const weekView = screen.getByTestId('week-view');
    expect(within(weekView).getByText('기존 회의')).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
    setupDateWithTime('2024-11-30', '00:00:00');
    renderApp();

    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'month');

    const monthView = screen.getByTestId('month-view');

    expect(within(monthView).queryByText('기존 회의')).not.toBeInTheDocument();
  });

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
    setupDateWithTime('2024-10-01', '00:00:00');
    renderApp();

    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'month');
    const monthView = screen.getByTestId('month-view');
    expect(within(monthView).getByText('기존 회의')).toBeInTheDocument();
  });

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
    setupDateWithTime('2024-01-01', '00:00:00');
    renderApp();

    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'month');

    const monthView = screen.getByTestId('month-view');
    expect(within(monthView).getByText('신정')).toBeInTheDocument();
  });

  it('주간 뷰에 12월 25일(크리스마스)이 공휴일로 표시되는지 확인한다', async () => {
    setupDateWithTime('2024-12-25', '00:00:00');
    renderApp();

    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'week');

    const weekView = screen.getByTestId('week-view');
    expect(within(weekView).getByText('크리스마스')).toBeInTheDocument();
  });
});

describe('검색 기능', () => {
  beforeEach(() => {
    setupDateWithTime('2024-10-01', '00:00:00');
  });

  afterEach(() => {
    cleanupDateMock();
  });

  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
    renderApp();

    const eventList = screen.getByTestId('event-list');
    const searchInput = within(eventList).getByPlaceholderText('검색어를 입력하세요');

    await userEvent.type(searchInput, '없는 검색어');

    expect(within(eventList).getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {
    const initialData = {
      id: '2',
      title: '팀 회의',
      date: '2024-10-15',
      startTime: '14:00',
      endTime: '15:00',
      description: '팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    } as Event;

    setupEventCreateHandler([initialData]);

    renderApp();

    const eventList = screen.getByTestId('event-list');
    const searchInput = within(eventList).getByPlaceholderText('검색어를 입력하세요');

    await userEvent.type(searchInput, '팀 회의');

    await waitFor(() => {
      expect(within(eventList).getByText(/팀 회의/i)).toBeInTheDocument();
    });
  });

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
    renderApp();

    const eventList = screen.getByTestId('event-list');
    const searchInput = within(eventList).getByPlaceholderText('검색어를 입력하세요');

    await waitFor(() => {
      expect(within(eventList).getByText(/기존 회의/i)).toBeInTheDocument();
    });

    await userEvent.clear(searchInput);

    await waitFor(() => {
      expect(within(eventList).getByText(/기존 회의/i)).toBeInTheDocument();
    });
  });
});

describe('일정 충돌', () => {
  beforeEach(() => {
    setupDateWithTime('2024-10-01', '00:00:00');
    renderApp();
  });

  afterEach(() => {
    cleanupDateMock();
  });

  const newEvent = {
    title: '해리와 과제하기',
    date: '2024-10-15',
    startTime: '09:00',
    endTime: '11:00',
    description: '항해 플러스 7주차 과제하기',
    location: '스파크플러스',
    category: '개인',
    notificationTime: '10',
    repeatType: 'daily',
    repeatInterval: '1',
    repeatEndDate: '2024-12-31',
  };

  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {
    const titleInput = screen.getByLabelText('제목');
    const dateInput = screen.getByLabelText('날짜');
    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    const descriptionInput = screen.getByLabelText('설명');
    const locationInput = screen.getByLabelText('위치');
    const categoryInput = screen.getByLabelText('카테고리');
    const repeatCheckbox = screen.getByLabelText('반복 일정');
    const notificationTimeSelect = screen.getByLabelText('알림 설정');

    const repeatEventTypeSelect = screen.queryByLabelText('반복 유형');
    const repeatEventInterval = screen.queryByLabelText('반복 간격');

    const addEventButton = screen.getByTestId('event-submit-button');

    await userEvent.type(titleInput, newEvent.title);
    await userEvent.type(dateInput, newEvent.date);
    await userEvent.type(startTimeInput, newEvent.startTime);
    await userEvent.type(endTimeInput, newEvent.endTime);
    await userEvent.type(descriptionInput, newEvent.description);
    await userEvent.type(locationInput, newEvent.location);
    await userEvent.selectOptions(categoryInput, newEvent.category);
    await userEvent.selectOptions(notificationTimeSelect, newEvent.notificationTime);

    await userEvent.click(repeatCheckbox);
    if (repeatEventTypeSelect) {
      await userEvent.selectOptions(repeatEventTypeSelect, newEvent.repeatType);
    }
    if (repeatEventInterval) {
      await userEvent.type(repeatEventInterval, newEvent.repeatInterval);
    }

    await userEvent.click(addEventButton);
    expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
  });

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {
    const eventList = screen.getByTestId('event-list');

    await waitFor(() => {
      expect(within(eventList).getByText('기존 회의')).toBeInTheDocument();
    });

    const editButton = within(eventList).getAllByLabelText(/edit event/i);
    await userEvent.click(editButton[0]);

    const titleInput = screen.getByLabelText('제목');
    const dateInput = screen.getByLabelText('날짜');
    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    const descriptionInput = screen.getByLabelText('설명');
    const locationInput = screen.getByLabelText('위치');
    const categoryInput = screen.getByLabelText('카테고리');
    const notificationTimeSelect = screen.getByLabelText('알림 설정');
    const repeatEventTypeSelect = screen.queryByLabelText('반복 유형');
    const repeatEventInterval = screen.queryByLabelText('반복 간격');

    const addEventButton = screen.getByTestId('event-submit-button');

    expect(titleInput).toHaveValue('기존 회의');
    expect(dateInput).toHaveValue('2024-10-15');
    expect(startTimeInput).toHaveValue('09:00');
    expect(endTimeInput).toHaveValue('10:00');
    expect(descriptionInput).toHaveValue('기존 팀 미팅');
    expect(locationInput).toHaveValue('회의실 B');
    expect(categoryInput).toHaveValue('업무');

    expect(notificationTimeSelect).toHaveValue('10');
    if (repeatEventTypeSelect) {
      expect(repeatEventTypeSelect).toHaveValue('daily');
    }
    if (repeatEventInterval) {
      expect(repeatEventInterval).toHaveValue('1');
    }

    await userEvent.clear(startTimeInput);
    await userEvent.type(startTimeInput, '14:00');

    await userEvent.click(addEventButton);

    const toastMessage = await screen.findAllByText(/시간 설정을 확인해주세요/i);
    expect(toastMessage[0]).toBeInTheDocument();
  });
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {
  setupDateWithTime('2024-10-15', '09:50:00');
  renderApp();

  const eventList = screen.getByTestId('event-list');

  await waitFor(() => {
    expect(within(eventList).getByText('기존 회의')).toBeInTheDocument();
  });

  expect(screen.getByText('10분 전')).toBeInTheDocument();
});
