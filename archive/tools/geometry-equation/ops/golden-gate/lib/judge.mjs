// Verdicts of the golden gate. Pure functions: records in, verdicts out (no files, no browser).
//
// FAIL  : DIFFERENT (output or its published size fields changed), REGRESSED (rendered before, not now), NOT_RUN (could not be run or could not be trusted)
// LIST  : FIXED (failed before, renders now), BOTH_FAIL_SAME (the very same failure on both sides). Both stay in the denominator and are printed with their count.
// OK    : SAME (identical bytes)
// A change that was meant must be written in the --expected file, one line per item, with its reason.
//
// A failure is only "the same" when it can be identified: code, stage and the chain of nested statuses must all match, and a failure
// without a code is never the same as another one. An environment error (page, image or module did not load, browser, timeout) is the
// machine's, not the engine's: it is NOT_RUN even when both sides show it, because then nothing about the engine was compared.
// A gate that compared no bytes at all vouches for nothing (see evaluate()).

export const FAIL_VERDICTS = new Set(['DIFFERENT', 'REGRESSED', 'NOT_RUN']);
export const LIST_VERDICTS = new Set(['FIXED', 'BOTH_FAIL_SAME']);
const rendered = r => r.status === 'ARCHIVE_BOUND';
const failed = r => r.status === 'FAILED';

// Load/launch errors of the page, an image, a module or the browser, and the machine's timeouts.
export const ENV_ERROR = /QUESTION_IMAGE_LOAD_FAILED|IMAGE_LOAD|PAGE_RENDER_ERROR|ERR_MODULE_NOT_FOUND|MODULE_NOT_FOUND|Cannot find module|Cannot find package|ENOENT|EACCES|EPERM|EMFILE|ENOMEM|PLAYWRIGHT_REQUIRED|DEPENDENCY_HASH_MISMATCH|browserType\.launch|Executable doesn't exist|Failed to launch|net::ERR_|Navigation (failed|timeout)|page\.goto|SVG_MISSING|WORKER_TIMEOUT|WORKER_EXIT|WORKER_CANCELLED|Timeout \d+ms|timeout .*exceeded|ETIMEDOUT|ECONNRESET|Target (page|context|browser).*closed|browser has been closed/i;
export const envErrorOf = r => {
  if (!failed(r)) return null;
  const m = `${r.code ?? ''} ${r.detailFull ?? ''} ${r.detail ?? ''}`.match(ENV_ERROR);
  return r.envError ?? (m ? m[0] : null);
};
export const isInfraFailure = r => envErrorOf(r) !== null;

// The nested "status" values of a failure, outermost first: COMPOSITE_PANEL_NOT_COMPOSED > NUMBER_LINE_LABEL_TOO_LARGE.
export const statusChainOf = text => [...String(text ?? '').matchAll(/"status":"([A-Za-z0-9_:.\-]+)"/g)].slice(0, 6).map(m => m[1]);
export const failureSignature = r => {
  if (!failed(r) || !r.code) return null; // a failure that carries no code cannot be told from another
  const chain = r.statusChain ?? statusChainOf(r.detailFull ?? r.detail);
  return `${r.code}|${r.stage ?? ''}|${chain.join('>')}`;
};

export function compareItem(item, base, head) {
  const row = {item, base: brief(base), head: brief(head)};
  const notRun = reason => ({...row, verdict: 'NOT_RUN', reason});
  if (base.status === 'NOT_RUN' || head.status === 'NOT_RUN') return notRun(`${base.status === 'NOT_RUN' ? 'base' : 'head'} could not be run: ${(base.status === 'NOT_RUN' ? base : head).detail ?? ''}`);
  for (const [side, r] of [['base', base], ['head', head]]) {
    const env = envErrorOf(r);
    if (env) return notRun(`${side} environment error (${env}): ${r.code ?? ''} - not an engine verdict, compared nothing`);
  }
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
    const a = failureSignature(base), b = failureSignature(head);
    if (a === null || b === null) return notRun(`a failure without a code (${base.code ?? 'null'} / ${head.code ?? 'null'}) cannot be told from another failure`);
    return a === b
      ? {...row, verdict: 'BOTH_FAIL_SAME', reason: `both fail with ${a}`}
      : {...row, verdict: 'DIFFERENT', reason: `failure changed: ${a} -> ${b}`};
  }
  // EXEMPT / UNSUPPORTED author decisions: the status (and its reason) must stay
  if (base.status === head.status && (base.detail ?? '') === (head.detail ?? '')) return {...row, verdict: 'SAME'};
  return {...row, verdict: 'DIFFERENT', reason: `status ${base.status} -> ${head.status}`};
}
const brief = r => ({status: r.status, code: r.code ?? null, stage: r.stage ?? null, svgSha: r.svgSha ? r.svgSha.slice(0, 12) : null, svgBytes: r.svgBytes ?? 0, sizeClass: r.sizeClass ?? null});

// A row is a byte comparison only when both sides produced an SVG.
export const bytesCompared = row => row.base.status === 'ARCHIVE_BOUND' && row.head.status === 'ARCHIVE_BOUND' && (row.verdict === 'SAME' || row.verdict === 'DIFFERENT');

// What the run vouches for. kinds: the kinds a changed file selected (empty for a whole-set or explicit run); kindOf(item) -> Set of kinds.
// exitCode 2 = cannot vouch (nothing compared, or a changed kind had no byte comparison): not a pass, not a plain failure.
export function evaluate(rows, {kinds = new Set(), kindOf = () => new Set()} = {}) {
  const byteCompared = rows.filter(bytesCompared).length;
  const notCovered = [];
  for (const k of kinds) if (!rows.filter(r => kindOf(r.item).has(k)).some(bytesCompared)) notCovered.push(k);
  const wholeUncovered = [];
  if (!kinds.size) {
    const all = new Set(); for (const r of rows) for (const k of kindOf(r.item)) all.add(k);
    for (const k of all) if (!rows.filter(r => kindOf(r.item).has(k)).some(bytesCompared)) wholeUncovered.push(k);
  }
  return {selected: rows.length, byteCompared, notCovered, wholeUncovered, cannotVouch: rows.length > 0 && (byteCompared === 0 || notCovered.length > 0)};
}

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
  const byteCompared = rows.filter(bytesCompared).length;
  return {
    total: rows.length, byteCompared, counts, accepted, expectedErrors: errors,
    failures: unaccepted, listed: rows.filter(r => LIST_VERDICTS.has(r.verdict)),
    pass: unaccepted.length === 0 && errors.length === 0 && byteCompared > 0
  };
}
