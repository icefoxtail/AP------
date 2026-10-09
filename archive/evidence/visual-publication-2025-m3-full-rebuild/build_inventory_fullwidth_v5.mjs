import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const HERE=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(HERE,'../../..');
const OUTPUT=path.join(HERE,'source-inventory-current-display-full-v5.json');
const TARGETS=[
  ['25_금당중_2학기_기말_중3_기출','2final'],['25_신흥중_2학기_기말_중3_기출','2final'],['25_연향중_2학기_기말_중3_기출','2final'],
  ['25_왕운중_2학기_중간_중3_수학','2mid'],['25_풍덕중_2학기_중간_중3_수학','2mid'],['25_금당중_2학기_중간_중3_수학','2mid'],
  ['25_신흥중_2학기_중간_중3_수학','2mid'],['25_연향중_2학기_중간_중3_수학','2mid'],['25_왕운중_2학기_기말_중3_기출','2final'],['25_풍덕중_2학기_기말_중3_기출','2final']
];
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function blobSha(repoPath){const bytes=fs.readFileSync(path.join(ROOT,repoPath));return execFileSync('git',['hash-object',`--path=${repoPath}`,'--stdin'],{cwd:ROOT,input:bytes,encoding:'utf8'}).trim();}
function readAsset(value){if(typeof value!=='string'||!value.startsWith('assets/images/'))return null;const repoPath=`archive/${value}`;const abs=path.resolve(ROOT,repoPath);if(!abs.startsWith(path.resolve(ROOT,'archive/assets/images')+path.sep))throw Error('SOURCE_ASSET_PATH_ESCAPE');if(!fs.existsSync(abs))return{path:repoPath,status:'MISSING'};const bytes=fs.readFileSync(abs);return{path:repoPath,gitBlobSha:blobSha(repoPath),sha256:sha(bytes),bytes:bytes.length};}
const records=[];
for(const [exam,folder] of TARGETS){
  const sourceRel=`archive/exams/original/middle/m3/${folder}/${exam}.js`;const sourceBytes=fs.readFileSync(path.join(ROOT,sourceRel));
  const context={window:{}};vm.runInNewContext(sourceBytes.toString('utf8'),context,{filename:sourceRel,timeout:5000});
  const bank=context.window.questionBank;if(!Array.isArray(bank))throw Error(`QUESTION_BANK_MISSING:${exam}`);
  const sourceJs={path:sourceRel,gitBlobSha:blobSha(sourceRel),sha256:sha(sourceBytes),bytes:sourceBytes.length};
  for(const q of bank){if(!q.solutionImage||!q.solutionImage.endsWith('.svg'))continue;const problemImage=q.image??q.problemImage??null;
    records.push({exam,questionId:q.id,solutionImageSize:q.solutionImageSize??null,solutionImageLayout:q.solutionImageLayout??null,
      sourceRefKey:`${sourceRel}#${q.id}`,sourceJs,sourceProblem:{runtimeContent:q.content,choices:q.choices??null,image:problemImage,imageEvidence:readAsset(problemImage)},
      verifiedAnswer:q.answer,answerSha256:sha(Buffer.from(String(q.answer??''),'utf8')),verifiedSolution:q.solution,solutionSha256:sha(Buffer.from(String(q.solution??''),'utf8')),
      solutionImageRef:q.solutionImage.startsWith('assets/images/')?`archive/${q.solutionImage}`:q.solutionImage,solutionImageBytesReadForConstruction:false});
  }
}
const byExam=Object.fromEntries(TARGETS.map(([exam])=>[exam,records.filter(row=>row.exam===exam).length]));
if(records.length!==130||Object.keys(byExam).length!==10)throw Error(`DENOMINATOR_MISMATCH:${records.length}`);
const fullwidth=records.filter(row=>row.solutionImageLayout==='fullwidth').length;if(fullwidth!==99)throw Error(`FULLWIDTH_LAYOUT_COUNT_MISMATCH:${fullwidth}`);
const head=execFileSync('git',['rev-parse','HEAD'],{cwd:ROOT,encoding:'utf8'}).trim();
const payload={schemaVersion:'m3-full-rebuild-current-display-full-source-inventory-v5',branch:execFileSync('git',['branch','--show-current'],{cwd:ROOT,encoding:'utf8'}).trim(),baseCommit:head,
  canonicalUidAuthority:{status:'INPUT_REQUIRED',requiredSchema:'SOURCE_EXAM_ID_REGISTRY_v1',statusAuthority:'PHASE1_5_NOT_CLAIMED'},
  rule:'Current source JS defines the exact 130-item denominator. Target solution SVG bytes were never construction inputs. Desktop readability layout comes only from actual Archive capture measurements.',
  totals:{exams:10,solutionSvgs:records.length,fullwidthSolutionImages:fullwidth,byExam},records};
fs.writeFileSync(OUTPUT,JSON.stringify(payload,null,2)+'\n','utf8');
console.log(JSON.stringify({output:path.relative(ROOT,OUTPUT),baseCommit:head,totals:payload.totals},null,2));
