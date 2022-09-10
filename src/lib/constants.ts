export const FUNCTION_STRICT_TYPE = '[object Function]';
export const STRING_STRICT_TYPE = '[object String]';

export const SQUARE_PROPORTION = '1:1';
export const PERFECT_SQUARE_INTEGER = 1;
export const PROPORTION_DELIMITER = ':';

export const MEGAPIXELS_AMOUNT = 1_000_000;
export const MEGAPIXELS_SUFFIX = 'MP';

//

export const _Prototype = () => Object.prototype;

export const _NumberPrototype = () => Number.prototype;

// prettier-ignore
export const _StrictTypeString = (value: unknown) => _Prototype().toString.call(value);

//

// https://regex101.com/r/P3Sqa9/1
export const RESOLUTION_REGULAR_EXPRESSION =
  /(?<resolution>(?<width>^[\d]{1,8})x(?<height>[\d]{1,8}$))/i;

export const PROPORTION_REGULAR_EXPRESSION =
  /(?<screen_proportion>^(?<width>\d{1,3}):(?<height>\d{1,3})$)/i;
