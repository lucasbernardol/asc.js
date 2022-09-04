// formating
export const formatAspectRatio = (w: number, h: number, d: string) =>
  `${w}${d}${h}`;

export const formatResolutionString = (w: number, h: number) => `${w}x${h}`;

export const formatPixelsString = (pixels: number): string => `${pixels}px`;
