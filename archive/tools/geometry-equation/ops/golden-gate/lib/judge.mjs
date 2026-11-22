// Verdicts of the golden gate. Pure functions: records in, verdicts out (no files, no browser).
//
// FAIL  : DIFFERENT (output or its published size fields changed), REGRESSED (rendered before, not now), NOT_RUN (could not be run)
// LIST  : FIXED (failed before, renders now), BOTH_FAIL_SAME (same code on both sides). Both stay in the denominator and are printed with their count.
// OK    : SAME (identical bytes)
// A change that was meant must be written in the --expected file, one line per item, with its reason.

export const FAIL_VERDICTS = new Set(['DIFFERENT', 'REGRESSED', 'NOT_RUN']);
export const LIST_VERDICTS = new Set(['FIXED', 'BOTH_FAIL_SAME']);
const rendered = r => r.status === 'ARCHIVE_BOUND';
const failed = r => r.status === 'FAILED';

export function compareItem(item, base, head) {
  const row = {item, base: brief(base), head: brief(head)};
  if (base.status === 'NOT_RUN' || head.status === 'NOT_RUN') return {...row, verdict: 'NOT_RUN', reason: `${base.status === 'NOT_RUN' ? 'base' : 'head'} could not be run: ${(base.status === 'NOT_RUN' ? base : head).detail ?? ''}`};
  if (rendered(base) && rendered(head)) {
    const why = [];
    if (base.svgSha !== head.svgSha) why.push(`svg bytes differ (${base.svgBytes} -> ${head.svgBytes} bytes)`);
    if (base.sizeClass !== head.sizeClass) why.push(`sizeClass ${base.sizeClass} -> ${head.sizeClass}`);
    if ((base.solutionImageScale ?? null) !== (head.solutionImageScale ?? null)) why.push(`solutionImageScale ${base.solutionImageScale} -> ${head.solutionImageScale}`);
    return why.length ? {...row, verdict: 'DIFFERENT', reason: why.join('; ')} : {...row, verdict: 'SAME'};
  }
  if (rendered(base) && failed(head)) return {...row, verdict: 'REGRESSED', reason: `renders on base, fails on head: ${head.code ?? head.stage ?? '?'} ${head.detail ?? ''}`.slice(0, 300)};
  if (rendered(base)) return {...row, verdict: 'REGRESSED', reason: `renders on base, head status is ${head.status}`};
  if (failed(base) && rendered(head)) return {...row, verdict: 'FIXED', reason: `failed on base (${base.code ?? base.stage ?? '?'}), renders on head`};
  if (failed(base) && failed(head)) {
    return (base.code ?? null) === (head.code ?? null)
      ? {...row, verdict: 'BOTH_FAIL_SAME', reason: `both fail with ${base.code ?? base.stage ?? '?'}`}
      : {...row, verdict: 'DIFFERENT', reason: `failure code changed: ${base.code} -> ${head.code}`};
  }
  // EXEMPT / UNSUPPORTED author decisions: the status (and its reason) must stay
  if (base.status === head.status && (base.detail ?? '') === (head.detail ?? '')) return {...row, verdict: 'SAME'};
  return {...row, verdict: 'DIFFERENT', reason: `status ${base.status} -> ${head.status}`};
}
const brief = r => ({status: r.status, code: r.code ?? null, stage: r.stage ?? null, svgSha: r.svgSha ? r.svgSha.slice(0, 12) : null, svgBytes: r.svgBytes ?? 0, sizeClass: r.sizeClass ?? null});

// --expected file: `<item> <DIFFERENT|FIXED|REGRESSED> <reason>` per line (# comments and blank lines ignored). The reason is required.
export function parseExpected(text) {
  const entries = [], errors = [];
  text.split(/\r?\n/).forEach((raw, n) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;
    const m = line.match(/^(\S+)\s+(DIFFERENT|FIXED|REGRESSED)\s+(.+)$/);
    if (!m) { errors.push(`expected file line ${n + 1} needs "<item> <DIFFERENT|FIXED|REGRESSED> <reason>": ${line.slice(0, 80)}`); return; }
    if (m[3].trim().length < 10) { errors.push(`expected file line ${n + 1}: the reason for ${m[1]} is too short (write what changed and why, at least 10 characters)`); return; }
    if (entries.some(e => e.item === m[1])) { errors.push(`expected file line ${n + 1}: ${m[1]} is listed twice`); return; }
    entries.push({item: m[1], verdict: m[2], reason: m[3].trim()});
  });
  return {entries, errors};
}

export function applyExpected(rows, expected) {
  const errors = [...expected.errors];
  const byItem = new Map(rows.map(r => [r.item, r]));
  const accepted = [];
  for (const e of expected.entries) {
    const row = byItem.get(e.item);
    if (!row) { errors.push(`expected item ${e.item} was not part of this run`); continue; }
    if (row.verdict === 'SAME') { errors.push(`expected change in ${e.item} (${e.reason}) but its output did not change`); continue; }
    if (row.verdict !== e.verdict) { errors.push(`expected ${e.verdict} for ${e.item} but it is ${row.verdict}: ${row.reason}`); continue; }
    row.accepted = e.reason;
    accepted.push({item: e.item, verdict: e.verdict, reason: e.reason});
  }
  return {accepted, errors};
}

export function summarize(rows, {accepted = [], errors = []} = {}) {
  const counts = {};
  for (const r of rows) counts[r.verdict] = (counts[r.verdict] ?? 0) + 1;
  const unaccepted = rows.filter(r => FAIL_VERDICTS.has(r.verdict) && !r.accepted);
  return {
    total: rows.length, counts, accepted, expectedErrors: errors,
    failures: unaccepted, listed: rows.filter(r => LIST_VERDICTS.has(r.verdict)),
    pass: unaccepted.length === 0 && errors.length === 0 && rows.length > 0
  };
}
