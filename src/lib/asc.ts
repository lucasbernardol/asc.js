import util from 'node:util';

import {
  algorithmRef,
  GreatestCommonDivisorAlgorithmType,
} from './mathematics/greatest-algorithm.math';

import {
  PERFECT_SQUARE_INT,
  PROPORTION_DELIMITER,
  SQUARE_PROPORTION,
} from '../constants/string.constants';

import {
  PROPORTION_REGULAR_EXPRESSION,
  RESOLUTION_REGULAR_EXPRESSION,
} from '../constants/regexp.constants';

import { parser } from './utils/parser-options.util';

import {
  sortingBySpecificOrder,
  SortingOptions,
  SortingOrderType,
} from './utils/sorting-arrays.util';

import {
  formatAspectRatioText,
  formatPixelsString,
  formatResolutionString,
} from './utils/format-string.util';

import {
  isStrictFunction,
  isStrictString,
  toDigitsString,
} from './utils/prototype-functions.utils';

import {
  ORIENTATION_ENUM_KEYS,
  ORIENTATION_ENUM,
} from './types/enums/orientation.enum';

/**
 * - Aproximate `aspect ratio` text.
 */
type AproximateAspectRatioTextOptions = {
  width: number;
  height: number;
  delimiter?: string;
  gcdType: GreatestCommonDivisorAlgorithmType;
};

const APROXIMATE_BASE_OPTIONS: Partial<AproximateAspectRatioTextOptions> = {
  delimiter: PROPORTION_DELIMITER,
  gcdType: 'INTERATOR',
};

/**
 * - Utils
 */
const _aproximateAspectRatioText = (
  options: AproximateAspectRatioTextOptions
): { proportion_text: string; proportion_amount: number } => {
  const { width, height, delimiter, gcdType } =
    parser<AproximateAspectRatioTextOptions>(APROXIMATE_BASE_OPTIONS, options);

  const greatestDivisorFn = algorithmRef(gcdType);

  const proportion_amount = greatestDivisorFn(width, height);

  if (proportion_amount === PERFECT_SQUARE_INT /* 1 */) {
    const proportion_text = SQUARE_PROPORTION.replace(
      PROPORTION_DELIMITER,
      delimiter as string
    );

    return { proportion_text, proportion_amount };
  }

  const proportion_text = formatAspectRatioText(
    width / proportion_amount,
    height / proportion_amount,
    delimiter as string
  );

  return { proportion_text, proportion_amount };
};

const _safeOrientationByEnum = (ratio: number): ORIENTATION_ENUM_KEYS => {
  /**
   * x = 1 - SQUARE
   * x > 1 - LANDSCAPE
   * x < 1 - PORTRAIT
   * x == NaN = UNKNOW
   */
  const aspect = Math.abs(ratio);

  const isAspectNaN: boolean = isNaN(aspect);

  if (isAspectNaN) {
    return ORIENTATION_ENUM['UNKNOWN'];
  }

  // prettier-ignore
  return aspect === 1 
    ? (ORIENTATION_ENUM['SQUARE']) 
    : (aspect > 1 ? 
    ORIENTATION_ENUM['LANDSCAPE'] : 
    ORIENTATION_ENUM['PORTRAIT']
  )
};

const _safeCallbackExecution = <T = any>(
  callback: (...args: any) => T,
  context: any,
  d: T
) => {
  return isStrictFunction(callback) ? callback.apply(context, []) : d;
};

/**
 * - Aspect ratio string `16:9` to ratio.
 */
type AspectToIntegerOptions = {
  otherDelimiter?: boolean;
  delimiter?: string;
};

const ASPECT_PROPORTION_INTEGER_BASE: Partial<AspectToIntegerOptions> = {
  delimiter: PROPORTION_DELIMITER,
  otherDelimiter: false,
};

export const aspectToInteger = <Delimiter = string>(
  aspect: Delimiter,
  options: AspectToIntegerOptions = {}
): number | -1 => {
  const { delimiter, otherDelimiter } = parser<AspectToIntegerOptions>(
    ASPECT_PROPORTION_INTEGER_BASE,
    options
  );

  const _withExpression = (v: string) => PROPORTION_REGULAR_EXPRESSION.test(v);

  const matches = !otherDelimiter ? _withExpression(aspect as any) : true;

  if (matches) {
    const aspects = (aspect as unknown as string).split(delimiter as string);

    const [width, height] = aspects.map((aspect) => parseInt(aspect, 10));

    return width / height;
  }

  return -1;
};

/**
 * - Image aspect ratio.
 */
type RatioDimensionCallback = number | ((...args: any) => number);
type RatioResolution = `${number}x${number}`;

type RatioOptions = {
  width?: RatioDimensionCallback;
  height?: RatioDimensionCallback;
  resolution?: RatioResolution;
  /**
   * @default ":"
   */
  gcdType?: GreatestCommonDivisorAlgorithmType;
  proportionDelimiter?: string;
  sortingOrder?: SortingOrderType;
  sortingDimensions?: boolean;
};

type RatioOutput = {
  width: number;
  height: number;
  ratio: number;
  aspect_ratio: string;
  area: number;
  pixels: number;
  pixels_unit: string;
  pixels_suffix: string;
  megapixels: number;
  megapixels_unit: string;
  megapixels_suffix: string;
  proportion_text: string;
  proportion_amount: number;
  resolution: string;
  orientation: ORIENTATION_ENUM_KEYS;
};

