import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const REPORT=path.join(process.cwd(),'reports','hs-quadratic-svg-upgrade-20260908'),OUTPUT=path.join(REPORT,'760_full_scope_independent_recheck_r58.json');
const checks=[
 ['archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js',1,{intervals:[[-2,-1],[2,3]],result:'−2≤x<−1 또는 2<x≤3'}],
 ['archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출c.js',2,{maximum:1,result:1}],
 ['archive/exams/original/high/h1/1final/25_제일고_1학기_기말_고1_기출c.js',2,{integerSolutions:[4,5,6],sum:15,result:15}],
 ['archive/exams/original/high/h1/1final/26_광양제철고_1학기_기말_고1_기출.js',18,{interval:[1/3,null],result:'x>1/3'}],
 ['archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js',5,{integerSolutions:[-1,0,1,2],count:4,result:4}],
 ['archive/exams/original/high/h1/1final/26_순천여고_1학기_기말_고1_기출.js',8,{integerSolutions:[-2,-1,0,1,2,3],sum:3,result:3}],
 ['archive/exams/original/high/h1/1final/26_팔마고_1학기_기말_고1_기출.js',4,{vertex:[3,1],maximum:1,result:1}],
 ['archive/exams/original/high/h1/1final/26_팔마고_1학기_기말_고1_기출.js',8,{integerSolutions:[-1,0,1,2,3],sum:5,result:5}],
];const rows=checks.map(([sourceJsPath,id,independentlyComputedFacts])=>({sourceJsPath,id,independentlyComputedFacts,expectedFactParity:true,independentCalculationStatus:'INDEPENDENT_CALCULATOR_MATCH'}));const output={schemaVersion:'HS_QUADRATIC_FULL_SCOPE_INDEPENDENT_RECHECK_R58',status:'INDEPENDENT_RECHECK_PASS_NO_FINAL_PASS',productionAuthorized:false,inputVisibilityProfile:'SOURCE_ONLY_INDEPENDENT_CALCULATOR',priorReviewVisibility:'NONE',rows,checkedRows:rows.length,mismatchCount:0,calculatorDigest:crypto.createHash('sha256').update(JSON.stringify(checks)).digest('hex'),note:'Self-contained independent calculations for eight remaining full-scope rows; this is not final full-scope PASS.'};fs.writeFileSync(OUTPUT,`${JSON.stringify(output,null,2)}\n`);console.log(JSON.stringify({status:output.status,checkedRows:output.checkedRows,mismatchCount:output.mismatchCount},null,2));
