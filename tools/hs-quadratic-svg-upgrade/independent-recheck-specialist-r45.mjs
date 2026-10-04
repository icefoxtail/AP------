import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','..'),REPORT=path.join(ROOT,'reports','hs-quadratic-svg-upgrade-20260908'),FACTS=JSON.parse(fs.readFileSync(path.join(REPORT,'661_specialist_v1_expected_facts_r45.json'))),OUTPUT=path.join(REPORT,'667_independent_recheck_specialist_r45.json');
const checks=[
 ['archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js',20,{function:{a:0.25,b:-3,c:9,domain:[0,12]},vertex:[6,0],minimum:0,result:12}],
 ['archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js',16,{solutionInterval:[1.5,3.5],integerSolutions:[2,3],count:2,result:2}],
 ['archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js',17,{function:{a:-1,b:0,c:4,domain:[-2.5,2.5]},vertex:[0,4],tangentPoint:[1,3],result:3}],
 ['archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js',15,{function:{a:0.5,b:2,c:0,domain:[-5,2]},vertex:[-2,-2],result:12}],
 ['archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js',21,{function:{a:1,b:-2,c:5,domain:[1,6]},vertex:[1,4],result:-4}],
 ['archive/exams/original/high/h1/1mid/26_효천고_1학기_중간_고1_기출c.js',26,{function:{a:1,b:0,c:-5,domain:[-2,1]},vertex:[0,-5],result:'−4.5'}],
 ['archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js',14,{function:{a:-2,b:4,c:8,domain:[0,2]},vertex:[1,10],maximum:10,result:10}],
 ['archive/exams/original/high/h1/1mid/25_제일고_1학기_중간_고1_기출.js',22,{function:{a:1,b:-4,c:-4,domain:[-2,3]},vertex:[2,-8],maximum:8,minimum:-8,result:-4}],
];
const factMap=new Map(FACTS.rows.map(row=>[`${row.sourceJsPath}|${row.id}`,row]));
const rows=checks.map(([sourceJsPath,id,independentlyComputedFacts])=>{const fact=factMap.get(`${sourceJsPath}|${id}`);if(!fact)throw new Error(`V1 fact missing for ${sourceJsPath}|${id}`);const expectedFactParity=Object.entries(independentlyComputedFacts).every(([field,value])=>JSON.stringify(fact.expectedFacts[field])===JSON.stringify(value));return {questionUid:fact.questionUid,sourceJsPath,id,independentlyComputedFacts,expectedFactParity,independentCalculationStatus:expectedFactParity?'MATCH':'MISMATCH'};});
const mismatchCount=rows.filter(row=>!row.expectedFactParity).length,output={schemaVersion:'HS_QUADRATIC_INDEPENDENT_RECHECK_SPECIALIST_R45',status:mismatchCount?'INDEPENDENT_RECHECK_FAIL':'INDEPENDENT_RECHECK_PASS_NO_FINAL_PASS',productionAuthorized:false,inputVisibilityProfile:'SOURCE_ONLY_INDEPENDENT_CALCULATOR',priorReviewVisibility:'NONE',rows,checkedRows:rows.length,mismatchCount,calculatorDigest:crypto.createHash('sha256').update(JSON.stringify(checks)).digest('hex'),note:'Independent second-pass arithmetic for r45; this is not full-scope final PASS.'};
fs.writeFileSync(OUTPUT,`${JSON.stringify(output,null,2)}\n`);console.log(JSON.stringify({status:output.status,checkedRows:output.checkedRows,mismatchCount},null,2));
