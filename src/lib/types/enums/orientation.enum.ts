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
