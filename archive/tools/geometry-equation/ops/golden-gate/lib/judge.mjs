// Verdicts of the golden gate. Pure functions: records in, verdicts out (no files, no browser).
//
// The gate asks one question (owner, 2026-11-24: "block only what breaks the student's screen"): did this change break a figure a student sees?
// FAIL  : REGRESSED (drew before, the head cannot: a cut-off, the phone 390px check, a finding the publication score blocks), CLIPPED (a figure the head still draws has a label or
//         shape outside its frame that the base figure did not have), NOT_RUN (could not be run or trusted: crash, timeout, measurement failure, environment error)
// LIST  : DIFFERENT (bytes or the failure changed: a change is not a defect, it is printed and shown side by side for a person to look at), MINOR (the head only has findings the
//         publication score still passes), FIXED, BOTH_FAIL_SAME, ADDED, REMOVED. They all stay in the denominator and are printed with their count.
// OK    : SAME (identical bytes)
// --expected only annotates: a line naming a changed item marks it as meant; it never makes the gate fail.
//
// A failure is only "the same" when it can be identified: code, stage and the chain of nested statuses must all match, and a failure
// without a code is never the same as another one. An environment error (page, image or module did not load, browser, timeout) is the
// machine's, not the engine's: it is NOT_RUN even when both sides show it, because then nothing about the engine was compared.
// A gate that compared no bytes at all vouches for nothing (see evaluate()).

export const FAIL_VERDICTS = new Set(['REGRESSED', 'CLIPPED', 'NOT_RUN']);
export const LIST_VERDICTS = new Set(['DIFFERENT', 'MINOR', 'FIXED', 'BOTH_FAIL_SAME', 'ADDED', 'REMOVED']);
import {scoreResult} from '../../score/score.mjs';
const rendered = r => r.status === 'ARCHIVE_BOUND';
const failed = r => r.status === 'FAILED';

// Load/launch errors of the page, an image, a module or the browser, and the machine's timeouts.
export const ENV_ERROR = /QUESTION_IMAGE_LOAD_FAILED|IMAGE_LOAD|PAGE_RENDER_ERROR|ERR_MODULE_NOT_FOUND|MODULE_NOT_FOUND|Cannot find module|Cannot find package|ENOENT|EACCES|EPERM|EMFILE|ENOMEM|PLAYWRIGHT_REQUIRED|DEPENDENCY_HASH_MISMATCH|browserType\.launch|Executable doesn't exist|Failed to launch|net::ERR_|Navigation (failed|timeout)|page\.goto|SVG_MISSING|WORKER_TIMEOUT|WORKER_EXIT|WORKER_CANCELLED|Timeout \d+ms|timeout .*exceeded|ETIMEDOUT|ECONNRESET|Target (page|context|browser).*closed|browser has been closed/i;
// The page rejected the content itself (a formula MathJax cannot typeset): the same on every machine, so an engine/plan verdict, not the machine's.
// It carries its own marker in the failure signature below. Every other page render error stays an environment error.
// Only that exact token is set aside: a second page error in the same text still counts.
const CONTENT_PAGE_ERROR = /ARCHIVE_PAGE_RENDER_ERROR:MATH_TYPESET_ERROR\b/g;
export const envErrorInText = text => String(text ?? '').replace(CONTENT_PAGE_ERROR, '').match(ENV_ERROR)?.[0] ?? null;
export const envErrorOf = r => {
  if (!failed(r)) return null;
  const text = `${r.code ?? ''} ${r.detailFull ?? ''} ${r.detail ?? ''}`;
  if (r.envError && r.envError !== 'PAGE_RENDER_ERROR') return r.envError; // a stored marker (SVG_MISSING and the like)
  return envErrorInText(text); // PAGE_RENDER_ERROR (also stored) is judged again from the text: a typeset error is content
};
export const isInfraFailure = r => envErrorOf(r) !== null;

