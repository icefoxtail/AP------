import fs from 'node:fs';import vm from 'node:vm';import crypto from 'node:crypto';
const source='archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_수학I.js';
const beforePath='archive/analysis/24_매산여고_1학기_중간_고2_수학I/r1-clean-20261011/r1-q18-meta-before.json';
const bundlePath='archive/analysis/24_매산여고_1학기_중간_고2_수학I/r1-clean-20261011/current-student-only.bundle.json';
const before=JSON.parse(fs.readFileSync(beforePath,'utf8'));
const bytes=fs.readFileSync(source),afterRawSha256=crypto.createHash('sha256').update(bytes).digest('hex');
const w={};vm.runInNewContext(bytes.toString('utf8'),{window:w});const q18=w.questionBank.find(q=>q.id===18);
const fields=['standardCourse','standardUnitKey','standardUnit','standardUnitOrder','subUnitKey','subUnit','subUnitConfidence','subUnitClassificationDepth','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern'];
const newFields=Object.fromEntries(fields.map(k=>[k,q18[k]]));
const bundle=JSON.parse(fs.readFileSync(bundlePath,'utf8'));
const parity=bundle.rows.every(row=>{const q=w.questionBank.find(x=>x.id===row.qid);const current=Object.fromEntries(bundle.whitelist.filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]));return JSON.stringify(current)===JSON.stringify(row.student)});
if(!parity)throw new Error('STUDENT_FIELDS_CHANGED');
const ledger={schemaVersion:'JS_ARCHIVE_R1_Q18_META_REPAIR_V1',executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',examUid:'24_매산여고_1학기_중간_고2_수학I',qid:18,beforeRawSha256:before.sourceRawSha256,afterRawSha256,beforeFields:before.oldFields,afterFields:newFields,rpmPrimaryKey:'H2-M1-RPM-028',semanticPath:{curriculum:'2015',scope:'수학I',l1:'H15-M1-04 로그함수',l2:'H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION 로그함수의 활용',l3:'로그함수의 활용',l4:'그래프 교점'},projection:{problemTypeKey:'PT_FUNCTION_GRAPH_INTERSECTION',templateKey:'TPL_FUNCTION_INTERSECTION_TWO_FUNCTIONS',status:'DIRECT_BINDING_GAP',bindingStatus:'MISSING',reason:'The active crosswalk has this exact semantic mapping but no current exact H15 curriculum binding. Keep the keys and record binding pending; do not invent a new canonical key.'},studentFieldsExactParity:{status:'PASS',qidCount:bundle.rows.length},globalProjectionFilesTouched:false,technicalAttemptNote:'The first repair script applied the five exact q18 changes and verified student parity, then its final ledger write failed on a misspelled variable name. This ledger reconstructs the completed mutation from the preserved before snapshot and current bytes.'};
fs.writeFileSync(process.argv[2],JSON.stringify(ledger,null,2)+String.fromCharCode(10));
console.log(JSON.stringify({afterRawSha256,parity,newFields},null,2));

