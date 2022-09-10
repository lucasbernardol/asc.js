export type SortingOrderType = 'desc' | 'asc';

export type SortingOptions = {
  order?: SortingOrderType;
};

/**
 * - Sorting arrays.
 * @param arr Array numbers
 * @param options Sorting options,
 * @returns
 */
export function sortingBySpecificOrder<T = any>(
  arr: number[],
  { order }: SortingOptions = { order: 'desc' }
): T {
  // sorting
  function sortableCallbackFn(a: number, b: number) {
    const isDesc = order === 'desc';

    return isDesc ? b - a : a - b;
  }

  return arr.sort((a, b) => sortableCallbackFn(a, b)) as unknown as T;
}
