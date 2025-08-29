// sum.js
function sum(a, b) {
  if (
    typeof a !== "number" ||
    typeof b !== "number" ||
    !Number.isFinite(a) ||
    !Number.isFinite(b)
  ) {
    throw new TypeError("sum expects finite numbers");
  }
  return a + b;
}

module.exports = { sum };
