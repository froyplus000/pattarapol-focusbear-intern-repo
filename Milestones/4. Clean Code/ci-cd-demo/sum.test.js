const { sum } = require("./sum");

describe("sum", () => {
  test("2 + 3 = 5", () => {
    expect(sum(2, 3)).toBe(5);
  });
  test("handles negatives", () => {
    expect(sum(-2, 7)).toBe(5);
  });
  test("works with zero", () => {
    expect(sum(0, 0)).toBe(0);
  });
});
