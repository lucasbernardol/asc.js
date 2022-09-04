import { assert, describe, it } from "vitest";

import { aspectToInteger } from "../dist";

describe("#Aspect-ratio suite. Run with dist/build JavaScript files.", () => {
  it("should be return '1.7777777777777777' on provided proportion 16:9.", () => {
    /**
     * - Resolution/aspect ratio: "16:9"
     */
    const expect: number = 1.7777777777777777;

    const sutWithDefualtDelimiter = aspectToInteger("16:9");

    const sutWithOtherDelimiter = aspectToInteger("16x9", {
      delimiter: "x",
      otherDelimiter: true,
    });

    assert.deepStrictEqual(sutWithDefualtDelimiter, expect);
    assert.deepStrictEqual(sutWithOtherDelimiter, expect);
  });

  it("should be return '2.3333333333333335' on provided proportion 21:9.", () => {
    /**
     * - Resolution/aspect ratio: "16:9"
     */
    const expect: number = 2.3333333333333335;

    const sutWithDefualtDelimiter = aspectToInteger("21:9");

    const sutWithOtherDelimiter = aspectToInteger("21x9", {
      delimiter: "x",
      otherDelimiter: true,
    });

    const sutWithOtherDashesDelimiter = aspectToInteger("21-9", {
      delimiter: "-",
      otherDelimiter: true,
    });

    assert.deepStrictEqual(sutWithDefualtDelimiter, expect);
    assert.deepStrictEqual(sutWithOtherDelimiter, expect);
    assert.deepStrictEqual(sutWithOtherDashesDelimiter, expect);
  });
});
