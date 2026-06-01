/**
 * Swaps two elements in an array.
 *
 * @param arr - The array.
 * @param i - The index of the first element.
 * @param j - The index of the second element.
 * @returns void
 */
export const swap = <T>(arr: T[], i: number, j: number): T[] => {
  const temp = arr[i]
  /* eslint-disable no-param-reassign */
  arr[i] = arr[j]
  arr[j] = temp
  /* eslint-enable no-param-reassign */
  return arr
}
