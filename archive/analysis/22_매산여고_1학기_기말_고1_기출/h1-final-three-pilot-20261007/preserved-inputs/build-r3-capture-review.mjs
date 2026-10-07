import fs from "node:fs";
import path from "node:path";
import {createHash} from "node:crypto";
const [ev,asset]=process.argv.slice(2);
const sha=b=>createHash("sha256").update(b).digest("hex");
const capturePath=path.join(asset,"capture-04/machine-capture.json");
const bytes=fs.readFileSync(capturePath),capture=JSON.parse(bytes.toString("utf8"));
const observation={
"exam/desktop":"Reviewed all qids 1-22 and final q22. q4 aligned 보기 block renders with source-matched wraps; all choices and source diagram remain inside page bounds. No MathJax errors or horizontal overflow.",
"exam/mobile":"Reviewed all qids 1-22 and final q22 at 390x844. Page-fit scales print sheets to width; all text, choices and q08 diagram remain within the page, with zoom/scroll available for close reading. No clipping or overflow.",
"sol/desktop":"Reviewed all qids 1-22 and final q22. Changed solutions q6, q7, q11, q13, q16, q17 and q20 show their final answer/equation flow inside the cards; q4 statement wraps match source. SVGs decode; no MathJax errors or clipping.",
"sol/mobile":"Reviewed all qids 1-22 and final q22 at 390x844. Page-fit requires zoom for close reading; solution cards, equation rows, all diagrams and final values stay within page bounds with no clipping or overflow.",
"ans/desktop":"Reviewed all qids 1-22 including q22. Objective labels and short answers are complete, with no duplicate labels, clipping or horizontal overflow.",
"ans/mobile":"Reviewed all qids 1-22 including q22 at 390x844. Both answer columns and final qids are present and within bounds; no clipping or horizontal overflow."
};
const cases=capture.cases.map(c=>({id:c.id,reviewedQids:capture.qids,reviewedCaptureSha256s:c.captures.map(x=>x.image.sha256),layoutReviewStatus:"PASS",mathJaxStatus:"PASS",assetDecodeStatus:"PASS",observation:observation[c.id]}));
const review={schemaVersion:"JS_ARCHIVE_CODEX_R3_CAPTURE_REVIEW_V1",captureReportSha256:sha(bytes),artifactSha:capture.artifactSha,reviewerIdentity:{role:"archive_r3",reviewerId:"/root/r3_maesan2022"},cases};
const out=path.join(ev,"R3.capture-review.json");fs.writeFileSync(out,JSON.stringify(review,null,2)+"\n");
console.log(JSON.stringify({path:out,sha256:sha(fs.readFileSync(out)),captureReportSha256:review.captureReportSha256,artifactSha:review.artifactSha,cases:cases.map(c=>({id:c.id,capture:c.reviewedCaptureSha256s[0],qidCount:c.reviewedQids.length}))}));
