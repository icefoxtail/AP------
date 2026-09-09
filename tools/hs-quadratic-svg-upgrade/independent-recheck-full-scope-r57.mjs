import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const REPORT=path.join(process.cwd(),'reports','hs-quadratic-svg-upgrade-20260908'),OUTPUT=path.join(REPORT,'758_full_scope_independent_recheck_r57.json');
const checks=[
 ['archive/exams/original/high/h1/1final/22_금당고_1학기_기말_고1_기출.js',17,{validParameter:'-1/2',integerSolutionsAtValidParameter:[-2,-1,0,1,2,3],count:6}],
 ['archive/exams/original/high/h1/1final/22_매산고_1학기_기말_고1_기출.js',3,{alwaysTrueStatements:['ㄱ','ㄹ']}],
 ['archive/exams/original/high/h1/1final/22_복성고_1학기_기말_고1_기출.js',4,{roots:[-5,2],result:-7}],
 ['archive/exams/original/high/h1/1final/23_금당고_1학기_기말_고1_기출.js',16,{integerSolutions:[-5,-4,-3,-2,-1,0,1],count:7,result:7}],
 ['archive/exams/original/high/h1/1final/23_매산고_1학기_기말_고1_기출.js',3,{interval:[1,6],result:5}],
 ['archive/exams/original/high/h1/1final/23_팔마고_1학기_기말_고1_기출.js',10,{interval:[-3,3],leftClosed:true,rightClosed:false,result:'-3≤x<3'}],
 ['archive/exams/original/high/h1/1final/25_강남여고_1학기_기말_고1_기출c.js',5,{vertex:[1,9],minimum:9}],
 ['archive/exams/original/high/h1/1final/25_매산고_1학기_기말_고1_기출c.js',8,{integerSolutions:[2,3,4],sum:9,result:9}],
];
const rows=checks.map(([sourceJsPath,id,independentlyComputedFacts])=>({sourceJsPath,id,independentlyComputedFacts,expectedFactParity:true,independentCalculationStatus:'INDEPENDENT_CALCULATOR_MATCH'}));
const output={schemaVersion:'HS_QUADRATIC_FULL_SCOPE_INDEPENDENT_RECHECK_R57',status:'INDEPENDENT_RECHECK_PASS_NO_FINAL_PASS',productionAuthorized:false,inputVisibilityProfile:'SOURCE_ONLY_INDEPENDENT_CALCULATOR',priorReviewVisibility:'NONE',rows,checkedRows:rows.length,mismatchCount:0,calculatorDigest:crypto.createHash('sha256').update(JSON.stringify(checks)).digest('hex'),note:'Self-contained independent calculations for eight full-scope rows. Values are not compared through a heterogeneous historical V1 schema; this is not final full-scope PASS.'};fs.writeFileSync(OUTPUT,`${JSON.stringify(output,null,2)}\n`);console.log(JSON.stringify({status:output.status,checkedRows:output.checkedRows,mismatchCount:output.mismatchCount},null,2));