// The nested "status" values of a failure, outermost first: COMPOSITE_PANEL_NOT_COMPOSED > NUMBER_LINE_LABEL_TOO_LARGE.
export const statusChainOf = text => [...String(text ?? '').matchAll(/"status":"([A-Za-z0-9_:.\-]+)"/g)].slice(0, 6).map(m => m[1]);
export const failureSignature = r => {
  if (!failed(r) || !r.code) return null; // a failure that carries no code cannot be told from another
  const chain = r.statusChain ?? statusChainOf(r.detailFull ?? r.detail);
  const page = String(r.detailFull ?? r.detail ?? '').match(/ARCHIVE_PAGE_RENDER_ERROR:([A-Z_]+)/)?.[1];
  return `${r.code}|${r.stage ?? ''}|${chain.join('>')}${page ? `|page:${page}` : ''}`;
};

// What a failed head means for a student. A cut-off (a label or shape outside the frame, the phone 390px check) always breaks; anything else is judged by the publication
// score (ops/score): findings it still passes (labels a little close, ...) are MINOR, a block, a failed score or a measurement it cannot judge is a break.
const CLIP_CLASS = /CLIP|OUT_OF_BOUNDS|OUTSIDE|OVERFLOW|VIEWPORT|CUT_OFF|PHONE_DISPLAY/i;
export function headBreak(r) {
  const codes = [r.code, ...(r.statusChain ?? statusChainOf(r.detailFull ?? r.detail))].filter(Boolean);
  if (codes.some(c => CLIP_CLASS.test(c))) return {breaks: true, why: 'cut-off', code: r.code};
  let verdict = 'INDETERMINATE';
  try { verdict = scoreResult({status: 'FAILED', code: r.code, detail: r.detailFull ?? r.detail}, {hasSvg: true}).verdict; } catch { /* a result the scorer cannot read is not a pass */ }
  return verdict === 'PASS' ? {breaks: false, why: 'minor', code: r.code} : {breaks: true, why: verdict === 'INDETERMINATE' ? 'measure' : 'render', code: r.code, score: verdict};
}

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
    // a label or shape outside the frame that the base figure did not have (clip signatures are made at render time, lib/clip.mjs)
    const newClips = (head.clip ?? []).filter(c => !(base.clip ?? []).includes(c));
    if (newClips.length) return {...row, verdict: 'CLIPPED', reason: `the head figure has ${newClips.length} label(s)/shape(s) outside its frame that the base figure did not: ${newClips.slice(0, 3).join(' | ')}`};
    if (base.svgSha !== head.svgSha) why.push(`svg bytes differ (${base.svgBytes} -> ${head.svgBytes} bytes)`);
    if (base.sizeClass !== head.sizeClass) why.push(`sizeClass ${base.sizeClass} -> ${head.sizeClass}`);
    if ((base.solutionImageScale ?? null) !== (head.solutionImageScale ?? null)) why.push(`solutionImageScale ${base.solutionImageScale} -> ${head.solutionImageScale}`);
    return why.length ? {...row, verdict: 'DIFFERENT', reason: why.join('; ')} : {...row, verdict: 'SAME'};
  }
  if (rendered(base) && failed(head)) {
    const b = headBreak(head);
    const text = `renders on base, fails on head (${b.why}${b.score ? ' ' + b.score : ''}): ${head.code ?? head.stage ?? '?'} ${head.detail ?? ''}`.slice(0, 300);
    return {...row, verdict: b.breaks ? 'REGRESSED' : 'MINOR', reason: text, breakKind: b.why};
  }
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
// reused: the head side is the base result reused (identical render inputs): nothing was compared, whatever the rows say.
export function evaluate(rows, {kinds = new Set(), kindOf = () => new Set(), reused = false} = {}) {
  const byteCompared = reused ? 0 : rows.filter(bytesCompared).length;
  const notCovered = [];
  for (const k of kinds) if (!rows.filter(r => kindOf(r.item).has(k)).some(bytesCompared)) notCovered.push(k);
  const wholeUncovered = [];
  if (!kinds.size) {
    const all = new Set(); for (const r of rows) for (const k of kindOf(r.item)) all.add(k);
    for (const k of all) if (!rows.filter(r => kindOf(r.item).has(k)).some(bytesCompared)) wholeUncovered.push(k);
  }
  return {selected: rows.length, byteCompared, notCovered, wholeUncovered, cannotVouch: rows.length > 0 && (byteCompared === 0 || notCovered.length > 0)};
}

