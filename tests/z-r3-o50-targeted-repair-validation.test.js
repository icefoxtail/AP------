const fs=require('fs');
const vm=require('vm');
const cp=require('child_process');
const examPath="archive/exams/original/middle/m3/2mid/23_연향중_2학기_중간_중3_수학.js";
const metaPath="archive/data/r2e-intake/m3/23_연향중_2학기_중간_중3_수학.review2.meta-v2.payload.json";
const assetDir='archive/assets/images/23_연향중_2학기_중간_중3_수학';
function assert(x,m){if(!x)throw new Error(m)}
function load(src){const s={window:{}};vm.createContext(s);vm.runInContext(src,s,{filename:examPath});return s.window.questionBank}
const curSrc=fs.readFileSync(examPath,'utf8');
const mainSrc=cp.execFileSync('git',['show','origin/main:'+examPath],{encoding:'utf8'});
const cur=load(curSrc), base=load(mainSrc);
assert(cur.length===24&&base.length===24,'JS_LOAD_OR_COUNT_FAIL');
for(const b of base){
 const c=cur.find(x=>x.id===b.id); assert(c,'MISSING_Q'+b.id);
 const cc=JSON.parse(JSON.stringify(c)), bb=JSON.parse(JSON.stringify(b));
 if([20,22].includes(b.id)){delete cc.solutionImage;delete bb.solutionImage}
 assert(JSON.stringify(cc)===JSON.stringify(bb),'UNRELATED_EXAM_MUTATION_Q'+b.id);
}
const q=n=>cur.find(x=>x.id===n);
assert(q(20).solutionImage==='assets/images/23_연향중_2학기_중간_중3_수학/q20-solution.svg','Q20_SOLUTION_IMAGE_BIND_FAIL');
assert(q(22).solutionImage==='assets/images/23_연향중_2학기_중간_중3_수학/q22-solution.svg','Q22_SOLUTION_IMAGE_BIND_FAIL');
assert(q(20).answer==='②'&&q(22).answer==='$\\dfrac{24}{25}$','ANSWER_DRIFT');

const s20=fs.readFileSync(assetDir+'/q20-solution.svg','utf8');
assert(/>E<\/text>/.test(s20),'Q20_POINT_E_MISSING');
const E={x:261.116,y:145.905},D={x:80,y:60},C={x:333,y:180},O={x:207,y:260};
const cross=(E.x-D.x)*(C.y-D.y)-(E.y-D.y)*(C.x-D.x);
const dot=(E.x-O.x)*(C.x-D.x)+(E.y-O.y)*(C.y-D.y);
assert(Math.abs(cross)<0.2,'Q20_E_NOT_ON_DC');
assert(Math.abs(dot)<1,'Q20_OE_NOT_PERPENDICULAR_DC');

const s22=fs.readFileSync(assetDir+'/q22-solution.svg','utf8');
assert(/stroke-dasharray/.test(s22)&&/>a<\/text>/.test(s22),'Q22_ANGLE_MARK_MISSING');
const m=s22.match(/<text class="m" x="([\d.]+)" y="([\d.]+)">a<\/text>/);
assert(m&&Number(m[1])<152.5,'Q22_A_NOT_IN_LEFT_BA_BD_WEDGE');
assert(/M122\.5 250 A30 30 0 0 1 144\.1 221\.2/.test(s22),'Q22_LEFT_WEDGE_ARC_DRIFT');

const meta=JSON.parse(fs.readFileSync(metaPath,'utf8'));
const r=n=>meta.rows.find(x=>x.sourceOrdinal===n);
assert(r(19).rpmRecordId==='M2-RPM-068'&&r(19).rpmPath.scope==='M2-2'&&r(19).semanticStatus==='FINAL','Q19_META_FAIL');
assert(r(19).standardUnitKey==='M3-06'&&r(19).semanticScopeRelation==='LOWER_GRADE_PREREQUISITE','Q19_TARGET_SCOPE_FAIL');
assert(r(23).rpmRecordId===null&&r(23).semanticStatus==='HOLD'&&r(23).semanticDisposition==='TRUE_META_HOLD','Q23_TRUE_HOLD_DRIFT');
assert(r(24).rpmRecordId==='M1-RPM-092'&&r(24).rpmPath.scope==='M1-2'&&r(24).semanticStatus==='FINAL','Q24_META_FAIL');
assert(r(24).standardUnitKey==='M3-06'&&r(24).semanticScopeRelation==='LOWER_GRADE_PREREQUISITE','Q24_TARGET_SCOPE_FAIL');
assert(meta.semanticFinalCount===23&&JSON.stringify(meta.metadataCanonicalHoldQids)==='[23]','META_SUMMARY_FAIL');
const examBlob=cp.execFileSync('git',['hash-object',examPath],{encoding:'utf8'}).trim();
assert(meta.finalArtifactSha===examBlob,'FINAL_ARTIFACT_BIND_FAIL');
console.log('O50_TARGETED_REPAIR_VALIDATOR_PASS');
console.log(JSON.stringify({questionCount:24,openQids:[19,20,22,23,24],visual:{q20:'PASS',q22:'PASS'},meta:{q19:'M2-RPM-068',q23:'TRUE_META_HOLD',q24:'M1-RPM-092'},jsLoad:'PASS'}));
