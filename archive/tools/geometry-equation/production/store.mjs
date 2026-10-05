import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {canonicalJson, objectSha, fileRef, readBoundFile, safePath, HASH_PATTERN} from '../../pipeline-core/canonical.mjs';

export const GENERATED_ROOT = 'archive/_generated/geometry-visual-engine/production';
function durableWrite(file, bytes) {
  const fd = fs.openSync(file,'wx');
  try { fs.writeFileSync(fd,bytes); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}
export function generatedPath(root, relative) {
  if (!relative.startsWith(GENERATED_ROOT + '/')) throw Error('GENERATED_ONLY');
  return safePath(root,relative,{mustExist:false});
}
export function commitStage(root, {stage, key, outputs, provenance, crashAt}) {
  if (!/^[A-Z][A-Z_]*$/.test(stage) || !HASH_PATTERN.test(key) || !outputs || !Object.keys(outputs).length) throw Error('INVALID_STAGE');
  const base = GENERATED_ROOT + '/stages/' + stage + '/' + key.slice(7);
  const final = generatedPath(root,base);
  fs.mkdirSync(path.dirname(final),{recursive:true});
  const lock = final + '.lock';
  const fd = fs.openSync(lock,'wx');
  const staging = base + '.staging-' + crypto.randomUUID();
  try {
    if (fs.existsSync(final)) throw Error('IMMUTABLE_STAGE_EXISTS');
    fs.mkdirSync(generatedPath(root,staging));
    for (const [name,bytes] of Object.entries(outputs)) {
      if (!/^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(name) || name === 'manifest.json') throw Error('INVALID_STAGE_OUTPUT');
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
  const base = GENERATED_ROOT + '/stages/' + stage + '/' + key.slice(7);
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
