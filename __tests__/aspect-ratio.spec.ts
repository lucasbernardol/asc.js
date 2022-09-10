import { describe, expect, it } from 'vitest';

import { aspectToInteger, ratio } from '../dist';

describe('#Aspect-ratio suite. Run with dist/build JavaScript files.', () => {
  it('should be able return "1.7777777777777777" in the given ratio: 16:9.', () => {
    const expected: number = 1.7777777777777777;

    const sutWithDefualtDelimiter = aspectToInteger('16:9');

    const sutWithOtherDelimiter = aspectToInteger('16x9', {
      delimiter: 'x',
      another_delimiter: true,
    });

    expect(sutWithDefualtDelimiter).toStrictEqual(expected);
    expect(sutWithOtherDelimiter).toStrictEqual(expected);
  });

  it('should be able return "2.3333333333333335" in the given ratio: 21:9.', () => {
    const expected: number = 2.3333333333333335;

    const sutWithDefualtDelimiter = aspectToInteger('21:9');

    const sutWithOtherDelimiter = aspectToInteger('21-9', {
      delimiter: '-',
      another_delimiter: true,
    });

    expect(sutWithDefualtDelimiter).toStrictEqual(expected);
    expect(sutWithOtherDelimiter).toStrictEqual(expected);
  });
});
