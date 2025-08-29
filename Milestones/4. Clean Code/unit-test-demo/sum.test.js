// sum.test.js
const { sum } = require("./sum");

describe("sum", () => {
  test("adds 2 + 3 = 5", () => {
    expect(sum(2, 3)).toBe(5);
  });

  test("handles negatives", () => {
    expect(sum(-2, 7)).toBe(5);
  });

  test("works with zero", () => {
    expect(sum(0, 0)).toBe(0);
  });

  test("rejects non-numbers", () => {
    expect(() => sum("2", 3)).toThrow(TypeError);
  });

  test("rejects NaN/Infinity", () => {
    expect(() => sum(NaN, 1)).toThrow();
    expect(() => sum(Infinity, 1)).toThrow();
  });
});
