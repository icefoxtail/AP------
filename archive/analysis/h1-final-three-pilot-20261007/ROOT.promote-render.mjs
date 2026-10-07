import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {validateCodexRenderReceipt} from '../../tools/archive-codex-closeout-v2.mjs';
import {consumeCodexRenderPass} from '../../tools/archive-stage-runtime-v2.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(dir,'../../..'),run=path.basename(dir),[uid,receiptPath]=process.argv.slice(2);
const hash=b=>createHash('sha256').update(b).digest('hex'),norm=s=>s.replaceAll('\\','/');
const safe=p=>{const f=path.resolve(root,p),r=path.relative(root,f);if(r.startsWith('..')||path.isAbsolute(r))throw Error('PATH_ESCAPE');return f;};
const roster=JSON.parse(fs.readFileSync(path.join(dir,'ROOT.roster.json'))),row=roster.rows.find(r=>r.examUid===uid);if(!row)throw Error('OUTSIDE_ROSTER');
const temp=`.tmp/archive/${run}/${uid}/`,evidence=`archive/analysis/${uid}/${run}/`,bytes=fs.readFileSync(safe(receiptPath)),original=JSON.parse(bytes);
const bankBox={window:{}};const source=fs.readFileSync(safe(temp+uid+'.js'));vm.runInNewContext(source.toString('utf8'),bankBox,{timeout:5000});
const qids=(bankBox.window.questionBank||bankBox.window.questions).map(q=>Number(q.id));
const assets=[...new Map(original.cases.flatMap(c=>c.loadedAssets).map(a=>[a.ref,{ref:a.ref,sha256:a.sha256}])).values()];
const before=validateCodexRenderReceipt({receipt:original,root,artifactSha:original.artifactSha,assets,qids});if(!before.ok)throw Error('ORIGINAL_RENDER_INVALID:'+before.issues.join(','));
function promoteFile(p,sha){p=norm(p);let target=p;if(p===temp+uid+'.js')target=row.productionPath;else if(p.startsWith(temp+'assets/'))target='archive/'+p.slice(temp.length);else if(p.startsWith(temp))target=evidence+'render/'+p.slice(temp.length);
 const old=fs.readFileSync(safe(p));if(hash(old)!==sha)throw Error('PROMOTION_INPUT_SHA_MISMATCH:'+p);if(target!==p){const dest=safe(target);if(fs.existsSync(dest)&&hash(fs.readFileSync(dest))!==sha)throw Error('PROMOTION_OVERLAP:'+target);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,old);}return target;}
function rebind(v){if(Array.isArray(v))return v.map(rebind);if(v&&typeof v==='object'){const o=Object.fromEntries(Object.entries(v).map(([k,x])=>[k,rebind(x)]));if(typeof v.path==='string'&&typeof v.sha256==='string')o.path=promoteFile(v.path,v.sha256);return o;}return v;}
const receipt=rebind(original),after=validateCodexRenderReceipt({receipt,root,artifactSha:receipt.artifactSha,assets,qids});if(!after.ok)throw Error('PROMOTED_RENDER_INVALID:'+after.issues.join(','));
const statePath=safe(evidence+'ROOT.state.json'),state=JSON.parse(fs.readFileSync(statePath)),consumed=consumeCodexRenderPass({state,receipt,root,artifactSha:receipt.artifactSha,assets,qids});
const output=evidence+'ROOT.render.receipt.json';if(fs.existsSync(safe(output)))throw Error('FRESH_PROMOTED_RECEIPT_REQUIRED');
fs.writeFileSync(safe(output),JSON.stringify(receipt,null,2)+'\n');
fs.writeFileSync(safe(evidence+'ROOT.render-promotion-intake.json'),JSON.stringify({at:new Date().toISOString(),uid,originalReceipt:{path:receiptPath,sha256:hash(bytes)},promotedReceipt:{path:output,sha256:hash(fs.readFileSync(safe(output)))},artifactSha:receipt.artifactSha,artifactRawSha256:hash(source),qids,assets,originalValidation:before,promotedValidation:after,consumed},null,2)+'\n');
fs.writeFileSync(statePath,JSON.stringify(consumed.state,null,2)+'\n');
console.log(JSON.stringify({uid,status:'PUBLICATION',receipt:output,assetCount:assets.length,questionCount:qids.length}));
