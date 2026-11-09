// Additive transport only: retain the full CI artifact and its existing validator.
// Every after PNG and every non-PNG file is copied without changing its bytes.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

export const MAX_PART_BYTES = 400 * 1024 * 1024;
export const PROFILE_PARTS = ['pc-paper', 'pc-board', 'mobile-paper', 'mobile-board'];
export const DELIVERY_PARTS = ['metadata', ...PROFILE_PARTS];
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const jsonBytes = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
const isPng = file => /\.png$/i.test(file);
const within = (child, parent) => child === parent || child.startsWith(parent + path.sep);

function relativeFile(file) {
  if (typeof file !== 'string' || !file || file.includes('\\') || path.posix.isAbsolute(file) || path.posix.normalize(file) !== file || file.split('/').some(x => !x || x === '.' || x === '..')) throw Error(`Unsafe evidence path: ${file}`);
  return file;
}

function inventory(root, directory = root) {
  return fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(entry => {
    const filename = path.join(directory, entry.name), stat = fs.lstatSync(filename);
    if (stat.isDirectory()) return inventory(root, filename);
    if (!stat.isFile()) throw Error(`Evidence must contain regular files, not links: ${filename}`);
    const relative = relativeFile(path.relative(root, filename).split(path.sep).join('/'));
    const bytes = fs.readFileSync(filename);
    return [{ relative, bytes: bytes.length, sourceSHA256: sha256(bytes) }];
  });
}

function pngIdentity(relative, labs, runs) {
  const [lab, scene, run, ...state] = path.posix.basename(relative).split('--');
  if (!lab || !scene || !state.length || !state.join('--').replace(/\.png$/i, '') || !labs.has(lab) || !runs.has(run)) throw Error(`Unclassified after PNG (lab/run must occur in results.json): ${relative}`);
  return { lab, run };
}

