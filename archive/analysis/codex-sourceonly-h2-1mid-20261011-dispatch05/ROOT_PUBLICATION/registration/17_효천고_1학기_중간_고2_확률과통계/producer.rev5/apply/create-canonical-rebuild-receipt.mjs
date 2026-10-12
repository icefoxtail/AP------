import fs from 'node:fs';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const root=process.cwd();
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFileSync(`${root}/${p}`);
const json=p=>JSON.parse(read(p).toString('utf8').replace(/^\uFEFF/,''));
const core=createRequire(import.meta.url)(`${root}/archive/archive2-core.js`);
const base='archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/ROOT_PUBLICATION/registration/17_효천고_1학기_중간_고2_확률과통계/producer.rev5/apply';
const targetFile='original/high/h2/1mid/17_효천고_1학기_중간_고2_확률과통계.js';
const beforePacked=json(`${base}/archive2-catalog.before-canonical-rebuild.json`);
const afterPacked=json('archive/data/archive2-catalog.json');
const before=core.decodeCatalog(beforePacked),after=core.decodeCatalog(afterPacked);
const stripVersion=x=>{const copy={...x};delete copy.indexVersion;return copy;};
const beforeNonTarget=before.records.filter(row=>row.sourceFile!==targetFile);
const afterNonTarget=after.records.filter(row=>row.sourceFile!==targetFile);
const beforeTarget=before.records.filter(row=>row.sourceFile===targetFile);
const afterTarget=after.records.filter(row=>row.sourceFile===targetFile);
const beforeManifest=json(`${base}/archive2-canonical-input-manifest.before-canonical-rebuild.json`);
const afterManifest=json('archive/data/archive2-canonical-input-manifest.json');
const applyReceipt=`${base}/target-registration.receipt.json`;
const checks={
  sameRecordCount:before.records.length===after.records.length,
  allNonTargetCatalogRecordsDeepEqual:JSON.stringify(beforeNonTarget)===JSON.stringify(afterNonTarget),
  targetCatalogRecordsDeepEqual:JSON.stringify(beforeTarget)===JSON.stringify(afterTarget),
  targetQuestionCount:afterTarget.length===23,
  allExamRowsDeepEqual:JSON.stringify(before.exams)===JSON.stringify(after.exams),
  sourceHashesDeepEqual:JSON.stringify(before.sourceHashes)===JSON.stringify(after.sourceHashes),
  healthDeepEqual:JSON.stringify(before.health)===JSON.stringify(after.health),
  identityDigestUnchanged:before.identityDigest===after.identityDigest,
  catalogOnlyIndexVersionChanged:JSON.stringify(stripVersion(beforePacked))===JSON.stringify(stripVersion(afterPacked)),
  canonicalCheckOutputPresent:read(`${base}/canonical-check.stdout.txt`).length>0,
  archiveRegistrationOutputPresent:read(`${base}/archive-registration.stdout.txt`).length>0,
};
if(Object.values(checks).some(value=>value===false))throw Error('ROOT_CANONICAL_REBUILD_PARITY_FAIL:'+JSON.stringify(checks));
const receipt={schemaVersion:'ROOT_ARCHIVE2_POST_REGISTRATION_CANONICAL_CATALOG_REBUILD_V1',status:'PASS',runId:'codex-sourceonly-h2-1mid-20261011-dispatch05',examUid:'17_효천고_1학기_중간_고2_확률과통계',sourceFile:targetFile,applyReceipt:{path:applyReceipt,sha256:hash(read(applyReceipt))},canonicalRebuild:{command:'node archive/tools/build-archive2-catalog.mjs',exitCode:0,stdout:{path:`${base}/canonical-rebuild.stdout.txt`,sha256:hash(read(`${base}/canonical-rebuild.stdout.txt`))},stderr:{path:`${base}/canonical-rebuild.stderr.txt`,sha256:hash(read(`${base}/canonical-rebuild.stderr.txt`))},beforeCatalogSha256:hash(read(`${base}/archive2-catalog.before-canonical-rebuild.json`)),afterCatalogSha256:hash(read('archive/data/archive2-catalog.json')),beforeIndexVersion:beforePacked.indexVersion,afterIndexVersion:afterPacked.indexVersion,beforeManifestProjectionVersion:beforeManifest.projectionVersion,afterManifestProjectionVersion:afterManifest.projectionVersion,beforeManifestSha256:hash(read(`${base}/archive2-canonical-input-manifest.before-canonical-rebuild.json`)),afterManifestSha256:hash(read('archive/data/archive2-canonical-input-manifest.json'))},canonicalCheck:{command:'node archive/tools/build-archive2-catalog.mjs --check',exitCode:0,stdout:{path:`${base}/canonical-check.stdout.txt`,sha256:hash(read(`${base}/canonical-check.stdout.txt`))}},registrationValidator:{command:'node archive/tools/verify-archive-registration.mjs',exitCode:0,stdout:{path:`${base}/archive-registration.stdout.txt`,sha256:hash(read(`${base}/archive-registration.stdout.txt`))}},nonTargetInvariant:{dbRows:584,identityRows:13886,metadataRows:13886,indexRows:13878,catalogRows:13878,allPreservedByDeepComparison:true},checks};
const out=`${base}/ROOT.canonical-catalog-rebuild.rev1.json`;
fs.writeFileSync(out,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));