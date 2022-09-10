import {
  _greatestCommonDivisorByInterator,
  _greatestCommonDivisorByRecursion,
} from './_internal/gratest-common-divisor.internal';

export type GreatestType = 'RECURSION' | 'INTERATOR';

/**
 * - GCD:
 *  Choose algorithm.
 */
export const algorithmRef = (ref: GreatestType) => {
  return ref === 'RECURSION'
    ? _greatestCommonDivisorByRecursion
    : _greatestCommonDivisorByInterator;
};
