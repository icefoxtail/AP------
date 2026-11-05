#!/usr/bin/env node
// 작업 브랜치의 4칸 증거 파일을 main용 compact 파일로 바꿔 넣는다.
// 사용: node tools/4slot/import-4slot.cjs --from-ref origin/work/4slot-annotate-v1 --reviewer <이름>
//        [--only <시험지 경로>...] [--sampled <시험지 경로>=<번호,번호>] [--at YYYY-MM-DD] [--dry-run]
// 절차와 이유: docs/operations/JS_Archive_4Slot_Review_and_Main_Import_CURRENT_v1.md
// 쓰는 곳: archive/data/item-4slot/<시험지 경로 .js → .4slot.json>. 시험지 JS·question_metadata.json·등록기는 건드리지 않는다.
// 실제 가져오기는 --only가 필수다(검수를 통과한 시험지만). --only 없이는 --dry-run으로 목록만 본다.
// --only로 이미 있는 파일을 다시 가져오면 덮어쓰되 reviewedBy.sampled/at는 --sampled/--at를 주지 않는 한 그대로 둔다. 같은 입력이면 같은 결과가 나온다.
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const { validateData, buildLookup, loadDict, norm, REPO_ROOT, DEFAULT_DICT } = require('./validate-4slot.cjs');

const WORK_DIR = 'archive-work/4slot-annotate-v1';
const OUT_PREFIX = WORK_DIR + '/out/';
const DEST_DIR = 'archive/data/item-4slot';
const SCHEMA = 'archive-meta-4slot-compact-v1';
const SLOTS = ['given', 'goal', 'method', 'condition'];
const { loadExam, itemLookup } = require('./exam-items.cjs');

