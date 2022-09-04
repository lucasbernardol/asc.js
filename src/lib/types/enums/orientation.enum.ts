/**
 * Global types
 */
export enum Orientation {
  "LANDSCAPE" = "LANDSCAPE", // paisagem
  "PORTRAIT" = "PORTRAIT", // retrato
  "UNKNOWN" = "UNKNOWN",
}

export type OrientationEnumKeys = keyof typeof Orientation;

export const ORIENTATION_ENUM_ACCESS = (key: OrientationEnumKeys): string =>
  Orientation[key];
