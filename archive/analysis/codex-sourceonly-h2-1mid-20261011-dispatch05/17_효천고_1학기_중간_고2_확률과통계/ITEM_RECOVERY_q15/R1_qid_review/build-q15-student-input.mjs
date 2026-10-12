import fs from 'node:fs';
import path from 'node:path';
import {readExam,sha256} from '../../../../../tools/archive-codex-artifact-io.mjs';
import {STUDENT_FIELDS,studentAssetRefs} from '../../../../../tools/archive-student-bundle.mjs';
const source=process.argv[2],output=process.argv[3],expected=process.argv[4];
const exam=readExam(source);if(exam.rawSha256!==expected)throw Error('EXPECTED_SOURCE_SHA_MISMATCH');
const matches=exam.questions.filter(q=>Number(q.id??q.qid)===15);if(matches.length!==1)throw Error('Q15_NOT_UNIQUE');
const q=matches[0],student=Object.fromEntries([...STUDENT_FIELDS].filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]));
const refs=new Set(studentAssetRefs(student)),assets=[];
for(const ref of refs){const p=path.resolve('archive',ref);const bytes=fs.readFileSync(p);assets.push({ref,path:p,sha256:sha256(bytes)});}
const value={schemaVersion:'JS_ARCHIVE_QID_SCOPED_STUDENT_INPUT_V1',sourceRawSha256:exam.rawSha256,qids:[15],rows:[{qid:15,student,assets}]};
fs.writeFileSync(output,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
