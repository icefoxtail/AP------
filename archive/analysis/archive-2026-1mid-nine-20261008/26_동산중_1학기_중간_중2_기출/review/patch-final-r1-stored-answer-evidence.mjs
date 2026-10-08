import fs from 'node:fs';
const [basePath,disclosurePath,outPath]=process.argv.slice(2);
const base=JSON.parse(fs.readFileSync(basePath,'utf8'));
const disclosure=JSON.parse(fs.readFileSync(disclosurePath,'utf8'));
const byId=new Map(disclosure.rows.map(r=>[r.qid,r]));
for(const row of base.rows.filter(r=>[19,20,21].includes(r.qid))){const d=byId.get(row.qid);if(!d||typeof d.storedAnswer!=='string'||!d.storedAnswer.trim())throw new Error('CURRENT_STORED_ANSWER_REQUIRED:q'+row.qid);row.storedAnswer=d.storedAnswer;row.compareBasis=d.compareBasis;}
if(base.rows.some(r=>r.storedAnswer===undefined||r.storedAnswer===null||String(r.storedAnswer).trim()===''))throw new Error('FULL24_STORED_ANSWER_REQUIRED');
if(fs.existsSync(outPath))throw new Error('OUTPUT_EXISTS');
fs.writeFileSync(outPath,JSON.stringify(base,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({qids:[19,20,21],storedAnswerFieldsPatched:3,rowCount:base.rows.length,allStoredAnswersPresent:true}));