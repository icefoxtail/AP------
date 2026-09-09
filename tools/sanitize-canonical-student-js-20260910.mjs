import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]):/, '$1:')), '..');
const archiveRoots = [
  path.join(root, 'archive', 'exams', 'original', 'high', 'h1', '2mid'),
  path.join(root, 'archive', 'exams', 'original', 'high', 'h1', '2final'),
];
const validSubUnit = {
  'H15-SA-09': 'H15-SA-09-COORDINATE_METRIC',
  'H15-SA-11': 'H15-SA-11-CIRCLE_EQUATION',
  'H15-SA-12': 'H15-SA-12-TRANSLATION',
  'H15-SB-01': 'H15-SB-01-SET_OPERATION',
  'H15-SB-02': 'H15-SB-02-PROPOSITION_BASIC',
  'H15-SB-03': 'H15-SB-03-FUNCTION_RELATION',
  'H15-SB-04': 'H15-SB-04-RATIONAL_BASIC',
  'H15-SB-05': 'H15-SB-05-IRRATIONAL_BASIC',
  'H15-SB-06': 'H15-SB-06-COUNTING_PRINCIPLE',
  'H15-SB-07': 'H15-SB-07-PERMUTATION_BASIC',
  'H15-SB-08': 'H15-SB-08-COMBINATION_BASIC',
};
const internalKeys = new Set([
  'variantClass', 'recoveryTier', 'sourceDefectTypes', 'sourceQuestionUid',
  'recoveredQuestionUid', 'effectiveArtifactUid', 'sourceOriginalPreserved',
  'replacementDisposition', 'productionOriginalActive', 'productionRecoveredActive',
  'reviewPackageReplacementActive', 'productionAdoptionStatus', 'reviewStatus',
  'reviewReason', 'answerStatus', 'solutionStatus'
]);
function span(text){const marker=text.indexOf('window.questionBank');const open=text.indexOf('[',marker);let d=0,q=null;for(let i=open;i<text.length;i++){const c=text[i];if(q){if(c==='\\')i++;else if(c===q)q=null;continue;}if(c==='"'||c==="'"){q=c;continue;}if(c==='[')d++;else if(c===']'&&--d===0)return{open,close:i};}throw new Error('bank span');}
function load(text){const c={window:{}};vm.runInNewContext(text,c,{timeout:10000});return c.window;}
function save(text,win,bank){const s=span(text);let out=text.slice(0,s.open)+'[\n'+bank.map(q=>JSON.stringify(q)).join(',\n')+'\n]'+text.slice(s.close+1);out=out.replace(/window\.examVariant\s*=\s*[^;]+;\s*\n?/g,'').replace(/window\.sourceOriginalPreserved\s*=\s*[^;]+;\s*\n?/g,'').replace(/window\.productionAdoptionStatus\s*=\s*[^;]+;\s*\n?/g,'').replace(/window\.replacementDisposition\s*=\s*[^;]+;\s*\n?/g,'');return out;}
function walk(d,a=[]){for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())walk(f,a);else if(e.isFile()&&e.name.endsWith('.js'))a.push(f)}return a;}
let files=0,questions=0,removedFields=0;
for(const file of archiveRoots.flatMap(dir => walk(dir))){
  const text=fs.readFileSync(file,'utf8');let win;try{win=load(text)}catch{continue;}
  const bank=win.questionBank||[];let touched=false;
  for(const q of bank){
    for(const key of Object.keys(q)){if(internalKeys.has(key)){delete q[key];removedFields++;touched=true;}}
    if(Array.isArray(q.tags)){const next=q.tags.filter(tag=>!/(유사B|DERIVED|B형|A형|BLOCKED|REVIEW)/i.test(String(tag)));if(!next.some(tag=>String(tag)==='기출')&&next.length===0&&q.questionType)next.push('기출');if(JSON.stringify(next)!==JSON.stringify(q.tags)){q.tags=next;touched=true;}}
    if(typeof q.subUnitKey==='string'&&q.subUnitKey.includes('-B-DERIVED')){const base=q.standardUnitKey; if(validSubUnit[base])q.subUnitKey=validSubUnit[base]; else delete q.subUnitKey;touched=true;}
    if(typeof q.subUnit==='string'&&/B형|유사B|DERIVED|BLOCKED|REVIEW/i.test(q.subUnit)){q.subUnit=q.standardUnit||q.category||'';touched=true;}
    for(const key of ['content','answer','solution']){if(typeof q[key]==='string'&&/(A형|B형|DERIVED_REPLACEMENT|BLOCKED|NOT_AUTHORIZED|source conflict|review package)/i.test(q[key])){q[key]=q[key].replace(/\s*\(?(A형|B형|DERIVED_REPLACEMENT|BLOCKED|NOT_AUTHORIZED|source conflict|review package)\)?\s*/gi,' ').trim();touched=true;}}
    if(touched)questions++;
  }
  const clean=save(text,win,bank);if(clean!==text){fs.writeFileSync(file,clean,'utf8');files++;}
}
console.log(JSON.stringify({files,questions,removedFields,status:'CANONICAL_STUDENT_JS_SANITIZED'},null,2));
