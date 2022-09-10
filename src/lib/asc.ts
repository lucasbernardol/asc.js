import { algorithmRef, GreatestType } from './functions/greatest.math';
import { parser } from './utils/parser.util';

import * as _Sorter from './utils/sorter.util';
import * as _Prototype from './utils/prototype.util';
import * as Formatter from './utils/formatters.util';

import {
  PERFECT_SQUARE_INTEGER,
  PROPORTION_DELIMITER,
  PROPORTION_REGULAR_EXPRESSION,
  RESOLUTION_REGULAR_EXPRESSION,
  SQUARE_PROPORTION,
  MEGAPIXELS_AMOUNT,
  MEGAPIXELS_SUFFIX,
} from './constants';

/**
 * Global types
 */
export enum ORIENTATION_ENUM {
  'SQUARE' = 'SQUARE',
  'LANDSCAPE' = 'LANDSCAPE',
  'PORTRAIT' = 'PORTRAIT',
  'UNKNOWN' = 'UNKNOWN',
}

export type ORIENTATION_ENUM_KEYS = keyof typeof ORIENTATION_ENUM;

/**
 * - Utils
 */
export type AproximateAspectRatioTextOptions = {
  width: number;
  height: number;
  delimiter?: string;
  greatest_algorithm_type: GreatestType;
};

const APROXIMATE_BASE_OPTIONS: Partial<AproximateAspectRatioTextOptions> = {
  delimiter: PROPORTION_DELIMITER,
  greatest_algorithm_type: 'INTERATOR',
};

const _aproximateAspectRatioText = (
  options: AproximateAspectRatioTextOptions
): { proportion_text: string; proportion_amount: number } => {
  const { width, height, delimiter, greatest_algorithm_type } =
    parser<AproximateAspectRatioTextOptions>(APROXIMATE_BASE_OPTIONS, options);

  const greatestDivisorFn = algorithmRef(greatest_algorithm_type);

  const proportion_amount = greatestDivisorFn(width, height);

  if (proportion_amount === PERFECT_SQUARE_INTEGER /* 1 */) {
    const proportion_text = SQUARE_PROPORTION.replace(
      PROPORTION_DELIMITER,
      delimiter as string
    );

    return { proportion_text, proportion_amount };
  }

  const proportion_text = Formatter.formatAspectRatioText(
    width / proportion_amount,
    height / proportion_amount,
    delimiter as string
  );

  return { proportion_text, proportion_amount };
};

const _safeOrientationByEnum = (ratio: number): ORIENTATION_ENUM_KEYS => {
  /**
   * aspect == NaN = UNKNOW
   *
   * aspect = 1 - SQUARE
   * aspect > 1 - LANDSCAPE
   * aspect < 1 - PORTRAIT
   */
  const aspect_ratio = Math.abs(ratio);

  const isAspectRatioNaN: boolean = isNaN(aspect_ratio);

  if (isAspectRatioNaN) {
    return ORIENTATION_ENUM['UNKNOWN'];
  }

  // prettier-ignore
  return aspect_ratio === 1 
    ? (ORIENTATION_ENUM['SQUARE']) 
    : (aspect_ratio > 1 ? 
    ORIENTATION_ENUM['LANDSCAPE'] : 
    ORIENTATION_ENUM['PORTRAIT']
  )
};

const _safeCallbackExecution = <T = any>(
  callback: (...args: any) => T,
  context: any,
  d: T
) => {
  return _Prototype.isStrictFunction(callback)
    ? callback.apply(context, [])
    : d;
};

/**
 *  @description Converts `proportion` to integer value.
 */
export type AspectToIntegerOptions = {
  another_delimiter?: boolean;
  delimiter?: string;
};

const ASPECT_PROPORTION_INTEGER_BASE: Partial<AspectToIntegerOptions> = {
  another_delimiter: false,
  delimiter: PROPORTION_DELIMITER,
};

export function aspectToInteger<Delimiter = string>(
  aspect: Delimiter,
  options: AspectToIntegerOptions = {}
): number | -1 {
  const { delimiter, another_delimiter } = parser<AspectToIntegerOptions>(
    ASPECT_PROPORTION_INTEGER_BASE,
    options
  );

  const _withExpression = (v: string) => PROPORTION_REGULAR_EXPRESSION.test(v);

  const matches = !another_delimiter ? _withExpression(aspect as any) : true;

  if (matches) {
    const aspects = (aspect as unknown as string).split(delimiter as string);

    const [width, height] = aspects.map((aspect) => parseInt(aspect, 10));

    return width / height;
  }

  return -1;
}

