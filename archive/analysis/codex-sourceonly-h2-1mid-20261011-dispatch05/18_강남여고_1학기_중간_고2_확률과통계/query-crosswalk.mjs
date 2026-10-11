import fs from 'node:fs';
const c=JSON.parse(fs.readFileSync('archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-probability-statistics.json','utf8'));
for(const r of c.records.filter(x=>x.curriculum==='2015')) console.log(JSON.stringify({id:r.id,path:r.rpmPath,status:r.mappingStatus,standardUnitKey:r.standardUnitKey,subUnitKey:r.subUnitKey,problemTypeKey:r.problemTypeKey,templateKey:r.templateKey,bindingStatus:r.bindingStatus}));
