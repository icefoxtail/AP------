import fs from 'node:fs';
import path from 'node:path';
import {readExam,sha256,writeFresh,inside} from '../../tools/archive-codex-artifact-io.mjs';
import {STUDENT_FIELDS,studentAssetRefs,normalizeStudentBundle} from '../../tools/archive-student-bundle.mjs';
const [source,assetRoot,output]=process.argv.slice(2);
if(!source||!assetRoot||!output)throw Error('SOURCE_ASSET_PARENT_OUTPUT_REQUIRED');
const exam=readExam(source);
function assetsFor(student){const pending=[...new Set(studentAssetRefs(student))],assets=[],seen=new Set();while(pending.length){const ref=pending.shift();if(seen.has(ref))continue;seen.add(ref);if(!ref.startsWith('assets/images/')||ref.split('/').includes('..'))throw Error('UNSAFE_STUDENT_ASSET_REF');const file=inside(path.resolve(assetRoot),ref),bytes=fs.readFileSync(file);assets.push({ref,path:file,sha256:sha256(bytes)});if(ref.endsWith('.svg'))for(const m of bytes.toString('utf8').matchAll(/(?:href|xlink:href)\s*=\s*["']([^"']+)/gi))if(!/^(?:data:|#)/.test(m[1]))pending.push(path.posix.normalize(path.posix.join(path.posix.dirname(ref),m[1])));}return assets;}
const rows=exam.questions.map(q=>{const student=Object.fromEntries([...STUDENT_FIELDS].filter(k=>Object.hasOwn(q,k)).map(k=>[k,q[k]]));return {qid:Number(q.id),student,assets:assetsFor(student)};});
const raw={schemaVersion:'CURRENT_SOURCE_SAFE_EXTRACTION_V1',sourceRawSha256:exam.rawSha256,sourceRawBlobSha1:exam.rawBufferGitBlobSha1,questionCount:rows.length,qids:rows.map(r=>r.qid),rows};
const bundle=normalizeStudentBundle(raw,{expectedSourceRawSha256:exam.rawSha256});
bundle.extractionProvenance={extractor:'ROOT.safe-student-extractor.mjs',extractorSha256:sha256(fs.readFileSync(new URL(import.meta.url))),currentSourceActualRead:true,studentFieldsExactParity:true,answersDisclosed:false,extractedAt:new Date().toISOString()};
const ref=writeFresh(path.resolve(output),bundle);console.log(JSON.stringify({ref,questionCount:rows.length,sourceRawSha256:exam.rawSha256,studentAssetCount:new Set(rows.flatMap(r=>r.assets.map(a=>a.ref))).size}));
