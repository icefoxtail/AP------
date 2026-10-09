import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
const file=process.argv[2], expected=process.argv[3];
const bytes=fs.readFileSync(file), raw=bytes.toString('utf8');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
if(sha(bytes)!==expected) throw new Error('EXPECTED_CURRENT_RAW_SHA_MISMATCH');
const run=s=>{const c={window:{}};vm.createContext(c);vm.runInContext(s,c,{filename:file,timeout:5000});return c.window.questionBank;};
const before=run(raw),targets=new Map(before.filter(q=>[13,23].includes(Number(q.id))).map(q=>[Number(q.id),q]));
if(targets.size!==2)throw new Error('TARGET_QID_DENOMINATOR');
const student=q=>JSON.stringify({id:q.id,content:q.content,choices:q.choices,image:q.image,visual:q.visual,sharedMaterial:q.sharedMaterial,__apExamSubjectiveSpacing:q.__apExamSubjectiveSpacing});
const studentBefore=new Map([...targets].map(([id,q])=>[id,sha(student(q))]));
const changes=new Map([
 [13,{difficultyBucket:2,difficultyConfidence:'medium',difficultyBoundaryFlag:'NONE',legacyLevelCompatibility:'UNKNOWN',difficultyReason:'Fresh affected R1 blind proposal: condition is directly rewritten as an integer exponent; natural n leaves odd k=1,3,5. Bucket 2; taxonomy/difficulty remains provisional pending current R1 final review.'}],
 [23,{difficultyBucket:3,difficultyConfidence:'medium',difficultyBoundaryFlag:'B23',legacyLevelCompatibility:'UNKNOWN',difficultyReason:'Fresh affected R1 blind proposal: inverse-curve symmetry, AB length and triangle area must be translated into coordinate differences and combined. Bucket 3, B23; taxonomy/difficulty remains provisional pending current R1 final review.'}]
]);
const blockBounds=[];for(const [id] of changes){const start=raw.indexOf('"id": '+id+',');if(start<0)throw new Error('RAW_QID_NOT_FOUND:'+id);const re=/\n\s*\{\s*\n\s*"id":\s*\d+,/g;re.lastIndex=start+1;const next=re.exec(raw);const end=next?next.index:raw.indexOf('\n  }\n];',start);if(end<0)throw new Error('RAW_QID_BOUNDARY:'+id);blockBounds.push({id,start,end,orig:targets.get(id)});}
let updated=raw;
for(const {id,start,end,orig} of blockBounds.sort((a,b)=>b.start-a.start)){
 let block=updated.slice(start,end);
 const newValues=changes.get(id);
 for(const [key,value] of Object.entries(newValues)){
  const old=orig[key],needle=JSON.stringify(key)+': '+JSON.stringify(old),rep=JSON.stringify(key)+': '+JSON.stringify(value),at=block.indexOf(needle);
  if(at<0||block.indexOf(needle,at+needle.length)>=0)throw new Error('PROPERTY_NOT_UNIQUE:q'+id+':'+key);
  block=block.slice(0,at)+rep+block.slice(at+needle.length);
 }
 updated=updated.slice(0,start)+block+updated.slice(end);
}
fs.writeFileSync(file,updated,'utf8');
const after=run(updated),afterTargets=new Map(after.filter(q=>[13,23].includes(Number(q.id))).map(q=>[Number(q.id),q]));
const parity=[...afterTargets].map(([id,q])=>({qid:id,studentFieldsUnchanged:sha(student(q))===studentBefore.get(id)}));
if(!parity.every(x=>x.studentFieldsUnchanged))throw new Error('STUDENT_FIELDS_CHANGED');
console.log(JSON.stringify({ok:true,preRawSha256:expected,postRawSha256:sha(Buffer.from(updated)),questionCount:after.length,changedQids:[13,23],changedFields:['difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility','difficultyReason'],studentParity:parity,reviewStatus:'PROVISIONAL_PENDING_AFFECTED_R1_FINAL'},null,2));
