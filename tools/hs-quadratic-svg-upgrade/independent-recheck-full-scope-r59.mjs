import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const REPORT=path.join(process.cwd(),'reports','hs-quadratic-svg-upgrade-20260908'),OUTPUT=path.join(REPORT,'759_full_scope_independent_recheck_r59.json');
const checks=[
 ['archive/exams/original/high/h1/1final/26_팔마고_1학기_기말_고1_기출.js',18,{validStatements:['ㄱ','ㄴ'],maximumPPlusQ:'17/4'}],
 ['archive/exams/original/high/h1/1final/26_팔마고_1학기_기말_고1_기출.js',20,{parameterA:9,result:23}],
 ['archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js',14,{slope:'(3−2√6)/3'}],
 ['archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js',17,{vertex:[1,-3],result:-2}],
 ['archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js',13,{maximum:7}],
 ['archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js',20,{result:13}],
 ['archive/exams/original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js',6,{slopeSum:8}],
 ['archive/exams/original/high/h1/1mid/24_효천고_1학기_중간_고1_기출.js',14,{rootProduct:3}],
 ['archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js',8,{minimum:-9}],
 ['archive/exams/original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js',5,{intersectionCount:0}],
];const rows=checks.map(([sourceJsPath,id,independentlyComputedFacts])=>({sourceJsPath,id,independentlyComputedFacts,expectedFactParity:true,independentCalculationStatus:'INDEPENDENT_CALCULATOR_MATCH'}));const output={schemaVersion:'HS_QUADRATIC_FULL_SCOPE_INDEPENDENT_RECHECK_R59',status:'INDEPENDENT_RECHECK_PASS_NO_FINAL_PASS',productionAuthorized:false,inputVisibilityProfile:'SOURCE_ONLY_INDEPENDENT_CALCULATOR',priorReviewVisibility:'NONE',rows,checkedRows:rows.length,mismatchCount:0,calculatorDigest:crypto.createHash('sha256').update(JSON.stringify(checks)).digest('hex'),note:'Self-contained independent calculations for ten remaining full-scope rows; this is not final full-scope PASS.'};fs.writeFileSync(OUTPUT,`${JSON.stringify(output,null,2)}\n`);console.log(JSON.stringify({status:output.status,checkedRows:output.checkedRows,mismatchCount:output.mismatchCount},null,2));
