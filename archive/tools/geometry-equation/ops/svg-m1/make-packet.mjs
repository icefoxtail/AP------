// usage: node make-packet.mjs <exam js path> <out.json> [--with-existing]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import portable from './portable-root.cjs';
const [src,out,flag]=process.argv.slice(2);
if(!src||!out) throw Error('exam source and output are required');
const root=portable.repoRoot(), source=path.resolve(root,src), archive=path.join(root,'archive');
const relative=path.relative(root,source);
if(relative.startsWith('..'+path.sep)||path.isAbsolute(relative)) throw Error('source is outside repository');
const c={window:{}};vm.runInNewContext(fs.readFileSync(source,'utf8'),c);
const bank=c.window.questionBank||c.window.examData?.questions;
if(!Array.isArray(bank)||!bank.length) throw Error('questionBank is missing or empty');
const exam=path.basename(source,'.js');
function imagePath(ref){
  if(typeof ref!=='string'||!ref.trim()) throw Error('invalid image reference');
  const raw=ref.trim();
  if(/^(?:https?:|data:|blob:)/i.test(raw)) return null;
  const clean=raw.split(/[?#]/,1)[0].replace(/\\/g,'/');
  if(path.posix.isAbsolute(clean)||/^[a-z]:/i.test(clean)||clean.split('/').includes('..')) throw Error(`unsupported image reference: ${ref}`);
  // Archive engine resolves asset URLs from archive/; legacy source-local assets are
  // accepted only at the exact reference relative to this exam's directory.
  const main=path.resolve(archive,clean), local=path.resolve(path.dirname(source),clean);
  if(fs.existsSync(main)&&fs.statSync(main).isFile()) return main;
  if(fs.existsSync(local)&&fs.statSync(local).isFile()) return local;
  throw Error(`image reference not found: ${ref} (exam ${exam})`);
}
const ids=new Set();
const items=bank.map((q,i)=>{
  if(!q||!(Number.isInteger(q.id)&&q.id===i+1||typeof q.id==='string'&&/^[A-Za-z][A-Za-z0-9_-]{0,31}$/.test(q.id))||ids.has(q.id)) throw Error(`invalid question id/ordinal at ${i+1}`);
  ids.add(q.id);
  const content=q.content||q.question;
  if(typeof content!=='string'||!content.trim()) throw Error(`missing content for q${q.id}`);
  const r={ord:q.id,type:q.questionType,unit:q.standardUnit,subUnit:q.subUnit,content,
    ...(Object.hasOwn(q,'choices')?{choices:q.choices}:{}),...(Object.hasOwn(q,'answer')?{answer:q.answer}:{}),
    ...(Object.hasOwn(q,'solution')?{solution:q.solution}:{}),...(q.sharedMaterial?{sharedMaterial:q.sharedMaterial}:{}),
    questionImage:q.image?imagePath(q.image):null};
  if(q.image)r.questionImageSource=q.image;
  if(Array.isArray(q.images))r.imageSources=q.images;
  const inline=[];
  for(const match of content.matchAll(/<img\b[^>]*?\bsrc\s*=\s*(["'])(.*?)\1[^>]*>/gi)) inline.push({src:match[2],path:imagePath(match[2])});
  if(inline.length)r.inlineImages=inline;
  if(flag==='--with-existing'&&q.solutionImage){r.existingSolutionImage=imagePath(q.solutionImage);r.existingSolutionImageSource=q.solutionImage;}
  return r;
});
// Validate every item before writing, preserving any existing output on failure.
fs.writeFileSync(out,JSON.stringify({exam,sourcePath:relative.split(path.sep).join('/'),items},null,1));
console.log(exam,items.length,'items');
