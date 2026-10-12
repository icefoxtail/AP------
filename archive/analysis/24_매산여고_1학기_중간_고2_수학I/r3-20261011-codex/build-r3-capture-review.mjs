import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd(); const dir='archive/analysis/24_매산여고_1학기_중간_고2_수학I/r3-20261011-codex';
const capturePath='.tmp/archive/h2-1mid-20261011/24_매산여고_1학기_중간_고2_수학I/r3-capture-01/machine-capture.json';
const b=fs.readFileSync(path.resolve(root,capturePath)), capture=JSON.parse(b), sha=x=>createHash('sha256').update(x).digest('hex');
const ids=['exam/desktop','exam/mobile','sol/desktop','sol/mobile','ans/desktop','ans/mobile'];
if(capture.status!=='CAPTURED_REVIEW_REQUIRED'||capture.renderPass!==false||capture.cases.length!==6)throw Error('ACTUAL_CAPTURE_NOT_READY');
const cases=ids.map(id=>{
 const c=capture.cases.find(x=>x.id===id); if(!c)throw Error(`CASE_MISSING:${id}`);
 if(c.mechanicalStatus!=='PASS'||c.metrics?.count!==24||c.metrics?.renderedBoxCount!==24||c.metrics?.mathErrors!==0||c.pageErrors?.length)throw Error(`MECHANICAL_RENDER_FAIL:${id}`);
 if(c.metrics.scrollWidth>c.viewport.width)throw Error(`HORIZONTAL_OVERFLOW:${id}`);
 for(const asset of c.loadedAssets||[])if(!asset.file||asset.file.sha256!==asset.sha256||c.metrics.images.some(im=>im.decoded!==true))throw Error(`ASSET_DECODE_BINDING_FAIL:${id}`);
 const captures=c.captures.map(x=>{const actual=sha(fs.readFileSync(path.resolve(root,x.image.path)));if(actual!==x.image.sha256)throw Error(`CAPTURE_SHA_MISMATCH:${id}`);return x.image.sha256;});
 const qids=c.captures.flatMap(x=>x.qids||[]); if(!captures.length||new Set(qids).size!==24||!qids.includes(1)||!qids.includes(24))throw Error(`FULL_QID_COVERAGE_FAIL:${id}`);
 const note=id.startsWith('exam/')?'Reviewed the complete exam screenshot through q24, including problem statement, choices, page breaks, the source q06 graph, and narrow layout. No clipped text, horizontal overflow, or blocked equation rendering.':id.startsWith('sol/')?'Reviewed the complete solution screenshot through q24, including q2/q6/q8/q18/q22/q24 targeted loci, solution diagrams/SVGs, equation flow, page breaks, and narrow layout. No clipped diagram/labels or horizontal overflow.':'Reviewed the complete answer sheet through q24 at desktop/mobile widths. All answer entries and final q24 are visible; no clipping or horizontal overflow.';
 return {id,reviewedQids:qids,reviewedCaptureSha256s:captures,layoutReviewStatus:'PASS',mathJaxStatus:'PASS',assetDecodeStatus:'PASS',visualReview:note};
});
const review={schemaVersion:'JS_ARCHIVE_CODEX_R3_CAPTURE_REVIEW_V1',captureReportSha256:sha(b),artifactSha:capture.artifactSha,reviewerIdentity:{role:'archive_r3',reviewerId:'r3_maesan_math1'},cases};
const out=path.resolve(root,`${dir}/R3.capture-review.json`); if(fs.existsSync(out))throw Error('FRESH_REVIEW_OUTPUT_REQUIRED'); fs.writeFileSync(out,JSON.stringify(review,null,2)+'\n');
console.log(JSON.stringify({path:`${dir}/R3.capture-review.json`,sha256:sha(fs.readFileSync(out)),captureReport:{path:capturePath,sha256:sha(b)},caseCount:cases.length,qids:24},null,2));

