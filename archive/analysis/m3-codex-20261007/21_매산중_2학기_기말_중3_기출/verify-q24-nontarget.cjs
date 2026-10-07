const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root='C:\\Users\\USER\\Desktop\\AP-worktrees\\m3-codex-main-done\\AP------';
const js=path.join(root,'.tmp/archive/m3-codex-20261007/21_매산중_2학기_기말_중3_기출/21_매산중_2학기_기말_중3_기출.js');
const assetDir=path.join(root,'.tmp/archive/m3-codex-20261007/21_매산중_2학기_기말_중3_기출/assets/images/21_매산중_2학기_기말_중3_기출');
const snap=JSON.parse(fs.readFileSync(path.join(root,'archive/analysis/m3-codex-20261007/21_매산중_2학기_기말_중3_기출/CREATE-q24-pre-restore.snapshot.json'),'utf8'));
const box={window:{}};vm.runInNewContext(fs.readFileSync(js,'utf8'),box);const qs=box.window.questionBank;
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x),'utf8').digest('hex');
const assetRows=[];for(const r of snap.nonTargetReferencedAssetHashes){const rel=r.ref.replace(/^assets\/images\/[^/]+\//,'');const file=path.join(assetDir,rel);assetRows.push({qid:r.qid,field:r.field,exists:fs.existsSync(file),expected:r.sha256,actual:fs.existsSync(file)?crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'):null});}
const diffs=[];for(const old of snap.nonTargetQidObjectHashes){const q=qs.find(x=>Number(x.id)===old.qid);const h=hash(q);if(h!==old.sha256)diffs.push({qid:old.qid,expected:old.sha256,actual:h});}
const result={rootHead:execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),rawSha256:crypto.createHash('sha256').update(fs.readFileSync(js)).digest('hex'),blobSha1:execFileSync('git',['-C',root,'hash-object',js],{encoding:'utf8'}).trim(),nonTargetQidCount:23,nonTargetObjectDiffs:diffs,assetCount:assetRows.length,assetMismatches:assetRows.filter(x=>!x.exists||x.expected!==x.actual),q24:qs.find(x=>x.id===24)};
console.log(JSON.stringify(result,null,2));
