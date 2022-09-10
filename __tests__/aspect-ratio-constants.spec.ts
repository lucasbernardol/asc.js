import { describe, expect, it } from 'vitest';

import { PROPORTION_DELIMITER } from '../dist/lib/constants';

describe('#Aspect-ratio suite with dist/build .JS files.', () => {
  it('should be able compare "PROPROTION_DELIMITER" with: ":".', () => {
    const _EXPECTED: string = ':'; // "16:9"

    expect(PROPORTION_DELIMITER).toStrictEqual(_EXPECTED);
  });
});
