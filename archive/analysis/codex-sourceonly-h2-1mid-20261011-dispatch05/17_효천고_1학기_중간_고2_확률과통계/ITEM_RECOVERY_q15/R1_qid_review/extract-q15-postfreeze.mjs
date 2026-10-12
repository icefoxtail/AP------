import fs from 'node:fs';
import {readExam,physical,writeFresh} from '../../../../../tools/archive-codex-artifact-io.mjs';
const source=process.argv[2],bundle=JSON.parse(fs.readFileSync(process.argv[3],'utf8')),out=process.argv[4];
const e=readExam(source);if(e.rawSha256!==bundle.sourceRawSha256)throw Error('SOURCE_SHA_CHANGED');
const qs=e.questions.filter(q=>Number(q.id??q.qid)===15);if(qs.length!==1)throw Error('Q15_NOT_UNIQUE');const q=qs[0];
const fields=['id','uid','sourceQid','content','choices','answer','solution','explanation','standardCourse','standardUnitKey','standardUnit','standardUnitOrder','subUnitKey','subUnit','subUnitConfidence','subUnitClassificationDepth','rpmL1','rpmL2','rpmL3','rpmL4','rpmL1Key','rpmL2Key','rpmL3Key','rpmL4Key','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility','category','originalCategory','questionType','layoutTag','wide','tags','provenance','metadata','meta','itemStatus'];
const row=Object.fromEntries(fields.filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]));
const v={schemaVersion:'JS_ARCHIVE_QID_SCOPED_POSTFREEZE_DISCLOSURE_V1',scope:'QID_ONLY',qid:15,sourceRawSha256:e.rawSha256,studentParity:'EXACT',independentFreeze:physical(process.argv[5]),fields:row,storedAnswerVisibleOnlyAfterFreeze:true};
console.log(JSON.stringify(writeFresh(out,v),null,2));
