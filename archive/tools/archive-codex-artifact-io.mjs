import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {gitBlobSha} from './archive-stage-validator-compat-v1.mjs';

export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export function readExam(file) {
  const bytes=fs.readFileSync(file),box={window:{}};
  vm.runInNewContext(bytes.toString('utf8'),box,{timeout:5000,filename:file});
  const questions=box.window.questionBank||box.window.questions;
  if(!Array.isArray(questions)||!questions.length)throw Error('QUESTION_BANK_REQUIRED');
  return {bytes,questions,rawSha256:sha256(bytes),rawBufferGitBlobSha1:gitBlobSha(bytes)};
}
export function inside(root,relative) {
  const file=path.resolve(root,relative),rel=path.relative(path.resolve(root),file);
  if(rel==='..'||rel.startsWith('..'+path.sep)||path.isAbsolute(rel))throw Error('PATH_ESCAPE:'+relative);
  let ancestor=file;while(!fs.existsSync(ancestor)){const parent=path.dirname(ancestor);if(parent===ancestor)throw Error('PATH_ANCESTOR_REQUIRED');ancestor=parent;}const real=fs.realpathSync(ancestor),rr=path.relative(fs.realpathSync(root),real);if(rr==='..'||rr.startsWith('..'+path.sep)||path.isAbsolute(rr))throw Error('SYMLINK_ESCAPE:'+relative);
  return file;
}
export function physical(file){return {path:path.resolve(file),sha256:sha256(fs.readFileSync(file))};}
export function writeFresh(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n',{flag:'wx'});return physical(file);}
export function artifactSnapshot({sourceFile,evidenceFile,assetRoot,questions}) {
  const exam=questions?{questions,bytes:fs.readFileSync(sourceFile)}:readExam(sourceFile),refs=new Set(),issues=[];
  for(const q of exam.questions){for(const k of ['image','solutionImage','visualAsset'])if(q[k])refs.add(q[k]);for(const value of [q.content,q.question,q.solution,q.explanation,q.answer,...(Array.isArray(q.choices)?q.choices:[])])if(typeof value==='string')for(const m of value.matchAll(/<(?:img|image)\b[^>]*?(?:src|href|xlink:href)\s*=\s*["']([^"']+)["']/gi))if(!/^(?:data:|#)/.test(m[1]))refs.add(m[1]);}
  const assets=[];
  for(const ref of refs){try{if(typeof ref!=='string'||!ref.startsWith('assets/images/'))throw Error('PRODUCTION_REF_REQUIRED');const file=inside(assetRoot,ref),bytes=fs.readFileSync(file);assets.push({ref,...physical(file)});if(ref.endsWith('.svg'))for(const m of bytes.toString('utf8').matchAll(/(?:href|xlink:href)\s*=\s*["']([^"']+)["']/gi))if(!/^(?:data:|#)/.test(m[1]))refs.add(path.posix.normalize(path.posix.join(path.posix.dirname(ref),m[1])));}catch(e){issues.push(ref+':'+e.message);}}
  return {schemaVersion:'JS_ARCHIVE_CODEX_PHYSICAL_BINDING_V1',source:{...physical(sourceFile),rawBufferGitBlobSha1:gitBlobSha(exam.bytes)},evidence:physical(evidenceFile),assets:assets.sort((a,b)=>a.ref.localeCompare(b.ref)),issues};
}
export function cleanFilterHash({root,productionPath,bytes}) {
  return execFileSync('git',['-C',root,'hash-object','--path='+productionPath,'--stdin'],{input:bytes,encoding:'utf8'}).trim();
}
export function parseGitBatch(bytes,expected){
  let cursor=0;const out=new Map();
  for(const item of expected){const e=bytes.indexOf(10,cursor);if(e<0)throw Error('GIT_BATCH_HEADER_TRUNCATED');const header=bytes.subarray(cursor,e).toString('ascii').match(/^([a-f0-9]+) blob (\d+)$/);if(!header||header[1]!==item.oid||Number(header[2])!==item.size)throw Error('GIT_BATCH_OBJECT_HEADER_MISMATCH');cursor=e+1;const end=cursor+item.size;if(end>=bytes.length||bytes[end]!==10)throw Error('GIT_BATCH_BODY_TRUNCATED');const body=bytes.subarray(cursor,end);if(gitBlobSha(body)!==item.oid)throw Error('GIT_BATCH_CONTENT_OBJECT_MISMATCH');out.set(item.oid,body);cursor=end+1;}
  if(cursor!==bytes.length)throw Error('GIT_BATCH_TRAILING_BYTES');return out;
}
export function gitBlobReader(root,revision,preloadPaths=[]){
  const tree=execFileSync('git',['-C',root,'ls-tree','-r','-l','-z',revision],{maxBuffer:128*1024*1024}).toString('utf8').split('\0').filter(Boolean);
  const ids=new Map(tree.map(s=>{const n=s.indexOf('\t'),[mode,type,oid,size]=s.slice(0,n).trim().split(/\s+/);return [s.slice(n+1),{mode,type,oid,size:Number(size)}];})),cache=new Map();
  function batch(paths){const items=[...new Map(paths.map(p=>{const item=ids.get(p);if(!item||item.type!=='blob'||!Number.isSafeInteger(item.size))throw Error('REMOTE_OBJECT_MISSING:'+p);if(item.size>128*1024*1024)throw Error('GIT_BLOB_EXCEEDS_BOUNDED_READ:'+p);return [item.oid,item];})).values()].filter(i=>!cache.has(i.oid));let chunk=[],size=0;
    const flush=()=>{if(!chunk.length)return;const bytes=execFileSync('git',['-C',root,'cat-file','--batch'],{input:chunk.map(i=>i.oid+'\n').join(''),maxBuffer:Math.max(1024*1024,size+chunk.length*128+4096)});for(const [oid,body] of parseGitBatch(bytes,chunk))cache.set(oid,body);chunk=[];size=0;};
    for(const item of items){if(chunk.length&&size+item.size>64*1024*1024)flush();chunk.push(item);size+=item.size;}flush();
  }
  const read=p=>{const item=ids.get(p);if(!item)throw Error('REMOTE_OBJECT_MISSING:'+p);if(!cache.has(item.oid))batch([p]);return cache.get(item.oid);};read.batch=paths=>{batch(paths);return paths.map(p=>({path:p,bytes:read(p)}));};if(preloadPaths.length)batch(preloadPaths);return read;
}
export function readGitObjects(root,revision,paths){return gitBlobReader(root,revision).batch(paths);}