/**
 * - Image aspect ratio.
 */
type RatioDimensionCallback = number | (() => number);

type RatioOptions = {
  width?: RatioDimensionCallback;
  height?: RatioDimensionCallback;
  resolution?: RatioResolution;
  sorting_order?: _Sorter.SortingOrderType;
  sorting_dimensions?: boolean;
  proportion_delimiter?: string;
  greatest_algorithm_type?: GreatestType;
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

type RatioParserDimensions = [number, number];

type RatioResolution = `${number}x${number}`;

const RATION_BASE_OPTIONS: Partial<RatioOptions> = {
  width: 1,
  height: 1,
  sorting_order: 'desc',
  sorting_dimensions: false,
  proportion_delimiter: PROPORTION_DELIMITER,
  greatest_algorithm_type: 'INTERATOR',
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
  {
    sorting_order,
    sorting_dimensions,
  }: Pick<RatioOptions, 'sorting_order' | 'sorting_dimensions'>
): RatioParserDimensions => {
  const matches = str.match(RESOLUTION_REGULAR_EXPRESSION);

  if (!matches) throw new Error('Resolution does not matches.');

  const _OPTIONS: _Sorter.SortingOptions = { order: sorting_order };

  // ES2018
  const dimentionsGroups = matches?.groups as DimensionsGroupsRegexp;

  const dimensionsEntries = Object.entries(dimentionsGroups);

  const dimensions = dimensionsEntries.filter(([key]) => key !== 'resolution');

  const dimensionIntegers = dimensions.map(([_, value]) => {
    return parseInt(value, 10);
  }) as [number, number];

  return sorting_dimensions
    ? _Sorter.sortingBySpecificOrder<RatioParserDimensions>(
        dimensionIntegers,
        _OPTIONS
      )
    : dimensionIntegers;
};

/**
 * - Parser:
 *   Serialize `width` and `height` properties.
 */
const _parserToDimensions = (
  dimensions: Partial<RatioOptions>,
  {
    sorting_order,
    sorting_dimensions,
  }: Pick<RatioOptions, 'sorting_order' | 'sorting_dimensions'>
): RatioParserDimensions => {
  const _OPTIONS: _Sorter.SortingOptions = { order: sorting_order };

  const dimensionsArray = callbacksParser(dimensions);

  return sorting_dimensions
    ? _Sorter.sortingBySpecificOrder<RatioParserDimensions>(
        dimensionsArray,
        _OPTIONS
      )
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

/**
 * @description Calculate aspect ratio.
 */
export function ratio(options: RatioOptions): RatioOutput {
  const {
    sorting_order,
    sorting_dimensions,
    proportion_delimiter,
    greatest_algorithm_type,
    resolution,
    ...dimensions
  } = parser<RatioOptions>(RATION_BASE_OPTIONS, options);

  const _SORT = { sorting_dimensions, sorting_order };

  const isResolution: boolean = _Prototype.isStrictString(resolution);

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

  const pixels_unit = Formatter._unitFormatter(_amount, pixels_suffix);

  /**
   * - Megapixels
   */

  const _megapixels = (pixels / MEGAPIXELS_AMOUNT).toFixed(1);

  const megapixels = Number.parseFloat(_megapixels);

  const megapixels_unit = Formatter._unitFormatter(
    megapixels,
    MEGAPIXELS_SUFFIX
  );

  const megapixels_suffix = MEGAPIXELS_SUFFIX;

  /**
   * - Ratio
   */
  const ratio = width / height;

  // '1.7777777777' => '1.77778';
  const aspect_ratio = ratio.toString(5);

  /**
   * - Proportions
   */
  const _PORPORTION = {
    width,
    height,
    delimiter: proportion_delimiter,
    greatest_algorithm_type,
  };

  const { proportion_text, proportion_amount } = _aproximateAspectRatioText(
    _PORPORTION as any
  );

  // Display orientation
  const orientation: ORIENTATION_ENUM_KEYS = _safeOrientationByEnum(ratio);

  const _resolution = Formatter.formatResolutionString(width, height);

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
