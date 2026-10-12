import fs from 'node:fs';
const root='C:/Users/USER/Desktop/AP------';
const source=JSON.parse(fs.readFileSync(root+'/archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R1-17-hyocheon/R1-live-metadata-layout-fields.json','utf8'));
const x=JSON.parse(fs.readFileSync(root+'/archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-probability-statistics.json','utf8'));
const out=source.rows.map(q=>{const rows=x.records.filter(r=>r.standardUnitKey===q.standardUnitKey&&r.subUnitKey===q.subUnitKey&&r.problemTypeKey===q.problemTypeKey&&(r.templateKey===q.templateKey||(r.templateCandidates||[]).includes(q.templateKey)));return {qid:q.qid,pt:q.problemTypeKey,tpl:q.templateKey,standardUnitKey:q.standardUnitKey,subUnitKey:q.subUnitKey,matches:rows.map(r=>({id:r.id,mappingStatus:r.mappingStatus,bindingStatus:r.bindingStatus,rpmPath:r.rpmPath,templates:r.templateCandidates||r.templateKey}))}});
fs.writeFileSync(root+'/archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R1-17-hyocheon/R1-rpm-crosswalk-map.final.json',JSON.stringify({schemaVersion:'R1_CURRENT_RPM_CROSSWALK_MATCHES_V1',crosswalkPath:'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-probability-statistics.json',crosswalkSha256:(await import('node:crypto')).createHash('sha256').update(fs.readFileSync(root+'/archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-probability-statistics.json')).digest('hex'),rows:out},null,2));
console.log(JSON.stringify(out.map(r=>({qid:r.qid,count:r.matches.length,match:r.matches[0]||null})),null,2));

