import { Box } from '@chakra-ui/react';

import { EventAlert, EventNotifications } from '@/features/event/ui';
import { EventManage } from '@/widget/event/ui';

export const EventManagePage = () => {
  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <EventManage />
      <EventAlert />
      <EventNotifications />
    </Box>
  );
};
