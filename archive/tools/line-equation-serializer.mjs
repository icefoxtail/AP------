/**
 * Convert slope-intercept form y = mx + n to the general form
 * mx - y + n = 0.
 *
 * Keeping this conversion in one pure helper prevents callers from
 * re-deriving the constant term with the opposite sign.
 */
export function coefficientsFromSlopeIntercept(slope, intercept) {
  if (!Number.isFinite(slope) || !Number.isFinite(intercept)) {
    throw new TypeError("slope and intercept must be finite numbers");
  }
  return { a: slope, b: -1, c: intercept };
}

