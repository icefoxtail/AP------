import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','..');const REPORT=path.join(ROOT,'reports','hs-quadratic-svg-upgrade-20260908');const OUTPUT=path.join(REPORT,'220_specialist_v1_expected_facts_r20.json');
const TARGETS=[
 ['1mid','24_효천고_1학기_중간_고1_기출.js',1,'cartesian',{function:{a:1,b:-2,c:2,domain:[-2,4]},vertex:[1,1],xAxisIntersections:[],result:0}],
 ['1mid','24_효천고_1학기_중간_고1_기출.js',10,'cartesian',{function:{a:1,b:-4,c:8,domain:[-2,6]},vertex:[2,4],minimum:4,result:8}],
 ['1mid','24_효천고_1학기_중간_고1_기출.js',16,'cartesian',{function:{a:1,b:8,c:-7,domain:[-8,2]},vertex:[-4,-23],result:'−7≤t≤1',exact:'−7≤t≤1'}],
 ['1mid','24_효천고_1학기_중간_고1_기출.js',19,'cartesian',{function:{a:1,b:2,c:0,domain:[-8,2]},vertex:[-1,-1],xAxisIntersections:[-2,0],result:8,exact:'−8<a<1, 정수 8개'}],
 ['1mid','24_효천고_1학기_중간_고1_기출.js',21,'cartesian',{function:{a:1,b:2,c:0,domain:[-3,1]},vertex:[-1,-1],result:-8,exact:'a=−8 또는 0'}],
 ['1mid','24_효천고_1학기_중간_고1_기출.js',22,'cartesian',{function:{a:-1,b:2*Math.sqrt(2),c:2*Math.sqrt(2),domain:[0,2]},vertex:[Math.sqrt(2),2+2*Math.sqrt(2)],result:2,exact:'a=2−√2 또는 √2, 합 2'}],
 ['1mid','24_효천고_1학기_중간_고1_기출.js',4,'cartesian',{function:{a:1,b:-4,c:4,domain:[0,4]},vertex:[2,0],minimum:0,result:-7,exact:'k=−7'}],
 ['1mid','24_효천고_1학기_중간_고1_기출.js',8,'cartesian',{function:{a:2,b:-4,c:0,domain:[-1,4]},vertex:[1,-2],maximum:16,minimum:-2,result:18}],
 ['1mid','25_강남여고_1학기_중간_고1_기출.js',12,'cartesian',{function:{a:1,b:-2,c:14,domain:[-2,4]},vertex:[1,13],minimum:13,result:13}],
 ['1mid','25_강남여고_1학기_중간_고1_기출.js',14,'cartesian',{function:{a:2,b:7,c:4,domain:[-5,2]},vertex:[-1.75,-2.125],result:4}],
 ['1mid','25_매산고_1학기_중간_고1_기출.js',2,'cartesian',{function:{a:1,b:-4,c:2,domain:[0,4]},vertex:[2,-2],result:2}],
 ['1mid','25_매산고_1학기_중간_고1_기출.js',4,'cartesian',{function:{a:1,b:2*(2+Math.sqrt(10)),c:(2+Math.sqrt(10))**2,domain:[-7,1]},vertex:[-(2+Math.sqrt(10)),0],result:-6,exact:'a=2±√10, 곱=−6'}],
 ['1mid','25_매산고_1학기_중간_고1_기출.js',8,'cartesian',{function:{a:2,b:0,c:-10,domain:[0,5]},vertex:[0,-10],maximum:40,result:40}],
 ['1mid','25_순천여고_1학기_중간_고1_기출.js',10,'cartesian',{function:{a:-1,b:0,c:8,domain:[0,9]},vertex:[0,8],result:8,exact:'1≤k≤8, 8개'}],
 ['1mid','25_순천여고_1학기_중간_고1_기출.js',14,'cartesian',{function:{a:1,b:-0.5,c:-1,domain:[-2,2]},vertex:[0.25,-1.0625],result:'1/2',exact:'a−b=1/2'}],
 ['1mid','25_순천여고_1학기_중간_고1_기출.js',16,'number-line',{solutionInterval:[1,1],leftClosed:true,rightClosed:true,result:12,exact:'x=1, 최솟값 12'}],
 ['1mid','25_팔마고_1학기_중간_고1_기출.js',3,'cartesian',{function:{a:1,b:2,c:2,domain:[-4,2]},vertex:[-1,1],minimum:1,result:6,exact:'k=6'}],
 ['1mid','25_강남여고_1학기_중간_고1_기출.js',4,'cartesian',{function:{a:1,b:-3,c:-2,domain:[-2,4]},vertex:[1.5,-4.25],xAxisIntersections:[(3-Math.sqrt(17))/2,(3+Math.sqrt(17))/2],result:-2}],
];
function load(relative){const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(ROOT,relative),'utf8'),c,{filename:relative,timeout:10000});return JSON.parse(JSON.stringify(c.window));}
const rows=[];for(const [dir,basename,id,expectedVisualType,expectedFacts] of TARGETS){const sourceJsPath=`archive/exams/original/high/h1/${dir}/${basename}`;const source=load(sourceJsPath);const question=source.questionBank.find(item=>Number(item.id)===id);if(!question)throw new Error(`missing ${sourceJsPath} q${id}`);rows.push({questionUid:`${sourceJsPath}|${source.examTitle}|${id}`,sourceJsPath,id,content:question.content,choices:question.choices??[],expectedVisualType,expectedFacts});}
const output={schemaVersion:'HS_QUADRATIC_SPECIALIST_V1_EXPECTED_FACTS_R20',status:'EXPECTED_FACTS_FROZEN_SOURCE_ONLY_CANDIDATE_NO_PASS',inputVisibilityProfile:'SOURCE_ONLY',priorReviewVisibility:'NONE',rows,note:'Fresh source-only facts for 18 specialist rows; existing solution/SVG/V2/V3 evidence were not used for derivation.'};fs.writeFileSync(OUTPUT,`${JSON.stringify(output,null,2)}\n`,'utf8');console.log(JSON.stringify({status:output.status,rows:rows.length,numberLineRows:rows.filter(r=>r.expectedVisualType==='number-line').length,cartesianRows:rows.filter(r=>r.expectedVisualType==='cartesian').length},null,2));