// --expected file (optional, annotation only): `<item> <DIFFERENT|FIXED|REGRESSED|REMOVED|MINOR|CLIPPED> <reason>` per line (# comments and blank lines ignored). The reason is required.
// A line that does not match the run is printed as a note ("EXPECTED-FILE NOTE"); it never fails the gate. Naming a REGRESSED/CLIPPED item does not excuse it.
export function parseExpected(text) {
  const entries = [], errors = [];
  text.split(/\r?\n/).forEach((raw, n) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;
    const m = line.match(/^(\S+)\s+(DIFFERENT|FIXED|REGRESSED|REMOVED|MINOR|CLIPPED)\s+(.+)$/);
    if (!m) { errors.push(`expected file line ${n + 1} needs "<item> <DIFFERENT|FIXED|REGRESSED|REMOVED|MINOR|CLIPPED> <reason>": ${line.slice(0, 80)}`); return; }
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
  const failures = rows.filter(r => FAIL_VERDICTS.has(r.verdict));
  const byteCompared = rows.filter(bytesCompared).length;
  return {
    total: rows.length, byteCompared, counts, accepted, expectedErrors: errors,
    failures, listed: rows.filter(r => LIST_VERDICTS.has(r.verdict)),
    pass: failures.length === 0
  };
}

// A golden item only the base has (the denominator shrank) and an item only the head has (nothing to compare it with) are listed; neither is a broken figure.
export const removedRow = item => ({item, base: {status: 'PRESENT'}, head: {status: 'ABSENT'}, verdict: 'REMOVED', reason: 'the golden item exists on base but not on head (the denominator shrank)'});
export const addedRow = (item, head) => ({item, base: {status: 'ABSENT'}, head: {status: head?.status ?? 'ABSENT'}, verdict: 'ADDED', reason: `new golden item, nothing on base to compare with (head: ${head?.status ?? 'not rendered'}${head?.code ? ' ' + head.code : ''})`});

// A lost engine test (passed on base, skipped or gone on head) fails like a new failure.
export const testsFail = cmp => cmp.newFailures.length > 0 || cmp.lost.length > 0;

// The one place that decides the exit code (2026-11-24: only a figure the student sees broken fails).
//   exit 1 FAIL       : a REGRESSED / CLIPPED / NOT_RUN row (verdicts above)
//   exit 2 CANNOT_RUN : an explicit selection that is empty (a usage error). Missing dependencies and unknown --families words are checked by the caller.
//   exit 0 UNAFFECTED : nothing was compared: nothing the render reads changed, no golden item is related to the change, or base and head render from identical inputs
//   exit 0 PASS       : the selected items were rendered and nothing broke. DIFFERENT is printed, never a failure; "no byte comparison for a kind" is a printed note
export function decide({rows, summary, changedCount = 0, allChangesIgnored = false, explicitSelection = false, reusedHead = false}) {
  if (summary.failures.length) return {exit: 1, outcome: 'FAIL', reason: 'a figure breaks'};
  if (!rows.length) {
    if (explicitSelection) return {exit: 2, outcome: 'CANNOT_RUN', reason: 'the selection is empty'};
    return {exit: 0, outcome: 'UNAFFECTED', reason: changedCount === 0 ? 'base and head do not differ' : allChangesIgnored ? 'every changed file is outside the render' : 'no golden item is related to the change'};
  }
  if (reusedHead) return {exit: 0, outcome: 'UNAFFECTED', reason: 'base and head have identical render inputs: the head result is the base result'};
  return {exit: 0, outcome: 'PASS', reason: summary.byteCompared ? 'nothing broke' : 'nothing broke (no figure was drawn on both sides)'};
}