// This is deliberately separate from review completeness: failed/partial browser
// results are copied unchanged and can still have a complete delivery inventory.
export function buildEvidenceDelivery({ input, out, maxPartBytes = MAX_PART_BYTES }) {
  input = fs.realpathSync(input); out = path.resolve(out);
  if (!fs.statSync(input).isDirectory() || within(out, input) || within(input, out)) throw Error('Delivery output must be separate from source evidence');
  if (fs.existsSync(out)) throw Error('Output already exists; evidence is immutable');
  if (!Number.isSafeInteger(maxPartBytes) || maxPartBytes <= 0 || maxPartBytes > MAX_PART_BYTES) throw Error('Part limit must be positive and no greater than 400 MiB');
  const files = inventory(input), byName = new Map(files.map(file => [file.relative, file]));
  for (const required of ['before/results.json', 'after/results.json', 'comparison.json']) if (!byName.has(required)) throw Error(`Missing original JSON: ${required}`);
  if (byName.has('delivery-index.json') || byName.has('delivery-part.json')) throw Error('Source conflicts with generated delivery index paths');
  const readJSON = file => JSON.parse(fs.readFileSync(path.join(input, file), 'utf8'));
  const report = readJSON('after/results.json');
  const labs = new Set((report.labs || []).map(lab => lab.id)), runs = new Set((report.runs || []).map(run => run.name));
  if (!labs.size || !runs.size || labs.has(undefined) || runs.has(undefined)) throw Error('Candidate results have no usable lab/run inventory');
  const manifestPath = 'after/review-capture-manifest.json';
  const manifest = byName.has(manifestPath) ? readJSON(manifestPath) : null;
  if (report.reviewCapture && !manifest) throw Error('Candidate results refer to a missing review capture manifest');
  const references = new Map();
  function requirePNG(file, origin, expected = {}) {
    file = relativeFile(file);
    if (!isPng(file)) throw Error(`Registered capture is not a PNG: ${file}`);
    const relative = `after/${file}`, actual = byName.get(relative);
    if (!actual) throw Error(`Missing registered after PNG: ${relative}`);
    const identity = pngIdentity(relative, labs, runs);
    if ((expected.lab && identity.lab !== expected.lab) || (expected.run && identity.run !== expected.run)) throw Error(`Misclassified registered PNG: ${relative}`);
    if (expected.png && (expected.png.bytes !== actual.bytes || expected.png.sha256 !== actual.sourceSHA256)) throw Error(`Registered PNG byte binding differs: ${relative}`);
    const origins = references.get(relative) || new Set(); origins.add(origin); references.set(relative, origins);
  }
  function bundlePNGs(bundle, origin, expected = {}) {
    for (const frame of [bundle, bundle?.rawReference, ...(bundle?.supplementalFrames || [])]) {
      if (frame?.file) requirePNG(frame.file, origin, { ...expected, png: frame.png });
    }
  }
  for (const lab of report.labs) {
    for (const file of lab.captures || []) requirePNG(file, 'results.captures', { lab: lab.id });
    for (const file of Object.keys(lab.captureMetadata || {})) requirePNG(file, 'results.captureMetadata', { lab: lab.id });
    for (const [file, bundle] of Object.entries(lab.captureBundles || {})) {
      requirePNG(file, 'results.captureBundles', { lab: lab.id });
      bundlePNGs(bundle, 'results.captureBundles', { lab: lab.id });
    }
    for (const item of lab.failureCaptures || []) requirePNG(typeof item === 'string' ? item : item.file, 'results.failureCaptures', { lab: lab.id });
  }
  if (manifest) {
    if (!Array.isArray(manifest.entries)) throw Error('Review manifest has no entries array');
    for (const entry of manifest.entries) {
      if (!entry.file || !entry.png) throw Error('Review manifest entry has no original PNG binding');
      bundlePNGs(entry, 'review-capture-manifest', { lab: entry.lab, run: entry.run });
    }
  }
  const included = [], excluded = [];
  for (const file of files) {
    if (file.relative.startsWith('before/') && isPng(file.relative)) {
      excluded.push({ ...file, reason: 'baseline-png-retained-in-original-full-artifact' });
      continue;
    }
    let part = 'metadata', category = isPng(file.relative) ? 'other-location-png' : 'original-non-png';
    let identity = {};
    if (file.relative.startsWith('after/') && isPng(file.relative)) {
      identity = pngIdentity(file.relative, labs, runs);
      part = PROFILE_PARTS.includes(identity.run) ? identity.run : 'metadata';
      category = part === 'metadata' ? 'additional-profile-after-png' : 'profile-after-png';
    }
    included.push({ ...file, copiedSHA256: file.sourceSHA256, part, category, ...identity, registeredBy: [...(references.get(file.relative) || [])].sort() });
  }
  const afterPNGs = files.filter(file => file.relative.startsWith('after/') && isPng(file.relative));
  if (included.filter(file => file.relative.startsWith('after/') && isPng(file.relative)).length !== afterPNGs.length || included.length + excluded.length !== files.length) throw Error('Source inventory was not partitioned exactly once');
  const partDocuments = new Map(DELIVERY_PARTS.map(part => {
    const selected = included.filter(file => file.part === part);
    return [part, jsonBytes({ schema: 1, kind: 'HIGH_EVIDENCE_DELIVERY_PART', part, quality: 'NOT_ASSESSED_BY_TRANSPORT', files: selected })];
  }));
  const index = {
    schema: 1, kind: 'HIGH_EVIDENCE_DELIVERY', status: 'BYTE_COPY_VERIFIED', quality: 'NOT_ASSESSED_BY_TRANSPORT',
    fullSourceMirror: false, sourceRoot: input, candidateCommit: report.commit ?? null, provenance: report.provenance ?? null,
    sourceFailureCount: Array.isArray(report.failures) ? report.failures.length : null,
    selection: { included: 'Every after PNG, including unregistered/target/supplemental/reference/failure PNGs, and every non-PNG original file. Other-location PNGs are also retained.', excluded: 'Only before PNGs; keep the original full artifact in GitHub/local retention.', additionalProfiles: 'Declared nonstandard runs, including tablet/landscape, are stored in metadata with their original paths.' },
    limits: { maxPartBytes, measured: 'Uncompressed copied files plus generated indexes; upload archive SHA/size is supplied separately by GitHub.' },
    summary: { sourceFiles: files.length, copiedFiles: included.length, excludedBaselinePNGs: excluded.length, afterPNGs: afterPNGs.length, afterPNGBytes: afterPNGs.reduce((n, file) => n + file.bytes, 0), registeredAfterPNGs: references.size },
    parts: DELIVERY_PARTS.map(part => {
      const selected = included.filter(file => file.part === part), document = partDocuments.get(part);
      return { name: part, originalFiles: selected.length, sourceBytes: selected.reduce((n, file) => n + file.bytes, 0), indexFile: 'delivery-part.json', indexBytes: document.length, indexSHA256: sha256(document), actualDirectoryBytes: 0 };
    }),
    files: included, excluded,
    limitations: ['This delivery adds no math, browser, visual or completeness PASS.', 'Original results, comparison and source bindings remain byte-identical, including failures and missing capture states.', 'The existing full artifact and strict review aggregate remain authoritative; these additive parts do not enter that aggregate.']
  };
  let indexDocument;
  for (let attempt = 0; attempt < 10; attempt++) {
    indexDocument = jsonBytes(index);
    let stable = true;
    for (const part of index.parts) {
      const size = part.sourceBytes + part.indexBytes + (part.name === 'metadata' ? indexDocument.length : 0);
      if (size !== part.actualDirectoryBytes) { part.actualDirectoryBytes = size; stable = false; }
    }
    if (stable) break;
    indexDocument = null;
  }
  if (!indexDocument) throw Error('Delivery index byte size did not stabilize');
  for (const part of index.parts) if (part.actualDirectoryBytes > maxPartBytes) throw Error(`Part exceeds byte cap without dropping files: ${part.name} ${part.actualDirectoryBytes} > ${maxPartBytes}`);
  fs.mkdirSync(out, { recursive: true });
  for (const part of DELIVERY_PARTS) fs.mkdirSync(path.join(out, part));
  for (const file of included) {
    const target = path.join(out, file.part, file.relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(input, file.relative), target, fs.constants.COPYFILE_EXCL);
    const readback = fs.readFileSync(target);
    if (readback.length !== file.bytes || sha256(readback) !== file.sourceSHA256) throw Error(`Copied evidence changed: ${file.relative}`);
  }
  for (const [part, bytes] of partDocuments) fs.writeFileSync(path.join(out, part, 'delivery-part.json'), bytes, { flag: 'wx' });
  fs.writeFileSync(path.join(out, 'metadata', 'delivery-index.json'), indexDocument, { flag: 'wx' });
  for (const part of index.parts) {
    const measured = inventory(path.join(out, part.name));
    const size = measured.reduce((n, file) => n + file.bytes, 0);
    if (size !== part.actualDirectoryBytes || size > maxPartBytes || measured.length !== part.originalFiles + 1 + (part.name === 'metadata' ? 1 : 0)) throw Error(`Actual part inventory differs: ${part.name}`);
  }
  return { index, indexPath: path.join(out, 'metadata', 'delivery-index.json'), indexSHA256: sha256(indexDocument) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2), options = new Map();
  if (args.length === 1 && args[0] === '--help') console.log('Usage: node high-evidence-delivery.mjs --input <originalEvidenceRoot> --out <newPartsDirectory>');
  else {
    for (let i = 0; i < args.length; i += 2) {
      const key = args[i], value = args[i + 1];
      if (!['--input', '--out'].includes(key) || options.has(key) || !value || value.startsWith('--')) throw Error('Expected unique --input and --out values');
      options.set(key, value);
    }
    if (options.size !== 2) throw Error('Both --input and --out are required');
    const { index, indexPath, indexSHA256 } = buildEvidenceDelivery({ input: options.get('--input'), out: options.get('--out') });
    console.log(JSON.stringify({ status: index.status, quality: index.quality, summary: index.summary, parts: index.parts, indexPath, indexSHA256 }));
  }
}
