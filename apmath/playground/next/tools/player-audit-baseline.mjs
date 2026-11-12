// Build reusable evidence from bound raw observations. This never upgrades a
// failed/review-required row and delegates contract interpretation to the selector.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import readline from 'node:readline';
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { deflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { selectAudit } from './player-audit-select.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url)), DEFAULT_REPO = path.resolve(HERE, '../../../..');
const CONTRACT = 'native-seek-restore-v1', NATIVE = 'native-single-pass-v1', REVIEWED = 'native-seek-restore-reviewed-v1';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const HEX = /^[a-f0-9]{64}$/i, COMMIT = /^[a-f0-9]{40}$/i;
const HELP = `Usage: node player-audit-baseline.mjs --input INPUT.json --out BASELINE.json [--repo REPO]
       node player-audit-baseline.mjs --self-test | --help

INPUT schemaVersion:1; all paths resolve relative to INPUT:
{
  "schemaVersion":1,
  "inventory":{"file":"inventory-current.json","sha256":"64 hex chars"},
  "artifacts":{"s0":{
    "sourceSha":"40-char actual audited Git commit",
    "rows":{"file":"shard-0/units.jsonl","sha256":"64 hex chars"},
    "summary":{"file":"shard-0/summary.json","sha256":"64 hex chars"}
  }},
  "primaryView":"390x844",
  "preferArtifacts":["s0"]
}
preferArtifacts is OPTIONAL. Without it, duplicate key/view observations are
pending, including conflicting PASS/FAIL. With it, the first listed artifact is
chosen explicitly; its FAIL/REVIEW_REQUIRED never falls back to an older PASS.
Duplicate rows within the chosen artifact remain pending.
For retained native-single-pass-v1 proof use nativeReport instead of rows, with
the selector's bound source summary. This retains the older scope, never seek or
visual PASS.

Optional scoped reviews: INPUT.reviewAuthority is
{"auditOwnerId":"/root","independentReviewerIds":["/root/continuity"]}.
INPUT.adjudications (or each artifact.adjudications) is a bound {file,sha256} JSON:
{"schemaVersion":1,"contract":"native-seek-restore-reviewed-v1","reviews":[{
 "sourceSha":"actual Git commit","rowKey":"exact native row key","view":"390x844",
 "rowLine":1,"rowFileSha256":"raw JSONL file hash","rowJsonSha256":"exact line hash",
 "auditOwnerId":"/root","reviewerId":"/root/continuity","reviewedAt":"ISO UTC",
 "verdict":"RESOLVED_AS_EXPECTED","reason":"independent finding",
 "checks":[{"name":"exact REVIEW_REQUIRED check name","reason":"finding for this check",
 "images":[{"file":"original-row-capture.png","sha256":"actual PNG hash"}]}]
}]}
rowJsonSha256 hashes the exact UTF-8 JSONL line without CR/LF. Image paths are
filenames in the raw rows file's directory; they must be recorded by that row
and bound to the exact check's diagnostic or matching sampled frame. PNG byte
hash and viewport dimensions are verified. Every non-PASS check must be exactly
resolved, and every original non-PASS must be REVIEW_REQUIRED. Raw FAIL cannot
be overridden. The reviewer must be in the explicit independent list and differ
from auditOwnerId. Missing/mismatched review or PNG remains pending.
Reviewed entries use status SCOPED_MANUAL_RESOLVED, preserve the original raw
status, and never assert broad independent visual quality.

Only complete raw PASS contracts validated by selectAudit enter baseline.units.
The tool verifies expected file hashes, current inventory source bytes, actual
Git source bytes recorded by each artifact, complete current runtime dependency
closure, source fingerprint, row identity/viewport/group, and raw summary binding.
FAIL, REVIEW_REQUIRED, missing/corrupt proof and changed sources stay in pending.
All raw files stay unchanged; output references preserve their hashes and rowLine.
Tool provenance files under next/tools are Git-bound but are not runtime inputs.
No independent visual/reading-pace/continuous-play PASS is inferred.

Then reproduce delta selection:
node player-audit-select.mjs --inventory inventory-current.json --baseline BASELINE.json --out targets.json
Zero selected targets is possible only when every primary unit has verified proof.
Self-tests are tool contract checks and must not be counted as product PASS.
`;

async function fileSha(file) {
  const h = createHash('sha256'); for await (const chunk of fs.createReadStream(file)) h.update(chunk);
  return h.digest('hex');
}

export async function buildBaseline({ inputFile, outputFile, repo = DEFAULT_REPO }) {
  inputFile = path.resolve(inputFile); outputFile = path.resolve(outputFile); repo = path.resolve(repo);
  if (inputFile === outputFile) throw Error('OUTPUT_WOULD_OVERWRITE_INPUT');
  const inputBytes = fs.readFileSync(inputFile), input = JSON.parse(inputBytes), dir = path.dirname(inputFile), outDir = path.dirname(outputFile);
  if (input.schemaVersion !== 1 || !input.artifacts || Array.isArray(input.artifacts)) throw Error('UNSUPPORTED_INPUT');
  const boundFiles = new Map(), currentHashes = new Map(), gitHashes = new Map();
  const resolveRef = ref => {
    if (!ref?.file || !HEX.test(ref.sha256 || '')) throw Error('MISSING_BOUND_REFERENCE');
    const file = path.resolve(dir, ref.file); if (file === outputFile) throw Error('OUTPUT_WOULD_OVERWRITE_EVIDENCE');
    return { file, sha256: ref.sha256.toLowerCase() };
  };
  const outputRef = ref => ({ file: path.relative(outDir, ref.file), sha256: ref.sha256 });
  async function bound(ref, json = true) {
    const r = resolveRef(ref); if (await fileSha(r.file) !== r.sha256) throw Error('ARTIFACT_HASH_MISMATCH');
    boundFiles.set(r.file, r.sha256); return json ? JSON.parse(fs.readFileSync(r.file, 'utf8')) : r;
  }
  function safePath(file) {
    if (typeof file !== 'string' || path.isAbsolute(file) || file.split(/[\\/]/).includes('..')) throw Error('UNSAFE_SOURCE_PATH');
    return path.join(repo, file);
  }
  function currentHash(file) {
    if (!currentHashes.has(file)) { try { currentHashes.set(file, sha(fs.readFileSync(safePath(file)))); } catch { currentHashes.set(file, null); } }
    return currentHashes.get(file);
  }
  function gitHash(commit, file) {
    const k = `${commit}:${file}`; safePath(file);
    if (!gitHashes.has(k)) { try { gitHashes.set(k, sha(execFileSync('git', ['show', k], { cwd: repo, maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] }))); } catch { gitHashes.set(k, null); } }
    return gitHashes.get(k);
  }
  const inventory = await bound(input.inventory), units = new Map();
  if (inventory.errors?.length || !Array.isArray(inventory.units) || !Array.isArray(inventory.labs) || !inventory.units.length) throw Error('INVALID_CURRENT_INVENTORY');
  for (const u of inventory.units) {
    if (u.key !== `${u.lab}/${u.scene}/${u.lessonIndex}` || !HEX.test(u.dimensions?.browser?.fingerprint || '') || units.has(u.key)) throw Error('INVALID_OR_DUPLICATE_CURRENT_UNIT');
    units.set(u.key, u);
  }
  const requiredByLab = new Map(inventory.labs.map(l => [l.id, [...(l.source?.inputs || []), ...(inventory.sharedDependencies?.inputs || [])]]));
  for (const inputs of requiredByLab.values()) for (const f of inputs) if (!HEX.test(f.sha256 || '') || currentHash(f.path) !== f.sha256) throw Error(`STALE_CURRENT_INVENTORY:${f.path}`);
  const priority = input.preferArtifacts || [];
  if (!Array.isArray(priority) || new Set(priority).size !== priority.length || priority.some(k => !Object.hasOwn(input.artifacts, k))) throw Error('INVALID_ARTIFACT_PRIORITY');
  const baseline = { schemaVersion: 1, createdAt: new Date().toISOString(), inventory: outputRef(resolveRef(input.inventory)),
    inputManifest: { file: path.relative(outDir, inputFile), sha256: sha(inputBytes) }, artifacts: {}, units: [], pending: [], artifactErrors: [], sourceValidation: {},
    toolSources: ['player-audit-baseline.mjs', 'player-audit-select.mjs'].map(file => ({ file, sha256: sha(fs.readFileSync(path.join(HERE, file))) })),
    selectionPolicy: { primaryView: input.primaryView || '390x844', preferArtifacts: priority }, visualEducationalQuality: 'NOT_ASSERTED' };
  if (input.reviewAuthority) {
    const a = input.reviewAuthority;
    if (typeof a.auditOwnerId !== 'string' || !a.auditOwnerId.trim() || !Array.isArray(a.independentReviewerIds) || !a.independentReviewerIds.length
      || a.independentReviewerIds.some(id => typeof id !== 'string' || !id.trim() || id === a.auditOwnerId)) throw Error('INVALID_INDEPENDENT_REVIEW_AUTHORITY');
    baseline.reviewAuthority = a;
  }
  if (!/^\d+x\d+$/.test(baseline.selectionPolicy.primaryView)) throw Error('INVALID_PRIMARY_VIEW');
  const observations = new Map(), counts = { rawRows: 0, rawPassRows: 0, rawFailedRows: 0, rawReviewRows: 0, accepted: 0, pending: 0 };
  function add(r) { const key = `${r.key}@${r.view}`; if (!observations.has(key)) observations.set(key, []); observations.get(key).push(r); }
  for (const [id, spec] of Object.entries(input.artifacts)) {
    try {
      if (!COMMIT.test(spec.sourceSha || '') || !!spec.rows === !!spec.nativeReport) throw Error('INVALID_ARTIFACT_SOURCE_OR_KIND');
      const summary = await bound(spec.summary); if (summary.sourceSha !== spec.sourceSha) throw Error('ARTIFACT_SOURCE_SHA_MISMATCH');
      const sourceState = new Map();
      for (const [lab, source] of Object.entries(summary.sourceFiles || {})) {
        const files = source.sourceFiles, problems = [];
        if (!Array.isArray(files) || sha(JSON.stringify(files)) !== source.sha256) { sourceState.set(lab, 'RAW_SOURCE_FINGERPRINT_MISMATCH'); continue; }
        const map = new Map(files.map(f => [f.file, f.sha256]));
        if (map.size !== files.length) problems.push({ reason: 'DUPLICATE_SOURCE_PATH' });
        for (const f of files) {
          if (!HEX.test(f.sha256 || '') || gitHash(spec.sourceSha, f.file) !== f.sha256) problems.push({ file: f.file, reason: 'GIT_SOURCE_MISMATCH' });
          if (!f.file.startsWith('apmath/playground/next/tools/') && currentHash(f.file) !== f.sha256) problems.push({ file: f.file, reason: 'CURRENT_RUNTIME_CHANGED' });
        }
        const required = requiredByLab.get(lab) || [];
        if (!required.length) problems.push({ reason: 'UNKNOWN_LAB_SOURCE' });
        for (const f of required.filter(f => /\.(?:html|js|css|woff2?|ttf)$/i.test(f.path))) if (map.get(f.path) !== f.sha256) problems.push({ file: f.path, reason: map.has(f.path) ? 'CURRENT_INPUT_CHANGED' : 'RUNTIME_CLOSURE_MISSING' });
        const key = `${id}/${lab}`; baseline.sourceValidation[key] = { status: problems.length ? 'NOT_REUSABLE' : 'VERIFIED_CURRENT', sourceSha: spec.sourceSha, sourceFingerprint: source.sha256, problems };
        sourceState.set(lab, problems.length ? 'SOURCE_CHANGED_OR_CLOSURE_UNVERIFIED' : null);
      }
      const artifact = { sourceSha: spec.sourceSha, summary: outputRef(resolveRef(spec.summary)), runStatus: summary.status || null };
      if (spec.adjudications || input.adjudications) {
        try { artifact.adjudications = outputRef(resolveRef(spec.adjudications || input.adjudications)); }
        catch (e) { artifact.adjudicationError = String(e.message); }
      }
      const summaryRows = new Map(); for (const r of summary.rows || []) { if (!summaryRows.has(r.key)) summaryRows.set(r.key, []); summaryRows.get(r.key).push(r.status); }
      const readRow = (r, rowLine, native = false) => {
        counts.rawRows++; if (r.status === 'PASS') counts.rawPassRows++; else if (r.status === 'FAIL') counts.rawFailedRows++; else if (r.status === 'REVIEW_REQUIRED') counts.rawReviewRows++;
        const key = `${r.lab}/${String(r.scene)}/${native ? 0 : r.lessonIndex}`, view = native ? '390x844' : r.view, unit = units.get(key);
        const reviewed = !native && r.status === 'REVIEW_REQUIRED' && !!artifact.adjudications && !!baseline.reviewAuthority;
        let reason = null;
        if (!unit || !/^\d+x\d+$/.test(view || '') || (!native && (r.key !== `${r.lab}:${r.scene}@${r.gi}:${r.lessonIndex}:${view}` || !Number.isInteger(r.gi) || unit.gi != null && unit.gi !== r.gi))) reason = 'RAW_IDENTITY_OR_VIEWPORT_MISMATCH';
        else if (r.status !== 'PASS' && !reviewed) reason = `RAW_${r.status || 'UNKNOWN'}_REMAINS_PENDING`;
        else if (sourceState.get(r.lab) !== null) reason = sourceState.get(r.lab) || 'MISSING_SOURCE_CLOSURE';
        else if (!native && r.sourceFingerprint !== summary.sourceFiles[r.lab].sha256) reason = 'RAW_SOURCE_FINGERPRINT_MISMATCH';
        else if (!native && (summaryRows.get(r.key)?.length !== 1 || summaryRows.get(r.key)[0] !== r.status)) reason = 'RAW_SUMMARY_ROW_BINDING_MISMATCH';
        add({ key, view, artifact: id, sourceSha: spec.sourceSha, rawStatus: r.status, rowKey: native ? key : r.key, ...(native ? {} : { rowLine, gi: r.gi }), contract: native ? NATIVE : reviewed ? REVIEWED : CONTRACT, reason });
      };
      if (spec.nativeReport) {
        const report = await bound(spec.nativeReport); if (report.source !== spec.sourceSha) throw Error('NATIVE_SOURCE_SHA_MISMATCH');
        artifact.nativeReport = outputRef(resolveRef(spec.nativeReport)); for (const r of report.rows || []) readRow(r, null, true);
      } else {
        const ref = await bound(spec.rows, false), stream = fs.createReadStream(ref.file), h = createHash('sha256'); let line = 0;
        stream.on('data', chunk => h.update(chunk));
        for await (const text of readline.createInterface({ input: stream, crlfDelay: Infinity })) { line++; if (text.trim()) readRow(JSON.parse(text), line); }
        if (h.digest('hex') !== ref.sha256) throw Error('ARTIFACT_CHANGED_DURING_READ'); artifact.rows = outputRef(ref);
      }
      baseline.artifacts[id] = artifact;
    } catch (e) { baseline.artifactErrors.push({ artifact: id, reason: String(e.message) }); }
  }
  for (const rows of observations.values()) {
    let chosen = rows;
    if (rows.length > 1 && priority.length) { const preferred = priority.find(id => rows.some(r => r.artifact === id)); chosen = preferred ? rows.filter(r => r.artifact === preferred) : rows; }
    if (chosen.length !== 1) { baseline.pending.push({ key: rows[0].key, view: rows[0].view, reason: 'AMBIGUOUS_OBSERVATIONS', observations: rows }); continue; }
    const r = chosen[0];
    if (!baseline.artifacts[r.artifact] || r.reason) { baseline.pending.push({ ...r, reason: r.reason || 'ARTIFACT_UNAVAILABLE' }); continue; }
    baseline.units.push({ key: r.key, view: r.view, ...(r.gi == null ? {} : { gi: r.gi }), dimensions: { browser: { status: r.contract === REVIEWED ? 'SCOPED_MANUAL_RESOLVED' : 'PASS', rawStatus: r.rawStatus, fingerprint: units.get(r.key).dimensions.browser.fingerprint, contract: r.contract, artifact: r.artifact, sourceSha: r.sourceSha, rowKey: r.rowKey, ...(r.rowLine == null ? {} : { rowLine: r.rowLine }) } } });
  }
  fs.mkdirSync(outDir, { recursive: true }); const temporary = path.join(outDir, `baseline-builder-candidate-${randomUUID()}.json`);
  try {
    fs.writeFileSync(temporary, JSON.stringify(baseline)); const accepted = new Set();
    for (const view of new Set(baseline.units.map(u => u.view))) {
      const keys = new Set(baseline.units.filter(u => u.view === view).map(u => u.key));
      const result = await selectAudit({ inventory: { ...inventory, units: inventory.units.filter(u => keys.has(u.key)) }, baselineFile: temporary, view });
      for (const d of result.decisions) if (d.status.startsWith('REUSED_VERIFIED')) {
        accepted.add(`${d.key}@${view}`);
        if (d.proof.scopedManualResolved) {
          const u = baseline.units.find(u => u.key === d.key && u.view === view), a = baseline.artifacts[d.proof.artifact];
          u.dimensions.browser.scopedManualResolved = d.proof.scopedManualResolved;
          boundFiles.set(path.resolve(outDir, a.adjudications.file), a.adjudications.sha256);
          for (const p of d.proof.scopedManualResolved.images) boundFiles.set(path.join(path.dirname(path.resolve(outDir, a.rows.file)), p.file), p.sha256);
        }
      } else baseline.pending.push({ ...d, reason: `SELECTOR_REJECTED:${d.reason}` });
    }
    baseline.units = baseline.units.filter(u => accepted.has(`${u.key}@${u.view}`));
  } finally { fs.rmSync(temporary, { force: true }); }
  for (const u of inventory.units) if (!observations.has(`${u.key}@${baseline.selectionPolicy.primaryView}`)) baseline.pending.push({ key: u.key, view: baseline.selectionPolicy.primaryView, reason: 'NO_RAW_OBSERVATION' });
  // Do not publish a baseline if any bound input changed during validation.
  for (const [file, expected] of boundFiles) if (await fileSha(file) !== expected) throw Error(`BOUND_INPUT_CHANGED_DURING_BUILD:${file}`);
  if (sha(fs.readFileSync(inputFile)) !== sha(inputBytes)) throw Error('INPUT_MANIFEST_CHANGED_DURING_BUILD');
  for (const inputs of requiredByLab.values()) for (const f of inputs) if (sha(fs.readFileSync(safePath(f.path))) !== f.sha256) throw Error(`CURRENT_SOURCE_CHANGED_DURING_BUILD:${f.path}`);
  counts.accepted = baseline.units.length; counts.acceptedRawPass = baseline.units.filter(u => u.dimensions.browser.rawStatus === 'PASS').length;
  counts.acceptedScopedReviews = baseline.units.filter(u => u.dimensions.browser.contract === REVIEWED).length;
  counts.pending = baseline.pending.length; baseline.counts = counts;
  fs.writeFileSync(outputFile, JSON.stringify(baseline, null, 2) + '\n'); return baseline;
}

