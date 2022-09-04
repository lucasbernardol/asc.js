import { assert, describe, it } from "vitest";

import { aspectProportionToInteger } from "../dist";

describe("#Aspect-ratio suite. Run with dist/build JavaScript files.", () => {
  it("should be return '1.7777777777777777' on provided proportion 16:9.", () => {
    /**
     * - Resolution/aspect ratio: "16:9"
     */
    const expect: number = 1.7777777777777777;

    const sutWithDefualtDelimiter = aspectProportionToInteger("16:9");

    const sutWithOtherDelimiter = aspectProportionToInteger("16x9", {
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

    const sutWithDefualtDelimiter = aspectProportionToInteger("21:9");

    const sutWithOtherDelimiter = aspectProportionToInteger("21x9", {
      delimiter: "x",
      otherDelimiter: true,
    });

    const sutWithOtherDashesDelimiter = aspectProportionToInteger("21-9", {
      delimiter: "-",
      otherDelimiter: true,
    });

    assert.deepStrictEqual(sutWithDefualtDelimiter, expect);
    assert.deepStrictEqual(sutWithOtherDelimiter, expect);
    assert.deepStrictEqual(sutWithOtherDashesDelimiter, expect);
  });
});
