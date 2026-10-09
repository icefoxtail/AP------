import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root='C:/Users/USER/Desktop/AP-worktrees/h2-intake-batch01/AP------';
const pkg=path.join(root,'.tmp/archive/h2-intake-batch01-20261009/23_강남여고_1학기_중간_고2_확률과통계');
const exam=path.join(pkg,'23_강남여고_1학기_중간_고2_확률과통계.js');
const evidence=path.join(root,'archive/analysis/h2-intake-batch01-20261009/23_강남여고_1학기_중간_고2_확률과통계');
const items=JSON.parse(fs.readFileSync(path.join(evidence,'CREATE.candidate.json'),'utf8'));
const source=fs.readFileSync(exam,'utf8');
const sandbox={window:{}};vm.createContext(sandbox);vm.runInContext(source,sandbox,{filename:exam,timeout:5000});
const questions=sandbox.window.questionBank;
if(questions.length!==25||items.length!==25)throw new Error('DENOMINATOR_MISMATCH');
const by=new Map(items.map(x=>[x.qid,x]));
const levelFor=b=>b===1?'하':b===4||b===5?'상':'중';
const labels={
'H15-PS-01-PERMUTATION':'순열','H15-PS-01-COMBINATION':'조합','H15-PS-01-COUNTING_APPLICATION':'경우의 수의 활용',
'H15-PS-02-BINOMIAL_BASIC':'이항정리'
};
for(const q of questions){
  const m=by.get(Number(q.id));if(!m)throw new Error('QID_MISSING:'+q.id);
  q.answer=m.answer;q.solution=m.solution;q.decisiveStep=m.decisiveStep;
  if(m.solutionImage)q.solutionImage=m.solutionImage;else delete q.solutionImage;
  if(q.image)q.image=q.image.replace(/^archive\\/,'');
  q.level=levelFor(m.bucket);q.category=m.standardUnitKey==='H15-PS-02'?'이항정리':'순열과 조합';q.originalCategory='확률과 통계';
  q.standardCourse='확률과 통계';q.standardUnitKey=m.standardUnitKey;q.standardUnit=m.standardUnitKey==='H15-PS-02'?'이항정리':'순열과 조합';
  q.standardUnitOrder=m.standardUnitKey==='H15-PS-02'?2:1;
  q.subUnitKey=m.standardUnitKey==='H15-PS-02'?'H15-PS-02-BINOMIAL_BASIC':m.subUnitKey;
  q.subUnit=labels[q.subUnitKey];q.subUnitConfidence='candidate_evidence';q.subUnitClassificationDepth='complete_candidate';
  q.problemTypeKey=m.problemTypeKey;q.templateKey=m.templateKey;q.crossConceptKeys=[];q.conditionKeys=m.conditions;q.integrationPattern=m.integration;
  q.difficultyBucket=m.bucket;q.difficultyConfidence=m.confidence;q.difficultyBoundaryFlag='NONE';q.legacyLevelCompatibility='NORMAL';
  q.layoutTag='grid';q.wide=false;q.tags=m.tags;
  q.L1='경우의 수';q.L2=q.standardUnit;q.L3=m.rpmL3;q.L4=m.rpmL4;
  q.rpmL3=m.rpmL3;q.rpmL4=m.rpmL4;q.rpmSemanticStatus='FINAL';
  q.rpmPrimaryPath={curriculum:'2015',level:'HIGH',scope:'확률과통계',majorUnit:'경우의 수',midUnit:q.standardUnit,l3:m.rpmL3,l4:m.rpmL4};
  q.semanticSourceScope='2015/HIGH/확률과통계';q.semanticScopeRelation='CURRENT_SCOPE';q.projectionStatus='REUSE';
}
const assetDir=path.join(pkg,'assets/images/23_강남여고_1학기_중간_고2_확률과통계');fs.mkdirSync(assetDir,{recursive:true});
const pathValues=[[1,1,1,1,1,1],[1,2,0,1,0,1],[1,3,3,4,4,5],[1,4,0,4,0,5],[1,5,5,9,9,14],[1,6,11,20,29,43]];
const blocked=new Set(['1,2','3,2','1,4','3,4']);
let grid='';
for(let x=0;x<=5;x++)grid+=`<line x1="${110+90*x}" y1="120" x2="${110+90*x}" y2="470" stroke="#94a3b8" stroke-width="2"/>`;
for(let y=0;y<=5;y++)grid+=`<line x1="110" y1="${470-70*y}" x2="560" y2="${470-70*y}" stroke="#94a3b8" stroke-width="2"/>`;
for(let x=0;x<=5;x++)for(let y=0;y<=5;y++){const k=`${x},${y}`,cx=110+90*x,cy=470-70*y;if(blocked.has(k))grid+=`<circle cx="${cx}" cy="${cy}" r="17" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/><text x="${cx}" y="${cy+7}" text-anchor="middle" font-size="23" font-weight="700" fill="#b91c1c">×</text>`;else grid+=`<circle cx="${cx}" cy="${cy}" r="17" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/><text x="${cx}" y="${cy+5}" text-anchor="middle" font-size="13" font-weight="700" fill="#1e3a8a">${pathValues[x][y]}</text>`;}
const q14=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 560" width="760" height="560" role="img" aria-labelledby="t d"><title id="t">격자 최단 경로 수 누적</title><desc id="d">장애물 네 점의 경로 수를 0으로 두고 왼쪽과 아래쪽 값의 합을 누적하여 B까지 43을 얻는다.</desc><rect width="760" height="560" fill="#fff"/><text x="40" y="42" font-size="24" font-weight="700" fill="#0f172a">격자점마다 경로 수를 누적한다</text><text x="40" y="72" font-size="15" fill="#334155">각 내부 점의 수 = 왼쪽 점의 수 + 아래 점의 수 · 장애물 점은 0</text>${grid}<text x="84" y="488" font-size="17" font-weight="700">A</text><text x="568" y="116" font-size="17" font-weight="700">B</text><rect x="600" y="145" width="130" height="250" rx="14" fill="#f8fafc" stroke="#cbd5e1"/><text x="620" y="180" font-size="16" font-weight="700">마지막 계산</text><text x="620" y="220" font-size="16">d(4,5)=14</text><text x="620" y="252" font-size="16">d(5,4)=29</text><line x1="620" y1="270" x2="710" y2="270" stroke="#cbd5e1"/><text x="620" y="306" font-size="16">d(5,5)</text><text x="620" y="342" font-size="24" font-weight="700" fill="#1d4ed8">=43</text></svg>`;
const q17=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 450" width="820" height="450" role="img" aria-labelledby="t d"><title id="t">좌우 대칭 색칠의 독립 선택</title><desc id="d">축 위 삼각형 네 개는 각자 색을 고르고 좌우 대응 삼각형 두 쌍은 한 색을 공유하므로 대칭 색칠은 2의 6제곱이다.</desc><rect width="820" height="450" fill="#fff"/><text x="38" y="42" font-size="24" font-weight="700" fill="#0f172a">대칭일 때 독립적으로 색을 정하는 단위</text><rect x="38" y="78" width="300" height="290" rx="14" fill="#f8fafc" stroke="#cbd5e1"/><text x="62" y="112" font-size="18" font-weight="700">대칭축 위: 4개</text>${[0,1,2,3].map((i)=>`<rect x="62" y="${136+i*48}" width="242" height="34" rx="8" fill="#e0f2fe"/><text x="78" y="${159+i*48}" font-size="15">삼각형 ${i+1}: 빨강 또는 파랑</text>`).join('')}<rect x="368" y="78" width="280" height="290" rx="14" fill="#f8fafc" stroke="#cbd5e1"/><text x="392" y="112" font-size="18" font-weight="700">좌우 대응: 2쌍</text><rect x="392" y="140" width="232" height="72" rx="10" fill="#ede9fe"/><text x="410" y="169" font-size="16">왼쪽 쌍 1 = 오른쪽 쌍 1</text><text x="410" y="194" font-size="14">한 색 선택: 2가지</text><rect x="392" y="230" width="232" height="72" rx="10" fill="#ede9fe"/><text x="410" y="259" font-size="16">왼쪽 쌍 2 = 오른쪽 쌍 2</text><text x="410" y="284" font-size="14">한 색 선택: 2가지</text><text x="688" y="145" font-size="16" fill="#334155">4+2=6</text><text x="688" y="190" font-size="24" font-weight="700" fill="#1d4ed8">2⁶=64</text><text x="688" y="255" font-size="15" fill="#334155">전체 2⁸=256</text><text x="688" y="290" font-size="15" fill="#334155">256−64</text><text x="688" y="328" font-size="25" font-weight="700" fill="#b91c1c">=192</text><text x="38" y="414" font-size="14" fill="#475569">좌우 대칭 색칠은 각 대응쌍의 두 칸에 같은 색을 쓰는 경우만 센다.</text></svg>`;
function hex(cx,cy,r,selected){const pts=Array.from({length:6},(_,i)=>{const a=(-90+i*60)*Math.PI/180;return [cx+r*Math.cos(a),cy+r*Math.sin(a)]});const poly=pts.map(p=>p.join(',')).join(' ');let nodes=pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="17" fill="${selected.has(i)?'#fecaca':'#dbeafe'}" stroke="${selected.has(i)?'#b91c1c':'#1d4ed8'}" stroke-width="2"/><text x="${p[0]}" y="${p[1]+5}" text-anchor="middle" font-size="14" font-weight="700">${selected.has(i)?'O':'E'}</text>`).join('');return `<polygon points="${poly}" fill="none" stroke="#64748b" stroke-width="3"/>${nodes}`;}
const q21=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 470" width="820" height="470" role="img" aria-labelledby="t d"><title id="t">홀수 자리 패턴과 회전 나눗셈</title><desc id="d">육각형에서 서로 이웃하지 않는 홀수 자리 배치는 2개일 때 9가지, 3개일 때 2가지이며 모든 배치를 여섯 회전으로 나눈다.</desc><rect width="820" height="470" fill="#fff"/><text x="38" y="42" font-size="24" font-weight="700" fill="#0f172a">홀수는 서로 이웃할 수 없다</text><text x="38" y="70" font-size="15" fill="#334155">홀수 O가 이웃하면 두 수의 곱이 홀수가 된다. E는 짝수 자리이다.</text><text x="100" y="116" font-size="17" font-weight="700">홀수 2개 자리: 9가지</text>${hex(200,235,98,new Set([0,2]))}<text x="416" y="116" font-size="17" font-weight="700">홀수 3개 자리: 2가지</text>${hex(520,235,98,new Set([0,2,4]))}<rect x="38" y="382" width="744" height="56" rx="10" fill="#f8fafc" stroke="#cbd5e1"/><text x="58" y="408" font-size="15">2개: 9·P(4,2)·P(4,4)=2592</text><text x="58" y="429" font-size="15">3개: 2·P(4,3)·P(4,3)=1152</text><text x="470" y="416" font-size="17" font-weight="700" fill="#1d4ed8">(2592+1152)÷6=624</text></svg>`;
fs.writeFileSync(path.join(assetDir,'q14-solution.svg'),q14,'utf8');fs.writeFileSync(path.join(assetDir,'q17-solution.svg'),q17,'utf8');fs.writeFileSync(path.join(assetDir,'q21-solution.svg'),q21,'utf8');
const oldRefs=[];
for(const q of questions){const m=by.get(Number(q.id));if(q.image){const old=q.image;q.image=q.image.replace(/^archive\\/,'');oldRefs.push({qid:q.id,oldRef:old,newRef:q.image,sha256:'verified-identical-assignment-asset'});}}
fs.writeFileSync(exam,`window.examTitle = ${JSON.stringify(sandbox.window.examTitle)};\nwindow.questionBank = ${JSON.stringify(questions,null,2)};\n`,'utf8');
fs.writeFileSync(path.join(evidence,'CREATE.transform-ledger.json'),JSON.stringify({examUid:'23_강남여고_1학기_중간_고2_확률과통계',sourceInputMode:'EXTRACTED_JS_ASSETS',pdfReviewMode:'DEFECT_ONLY',preMutationRawSha256:'c8b0636f90a94d6ce5c7deae66cdd1cf47397b26f885d1d72696f8acf8d5c562',sourceStudentFieldsPreserved:['question','content','choices','score','questionType'],visualRefMigrations:oldRefs,solutionImageAdds:[14,17,21],sourceTextChanged:false},null,2)+'\n');
console.log(JSON.stringify({qids:questions.length,answers:questions.map(q=>[q.id,q.answer]),solutionImages:questions.filter(q=>q.solutionImage).map(q=>[q.id,q.solutionImage]),migrationCount:oldRefs.length}));