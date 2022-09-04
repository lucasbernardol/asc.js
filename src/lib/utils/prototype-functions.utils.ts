import {
  _StrictTypeString,
  _NumberPrototype,
} from "../../constants/prototype.constants";

import {
  FUNCTION_STRICT_TYPE,
  STRING_STRICT_TYPE,
} from "../../constants/strict-types.constants";

/**
 * - Utils
 */
export const isStrict = (value: unknown, strictType: string) =>
  _StrictTypeString(value) === strictType;

// prettier-ignore
export const isStrictFunction = (value: unknown) => isStrict(value, FUNCTION_STRICT_TYPE);

// prettier-ignore
export const isStrictString = (value: unknown) => isStrict(value, STRING_STRICT_TYPE);

export const toDigitsString = (value: number, digits: number = 5) =>
  _NumberPrototype().toFixed.call(value, digits);
