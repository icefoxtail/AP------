import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const root=process.cwd(),uid='24_매산여고_1학기_중간_고2_수학I',render=`archive/analysis/${uid}/render/r3-q21-revision2`,evidenceDir=`archive/analysis/${uid}/r3-20261011-codex`;
const sourceCapture='.tmp/archive/h2-1mid-20261011/24_매산여고_1학기_中間_고2_수학I/r3-capture-02/machine-capture.json';
const sourceCapturePath='.tmp/archive/h2-1mid-20261011/24_매산여고_1학기_중간_고2_수학I/r3-capture-02/machine-capture.json';
const sourceReview=`${evidenceDir}/R3.capture-review.revision2.json`;
const read=p=>fs.readFileSync(path.resolve(root,p)),sha=b=>createHash('sha256').update(b).digest('hex'),j=p=>JSON.parse(read(p));
const capture=j(sourceCapturePath),review=j(sourceReview),captureBytes=read(sourceCapturePath);
if(sha(captureBytes)!=='f5877fec67715a9e939a0e7fcc778a5a416f6e07c68c91d4faaf44d3aafa3ac0'||capture.artifactSha!=='8a1ff234d287e74217c6b79625ff2c9d152518fb'||review.captureReportSha256!==sha(captureBytes))throw Error('SOURCE_CAPTURE_REVIEW_BINDING_MISMATCH');
for(const c of capture.cases){for(const item of c.captures){const oldPath=item.image.path;const name=path.basename(oldPath);const durable=`${render}/${name}`;const srcBytes=read(oldPath),dstBytes=read(durable);if(!srcBytes.equals(dstBytes)||sha(srcBytes)!==item.image.sha256||sha(dstBytes)!==item.image.sha256)throw Error(`COPY_PARITY_FAIL:${name}`);item.image.path=durable;}}
const durableCapturePath=`${render}/machine-capture.json`,durableCaptureBytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');fs.writeFileSync(path.resolve(root,durableCapturePath),durableCaptureBytes);
const rebound=structuredClone(review);rebound.captureReportSha256=sha(durableCaptureBytes);rebound.captureReportPath=durableCapturePath;rebound.reboundCaptureManifestStatus='PATHS_REBOUND_TO_BYTE_IDENTICAL_DURABLE_CAPTURES';
if(rebound.cases.length!==capture.cases.length)throw Error('CASE_SET_CHANGED');
for(const c of rebound.cases){const cap=capture.cases.find(x=>x.id===c.id);const actual=cap.captures.map(x=>x.image.sha256);if(JSON.stringify(actual)!==JSON.stringify(c.reviewedCaptureSha256s))throw Error(`REVIEWED_IMAGE_HASH_SET_CHANGED:${c.id}`);}
const durableReviewPath=`${render}/R3.capture-review.json`;fs.writeFileSync(path.resolve(root,durableReviewPath),JSON.stringify(rebound,null,2)+'\n');
const output={sourceCapturePath,sourceCaptureSha256:sha(captureBytes),durableCapturePath,durableCaptureSha256:sha(durableCaptureBytes),durableReviewPath,durableReviewSha256:sha(read(durableReviewPath)),caseCount:capture.cases.length,perCase:capture.cases.map(c=>({id:c.id,captures:c.captures.map(x=>({path:x.image.path,sha256:x.image.sha256})),loadedAssets:c.loadedAssets.map(a=>({ref:a.ref,sha256:a.sha256}))})),durableReportHasTmp:JSON.stringify(capture).includes('.tmp')};
if(output.durableReportHasTmp)throw Error('DURABLE_REPORT_HAS_TMP_REFERENCE');console.log(JSON.stringify(output,null,2));