function git(args, opts = {}) {
  return execFileSync('git', ['-C', REPO_ROOT, '-c', 'core.quotepath=false', ...args], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'], ...opts });
}
function gitTry(args) { try { return git(args).trim(); } catch { return null; } }

function parseArgs(argv) {
  const o = { only: [], sampled: new Map(), reviewer: null, fromRef: null, at: null, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--from-ref') o.fromRef = argv[++i];
    else if (a === '--reviewer') o.reviewer = argv[++i];
    else if (a === '--at') o.at = argv[++i];
    else if (a === '--dry-run') o.dryRun = true;
    else if (a === '--only') { while (i + 1 < argv.length && !argv[i + 1].startsWith('--')) o.only.push(argv[++i]); }
    else if (a === '--sampled') {
      const [p, list] = String(argv[++i] || '').split('=');
      o.sampled.set(examKey(p), (list || '').split(',').map(s => s.trim()).filter(Boolean).map(Number));
    } else throw new Error('unknown argument ' + a);
  }
  return o;
}

// 시험지 경로(original/...js) · 출력 경로(out/original/...4slot.json) · compact 경로를 같은 열쇠로 맞춘다.
function examKey(p) {
  let s = String(p).replace(/\\/g, '/');
  const i = s.indexOf('/out/');
  if (i >= 0 && s.startsWith(WORK_DIR)) s = s.slice(i + 5);
  s = s.replace(/^archive\/data\/item-4slot\//, '').replace(/^archive\/exams\//, '');
  return s.replace(/\.4slot\.json$/, '').replace(/\.js$/, '');
}

function refFile(ref, p) { return git(['show', `${ref}:${p}`]); }
function refHas(ref, p) { return gitTry(['cat-file', '-e', `${ref}:${p}`]) !== null; }

function listOutFiles(ref) {
  const raw = git(['ls-tree', '-r', '-z', '--name-only', ref, '--', OUT_PREFIX]);
  return raw.split('\0').filter(f => f.endsWith('.4slot.json')).sort();
}

function readRejected(ref) {
  const p = WORK_DIR + '/REVIEW-rejected.json';
  if (!refHas(ref, p)) return new Map();
  const j = JSON.parse(refFile(ref, p));
  const rows = Array.isArray(j) ? j : (j.rejected || j.list || []);
  return new Map(rows.map(r => [examKey(r.path), r]));
}

function readQueue(ref) {
  const p = WORK_DIR + '/QUEUE-original.json';
  if (!refHas(ref, p)) return new Map();
  const j = JSON.parse(refFile(ref, p));
  return new Map((j.list || []).map(r => [examKey(r.path), r]));
}

// 슬롯 항목 → 용어 번호. 사전 용어는 번호 배열, 사전에 없는 말(후보)은 candidates로 보낸다.
function compactItem(it, lut, sourceLookup) {
  const ordinal = sourceLookup ? sourceLookup.get(String(it.sourceOrdinal))?.ordinal : Number(it.sourceOrdinal);
  if (!Number.isInteger(ordinal) || ordinal < 1) throw new Error('UNRESOLVED_SOURCE_ORDINAL ' + it.sourceOrdinal);
  const out = { ordinal, format: it.format };
  const cands = [];
  for (const s of SLOTS) {
    const ids = [];
    for (const e of (it.slots || {})[s] || []) {
      let t = lut.get(norm(e.term));
      if (t && t.status === 'ALIAS' && t.aliasOf) t = lut.get('#' + t.aliasOf) || t;
      if (!t || t.status === 'CANDIDATE') { if (!cands.includes(e.term)) cands.push(e.term); continue; }
      if (!ids.includes(t.id)) ids.push(t.id);
    }
    out[s] = ids;
  }
  out.candidates = cands;
  return out;
}

function serialize(c) {
  const head = ['schemaVersion', 'sourceArchiveFile', 'sourceGitBlobSha', 'dictionaryVersion', 'evidence', 'reviewedBy'];
  if (c.identityReconciliation) head.push('identityReconciliation');
  const lines = head.map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(c[k])}`);
  lines.push('  "items": [\n' + c.items.map(i => '    ' + JSON.stringify(i)).join(',\n') + '\n  ]');
  return '{\n' + lines.join(',\n') + '\n}\n';
}

function main() {
  const o = parseArgs(process.argv.slice(2));
  if (!o.fromRef) throw new Error('--from-ref <ref> is required');
  if (!o.reviewer && !o.dryRun) throw new Error('--reviewer <name> is required (reviewedBy.agent is recorded in every file)');
  if (!o.dryRun && !o.only.length) throw new Error('a real import needs --only <exam path>... (only exams that passed review). Without --only the tool would import every unreviewed output; use --dry-run to list them.');
  const today = new Date().toISOString().slice(0, 10);
  const refCommit = git(['rev-parse', o.fromRef]).trim();
  const branch = o.fromRef.replace(/^(refs\/remotes\/)?origin\//, '').replace(/^refs\/heads\//, '');
  const dict = loadDict(REPO_ROOT, DEFAULT_DICT);
  const lut = buildLookup(dict);
  for (const t of dict.terms) lut.set('#' + t.id, t);
  const rejected = readRejected(o.fromRef);
  const queue = readQueue(o.fromRef);
  const onlyKeys = new Set(o.only.map(examKey));

  let outs = listOutFiles(o.fromRef);
  if (onlyKeys.size) {
    const have = new Set(outs.map(examKey));
    for (const k of onlyKeys) if (!have.has(k)) { /* reported below */ }
    outs = outs.filter(f => onlyKeys.has(examKey(f)));
  }
  const summary = { fromRef: o.fromRef, refCommit, dictionaryVersion: dict.dictionaryVersion, imported: [], skipped: [], alreadyImported: 0, warnTotal: 0 };
  for (const k of onlyKeys) if (!outs.some(f => examKey(f) === k)) summary.skipped.push({ path: k + '.js', reason: 'NO_OUT_FILE', detail: 'no out file on ' + o.fromRef });

  for (const outPath of outs) {
    const key = examKey(outPath), examPath = key + '.js';
    const destRel = `${DEST_DIR}/${key}.4slot.json`;
    const dest = path.join(REPO_ROOT, destRel);
    const skip = (reason, detail) => summary.skipped.push({ path: examPath, reason, detail });
    if (!onlyKeys.size && fs.existsSync(dest)) { summary.alreadyImported++; continue; }
    if (rejected.has(key)) { skip('REJECTED', rejected.get(key).reason || ''); continue; }
    let d;
    try { d = JSON.parse(refFile(o.fromRef, outPath)); } catch (e) { skip('BAD_JSON', e.message.slice(0, 120)); continue; }
    if (examKey(d.sourceArchiveFile || '') !== key) { skip('BAD_PATH', `sourceArchiveFile ${d.sourceArchiveFile} != out path`); continue; }
    const examFile = 'archive/exams/' + examPath;
    const curBlob = gitTry(['rev-parse', `HEAD:${examFile}`]);
    if (!curBlob) { skip('EXAM_MISSING', examFile + ' not in HEAD'); continue; }
    // 기준은 큐의 blob(큐를 만든 origin/main 시점)이다. 파일 안의 sourceGitBlobSha는 작업자가 손으로 옮겨 적은 값이라
    // 틀린 것이 있었다(없는 객체 번호). 큐 항목이 없을 때만 파일 값을 기준으로 쓴다.
    const qBlob = queue.get(key) && queue.get(key).blob;
    const refBlob = qBlob || d.sourceGitBlobSha;
    if (refBlob !== curBlob) { skip('SOURCE_CHANGED', `${qBlob ? 'queue' : 'file'} ${refBlob} HEAD ${curBlob}`); continue; }
    const fileBlobWrong = d.sourceGitBlobSha !== curBlob;
    // 검사기는 작업 트리의 시험지를 읽는다. HEAD와 작업 트리가 다르면(수정 중) 가져오지 않는다.
    const wtBlob = gitTry(['hash-object', path.join(REPO_ROOT, examFile)]);
    if (wtBlob !== curBlob) { skip('SOURCE_CHANGED', `working tree ${wtBlob} != HEAD ${curBlob}`); continue; }
    const v = validateData(d, { root: REPO_ROOT, dict, lut });
    if (v.fail.length) { skip('VALIDATION_FAIL', `${v.fail.length} FAIL; first: ${v.fail.slice(0, 3).join(' | ')}`); continue; }
    const commit = git(['log', '-1', '--format=%H', o.fromRef, '--', outPath]).trim();
    // 덮어쓸 때는 이전 검수 기록(표본 번호, 날짜)을 지키고, --sampled/--at를 줄 때만 바꾼다.
    let prev = null;
    try { prev = JSON.parse(fs.readFileSync(dest, 'utf8')).reviewedBy || null; } catch { /* 새 파일 */ }
    const at = o.at || (prev && prev.at) || today;
    const sampled = (o.sampled.has(key) ? o.sampled.get(key) : (prev && Array.isArray(prev.sampled) ? prev.sampled : [])).slice().sort((a, b) => a - b);
    const compact = {
      schemaVersion: SCHEMA,
      sourceArchiveFile: examPath,
      sourceGitBlobSha: curBlob,
      dictionaryVersion: dict.dictionaryVersion,
      evidence: { branch, commit, path: outPath },
      reviewedBy: { agent: o.reviewer || '(dry-run)', at, sampled },
      items: (d.items || []).map(it => compactItem(it, lut, itemLookup(loadExam(path.join(REPO_ROOT, 'archive/exams', d.sourceArchiveFile))))).sort((a, b) => a.ordinal - b.ordinal)
    };
    const text = serialize(compact);
    JSON.parse(text);
    if (!o.dryRun) { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, text); }
    summary.warnTotal += v.warn.length;
    summary.imported.push({ path: examPath, items: compact.items.length, bytes: Buffer.byteLength(text), warn: v.warn.length, evidenceCommit: commit.slice(0, 8), ...(fileBlobWrong ? { fileBlobFieldWrong: d.sourceGitBlobSha } : {}) });
  }
  console.log(JSON.stringify(summary, null, 2));
  process.exit(0);
}

if (require.main === module) {
  try { main(); } catch (e) { console.error('ERROR ' + e.message); process.exit(2); }
}
module.exports = { examKey, compactItem, serialize };
