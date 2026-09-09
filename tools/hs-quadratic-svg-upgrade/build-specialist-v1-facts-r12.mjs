import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','..'); const REPORT=path.join(ROOT,'reports','hs-quadratic-svg-upgrade-20260908'); const OUTPUT=path.join(REPORT,'81_specialist_v1_expected_facts_r12.json');
const TARGETS=[
 ['22_금당고_1학기_기말_고1_기출.js',17,'number-line',{parameter:'p',parameterCandidates:[-0.25,-0.5,-1,-2],validParameter:'-1/2',integerSolutionsAtValidParameter:[-2,-1,0,1,2,3],count:6}],
 ['22_매산고_1학기_기말_고1_기출.js',3,'case-table',{cases:[{id:'ㄱ',verdict:'참',reason:'(x+1/2)^2+3/4>0'},{id:'ㄴ',verdict:'거짓',reason:'x=y=0에서 0>0 불성립'},{id:'ㄷ',verdict:'거짓',reason:'(x-y)^2≤0은 x=y일 때만'},{id:'ㄹ',verdict:'참',reason:'1/2{(x-y)^2+(y-z)^2+(z-x)^2}≥0'}],trueCases:['ㄱ','ㄹ']}],
 ['23_금당고_1학기_기말_고1_기출.js',16,'number-line',{solutionInterval:[-6,2],leftClosed:false,rightClosed:false,integerSolutions:[-5,-4,-3,-2,-1,0,1],count:7,positiveFunction:'g(x)=-a(x+6)(x-2)',aPositive:true}],
 ['23_매산고_1학기_기말_고1_기출.js',3,'number-line',{solutionInterval:[1,6],leftClosed:true,rightClosed:true,width:5}],
 ['23_팔마고_1학기_기말_고1_기출.js',10,'number-line',{solutionInterval:[-3,3],leftClosed:true,rightClosed:false,floorCondition:'-3≤x<4',finalIntersection:'-3≤x<3'}],
 ['25_강남여고_1학기_기말_고1_기출c.js',5,'cartesian',{function:{a:1,b:-2,c:10},vertex:[1,9],minimum:9}],
 ['26_광양제철고_1학기_기말_고1_기출.js',18,'number-line',{solutionInterval:[1/3,null],leftClosed:false,rightClosed:false,boundary:'1/3',result:'x>1/3'}],
 ['26_팔마고_1학기_기말_고1_기출.js',18,'case-table',{cases:[{id:'p≤0',verdict:'q=−p²+3',reason:'최솟값은 x=0'},{id:'0≤p≤1',verdict:'q=3',reason:'꼭짓점 x=p가 구간 안'},{id:'p≥1',verdict:'q=3−(p−1)²',reason:'최솟값은 x=1'}],trueCases:['ㄱ','ㄴ'],maximum:'p+q의 최댓값=17/4'}],
 ['23_충무고_1학기_중간_고1_기출.js',20,'cartesian',{function:{a:1,b:3,c:3},vertex:[-1.5,0.75],result:13,identity:'f(x)=x²+3x+3'}],
 ['24_효천고_1학기_중간_고1_기출.js',14,'cartesian',{function:{a:-15,b:55,c:-45},roots:['(11−√13)/6','(11+√13)/6'],rootProduct:3}],
 ['25_강남여고_1학기_중간_고1_기출.js',8,'cartesian',{function:{a:1,b:-4,c:-5},vertex:[2,-9],minimum:-9}],
 ['25_금당고_1학기_중간_고1_기출.js',5,'cartesian',{function:{a:1,b:-1,c:1},vertex:[0.5,0.75],xAxisIntersections:[],discriminant:-3}],
 ['25_매산고_1학기_중간_고1_기출.js',7,'case-table',{cases:[{id:'원래 근',verdict:'α+β=27',reason:'f(x)=0의 두 근'},{id:'변환 근',verdict:'x₁=(225−α)/9, x₂=(225−β)/9',reason:'f(225−9x)=0'},{id:'합',verdict:'47',reason:'(450−27)/9'}],result:47}],
 ['25_순천여고_1학기_중간_고1_기출.js',5,'cartesian',{function:{a:-1,b:2,c:3,domain:[-2,0]},vertex:[1,4],endpointValues:{'-2':-5,'0':3},maximum:3,minimum:-5,sum:-2}],
 ['26_금당고_1학기_중간_고1_기출_c.js',6,'cartesian',{function:{a:1,b:-6,c:4,domain:[-1,2]},vertex:[3,-5],endpointValues:{'-1':11,'2':-4},maximum:11,minimum:-4}],
 ['26_매산고_1학기_중간_고1_기출c.js',4,'cartesian',{function:{a:1,b:-4,c:6,domain:[1,3]},vertex:[2,2],endpointValues:{'1':3,'3':3},maximum:3,minimum:2,sum:5}],
 ['26_매산여고_1학기_중간_고1_기출_c.js',7,'cartesian',{function:{a:1,b:-2,c:0,domain:[1,3]},vertex:[1,-1],endpointValues:{'1':-1,'3':3},maximum:3,minimum:-1,sum:2}],
 ['24_제일고_2학기_중간_고1_기출.js',20,'number-line',{solutionIntervals:[{left:-1,right:Math.sqrt(3),leftClosed:true,rightClosed:true},{left:2,right:2,leftClosed:true,rightClosed:true}],exact:'-1≤x≤√3 또는 x=2'}]
];
function load(relative){const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(ROOT,relative),'utf8'),c,{filename:relative,timeout:10000});return JSON.parse(JSON.stringify(c.window));}
const rows=[]; for(const [basename,id,expectedVisualType,expectedFacts] of TARGETS){const sourceDir=basename.startsWith('23_충무고')||basename.startsWith('23_여천고')||basename.startsWith('24_한영고')||basename.startsWith('24_효천고')||basename.startsWith('25_강남여고_1학기_중간')||basename.startsWith('25_금당고_1학기_중간')||basename.startsWith('25_매산고_1학기_중간')||basename.startsWith('25_순천여고_1학기_중간')||basename.startsWith('26_금당고_1학기_중간')||basename.startsWith('26_매산고_1학기_중간')||basename.startsWith('26_매산여고_1학기_중간')?'1mid':basename.startsWith('24_제일고_2학기_중간')?'2mid':'1final'; const sourceJsPath=`archive/exams/original/high/h1/${sourceDir}/${basename}`; const source=load(sourceJsPath); const q=source.questionBank.find(item=>Number(item.id)===id); if(!q)throw new Error(`missing ${sourceJsPath} q${id}`); rows.push({questionUid:`${sourceJsPath}|${source.examTitle}|${id}`,sourceJsPath,id,content:q.content,choices:q.choices??[],expectedVisualType,expectedFacts});}
const output={schemaVersion:'HS_QUADRATIC_SPECIALIST_V1_EXPECTED_FACTS_R12',status:'EXPECTED_FACTS_FROZEN_SOURCE_ONLY_CANDIDATE_NO_PASS',inputVisibilityProfile:'SOURCE_ONLY',priorReviewVisibility:'NONE',rows,note:'Fresh source-only fact batch for 18 remaining deterministic/specialist-ready rows. Facts were recomputed from problem content and choices without reading solution or existing SVG; this remains candidate evidence until current provider closure.'}; fs.writeFileSync(OUTPUT,`${JSON.stringify(output,null,2)}\n`,'utf8'); console.log(JSON.stringify({status:output.status,rows:rows.length,caseTableRows:rows.filter(row=>row.expectedVisualType==='case-table').length},null,2));
