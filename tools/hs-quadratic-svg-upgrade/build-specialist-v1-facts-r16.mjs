import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','..');const REPORT=path.join(ROOT,'reports','hs-quadratic-svg-upgrade-20260908');const OUTPUT=path.join(REPORT,'151_specialist_v1_expected_facts_r16.json');
const TARGETS=[
 ['1final','22_매산고_1학기_기말_고1_기출.js',11,'number-line',{solutionInterval:[-3,5],leftClosed:true,rightClosed:false,integerSolutions:[-3,-2,-1,0,1,2,3,4],sum:4,result:4,exact:'−3≤a<5'}],
 ['1final','22_순천여고_1학기_기말_고1_기출.js',13,'number-line',{solutionInterval:[2,null],leftClosed:true,rightClosed:false,result:2,exact:'m≥2'}],
 ['1final','22_순천여고_1학기_기말_고1_기출.js',14,'number-line',{solutionInterval:[0.5,0.5],leftClosed:true,rightClosed:true,result:-4,exact:'a=−4, x=1/2'}],
 ['1final','22_순천여고_1학기_기말_고1_기출.js',15,'number-line',{solutionInterval:[3,6],leftClosed:true,rightClosed:false,integerSolutions:[3,4,5],sum:12,result:12,exact:'a=3,4,5'}],
 ['1final','22_복성고_1학기_기말_고1_기출.js',8,'cartesian',{function:{a:1,b:-2,c:-1,domain:[-1,4]},vertex:[1,-2],result:3,exact:'자연수 k=1,2,3'}],
 ['1final','23_금당고_1학기_기말_고1_기출.js',11,'number-line',{solutionInterval:[0.5,1],leftClosed:true,rightClosed:false,result:'1/2≤a<1',exact:'1/2≤a<1'}],
 ['1final','23_복성고_1학기_기말_고1_기출.js',2,'number-line',{solutionInterval:[-1,7],leftClosed:false,rightClosed:false,integerSolutions:[0,1,2,3,4,5,6],count:7,result:7}],
 ['1final','23_복성고_1학기_기말_고1_기출.js',7,'number-line',{solutionInterval:[null,1],leftClosed:false,rightClosed:true,result:1,exact:'a≤1'}],
 ['1final','23_제일고_1학기_기말_고1_기출.js',2,'cartesian',{function:{a:1,b:6,c:9},vertex:[-3,0],minimum:0,result:4,exact:'k=4'}],
 ['1final','23_제일고_1학기_기말_고1_기출.js',4,'number-line',{solutionInterval:[1,4],leftClosed:false,rightClosed:false,result:5,sum:5,exact:'1<x<4'}],
 ['1final','23_제일고_1학기_기말_고1_기출.js',6,'number-line',{solutionInterval:[-2,4/3],leftLabel:'−2',rightLabel:'4/3',leftClosed:false,rightClosed:false,integerSolutions:[-1,0,1],count:3,result:3}],
 ['1final','23_팔마고_1학기_기말_고1_기출.js',7,'number-line',{solutionInterval:[-2,5],leftClosed:true,rightClosed:true,integerSolutions:[-2,-1,0,1,2,3,4,5],sum:12,result:12}],
 ['1final','23_팔마고_1학기_기말_고1_기출.js',9,'number-line',{solutionInterval:[6.5,9],leftClosed:false,rightClosed:true,integerSolutions:[7,8,9],result:9,exact:'7≤x≤9인 자연수, 최댓값 9'}],
 ['1final','24_금당고_1학기_기말_고1_기출.js',1,'number-line',{solutionInterval:[1,3],leftClosed:false,rightClosed:false,result:3}],
 ['1final','24_금당고_1학기_기말_고1_기출.js',18,'number-line',{solutionInterval:[-3,0],leftClosed:true,rightClosed:true,result:-3,exact:'−3≤a≤0'}],
 ['1final','23_복성고_1학기_기말_고1_기출.js',16,'number-line',{solutionInterval:[2,6],leftClosed:true,rightClosed:true,integerSolutions:[2,3,4,5,6],result:20,sum:20,exact:'n=2,3,4,5,6'}],
 ['1final','23_제일고_1학기_기말_고1_기출.js',9,'cartesian',{function:{a:-1/4,b:0,c:0,domain:[-4,4]},vertex:[0,0],line:{slope:1,intercept:1},tangentPoint:[-2,-1],result:1,exact:'t=1'}],
 ['1final','23_팔마고_1학기_기말_고1_기출.js',15,'number-line',{solutionInterval:[900,1200],leftClosed:true,rightClosed:true,result:800,exact:'900≤추가량≤1200, 부적합 800'}],
];
function load(relative){const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(ROOT,relative),'utf8'),c,{filename:relative,timeout:10000});return JSON.parse(JSON.stringify(c.window));}
const rows=[];for(const [dir,basename,id,expectedVisualType,expectedFacts] of TARGETS){const sourceJsPath=`archive/exams/original/high/h1/${dir}/${basename}`;const source=load(sourceJsPath);const question=source.questionBank.find(item=>Number(item.id)===id);if(!question)throw new Error(`missing ${sourceJsPath} q${id}`);rows.push({questionUid:`${sourceJsPath}|${source.examTitle}|${id}`,sourceJsPath,id,content:question.content,choices:question.choices??[],expectedVisualType,expectedFacts});}
const output={schemaVersion:'HS_QUADRATIC_SPECIALIST_V1_EXPECTED_FACTS_R16',status:'EXPECTED_FACTS_FROZEN_SOURCE_ONLY_CANDIDATE_NO_PASS',inputVisibilityProfile:'SOURCE_ONLY',priorReviewVisibility:'NONE',rows,note:'Fresh source-only facts for 18 specialist rows; existing solution/SVG/V2/V3 were not used for derivation.'};fs.writeFileSync(OUTPUT,`${JSON.stringify(output,null,2)}\n`,'utf8');console.log(JSON.stringify({status:output.status,rows:rows.length,numberLineRows:rows.filter(r=>r.expectedVisualType==='number-line').length,cartesianRows:rows.filter(r=>r.expectedVisualType==='cartesian').length},null,2));
