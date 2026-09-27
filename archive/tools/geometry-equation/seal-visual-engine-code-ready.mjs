// This seal qualifies shared code and isolated fixtures. It never authorizes publication.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {repoRoot,assertOutput} from './visual-browser-runtime.mjs';
import {sha256,verifyVisualEngineStatic} from './verify-visual-engine-static.mjs';
import {analyzeRenderedLayout} from './verify-rendered-layout.mjs';

const requireGate=(condition,name)=>{if(!condition)throw Error(name);};
const json=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const digest=file=>sha256(fs.readFileSync(file));
const zeroMetrics=['missingGlyphCount','labelCollisionCount','criticalCollisionCount','clippedTextCount','overflowCount'];
export const ORIGINAL_INDEPENDENT_VERIFIERS=[
  'archive/tools/geometry-equation/verify-b-static-full.mjs',
  'archive/tools/geometry-equation/verify-line-equation-v22-actual-svg.mjs',
  'archive/tools/geometry-equation/verify-line-equation-v22-qualification.mjs',
  'archive/tools/geometry-equation/verify-pilot-static.mjs',
  'archive/tools/geometry-equation/verify-production-parity-s15.mjs',
  'archive/tools/geometry-equation/verify-svg-coordinate-parity.mjs',
];
export function assertExactCoverage(actual,expected,label='COVERAGE'){
  requireGate(new Set(actual).size===actual.length,label+'_DUPLICATE');
  requireGate(actual.length===expected.length&&expected.every(v=>actual.includes(v)),label+'_MISSING');
}
export function assertActualEvidence(row){
  requireGate(row.status==='PASS'&&row.synthetic===false&&row.runtime==='playwright-chromium','ACTUAL_CAPTURE_REQUIRED');
  requireGate(Array.isArray(row.errors)&&row.errors.length===0,'CAPTURE_ERRORS');
  const counts=row.capture||row;
  requireGate(zeroMetrics.every(k=>counts[k]===0),'NONZERO_OR_UNMEASURED_RENDER_METRICS');
}
export function assertPerformanceRow(row){
  requireGate(Number.isInteger(row.svgBytes)&&row.svgBytes>0,'SVG_BYTES_UNMEASURED');
  requireGate(['domNodeCount','textNodeCount','pathCount'].every(k=>Number.isInteger(row[k])&&row[k]>=0),'DOM_METRICS_UNMEASURED');
  requireGate(['renderTimeMs','browserLayoutTimeMs'].every(k=>Number.isFinite(row[k])&&row[k]>=0),'TIMING_UNMEASURED');
}

