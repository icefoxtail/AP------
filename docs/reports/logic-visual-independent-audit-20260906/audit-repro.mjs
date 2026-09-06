import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { validateFact, semanticSha, sha256 } from '../../../archive/tools/logic-visual-audit/lib/canonicalize.mjs';
import { validateBatchManifest } from '../../../archive/tools/pipeline-core/batch.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const outputDir = path.dirname(fileURLToPath(import.meta.url));
const toolDir = path.join(root, 'archive/tools/logic-visual-audit');
const reportDir = path.join(toolDir, 'reports');
const read = name => JSON.parse(fs.readFileSync(path.join(reportDir, name), 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const manifest = fs.readFileSync(path.join(root, 'docs/rules/MANIFEST.md'), 'utf8');
const rules = [...manifest.matchAll(/^- (.+) \| (\d+) bytes \| sha256 ([a-f0-9]{64})$/gm)].map(([,name,size,sha]) => {
  const data = fs.readFileSync(path.join(root, 'docs/rules', name));
  return {path: `docs/rules/${name}`, declaredVersion: data.toString('utf8').split(/\r?\n/)[0], bytes:data.length, sha256:hash(data), manifestBytes:Number(size), manifestSha256:sha, pass:data.length===Number(size)&&hash(data)===sha};
});

// Execute existing read/report scripts with ALL writes captured in memory.
// This does not execute production mutation scripts or overwrite existing evidence.
function replay(name, overrides = {}, argv = []) {
  const writes = {};
  const reads = [];
  const fakeFs = {...fs,
    readFileSync(p, options) {
      const key = String(p); reads.push(key);
      if (Object.hasOwn(overrides, key)) {
        const value = typeof overrides[key] === 'string' ? overrides[key] : JSON.stringify(overrides[key]);
        return options ? value : Buffer.from(value);
      }
      return fs.readFileSync(p, options);
    },
    existsSync(p) { return Object.hasOwn(overrides,String(p)) || fs.existsSync(p); },
    writeFileSync(p, data) { writes[path.basename(String(p))] = JSON.parse(String(data)); },
    mkdirSync() {}
  };
  const scriptFile = path.join(toolDir, name);
  const code = fs.readFileSync(scriptFile,'utf8').replace(/^import .*;\r?\n/gm,'').replaceAll('import.meta.url',JSON.stringify(new URL(`file:///${scriptFile.replaceAll('\\','/')}`).href));
  const proc = {argv:['node',scriptFile,...argv],exitCode:0};
  const writeNewJson = (file, value) => fakeFs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
  // The replay is intentionally isolated from production closure state. A
  // passing closure stub lets this harness exercise the phase-2 aggregator's
  // own evidence gates and mutation behavior without authorizing release.
  const closureFromArgs = () => ({ status: 'PASS', productionAuthorized: false, errors: [], pipeline: 'logic-visual', inputSha: 'sha256:replay' });
  vm.runInNewContext(code,{fs:fakeFs,path,crypto,vm,fileURLToPath,Buffer,process:proc,console:{log(){}},structuredClone,sha256,writeNewJson,closureFromArgs,validateBatchManifest}, {timeout:30000});
  return {writes,reads: [...new Set(reads)].map(p=>path.relative(root,p).replaceAll('\\','/')),exitCode:proc.exitCode};
}

const inventory = read('phase2_2022_set_pilot_inventory.json');
const template = JSON.parse(fs.readFileSync(path.join(toolDir,'phase2_adaptive_batch_manifest.template.json'),'utf8'));
const manifestPath = path.join(outputDir,'in-memory-manifest.json');
const validShape = {...template, questionUids:inventory.rows.slice(0,8).map(r=>r.questionUid),inventorySha:`sha256:${'0'.repeat(64)}`,manifestSha:'PENDING_COMPUTE'};
const cases = [
  ['active-canonical-uids-and-false-inventory-sha',validShape],
  ['revision-without-supersedes',{...validShape,revision:2,supersedes:null}],
  ['null-manifest-sha',{...validShape,manifestSha:null}],
  ['zero-items-approved-size-exception',{...validShape,questionUids:[],plannedSize:0,visualDecisionPlan:{NO_VISUAL:0,KEEP_EXISTING:0,REBUILD_EXISTING:0,ADD_NEW_VISUAL:0},sizeException:{status:'APPROVED'}}]
].map(([id,value])=>{const outputPath=path.join(outputDir,`in-memory-${id}.json`);const r=replay('validate-phase2-adaptive-batch-manifest.mjs',{[manifestPath]:value},[manifestPath,path.join(reportDir,'phase2_2022_set_pilot_inventory.json'),path.join(reportDir,'phase2_2022_set_pilot_canonical_registry.json'),'--out',outputPath]);const validation=r.writes[path.basename(outputPath)]??{};return {id,expected:'FAIL',actual:validation.status??'MISSING_WRITE',errors:validation.errors??[],readCanonicalRegistry:r.reads.some(p=>p.includes('canonical_registry')),exitCode:r.exitCode};});

const malformed = {factSchemaVersion:'LOGIC_VISUAL_FACT_v1',questionUid:42,unit:'invalid',visualType:'SET_FORCE_FORBID_FREE',visualRole:null,requiredLabels:'not-array',decisiveStepIds:12,forcedElements:null,forbiddenElements:null,freeElements:null,freeCount:-7,countingResult:null};
const sameMeaning = {factSchemaVersion:'LOGIC_VISUAL_FACT_v1',questionUid:'uid-a',unit:'집합',visualType:'SET_FORCE_FORBID_FREE',visualRole:'bucket',requiredLabels:[],decisiveStepIds:[],forcedElements:[1],forbiddenElements:[2],freeElements:[3],freeCount:1,countingResult:2};
const schemaTests = {malformedFact:malformed,validation:validateFact(malformed),sameMalformedExpectedObservedPass:validateFact(malformed).pass&&semanticSha(malformed)===semanticSha(structuredClone(malformed)),sameSemanticsDifferentUidHashEqual:semanticSha(sameMeaning)===semanticSha({...sameMeaning,questionUid:'uid-b'})};

const finalOutputPath = path.join(outputDir,'in-memory-final-report.json');
const finalReplay = replay('build-phase2-2022-set-pilot-final-report.mjs',{},['--out',finalOutputPath]);
const finalResult = finalReplay.writes[path.basename(finalOutputPath)];
const renderFiles = fs.readdirSync(reportDir).filter(n=>/^phase2_batch_\d+_qualification_render\.json$/.test(n));
const overrides = Object.fromEntries(renderFiles.map(n=>{const r=read(n);r.status='FAIL_INJECTED';for(const e of r.entries??r.results??[]) {e.status='FAIL_INJECTED';e.layoutStatus='FAIL_INJECTED';}return [path.join(reportDir,n),r];}));
const failedFinalOutputPath = path.join(outputDir,'in-memory-final-report-fail-render.json');
const failedRenderReplay = replay('build-phase2-2022-set-pilot-final-report.mjs',overrides,['--out',failedFinalOutputPath]);
const failedRenderResult = failedRenderReplay.writes[path.basename(failedFinalOutputPath)];

const freezeReplay = replay('freeze-c-denominator.mjs',{
 [path.join(reportDir,'c_denominator.json')]:{status:'UNFROZEN',maps:{actualSolutionVisualAttachedMapSha:'attached-map'},candidateRequiredUidSet:['required','optional-attached'],cDenominatorInputSha:'OLD_INPUT'},
 [path.join(reportDir,'final_visual_requirement_map.json')]:{requirements:{required:'VISUAL_REQUIRED','optional-attached':'VISUAL_OPTIONAL'},adjudications:{required:{status:'RESOLVED'},'optional-attached':{status:'RESOLVED'}}}
});
const freezeResult = freezeReplay.writes['c_denominator_frozen.json'];
const registry = read('phase2_2022_set_pilot_canonical_registry.json');
const occurrences = new Map();
for (const b of registry.canonicalBatches.filter(b=>b.isCanonical)) for(const uid of b.questionUids) occurrences.set(uid,(occurrences.get(uid)||0)+1);
const evidence = {
 generatedAt:new Date().toISOString(),scope:'Independent document/pipeline review. No new math or browser certification. Production and existing evidence read-only.',
 rulePreflight:{count:rules.length,failed:rules.filter(r=>!r.pass),rules},
 manifestNegativeTests:cases,schemaTests,
 finalAggregator:{baseline:{overallStatus:finalResult.overallStatus,typedSemanticParity:finalResult.typedSemanticParity.status,infrastructure:finalResult.evidenceContract,coverage:{requiredCount:finalResult.denominatorClosure.requiredCount},exitCode:finalReplay.exitCode},allRenderReportsForcedFail:{overallStatus:failedRenderResult.overallStatus,typedSemanticParity:failedRenderResult.typedSemanticParity.status,browserStatus:failedRenderResult.renderEvidence.browserStatus,exitCode:failedRenderReplay.exitCode},reads:finalReplay.reads},
 denominatorNegativeTest:{expectedRequired:['required','optional-attached'],actualRequired:freezeResult.logicVisualRequiredUidSet,status:freezeResult.status,inputSha:freezeResult.cDenominatorInputSha},
 registry:{status:registry.status,uniqueUidCount:registry.canonicalQuestionCount,rawConflictCount:registry.legacyMigration.rawConflictCount,overlapCount:registry.legacyMigration.legacyCanonicalOverlapCount,activeBatchDuplicateUids:[...occurrences].filter(([,n])=>n>1)},
 inspectedFiles:[...new Set([...finalReplay.reads,...['validate-phase2-adaptive-batch-manifest.mjs','build-phase2-canonical-batch-registry.mjs','build-phase2-batch-11-full-typed-semantic-parity.mjs','run-phase2-batch-11.mjs','freeze-c-denominator.mjs','lib/canonicalize.mjs'].map(n=>'archive/tools/logic-visual-audit/'+n)])].map(p=>({path:p,sha256:hash(fs.readFileSync(path.join(root,p)))}))
};
fs.writeFileSync(path.join(outputDir,'audit-evidence.json'),JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({...evidence,rulePreflight:{count:rules.length,failed:evidence.rulePreflight.failed},inspectedFiles:undefined,finalAggregator:{...evidence.finalAggregator,reads:undefined}},null,2));
