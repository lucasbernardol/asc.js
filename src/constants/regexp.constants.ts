/**
 * - Constants
 */

// https://regex101.com/r/P3Sqa9/1
export const RESOLUTION_REGULAR_EXPRESSION =
  /(?<resolution>(?<width>^[\d]{1,8})x(?<height>[\d]{1,8}$))/i;

export const PROPORTION_REGULAR_EXPRESSION =
  /(?<screen_proportion>^(?<width>\d{1,3}):(?<height>\d{1,3})$)/i;
