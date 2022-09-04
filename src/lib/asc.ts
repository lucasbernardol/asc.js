import {
  algorithmRef,
  GreatestCommonDivisorAlgorithmType,
} from "./mathematics/greatest-algorithm.math";

import { PROPORTION_DELIMITER } from "../constants/string.constants";
import { PROPORTION_REGULAR_EXPRESSION } from "../constants/regexp.constants";

import { parser } from "./utils/parser-options.util";
import { formatAspectRatio } from "./utils/format-string.util";
import { type } from "os";

/**
 * - Aproximate `aspect ratio` text.
 */
type AproximateAspectRatioTextOptions = {
  width: number;
  height: number;
  delimiter?: string;
  gcd_type: GreatestCommonDivisorAlgorithmType;
};

const APROXIMATE_BASE_OPTIONS: Partial<AproximateAspectRatioTextOptions> = {
  delimiter: PROPORTION_DELIMITER,
  gcd_type: "INTERATOR",
};

const _aproximateAspectRatioText = (
  options: AproximateAspectRatioTextOptions
) => {
  const { width, height, delimiter, gcd_type } =
    parser<AspectRatioStimatedOptions>(APROXIMATE_BASE_OPTIONS, options);

  const greatestDivisorFn = algorithmRef(gcd_type);

  const divisor = greatestDivisorFn(width, height);

  if (divisor === PERFECT_SQUARE_INT /* 1 */) {
    return SQUARE_PROPORTION.replace(
      PROPORTION_DELIMITER,
      () => delimiter as string
    );
  }

  //const left: number = width / divisor;
  //const right: number = height / divisor;

  return formatAspectRatio(
    width / divisor,
    height / divisor,
    delimiter as string
  );
};

/**
 * - Aspect ratio string `16:9` to ratio.
 */

type AspectRatioProportionOption = {
  otherDelimiter?: boolean;
  delimiter?: string;
};

export const aspectProportionToInteger = <Delimiter = string>(
  aspect: Delimiter,
  options: AspectRatioProportionOption = {}
): number | -1 => {
  const { otherDelimiter, delimiter } = parser<AspectRatioProportionOption>(
    {
      otherDelimiter: false,
      delimiter: PROPORTION_DELIMITER,
    },
    options
  );

  const matches: boolean = !otherDelimiter
    ? PROPORTION_REGULAR_EXPRESSION.test(aspect as any)
    : true;

  if (matches) {
    const aspects = (aspect as unknown as string).split(delimiter as string);

    const [width, height] = aspects.map((aspect) => parseInt(aspect, 10));

    return width / height;
  } else {
    return -1;
  }
};

export {};
