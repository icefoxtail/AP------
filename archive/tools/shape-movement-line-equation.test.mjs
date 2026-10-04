import assert from "node:assert/strict";
import { coefficientsFromSlopeIntercept } from "./line-equation-serializer.mjs";

const cases = [
  { slope: 2, intercept: -1, point: [0, -1], expected: { a: 2, b: -1, c: -1 } },
  { slope: 2, intercept: 3, point: [0, 3], expected: { a: 2, b: -1, c: 3 } },
  { slope: 2, intercept: -5, point: [0, -5], expected: { a: 2, b: -1, c: -5 } },
  { slope: 2, intercept: 2, point: [0, 2], expected: { a: 2, b: -1, c: 2 } },
];

for (const { slope, intercept, point, expected } of cases) {
  const actual = coefficientsFromSlopeIntercept(slope, intercept);
  assert.deepEqual(actual, expected, `coefficient conversion failed for y=2x${intercept < 0 ? intercept : `+${intercept}`}`);
  const residual = actual.a * point[0] + actual.b * point[1] + actual.c;
  assert.equal(residual, 0, `point residual failed for y=2x${intercept < 0 ? intercept : `+${intercept}`}`);
}

assert.throws(() => coefficientsFromSlopeIntercept(Number.NaN, 0), TypeError);
assert.throws(() => coefficientsFromSlopeIntercept(2, Number.POSITIVE_INFINITY), TypeError);
console.log(`PASS: ${cases.length} slope-intercept conversions and point residuals`);

