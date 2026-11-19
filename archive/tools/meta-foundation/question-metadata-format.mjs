// The one text form of archive/data/question_metadata.json: top-level keys in their own order, head keys pretty-printed
// with two spaces, `records` one compact record per line. Same content and key order as the old pretty form, but about 20% smaller:
// the pretty form reached GitHub's 100 MB file limit. Every writer and every "did the file change?" comparison uses this function.
//
// Shards (docs/agents/git-evidence.md, "정본 시험지 조각"): git tracks one file per exam (archive/data/question-metadata/v1/<sha256 of
// sourceArchiveFile>.json, that exam's records in questionUid order, one record per line) plus one head file (_head.json: every
// top-level key except `records`, in order). archive/data/question_metadata.json is the ASSEMBLED file: ignored by git, present in every
// working folder, byte-identical to questionMetadataText(assemble(shards)). Readers keep reading the assembled file. Writers keep
// writing it and then call syncMetadataShards(root); before writing they call assertMetadataAssembledCurrent(root).
// A repository without the shard folder (the temporary repositories of tests) behaves exactly as before: one file, no shards.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const META_FILE = 'archive/data/question_metadata.json';
export const SHARD_DIR = 'archive/data/question-metadata/v1';
export const HEAD_FILE = '_head.json';
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const ASSEMBLE_HINT = 'run: node archive/tools/meta-foundation/question-metadata-format.mjs assemble';

export function questionMetadataText(doc) {
  const parts = Object.keys(doc).map(key => {
    if (key === 'records' && Array.isArray(doc.records) && doc.records.length)
      return `  "records": [\n${doc.records.map(record => `    ${JSON.stringify(record)}`).join(',\n')}\n  ]`;
    return `  ${JSON.stringify(key)}: ${JSON.stringify(doc[key], null, 2).replace(/\n/g, '\n  ')}`;
  });
  return `{\n${parts.join(',\n')}\n}\n`;
}

export const shardKey = sourceArchiveFile => sha256(String(sourceArchiveFile)) + '.json';
export const hasShards = root => fs.existsSync(path.join(root, SHARD_DIR));
const byUid = (a, b) => (a.questionUid < b.questionUid ? -1 : a.questionUid > b.questionUid ? 1 : 0);

// document -> { head: text, shards: Map(fileName -> text) }. Records are ordered by questionUid (the order of the assembled file).
export function splitDocument(doc) {
  const keys = Object.keys(doc);
  const at = keys.indexOf('records');
  if (at < 0 || !Array.isArray(doc.records)) throw new Error('question metadata document has no records array');
  const head = { recordsPosition: at };
  for (const key of keys) if (key !== 'records') head[key] = doc[key];
  const groups = new Map();
  for (const record of [...doc.records].sort(byUid)) {
    const key = shardKey(record.sourceArchiveFile);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(record);
  }
  const shards = new Map();
  for (const [key, records] of groups) shards.set(key, `[\n${records.map(record => `  ${JSON.stringify(record)}`).join(',\n')}\n]\n`);
  return { head: JSON.stringify(head, null, 2) + '\n', shards };
}

// head text + shard texts -> document (records merged in questionUid order, placed at the recorded key position).
export function assembleDocument(headText, shardTexts) {
  const head = JSON.parse(headText);
  const at = head.recordsPosition;
  delete head.recordsPosition;
  const records = [];
  for (const text of shardTexts) records.push(...JSON.parse(text));
  records.sort(byUid);
  const doc = {};
  const keys = Object.keys(head);
  keys.slice(0, at).forEach(key => { doc[key] = head[key]; });
  doc.records = records;
  keys.slice(at).forEach(key => { doc[key] = head[key]; });
  return doc;
}

function readShardFiles(root) {
  const dir = path.join(root, SHARD_DIR);
  const names = fs.readdirSync(dir).filter(name => name.endsWith('.json') && name !== HEAD_FILE).sort();
  return { headText: fs.readFileSync(path.join(dir, HEAD_FILE), 'utf8'), names, texts: names.map(name => fs.readFileSync(path.join(dir, name), 'utf8')) };
}

export function assembledTextFromShards(root) {
  const { headText, texts } = readShardFiles(root);
  return questionMetadataText(assembleDocument(headText, texts));
}

const metaPath = root => path.join(root, META_FILE);

// Fails (one line) when the assembled file is missing or not what the shards assemble to. Writers call this before they write.
export function assertMetadataAssembledCurrent(root) {
  if (!hasShards(root)) return;
  if (!fs.existsSync(metaPath(root))) throw new Error(`question metadata assembled file is missing (${ASSEMBLE_HINT})`);
  if (fs.readFileSync(metaPath(root), 'utf8') !== assembledTextFromShards(root))
    throw new Error(`question metadata assembled file differs from the shards (${ASSEMBLE_HINT})`);
}

