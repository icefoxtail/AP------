import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','..');const REPORT=path.join(ROOT,'reports','hs-quadratic-svg-upgrade-20260908');const OUTPUT=path.join(REPORT,'236_specialist_v1_expected_facts_r21.json');
const TARGETS=[
 ['1final','22_효천고_1학기_기말_고1_기출.js',9,'cartesian',{function:{a:1,b:-2,c:5,domain:[-1,2]},vertex:[1,4],minimum:4,maximum:8,result:8,exact:'k=5, 최댓값 8'}],
 ['1final','22_효천고_1학기_기말_고1_기출.js',11,'number-line',{solutionInterval:[2,4],leftClosed:false,rightClosed:true,result:'2<x≤4',exact:'2<x≤4'}],
 ['1final','22_매산고_1학기_기말_고1_기출.js',5,'number-line',{solutionInterval:[null,17/8],leftClosed:false,rightClosed:false,leftLabel:'−∞',rightLabel:'17/8',result:'k<17/8',exact:'r²=17/4−2k>0'}],
 ['1final','22_매산고_1학기_기말_고1_기출.js',9,'number-line',{solutionInterval:[2/3,3],leftClosed:false,rightClosed:false,leftLabel:'2/3',rightLabel:'3',result:'11/3',exact:'2/3<m<3'}],
 ['1final','22_순천여고_1학기_기말_고1_기출.js',5,'number-line',{solutionInterval:[null,-1],leftClosed:false,rightClosed:false,leftLabel:'−∞',rightLabel:'−1',result:-2,exact:'a<−1, 정수 최댓값 −2'}],
 ['1final','22_순천여고_1학기_기말_고1_기출.js',21,'cartesian',{function:{a:1,b:-4,c:0,domain:[0,4]},vertex:[2,-4],minimum:-4,result:-2,exact:'a=−3,b=1'}],
 ['1final','23_강남여고_1학기_기말_고1_기출.js',11,'number-line',{solutionInterval:[-2,1],leftClosed:false,rightClosed:false,leftLabel:'−2',rightLabel:'1',result:'−2<m<1',exact:'m+2>0, D<0'}],
 ['1final','23_강남여고_1학기_기말_고1_기출.js',18,'number-line',{solutionInterval:[-3,-2],leftClosed:false,rightClosed:true,leftLabel:'−3',rightLabel:'−2',result:4,exact:'−3<a≤−2, 정수해 4개'}],
 ['1final','23_금당고_1학기_기말_고1_기출.js',14,'cartesian',{function:{a:1,b:0,c:0,domain:[-1,1]},vertex:[0,0],result:5,exact:'a=−1/2,b=4,b−2a=5'}],
 ['1final','23_금당고_1학기_기말_고1_기출.js',19,'number-line',{solutionInterval:[4,null],leftClosed:false,rightClosed:false,leftLabel:'4',rightLabel:'∞',result:'k>4',exact:'f(k)=4 ⇔ k>4'}],
 ['1final','23_복성고_1학기_기말_고1_기출.js',9,'number-line',{solutionInterval:[1,5],leftClosed:true,rightClosed:false,leftLabel:'1',rightLabel:'5',result:'1≤m<5',exact:'(m−1)(x−1)²+5−m>0'}],
 ['1final','24_매산고_1학기_기말_고1_기출.js',16,'number-line',{solutionInterval:[2,2],leftClosed:true,rightClosed:true,result:2,exact:'k=2'}],
 ['2mid','24_제일고_2학기_중간_고1_기출.js',16,'number-line',{integerSolutions:[-1,1,3,5],count:4,result:-15,exact:'(f∘f)(x)=1 ⇔ x=−1,1,3,5'}],
 ['2mid','24_금당고_2학기_중간_고1_기출.js',13,'number-line',{solutionInterval:[1,5],leftClosed:true,rightClosed:true,result:5,exact:'1≤k≤5'}],
 ['2mid','24_제일고_2학기_중간_고1_기출.js',6,'number-line',{solutionInterval:[-2,2],leftClosed:true,rightClosed:true,integerSolutions:[-2,-1,0,1,2],count:5,result:5,exact:'−2≤x≤2'}],
 ['2mid','24_제일고_2학기_중간_고1_기출.js',8,'number-line',{solutionInterval:[3,5],leftClosed:true,rightClosed:true,integerSolutions:[3,4,5],count:3,result:3,exact:'k=3,4,5'}],
 ['1final','24_매산고_1학기_기말_고1_기출.js',10,'number-line',{solutionInterval:[3,null],leftClosed:true,rightClosed:false,leftLabel:'3',rightLabel:'∞',result:3,exact:'a≥3, 양의 최솟값 3'}],
 ['1mid','25_매산고_1학기_중간_고1_기출.js',15,'number-line',{solutionInterval:[3/4,1],leftClosed:false,rightClosed:false,leftLabel:'3/4',rightLabel:'1',result:'7/4',exact:'3/4<k<1'}],
];
function load(relative){const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(ROOT,relative),'utf8'),c,{filename:relative,timeout:10000});return JSON.parse(JSON.stringify(c.window));}
const rows=[];for(const [dir,basename,id,expectedVisualType,expectedFacts] of TARGETS){const sourceJsPath=`archive/exams/original/high/h1/${dir}/${basename}`;const source=load(sourceJsPath);const question=source.questionBank.find(item=>Number(item.id)===id);if(!question)throw new Error(`missing ${sourceJsPath} q${id}`);rows.push({questionUid:`${sourceJsPath}|${source.examTitle}|${id}`,sourceJsPath,id,content:question.content,choices:question.choices??[],expectedVisualType,expectedFacts});}
const output={schemaVersion:'HS_QUADRATIC_SPECIALIST_V1_EXPECTED_FACTS_R21',status:'EXPECTED_FACTS_FROZEN_SOURCE_ONLY_CANDIDATE_NO_PASS',inputVisibilityProfile:'SOURCE_ONLY',priorReviewVisibility:'NONE',rows,note:'Fresh source-only facts for 18 specialist rows; existing solution/SVG/V2/V3 evidence were not used for derivation.'};fs.writeFileSync(OUTPUT,`${JSON.stringify(output,null,2)}\n`,'utf8');console.log(JSON.stringify({status:output.status,rows:rows.length,numberLineRows:rows.filter(r=>r.expectedVisualType==='number-line').length,cartesianRows:rows.filter(r=>r.expectedVisualType==='cartesian').length},null,2));
