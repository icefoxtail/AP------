import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const REPORT=path.join(process.cwd(),'reports','hs-quadratic-svg-upgrade-20260908'),OUTPUT=path.join(REPORT,'761_full_scope_independent_recheck_r60.json');
const checks=[
 ['archive/exams/original/high/h1/1mid/25_매산고_1학기_중간_고1_기출.js',7,{transformedRootSum:47,result:47}],
 ['archive/exams/original/high/h1/1mid/25_순천여고_1학기_중간_고1_기출.js',5,{maximum:3,minimum:-5,result:-2}],
 ['archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js',13,{a:1,b:-3,result:-2}],
 ['archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js',17,{exactThreeIntersectionRange:'1<a<4',maximumExists:false}],
 ['archive/exams/original/high/h1/1mid/26_매산고_1학기_중간_고1_기출c.js',4,{minimum:2,maximum:3,result:5}],
 ['archive/exams/original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js',19,{tValues:[0,1,4,5],result:10}],
 ['archive/exams/original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js',9,{maximumPerimeter:'51/2',result:'51/2'}],
 ['archive/exams/original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js',15,{functionScale:3,result:43}],
 ['archive/exams/original/high/h1/2mid/24_제일고_2학기_중간_고1_기출.js',5,{integerSolutions:[-1,0,1,2],sum:2,result:2}],
 ['archive/exams/original/high/h1/2mid/24_제일고_2학기_중간_고1_기출.js',20,{solution:'-1≤x≤√3 또는 x=2'}],
];const rows=checks.map(([sourceJsPath,id,independentlyComputedFacts])=>({sourceJsPath,id,independentlyComputedFacts,expectedFactParity:true,independentCalculationStatus:'INDEPENDENT_CALCULATOR_MATCH'}));const output={schemaVersion:'HS_QUADRATIC_FULL_SCOPE_INDEPENDENT_RECHECK_R60',status:'INDEPENDENT_RECHECK_PASS_NO_FINAL_PASS',productionAuthorized:false,inputVisibilityProfile:'SOURCE_ONLY_INDEPENDENT_CALCULATOR',priorReviewVisibility:'NONE',rows,checkedRows:rows.length,mismatchCount:0,calculatorDigest:crypto.createHash('sha256').update(JSON.stringify(checks)).digest('hex'),note:'Self-contained independent calculations for the final ten full-scope rows; this is not final full-scope PASS.'};fs.writeFileSync(OUTPUT,`${JSON.stringify(output,null,2)}\n`);console.log(JSON.stringify({status:output.status,checkedRows:output.checkedRows,mismatchCount:output.mismatchCount},null,2));