// After a writer wrote the assembled file: bring the shards in line (changed shards only, removed exams deleted, head refreshed).
export function syncMetadataShards(root) {
  if (!hasShards(root)) return { changed: 0, removed: 0, head: false };
  const doc = JSON.parse(fs.readFileSync(metaPath(root), 'utf8'));
  const sorted = [...doc.records].sort(byUid);
  // The assembled file must already be in shard order, otherwise the shards could not reproduce it byte for byte.
  const text = questionMetadataText(doc);
  if (text !== questionMetadataText({ ...doc, records: sorted }))
    throw new Error('question metadata records are not in questionUid order (the shards would not reproduce the file)');
  const { head, shards } = splitDocument(doc);
  const dir = path.join(root, SHARD_DIR);
  let changed = 0, removed = 0, headChanged = false;
  const existing = new Set(fs.readdirSync(dir).filter(name => name.endsWith('.json') && name !== HEAD_FILE));
  for (const [name, content] of shards) {
    const file = path.join(dir, name);
    if (existing.has(name) && fs.readFileSync(file, 'utf8') === content) continue;
    fs.writeFileSync(file, content, 'utf8'); changed++;
  }
  for (const name of existing) if (!shards.has(name)) { fs.rmSync(path.join(dir, name)); removed++; }
  const headFile = path.join(dir, HEAD_FILE);
  if (!fs.existsSync(headFile) || fs.readFileSync(headFile, 'utf8') !== head) { fs.writeFileSync(headFile, head, 'utf8'); headChanged = true; }
  return { changed, removed, head: headChanged };
}

// The write for a writer that has the final text: check, write the assembled file, then the shards.
export function writeMetadataText(root, text) {
  assertMetadataAssembledCurrent(root);
  fs.mkdirSync(path.dirname(metaPath(root)), { recursive: true });
  fs.writeFileSync(metaPath(root), text, 'utf8');
  syncMetadataShards(root);
}

// For finished one-off campaign tools that write archive/data/question_metadata.json directly: with shards the file is an ignored
// assembly, so such a write would be silently lost from the commit. Stop with one line instead (a loud stop beats a silent loss).
export function refuseDirectMetadataWrite(root, toolName) {
  if (hasShards(root))
    throw new Error(`${toolName} writes archive/data/question_metadata.json directly and does not write the shards back ("조각으로 되쓰지 않는 도구"); use a shard-aware registrar (writeMetadataText/syncMetadataShards in question-metadata-format.mjs)`);
}

// shards -> assembled file (the command to run in a fresh working folder). Returns true when the file was (re)written.
export function assembleMetadataFile(root) {
  if (!hasShards(root)) throw new Error(`no shard folder: ${SHARD_DIR}`);
  const text = assembledTextFromShards(root);
  const file = metaPath(root);
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === text) return false;
  fs.writeFileSync(file, text, 'utf8');
  return true;
}

// assembled file -> shards (one-time conversion and "I edited the assembled file by hand" repair of the other direction).
export function splitMetadataFile(root) {
  fs.mkdirSync(path.join(root, SHARD_DIR), { recursive: true });
  return syncMetadataShards(root);
}

const git = (root, args, options = {}) => execFileSync('git', args, { cwd: root, maxBuffer: 1 << 30, stdio: ['ignore', 'pipe', 'pipe'], ...options });

// The file text of archive/data/question_metadata.json at a commit: older commits carry the single file, later ones the shards.
const atMemo = new Map();
export function questionMetadataBytesAt(root, ref) {
  const memoKey = /^[a-f0-9]{40}$/.test(ref) ? path.resolve(root) + '|' + ref : null;
  if (memoKey && atMemo.has(memoKey)) return atMemo.get(memoKey);
  const bytes = readMetadataBytesAt(root, ref);
  if (memoKey) atMemo.set(memoKey, bytes);
  return bytes;
}
function readMetadataBytesAt(root, ref) {
  try { return git(root, ['show', `${ref}:${META_FILE}`]); } catch { /* fall through to the shards */ }
  const listing = git(root, ['ls-tree', '-r', `${ref}`, '--', SHARD_DIR + '/']).toString('utf8').trim().split('\n').filter(Boolean);
  if (!listing.length) throw new Error(`question metadata not found at ${ref}`);
  const entries = listing.map(line => {
    const match = /^\d+ blob ([a-f0-9]{40})\t(.+)$/.exec(line);
    if (!match) throw new Error(`unexpected ls-tree line: ${line}`);
    return { blob: match[1], name: path.posix.basename(match[2]) };
  });
  const out = execFileSync('git', ['cat-file', '--batch'], { cwd: root, input: entries.map(entry => entry.blob).join('\n') + '\n', maxBuffer: 1 << 30 });
  let at = 0;
  const texts = new Map();
  for (const entry of entries) {
    const lineEnd = out.indexOf(10, at);
    const [, , size] = out.toString('latin1', at, lineEnd).split(' ');
    const start = lineEnd + 1;
    texts.set(entry.name, out.toString('utf8', start, start + Number(size)));
    at = start + Number(size) + 1;
  }
  const headText = texts.get(HEAD_FILE);
  if (!headText) throw new Error(`question metadata head missing at ${ref}`);
  const shardTexts = [...texts].filter(([name]) => name !== HEAD_FILE).sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([, text]) => text);
  return Buffer.from(questionMetadataText(assembleDocument(headText, shardTexts)), 'utf8');
}
export const questionMetadataTextAt = (root, ref) => questionMetadataBytesAt(root, ref).toString('utf8');

// CLI: assemble | split | check
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const command = process.argv[2];
  const rootAt = process.argv.indexOf('--root');
  const root = rootAt > 0 ? path.resolve(process.argv[rootAt + 1]) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
  try {
    if (command === 'assemble') console.log(assembleMetadataFile(root) ? 'assembled question_metadata.json from shards' : 'question_metadata.json already matches the shards');
    else if (command === 'split') console.log(JSON.stringify(splitMetadataFile(root)));
    else if (command === 'check') { assertMetadataAssembledCurrent(root); console.log('question_metadata.json matches the shards'); }
    else { console.error('usage: question-metadata-format.mjs assemble|split|check [--root <repo>]'); process.exit(2); }
  } catch (error) { console.error(`Error: ${error.message}`); process.exit(1); }
}
