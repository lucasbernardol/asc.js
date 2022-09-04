/**
 * - Merge options.
 */
export function parser<T = any>(to: Partial<T>, from: T): T {
  return Object.assign({}, to, from);
}
