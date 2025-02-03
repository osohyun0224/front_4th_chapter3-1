import {
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Tooltip,
  VStack,
} from '@chakra-ui/react';

import { EventFormButton } from './EventFormButton';
import { EventRepeatFormManage } from './EventRepeatFormManage';

import { useEventContext } from '@/features/event/model/useEventContext';
import { categories } from '@/shared/config/category';
import { notificationOptions } from '@/shared/config/notification';
import { getTimeErrorMessage } from '@/shared/lib/date/timeValidation';

export const EventForm = () => {
  const { formValues } = useEventContext();
  const {
    formState,
    repeatState,
    startTime,
    endTime,
    startTimeError,
    endTimeError,
    editingEvent,
    handleStartTimeChange,
    handleEndTimeChange,
    handleEventChange,
    handleRepeatChange,
  } = formValues;

  return (
    <VStack w="400px" spacing={5} align="stretch">
      <Heading>{editingEvent ? '일정 수정' : '일정 추가'}</Heading>

      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          value={formState.title}
          onChange={(e) => handleEventChange('title', e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>날짜</FormLabel>
        <Input
          type="date"
          value={formState.date}
          onChange={(e) => handleEventChange('date', e.target.value)}
        />
      </FormControl>

      <HStack width="100%">
        <FormControl>
          <FormLabel>시작 시간</FormLabel>
          <Tooltip label={startTimeError} isOpen={!!startTimeError} placement="top">
            <Input
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              onBlur={() => getTimeErrorMessage(startTime, endTime)}
              isInvalid={!!startTimeError}
            />
          </Tooltip>
        </FormControl>
        <FormControl>
          <FormLabel>종료 시간</FormLabel>
          <Tooltip label={endTimeError} isOpen={!!endTimeError} placement="top">
            <Input
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              onBlur={() => getTimeErrorMessage(startTime, endTime)}
              isInvalid={!!endTimeError}
            />
          </Tooltip>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>설명</FormLabel>
        <Input
          value={formState.description}
          onChange={(e) => handleEventChange('description', e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>위치</FormLabel>
        <Input
          value={formState.location}
          onChange={(e) => handleEventChange('location', e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>카테고리</FormLabel>
        <Select
          value={formState.category}
          onChange={(e) => handleEventChange('category', e.target.value)}
        >
          <option value="">카테고리 선택</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>반복 설정</FormLabel>
        <Checkbox
          isChecked={repeatState.isRepeating}
          onChange={(e) => handleRepeatChange('isRepeating', e.target.checked)}
        >
          반복 일정
        </Checkbox>
      </FormControl>

      <FormControl>
        <FormLabel>알림 설정</FormLabel>
        <Select
          value={formState.notificationTime}
          onChange={(e) => handleEventChange('notificationTime', +e.target.value)}
        >
          {notificationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>

      {repeatState.isRepeating && <EventRepeatFormManage />}
      <EventFormButton />
    </VStack>
  );
};
