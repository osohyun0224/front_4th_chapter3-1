/**
 * 객체 배열에서 id 값들만 추출하여 새로운 배열로 반환
 */
export const extractIdsFromObjects = <T extends { id: string }>(objects: T[]): string[] => {
  return objects.map(({ id }) => id);
};

/**
 * 배열에서 특정 인덱스의 요소를 제외한 새로운 배열 반환
 */
export const removeItemAtIndex = <T>(array: T[], indexToRemove: number): T[] => {
  return array.filter((_, currentIndex) => currentIndex !== indexToRemove);
};

/**
 * 기존 배열의 시작 또는 끝에 새로운 요소들을 추가
 */
export const insertItems = <T>(
  originalArray: T[],
  itemsToAdd: T[] | T,
  position: 'start' | 'end' = 'end'
): T[] => {
  const itemsArray = Array.isArray(itemsToAdd) ? itemsToAdd : [itemsToAdd];

  return position === 'start'
    ? [...itemsArray, ...originalArray]
    : [...originalArray, ...itemsArray];
};
