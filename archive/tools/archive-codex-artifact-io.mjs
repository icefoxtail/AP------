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
  if(fs.existsSync(file)){const real=fs.realpathSync(file),rr=path.relative(fs.realpathSync(root),real);if(rr==='..'||rr.startsWith('..'+path.sep)||path.isAbsolute(rr))throw Error('SYMLINK_ESCAPE:'+relative);}
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
export function gitBlobReader(root,revision){
  const tree=execFileSync('git',['-C',root,'ls-tree','-r','-z',revision],{maxBuffer:128*1024*1024}).toString('utf8').split('\0').filter(Boolean);
  const ids=new Map(tree.map(s=>{const n=s.indexOf('\t');return [s.slice(n+1),s.slice(0,n).split(' ')[2]];}));
  return p=>{const oid=ids.get(p);if(!oid)throw Error('REMOTE_OBJECT_MISSING:'+p);return execFileSync('git',['-C',root,'cat-file','blob',oid],{maxBuffer:128*1024*1024});};
}
export function readGitObjects(root,revision,paths){
  const read=gitBlobReader(root,revision);return paths.map(p=>({path:p,bytes:read(p)}));
}
