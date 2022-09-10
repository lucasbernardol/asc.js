import util from 'node:util';

// formating
export const formatAspectRatioText = (
  w: number,
  h: number,
  d: string
): string => {
  return `${w}${d}${h}`;
};

export const formatResolutionString = (w: number, h: number) => `${w}x${h}`;

export const formatPixelsString = (pixels: number): string => `${pixels}px`;

export const _unitFormatter = (left: unknown, right: unknown) =>
  util.format('%s %s', left, right);
