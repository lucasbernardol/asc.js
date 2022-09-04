// Constants
// https://regex101.com/r/P3Sqa9/1
const RESOLUTION_REGULAR_EXPRESSION =
  /(?<resolution>(?<width>^[\d]{1,8})x(?<height>[\d]{1,8}$))/i;
const PROPORTION_REGULAR_EXPRESSION =
  /(?<screen_proportion>^(?<width>\d{1,3}):(?<height>\d{1,3})$)/i;

const FUNCTION_STRICT_TYPE = "[object Function]";
const STRING_STRICT_TYPE = "[object String]";

const SQUARE_PROPORTION = "1:1";
const PERFECT_SQUARE_INT = 1;

const PROPORTION_DELIMITER = ":";

// -----------------

const ORIENTATION_ENUM = (key: OrientationEnumKeys): string => Orientation[key];

/**
 * Global types
 */
enum Orientation {
  "LANDSCAPE" = "LANDSCAPE", // paisagem
  "PORTRAIT" = "PORTRAIT", // retrato
  "UNKNOWN" = "UNKNOWN",
}

type OrientationEnumKeys = keyof typeof Orientation;

/**
 * - Utils --------------
 */
const _Prototype = () => Object.prototype;
const _NumberPrototype = () => Number.prototype;
const _StrictTypeString = (value: unknown) => _Prototype().toString.call(value);

const isStrict = (value: unknown, strictType: string) =>
  _StrictTypeString(value) === strictType;

const isStrictFunction = (value: unknown) =>
  isStrict(value, FUNCTION_STRICT_TYPE);
const isStrictString = (value: unknown) => isStrict(value, STRING_STRICT_TYPE);

const parser = <T = any>(to: Partial<T>, from: T): T =>
  Object.assign({}, to, from);

/**
 * - Numbers ----------------
 */
const toDigitsString = (value: number, digits: number = 5) =>
  _NumberPrototype().toFixed.call(value, digits);

/**
 * - Formating ---------------
 */
const formatAspectRatioString = (w: number, h: number, delimiter: string) =>
  `${w}${delimiter}${h}`;

const formatResolutionString = (w: number, h: number) => `${w}x${h}`;
const formatPixelsString = (pixels: number): string => `${pixels}px`;

/**
 * - Synchronous callback execution with default value/parameter. Synchronous
 */
const _safeCallbackExecution = <T = any>(
  callback: (args: any) => T,
  v: any,
  d: T
): T => (isStrictFunction(callback) ? callback.call(null, v) : d);

/**
 * - Orientation by picture.
 */
const _safeOrientationByEnum = (ratio: number): OrientationEnumKeys => {
  const orientation =
    ratio && !isNaN(ratio)
      ? ratio > 1
        ? ORIENTATION_ENUM("LANDSCAPE")
        : ORIENTATION_ENUM("PORTRAIT")
      : ORIENTATION_ENUM("UNKNOWN");

  return orientation as OrientationEnumKeys;
};

/**
 * - Sorting Arrays
 */
type SortOrderOptional = "desc" | "asc";

type SortBySpecificOrderOptions = {
  order?: SortOrderOptional;
};

const sortBySpecificOrder = <T = any>(
  sortArr: number[],
  { order }: SortBySpecificOrderOptions = { order: "desc" }
): T => {
  function sortableCallbackFn(a: number, b: number): number {
    const isDesc = order === "desc";

    return isDesc ? b - a : a - b;
  }

  return sortArr.sort((a, b) => sortableCallbackFn(a, b)) as unknown as T;
};

/**
 * Aspect ration/proportion
 *  Example: 16:9, 21:9 ....
 */
type GreatestCommonDivisorAlgorithmType = "RECURSION" | "INTERATOR";

const greatestCommonDivisorByRecursion = (
  width: number,
  height: number
): number => {
  // Recursion
  return height
    ? greatestCommonDivisorByRecursion(height, width % height)
    : width;
};

