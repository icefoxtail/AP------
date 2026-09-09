import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','..');const REPORT=path.join(ROOT,'reports','hs-quadratic-svg-upgrade-20260908');const OUTPUT=path.join(REPORT,'188_specialist_v1_expected_facts_r18.json');
const TARGETS=[
 ['1final','26_순천여고_1학기_기말_고1_기출.js',5,'number-line',{solutionInterval:[-5,9],leftClosed:false,rightClosed:false,integerSolutions:[-4,-3,-2,-1,0,1,2,3,4,5,6,7,8],count:13,result:13}],
 ['1final','26_순천여고_1학기_기말_고1_기출.js',6,'cartesian',{function:{a:1,b:2,c:-15,domain:[-6,4]},vertex:[-1,-16],xAxisIntersections:[-5,3],result:-3,exact:'a=2, b=−5'}],
 ['1final','26_팔마고_1학기_기말_고1_기출.js',3,'cartesian',{function:{a:1,b:-2,c:-3,domain:[-2,4]},vertex:[1,-4],xAxisIntersections:[-1,3],result:-2}],
 ['1final','26_팔마고_1학기_기말_고1_기출.js',6,'number-line',{solutionInterval:[-5/3,5/3],leftLabel:'−5/3',rightLabel:'5/3',leftClosed:true,rightClosed:true,integerSolutions:[-1,0,1],count:3,result:3}],
 ['1final','26_순천여고_1학기_기말_고1_기출.js',17,'cartesian',{function:{a:1,b:4,c:7,domain:[-5,1]},vertex:[-2,3],result:30,exact:'|a−b|<4, 순서쌍 30개'}],
 ['1final','26_순천여고_1학기_기말_고1_기출.js',22,'number-line',{solutionInterval:[4,8],leftClosed:true,rightClosed:false,integerSolutions:[4,5,6,7],result:'n=4,5,6,7',exact:'n=4,5,6,7'}],
 ['1final','26_팔마고_1학기_기말_고1_기출.js',14,'number-line',{solutionInterval:[2,3],leftClosed:true,rightClosed:true,integerSolutions:[2,3],sum:5,result:5,exact:'k=2,3'}],
 ['1final','26_효천고_1학기_기말_고1_기출.js',4,'cartesian',{function:{a:1,b:-3,c:-10,domain:[-3,6]},vertex:[1.5,-12.25],xAxisIntersections:[-2,5],result:3}],
 ['1mid','23_부영여고_1학기_중간_고1_기출.js',6,'cartesian',{function:{a:1,b:4,c:4,domain:[-4,0]},vertex:[-2,0],minimum:0,result:-2}],
 ['1mid','23_부영여고_1학기_중간_고1_기출.js',7,'cartesian',{function:{a:1,b:-4,c:2,domain:[0,4]},vertex:[2,-2],result:40}],
 ['1mid','23_부영여고_1학기_중간_고1_기출.js',8,'cartesian',{function:{a:1,b:-6,c:1,domain:[1,7]},vertex:[3,-8],maximum:8,minimum:-8,result:0}],
 ['1mid','23_여수여고_1학기_중간_고1_기출.js',13,'cartesian',{function:{a:1,b:-2,c:1,domain:[-1,3]},vertex:[1,0],minimum:0,result:-1}],
 ['1mid','23_여수여고_1학기_중간_고1_기출.js',15,'cartesian',{function:{a:1,b:3,c:9/4,domain:[-4,1]},vertex:[-1.5,0],minimum:0,result:'5/4',exact:'k=5/4'}],
 ['1mid','23_여천고_1학기_중간_고1_기출.js',11,'cartesian',{function:{a:1,b:5,c:-1,domain:[-6,1]},vertex:[-2.5,-7.25],result:-22}],
 ['1mid','23_여천고_1학기_중간_고1_기출.js',13,'cartesian',{function:{a:1,b:3,c:3,domain:[-3,2]},vertex:[-1.5,0.75],line:{slope:2,intercept:5},result:8}],
 ['1mid','23_여천고_1학기_중간_고1_기출.js',15,'cartesian',{function:{a:1,b:-4,c:9,domain:[-1,3]},vertex:[2,5],maximum:14,minimum:5,result:14}],
 ['1mid','23_부영여고_1학기_중간_고1_기출.js',14,'cartesian',{function:{a:1,b:-4,c:4,domain:[0,4]},vertex:[2,0],result:'11/3',exact:'5/3<k≤2'}],
 ['1mid','23_부영여고_1학기_중간_고1_기출.js',13,'cartesian',{function:{a:2,b:8,c:4,domain:[-5,1]},vertex:[-2,-4],line:{slope:1,intercept:0},result:3,parameterRange:[-17/8,3/4],integerSolutions:[-2,-1,0],exact:'−17/8≤k<3/4'}],
];
function load(relative){const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(ROOT,relative),'utf8'),c,{filename:relative,timeout:10000});return JSON.parse(JSON.stringify(c.window));}
const rows=[];for(const [dir,basename,id,expectedVisualType,expectedFacts] of TARGETS){const sourceJsPath=`archive/exams/original/high/h1/${dir}/${basename}`;const source=load(sourceJsPath);const question=source.questionBank.find(item=>Number(item.id)===id);if(!question)throw new Error(`missing ${sourceJsPath} q${id}`);rows.push({questionUid:`${sourceJsPath}|${source.examTitle}|${id}`,sourceJsPath,id,content:question.content,choices:question.choices??[],expectedVisualType,expectedFacts});}
const output={schemaVersion:'HS_QUADRATIC_SPECIALIST_V1_EXPECTED_FACTS_R18',status:'EXPECTED_FACTS_FROZEN_SOURCE_ONLY_CANDIDATE_NO_PASS',inputVisibilityProfile:'SOURCE_ONLY',priorReviewVisibility:'NONE',rows,note:'Fresh source-only facts for 18 specialist rows; existing solution/SVG/V2/V3 evidence were not used for derivation.'};fs.writeFileSync(OUTPUT,`${JSON.stringify(output,null,2)}\n`,'utf8');console.log(JSON.stringify({status:output.status,rows:rows.length,numberLineRows:rows.filter(r=>r.expectedVisualType==='number-line').length,cartesianRows:rows.filter(r=>r.expectedVisualType==='cartesian').length},null,2));
