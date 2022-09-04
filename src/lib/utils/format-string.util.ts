//import { format } from "node:util";

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
