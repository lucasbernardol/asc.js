export const _greatestCommonDivisorByRecursion = (
  width: number,
  height: number
): number => {
  const left = Math.abs(width); // Recursion

  const right = Math.abs(height);

  return right ? greatestCommonDivisorByRecursion(right, left % right) : left;
};

export function _greatestCommonDivisorByInterator(
  width: number,
  height: number
): number | -1 {
  //Array.from(arguments).map((arg) => parseInt(arg, 10))

  // funciton statement
  const argumentsLessThanTwo: boolean = arguments.length < 2;

  if (argumentsLessThanTwo) {
    return -1;
  }

  let left = Math.abs(width);

  let right = Math.abs(height);

  /**
   * - Current `right` value.
   * @see https://en.wikipedia.org/wiki/Euclidean_algorithm
   */
  let _TEMP: number = 0;

  while (right !== 0 /** Boolean(h) === false */) {
    _TEMP = right;

    right = left % right;

    left = _TEMP;
  }

  return left || right;
}

//greatestCommonDivisorByRecursion.signature = 'Recursion';
//greatestCommonDivisorByInterator.signature = 'Interator';
