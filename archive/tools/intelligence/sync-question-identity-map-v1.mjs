import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const examsDir = path.join(archiveDir, 'exams');
const dbPath = path.join(archiveDir, 'db.js');
const identityPath = path.join(archiveDir, 'data', 'question_identity_map.json');

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const normalizeFile = value => String(value || '').normalize('NFC').replace(/\\/g, '/').replace(/^exams\//, '').replace(/^\/+/, '').trim();
const sourceFingerprint = q => sha256(JSON.stringify({content:q?.content??null,choices:Array.isArray(q?.choices)?q.choices:null,answer:q?.answer??null,solution:q?.solution??null,image:q?.image??null}));
const contentFingerprint = q => sha256(JSON.stringify({content:q?.content??null,choices:Array.isArray(q?.choices)?q.choices:null,image:q?.image??null}));
const ordinalUid = (file, ordinal) => 'qid_v1_' + sha256(normalizeFile(file) + '#' + Number(ordinal));

function runJs(file, code) {
  const ctx = { window:{}, console:{log(){},warn(){},error(){}} };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(code, ctx, { filename:file, timeout:3000 });
  const bank = ctx.window.questions || ctx.window.questionBank || ctx.questions || ctx.questionBank;
  if (!Array.isArray(bank)) throw new Error('questions array not found: ' + file);
  return bank;
}

function readDbFiles() {
  const ctx = { window:{}, console:{log(){},warn(){},error(){}} };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(dbPath,'utf8'), ctx, {filename:dbPath,timeout:3000});
  const exams = ctx.window.mainDB?.exams;
  if (!Array.isArray(exams)) throw new Error('window.mainDB.exams missing');
  return [...new Set(exams.map(x=>normalizeFile(x?.file)).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'en'));
}

function addArray(obj,key,value){ if(!obj[key]) obj[key]=[]; obj[key].push(value); }
function sortObject(obj){ return Object.fromEntries(Object.entries(obj).sort(([a],[b])=>a.localeCompare(b,'en'))); }

function buildLookups(records) {
  const byQuestionUid={}, byLegacyQKey={}, bySourceFileAndOrdinal={}, bySourceFileAndQuestionNo={};
  for (const r of records) {
    byQuestionUid[r.questionUid] = {sourceArchiveFile:r.sourceArchiveFile,sourceOrdinal:r.sourceOrdinal,sourceQuestionNo:r.sourceQuestionNo};
    addArray(byLegacyQKey,r.legacyQKey,r.questionUid);
    if(!bySourceFileAndOrdinal[r.sourceArchiveFile]) bySourceFileAndOrdinal[r.sourceArchiveFile]={};
    bySourceFileAndOrdinal[r.sourceArchiveFile][String(r.sourceOrdinal)] = r.questionUid;
    if(!bySourceFileAndQuestionNo[r.sourceArchiveFile]) bySourceFileAndQuestionNo[r.sourceArchiveFile]={};
    addArray(bySourceFileAndQuestionNo[r.sourceArchiveFile],String(r.sourceQuestionNo ?? ''),r.questionUid);
  }
  return {
    byQuestionUid:sortObject(byQuestionUid),
    byLegacyQKey:sortObject(byLegacyQKey),
    bySourceFileAndOrdinal:sortObject(bySourceFileAndOrdinal),
    bySourceFileAndQuestionNo:sortObject(bySourceFileAndQuestionNo)
  };
}

