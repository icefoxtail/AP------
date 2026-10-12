import fs from 'node:fs';
import { readExam, sha256 } from '../../../../tools/archive-codex-artifact-io.mjs';

const sourceFile = 'archive/exams/original/high/h2/1mid/24_강남여고_1학기_중간_고2_확률과통계.js';
const expectedRawSha = '7597f74e213a7bffab8a30fab9eb23e5b438f159772c95f4c99841b0fb03fa25';
const expected = { level: '하', difficultyBucket: 2, legacyLevelCompatibility: 'BORDERLINE_REVIEW' };
const beforeExam = readExam(sourceFile);
if (beforeExam.rawSha256 !== expectedRawSha) throw Error('SOURCE_SHA_CHANGED');
const q = beforeExam.questions.find(x => Number(x.id ?? x.qid) === 1);
if (!q || q.level !== expected.level || q.difficultyBucket !== expected.difficultyBucket || q.legacyLevelCompatibility !== expected.legacyLevelCompatibility) throw Error('Q1_METADATA_PROJECTION_MISMATCH');
const bytes = fs.readFileSync(sourceFile);
const src = bytes.toString('utf8');
function tokens(s) {
  const out=[];
  for(let i=0;i<s.length;) {
    const c=s[i];
    if(/\s/.test(c)){i++;continue;}
    if(c==='/'&&s[i+1]==='/'){i+=2;while(i<s.length&&s[i]!=='\n')i++;continue;}
    if(c==='/'&&s[i+1]==='*'){const e=s.indexOf('*/',i+2);if(e<0)throw Error('COMMENT_UNCLOSED');i=e+2;continue;}
    if(c==="'"||c==='"'||c==='`') {const start=i,quote=c;i++;while(i<s.length){if(s[i]==='\\'){i+=2;continue;}if(s[i]===quote){i++;break;}i++;}if(s[i-1]!==quote)throw Error('STRING_UNCLOSED');out.push({type:'str',raw:s.slice(start,i),start,end:i});continue;}
    if(/[A-Za-z_$]/.test(c)){const start=i++;while(i<s.length&&/[A-Za-z0-9_$]/.test(s[i]))i++;out.push({type:'id',raw:s.slice(start,i),start,end:i});continue;}
    if(/[0-9]/.test(c)){const start=i++;while(i<s.length&&/[0-9.]/.test(s[i]))i++;out.push({type:'num',raw:s.slice(start,i),start,end:i});continue;}
    out.push({type:'p',raw:c,start:i,end:i+1});i++;
  }
  return out;
}
const ts=tokens(src), stack=[], pairs=new Map(), enclosing=new Map();
const closeFor={'}':'{',']':'[',')':'('};
for(let i=0;i<ts.length;i++){
  const t=ts[i];
  if(['{','[','('].includes(t.raw)) stack.push(i);
  else if(closeFor[t.raw]) {const open=stack.pop();if(open===undefined||ts[open].raw!==closeFor[t.raw])throw Error('DELIMITER_MISMATCH');pairs.set(open,i);}
  const keyName=t.type==='id'?t.raw:(t.type==='str'?t.raw.slice(1,-1):'');
  const val=ts[i+2];
  if(['id','qid'].includes(keyName)&&ts[i+1]?.raw===':'&&(['num','str'].includes(val?.type))&&((val.type==='num'&&Number(val.raw)===1)||(val.type==='str'&&val.raw.slice(1,-1)==='1'))&&(['{',','].includes(ts[i-1]?.raw))){
    const open=stack.at(-1);
    if(open!==undefined&&ts[open].raw==='{') enclosing.set(i,open);
  }
}
const candidates=[...enclosing.entries()].filter(([i,open])=>pairs.has(open)&&i<pairs.get(open));
if(candidates.length!==1)throw Error(`Q1_OBJECT_UNIQUE_REQUIRED:${candidates.length}`);
const [idIndex,open]=candidates[0],close=pairs.get(open);
const wanted=new Set(['difficultyBucket','legacyLevelCompatibility']);
const found=new Map();let depth=0;
for(let i=open+1;i<close;i++){
  const t=ts[i];
  if(depth===0&&(t.type==='id'||t.type==='str')&&ts[i+1]?.raw===':'){
    const key=t.type==='id'?t.raw:t.raw.slice(1,-1);
    if(wanted.has(key)){
      const v=ts[i+2];if(!v||!['num','str'].includes(v.type))throw Error(`Q1_TARGET_NOT_PRIMITIVE:${key}`);
      found.set(key,v);
    }
  }
  if(['{','[','('].includes(t.raw))depth++;
  else if(['}',']',')'].includes(t.raw))depth--;
}
if(found.size!==2)throw Error(`Q1_TARGET_FIELDS_REQUIRED:${[...found.keys()].join(',')}`);
if(found.get('difficultyBucket').raw!=='2'||found.get('legacyLevelCompatibility').raw.slice(1,-1)!=='BORDERLINE_REVIEW')throw Error('Q1_TARGET_SOURCE_VALUES_CHANGED');
const replacements=[
  {field:'difficultyBucket',token:found.get('difficultyBucket'),from:'2',to:'1'},
  {field:'legacyLevelCompatibility',token:found.get('legacyLevelCompatibility'),from:found.get('legacyLevelCompatibility').raw,to:`${found.get('legacyLevelCompatibility').raw[0]}NORMAL${found.get('legacyLevelCompatibility').raw[0]}`}
].sort((a,b)=>b.token.start-a.token.start);
let updated=src;
for(const r of replacements)updated=updated.slice(0,r.token.start)+r.to+updated.slice(r.token.end);
fs.writeFileSync(sourceFile,updated,'utf8');
const afterExam=readExam(sourceFile);const after=afterExam.questions.find(x=>Number(x.id??x.qid)===1);
if(!after||after.level!=='하'||after.difficultyBucket!==1||after.legacyLevelCompatibility!=='NORMAL')throw Error('Q1_POSTPATCH_VERIFICATION_FAILED');
const receipt={schemaVersion:'R1_QID_DIFFICULTY_METADATA_PATCH_RECEIPT_V1',examUid:'24_강남여고_1학기_중간_고2_확률과통계',qid:1,sourcePath:sourceFile,beforeRawSha256:expectedRawSha,afterRawSha256:afterExam.rawSha256,fields:[{field:'difficultyBucket',before:2,after:1},{field:'legacyLevelCompatibility',before:'BORDERLINE_REVIEW',after:'NORMAL'}],unchangedFields:['level=하'],sourceBytesChangedOnlyAtTargetValueSpans:true,storedAnswerOrSolutionChanged:false,otherQidsEdited:false,verifiedBy:'archive-codex-artifact-io.readExam'};
fs.writeFileSync('archive/analysis/24_강남여고_1학기_중간_고2_확률과통계/r1/q1-clean/q1-metadata-patch-receipt.json',JSON.stringify(receipt,null,2)+'\n','utf8');
console.log(JSON.stringify(receipt));