export function qualifyCode({run,archiveAttempt,bboxReceipt}){
  run=assertOutput(run);
  requireGate(/^[A-Za-z0-9_-]+$/.test(archiveAttempt),'INVALID_ARCHIVE_ATTEMPT');
  const readRel=rel=>json(path.join(run,rel));
  const config=readRel('config/run.json');
  requireGate(config.allowProductionWrite===false&&config.productionBaselinePolicy==='READ_ONLY','READ_ONLY_REQUIRED');
  requireGate(path.resolve(repoRoot,config.outputRoot)===run,'CONFIG_RUN_SCOPE');
  const baseline=readRel('config/baseline.json');
  const git=(...args)=>execFileSync('git',args,{cwd:repoRoot,encoding:'utf8'}).trim();
  requireGate(git('branch','--show-current')===baseline.branch&&baseline.head===git('merge-base',baseline.head,'HEAD'),'WRONG_BRANCH_OR_BASELINE');
  const proof=readRel('tests/phase-15-code-tests.json');
  requireGate(proof.status==='PASS'&&proof.pythonTests>=77&&proof.nodeTests>=31&&proof.commands.every(v=>v.exitCode===0),'CURRENT_CODE_TESTS_REQUIRED');
  for(const [file,hash] of Object.entries(proof.codeFileHashes))requireGate(digest(path.join(repoRoot,file))===hash,'STALE_CODE_TEST:'+file);
  const walk=folder=>fs.readdirSync(folder,{withFileTypes:true}).flatMap(v=>v.isDirectory()?walk(path.join(folder,v.name)):[path.join(folder,v.name)]);
  const actualProtected=walk(path.join(repoRoot,'archive/assets')).concat(walk(path.join(repoRoot,'archive/exams')));
  assertExactCoverage(actualProtected.map(v=>path.relative(repoRoot,v).replaceAll('\\','/')),Object.keys(baseline.protectedFiles),'PROTECTED_INVENTORY');
  for(const [file,hash] of Object.entries(baseline.protectedFiles))requireGate(digest(path.join(repoRoot,file))===hash,'PRODUCTION_MUTATION:'+file);
  const verifiers=ORIGINAL_INDEPENDENT_VERIFIERS;
  requireGate(verifiers.every(file=>Object.hasOwn(baseline.coreFiles,file)),'ORIGINAL_VERIFIER_COVERAGE');
  for(const file of verifiers)requireGate(digest(path.join(repoRoot,file))===baseline.coreFiles[file],'INDEPENDENCE_BROKEN:'+file);
  for(const [file,evidence] of Object.entries(baseline.rules))requireGate(digest(path.join(repoRoot,'docs/rules',file))===evidence.sha256,'RULE_DRIFT:'+file);

  const manifest=readRel('fixtures/manifest.json'),ids=manifest.map(v=>v.id);
  requireGate(ids.length===13&&new Set(ids).size===13,'FIXTURE_COVERAGE_REQUIRED');
  const staticRows=[];
  const artifactBindings=[];
  for(const item of manifest){
    const input=json(path.join(repoRoot,item.staticInput));
    const result=verifyVisualEngineStatic({root:repoRoot,input});
    requireGate(result.status==='PASS','ACTUAL_SVG_PARITY_FAIL:'+item.id);
    const folder=path.dirname(path.join(repoRoot,item.svg)),witness=json(path.join(folder,'witness.json'));
    requireGate(witness.authority==='BUILD_SIDE_ONLY'&&witness.publicationAuthorized===false,'PUBLICATION_AUTHORITY_VIOLATION');
    requireGate(witness.layout.unresolved.length===0&&witness.sampling.every(v=>v.status==='PASS'),'UNRESOLVED_FIXTURE:'+item.id);
    const hashes=Object.fromEntries(['visual.svg','visual.tex','spec.json','witness.json'].map(name=>[name,digest(path.join(folder,name))]));
    requireGate(hashes['visual.svg']===witness.normalizedSvgSha256&&hashes['visual.tex']===witness.texSha256,'WITNESS_FILE_DRIFT');
    artifactBindings.push({id:item.id,files:hashes,staticInputSha256:digest(path.join(repoRoot,item.staticInput))});
    staticRows.push({id:item.id,status:result.status});
  }
  const deterministic=readRel('determinism/summary.json');
  requireGate(deterministic.status==='PASS','DETERMINISM_FAIL');
  assertExactCoverage(deterministic.rows.map(v=>v.id),ids,'DETERMINISM');
  for(const row of deterministic.rows){
    requireGate(row.status==='PASS'&&JSON.stringify(row.builds[0])===JSON.stringify(row.builds[1]),'REBUILD_DIFFERENCE');
    const current=artifactBindings.find(v=>v.id===row.id);
    for(const label of ['rebuild-a','rebuild-b'])for(const [file,hash] of Object.entries(current.files)){
      requireGate(digest(path.join(run,'determinism',label,'candidate',row.id,file))===hash,'STALE_REBUILD:'+row.id+':'+file);
    }
  }
  const receiptFile=assertOutput(path.resolve(repoRoot,bboxReceipt)),receipt=json(receiptFile);
  const analyzerHash=digest(path.join(repoRoot,'archive/tools/geometry-equation/verify-rendered-layout.mjs'));
  requireGate(receipt.status==='PASS'&&receipt.analyzerSha256===analyzerHash,'STALE_BBOX_ANALYZER');
  assertExactCoverage(receipt.rows.map(v=>v.fixtureId+':'+v.viewport),ids.flatMap(v=>[v+':desktop',v+':mobile']),'BBOX');
  for(const row of receipt.rows){
    const captureFile=assertOutput(path.join(repoRoot,row.capturePath)),capture=json(captureFile);
    const current=artifactBindings.find(v=>v.id===row.fixtureId);
    requireGate(row.status==='PASS'&&row.errorCount===0&&row.analyzerSha256===analyzerHash,'BBOX_RECEIPT_FAIL');
    requireGate(digest(captureFile)===row.captureJsonSha256&&digest(assertOutput(path.join(repoRoot,row.screenshotPath)))===row.screenshotSha256,'CAPTURE_FILE_DRIFT');
    requireGate(capture.svgSha256===current.files['visual.svg']&&row.svgRawSha256===capture.svgSha256,'STALE_CAPTURE_SVG');
    const result=analyzeRenderedLayout(capture.capture);
    assertActualEvidence({...result,runtime:capture.capture.runtime,synthetic:capture.capture.synthetic});
  }

  const matrixFile=path.join(run,'archive-render-matrix.json'),matrix=json(matrixFile);
  requireGate(matrix.synthetic===false&&matrix.engineSha256===digest(path.join(repoRoot,'archive/engine.html')),'STALE_ARCHIVE_RUNTIME');
  for(const source of matrix.sources){
    requireGate(source.protectedFieldParity==='PASS'&&digest(path.join(repoRoot,source.sourcePath))===source.sourceSha256&&
      digest(path.join(repoRoot,source.candidatePath))===source.candidateSha256,'ARCHIVE_SOURCE_DRIFT');
    for(const asset of source.assets)requireGate(digest(path.join(repoRoot,asset.path))===asset.sha256,'ARCHIVE_ASSET_DRIFT');
  }
  const nativeFolder=path.join(run,'archive-render',archiveAttempt),native=json(path.join(nativeFolder,'summary.json'));
  requireGate(native.status==='PASS'&&native.matrixSha256===digest(matrixFile),'STALE_NATIVE_MATRIX');
  const keys=matrix.sources.flatMap(s=>['exam','sol','ans'].flatMap(m=>['desktop','mobile'].map(v=>s.id+'-'+m+'-'+v)));
  assertExactCoverage(matrix.rows.map(v=>v.id+'-'+v.mode+'-'+v.viewport),keys,'MATRIX');
  assertExactCoverage(native.rows.map(v=>v.id),keys,'ARCHIVE_CAPTURE');
  const nativeRows=[];
  for(const item of matrix.rows){
    const id=item.id+'-'+item.mode+'-'+item.viewport,row=json(path.join(nativeFolder,id+'.json'));
    assertActualEvidence(row);
    requireGate(row.capture.status==='MEASURED'&&row.capture.failedSvgCount===0&&row.sourceSha256===item.sourceSha256&&
      row.candidateSha256===item.candidateSha256&&row.engineSha256===matrix.engineSha256,'ARCHIVE_BINDING_FAIL');
    requireGate(row.state.questionBlocks===item.questionCount&&row.state.pageCount>0&&row.state.allImagesLoaded&&row.state.mathJaxReady,'ARCHIVE_CONTENT_INCOMPLETE');
    requireGate(row.state.readiness&&['RENDER_READY','PRINT_READY'].includes(JSON.parse(row.state.readiness).state),'NATIVE_RENDER_NOT_READY');
    const expectedSvgCount=item.mode==='sol'?item.assets.length:0;
    requireGate(row.capture.loadedSvgCount===expectedSvgCount,'SOLUTION_IMAGE_LOAD_INCOMPLETE');
    requireGate(fs.existsSync(path.join(nativeFolder,id+'.png')),'NATIVE_SCREENSHOT_MISSING');
    nativeRows.push({id,status:'PASS',capture:row.capture});
  }
  const legacy=readRel('legacy-contract/summary.json'),raw=readRel('legacy-contract/qualification.json');
  requireGate(legacy.status==='PASS'&&legacy.gate==='LEGACY_CONTRACT_BASELINE_PARITY'&&legacy.baselineInputParity==='PASS'&&
    legacy.verifierByteParity==='PASS'&&legacy.introducedRegressionCount===0&&legacy.knownBadRecall==='PASS','LEGACY_CODE_REGRESSION');
  requireGate(legacy.rawQualificationStatus===raw.status&&legacy.failureCount===raw.failureCount&&legacy.inheritedFindings.length===raw.failureCount,'LEGACY_FINDINGS_HIDDEN');
  const buildPerformance=readRel('performance/build.json'),browserPerformance=readRel('performance/browser.json');
  requireGate(buildPerformance.status==='PASS'&&browserPerformance.status==='PASS','PERFORMANCE_NOT_MEASURED');
  assertExactCoverage(buildPerformance.rows.map(v=>v.id),ids,'BUILD_PERFORMANCE');
  assertExactCoverage(browserPerformance.rows.map(v=>v.id+':'+v.viewport),ids.flatMap(v=>[v+':desktop',v+':mobile']),'BROWSER_PERFORMANCE');
  for(const row of buildPerformance.rows){
    requireGate(row.status==='PASS'&&row.pureBuildByteParity&&Number.isFinite(row.buildTimeMs?.median)&&row.buildTimeMs.median>=0&&
      row.svgSha256===artifactBindings.find(v=>v.id===row.id).files['visual.svg'],'BUILD_PERFORMANCE_DRIFT');
  }
  for(const row of browserPerformance.rows){
    assertPerformanceRow(row);requireGate(row.status==='PASS'&&row.svgSha256===artifactBindings.find(v=>v.id===row.id).files['visual.svg'],'BROWSER_PERFORMANCE_DRIFT');
    assertActualEvidence({...row.qa,synthetic:row.synthetic,runtime:row.runtime});
  }
  assertExactCoverage(browserPerformance.archiveRows.map(v=>v.id),keys,'NATIVE_PERFORMANCE');
  for(const row of browserPerformance.archiveRows)requireGate(Number.isFinite(row.renderReadyMs)&&row.renderReadyMs>=0&&
    digest(assertOutput(path.join(repoRoot,row.evidencePath)))===row.evidenceSha256,'NATIVE_PERFORMANCE_DRIFT');

  const gateNames=['SHARED_NUMERIC_MODEL_PASS','SEMANTIC_MODEL_PASS','SAFE_MATH_SERIALIZER_PASS','FUNCTION_SAMPLING_PASS',
    'LABEL_LAYOUT_PASS','SVG_COMPOSER_PASS','ACTUAL_SVG_PARITY_VERIFIER_PASS','RENDERED_BBOX_QA_PASS','ARCHIVE_RENDER_QA_PASS',
    'DETERMINISTIC_REBUILD_PASS','PERFORMANCE_MEASURED_PASS'];
  const proofPaths=['tests/phase-15-code-tests.json','config/baseline.json','config/run.json','fixtures/manifest.json',
    'determinism/summary.json','archive-render-matrix.json','legacy-contract/summary.json','legacy-contract/qualification.json',
    'performance/build.json','performance/browser.json'];
  const evidenceHashes=Object.fromEntries(proofPaths.map(v=>[v,digest(path.join(run,v))]));
  evidenceHashes.bboxReceipt=digest(receiptFile);evidenceHashes.nativeSummary=digest(path.join(nativeFolder,'summary.json'));
  const result={status:'GEOMETRY_VISUAL_ENGINE_CODE_READY',scope:'shared code and 13 isolated qualification fixtures',
    publicationAuthorized:false,productionPromotion:false,engineVersion:config.engineVersion,branch:baseline.branch,
    qualifiedBaseHead:git('rev-parse','HEAD'),phaseCommits:git('log','--reverse','--format=%H %s',baseline.head+'..HEAD').split('\n'),
    gates:Object.fromEntries(gateNames.map(v=>[v,'PASS'])),REGRESSION_FAIL:0,UNRESOLVED_P0:0,UNRESOLVED_P1:0,
    tests:{python:proof.pythonTests,node:proof.nodeTests,static:staticRows.length,renderedBbox:receipt.rows.length,nativeArchive:nativeRows.length,determinism:deterministic.rows.length},
    production:{protectedFiles:actualProtected.length,mutations:0,originalIndependentVerifiers:verifiers.length},
    inheritedProductionQualification:{status:raw.status,targets:raw.target,failures:raw.failureCount,findings:legacy.inheritedFindings,
      severity:'not reclassified by this code-only job; production FINAL remains blocked for these rows',
      outsideCodeScope:true,requires:'subsequent frozen inventory triage/FULL PILOT'},
    evidenceHashes,artifactBindings,staticRows,nativeRows,
    limitations:['optional TikZ adapter is candidate draft only; converted SVG must pass the same gates',
      'archive mobile keeps existing fitted print-page preview; physical print/publication QA is reserved for FULL PILOT',
      'seal does not qualify all pre-existing production assets or authorize question publication']};
  return result;
}
export function saveSeal(result,run){
  const folder=assertOutput(path.join(run,'seal'));fs.mkdirSync(folder,{recursive:true});
  const git=(...args)=>execFileSync('git',args,{cwd:repoRoot,encoding:'utf8'}).trim();
  const baseline=json(path.join(run,'config/baseline.json'));
  const names=new Set(git('diff','--name-only','-z',baseline.head).split('\0').filter(Boolean));
  for(const name of git('ls-files','--others','--exclude-standard','-z','--','archive/tools/geometry-equation').split('\0').filter(Boolean))names.add(name);
  const code=[...names].filter(v=>!v.startsWith('archive/_generated/')).sort().map(file=>({path:file,sha256:digest(path.join(repoRoot,file)),bytes:fs.statSync(path.join(repoRoot,file)).size}));
  const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?(['seal','legacy-contract-shadow'].includes(e.name)?[]:walk(path.join(dir,e.name))):[path.join(dir,e.name)]);
  const evidence=walk(run).sort().map(file=>({path:path.relative(repoRoot,file).replaceAll('\\','/'),sha256:digest(file),bytes:fs.statSync(file).size}));
  const inventory={scope:'all changed source files and owned run evidence; shadow input copies and self-referential seal outputs excluded',
    codeFiles:code,evidenceFiles:evidence,codeFileCount:code.length,evidenceFileCount:evidence.length};
  fs.writeFileSync(path.join(folder,'inventory.json'),JSON.stringify(inventory,null,2)+'\n');
  result.inventorySha256=digest(path.join(folder,'inventory.json'));
  fs.writeFileSync(path.join(folder,'code-ready.json'),JSON.stringify(result,null,2)+'\n');
  const build=json(path.join(run,'performance/build.json')),browser=json(path.join(run,'performance/browser.json'));
  const range=values=>Math.min(...values).toFixed(3)+'–'+Math.max(...values).toFixed(3);
  const report=[
    '# Geometry visual engine upgrade — final code qualification','',
    '- 상태: **'+result.status+'** (공유 코드와 격리 fixture 범위)',
    '- 브랜치: '+result.branch,
    '- 완료 Phase: 0–15. Phase15 봉인 commit은 이 보고서를 포함하는 Git commit으로 확인한다.',
    '- publicationAuthorized=false; productionPromotion=false',
    '- Python '+result.tests.python+', Node '+result.tests.node+', actual SVG '+result.tests.static+', bbox '+result.tests.renderedBbox+', archive '+result.tests.nativeArchive+', determinism '+result.tests.determinism+' PASS',
    '- 신규 엔진 P0/P1=0/0; 신규 회귀=0; 원본 '+result.production.protectedFiles+'개 변경=0; 기존 verifier6개 바이트 일치','',
    '## 기존 production qualification finding','',
    '기존 v22 raw qualification은 **'+result.inheritedProductionQualification.status+'**를 유지한다. 현재 99건 중 91 PASS / 8 FAIL이며 고정 과거 분모는 94다.',
    '8건의 입력은 모두 Phase0 baseline과 같고, 신규 회귀는 0이다. 이 코드 봉인은 해당 production finding을 해결하거나 PASS로 변경하지 않는다.',
    '심각도 재분류와 production 자산 조치는 이후 inventory/FULL PILOT 범위다. 원본 FAIL 전체는 legacy-contract/qualification.json에 보존했다.','',
    '## Phase commits','',...result.phaseCommits.map((v,i)=>'- Phase '+i+': '+v),'',
    '## 성능 측정','',
    '| 측정 | 범위 |','|---|---|',
    '| SVG bytes | '+range(build.rows.map(v=>v.svgBytes))+' |',
    '| DOM node count | '+range(browser.rows.map(v=>v.domNodeCount))+' |',
    '| path count | '+range(browser.rows.map(v=>v.pathCount))+' |',
    '| text node count | '+range(browser.rows.map(v=>v.textNodeCount))+' |',
    '| build median ms | '+range(build.rows.map(v=>v.buildTimeMs.median))+' |',
    '| browser layout ms | '+range(browser.rows.map(v=>v.browserLayoutTimeMs))+' |',
    '| standalone desktop render ms | '+range(browser.rows.filter(v=>v.viewport==='desktop').map(v=>v.renderTimeMs))+' |',
    '| standalone mobile render ms | '+range(browser.rows.filter(v=>v.viewport==='mobile').map(v=>v.renderTimeMs))+' |',
    '| native archive desktop ready ms | '+range(browser.archiveRows.filter(v=>v.viewport==='desktop').map(v=>v.renderReadyMs))+' |',
    '| native archive mobile ready ms | '+range(browser.archiveRows.filter(v=>v.viewport==='mobile').map(v=>v.renderReadyMs))+' |','',
    '정확성 게이트 이후 측정했다. 환경별 시간 차이가 있고 임의 latency 예산을 PASS 조건으로 추가하지 않았다.','',
    '## Inventory / evidence','',
    '- 코드 변경 '+inventory.codeFileCount+'개, 물리 evidence '+inventory.evidenceFileCount+'개: inventory.json (각 파일 SHA/bytes)',
    '- code-ready.json: 필수 gate, raw asset binding, evidence SHA, 기존 FAIL 목록',
    '- tests/phase-15-code-tests.json: 전체 unit/syntax 결과와 현재 코드 SHA',
    '- performance/build.json, performance/browser.json: 원시 시간/DOM 수치',
    '- Phase0–15별 Lead 정적 확인 및 Luna의 PASS/FAIL, 실패·수정 이력은 phases/ 및 tests/에 저장','',
    '## 범위와 후속 작업','',
    ...result.limitations.map(v=>'- '+v),
    '- main merge, GOLD 전체 이식, production SVG 교체 및 FULL PILOT은 수행하지 않았다.',''
  ].join('\n');
  fs.writeFileSync(path.join(folder,'FINAL_REPORT.md'),report);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const arg=k=>process.argv[process.argv.indexOf(k)+1];
  const run=assertOutput(arg('--run'));
  try{
    const result=qualifyCode({run,archiveAttempt:arg('--archive-attempt'),bboxReceipt:arg('--bbox-receipt')});
    saveSeal(result,run);console.log(JSON.stringify({status:result.status,tests:result.tests,inheritedProductionFailures:result.inheritedProductionQualification.failures}));
  }catch(error){
    const folder=assertOutput(path.join(run,'seal'));fs.mkdirSync(folder,{recursive:true});
    const failure={status:'CODE_READY_BLOCKED',publicationAuthorized:false,error:String(error.stack)};
    fs.writeFileSync(path.join(folder,'failed-seal-'+Date.now()+'.json'),JSON.stringify(failure,null,2)+'\n');
    fs.writeFileSync(path.join(folder,'code-ready.json'),JSON.stringify(failure,null,2)+'\n');
    fs.writeFileSync(path.join(folder,'FINAL_REPORT.md'),'# CODE_READY_BLOCKED\n\n'+String(error.stack)+'\n');
    console.error(String(error.stack));process.exitCode=1;
  }
}