function main(){
  if(!fs.existsSync(identityPath)) throw new Error('identity map missing: '+identityPath);
  const current=JSON.parse(fs.readFileSync(identityPath,'utf8'));
  const original=JSON.stringify(current);
  const records=(current.records||[]).map(x=>({...x,sourceArchiveFile:normalizeFile(x.sourceArchiveFile)}));
  const bySourceOrdinal=new Map(records.map(r=>[r.sourceArchiveFile+'#'+Number(r.sourceOrdinal),r]));
  const existingFiles=new Set(records.map(r=>r.sourceArchiveFile));
  const usedUids=new Set(records.map(r=>r.questionUid));
  let newFiles=0,newRecords=0,updatedFingerprints=0;

  for(const sourceFile of readDbFiles()){
    const full=path.join(examsDir,sourceFile);
    if(!fs.existsSync(full)) throw new Error('db source missing: '+sourceFile);
    const questions=runJs(full,fs.readFileSync(full,'utf8'));
    const prior=records.filter(r=>r.sourceArchiveFile===sourceFile);
    if(prior.length && prior.length!==questions.length){
      throw new Error('existing source cardinality changed; run migrate-question-identity-map-v1.mjs: '+sourceFile+' '+prior.length+' -> '+questions.length);
    }
    if(!prior.length) newFiles += 1;
    for(let i=0;i<questions.length;i++){
      const ordinal=i+1, q=questions[i], key=sourceFile+'#'+ordinal;
      const sf=sourceFingerprint(q), cf=contentFingerprint(q), qno=String(q?.id ?? '');
      const old=bySourceOrdinal.get(key);
      if(old){
        if(old.contentFingerprint && old.contentFingerprint!==cf){
          throw new Error('existing source content changed at '+key+'; run migrate-question-identity-map-v1.mjs');
        }
        if(old.sourceFingerprint!==sf || old.sourceQuestionNo!==qno || old.contentFingerprint!==cf){
          old.sourceFingerprint=sf; old.contentFingerprint=cf; old.sourceQuestionNo=qno;
          old.legacyQKey=sourceFile+'_'+qno;
          old.legacyOrdinalQuestionUid=old.legacyOrdinalQuestionUid || ordinalUid(sourceFile,ordinal);
          updatedFingerprints += 1;
        }
        continue;
      }
      if(existingFiles.has(sourceFile)) throw new Error('identity ordinal gap in existing source: '+key);
      const uid=ordinalUid(sourceFile,ordinal);
      if(usedUids.has(uid)) throw new Error('questionUid collision: '+uid);
      usedUids.add(uid);
      const row={questionUid:uid,legacyOrdinalQuestionUid:uid,legacyQKey:sourceFile+'_'+qno,sourceArchiveFile:sourceFile,sourceOrdinal:ordinal,sourceQuestionNo:qno,sourceFingerprint:sf,contentFingerprint:cf};
      records.push(row); bySourceOrdinal.set(key,row); newRecords += 1;
    }
  }

  records.sort((a,b)=>a.sourceArchiveFile.localeCompare(b.sourceArchiveFile,'en')||Number(a.sourceOrdinal)-Number(b.sourceOrdinal));
  const lookup=buildLookups(records);
  const next={...current};
  next.records=records;
  next.lookup=lookup;
  next.stats={...(current.stats||{}),examFileCount:new Set(records.map(r=>r.sourceArchiveFile)).size,sourceQuestionCount:records.length,uniqueQuestionUidCount:new Set(records.map(r=>r.questionUid)).size,duplicateQuestionUidCount:records.length-new Set(records.map(r=>r.questionUid)).size,failures:0};
  next.incrementalSync={schemaVersion:'question-identity-incremental-sync-v1',sourceCommit:execFileSync('git',['-C',repoRoot,'rev-parse','HEAD']).toString('utf8').trim(),newFiles,newRecords,updatedFingerprints};
  next.generatedAt=new Date().toISOString();
  delete next.identityDigest;
  const stable={...next}; delete stable.generatedAt;
  next.identityDigest=sha256(JSON.stringify(stable));

  if(JSON.stringify(next.records)===JSON.stringify(current.records||[]) && newFiles===0 && updatedFingerprints===0){
    console.log(JSON.stringify({status:'NO_CHANGE',records:records.length,newFiles:0,newRecords:0,updatedFingerprints:0},null,2));
    return;
  }
  fs.writeFileSync(identityPath,JSON.stringify(next,null,2)+'\n','utf8');
  console.log(JSON.stringify({status:'UPDATED',records:records.length,newFiles,newRecords,updatedFingerprints,identityDigest:next.identityDigest},null,2));
}
main();
