import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','..');const REPORT=path.join(ROOT,'reports','hs-quadratic-svg-upgrade-20260908');const OUTPUT=path.join(REPORT,'135_specialist_v1_expected_facts_r15.json');
const TARGETS=[
 ['1final','25_매산여고_1학기_기말_고1_기출c.js',8,'number-line',{solutionInterval:[12,14],leftClosed:false,rightClosed:true,result:'12<a≤14',exact:'12<a≤14'}],
 ['1final','25_순천고_1학기_기말_고1_기출c.js',14,'number-line',{solutionInterval:[8,null],leftClosed:false,rightClosed:false,result:'a>8',exact:'a>8'}],
 ['1final','25_순천고_1학기_기말_고1_기출c.js',9,'number-line',{solutionIntervals:[{left:-2,right:0,leftClosed:true,rightClosed:true},{left:2,right:4,leftClosed:true,rightClosed:true}],integerSolutions:[-2,-1,0,2,3,4],sum:6,count:6,result:12}],
 ['1final','25_순천여고_1학기_기말_고1_기출c.js',21,'number-line',{solutionInterval:[0,1],leftClosed:true,rightClosed:true,result:'0≤a≤1',exact:'0≤a≤1'}],
 ['1final','25_순천여고_1학기_기말_고1_기출c.js',3,'number-line',{solutionInterval:[-1,5],leftClosed:true,rightClosed:true,result:'−1≤a≤5',exact:'−1≤a≤5'}],
 ['1final','25_제일고_1학기_기말_고1_기출c.js',1,'number-line',{solutionInterval:[-3,1],leftClosed:false,rightClosed:true,integerSolutions:[-2,-1,0,1],count:4,result:4}],
 ['1final','25_제일고_1학기_기말_고1_기출c.js',4,'number-line',{solutionInterval:[1,1],leftClosed:true,rightClosed:true,integerSolutions:[1],count:1,result:1,exact:'a=1'}],
 ['1final','25_제일고_1학기_기말_고1_기출c.js',5,'number-line',{solutionIntervals:[{left:null,right:-2,leftClosed:false,rightClosed:false},{left:6,right:null,leftClosed:false,rightClosed:false}],result:4,exact:'x<−2 또는 x>6'}],
 ['1final','25_제일고_1학기_기말_고1_기출c.js',6,'number-line',{solutionInterval:[0,2],leftClosed:false,rightClosed:false,result:'0<a<2',exact:'0<a<2'}],
 ['1final','25_제일고_1학기_기말_고1_기출c.js',7,'number-line',{solutionInterval:[-1,3],leftClosed:true,rightClosed:true,result:2,sum:2}],
 ['1final','25_팔마고_1학기_기말_고1_기출c.js',1,'number-line',{solutionInterval:[-2,1],leftClosed:true,rightClosed:false,result:3,width:3}],
 ['1final','25_팔마고_1학기_기말_고1_기출c.js',10,'number-line',{solutionInterval:[4,null],leftClosed:false,rightClosed:false,result:'x>4',exact:'x>4'}],
 ['1final','25_팔마고_1학기_기말_고1_기출c.js',7,'number-line',{solutionInterval:[7,8],leftClosed:false,rightClosed:true,integerSolutions:[2,3,4,5,6,7],count:6,result:'7<a≤8',exact:'7<a≤8'}],
 ['1final','25_팔마고_1학기_기말_고1_기출c.js',8,'number-line',{solutionInterval:[-4,-1],leftClosed:true,rightClosed:true,result:4,product:4}],
 ['1final','25_팔마고_1학기_기말_고1_기출c.js',9,'number-line',{solutionInterval:[-2/3,3],leftLabel:'−2/3',rightLabel:'3',leftClosed:true,rightClosed:true,integerSolutions:[0,1,2,3],sum:6,result:6}],
 ['1final','25_효천고_1학기_기말_고1_기출c.js',1,'cartesian',{function:{a:2,b:-12,c:18,domain:[0,6]},vertex:[3,0],minimum:0,result:-6,exact:'k=−6 또는 0'}],
 ['1final','25_효천고_1학기_기말_고1_기출c.js',14,'cartesian',{function:{a:1,b:2,c:21/4,domain:[-3,2]},vertex:[-1,17/4],maximum:'53/4',result:'53/4',exact:'a=2, b≤21/4'}],
 ['1final','25_효천고_1학기_기말_고1_기출c.js',4,'number-line',{solutionInterval:[-3,-1],leftClosed:true,rightClosed:true,result:-4,sum:-4}],
];
function load(relative){const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(ROOT,relative),'utf8'),c,{filename:relative,timeout:10000});return JSON.parse(JSON.stringify(c.window));}
const rows=[];for(const [dir,basename,id,expectedVisualType,expectedFacts] of TARGETS){const sourceJsPath=`archive/exams/original/high/h1/${dir}/${basename}`;const source=load(sourceJsPath);const question=source.questionBank.find(item=>Number(item.id)===id);if(!question)throw new Error(`missing ${sourceJsPath} q${id}`);rows.push({questionUid:`${sourceJsPath}|${source.examTitle}|${id}`,sourceJsPath,id,content:question.content,choices:question.choices??[],expectedVisualType,expectedFacts});}
const output={schemaVersion:'HS_QUADRATIC_SPECIALIST_V1_EXPECTED_FACTS_R15',status:'EXPECTED_FACTS_FROZEN_SOURCE_ONLY_CANDIDATE_NO_PASS',inputVisibilityProfile:'SOURCE_ONLY',priorReviewVisibility:'NONE',rows,note:'Fresh source-only facts for 18 specialist rows. Existing solution/SVG/V2/V3 evidence were not used for derivation; candidate evidence only.'};fs.writeFileSync(OUTPUT,`${JSON.stringify(output,null,2)}\n`,'utf8');console.log(JSON.stringify({status:output.status,rows:rows.length,numberLineRows:rows.filter(r=>r.expectedVisualType==='number-line').length,cartesianRows:rows.filter(r=>r.expectedVisualType==='cartesian').length},null,2));
