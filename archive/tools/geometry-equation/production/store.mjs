import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {AsyncLocalStorage} from 'node:async_hooks';
import {canonicalJson, objectSha, fileRef, readBoundFile, safePath, HASH_PATTERN} from '../../pipeline-core/canonical.mjs';
import {parseQuestionUidV2} from '../../pipeline-core/question-uid.mjs';

// `archive/_generated` is a historical evidence area. New visual attempts use
// the Archive temporary workspace and keep the production exam basename/path
// intact only inside the isolated candidate overlay.
const LEGACY_ENGINE_ROOT = 'archive/_generated/geometry-visual-engine/production';
const workRootContext = new AsyncLocalStorage();

function validRunId(value) { return typeof value === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(value); }
function validExamUid(value) { return typeof value === 'string' && /^[\p{L}\p{N}_.-]{1,180}$/u.test(value) && value !== '.' && value !== '..'; }

export function validateWorkRoot(relative) {
  if (typeof relative !== 'string' || relative.includes('\\') || relative.includes('\0')) throw Error('INVALID_VISUAL_WORK_ROOT');
  const parts = relative.split('/');
  if (parts.length !== 6 || parts[0] !== '.tmp' || parts[1] !== 'archive' || !validRunId(parts[2]) || !validExamUid(parts[3]) || parts[4] !== 'visual-engine' || parts[5] !== 'production') throw Error('INVALID_VISUAL_WORK_ROOT');
  return relative;
}

export function currentWorkRoot() {
  const scoped = workRootContext.getStore();
  if (!scoped) throw Error('VISUAL_WORKSPACE_CONTEXT_REQUIRED');
  return validateWorkRoot(scoped);
}

export function hasWorkRoot() { return Boolean(workRootContext.getStore()); }

export function withWorkRoot(workRoot, action) {
  if (typeof action !== 'function') throw Error('VISUAL_WORKSPACE_ACTION_REQUIRED');
  return workRootContext.run(validateWorkRoot(workRoot), action);
}

