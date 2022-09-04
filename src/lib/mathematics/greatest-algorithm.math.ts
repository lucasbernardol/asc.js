import {
  _greatestCommonDivisorByInterator,
  _greatestCommonDivisorByRecursion,
} from "./_internal/gratest-common-divisor.internal";

export type GreatestCommonDivisorAlgorithmType = "RECURSION" | "INTERATOR";

/**
 * - GCD:
 *  Choose algorithm.
 */
export const algorithmRef = (ref: GreatestCommonDivisorAlgorithmType) => {
  return ref === "RECURSION"
    ? _greatestCommonDivisorByRecursion
    : _greatestCommonDivisorByInterator;
};