async function selfTest() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-baseline-')), repo = path.join(dir, 'repo'); fs.mkdirSync(path.join(repo, 'apmath'), { recursive: true });
  try {
    const sourceFile = 'apmath/demo.html', bytes = 'demo runtime'; fs.writeFileSync(path.join(repo, sourceFile), bytes);
    const git = args => execFileSync('git', args, { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    git(['init', '-q']); git(['add', '.']); git(['-c', 'user.name=Audit fixture', '-c', 'user.email=audit@example.invalid', 'commit', '-qm', 'Fixture']); const commit = git(['rev-parse', 'HEAD']);
    const write = (name, value) => { const raw = typeof value === 'string' ? value : JSON.stringify(value); fs.writeFileSync(path.join(dir, name), raw); return { file: name, sha256: sha(raw) }; };
    const unit = { key: 'demo/scene/0', lab: 'demo', scene: 'scene', lessonIndex: 0, gi: 2, dimensions: { browser: { fingerprint: 'f'.repeat(64) } } };
    const inventory = { units: [unit], errors: [], labs: [{ id: 'demo', source: { inputs: [{ path: sourceFile, sha256: sha(bytes) }] } }], sharedDependencies: { inputs: [] } };
    const files = [{ file: sourceFile, sha256: sha(bytes) }], fp = sha(JSON.stringify(files)), view = '390x844';
    const names = ['initial player idle and answer unrevealed', 'one entry button per valid lesson', 'native finish shows end card', 'close restores idle/explore, releases lesson state and pins', 'restored parameters and sliders valid', 'no page runtime/resource/invalid-script errors'];
    const row = { key: `demo:scene@2:0:${view}`, lab: 'demo', scene: 'scene', gi: 2, lessonIndex: 0, view, sourceFingerprint: fp, status: 'PASS', finishedAt: '2026-11-12T00:00:00Z', initial: { state: { player: 'idle' } }, final: { state: { player: 'ended' } }, restore: { state: 'idle', tab: 'explore', raf: 0, pins: 0, bad: [], mismatch: [] }, samplePlan: [{ time: 0, reasons: ['initial'] }, { time: 1, reasons: ['last-frame-before-finish'] }], samples: [0, 1].map(time => ({ time, method: 'NATIVE_SEEK_FROZEN_QA_CLOCK', frame: {} })), checks: [...names, ...[0, 1].map(t => `t=${t}: rendered state remains bound to native timeline`)].map(name => ({ name, status: 'PASS' })) };
    const input = { schemaVersion: 1, inventory: write('inventory.json', inventory), artifacts: {} };
    const artifact = (id, r) => ({ sourceSha: commit, rows: write(`${id}.jsonl`, '\n' + JSON.stringify(r) + '\n'), summary: write(`${id}.json`, { sourceSha: commit, sourceFiles: { demo: { sourceFiles: files, sha256: fp } }, rows: [{ key: r.key, status: r.status }] }) });
    const inputFile = path.join(dir, 'input.json'), outputFile = path.join(dir, 'baseline.json');
    const run = async () => { write('input.json', input); return buildBaseline({ inputFile, outputFile, repo }); };
    input.artifacts.a = artifact('a', row); let result = await run(); assert.equal(result.units.length, 1); assert.equal(result.units[0].dimensions.browser.rowLine, 2); assert.equal((await selectAudit({ inventory, baselineFile: outputFile })).targets.length, 0);
    fs.writeFileSync(path.join(repo, sourceFile), 'changed'); const changed = structuredClone(inventory); changed.labs[0].source.inputs[0].sha256 = sha('changed'); changed.units[0].dimensions.browser.fingerprint = 'c'.repeat(64); input.inventory = write('inventory.json', changed); result = await run(); assert.equal(result.units.length, 0); assert.equal(result.pending[0].reason, 'SOURCE_CHANGED_OR_CLOSURE_UNVERIFIED');
    fs.writeFileSync(path.join(repo, sourceFile), bytes); input.inventory = write('inventory.json', inventory);
    for (const status of ['FAIL', 'REVIEW_REQUIRED']) { input.artifacts.a = artifact('a', { ...row, status }); result = await run(); assert.equal(result.units.length, 0); assert.ok(result.pending[0].reason.includes(status)); }
    input.artifacts.a = artifact('a', { ...row, checks: row.checks.map((c, i) => i ? c : { ...c, status: 'FAIL' }) }); result = await run(); assert.equal(result.units.length, 0); assert.ok(result.pending[0].reason.includes('RAW_CONTRACT_NOT_PASS'));
    input.artifacts.a = artifact('a', row); fs.appendFileSync(path.join(dir, 'a.jsonl'), 'corrupt'); result = await run(); assert.equal(result.units.length, 0); assert.equal(result.artifactErrors[0].reason, 'ARTIFACT_HASH_MISMATCH');
    input.artifacts.a = artifact('a', row); input.artifacts.b = artifact('b', { ...row, status: 'FAIL' }); result = await run(); assert.equal(result.pending[0].reason, 'AMBIGUOUS_OBSERVATIONS'); input.preferArtifacts = ['b', 'a']; result = await run(); assert.equal(result.units.length, 0); assert.equal(result.pending[0].rawStatus, 'FAIL');
    console.log('PASS4 builder contracts: bound PASS roundtrip; changed inputs pending; FAIL/review/invalid contract pending; corruption and duplicate conflict protected. Not product PASS.');
    // Synthetic review/PNG fixtures exist only in this temporary test directory.
    const crc32 = bytes => { let c = 0xffffffff; for (const b of bytes) { c ^= b; for (let i = 0; i < 8; i++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; } return (c ^ 0xffffffff) >>> 0; };
    const chunk = (type, data) => { const name = Buffer.from(type), size = Buffer.alloc(4), crc = Buffer.alloc(4); size.writeUInt32BE(data.length); crc.writeUInt32BE(crc32(Buffer.concat([name, data]))); return Buffer.concat([size, name, data, crc]); };
    const header = Buffer.alloc(13); header.writeUInt32BE(390, 0); header.writeUInt32BE(844, 4); header[8] = 8; header[9] = 6;
    const pixels = Buffer.alloc((390 * 4 + 1) * 844, 255); for (let y = 0; y < 844; y++) pixels[y * (390 * 4 + 1)] = 0;
    const png = Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), chunk('IHDR', header), chunk('IDAT', deflateSync(pixels)), chunk('IEND', Buffer.alloc(0))]);
    const filename = 'demo_scene@2_0_390x844--diagnostic-t_0.png', pngFile = path.join(dir, filename); fs.writeFileSync(pngFile, png);
    const reviewName = 't=0: low canvas ink needs semantic review';
    const reviewRow = { ...row, status: 'REVIEW_REQUIRED', checks: [...row.checks, { name: reviewName, status: 'REVIEW_REQUIRED' }], screenshots: [filename], firstFailureCaptures: [{ label: 't=0', checks: [reviewName], file: filename }] };
    delete input.artifacts.b; delete input.preferArtifacts;
    input.reviewAuthority = { auditOwnerId: 'fixture-owner', independentReviewerIds: ['fixture-independent-reviewer'] };
    input.artifacts.a = artifact('a', reviewRow);
    const review = { sourceSha: commit, rowKey: row.key, view, rowLine: 2, rowFileSha256: input.artifacts.a.rows.sha256, rowJsonSha256: sha(JSON.stringify(reviewRow)), auditOwnerId: 'fixture-owner', reviewerId: 'fixture-independent-reviewer', reviewedAt: '2026-11-12T01:00:00Z', verdict: 'RESOLVED_AS_EXPECTED', reason: 'Synthetic fixture only.', checks: [{ name: reviewName, reason: 'Synthetic fixture only.', images: [{ file: filename, sha256: sha(png) }] }] };
    const adjudicate = async (r = review) => { input.adjudications = write('adjudications.json', { schemaVersion: 1, contract: REVIEWED, reviews: [r] }); return run(); };
    result = await adjudicate(); assert.equal(result.counts.acceptedScopedReviews, 1); assert.equal(result.units[0].dimensions.browser.status, 'SCOPED_MANUAL_RESOLVED'); assert.equal((await selectAudit({ inventory, baselineFile: outputFile })).decisions[0].status, 'REUSED_VERIFIED_SCOPED_MANUAL_REVIEW');
    for (const r of [{ ...reviewRow, status: 'FAIL' }, { ...reviewRow, checks: reviewRow.checks.map((c, i) => i ? c : { ...c, status: 'FAIL' }) }]) {
      input.artifacts.a = artifact('a', r); result = await adjudicate({ ...review, rowFileSha256: input.artifacts.a.rows.sha256, rowJsonSha256: sha(JSON.stringify(r)) }); assert.equal(result.units.length, 0, 'RAW FAIL is never adjudicable');
    }
    input.artifacts.a = artifact('a', reviewRow);
    for (const change of [{ sourceSha: 'b'.repeat(40) }, { rowFileSha256: 'b'.repeat(64) }, { rowJsonSha256: 'b'.repeat(64) }, { view: '360x640' }, { reviewerId: 'fixture-owner' }, { checks: [] }]) { result = await adjudicate({ ...review, ...change }); assert.equal(result.units.length, 0, 'binding/reviewer/check mismatch stays pending'); }
    fs.unlinkSync(pngFile); result = await adjudicate(); assert.equal(result.units.length, 0, 'missing actual PNG stays pending'); fs.writeFileSync(pngFile, Buffer.concat([png, Buffer.from('corrupt')])); result = await adjudicate(); assert.equal(result.units.length, 0, 'changed PNG stays pending');
    console.log('PASS3 reviewed boundaries: raw FAIL forbidden; exact source/row/view/reviewer/check binding; missing or corrupt PNG pending. Synthetic fixtures only, not product PASS.');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), get = key => { const i = args.indexOf(key); return i < 0 ? undefined : args[i + 1]; };
  if (args.includes('--help')) console.log(HELP);
  else if (args.includes('--self-test')) await selfTest();
  else { if (!get('--input') || !get('--out')) throw Error(HELP); const result = await buildBaseline({ inputFile: get('--input'), outputFile: get('--out'), repo: get('--repo') || DEFAULT_REPO }); console.log(JSON.stringify({ ...result.counts, artifactErrors: result.artifactErrors.length })); }
}
