import { assert, describe, it } from "vitest";

import { PROPORTION_DELIMITER } from "../dist/constants/string.constants";

describe("#Aspect-ratio suite with dist/build .JS files.", () => {
  it("should be compare aspect-ration #PROPROTION_DELIMITER constant.", () => {
    const expected: string = ":"; // "16:9"

    assert.deepEqual(PROPORTION_DELIMITER, expected);
  });
});
