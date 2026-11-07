// Additive, byte-preserving review subset of a geometry browser artifact.
// This copies evidence; it never declares a browser run or visual review PASS.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const criticalIds = {
  'g7-parallel': ['p4-1', 'p4-2', 'p4-3'],
  'g7-spatial': ['s1-6', 's1-7'],
  'g7-construction': ['c6-3', 'c5-1'],
  'g7-area': ['a1-rect', 'a5-rhomb', 'b1-rt', 'b2-para', 'b5-ratio', 'c1-trap'],
  'g7-polygons': ['p4-join'],
  'g7-circle-sector': ['1607', '1102', '1207', '1210', '1609'],
  'g8-triangles': ['t6-7', 't7-1', 't5-1', 't2-2'],
  'g8-quadrilaterals': ['q1-3', 'q1-5', 'q2-3'],
  'g8-similarity': ['sm1-len', 'sm3-rot', 'sm4-conv'],
  'g8-pythagoras': ['py6-iso', 'py6-trap'],
  'g9-trig-ratio': ['r1-1', 'r1-3', 'findFromHyp', 'findFromBase', 'r4-2'],
  'g9-circle': ['c1-1', 'c2-6', 'c4-6']
};
const args = process.argv.slice(2), options = new Map();
if (args.length === 1 && args[0] === '--help') {
  console.log('Usage: node geometry-review-pack.mjs --input <evidenceRoot> --out <newDir>');
  process.exit(0);
}
for (let i = 0; i < args.length; i++) {
  const key = args[i], value = args[++i];
  if (!['--input', '--out'].includes(key) || options.has(key) || !value || value.startsWith('--')) throw Error('Expected unique --input <evidenceRoot> and --out <newDir>');
  options.set(key, value);
}
if (options.size !== 2) throw Error('Both --input and --out are required');
const input = path.resolve(options.get('--input')), out = path.resolve(options.get('--out'));
if (out === input || out.startsWith(input + path.sep) || input.startsWith(out + path.sep)) throw Error('Review pack must be separate from its source evidence directory');
if (fs.existsSync(out)) throw Error('Output already exists; choose a new directory to preserve evidence');
fs.mkdirSync(out, { recursive: true });
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const manifest = {
  version: 1, kind: 'GEOMETRY_REVIEW_SUBSET', createdAt: new Date().toISOString(), sourceRoot: input,
  status: 'EVIDENCE_COPIED_COMPLETION_NOT_ASSERTED',
  selection: 'First registered scene plus critical IDs; every available PNG viewport/stage for those exact IDs.',
  criticalIds, phases: {}, files: [], partialReasons: [],
  limitations: ['This is an additive subset; retain the original full artifact.', 'Copied results.json files are unchanged, including failures and limitations.', 'A complete initial-state matrix does not prove a run reached its end; the source audit format has no completion marker.', 'PNG copying is not direct image inspection, mathematical validation or a quality verdict.']
};
function copy(relative, detail = {}) {
  const source = path.join(input, relative), target = path.join(out, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const before = fs.readFileSync(source), sourceSHA256 = sha256(before);
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
  const after = fs.readFileSync(target), copiedSHA256 = sha256(after);
  if (sourceSHA256 !== copiedSHA256 || before.length !== after.length) throw Error(`Copied bytes differ: ${relative}`);
  const entry = { filename: relative.split(path.sep).join('/'), sourceSHA256, copiedSHA256, bytes: after.length, ...detail };
  manifest.files.push(entry);
  return entry;
}
for (const phase of ['before', 'after']) {
  const directory = path.join(input, phase), resultsPath = path.join(directory, 'results.json');
  const row = manifest.phases[phase] = { results: 'MISSING', sourceCommit: null, sourceKind: null, sourceFailureCount: null, initialCoverage: 'UNKNOWN', runCompletion: 'NOT_ASSERTED', units: {}, missingSelectedPngs: [] };
  if (!fs.existsSync(resultsPath) || !fs.lstatSync(resultsPath).isFile()) {
    manifest.partialReasons.push({ phase, reason: 'missing-results-json' });
    continue;
  }
  copy(path.join(phase, 'results.json'), { type: 'results' });
  let report;
  try { report = JSON.parse(fs.readFileSync(resultsPath, 'utf8')); }
  catch (error) {
    row.results = 'INVALID_JSON'; manifest.partialReasons.push({ phase, reason: 'invalid-results-json', message: error.message });
    continue;
  }
  row.results = 'COPIED'; row.sourceCommit = report.commit ?? null; row.sourceKind = report.kind ?? null;
  row.sourceFailureCount = Array.isArray(report.failures) ? report.failures.length : null;
  const runs = Array.isArray(report.runs) ? report.runs.map(x => x.name).filter(x => typeof x === 'string') : [];
  const units = report.units && typeof report.units === 'object' && !Array.isArray(report.units) ? Object.entries(report.units) : [];
  const selected = new Map(), expectedPngs = new Set();
  let initialExpected = 0, initialObserved = 0;
  for (const [unit, evidence] of units) {
    const ids = (evidence.scenes || []).map(x => String(x.id));
    const chosen = [...new Set([ids[0], ...(criticalIds[unit] || [])].filter(Boolean))];
    selected.set(unit, new Set(chosen));
    const initial = new Set((evidence.observations || []).filter(x => x.state === 'initial').map(x => `${x.run}|${x.id}`));
    const missingInitial = runs.flatMap(run => ids.filter(id => !initial.has(`${run}|${id}`)).map(id => ({ run, id })));
    const expected = ids.length * runs.length, observed = expected - missingInitial.length;
    initialExpected += expected; initialObserved += observed;
    const missingCriticalIds = (criticalIds[unit] || []).filter(id => !ids.includes(id));
    row.units[unit] = { registeredScenes: ids.length, firstScene: ids[0] ?? null, selectedIds: chosen, missingCriticalIds, initialExpected: expected, initialObserved: observed, missingInitial, copiedPngs: 0 };
    if (!ids.length || missingInitial.length || missingCriticalIds.length) manifest.partialReasons.push({ phase, unit, reason: !ids.length ? 'empty-scene-inventory' : missingInitial.length ? 'incomplete-initial-scene-run-matrix' : 'critical-id-not-in-inventory' });
    for (const filename of evidence.captures || []) {
      if (typeof filename !== 'string' || path.basename(filename) !== filename || !filename.endsWith('.png')) continue;
      if (chosen.some(id => filename.startsWith(`${unit}--${id}--`))) expectedPngs.add(filename);
    }
  }
  if (!runs.length || !units.length) manifest.partialReasons.push({ phase, reason: 'missing-run-or-unit-inventory' });
  row.initialExpected = initialExpected; row.initialObserved = initialObserved;
  row.initialCoverage = initialExpected > 0 && initialExpected === initialObserved ? 'INITIAL_MATRIX_PRESENT' : 'PARTIAL_OR_UNKNOWN';
  const available = fs.readdirSync(directory, { withFileTypes: true }).filter(x => x.isFile() && x.name.endsWith('.png')).map(x => x.name).sort();
  for (const filename of available) {
    const [unit, id] = filename.split('--');
    if (!selected.get(unit)?.has(id)) continue;
    copy(path.join(phase, filename), { type: 'png', unit, sceneId: id, listedInSourceCaptures: expectedPngs.has(filename) });
    row.units[unit].copiedPngs++;
  }
  const availableSet = new Set(available);
  row.missingSelectedPngs = [...expectedPngs].filter(filename => !availableSet.has(filename)).sort();
  if (row.missingSelectedPngs.length) manifest.partialReasons.push({ phase, reason: 'listed-selected-png-missing', count: row.missingSelectedPngs.length });
  for (const [unit, evidence] of Object.entries(row.units)) {
    if (!evidence.copiedPngs) manifest.partialReasons.push({ phase, unit, reason: 'no-selected-png-available' });
  }
}
if (manifest.partialReasons.length) manifest.status = 'PARTIAL_EVIDENCE_SUBSET';
if (!manifest.files.length) manifest.status = 'NO_SOURCE_EVIDENCE_AVAILABLE';
manifest.summary = {
  copiedResults: manifest.files.filter(x => x.type === 'results').length,
  copiedPngs: manifest.files.filter(x => x.type === 'png').length,
  copiedBytes: manifest.files.reduce((n, x) => n + x.bytes, 0),
  manifestBytes: 0, totalPackBytes: 0
};
let output;
for (let attempt = 0; attempt < 10; attempt++) {
  output = JSON.stringify(manifest, null, 2) + '\n';
  const bytes = Buffer.byteLength(output);
  if (bytes === manifest.summary.manifestBytes) break;
  manifest.summary.manifestBytes = bytes;
  manifest.summary.totalPackBytes = manifest.summary.copiedBytes + bytes;
}
if (Buffer.byteLength(output) !== manifest.summary.manifestBytes) throw Error('Manifest size did not stabilize');
fs.writeFileSync(path.join(out, 'manifest.json'), output, { flag: 'wx' });
console.log(JSON.stringify({ status: manifest.status, ...manifest.summary, manifest: path.join(out, 'manifest.json'), manifestSHA256: sha256(output) }));
