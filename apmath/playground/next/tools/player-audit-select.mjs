// Future audits start here: reuse verified unchanged primary-mobile contracts,
// then append an explicit risk list. Never infer visual or continuous-play PASS.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import readline from 'node:readline';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const CONTRACT = 'native-seek-restore-v1', NATIVE = 'native-single-pass-v1';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const HELP = `Usage: node player-audit-select.mjs --inventory CURRENT.json --baseline BASELINE.json --out TARGETS.json
  [--view 390x844] [--risk MANUAL_TARGETS.json] [--require-seek] | --self-test | --help

BASELINE schemaVersion:1 (all referenced paths resolve relative to BASELINE):
{
  "schemaVersion":1,
  "inventory":{"file":"saved-inventory.json","sha256":"64 hex chars"},
  "artifacts":{"s0":{
    "rows":{"file":"shard0/units.jsonl","sha256":"64 hex chars"},
    "summary":{"file":"shard0/summary.json","sha256":"64 hex chars"}
  }},
  "units":[{"key":"LAB/SCENE/0","view":"390x844","dimensions":{"browser":{
    "status":"PASS","fingerprint":"saved unit browser fingerprint",
    "contract":"native-seek-restore-v1","artifact":"s0",
    "rowKey":"LAB:SCENE@NATIVE_GROUP_INDEX:0:390x844","rowLine":1
  }}}]
}
rowLine is optional when rowKey is unique; otherwise it is the physical 1-based JSONL line.
For retained native-single-pass-v1, artifact has nativeReport (bound JSON extracted
from the original artifact) instead of rows, plus summary (bound Git-source receipt).
summary.sourceSha must equal nativeReport.source; summary.sourceFiles has the same
per-lab sourceFiles/sha256 shape above. rowKey is LAB/SCENE/0. This legacy adapter
supports only the original ALL_NEW_SCENES_NATIVE_ONE_CLICK_SINGLE_PASS contract at 390x844.
The adapter validates actual PASS checks, full recorded seek plan, finish/restore,
identity/viewport and raw source closure against the SHA-bound saved inventory.
Missing/corrupt/unbound data, changed fingerprints and FAIL/REVIEW_REQUIRED stay NOT_RUN targets.
Default scope is 390x844 only. --view requires separate proof for that viewport.
--risk accepts {targets:[...]} in player-fast-audit format and appends explicit
additional viewports, capture/playback/normalPlayback samples; it cannot remove targets.
An empty targets array means no browser invocation is needed. Verified unchanged
native-single-pass evidence is retained as REUSED_VERIFIED_PRIOR_NATIVE_SCOPE,
never promoted to seek/visual PASS. Its stronger-contract debt is optional; only
--require-seek selects it for upgrading. This preserves the 87 earlier native-only
function scenes instead of gratuitously rerunning their accepted overall scope.
This selector does not certify independent visual quality, reading pace, or current external CDN bytes.
`;
const requiredChecks = ['initial player idle and answer unrevealed', 'one entry button per valid lesson',
  'native finish shows end card', 'close restores idle/explore, releases lesson state and pins',
  'restored parameters and sliders valid', 'no page runtime/resource/invalid-script errors'];
function contractValid(r) {
  const checks = new Map((r.checks || []).map(c => [c.name, c.status]));
  return r.status === 'PASS' && Number.isFinite(Date.parse(r.finishedAt)) && r.initial?.state?.player === 'idle' && r.final?.state?.player === 'ended' && r.restore?.state === 'idle'
    && r.restore.tab === 'explore' && r.restore.raf === 0 && r.restore.pins === 0 && !r.restore.bad?.length && !r.restore.mismatch?.length
    && !r.restore.dragging && r.restore.lessonOn === undefined && !r.restore.videoClass
    && r.checks?.length > 0 && r.checks.every(c => c.status === 'PASS') && requiredChecks.every(c => checks.get(c) === 'PASS')
    && r.samplePlan?.length >= 2 && r.samples?.length === r.samplePlan.length
    && ['initial', 'last-frame-before-finish'].every(reason => r.samplePlan.some(p => p.reasons?.includes(reason)))
    && r.samplePlan.every((p, i) => Number.isFinite(p.time) && r.samples[i].time === p.time
      && r.samples[i].method === 'NATIVE_SEEK_FROZEN_QA_CLOCK' && r.samples[i].frame
      && checks.get(`t=${p.time}: rendered state remains bound to native timeline`) === 'PASS');
}
function nativeValid(report, r) {
  const check = name => r.checks?.find(c => c.name === name), entry = check('idle entry with one native lesson and concealed answer')?.evidence;
  const advance = check('native playback advances with a caption')?.evidence, ended = check('one click reaches native ended state')?.evidence;
  const reset = check('reset returns both the values and view')?.evidence;
  return report.version === 1 && report.status === 'PASS' && /^[a-f0-9]{40}$/i.test(report.source || '') && !report.fatalError && Number.isFinite(Date.parse(report.finishedAt))
    && report.scope === 'ALL_NEW_SCENES_NATIVE_ONE_CLICK_SINGLE_PASS' && r.status === 'PASS' && r.checks?.length > 0 && r.checks.every(c => c.status === 'PASS')
    && entry?.state === 'idle' && entry.lessons === 1 && entry.revealed === false && entry.overflow === false && entry.canvas?.width === 390
    && advance?.state === 'playing' && advance.time > 0 && advance.caption?.trim()
    && ended?.state === 'ended' && ended.time > 0 && Number.isInteger(ended.maxStep) && ended.maxStep >= 0 && ended.step === ended.maxStep && ended.answerVisible === true && !ended.errors?.length
    && check('last step and mathematical invariants hold')?.status === 'PASS' && check('native final answer is visible')?.status === 'PASS'
    && reset?.matches === true && reset.step === 0 && reset.zoom === 1 && check('no runtime errors')?.status === 'PASS'
    && Array.isArray(check('no runtime errors').evidence) && check('no runtime errors').evidence.length === 0;
}

export async function selectAudit({ inventory, baselineFile, view = '390x844', riskTargets = [], requireSeek = false }) {
  if (inventory.errors?.length || !Array.isArray(inventory.units)) throw Error('Current inventory must be complete and error-free.');
  const dir = path.dirname(path.resolve(baselineFile)), cache = new Map();
  async function bound(ref, jsonl = false) {
    if (!ref?.file || !/^[a-f0-9]{64}$/i.test(ref.sha256 || '')) throw Error('MISSING_BOUND_REFERENCE');
    const file = path.resolve(dir, ref.file), key = `${file}:${ref.sha256}:${jsonl}`;
    if (!cache.has(key)) cache.set(key, (async () => {
      const h = createHash('sha256'); for await (const chunk of fs.createReadStream(file)) h.update(chunk);
      if (h.digest('hex') !== ref.sha256.toLowerCase()) throw Error('ARTIFACT_HASH_MISMATCH');
      if (!jsonl) return JSON.parse(fs.readFileSync(file, 'utf8'));
      // Retain compact observations only; complete sample frames can be very large.
      const rows = new Map(); let line = 0;
      for await (const text of readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity })) {
        line++; if (!text.trim()) continue;
        const r = JSON.parse(text), item = { line, key: r.key, lab: r.lab, scene: String(r.scene), gi: r.gi,
          lessonIndex: r.lessonIndex, view: r.view, sourceFingerprint: r.sourceFingerprint, valid: !!contractValid(r) };
        if (!rows.has(r.key)) rows.set(r.key, []); rows.get(r.key).push(item);
      }
      return rows;
    })());
    return cache.get(key);
  }
  let baseline, old, baselineError;
  try { baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8')); if (baseline.schemaVersion !== 1 || !Array.isArray(baseline.units)) throw Error('UNSUPPORTED_BASELINE'); old = await bound(baseline.inventory); if (!Array.isArray(old.units) || old.errors?.length) throw Error('INVALID_PRIOR_INVENTORY'); }
  catch (e) { baselineError = String(e.message); }
  const oldUnits = new Map((Array.isArray(old?.units) ? old.units : []).map(u => [u.key, u]));
  const entries = new Map();
  for (const u of Array.isArray(baseline?.units) ? baseline.units : []) { const k = `${u.key}@${u.view || '390x844'}`; if (!entries.has(k)) entries.set(k, []); entries.get(k).push(u); }
  const decisions = [], targets = [], sourceChecks = new Map();
  for (const unit of inventory.units) {
    let reason = 'NEW_OR_MISSING_EVIDENCE', proof, priorProof;
    try {
      if (baselineError) throw Error(`BASELINE_UNAVAILABLE: ${baselineError}`);
      const matching = entries.get(`${unit.key}@${view}`) || [];
      if (matching.length !== 1) throw Error(matching.length ? 'AMBIGUOUS_BASELINE_UNIT' : reason);
      const b = matching[0].dimensions?.browser;
      if (b?.status !== 'PASS' || ![CONTRACT, NATIVE].includes(b.contract)) throw Error('UNVERIFIED_OR_DIFFERENT_CONTRACT');
      if (!unit.dimensions?.browser?.fingerprint || unit.dimensions.browser.fingerprint !== b.fingerprint) throw Error('CHANGED_BROWSER_INPUT');
      if (oldUnits.get(unit.key)?.dimensions?.browser?.fingerprint !== b.fingerprint) throw Error('BASELINE_INVENTORY_BINDING_MISMATCH');
      const artifact = baseline.artifacts?.[b.artifact];
      let rows, nativeReport;
      if (b.contract === NATIVE) {
        nativeReport = await bound(artifact?.nativeReport);
        if (view !== '390x844' || unit.lessonIndex !== 0 || b.rowKey !== unit.key) throw Error('NATIVE_SCOPE_MISMATCH');
        rows = (nativeReport.rows || []).filter(r => r.lab === unit.lab && String(r.scene) === String(unit.scene))
          .map((r, i) => ({ key: unit.key, line: i + 1, lab: r.lab, scene: String(r.scene), lessonIndex: 0, view, valid: !!nativeValid(nativeReport, r) }));
      } else {
        const raw = (await bound(artifact?.rows, true)).get(b.rowKey) || [];
        rows = b.rowLine == null ? raw : raw.filter(r => r.line === b.rowLine);
      }
      if (rows.length !== 1) throw Error('MISSING_OR_AMBIGUOUS_RAW_ROW');
      const r = rows[0];
      if (!r.valid) throw Error('RAW_CONTRACT_NOT_PASS');
      if (r.lab !== unit.lab || r.scene !== String(unit.scene) || r.lessonIndex !== unit.lessonIndex || r.view !== view
        || b.contract === CONTRACT && (!Number.isInteger(r.gi) || r.gi < 0 || r.key !== `${r.lab}:${r.scene}@${r.gi}:${r.lessonIndex}:${r.view}`)
        || unit.key !== `${r.lab}/${r.scene}/${r.lessonIndex}`) throw Error('RAW_IDENTITY_OR_VIEWPORT_MISMATCH');
      const bindingKey = `${b.artifact}/${r.lab}/${r.sourceFingerprint || nativeReport.source}`;
      if (!sourceChecks.has(bindingKey)) {
        const summary = await bound(artifact?.summary), source = summary.sourceFiles?.[r.lab];
        if (!source?.sourceFiles || hash(JSON.stringify(source.sourceFiles)) !== source.sha256
          || (b.contract === NATIVE ? summary.sourceSha !== nativeReport.source : source.sha256 !== r.sourceFingerprint)) throw Error('RAW_SOURCE_FINGERPRINT_MISMATCH');
        const files = new Map(source.sourceFiles.map(f => [f.file, f.sha256]));
        const lab = old.labs?.find(l => l.id === r.lab), inputs = [...(lab?.source?.inputs || []), ...(old.sharedDependencies?.inputs || [])];
        if (!lab || !inputs.length || inputs.filter(f => /\.(?:html|js|css|woff2?|ttf)$/i.test(f.path)).some(f => files.get(f.path) !== f.sha256)) throw Error('RAW_SOURCE_CLOSURE_INCOMPLETE');
        sourceChecks.set(bindingKey, true);
      }
      proof = { contract: b.contract, artifact: b.artifact, rowKey: r.key, ...(b.contract === CONTRACT ? { rowLine: r.line } : {}) };
      reason = b.contract === NATIVE ? 'VERIFIED_UNCHANGED_PRIOR_NATIVE_SCOPE' : 'VERIFIED_UNCHANGED';
      if (b.contract === NATIVE && requireSeek) { priorProof = proof; proof = null; reason = 'STRONGER_SEEK_CONTRACT_REQUESTED'; }
    } catch (e) { reason = String(e.message); }
    decisions.push({ key: unit.key, view, status: proof ? (proof.contract === NATIVE ? 'REUSED_VERIFIED_PRIOR_NATIVE_SCOPE' : 'REUSED_VERIFIED_PASS') : 'NOT_RUN', reason,
      ...(proof ? { proof, ...(proof.contract === NATIVE ? { optionalStrongerContractDebt: CONTRACT } : {}) } : {}), ...(priorProof ? { priorProof } : {}) });
    if (!proof) targets.push({ lab: unit.lab, scene: String(unit.scene), lessonIndices: [unit.lessonIndex], views: [view], reason });
  }
  return { schemaVersion: 1, phase: 'DELTA_STAGE2', contract: CONTRACT, requireSeek, view, visualEducationalQuality: 'NOT_ASSERTED',
    selection: { totalPrimaryUnits: inventory.units.length, automaticallySelected: targets.length,
      excludedFromAutomaticPrimaryTargets: decisions.filter(d => d.status.startsWith('REUSED_VERIFIED')).length,
      retainedPriorNativeScope: decisions.filter(d => d.status === 'REUSED_VERIFIED_PRIOR_NATIVE_SCOPE').length, explicitRiskTargets: riskTargets.length },
    targets: [...targets, ...riskTargets], decisions };
}

async function selfTest() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-delta-'));
  try {
    const fp = 'f'.repeat(64), sourceFiles = [{ file: 'apmath/lab.html', sha256: 'a'.repeat(64) }], sfp = hash(JSON.stringify(sourceFiles));
    const unit = { key: 'demo/scene/0', lab: 'demo', scene: 'scene', lessonIndex: 0, dimensions: { browser: { fingerprint: fp } } };
    const inventory = { units: [unit], labs: [{ id: 'demo', source: { inputs: [{ path: sourceFiles[0].file, sha256: sourceFiles[0].sha256 }] } }], sharedDependencies: { inputs: [] }, errors: [] };
    const row = { key: 'demo:scene@2:0:390x844', lab: 'demo', scene: 'scene', gi: 2, lessonIndex: 0, view: '390x844', sourceFingerprint: sfp, status: 'PASS', finishedAt: '2026-11-12T00:00:00Z',
      initial: { state: { player: 'idle' } }, final: { state: { player: 'ended' } }, restore: { state: 'idle', tab: 'explore', raf: 0, pins: 0, bad: [], mismatch: [] },
      samplePlan: [{ time: 0, reasons: ['initial'] }, { time: 1, reasons: ['last-frame-before-finish'] }],
      samples: [0, 1].map(time => ({ time, method: 'NATIVE_SEEK_FROZEN_QA_CLOCK', frame: {} })),
      checks: [...requiredChecks, ...[0, 1].map(t => `t=${t}: rendered state remains bound to native timeline`)].map(name => ({ name, status: 'PASS' })) };
    const write = (name, value) => { const bytes = typeof value === 'string' ? value : JSON.stringify(value); fs.writeFileSync(path.join(dir, name), bytes); return { file: name, sha256: hash(bytes) }; };
    const baseline = { schemaVersion: 1, inventory: write('inventory.json', inventory), artifacts: { s0: { rows: write('units.jsonl', JSON.stringify(row) + '\n'), summary: write('summary.json', { sourceFiles: { demo: { sourceFiles, sha256: sfp } } }) } },
      units: [{ key: unit.key, view: row.view, dimensions: { browser: { status: 'PASS', fingerprint: fp, contract: CONTRACT, artifact: 's0', rowKey: row.key } } }] };
    const baselineFile = path.join(dir, 'baseline.json'); write('baseline.json', baseline);
    const run = current => selectAudit({ inventory: current, baselineFile });
    assert.equal((await run(inventory)).targets.length, 0, 'unchanged SHA-bound actual PASS is excluded');
    const changed = structuredClone(inventory); changed.units[0].dimensions.browser.fingerprint = 'c'.repeat(64);
    assert.equal((await run(changed)).decisions[0].reason, 'CHANGED_BROWSER_INPUT', 'changed unit is selected');
    baseline.artifacts.s0.rows = write('units.jsonl', JSON.stringify({ ...row, status: 'FAIL' }) + '\n'); write('baseline.json', baseline);
    assert.equal((await run(inventory)).decisions[0].reason, 'RAW_CONTRACT_NOT_PASS', 'baseline PASS cannot override raw FAIL');
    baseline.artifacts.s0.rows = write('units.jsonl', JSON.stringify(row) + '\n'); write('baseline.json', baseline);
    fs.appendFileSync(path.join(dir, 'units.jsonl'), 'corruption'); assert.equal((await run(inventory)).decisions[0].status, 'NOT_RUN');
    fs.unlinkSync(path.join(dir, 'units.jsonl')); assert.equal((await run(inventory)).decisions[0].status, 'NOT_RUN');
    const native = { version: 1, status: 'PASS', source: 'a'.repeat(40), finishedAt: row.finishedAt, scope: 'ALL_NEW_SCENES_NATIVE_ONE_CLICK_SINGLE_PASS', rows: [{ lab: 'demo', scene: 'scene', status: 'PASS', checks: [
      { name: 'idle entry with one native lesson and concealed answer', evidence: { state: 'idle', lessons: 1, revealed: false, overflow: false, canvas: { width: 390 } } },
      { name: 'native playback advances with a caption', evidence: { state: 'playing', time: 1, caption: 'Explanation' } },
      { name: 'one click reaches native ended state', evidence: { state: 'ended', time: 2, step: 2, maxStep: 2, answerVisible: true, errors: [] } },
      { name: 'last step and mathematical invariants hold' }, { name: 'native final answer is visible' },
      { name: 'reset returns both the values and view', evidence: { matches: true, step: 0, zoom: 1 } }, { name: 'no runtime errors', evidence: [] }
    ].map(c => ({ ...c, status: 'PASS' })) }] };
    baseline.artifacts.s0 = { nativeReport: write('native.json', native), summary: write('native-binding.json', { sourceSha: native.source, sourceFiles: { demo: { sourceFiles, sha256: sfp } } }) };
    Object.assign(baseline.units[0].dimensions.browser, { contract: NATIVE, rowKey: unit.key }); write('baseline.json', baseline);
    assert.equal((await run(inventory)).decisions[0].status, 'REUSED_VERIFIED_PRIOR_NATIVE_SCOPE');
    assert.equal((await selectAudit({ inventory, baselineFile, requireSeek: true })).decisions[0].reason, 'STRONGER_SEEK_CONTRACT_REQUESTED');
    assert.equal((await selectAudit({ inventory, baselineFile, view: '360x640' })).decisions[0].status, 'NOT_RUN', '390x844 proof does not cover another viewport');
    console.log('PASS4 selector contracts: unchanged excluded; changed selected; corrupt/missing selected; native retained unless seek upgrade requested.');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), option = key => { const i = args.indexOf(key); return i < 0 ? undefined : args[i + 1]; };
  if (args.includes('--help')) console.log(HELP);
  else if (args.includes('--self-test')) await selfTest();
  else {
    if (!option('--inventory') || !option('--baseline') || !option('--out')) throw Error(HELP);
    const inventory = JSON.parse(fs.readFileSync(option('--inventory'), 'utf8'));
    const risk = option('--risk') ? JSON.parse(fs.readFileSync(option('--risk'), 'utf8')).targets : [];
    if (!Array.isArray(risk)) throw Error('--risk must contain targets array.');
    const result = await selectAudit({ inventory, baselineFile: option('--baseline'), view: option('--view') || '390x844', riskTargets: risk, requireSeek: args.includes('--require-seek') });
    result.inventorySha256 = hash(fs.readFileSync(option('--inventory')));
    fs.mkdirSync(path.dirname(path.resolve(option('--out'))), { recursive: true });
    fs.writeFileSync(option('--out'), JSON.stringify(result, null, 2) + '\n'); console.log(JSON.stringify(result.selection));
  }
}
