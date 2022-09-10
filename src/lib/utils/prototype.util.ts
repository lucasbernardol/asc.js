import { _StrictTypeString, _NumberPrototype } from '../constants';

import { FUNCTION_STRICT_TYPE, STRING_STRICT_TYPE } from '../constants';

export const isStrict = (value: unknown, checking: string) =>
  _StrictTypeString(value) === checking;

export const isStrictFunction = (value: unknown) =>
  isStrict(value, FUNCTION_STRICT_TYPE);

export const isStrictString = (value: unknown) =>
  isStrict(value, STRING_STRICT_TYPE);
