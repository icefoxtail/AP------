/**
 * Foundation-only helpers for later Wangji Education integration phases.
 * This file is intentionally not loaded by index.html in phase 1.
 */

function wangjiNormalizeBranch(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (raw === 'cmath' || raw === 'cma' || raw === 'cmath-elementary') return 'cmath';
    if (raw === 'eie') return 'eie';
    return 'apmath';
}

function wangjiTimeToMinutes(value) {
    const parts = String(value || '').split(':').map(Number);
    if (!Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) return null;
    return parts[0] * 60 + parts[1];
}

function wangjiIsTimeOverlap(aStart, aEnd, bStart, bEnd) {
    const as = wangjiTimeToMinutes(aStart);
    const ae = wangjiTimeToMinutes(aEnd);
    const bs = wangjiTimeToMinutes(bStart);
    const be = wangjiTimeToMinutes(bEnd);
    if ([as, ae, bs, be].some(v => v === null)) return false;
    return as < be && bs < ae;
}

function wangjiBuildConflictKey(conflict) {
    return [
        conflict?.conflict_type || '',
        conflict?.target_id || '',
        conflict?.class_a_id || '',
        conflict?.class_b_id || '',
        conflict?.day_of_week || '',
        conflict?.overlap_start || '',
        conflict?.overlap_end || ''
    ].join('|');
}