const greatestCommonDivisorByInterator = (width: number, height: number) => {
  // Interator.
  let widthAbsolute = Math.abs(width);

  let heightAbsolute = Math.abs(height);

  while (heightAbsolute !== 0 /** Boolean(h) === false */) {
    const temp = heightAbsolute;

    heightAbsolute = widthAbsolute % heightAbsolute;

    widthAbsolute = temp;
  }

  return widthAbsolute;
};

function greatestCommonDivisorInterator(
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

const gratestAlgorithmRef = (
  algorithmType: GreatestCommonDivisorAlgorithmType
) => {
  return algorithmType === "INTERATOR"
    ? greatestCommonDivisorByRecursion
    : greatestCommonDivisorByInterator;
};

/**
 * Estimated aspect ratio. ------------
 */
type AspectRatioStimatedOptions = {
  width: number;
  height: number;
  delimiter?: string;
  gcd_type: GreatestCommonDivisorAlgorithmType;
};

const APROXIMATE_BASE_OPTIONS: Partial<AspectRatioStimatedOptions> = {
  delimiter: PROPORTION_DELIMITER,
  gcd_type: "INTERATOR",
};

const _aproximateAspectRatio = (options: AspectRatioStimatedOptions) => {
  const { width, height, delimiter, gcd_type } =
    parser<AspectRatioStimatedOptions>(APROXIMATE_BASE_OPTIONS, options);

  const greatestDivisorFn = gratestAlgorithmRef(gcd_type);

  const divisor = greatestDivisorFn(width, height);

  if (divisor === PERFECT_SQUARE_INT /* 1 */) {
    return SQUARE_PROPORTION.replace(
      PROPORTION_DELIMITER,
      () => delimiter as string
    );
  }

  const left: number = width / divisor;

  const right: number = height / divisor;

  return formatAspectRatioString(left, right, delimiter as string);
};

/**
 * - Image aspect ratio.
 */
type RatioDimensionOrCallbackType = number | ((...args: any) => number);

type RatioResolutionString = `${number}x${number}`;

type RatioOptions = {
  width?: RatioDimensionOrCallbackType;
  height?: RatioDimensionOrCallbackType;
  resolution?: RatioResolutionString;
  /**
   * @default ":"
   */
  gcd_type?: GreatestCommonDivisorAlgorithmType;
  proportion_delimiter?: string;
  sorting_order?: SortOrderOptional;
  sorting_dimensions?: boolean;
};

type RationOutput = {
  width: number;
  height: number;
  ratio: number;
  aspect_ratio: string;
  pixels: number;
  pixels_unit: string;
  area: number;
  proportion: string;
  resolution: string;
  orientation: OrientationEnumKeys;
  _original?: {
    dimensions: [RatioDimensionOrCallbackType, RatioDimensionOrCallbackType];
  };
};

type RatioDimensions = Pick<RatioOptions, "width" | "height">;
type RatioSorting = Pick<RatioOptions, "sorting_dimensions" | "sorting_order">;
type RatioParserDimensions = [number, number];

const RATION_BASE_OPTIONS: Partial<RatioOptions> = {
  width: 1,
  height: 1,
  gcd_type: "INTERATOR",
  sorting_order: "desc",
  sorting_dimensions: false,
  proportion_delimiter: PROPORTION_DELIMITER,
};

const callbacksParser = <T = any>({
  width,
  height,
}: T | any): RatioParserDimensions => {
  return [
    width ? _safeCallbackExecution<number>(width as any, null, width) : 0,
    height ? _safeCallbackExecution<number>(height as any, null, height) : 0,
  ];
};

/**
 * - Parser: serialize `resolution` string.
 */
type DimensionsGroupsRegexp = {
  width: string;
  height: string;
  resolution: string;
};

const resolutionParser = (
  str: string,
  { sorting_order, sorting_dimensions }: RatioSorting
): RatioParserDimensions => {
  const matches = str.match(RESOLUTION_REGULAR_EXPRESSION);

  if (!matches) throw new Error("Resolution does not matches.");

  const _OPTIONS: SortBySpecificOrderOptions = { order: sorting_order };

  /** es2018 */
  const dimentionsGroups = matches?.groups as DimensionsGroupsRegexp;

  const dimensionsEntries = Object.entries(dimentionsGroups);

  const dimensions = dimensionsEntries.filter(
    ([key, _]) => key !== "resolution"
  );

  const dimensionIntegers = dimensions.map(([_, value]) => {
    return parseInt(value, 10);
  }) as [number, number];

  return sorting_dimensions
    ? sortBySpecificOrder<RatioParserDimensions>(dimensionIntegers, _OPTIONS)
    : dimensionIntegers;
};

/**
 * - Dimensions parser:
 *   Serialize `width` and `height` properties.
 */
const dimensionsParser = (
  dimensions: RatioDimensions,
  { sorting_dimensions, sorting_order }: RatioSorting
): RatioParserDimensions => {
  const _OPTIONS: SortBySpecificOrderOptions = { order: sorting_order };

  const dimensionsArray = callbacksParser(dimensions);

  // prettier-ignore
  return sorting_dimensions ? sortBySpecificOrder<RatioParserDimensions>(dimensionsArray, _OPTIONS): dimensionsArray;
};

const ratio = (options: RatioOptions): RationOutput => {
  const {
    proportion_delimiter,
    gcd_type,
    sorting_order,
    sorting_dimensions,
    resolution,
    ...dimensions
  } = parser<RatioOptions>(RATION_BASE_OPTIONS, options);

  const isResolution: boolean = isStrictString(resolution);

  // Sorting options.
  const _SORT = { sorting_dimensions, sorting_order };

  const [width, height] = isResolution
    ? resolutionParser(resolution as any, _SORT)
    : dimensionsParser(dimensions, _SORT);

  // Area or "pixels" alias.
  const pixels = width * height;

  const area = pixels;

  const pixels_unit: string = formatPixelsString(pixels);

  // Ratio
  const ratio = width / height;

  const aspect_ratio: string = toDigitsString(ratio, 5); // '1.7777777777' => '1.77778';

  // Proportion: "16:9" etc..
  const proportion = _aproximateAspectRatio({
    width,
    height,
    delimiter: proportion_delimiter,
    gcd_type: gcd_type as GreatestCommonDivisorAlgorithmType,
  });

  // Display orientation
  const orientation: OrientationEnumKeys = _safeOrientationByEnum(ratio);

  const resolutionStringOriginalOrSorted = formatResolutionString(
    width,
    height
  );

  return {
    width,
    height,
    ratio,
    aspect_ratio,
    pixels,
    pixels_unit,
    area,
    proportion,
    resolution: resolutionStringOriginalOrSorted,
    orientation,
    _original: {
      dimensions: (isResolution ? [] : Object.values(dimensions)) as any,
    },
  };
};

/*
console.time('Ratio');

const data = ratio({
  width: 1920,
  height: 1080,
  //sorting_dimensions: true,
});

console.timeEnd('Ratio');
console.log({ data }); */

type ProprotionStringToAspectRatio = `${number}x${number}`;

const proportionToRatio = <T = any>(
  proprotion: ProprotionStringToAspectRatio | T,
  delimiter: string = PROPORTION_DELIMITER
): number | -1 => {
  const matches: boolean = PROPORTION_REGULAR_EXPRESSION.test(
    proprotion as string
  );

  if (matches) {
    const partials = (proprotion as string).split(delimiter);

    const [left, right] = partials.map((value) => parseInt(value, 10));

    return left / right;
  }

  return -1;
};

console.time();

const aspect = proportionToRatio("16:9");

console.timeEnd();

console.log({ aspect });
