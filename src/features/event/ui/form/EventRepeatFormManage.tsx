import { FormControl, FormLabel, HStack, Input, Select, VStack } from '@chakra-ui/react';

import { useEventContext } from '@/features/event/model/useEventContext';

export const EventRepeatFormManage = () => {
  const { formValues } = useEventContext();
  const { repeatState, handleRepeatChange } = formValues;

  return (
    <VStack width="100%">
      <FormControl>
        <FormLabel>반복 유형</FormLabel>
        <Select
          value={repeatState.repeatType}
          onChange={(e) => handleRepeatChange('repeatType', e.target.value)}
        >
          <option value="daily">매일</option>
          <option value="weekly">매주</option>
          <option value="monthly">매월</option>
          <option value="yearly">매년</option>
        </Select>
      </FormControl>
      <HStack width="100%">
        <FormControl>
          <FormLabel>반복 간격</FormLabel>
          <Input
            type="number"
            value={repeatState.repeatInterval}
            onChange={(e) => handleRepeatChange('repeatInterval', e.target.valueAsNumber)}
            min={1}
          />
        </FormControl>
        <FormControl>
          <FormLabel>반복 종료일</FormLabel>
          <Input
            type="date"
            value={repeatState.repeatEndDate}
            onChange={(e) => handleRepeatChange('repeatEndDate', e.target.value)}
          />
        </FormControl>
      </HStack>
    </VStack>
  );
};
