'use strict';
// Complete clean-output qualification. Historical failures remain immutable;
// the old exception classifier is never invoked here. Deployment is separate.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const isHash = value => /^[a-f0-9]{64}$/.test(value || '');
const finite = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
function assert(value, code) { if (!value) throw new Error(code); }
const median = xs => { const s=xs.slice().sort((a,b)=>a-b), i=Math.floor(s.length/2); return s.length%2?s[i]:(s[i-1]+s[i])/2; };
const key = (row,label=false) => [row.purpose,row.fixture,row.repeat,row.network,row.operation,...(label?[row.label]:[])].join('|');
function exactSet(actual,expected,code) {
  assert(Array.isArray(actual) && actual.length===expected.length && new Set(actual).size===actual.length && actual.every(x=>expected.includes(x)),code);
}
function validateCoverage(rows,pairs,plan,coverage) {
  const expectedRows=plan.measurements.flatMap(item=>item.labels.map(label=>key({...item,label},true)));
  exactSet(rows.map(row=>key(row,true)),expectedRows,'ROW_IDENTITY_COVERAGE_CHANGED');
  exactSet(pairs.map(row=>key(row)),plan.measurements.map(row=>key(row)),'PAIR_IDENTITY_COVERAGE_CHANGED');
  assert(coverage?.complete===true && coverage.plannedRows===expectedRows.length && coverage.observedRows===expectedRows.length &&
    coverage.plannedPairs===plan.measurements.length && coverage.observedPairs===plan.measurements.length,'COVERAGE_DENOMINATOR_MISMATCH');
  for(const name of ['missingRows','missingPairs','duplicateRows','duplicatePairs']) assert(coverage[name]?.length===0,'COVERAGE_GAP:'+name);
}
function validateCleanRow(row,spec) {
  assert(row.pass===true && row.outcome?.ok===true && row.questionCount===spec.questions && row.qpp===spec.qpp,'OUTPUT_NOT_READY');
  assert(Array.isArray(row.expectedOrder) && row.expectedOrder.length===spec.questions && new Set(row.expectedOrder).size===spec.questions &&
    same(row.sourceOrder,row.expectedOrder) && row.inputUids?.length===spec.questions,'SOURCE_ORDER_INCOMPLETE');
  assert(row.mathErrors===0 && row.unrenderedMath===0 && Number.isInteger(row.mathCount) && row.mathCount>=0 && isHash(row.bodyHash) && finite(row.firstBoxMs),'MATH_OR_VISIBILITY_MISSING');
  assert(Number.isInteger(row.pageCount) && row.pageCount>0 && row.pages?.length===row.pageCount && row.blockCount>=spec.questions &&
    row.pages.reduce((sum,page)=>sum+page.blocks.length,0)===row.blockCount,'PAGE_OR_BLOCK_EVIDENCE_INCOMPLETE');
  assert(Array.isArray(row.images) && row.images.every(image=>image.loaded===true && isHash(image.sourceHash) && image.width>0 && image.height>0),'IMAGE_NOT_READY');
  for(const page of row.pages) {
    assert(page.width>0 && page.height>0 && isHash(page.textHash) && Array.isArray(page.images),'PAGE_EVIDENCE_INVALID');
    for(const block of page.blocks) assert(typeof block.sourceRef==='string' && (block.sourceRef || row.mode==='exam' && block.textHash===digest('')) &&
      isHash(block.textHash) && ['x','y','width','height'].every(axis=>finite(block[axis])),'BLOCK_EVIDENCE_INVALID');
  }
  assert(isHash(row.inputHash) && isHash(row.mathMarkupHash) && row.mathGeometry?.length===row.mathCount &&
    row.mathGeometry.every(item=>finite(item.width)&&finite(item.height)),'MATH_OR_INPUT_EVIDENCE_MISSING');
  assert(row.clippingCount===0 && row.pageOverflowCount===0,'OUTPUT_CLIPPING');
  assert(row.pageErrors?.length===0 && !row.error && row.printPreflight?.ok===true && row.printPreflight.outputParity?.bodyHash===row.bodyHash &&
    row.printPreflight.outputParity?.pages===row.pageCount && row.printPreflight.outputParity?.coordinateTolerancePx===1,'PRINT_OR_BROWSER_NOT_READY');
  assert(finite(row.publicMs) && finite(row.operationMath?.totalMs) && Number.isInteger(row.operationMath?.calls) && row.operationMath.calls>=0 &&
    finite(row.cdp?.LayoutDurationMs) && Number.isInteger(row.cdp?.LayoutCount) && row.cdp.LayoutCount>=0,'PERFORMANCE_ACCOUNTING_MISSING');
  if(spec.kind==='envelope') assert(row.envelope?.present===true && row.envelope.mode===row.mode && row.envelope.verifiedIdentityMatches===true &&
    row.envelope.renderedIdentityMatches===true && row.envelope.urlIdentityMatches===true && row.envelope.errorPresent===false,'ENVELOPE_NOT_READY');
  if(spec.id==='continuation-golden' && row.mode==='sol') assert(row.continuationCount>0,'CONTINUATION_NOT_EXERCISED');
}
function assertParity(before,after) {
  for(const field of ['questionCount','qpp','blockCount','pageCount','bodyHash','sourceOrder','inputUids','mathCount','images','inputHash','mathMarkupHash','clippingCount','pageOverflowCount','continuationCount'])
    assert(same(before[field],after[field]),'OUTPUT_PARITY_CHANGED:'+field);
  assert(before.pages.length===after.pages.length,'PAGE_COUNT_CHANGED');
  before.pages.forEach((page,p)=>{
    const other=after.pages[p];
    for(const field of ['width','height','textHash','images']) assert(same(page[field],other[field]),'PAGE_PARITY_CHANGED:'+field);
    assert(page.blocks.length===other.blocks.length,'PAGE_BLOCK_COUNT_CHANGED');
    page.blocks.forEach((block,b)=>{
      assert(block.sourceRef===other.blocks[b].sourceRef && block.textHash===other.blocks[b].textHash,'BLOCK_CONTENT_CHANGED');
      for(const axis of ['x','y','width','height']) assert(Math.abs(block[axis]-other.blocks[b][axis])<=1,'BLOCK_GEOMETRY_CHANGED');
    });
  });
  assert(before.mathGeometry.length===after.mathGeometry.length,'MATH_GEOMETRY_COUNT_CHANGED');
  before.mathGeometry.forEach((item,i)=>{for(const axis of ['width','height']) assert(Math.abs(item[axis]-after.mathGeometry[i][axis])<=1,'MATH_GEOMETRY_CHANGED');});
}
function assertPdf(before,after) {
  for(const row of [before,after]) {
    const p=row.pdf;
    assert(p?.generated===true && p.pageCount===row.pageCount && p.mediaBoxes?.length===row.pageCount && p.raster?.pages?.length===row.pageCount &&
      p.raster.renderer==='Poppler pdftoppm' && p.raster.dpi===96 && isHash(p.raster.textSha256) && Number.isInteger(p.raster.textBytes) && p.raster.textBytes>0 &&
      p.screenParity?.bodyHash===row.bodyHash && p.screenParity.pages===row.pageCount && p.screenParity.coordinateTolerancePx===1,'PDF_EVIDENCE_INCOMPLETE');
    p.raster.pages.forEach((page,i)=>assert(page.page===i+1 && page.width>0 && page.height>0 && isHash(page.rgbSha256),'PDF_RASTER_PAGE_MISSING'));
    const s=p.afterPrintState;
    assert(s?.snapshotId && s.mode===row.mode && s.snapshotMode===row.mode && s.committedMode===row.mode && s.runtimeBusy===false && s.fontsStatus==='loaded' &&
      s.renderOutcomeOk===true && s.activeRootMatches===true && Number.isInteger(s.attemptCount) && s.attemptCount>0,'POST_PRINT_STATE_NOT_READY');
    if(row.envelope?.present) assert(s.envelope?.present===true && s.envelope.mode===row.mode && s.envelope.renderedIdentityMatches===true &&
      s.envelope.verifiedIdentityMatches===true && s.envelope.urlIdentityMatches===true && s.envelope.errorPresent===false,'POST_PRINT_ENVELOPE_NOT_READY');
  }
  assert(same(before.pdf.mediaBoxes,after.pdf.mediaBoxes) && same(before.pdf.raster.pages,after.pdf.raster.pages) &&
    before.pdf.raster.textSha256===after.pdf.raster.textSha256 && before.pdf.raster.textBytes===after.pdf.raster.textBytes,'PDF_PIXEL_OR_TEXT_CHANGED');
}
function qualify(reports,refs,currentSha) {
  assert(/^[a-f0-9]{40}$/.test(currentSha),'CURRENT_SHA_REQUIRED');
  const {expectedPlan,fixtureSpecs,cacheCases,KNOWN}=require('./archive2-output-release-qualification.cjs');
  assert(refs?.schema==='ARCHIVE_OUTPUT_CORRECTNESS_REFERENCES_V1' && refs.sourceDataChanged===false &&
    ['performanceBase','performanceReference','originalBase','originalReference'].every(k=>/^[a-f0-9]{40}$/.test(refs[k]||'')),'COMPARISON_REFERENCES_REQUIRED');
  const roles=['performance','pdf','cache','network:envelope50-qpp1','network:envelope8','original'];
  exactSet(Object.keys(reports),roles,'EXACT_REPORT_SET_REQUIRED');
  const versions=roles.map(role=>reports[role].chromeVersion);
  assert(versions.every(v=>/^\d+\.\d+\.\d+\.\d+$/.test(v||'')&&v===versions[0]),'CHROME_VERSION_MISMATCH');
  for(const role of roles) {
    const r=reports[role];
    assert(r.currentSha===currentSha && r.pass===true && !r.fatal,'RAW_REPORT_NOT_PASS:'+role);
    if(role==='cache') {
      exactSet(r.cases.map(c=>c.name),[...cacheCases,'real50-qpp4-reminder-image-fit'],'CACHE_CASES_INCOMPLETE');
      assert(r.cases.every(c=>c.pass===true && !c.error),'CACHE_CASE_FAILED');
      const issue=r.repairedIssue, fit=issue?.fit;
      assert(issue?.id===KNOWN.id && issue.status==='FIXED' && issue.qualityPass===true && issue.questionCount===50 && issue.qpp===4 &&
        issue.sourceBytesUnchanged===true && issue.inputHash===KNOWN.projectedInputHash && issue.warmCacheStatus==='HIT','REAL50_REPAIR_NOT_VERIFIED');
      assert(fit?.found===true && fit.loaded===true && fit.stylePresent===true && fit.inside===true && fit.naturalWidth===420 && fit.naturalHeight===300 &&
        fit.width>0 && fit.height>0 && fit.width<=fit.columnWidth+1 && Math.abs(fit.width/fit.height-1.4)<.01,'REAL50_IMAGE_NOT_FITTED');
      const fault=r.cases.find(c=>c.name==='known-real50-qpp4-clipping-preservation');
      assert(fault.knownIssue?.status==='INJECTED_BASELINE_FAULT' && fault.knownIssue.guardPass===true && fault.failedOperationQualityPass===false &&
        fault.subsequentAnswerReady===true && fault.subsequentExamReady===true && fault.noLateOverwrite===true,'INJECTED_FAULT_GUARD_MISSING');
      assert(r.rows.length>0 && r.rows.every(row=>typeof row.pass==='boolean'),'CACHE_OBSERVATIONS_MISSING');
      continue;
    }
    assert(r.baselineSha===(role==='original'?refs.originalReference:refs.performanceReference),'BASELINE_SHA_MISMATCH:'+role);
    if(role==='original') {
      assert(r.rows.length===16 && r.comparisons.length===6 && [...r.rows,...r.comparisons].every(x=>x.pass===true),'ORIGINAL_REGRESSIONS_INCOMPLETE');
      assert(new Set(r.rows.map(x=>x.name)).size===16 && new Set(r.comparisons.map(x=>x.name)).size===6,'ORIGINAL_DUPLICATE_CASE');
      continue;
    }
    assert(r.failures?.length===0 && r.outputParity==='PASS','BROWSER_FAILURE:'+role);
    const plan=expectedPlan(role), rows=role==='pdf'?r.pdfRows:r.rows;
    const pairs=role==='pdf'?r.pdfComparisons:role.startsWith('network:')?r.networkComparisons:r.comparisons;
    validateCoverage(rows,pairs,plan,r.coverage);
    const ids=[...new Set(plan.measurements.map(x=>x.fixture))];
    exactSet(r.fixtures.map(x=>x.id),ids,'FIXTURE_COVERAGE_CHANGED');
    for(const id of ids) {
      const spec=fixtureSpecs.find(x=>x.id===id), actual=r.fixtures.find(x=>x.id===id);
      for(const field of ['kind','qpp','questions','inputSha256','sources']) assert(same(actual[field],spec[field]),'PINNED_FIXTURE_CHANGED:'+id+':'+field);
    }
    for(const item of plan.measurements) {
      const spec=fixtureSpecs.find(x=>x.id===item.fixture);
      const before=rows.find(x=>key(x,true)===key({...item,label:'baseline'},true));
      const after=rows.find(x=>key(x,true)===key({...item,label:'current'},true));
      for(const row of [before,after]) {
        assert(row.mode===item.mode,'MODE_MISMATCH'); validateCleanRow(row,spec);
        if(spec.inputSha256===KNOWN.inputSha256) assert(row.inputHash===KNOWN.projectedInputHash && digest(JSON.stringify(row.expectedOrder))===KNOWN.sourceOrderSha256 &&
          digest(JSON.stringify(row.inputUids))===KNOWN.inputUidsSha256,'REAL50_SOURCE_IDENTITY_CHANGED');
        if(role.startsWith('network:')) {
          const transfer=row.metadataTransfer;
          assert(Array.isArray(transfer?.requests),'NETWORK_TRANSFER_MISSING');
          assert(row.label==='baseline' ? transfer.state==='COMPLETE' && transfer.requests.length>0 && transfer.requests.every(x=>x.finished===true&&x.failed!==true&&x.httpStatus===200&&x.decodedDataBytes>0) :
            transfer.state==='NOT_REQUESTED' && transfer.requests.length===0 && transfer.loaderMode==='frozen-source' && transfer.notRequestedUnderFrozenSourcePolicy===true && transfer.renderCompletedWithoutMetadataRequest===true,'NETWORK_TRANSFER_NOT_COMPLETE');
        }
      }
      assertParity(before,after);
      const comparison=pairs.find(x=>key(x)===key(item));
      assert(comparison.pass===true && comparison.questions===spec.questions && comparison.pages===after.pageCount && comparison.bodyHash===after.bodyHash &&
        comparison.sourceOrderHash===digest(after.sourceOrder.join('\n')) && comparison.coordinateTolerancePx===1,'PARITY_ATTESTATION_INCOMPLETE');
      if(role==='pdf') assertPdf(before,after);
    }
  }
  const proof={};
  for(const operation of ['cold-sol','exam-sol-warm']) {
    const select=label=>reports.performance.rows.filter(row=>row.fixture==='envelope50'&&row.operation===operation&&row.label===label);
    const before=select('baseline'), after=select('current');
    assert(before.length===3&&after.length===3,'REAL50_THREE_REPETITIONS_REQUIRED');
    const baselineMs=median(before.map(r=>r.publicMs)), currentMs=median(after.map(r=>r.publicMs));
    assert(baselineMs>0&&currentMs<baselineMs*.95,'MEASURED_IMPROVEMENT_REQUIRED:'+operation);
    if(operation==='exam-sol-warm') assert(after.every(r=>r.cacheStatus==='HIT'&&r.operationMath.calls===0),'WARM_SNAPSHOT_NOT_REUSED');
    proof[operation]={baselineMs,currentMs,improvementPercent:(baselineMs-currentMs)/baselineMs*100};
  }
  return {schema:'ARCHIVE_OUTPUT_STRICT_RELEASE_V1',currentSha,comparisonReferences:refs,PERFORMANCE_IMPROVED:true,OUTPUT_PARITY:true,PRODUCTION_STABLE:'NOT_VERIFIED',
    deploymentStatus:'NOT_VERIFIED',universalProductPass:false,pass:true,qualificationScope:'Complete pinned Chrome matrix against correctness-only references; deployment and unmeasured inputs are not certified.',
    performance:proof,matrices:{performancePairs:145,pdfPairs:24,networkPairs:10,cacheCases:11,originalRows:16,originalComparisons:6}};
}
function load(directory) {
  const reports={},references=[];
  const walk=dir=>{for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else if(['output-performance.json','output-cache.json','solution-loading.json'].includes(e.name)){
    const bytes=fs.readFileSync(f),r=JSON.parse(bytes);const role=r.schema==='ARCHIVE_OUTPUT_CACHE_CHROME_V1'?'cache':r.schema==='ARCHIVE_SOLUTION_LOADING_CHROME_V1'?'original':r.schema==='ARCHIVE_OUTPUT_PERFORMANCE_CHROME_V1'?(r.phase==='network-completion'?'network:'+r.networkFixtureId:r.phase):null;
    assert(role&&!reports[role],'UNKNOWN_OR_DUPLICATE_REPORT');reports[role]=r;references.push({role,file:path.relative(directory,f),sha256:digest(bytes)});
  }}};walk(directory);return {reports,references};
}
if(require.main===module){
  const directory=process.env.ARCHIVE_QUALIFICATION_ARTIFACTS;let result;
  try{const {reports,references}=load(directory);const refs=JSON.parse(fs.readFileSync(path.join(__dirname,'archive2-output-comparison-references.json'),'utf8'));
    result={...qualify(reports,refs,process.env.ARCHIVE_QUALIFICATION_CURRENT_SHA),artifacts:references};
  }catch(error){result={schema:'ARCHIVE_OUTPUT_STRICT_RELEASE_V1',pass:false,PERFORMANCE_IMPROVED:false,OUTPUT_PARITY:false,PRODUCTION_STABLE:'NOT_VERIFIED',error:String(error.message)};process.exitCode=1;}
  if(directory){fs.mkdirSync(directory,{recursive:true});fs.writeFileSync(path.join(directory,'output-release-qualification.json'),JSON.stringify(result,null,2)+'\n');}
  console.log(JSON.stringify(result));
}
module.exports={qualify,load,validateCoverage,validateCleanRow,assertParity,assertPdf};
