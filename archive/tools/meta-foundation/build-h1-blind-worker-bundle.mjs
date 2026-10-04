#!/usr/bin/env node
/** Build a UID-scoped A/B/C input package with no peer verdict artifacts. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const args = process.argv.slice(2);
const side = ['A', 'B', 'C'].includes(args[0]) ? args.shift() : 'B';
let start;
let end;
let outputArg;
let customQueueFile = null;
if (side === 'C' || args.length === 2) {
  if (args.length !== 2) throw new Error('Usage for UID selection: node build-h1-blind-worker-bundle.mjs A|B|C UID_QUEUE_JSONL OUTPUT_DIR');
  [customQueueFile, outputArg] = args;
} else {
  const [startArg, endArg, target] = args;
  start = Number(startArg);
  end = Number(endArg);
  outputArg = target;
  if (!Number.isInteger(start) || !Number.isInteger(end) || end - start !== 19 || !outputArg) {
    throw new Error('Usage: node build-h1-blind-worker-bundle.mjs [A|B] START END OUTPUT_DIR (exactly 20 UIDs)');
  }
}
const root = process.cwd();
const output = path.resolve(outputArg);
if (fs.existsSync(output)) throw new Error(`Refusing to overwrite existing bundle: ${output}`);
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const readJsonl = file => fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const checkpoint = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const queue = customQueueFile
  ? readJsonl(path.resolve(customQueueFile))
  : readJsonl(path.join(checkpoint, 'H1_STAGEA_REMAINING_QUEUE_1120_UID_ONLY.jsonl'))
    .filter(row => row.queueIndex >= start && row.queueIndex <= end);
if (queue.length < 1 || queue.length > 20 || new Set(queue.map(row => row.questionUid)).size !== queue.length
  || (!customQueueFile && queue.length !== 20)) throw new Error('Queue must have 1-20 unique UIDs (20 for contiguous batches)');
if (customQueueFile) {
  start = queue[0].queueIndex;
  end = queue.at(-1).queueIndex;
} else if (queue[0].queueIndex !== start || queue.at(-1).queueIndex !== end) {
  throw new Error('Queue slice bounds mismatch');
}

const l3ByUid = new Map();
for (const name of fs.readdirSync(checkpoint).filter(name => /^H1_STAGE3_L3_CANDIDATE_.*\.jsonl$/.test(name))) {
  for (const record of readJsonl(path.join(checkpoint, name))) {
    if (l3ByUid.has(record.questionUid)) throw new Error(`Duplicate frozen L3 UID: ${record.questionUid}`);
    l3ByUid.set(record.questionUid, {
      problemTypeKey: record.problemTypeKeyCandidate ?? null,
      status: record.keyStatus ?? null,
      reason: record.l3SemanticReason ?? null,
    });
  }
}
const exams = new Map();
const records = [];
const assets = new Set();
for (const item of queue) {
  const match = /^(.+\.js)#([1-9]\d*)$/.exec(item.sourceIdentity);
  if (!match) throw new Error(`Bad sourceIdentity ${item.sourceIdentity}`);
  const archiveFile = match[1];
  const ordinal = Number(match[2]);
  if (!exams.has(archiveFile)) {
    const sourcePath = path.join(root, 'archive/exams', archiveFile);
    const raw = fs.readFileSync(sourcePath);
    const context = { window: {} };
    vm.runInNewContext(raw.toString('utf8'), context, { filename: sourcePath, timeout: 10000 });
    if (!Array.isArray(context.window.questionBank)) throw new Error(`Missing questionBank: ${archiveFile}`);
    exams.set(archiveFile, { bank: context.window.questionBank, fileSha: hash(raw) });
  }
  const source = exams.get(archiveFile);
  const question = source.bank[ordinal - 1];
  if (!question || Number(question.id) !== ordinal) throw new Error(`Ordinal/id mismatch: ${item.sourceIdentity}`);
  const frozenL3 = l3ByUid.get(item.questionUid);
  if (!frozenL3) throw new Error(`Missing frozen L3 UID ${item.questionUid}`);
  const sourceFingerprint = hash(JSON.stringify({
    content: question.content ?? null,
    choices: Array.isArray(question.choices) ? question.choices : null,
    answer: question.answer ?? null,
    solution: question.solution ?? null,
    image: question.image ?? null,
  }));
  if (item.sourceFingerprint && item.sourceFingerprint !== sourceFingerprint) throw new Error(`Custom queue source drift: ${item.queueIndex}`);
  const contentHash = hash(String(question.content ?? ''));
  const solutionHash = hash(String(question.solution ?? ''));
  const inputBundleSha = hash(JSON.stringify({
    questionUid: item.questionUid,
    sourceIdentity: item.sourceIdentity,
    sourceFingerprint,
    contentHash,
    solutionHash,
  }));
  const visualRefs = new Set();
  if (typeof question.image === 'string' && question.image.startsWith('assets/images/')) visualRefs.add(question.image);
  for (const field of [question.content, question.solution]) {
    for (const hit of String(field ?? '').matchAll(/assets\/images\/[^\s"'<>]+/g)) visualRefs.add(hit[0]);
  }
  const localImagePaths = [];
  for (const ref of visualRefs) {
    const clean = ref.split('?')[0].replaceAll('\\', '/');
    const absolute = path.resolve(root, 'archive', clean);
    const archiveRoot = path.resolve(root, 'archive') + path.sep;
    if (!absolute.startsWith(archiveRoot) || !fs.existsSync(absolute)) throw new Error(`Missing/unsafe image: ${ref}`);
    assets.add(clean);
    localImagePaths.push(clean);
  }
  records.push({
    queueIndex: item.queueIndex,
    questionUid: item.questionUid,
    sourceIdentity: item.sourceIdentity,
    sourceArchiveFile: archiveFile,
    sourceOrdinal: ordinal,
    sourceFingerprint,
    contentHash,
    solutionHash,
    inputBundleSha,
    sourceFileSha256: source.fileSha,
    content: question.content ?? null,
    choices: Array.isArray(question.choices) ? question.choices : null,
    answer: question.answer ?? null,
    solution: question.solution ?? null,
    image: question.image ?? null,
    localImagePaths,
    frozenL3,
  });
}
fs.mkdirSync(path.join(output, 'input'), { recursive: true });
fs.mkdirSync(path.join(output, 'authority'), { recursive: true });
fs.mkdirSync(path.join(output, 'output'), { recursive: true });
const inputFile = path.join(output, 'input', `H1_${side}_${start}_${end}.jsonl`);
fs.writeFileSync(inputFile, records.map(row => JSON.stringify(row)).join('\n') + '\n');
const vocabSource = path.join(root, 'archive/_generated/intelligence/phase1/high1-foundation/one-pass-pilot/worker-input/H1_ONE_PASS_ACTIVE_VOCAB_SANITIZED.json');
const vocabTarget = path.join(output, 'authority', 'H1_ACTIVE_VOCAB_NO_UID.json');
fs.copyFileSync(vocabSource, vocabTarget);
for (const relative of assets) {
  const target = path.join(output, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, 'archive', relative), target);
}
const manifest = {
  schemaVersion: `h1-${side.toLowerCase()}-blind-input-bundle-v1`,
  purpose: `${side} semantic input only; peer/C/other-worker verdicts absent`,
  scope: [start, end],
  queueIndexes: queue.map(row => row.queueIndex),
  queueMode: customQueueFile ? (side === 'C' ? 'UID_ONLY_SELECTED_CONFLICTS' : 'UID_ONLY_TARGETED_REREVIEW') : 'CONTIGUOUS_20',
  count: records.length,
  inputFile: path.relative(output, inputFile).replaceAll('\\', '/'),
  inputSha256: hash(fs.readFileSync(inputFile)),
  vocabularyFile: path.relative(output, vocabTarget).replaceAll('\\', '/'),
  vocabularySha256: hash(fs.readFileSync(vocabTarget)),
  assets: [...assets].sort().map(relative => ({ path: relative, sha256: hash(fs.readFileSync(path.join(output, relative))) })),
  forbiddenContent: side === 'C'
    ? ['A verdict ledgers', 'B verdict ledgers', 'AB comparison', 'pilot hidden assignments']
    : [`${side === 'A' ? 'B' : 'A'} verdict ledgers`, 'C verdict ledgers', 'AB comparison', 'pilot hidden assignments'],
};
fs.writeFileSync(path.join(output, 'bundle-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ output, scope: manifest.scope, count: manifest.count, assets: manifest.assets.length, inputSha256: manifest.inputSha256, vocabularySha256: manifest.vocabularySha256 }));
