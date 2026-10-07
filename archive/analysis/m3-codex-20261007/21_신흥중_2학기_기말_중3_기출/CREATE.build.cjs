const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const root='C:/Users/USER/Desktop/AP-worktrees/m3-codex-main-done/AP------';
const ev=path.join(root,'archive/analysis/m3-codex-20261007/21_신흥중_2학기_기말_중3_기출');
const assignment=JSON.parse(fs.readFileSync(path.join(ev,'CREATE.assignment.json'),'utf8'));
const jsPath=assignment.workingJsAbsolute;
const sourceBytes=fs.readFileSync(jsPath);
const sourceRawSha=crypto.createHash('sha256').update(sourceBytes).digest('hex');
if(sourceRawSha!==assignment.artifactRawSha256) throw new Error('startup artifact SHA mismatch: '+sourceRawSha);
const originalContext={window:{}};
vm.runInNewContext(sourceBytes.toString('utf8'),originalContext);
const title=originalContext.window.examTitle;
const questions=originalContext.window.questionBank;
if(title!==assignment.examUid || questions.length!==23) throw new Error('identity/denominator mismatch');
if(questions.some(q=>q.answer||q.solution)) throw new Error('candidate is no longer the assigned blank source input');
const draft=JSON.parse(fs.readFileSync(path.join(ev,'CREATE.solution-draft.json'),'utf8'));
function normalizeStudentString(input){
  let out='';
  for(let i=0;i<input.length;){
    if(input[i]!=='\\'){out+=input[i++];continue;}
    let j=i;while(input[j]==='\\')j++;
    const count=j-i, next=input[j];
    if(next==='n'){out+='\n';i=j+1;continue;}
    if(/[A-Za-z]/.test(next||'')){
      out+='\\'.repeat(count===1?1:Math.floor(count/2));
      i=j;continue;
    }
    out+='\\'.repeat(count===1?1:Math.floor(count/2));
    i=j;
  }
  return out;
}
const normalizedQids=[];
for(const q of questions){
  let changed=false;
  const before=q.content;
  q.content=normalizeStudentString(q.content);
  if(q.content!==before) changed=true;
  q.choices=q.choices.map(choice=>{const normalized=normalizeStudentString(choice);if(normalized!==choice)changed=true;return normalized;});
  if(changed)normalizedQids.push(q.id);
  q.answer=draft.answers[String(q.id)]??'';
  q.solution=normalizeStudentString(draft.solutions[String(q.id)]??'');
}
const meta={
  1:{unit:'M3-06',sub:'M3-06-CIRCLE_INSCRIBED_ANGLE',subLabel:'원의 각 관계',pt:'PT_CIRCLE_ANGLE_RELATIONS',tpl:'TPL_CIRCLE_ANGLE_CENTER_ARC',method:'같은 호를 보는 원주각과 중심각의 관계',step:'호의 크기를 구한 뒤 원주각은 그 절반을 취한다.',bucket:1,level:'하'},
  2:{unit:'M3-06',sub:'M3-06-CIRCLE_INSCRIBED_ANGLE',subLabel:'원의 각 관계',pt:null,tpl:null,method:'확장된 사인법칙으로 현과 외접원의 반지름을 연결',step:'BC/sin A=2R에 BC=5, sin A=5/8을 대입한다.',bucket:2,level:'중'},
  3:{unit:'M3-06',sub:'M3-06-CIRCLE_INSCRIBED_ANGLE',subLabel:'원의 각 관계',pt:'PT_CIRCLE_ANGLE_RELATIONS',tpl:'TPL_CIRCLE_ANGLE_COMPOSITE',method:'원 안에서 만나는 두 현의 각은 마주 보는 두 호의 합의 절반',step:'원주 길이의 분율을 호의 각도로 바꾼 뒤 두 호를 더한다.',bucket:2,level:'중'},
  4:{unit:'M3-06',sub:'M3-06-CIRCLE_INSCRIBED_ANGLE',subLabel:'원의 각 관계',pt:'PT_CIRCLE_ANGLE_RELATIONS',tpl:'TPL_CIRCLE_ANGLE_COMPOSITE',method:'교차현 각과 호 길이를 반지름·중심각으로 연결',step:'교차각 60도를 라디안으로 바꾸고 두 호 길이 합을 반지름으로 나눈다.',bucket:2,level:'중'},
  5:{unit:'M3-06',sub:'M3-06-CIRCLE_INSCRIBED_ANGLE',subLabel:'원의 각 관계',pt:'PT_CIRCLE_ANGLE_RELATIONS',tpl:'TPL_CIRCLE_ANGLE_COMPOSITE',method:'원주각이 보는 호의 크기와 전체 원주 360도의 관계',step:'두 원주각으로 호 BCDE와 보완 호 EDC를 각각 구해 뺀다.',bucket:3,level:'중'},
  6:{unit:'M3-06',sub:'M3-06-CIRCLE_LINE',subLabel:'원과 직선',pt:'PT_CIRCLE_ANGLE_RELATIONS',tpl:'TPL_CIRCLE_ANGLE_COMPOSITE',method:'직각을 이루는 점의 자취는 두 꼭짓점을 지름으로 하는 원의 호',step:'각 변을 지름으로 하는 바깥쪽 반원 네 개의 길이를 합한다.',bucket:2,level:'중'},
  7:{unit:'M3-06',sub:'M3-06-CIRCLE_INSCRIBED_ANGLE',subLabel:'원의 각 관계',pt:'PT_CIRCLE_ANGLE_RELATIONS',tpl:'TPL_CIRCLE_ANGLE_COMPOSITE',method:'원 밖에서 만나는 두 할선의 각과 호의 차 관계를 연립',step:'외부각 두 개로 호의 두 차를 구하고 전체 호 합 360도를 적용한다.',bucket:4,level:'상'},
  8:{unit:'M3-06',sub:'M3-06-CIRCLE_INSCRIBED_ANGLE',subLabel:'원의 각 관계',pt:'PT_CIRCLE_ANGLE_RELATIONS',tpl:'TPL_CIRCLE_ANGLE_TANGENT_CHORD',method:'접선과 현이 이루는 각 및 이등변삼각형의 밑각',step:'이등변삼각형에서 ∠TAB를 구하고 접선-현 각으로 삼각형 PBT의 각을 완성한다.',bucket:3,level:'중'},
  9:{unit:'M3-06',sub:'M3-06-CIRCLE_INSCRIBED_ANGLE',subLabel:'원의 각 관계',pt:'PT_CIRCLE_ANGLE_RELATIONS',tpl:'TPL_CIRCLE_ANGLE_TANGENT_CHORD',method:'접선-현 각을 원주각으로 바꾸어 삼각형 각의 합에 적용',step:'접선-현 관계로 구하는 합을 ∠ABC+∠BAC로 바꾼다.',bucket:3,level:'중'},
  10:{unit:'M3-06',sub:'M3-06-CIRCLE_INSCRIBED_ANGLE',subLabel:'원의 각 관계',pt:'PT_CIRCLE_ANGLE_RELATIONS',tpl:'TPL_CIRCLE_ANGLE_TANGENT_CHORD',method:'지름이 만드는 직각, 평행선, 접선-현 각 관계',step:'∠ABT를 구하고 평행선으로 ∠BAD를 얻은 뒤 접선-현 각을 적용한다.',bucket:4,level:'상'},
  11:{unit:'M3-07',sub:'M3-07-STATISTICS_REPRESENTATIVE',subLabel:'대푯값과 산포도',pt:null,tpl:null,method:'극단값이 평균과 중앙값에 미치는 영향을 자료로 비교',step:'후보 자료의 중앙값과 평균을 실제 계산해 대표성을 비교한다.',bucket:2,level:'중'},
  12:{unit:'M3-07',sub:'M3-07-STATISTICS_REPRESENTATIVE',subLabel:'대푯값과 산포도',pt:null,tpl:null,method:'정렬된 다섯 자료에서 중앙값 위치를 조건으로 분류',step:'두 중앙값 조건이 허용하는 자연수 a의 교집합을 찾는다.',bucket:4,level:'상'},
  13:{unit:'M3-07',sub:'M3-07-STATISTICS_REPRESENTATIVE',subLabel:'대푯값과 산포도',pt:null,tpl:null,method:'평균 변화량을 전체 합 변화량으로 환산',step:'잘못 측정한 10명의 합에서 다른 9명의 실제 합을 뺀다.',bucket:2,level:'중'},
  14:{unit:'M3-07',sub:'M3-07-STATISTICS_REPRESENTATIVE',subLabel:'대푯값과 산포도',pt:null,tpl:null,method:'편차와 분산의 정의를 구별',step:'편차제곱의 평균이 분산이라는 정의에 맞는 진술을 고른다.',bucket:1,level:'하'},
  15:{unit:'M3-07',sub:'M3-07-STATISTICS_REPRESENTATIVE',subLabel:'대푯값과 산포도',pt:null,tpl:null,method:'편차의 합 0으로 평균에서 벗어난 성적을 복원',step:'다섯 편차의 합을 0으로 두어 x를 구한 뒤 평균에 더한다.',bucket:2,level:'중'},
  16:{unit:'M3-07',sub:'M3-07-STATISTICS_REPRESENTATIVE',subLabel:'대푯값과 산포도',pt:null,tpl:null,method:'편차의 합 0으로 누락 편차를 정하고 제곱편차 평균 계산',step:'누락 편차 -10을 복원한 뒤 다섯 제곱편차의 평균을 낸다.',bucket:3,level:'중'},
  17:{unit:'M3-07',sub:'M3-07-STATISTICS_REPRESENTATIVE',subLabel:'대푯값과 산포도',pt:null,tpl:null,method:'평균과 표준편차에서 합·제곱편차 정보를 함께 추론',step:'x+y=6 및 제곱편차합 20을 세워 x,y의 가능한 값을 닫는다.',bucket:4,level:'상'},
  18:{unit:'M3-07',sub:'M3-07-STATISTICS_DATA_INTERPRETATION',subLabel:'통계 자료 해석',pt:null,tpl:null,method:'산점도 상관 방향을 자료의 실제 변수 의미와 대조',step:'본문의 양의 상관 문구와 공식 정답/그림의 음의 상관 방향이 충돌한다.',bucket:'UNKNOWN',level:'중'},
  19:{unit:'M3-07',sub:'M3-07-STATISTICS_DATA_INTERPRETATION',subLabel:'통계 자료 해석',pt:null,tpl:null,method:'산점도에서 x>y인 점의 개수로 비율 계산',step:'직선 y=x 아래의 점 6개를 전체 15개로 나눈다.',bucket:2,level:'중'},
  20:{unit:'M3-07',sub:'M3-07-STATISTICS_DATA_INTERPRETATION',subLabel:'통계 자료 해석',pt:null,tpl:null,method:'산점도에서 조건에 맞는 점을 세어 부분집단 비율 계산',step:'x≥85인 8점 중 y≥90인 5점을 센다.',bucket:2,level:'중'},
  21:{unit:'M3-06',sub:'M3-06-CIRCLE_INSCRIBED_ANGLE',subLabel:'원의 각 관계',pt:'PT_CIRCLE_ANGLE_RELATIONS',tpl:'TPL_CIRCLE_ANGLE_COMPOSITE',method:'원 안에서 만나는 두 현의 각과 두 호의 합',step:'정오각형의 각 호 72도를 구해 교차현 공식에 대입한다.',bucket:2,level:'중'},
  22:{unit:'M3-06',sub:'M3-06-CIRCLE_INSCRIBED_ANGLE',subLabel:'원의 각 관계',pt:'PT_TRIANGLE_SIMILARITY',tpl:'TPL_TRIANGLE_SIMILARITY_APPLICATION',method:'원주각 직각과 접선 수선이 만드는 닮음 및 피타고라스 정리',step:'AB/AC=AC/AH에서 AC를 얻고 직각삼각형 ACH에서 CH를 계산한다.',bucket:4,level:'상'},
  23:{unit:'M3-07',sub:'M3-07-STATISTICS_REPRESENTATIVE',subLabel:'대푯값과 산포도',pt:null,tpl:null,method:'자료 전체를 2배하고 1을 더할 때 평균과 분산의 변화',step:'평균은 2배 후 1을 더하고, 분산은 배율의 제곱을 곱한다.',bucket:2,level:'중'}
};
const solutionHash={};
for(const q of questions){
  const m=meta[q.id];
  q.decisiveStep=m.step;
  q.primaryMethod=m.method;
  q.questionType=q.id>=21?'서술형':'객관식';
  q.level=m.level;
  q.difficultyBucket=m.bucket;
  q.difficultyConfidence=q.id===18?'UNKNOWN':'high';
  q.difficultyBoundaryFlag=q.id===18?'UNKNOWN':'NONE';
  q.legacyLevelCompatibility=q.id===18?'UNKNOWN':'NORMAL';
  q.category=m.unit==='M3-06'?'도형':'통계';
  q.originalCategory=q.category;
  q.standardCourse='M3';
  q.standardUnitKey=m.unit;
  q.standardUnit=m.unit==='M3-06'?'원의 성질':'통계';
  q.standardUnitOrder=m.unit==='M3-06'?6:7;
  q.subUnitKey=m.sub;
  q.subUnit=m.subLabel;
  q.subUnitConfidence='high';
  q.subUnitClassificationDepth='L2';
  q.problemTypeKey=m.pt;
  q.templateKey=m.tpl;
  q.crossConceptKeys=[];
  q.conditionKeys=[];
  q.integrationPattern=null;
  if(q.id===18) q.reviewStatus='HOLD';
  solutionHash[q.id]=crypto.createHash('sha256').update(q.solution,'utf8').digest('hex');
}
const output='window.examTitle = '+JSON.stringify(title)+';\nwindow.questionBank = '+JSON.stringify(questions,null,2)+';\n';
fs.writeFileSync(jsPath,output,'utf8');
const result={examUid:assignment.examUid,sourceRawSha256:sourceRawSha,normalizedStudentFieldQids:normalizedQids,questionCount:questions.length,solutionSha256ByQid:solutionHash,workingJsAbsolute:jsPath,artifactRawSha256:crypto.createHash('sha256').update(fs.readFileSync(jsPath)).digest('hex')};
fs.writeFileSync(path.join(ev,'CREATE.output-bindings.json'),JSON.stringify(result,null,2),'utf8');
console.log(JSON.stringify(result,null,2));