type RatioDimensions = Pick<RatioOptions, 'width' | 'height'>;

type RatioSorting = Pick<RatioOptions, 'sortingDimensions' | 'sortingOrder'>;

type RatioParserDimensions = [number, number];

const RATION_BASE_OPTIONS: Partial<RatioOptions> = {
  width: 1,
  height: 1,
  gcdType: 'INTERATOR',
  sortingOrder: 'desc',
  sortingDimensions: false,
  proportionDelimiter: PROPORTION_DELIMITER,
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

const _parserToResolution = (
  str: string,
  { sortingOrder, sortingDimensions }: RatioSorting
): RatioParserDimensions => {
  const matches = str.match(RESOLUTION_REGULAR_EXPRESSION);

  if (!matches) throw new Error('Resolution does not matches.');

  const _OPTIONS: SortingOptions = { order: sortingOrder };

  /** es2018 */
  const dimentionsGroups = matches?.groups as DimensionsGroupsRegexp;

  const dimensionsEntries = Object.entries(dimentionsGroups);

  const dimensions = dimensionsEntries.filter(
    ([key, _]) => key !== 'resolution'
  );

  const dimensionIntegers = dimensions.map(([_, value]) => {
    return parseInt(value, 10);
  }) as [number, number];

  return sortingDimensions
    ? sortingBySpecificOrder<RatioParserDimensions>(dimensionIntegers, _OPTIONS)
    : dimensionIntegers;
};

/**
 * - Parser:
 *   Serialize `width` and `height` properties.
 */
const _parserToDimensions = (
  dimensions: RatioDimensions,
  { sortingDimensions, sortingOrder }: RatioSorting
): RatioParserDimensions => {
  const _OPTIONS: SortingOptions = { order: sortingOrder };

  const dimensionsArray = callbacksParser(dimensions);

  return sortingDimensions
    ? sortingBySpecificOrder<RatioParserDimensions>(dimensionsArray, _OPTIONS)
    : dimensionsArray;
};

function pixelsSuffix(amount: number): {
  amount: number;
  pixels_suffix: string;
  sizes: string[];
} {
  const sizes: string[] = ['P', 'KP', 'MP', 'GP', 'TP'];

  /**
   * 1000 pixels = 1KP
   */
  let _DIVIDER: number = 1000;

  let pixels: number = amount;
  let interactions: number = 0;

  while (pixels >= _DIVIDER) {
    //amount = amount / _DIVIDER;
    pixels /= _DIVIDER;

    interactions++;
  }

  const pixels_suffix = sizes[interactions];

  return { amount, pixels_suffix, sizes };
}

const _unitFormatter = (left: unknown, right: unknown): string =>
  util.format('%s %s', left, right);

/**
 * @description Calculate aspect ratio.
 */
export function ratio(options: RatioOptions): RatioOutput {
  const {
    sortingDimensions,
    proportionDelimiter,
    gcdType,
    sortingOrder,
    resolution,
    ...dimensions
  } = parser<RatioOptions>(RATION_BASE_OPTIONS, options);

  const _MEGAPIXELS_AMOUNT = 1_000_000; // 1e6 - 1000000

  const _SORT = { sortingDimensions, sortingOrder };

  const isResolution: boolean = isStrictString(resolution);

  const [width, height] = isResolution
    ? _parserToResolution(resolution as any, _SORT)
    : _parserToDimensions(dimensions, _SORT);

  const area = width * height;

  /**
   * Area or `pixels` alias.
   */
  const pixels = area;

  const { amount, pixels_suffix } = pixelsSuffix(pixels);

  const _amount = amount.toLocaleString();

  const pixels_unit = _unitFormatter(_amount, pixels_suffix);

  /**
   * - Megapixels
   */
  const _MEGAPIXELS_SUFFIX = 'MP';

  const _megapixels = (pixels / _MEGAPIXELS_AMOUNT).toFixed(1);

  const megapixels = Number.parseFloat(_megapixels);

  const megapixels_unit = _unitFormatter(megapixels, _MEGAPIXELS_SUFFIX);

  const megapixels_suffix = _MEGAPIXELS_SUFFIX;

  /**
   * - Ratio
   */
  const ratio = width / height;

  // '1.7777777777' => '1.77778';
  const aspect_ratio = toDigitsString(ratio, 5);

  /**
   * - Proportions
   */
  const _PORPORTION = {
    width,
    height,
    delimiter: proportionDelimiter,
    gcdType,
  };

  const { proportion_text, proportion_amount } = _aproximateAspectRatioText(
    _PORPORTION as any
  );

  // Display orientation
  const orientation: ORIENTATION_ENUM_KEYS = _safeOrientationByEnum(ratio);

  const _resolution = formatResolutionString(width, height);

  return {
    width,
    height,
    ratio,
    aspect_ratio,
    area,
    pixels,
    pixels_unit,
    pixels_suffix,
    megapixels,
    megapixels_unit,
    megapixels_suffix,
    proportion_text,
    proportion_amount,
    orientation,
    resolution: _resolution,
  };
}
