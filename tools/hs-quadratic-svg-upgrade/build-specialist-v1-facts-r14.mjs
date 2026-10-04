import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','..'); const REPORT=path.join(ROOT,'reports','hs-quadratic-svg-upgrade-20260908'); const OUTPUT=path.join(REPORT,'118_specialist_v1_expected_facts_r14.json');
const TARGETS=[
 ['1final','24_매산고_1학기_기말_고1_기출.js',1,'number-line',{solutionInterval:[3,5],leftClosed:true,rightClosed:false,integerSolutions:[3,4],count:2,result:2}],
 ['1final','24_매산고_1학기_기말_고1_기출.js',13,'number-line',{solutionInterval:[3,4],leftClosed:false,rightClosed:false,result:12,exact:'3<x<4, ab=12'}],
 ['1final','24_매산고_1학기_기말_고1_기출.js',2,'number-line',{solutionInterval:[-2,3],leftClosed:false,rightClosed:false,result:-7,exact:'a=−1, b=−6, a+b=−7'}],
 ['1final','24_제일고_1학기_기말_고1_기출.js',1,'cartesian',{function:{a:1,b:4,c:4},vertex:[-2,0],minimum:0,result:4}],
 ['1final','24_제일고_1학기_기말_고1_기출.js',19,'number-line',{solutionInterval:[1,2],leftClosed:false,rightClosed:false,exact:'1<x<2'}],
 ['1final','24_제일고_1학기_기말_고1_기출.js',2,'cartesian',{function:{a:1,b:-1,c:4},vertex:[0.5,3.75],line:{slope:1,intercept:3},tangentPoint:[1,4],result:3}],
 ['1final','24_제일고_1학기_기말_고1_기출.js',20,'cartesian',{function:{a:-2,b:4,c:3,domain:[-1,3]},vertex:[1,5],maximum:5,result:6}],
 ['1final','25_강남여고_1학기_기말_고1_기출c.js',13,'cartesian',{function:{a:1,b:-4,c:-4,domain:[-2,3]},vertex:[2,-8],maximum:8,minimum:-8,result:-4}],
 ['1final','25_강남여고_1학기_기말_고1_기출c.js',19,'number-line',{solutionInterval:[-14,-11],leftClosed:true,rightClosed:false,integerSolutions:[-14,-13,-12],result:2,exact:'−14≤a<−11'}],
 ['1final','25_강남여고_1학기_기말_고1_기출c.js',20,'cartesian',{function:{a:-1,b:4,c:0,domain:[0,3]},vertex:[2,4],line:{slope:1,intercept:0},result:18}],
 ['1final','25_강남여고_1학기_기말_고1_기출c.js',6,'number-line',{solutionInterval:[4/3,6],leftLabel:'4/3',rightLabel:'6',leftClosed:false,rightClosed:false,integerSolutions:[2,3,4,5],count:4,result:4}],
 ['1final','25_제일고_1학기_기말_고1_기출c.js',3,'number-line',{solutionInterval:[null,2],leftClosed:false,rightClosed:false,integerSolutions:[1],result:1,exact:'a<2, 정수 최댓값 1'}],
 ['1final','25_금당고_1학기_기말_고1_기출c.js',15,'number-line',{solutionInterval:[0,1],leftClosed:false,rightClosed:false,count:0,result:0,exact:'0<x<1'}],
 ['1final','25_금당고_1학기_기말_고1_기출c.js',4,'number-line',{solutionInterval:[-4,6],leftClosed:true,rightClosed:true,integerSolutions:[-4,-3,-2,-1,0,1,2,3,4,5,6],count:11,result:11}],
 ['1final','25_금당고_1학기_기말_고1_기출c.js',9,'number-line',{solutionInterval:[3,17/3],leftLabel:'3',rightLabel:'17/3',leftClosed:true,rightClosed:true,integerSolutions:[3,4,5],sum:12,result:12}],
 ['1final','25_매산고_1학기_기말_고1_기출c.js',5,'number-line',{solutionInterval:[-2,1],leftClosed:false,rightClosed:true,integerSolutions:[-1,0,1],count:3,result:3}],
 ['1final','25_매산고_1학기_기말_고1_기출c.js',9,'number-line',{solutionInterval:[3,6],leftClosed:true,rightClosed:false,integerSolutions:[3,4,5],maximum:5,result:15}],
 ['1final','25_매산여고_1학기_기말_고1_기출c.js',21,'number-line',{solutionInterval:[-1,3],leftClosed:false,rightClosed:false,exact:'1<a<3'}],
];
function load(relative){const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(ROOT,relative),'utf8'),c,{filename:relative,timeout:10000});return JSON.parse(JSON.stringify(c.window));}
const rows=[]; for(const [dir,basename,id,expectedVisualType,expectedFacts] of TARGETS){const sourceJsPath=`archive/exams/original/high/h1/${dir}/${basename}`;const source=load(sourceJsPath);const question=source.questionBank.find(item=>Number(item.id)===id);if(!question)throw new Error(`missing ${sourceJsPath} q${id}`);rows.push({questionUid:`${sourceJsPath}|${source.examTitle}|${id}`,sourceJsPath,id,content:question.content,choices:question.choices??[],expectedVisualType,expectedFacts});}
const output={schemaVersion:'HS_QUADRATIC_SPECIALIST_V1_EXPECTED_FACTS_R14',status:'EXPECTED_FACTS_FROZEN_SOURCE_ONLY_CANDIDATE_NO_PASS',inputVisibilityProfile:'SOURCE_ONLY',priorReviewVisibility:'NONE',rows,note:'Fresh source-only facts for 18 specialist rows. Existing solution, SVG, V2, and V3 evidence were not used for derivation; this is candidate evidence with no PASS claim.'};fs.writeFileSync(OUTPUT,`${JSON.stringify(output,null,2)}\n`,'utf8');console.log(JSON.stringify({status:output.status,rows:rows.length,numberLineRows:rows.filter(r=>r.expectedVisualType==='number-line').length,cartesianRows:rows.filter(r=>r.expectedVisualType==='cartesian').length},null,2));
