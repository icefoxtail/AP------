import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','..');const REPORT=path.join(ROOT,'reports','hs-quadratic-svg-upgrade-20260908');const OUTPUT=path.join(REPORT,'168_specialist_v1_expected_facts_r17.json');
const TARGETS=[
 ['1final','22_금당고_1학기_기말_고1_기출.js',15,'number-line',{solutionInterval:[2,4],leftClosed:true,rightClosed:false,integerSolutions:[2,3],maximum:3,result:3,exact:'a=2,3'}],
 ['1final','22_매산고_1학기_기말_고1_기출.js',16,'number-line',{solutionInterval:[8,9],leftClosed:true,rightClosed:false,result:'8≤a<9',exact:'8≤a<9'}],
 ['1final','22_복성고_1학기_기말_고1_기출.js',17,'cartesian',{function:{a:1,b:-4,c:4,domain:[0,4]},vertex:[2,0],minimum:0,result:6,exact:'a=2, b=4'}],
 ['1final','22_복성고_1학기_기말_고1_기출.js',19,'number-line',{solutionIntervals:[{left:-3,right:-3,leftClosed:true,rightClosed:true},{left:3,right:5,leftClosed:true,rightClosed:false}],integerSolutions:[-3,3,4],sum:4,result:4,exact:'m=−3,3,4'}],
 ['1final','25_강남여고_1학기_기말_고1_기출c.js',9,'cartesian',{function:{a:1,b:4,c:-5,domain:[-6,2]},vertex:[-2,-9],xAxisIntersections:[-5,1],result:6}],
 ['1final','25_강남여고_1학기_기말_고1_기출c.js',22,'number-line',{solutionInterval:[5,5],leftClosed:true,rightClosed:true,integerSolutions:[5],count:1,result:1,exact:'a=5'}],
 ['1final','26_광양제철고_1학기_기말_고1_기출.js',1,'number-line',{solutionInterval:[-3,-1],leftClosed:false,rightClosed:true,integerSolutions:[-2,-1],count:2,result:2}],
 ['1final','26_광양제철고_1학기_기말_고1_기출.js',8,'number-line',{solutionInterval:[(-7-Math.sqrt(13))/2,(-7+Math.sqrt(13))/2],leftLabel:'(-7−√13)/2',rightLabel:'(-7+√13)/2',leftClosed:true,rightClosed:true,integerSolutions:[-5,-4,-3,-2],count:4,result:4,exact:'(-7−√13)/2≤a≤(-7+√13)/2'}],
 ['1final','26_금당고_1학기_기말_고1_기출.js',10,'number-line',{solutionInterval:[15,15],leftClosed:true,rightClosed:true,integerSolutions:[15],result:18,exact:'n=15, 최댓값 18'}],
 ['1final','26_금당고_1학기_기말_고1_기출.js',2,'number-line',{solutionInterval:[5,8],leftClosed:false,rightClosed:false,result:'5<x<8',exact:'5<x<8'}],
 ['1final','26_금당고_1학기_기말_고1_기출.js',3,'number-line',{solutionIntervals:[{left:null,right:2,leftClosed:false,rightClosed:true},{left:5,right:null,leftClosed:true,rightClosed:false}],result:'x≤2 또는 x≥5',exact:'x≤2 또는 x≥5'}],
 ['1final','26_매산고_1학기_기말_고1_기출.js',13,'number-line',{solutionInterval:[4,5],leftClosed:true,rightClosed:false,result:9,exact:'4≤a<5'}],
 ['1final','26_매산고_1학기_기말_고1_기출.js',6,'number-line',{solutionInterval:[2,7],leftClosed:false,rightClosed:true,integerSolutions:[3,4,5,6,7],count:5,result:5}],
 ['1final','26_매산고_1학기_기말_고1_기출.js',9,'number-line',{solutionInterval:[27,null],leftClosed:true,rightClosed:false,result:27,exact:'k≥27'}],
 ['1final','26_복성고_1학기_기말_고1_기출.js',11,'number-line',{solutionInterval:[-2,10/3],leftLabel:'−2',rightLabel:'10/3',leftClosed:true,rightClosed:true,result:4/3,exact:'−2≤x≤10/3'}],
 ['1final','26_복성고_1학기_기말_고1_기출.js',7,'number-line',{solutionInterval:[-3,0.5],leftLabel:'−3',rightLabel:'1/2',leftClosed:true,rightClosed:true,result:-2,exact:'−3≤x≤1/2'}],
 ['1final','23_팔마고_1학기_기말_고1_기출.js',20,'number-line',{solutionIntervals:[{left:null,right:-2.5,_leftLabel:'−∞',_rightLabel:'−5/2',leftClosed:false,rightClosed:false},{left:2.5,right:null,_leftLabel:'5/2',_rightLabel:'∞',leftClosed:false,rightClosed:false}],result:'x<−5/2 또는 x>5/2',exact:'x<−5/2 또는 x>5/2'}],
 ['1final','23_순천여고_1학기_기말_고1_기출.js',7,'number-line',{solutionInterval:[-3,2],leftClosed:true,rightClosed:true,result:2,exact:'−3≤a≤2'}],
];
function load(relative){const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(ROOT,relative),'utf8'),c,{filename:relative,timeout:10000});return JSON.parse(JSON.stringify(c.window));}
const rows=[];for(const [dir,basename,id,expectedVisualType,expectedFacts] of TARGETS){const sourceJsPath=`archive/exams/original/high/h1/${dir}/${basename}`;const source=load(sourceJsPath);const question=source.questionBank.find(item=>Number(item.id)===id);if(!question)throw new Error(`missing ${sourceJsPath} q${id}`);rows.push({questionUid:`${sourceJsPath}|${source.examTitle}|${id}`,sourceJsPath,id,content:question.content,choices:question.choices??[],expectedVisualType,expectedFacts});}
const output={schemaVersion:'HS_QUADRATIC_SPECIALIST_V1_EXPECTED_FACTS_R17',status:'EXPECTED_FACTS_FROZEN_SOURCE_ONLY_CANDIDATE_NO_PASS',inputVisibilityProfile:'SOURCE_ONLY',priorReviewVisibility:'NONE',rows,note:'Fresh source-only facts for 18 specialist rows; existing solution/SVG/V2/V3 evidence were not used for derivation.'};fs.writeFileSync(OUTPUT,`${JSON.stringify(output,null,2)}\n`,'utf8');console.log(JSON.stringify({status:output.status,rows:rows.length,numberLineRows:rows.filter(r=>r.expectedVisualType==='number-line').length,cartesianRows:rows.filter(r=>r.expectedVisualType==='cartesian').length},null,2));
