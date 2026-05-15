export function normalizeBranch(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'cmath' || raw === 'cma' || raw === 'cmath-elementary') return 'cmath';
  if (raw === 'eie') return 'eie';
  return 'apmath';
}
