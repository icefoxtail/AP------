import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','..');const REPORT=path.join(ROOT,'reports','hs-quadratic-svg-upgrade-20260908');const OUTPUT=path.join(REPORT,'204_specialist_v1_expected_facts_r19.json');
const TARGETS=[
 ['1final','26_순천고_1학기_기말_고1_기출.js',13,'number-line',{solutionInterval:[-3,0],leftClosed:true,rightClosed:true,result:-3,exact:'−3≤a≤0'}],
 ['1final','26_순천고_1학기_기말_고1_기출.js',15,'number-line',{solutionIntervals:[{left:1,right:1,leftClosed:true,rightClosed:true},{left:5,right:7,leftClosed:true,rightClosed:true}],integerSolutions:[1,5,6,7],sum:19,result:19,exact:'n=1,5,6,7'}],
 ['1final','26_효천고_1학기_기말_고1_기출.js',5,'cartesian',{function:{a:3,b:6,c:-9,domain:[-5,3]},vertex:[-1,-12],xAxisIntersections:[-3,1],result:3,exact:'f(x)<g(x)인 정수 x=−2,−1,0'}],
 ['1final','26_순천고_1학기_기말_고1_기출.js',20,'cartesian',{function:{a:-50,b:2000,c:25000,domain:[0,40]},vertex:[20,45000],maximum:45000,result:400,exact:'최적 판매 가격 400원'}],
 ['1final','26_순천여고_1학기_기말_고1_기출.js',9,'number-line',{solutionInterval:[20,30],leftClosed:true,rightClosed:true,result:20,exact:'20≤A무게≤30, 최솟값 20g'}],
 ['1final','26_순천여고_1학기_기말_고1_기출.js',11,'number-line',{solutionInterval:[-1,null],leftClosed:true,rightClosed:false,result:-1,exact:'a≥−1'}],
 ['1final','26_팔마고_1학기_기말_고1_기출.js',12,'number-line',{solutionIntervals:[{left:0,right:1,leftClosed:true,rightClosed:false},{left:5,right:6,leftClosed:false,rightClosed:true}],maximum:6,result:6,exact:'0≤a<1 또는 5<a≤6, 최댓값 6'}],
 ['1final','26_효천고_1학기_기말_고1_기출.js',15,'number-line',{solutionInterval:[0,5],leftClosed:true,rightClosed:false,integerSolutions:[0,1,2,3,4],result:0,exact:'k=0,1,2,3,4, 최소 정수 0'}],
 ['1final','26_효천고_1학기_기말_고1_기출.js',8,'cartesian',{function:{a:1,b:-12,c:20,domain:[0,2]},vertex:[6,-16],minimum:0,result:6,exact:'a=6'}],
 ['1final','26_효천고_1학기_기말_고1_기출.js',11,'number-line',{solutionInterval:[1,null],leftClosed:true,rightClosed:false,result:1,exact:'a≥1'}],
 ['1final','26_효천고_1학기_기말_고1_기출.js',13,'cartesian',{function:{a:1,b:-2,c:-8,domain:[-3,5]},vertex:[1,-9],xAxisIntersections:[-2,4],result:9}],
 ['1mid','23_부영여고_1학기_중간_고1_기출.js',15,'cartesian',{function:{a:2,b:-8,c:24,domain:[0,3]},vertex:[2,16],minimum:16,result:16}],
 ['1mid','23_매산고_1학기_중간_고1_기출.js',5,'cartesian',{function:{a:4,b:-12,c:9,domain:[0,3]},vertex:[1.5,0],minimum:0,result:12}],
 ['1mid','23_여천고_1학기_중간_고1_기출.js',10,'case-table',{cases:[{id:'ㄱ',verdict:'참',reason:'판별식 17>0'},{id:'ㄴ',verdict:'거짓',reason:'판별식 0'},{id:'ㄷ',verdict:'거짓',reason:'판별식 −15<0'},{id:'ㄹ',verdict:'참',reason:'판별식 24>0'}],result:'ㄱ, ㄹ'}],
];
function load(relative){const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(ROOT,relative),'utf8'),c,{filename:relative,timeout:10000});return JSON.parse(JSON.stringify(c.window));}
const rows=[];for(const [dir,basename,id,expectedVisualType,expectedFacts] of TARGETS){const sourceJsPath=`archive/exams/original/high/h1/${dir}/${basename}`;const source=load(sourceJsPath);const question=source.questionBank.find(item=>Number(item.id)===id);if(!question)throw new Error(`missing ${sourceJsPath} q${id}`);rows.push({questionUid:`${sourceJsPath}|${source.examTitle}|${id}`,sourceJsPath,id,content:question.content,choices:question.choices??[],expectedVisualType,expectedFacts});}
const output={schemaVersion:'HS_QUADRATIC_SPECIALIST_V1_EXPECTED_FACTS_R19',status:'EXPECTED_FACTS_FROZEN_SOURCE_ONLY_CANDIDATE_NO_PASS',inputVisibilityProfile:'SOURCE_ONLY',priorReviewVisibility:'NONE',rows,note:'Fresh source-only facts for 14 specialist rows; existing solution/SVG/V2/V3 evidence were not used for derivation.'};fs.writeFileSync(OUTPUT,`${JSON.stringify(output,null,2)}\n`,'utf8');console.log(JSON.stringify({status:output.status,rows:rows.length,numberLineRows:rows.filter(r=>r.expectedVisualType==='number-line').length,cartesianRows:rows.filter(r=>r.expectedVisualType==='cartesian').length,caseTableRows:rows.filter(r=>r.expectedVisualType==='case-table').length},null,2));