export function isEngineOutputPath(relative) {
  if (typeof relative !== 'string' || relative.includes('\\')) return false;
  const normalized = relative.replace(/^\.\//, '');
  if (normalized.startsWith(LEGACY_ENGINE_ROOT + '/')) return true;
  return normalized.startsWith('.tmp/archive/') && normalized.includes('/visual-engine/production/');
}

export function bindRunWorkspace(root, {questionUid, sourcePath, replayResultRef, runId:requestedRunId} = {}) {
  if (typeof questionUid !== 'string' || !questionUid) throw Error('QUESTION_UID_REQUIRED_FOR_WORKSPACE');
  const {sourceExamId} = parseQuestionUidV2(questionUid);
  const examUid = sourcePath ? path.basename(sourcePath, path.extname(sourcePath)) : sourceExamId;
  if (!validExamUid(examUid) || examUid !== sourceExamId) throw Error('SOURCE_EXAM_UID_MISMATCH');
  let runId = requestedRunId || `visual-${crypto.randomUUID()}`;
  if (!validRunId(runId)) throw Error('INVALID_VISUAL_RUN_ID');
  if (replayResultRef?.path) {
    const segments = replayResultRef.path.split('/');
    const marker = segments.indexOf('archive');
    if (segments[marker - 1] === '.tmp' && marker >= 1 && segments[marker + 1] && segments[marker + 2] === examUid && segments.slice(marker + 3, marker + 5).join('/') === 'visual-engine/production') {
      runId = segments[marker + 1];
      if (!validRunId(runId)) throw Error('INVALID_REPLAY_WORKSPACE');
    }
  }
  const workRoot = validateWorkRoot(`.tmp/archive/${runId}/${examUid}/visual-engine/production`);
  const absolute = path.resolve(root, workRoot);
  if (!absolute.startsWith(path.resolve(root, '.tmp/archive') + path.sep)) throw Error('VISUAL_WORKSPACE_ESCAPE');
  return {workRoot, runId, examUid};
}

function durableWrite(file, bytes) {
  const fd = fs.openSync(file,'wx');
  try { fs.writeFileSync(fd,bytes); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}
export function generatedPath(root, relative) {
  const workRoot = currentWorkRoot();
  if (!relative.startsWith(workRoot + '/')) throw Error('TEMPORARY_WORKSPACE_REQUIRED');
  const target=safePath(root,relative,{mustExist:false});
  const base=path.join(fs.realpathSync(root),workRoot);
  let existing=target;
  while(!fs.existsSync(existing))existing=path.dirname(existing);
  // Generated junctions must not redirect writes into production even within repo.
  if(fs.existsSync(base) && fs.realpathSync(base)!==base)throw Error('GENERATED_ROOT_REDIRECT');
  if(existing===base || existing.startsWith(base+path.sep)) {
    const actual=fs.realpathSync(existing);
    if(actual!==base && !actual.startsWith(base+path.sep))throw Error('GENERATED_PATH_REDIRECT');
  }
  return target;
}
export function commitStage(root, {stage, key, outputs, provenance, crashAt}) {
  if (!/^[A-Z][A-Z_]*$/.test(stage) || !HASH_PATTERN.test(key) || !outputs || !Object.keys(outputs).length) throw Error('INVALID_STAGE');
  const base = currentWorkRoot() + '/stages/' + stage + '/' + key.slice(7);
  const final = generatedPath(root,base);
  fs.mkdirSync(path.dirname(final),{recursive:true});
  const lock = final + '.lock';
  const fd = fs.openSync(lock,'wx');
  const staging = base + '.staging-' + crypto.randomUUID();
  try {
    if (fs.existsSync(final)) throw Error('IMMUTABLE_STAGE_EXISTS');
    fs.mkdirSync(generatedPath(root,staging));
    for (const [name,bytes] of Object.entries(outputs)) {
      if (!/^[\p{L}\p{N}][\p{L}\p{N}_.-]*$/u.test(name) || name === 'manifest.json') throw Error('INVALID_STAGE_OUTPUT');
      if (!(typeof bytes === 'string' || Buffer.isBuffer(bytes))) throw Error('OUTPUT_BYTES_REQUIRED');
      durableWrite(generatedPath(root,staging+'/'+name),bytes);
    }
    if (crashAt === 'outputs') throw Error('INJECTED_CRASH');
    const refs = Object.keys(outputs).sort().map(name => fileRef(root,staging+'/'+name));
    const receipt = {schemaVersion:'VISUAL_STAGE_RECEIPT_v1',stage,key,provenance,outputs:refs.map(ref => ({...ref,path:base+'/'+path.basename(ref.path)}))};
    refs.forEach(ref => readBoundFile(root,ref));
    durableWrite(generatedPath(root,staging+'/manifest.json'),canonicalJson({...receipt,receiptSha256:objectSha(receipt)}));
    if (crashAt === 'manifest') throw Error('INJECTED_CRASH');
    // Same-volume directory rename exposes all files and the final manifest together.
    fs.renameSync(generatedPath(root,staging),final);
    return loadStage(root,stage,key);
  } finally {fs.closeSync(fd);fs.unlinkSync(lock);}
}
export function loadStage(root, stage, key) {
  if (!/^[A-Z][A-Z_]*$/.test(stage) || !HASH_PATTERN.test(key)) throw Error('INVALID_STAGE');
  const base = currentWorkRoot() + '/stages/' + stage + '/' + key.slice(7);
  const target = generatedPath(root,base+'/manifest.json');
  if (!fs.existsSync(target)) return null;
  const {receiptSha256,...receipt} = JSON.parse(fs.readFileSync(safePath(root,base+'/manifest.json'),'utf8'));
  if (receipt.stage !== stage || receipt.key !== key || objectSha(receipt) !== receiptSha256 || !receipt.outputs?.length) throw Error('STALE_STAGE_RECEIPT');
  for (const ref of receipt.outputs) {
    if (!ref.path.startsWith(base+'/') || ref.path.slice(base.length+1).includes('/')) throw Error('STAGE_OUTPUT_ESCAPE');
    readBoundFile(root,ref);
  }
  return {...receipt,receiptSha256,manifestRef:fileRef(root,base+'/manifest.json')};
}
export async function calculationStage(root, config, producer) {
  // Only calculation bytes are reusable. Source/reviewer authorization is not cached.
  if (!['MATH','TYPESET','MEASURE','LAYOUT','BUILD'].includes(config.stage)) throw Error('EVIDENCE_CACHE_FORBIDDEN');
  const hit = loadStage(root,config.stage,config.key);
  if (hit) return {receipt:hit,cacheHit:true,currentProvenance:config.provenance};
  return {receipt:commitStage(root,{...config,outputs:await producer()}),cacheHit:false,currentProvenance:config.provenance};
}
