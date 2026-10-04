export function nextHoldoutStatus({ currentStatus = 'UNSEEN', result, toolChanged = false }) {
  if (currentStatus === 'UNSEEN') return result === 'PASS' ? 'REVEALED_PASS' : 'REVEALED_FAIL';
  if (currentStatus === 'REVEALED_FAIL' && toolChanged) return 'RETIRED';
  if (currentStatus === 'REVEALED_PASS' && toolChanged) return 'RETIRED';
  return currentStatus;
}
