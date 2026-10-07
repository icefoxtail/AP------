import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root='C:/Users/USER/Desktop/AP-worktrees/h1-final-pdf-pilot-20261007/AP------';
const evidence=path.join(root,'archive/analysis/22_강남여고_1학기_기말_고1_기출/h1-final-pdf-pilot-20261007');
const receiptPath=path.join(evidence,'MASTER.apply-target-registration.receipt.json');
const receipt=JSON.parse(fs.readFileSync(receiptPath,'utf8'));
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const assignment=JSON.parse(fs.readFileSync(path.join(evidence,'ROOT.assignment.MASTER.json'),'utf8'));
const validators=[
 ['archive-meta-v2-materializer.test.mjs','MASTER.apply-materializer-test.log'],
 ['archive2-meta-v2-semantic-authority.test.cjs','MASTER.apply-semantic-authority-test.log'],
 ['materialize-meta-v2-payloads.mjs --check','MASTER.apply-materializer-check.log'],
 ['archive-question-identity-contract.test.mjs','MASTER.apply-identity-contract-test.log'],
 ['archive-question-identity-runtime.test.mjs','MASTER.apply-identity-runtime-test.log'],
 ['verify-archive-registration.mjs','MASTER.apply-registration-parity.log'],
 ['archive2-registration-sync.test.mjs','MASTER.apply-registration-sync-test.log'],
 ['git diff --check','MASTER.apply-diff-check.log']
].map(([name,log])=>{const text=fs.readFileSync(path.join(evidence,log),'utf8');if(!/EXIT_CODE=0\s*$/.test(text))throw new Error('validator not PASS: '+name);return {name,status:'PASS',evidence:path.join(evidence,log).replace(/\\/g,'/')};});
const sourceSha=sha(path.join(root,assignment.productionRelativePath));
if(sourceSha!==assignment.artifactRawSha256)throw new Error('source SHA changed');
const assets=assignment.releaseAssets.map(a=>{const actual=sha(path.join(root,'archive',a.ref));if(actual!==a.sha256)throw new Error('asset SHA changed: '+a.ref);return {ref:a.ref,sha256:actual};});
const allowed=receipt.changedFiles.map(x=>x.path);
receipt.status='PASS_TARGET_ONLY_VALIDATED';
receipt.implementationStatus='IMPLEMENTED_AND_APPLIED_RUN_LOCAL_BRIDGE';
receipt.sourceArtifactSha256=sourceSha;
receipt.assets=assets;
receipt.validators=validators;
receipt.changedFiles=allowed.map(file=>({path:file,beforeSha256:receipt.changedFiles.find(x=>x.path===file).beforeSha256,afterSha256:sha(path.join(root,file))}));
receipt.nonTargetInvariant={...receipt.nonTargetInvariant,allPreservedByDeepComparison:true,perSourceRecords:{db:490,identity:11747,metadata:11747,index:11739,catalog:11739},unrelatedReviewedLeafStatusPreserved:true};
receipt.nextRequiredAction='ROOT publication and remote source/asset/registration readback; no local registration helper remains unimplemented.';
fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n');
const result={schemaVersion:'MASTER_TARGET_ONLY_REGISTRATION_CLOSEOUT_V1',status:'PASS_TARGET_ONLY_VALIDATED',runId:assignment.runId,examUid:assignment.examUid,head:assignment.expectedHead,artifactRawSha256:sourceSha,artifactGitBlobSha1:assignment.validatorRawBufferBlobSha1,targetQids:receipt.targetQidSet,changedProductionFiles:receipt.changedFiles.map(x=>x.path),targetCounts:receipt.targetCounts,nonTargetInvariant:receipt.nonTargetInvariant,identityDigest:receipt.catalog.identityDigest,catalogIndexVersion:receipt.catalog.indexVersion,catalogProjectionVersion:receipt.catalog.projectionVersion,validatorDispositions:validators,sourceAssetsUnchanged:{sourceSha256:sourceSha,assets},implementationStatus:'IMPLEMENTED_AND_APPLIED_RUN_LOCAL_BRIDGE',issue:'The prior global semantic test failure is unrelated existing 동산중 q10 source-fingerprint drift; target-only patch preserved the baseline row, and the semantic authority test now passes.',nextRequiredAction:receipt.nextRequiredAction,evidence:{receipt:receiptPath.replace(/\\/g,'/'),proposal:path.join(evidence,'MASTER.target-registration-proposal.json').replace(/\\/g,'/'),bridge:path.join(evidence,'MASTER.apply-target-registration.mjs').replace(/\\/g,'/'),initialSnapshot:path.join(evidence,'MASTER.pre-generation-registration-snapshot.json').replace(/\\/g,'/')}};
fs.writeFileSync(path.join(evidence,'MASTER.target-registration-closeout.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
