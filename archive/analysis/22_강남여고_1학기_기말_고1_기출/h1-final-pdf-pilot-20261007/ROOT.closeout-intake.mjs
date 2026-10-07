import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {gitBlobSha} from '../../../tools/archive-stage-validator.mjs';
import {consumeCodexRenderPass,consumeCodexMainDone,consumeCodexRootWaivedStaticPass,consumeCodexRootWaivedMainDone} from '../../../tools/archive-stage-runtime-v2.mjs';
const [phase,receiptName]=process.argv.slice(2);
if(!['render','static','main-done'].includes(phase)||!receiptName)throw Error('PHASE_RECEIPT_REQUIRED');
const dir=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(dir,'../../../..');
const bound=p=>{const v=path.resolve(root,p),r=path.relative(root,v);if(r.startsWith('..')||path.isAbsolute(r))throw Error('PATH_ESCAPE');return v;};
const receiptBytes=fs.readFileSync(bound(receiptName)),receipt=JSON.parse(receiptBytes);
const sourcePath=receipt.loadedJs?.path||receipt.productionPath;
const bytes=fs.readFileSync(bound(sourcePath)),box={window:{}};
vm.runInNewContext(bytes.toString('utf8'),box,{timeout:5000});
const bank=box.window.questionBank||box.window.questions;
if(!Array.isArray(bank)||bank.length!==24)throw Error('LOCKED_24_QID_BANK_REQUIRED');
const refs=new Set(),html=s=>{if(typeof s==='string')for(const m of s.matchAll(/<(?:img|image)\b[^>]*?(?:src|href|xlink:href)\s*=\s*["']([^"']+)["']/gi))if(!/^(?:data:|#)/.test(m[1]))refs.add(m[1]);};
for(const q of bank){for(const k of ['image','solutionImage','visualAsset'])if(q[k])refs.add(q[k]);for(const k of ['content','question','solution','explanation','sol','answer'])html(q[k]);for(const c of q.choices||[])html(typeof c==='object'?(c.text||c.content||c.value||c.answer||Object.values(c)[0]||''):String(c));}
const hash=b=>createHash('sha256').update(b).digest('hex');
for(const ref of refs){if(!ref.startsWith('assets/images/')||ref.includes('..'))throw Error('ASSET_REF_INVALID');if(ref.endsWith('.svg')){const svg=fs.readFileSync(bound('archive/'+ref),'utf8');for(const m of svg.matchAll(/(?:href|xlink:href)\s*=\s*["']([^"']+)["']/gi))if(!/^(?:data:|#)/.test(m[1]))refs.add(path.posix.normalize(path.posix.join(path.posix.dirname(ref),m[1])));}}
const assets=[...refs].map(ref=>({ref,sha256:hash(fs.readFileSync(bound('archive/'+ref)))})),qids=bank.map(q=>Number(q.id)),artifactSha=gitBlobSha(bytes);
const statePath=path.join(dir,'ROOT.state.json'),state=JSON.parse(fs.readFileSync(statePath));
let consumed;
if(phase==='render')consumed=consumeCodexRenderPass({state,receipt,root,artifactSha,assets,qids});
else if(phase==='static')consumed=consumeCodexRootWaivedStaticPass({state,receipt,root});
else if(receipt.completionBasis==='ROOT_DIRECTED_STATIC_COMPLETE')consumed=consumeCodexRootWaivedMainDone({state,receipt,root});
else {const renderReceipt=JSON.parse(fs.readFileSync(bound(receipt.renderReceipt.path)));consumed=consumeCodexMainDone({state,receipt,root,renderReceipt,assets,qids});}
const out={ok:true,phase,disposition:'PASS',receipt:{path:receiptName,sha256:hash(receiptBytes)},artifactSha,artifactRawSha256:hash(bytes),questionCount:qids.length,assetCount:assets.length,consumerState:consumed.state,...(consumed.closure?{closure:consumed.closure}:{helper:'canonical closeout validator consumed by archive-stage-runtime-v2'})};
fs.writeFileSync(path.join(dir,'ROOT.'+phase+'.closeout-validation.json'),JSON.stringify(out,null,2)+'\n');
fs.writeFileSync(statePath,JSON.stringify(consumed.state,null,2)+'\n');
console.log(JSON.stringify(out));
