'use strict';
// Strict successor to the historical scoped diagnostic. No clipping exception,
// blocked row, or tolerated browser failure can pass this production gate.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
function assert(value, code) { if (!value) throw new Error(code); }
const median = xs => { const s=xs.slice().sort((a,b)=>a-b), i=Math.floor(s.length/2); return s.length%2?s[i]:(s[i-1]+s[i])/2; };
function qualify(reports, refs, currentSha) {
  assert(/^[a-f0-9]{40}$/.test(currentSha), 'CURRENT_SHA_REQUIRED');
  const roles=['performance','pdf','cache','network:envelope50-qpp1','network:envelope8','original'];
  assert(Object.keys(reports).length===roles.length && roles.every(role=>reports[role]), 'EXACT_REPORT_SET_REQUIRED');
  const versions=roles.map(role=>reports[role].chromeVersion);
  assert(versions.every(version=>/^\d+\.\d+\.\d+\.\d+$/.test(version) && version===versions[0]), 'CHROME_VERSION_MISMATCH');
  for(const role of roles) {
    const r=reports[role];
    assert(r.currentSha===currentSha && r.pass===true, 'RAW_REPORT_NOT_PASS:'+role);
    if(role==='cache') {
      assert(r.cases.length===11 && r.cases.every(c=>c.pass===true), 'CACHE_CASES_INCOMPLETE');
      assert(r.repairedIssue?.status==='FIXED' && r.repairedIssue?.qualityPass===true, 'REAL50_REPAIR_NOT_VERIFIED');
      continue;
    }
    assert(r.baselineSha===(role==='original'?refs.originalReference:refs.performanceReference), 'BASELINE_SHA_MISMATCH:'+role);
    if(role==='original') {
      assert(r.rows.length===16 && r.comparisons.length===6 && [...r.rows,...r.comparisons].every(x=>x.pass===true), 'ORIGINAL_REGRESSIONS_INCOMPLETE');
      continue;
    }
    assert(r.failures.length===0 && r.outputParity==='PASS' && r.coverage?.complete===true, 'BROWSER_FAILURE_OR_COVERAGE_GAP:'+role);
    const rows=role==='pdf'?r.pdfRows:r.rows;
    const pairs=role==='pdf'?r.pdfComparisons:role.startsWith('network:')?r.networkComparisons:r.comparisons;
    const n=role==='performance'?290:role==='pdf'?48:10;
    assert(rows.length===n && pairs.length===n/2 && pairs.every(x=>x.pass===true), 'EXACT_MATRIX_DENOMINATOR_REQUIRED:'+role);
    assert(r.coverage.plannedRows===n && r.coverage.observedRows===n && r.coverage.plannedPairs===n/2 && r.coverage.observedPairs===n/2, 'COVERAGE_DENOMINATOR_MISMATCH:'+role);
    for(const row of rows) {
      assert(row.pass===true && row.outcome?.ok===true && row.clippingCount===0 && row.pageOverflowCount===0 && row.mathErrors===0 && row.unrenderedMath===0, 'OUTPUT_NOT_CLEAN:'+role);
      assert(row.images.every(image=>image.loaded) && row.questionCount>0 && row.sourceOrder.length===row.questionCount && JSON.stringify(row.sourceOrder)===JSON.stringify(row.expectedOrder), 'SOURCE_OR_IMAGE_NOT_READY:'+role);
      assert(row.printPreflight?.ok===true, 'PRINT_NOT_READY:'+role);
      if(role==='pdf') assert(row.pdf?.generated===true && row.pdf.raster?.pages.length===row.pdf.pageCount, 'PDF_NOT_RENDERED');
    }
  }
  const p=reports.performance, proof={};
  for(const operation of ['cold-sol','exam-sol-warm']) {
    const select=label=>p.rows.filter(row=>row.fixture==='envelope50' && row.operation===operation && row.label===label);
    const before=select('baseline'), after=select('current');
    assert(before.length===3 && after.length===3, 'REAL50_THREE_REPETITIONS_REQUIRED');
    const baselineMs=median(before.map(r=>r.publicMs)), currentMs=median(after.map(r=>r.publicMs));
    assert(baselineMs>0 && currentMs<baselineMs*0.95, 'MEASURED_IMPROVEMENT_REQUIRED:'+operation);
    if(operation==='exam-sol-warm') assert(after.every(r=>r.cacheStatus==='HIT' && r.operationMath.calls===0), 'WARM_SNAPSHOT_NOT_REUSED');
    proof[operation]={baselineMs,currentMs,improvementPercent:(baselineMs-currentMs)/baselineMs*100};
  }
  return {schema:'ARCHIVE_OUTPUT_STRICT_RELEASE_V1',currentSha,comparisonReferences:refs,PERFORMANCE_IMPROVED:true,OUTPUT_PARITY:true,PRODUCTION_STABLE:true,pass:true,
    qualificationScope:'Identical actual inputs against immutable correctness-only reference commits. Historical uncorrected failures remain separate evidence.',
    performance:proof,matrices:{performancePairs:145,pdfPairs:24,networkPairs:10,cacheCases:11,originalRows:16,originalComparisons:6}};
}
function load(directory) {
  const reports={}, references=[];
  const walk=dir=>{for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else if(['output-performance.json','output-cache.json','solution-loading.json'].includes(e.name)){
    const bytes=fs.readFileSync(f),r=JSON.parse(bytes);const role=r.schema==='ARCHIVE_OUTPUT_CACHE_CHROME_V1'?'cache':r.schema==='ARCHIVE_SOLUTION_LOADING_CHROME_V1'?'original':r.phase==='network-completion'?'network:'+r.networkFixtureId:r.phase;
    assert(!reports[role], 'DUPLICATE_REPORT');reports[role]=r;references.push({role,file:path.relative(directory,f),sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
  }}};walk(directory);return {reports,references};
}
if(require.main===module){
  const directory=process.env.ARCHIVE_QUALIFICATION_ARTIFACTS;let result;
  try{const {reports,references}=load(directory);const refs=JSON.parse(fs.readFileSync(path.join(__dirname,'archive2-output-comparison-references.json'),'utf8'));
    result={...qualify(reports,refs,process.env.ARCHIVE_QUALIFICATION_CURRENT_SHA),artifacts:references};
  }catch(error){result={schema:'ARCHIVE_OUTPUT_STRICT_RELEASE_V1',pass:false,PERFORMANCE_IMPROVED:false,OUTPUT_PARITY:false,PRODUCTION_STABLE:false,error:String(error.message)};process.exitCode=1;}
  if(directory){fs.mkdirSync(directory,{recursive:true});fs.writeFileSync(path.join(directory,'output-release-qualification.json'),JSON.stringify(result,null,2)+'\n');}
  console.log(JSON.stringify(result));
}
module.exports={qualify};
