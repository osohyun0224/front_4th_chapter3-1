import { Button, Text } from '@chakra-ui/react';
import { useRef } from 'react';

import { createEventFormData } from '@/features/event/lib/eventUtils';
import { useEventContext } from '@/features/event/model/useEventContext';
import { DialogAlert } from '@/shared/ui';

export const EventAlert = () => {
  const { formValues, operationsValues, state } = useEventContext();
  const { formState, repeatState, startTime, endTime, editingEvent } = formValues;
  const { saveEvent } = operationsValues;
  const { isOverlapDialogOpen, handleCloseOverlapDialog, overlappingEvents } = state;

  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleSave = () => {
    handleCloseOverlapDialog();
    const eventData = createEventFormData({
      startTime,
      endTime,
      formState,
      repeatState,
      editingEvent,
    });
    saveEvent(eventData);
  };

  return (
    <DialogAlert.Container
      isOpen={isOverlapDialogOpen}
      leastDestructiveRef={cancelRef}
      onClose={handleCloseOverlapDialog}
    >
      <DialogAlert.Header fontSize="lg" fontWeight="bold">
        일정 겹침 경고
      </DialogAlert.Header>

      <DialogAlert.Body>
        다음 일정과 겹칩니다:
        {overlappingEvents.map((event) => (
          <Text key={event.id}>
            {event.title} ({event.date} {event.startTime}-{event.endTime})
          </Text>
        ))}
        계속 진행하시겠습니까?
      </DialogAlert.Body>

      <DialogAlert.Footer>
        <Button ref={cancelRef} onClick={handleCloseOverlapDialog}>
          취소
        </Button>
        <Button colorScheme="red" onClick={handleSave} ml={3}>
          계속 진행
        </Button>
      </DialogAlert.Footer>
    </DialogAlert.Container>
  );
};
