import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','..');const REPORT=path.join(ROOT,'reports','hs-quadratic-svg-upgrade-20260908');const BASE=JSON.parse(fs.readFileSync(path.join(REPORT,'238_specialist_candidate_bank_manifest_r21.json'),'utf8'));const OUTPUT=path.join(REPORT,'254_specialist_v1_expected_facts_r22.json');
const TARGETS=[
 ['1final','22_매산고_1학기_기말_고1_기출.js',7,'cartesian',{function:{a:3,b:6,c:8,domain:[-4,2]},vertex:[-1,5],minimum:5,result:'y=3(x+1)^2+5',exact:'y=3(x+1)^2+5'}],
 ['1final','22_효천고_1학기_기말_고1_기출.js',15,'number-line',{integerSolutions:[-4,0],count:2,result:-4,exact:'a=−4 또는 0, 합 −4'}],
 ['1final','23_순천여고_1학기_기말_고1_기출.js',23,'number-line',{solutionInterval:[5,5],leftClosed:true,rightClosed:true,result:5,exact:'k=5'}],
 ['2mid','24_제일고_2학기_중간_고1_기출.js',22,'number-line',{integerSolutions:[-2],count:1,result:-2,exact:'a+b의 최댓값=−2'}],
 ['1final','25_강남여고_1학기_기말_고1_기출c.js',10,'number-line',{integerSolutions:[-4,4],count:2,result:'a=−4 또는 4',exact:'a=−4 또는 4'}],
 ['1final','25_강남여고_1학기_기말_고1_기출c.js',14,'number-line',{integerSolutions:[257],result:257,exact:'α⁴+β⁴=257'}],
 ['1final','25_강남여고_1학기_기말_고1_기출c.js',21,'number-line',{integerSolutions:[-2],result:-2,exact:'p=−5,q=2, 세 근의 곱=−2'}],
 ['1final','25_매산고_1학기_기말_고1_기출c.js',6,'number-line',{solutionInterval:[3/4,3/4],leftClosed:true,rightClosed:true,leftLabel:'3/4',rightLabel:'3/4',result:7,exact:'k=3/4=q/p, p+q=7'}],
 ['1final','25_매산고_1학기_기말_고1_기출c.js',7,'number-line',{solutionInterval:[1,1],leftClosed:true,rightClosed:true,result:1,exact:'a=1, 곱=1'}],
 ['1mid','25_매산고_1학기_중간_고1_기출.js',17,'number-line',{integerSolutions:[1,2,3],count:3,result:17,exact:'a=1,2,3; m+n=17'}],
 ['1mid','25_강남여고_1학기_중간_고1_기출.js',23,'number-line',{solutionIntervals:[{left:null,right:-9,leftClosed:false,rightClosed:false,_leftLabel:'−∞',_rightLabel:'−9'},{left:1/2,right:null,leftClosed:false,rightClosed:false,_leftLabel:'1/2',_rightLabel:'∞'}],result:'k<−9 또는 k>1/2',exact:'k<−9 또는 k>1/2'}],
 ['1final','25_금당고_1학기_기말_고1_기출c.js',3,'number-line',{solutionInterval:[13,13],leftClosed:true,rightClosed:true,result:13,exact:'α−β=13'}],
 ['1final','25_금당고_1학기_기말_고1_기출c.js',7,'number-line',{solutionInterval:[14,14],leftClosed:true,rightClosed:true,result:14,exact:'a=14, 나머지 두 근의 합=5'}],
 ['1final','25_금당고_1학기_기말_고1_기출c.js',11,'number-line',{integerSolutions:[0,1,2,3],count:4,result:6,exact:'p=0,1,2,3, 합=6'}],
 ['1final','25_금당고_1학기_기말_고1_기출c.js',16,'number-line',{solutionInterval:[22,22],leftClosed:true,rightClosed:true,result:22,exact:'α²+β²=22'}],
 ['1final','23_강남여고_1학기_기말_고1_기출.js',23,'number-line',{solutionInterval:[-1,-1],leftClosed:true,rightClosed:true,result:-1,exact:'a=3,b=−4,a+b=−1'}],
 ['1final','24_금당고_1학기_기말_고1_기출.js',8,'number-line',{solutionInterval:[-6,-6],leftClosed:true,rightClosed:true,result:-6,exact:'αβγ=−6'}],
 ['1final','23_복성고_1학기_기말_고1_기출.js',1,'number-line',{solutionInterval:[2,2],leftClosed:true,rightClosed:true,result:2,exact:'a=−1, α+β=3, 합=2'}],
];
function load(relative){const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(ROOT,relative),'utf8'),c,{filename:relative,timeout:10000});return JSON.parse(JSON.stringify(c.window));}
const baseBySource=new Map(BASE.candidateFiles.map(f=>[f.sourcePath,f])),rows=[];for(const [dir,basename,id,expectedVisualType,expectedFacts] of TARGETS){const sourceJsPath=`archive/exams/original/high/h1/${dir}/${basename}`;const source=load(sourceJsPath);const question=source.questionBank.find(item=>Number(item.id)===id);if(!question)throw new Error(`missing ${sourceJsPath} q${id}`);const base=load(baseBySource.get(sourceJsPath).candidatePath);const candidateQuestion=base.questionBank.find(item=>Number(item.id)===id);if(candidateQuestion?.solutionImage)throw new Error(`already candidate visualized ${sourceJsPath} q${id}`);rows.push({questionUid:`${sourceJsPath}|${source.examTitle}|${id}`,sourceJsPath,id,content:question.content,choices:question.choices??[],expectedVisualType,expectedFacts});}
const output={schemaVersion:'HS_QUADRATIC_SPECIALIST_V1_EXPECTED_FACTS_R22',status:'EXPECTED_FACTS_FROZEN_SOURCE_ONLY_CANDIDATE_NO_PASS',inputVisibilityProfile:'SOURCE_ONLY',priorReviewVisibility:'NONE',rows,note:'Fresh source-only facts for 18 specialist rows; existing solution/SVG/V2/V3 evidence were not used for derivation.'};fs.writeFileSync(OUTPUT,`${JSON.stringify(output,null,2)}\n`,'utf8');console.log(JSON.stringify({status:output.status,rows:rows.length,numberLineRows:rows.filter(r=>r.expectedVisualType==='number-line').length,cartesianRows:rows.filter(r=>r.expectedVisualType==='cartesian').length},null,2));
