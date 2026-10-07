const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const root='C:\\Users\\USER\\Desktop\\AP-worktrees\\m3-codex-main-done\\AP------';
const ev=path.join(root,'archive/analysis/m3-codex-20261007/21_매산중_2학기_기말_중3_기출');
const js=path.join(root,'.tmp/archive/m3-codex-20261007/21_매산중_2학기_기말_중3_기출/21_매산중_2학기_기말_중3_기출.js');
const assetDir=path.join(path.dirname(js),'assets/images/21_매산중_2학기_기말_중3_기출');
const b={window:{}};vm.runInNewContext(fs.readFileSync(js,'utf8'),b);const qs=b.window.questionBank;
const sha=x=>crypto.createHash('sha256').update(JSON.stringify(x),'utf8').digest('hex');
const nonTargetQids=qs.filter(q=>![6,24].includes(Number(q.id))).map(q=>({qid:q.id,sha256:sha(q)}));
const assets=[];for(const q of qs.filter(q=>![24].includes(Number(q.id))))for(const f of ['image','solutionImage'])if(q[f]){const rel=q[f].replace(/^assets\/images\/[^/]+\//,'');const p=path.join(assetDir,rel);assets.push({qid:q.id,field:f,ref:q[f],sha256:crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')});}
const report={runId:'m3-codex-20261007',examUid:'21_매산중_2학기_기말_중3_기출',assignmentSha256:'8c25c734fa8fcc762760aac712e309aa8b75a69cfadb3c24655857364b732115',startingArtifactRawSha256:crypto.createHash('sha256').update(fs.readFileSync(js)).digest('hex'),nonTargetQidCount:nonTargetQids.length,nonTargetQids,nonTargetAssetCount:assets.length,nonTargetAssets:assets,q6Before:qs.find(q=>q.id===6),q24Before:qs.find(q=>q.id===24)};fs.writeFileSync(path.join(ev,'CREATE-recovery-q6-q24.prewrite.snapshot.json'),JSON.stringify(report,null,2)+'\n','utf8');console.log(JSON.stringify({qids:nonTargetQids.length,assets:assets.length,assetHashesAllPresent:true,raw:report.startingArtifactRawSha256,snapshot:path.join(ev,'CREATE-recovery-q6-q24.prewrite.snapshot.json')}));
