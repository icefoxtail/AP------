import fs from "node:fs";
import crypto from "node:crypto";
import {gitBlobSha} from "../../../../archive/tools/archive-stage-validator.mjs";
const file="archive/analysis/archive-2026-1mid-nine-20261008/26_순천고_1학기_중간_고2_대수/CREATE.golden-negative-preflight.json";
const e=JSON.parse(fs.readFileSync(file,"utf8"));
const extras=[
 {sample:"archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js",qid:14,svg:"archive/assets/images/25_효천고_2학기_중간_고1_기출/q14-solution.svg",observation:"실제 SVG primitive에서 A, B, C와 수선발 D, BC, 수선/각이등분선 방향을 확인했다. 라벨 값은 해당 점·선에 붙어 있고, 현재 ImageMagick fallback에서는 한글 폰트 대체가 관찰되어 browser render PASS는 주장하지 않는다."},
 {sample:"archive/exams/original/high/h1/2mid/25_제일고_2학기_중간_고1_기출.js",qid:14,svg:"archive/assets/images/25_제일고_2학기_중간_고1_기출/q14-solution.svg",observation:"실제 SVG source와 변환 PNG에서 수직선·수평선·사선의 case geometry를 확인했다. 오른쪽 풀이 panel 텍스트의 한글은 fallback에서 깨져 보여 font/render quality PASS는 주장하지 않는다."}
];
for(const x of extras){const b=fs.readFileSync(x.svg);const h=crypto.createHash("sha256").update(b).digest("hex");const sample=e.goldenCalibration.samples.find(s=>s.path===x.sample);const item=sample.items.find(i=>i.qid===x.qid);item.visualSha256=h;item.visualGitBlobSha=gitBlobSha(b);item.visualObservation=x.observation;}
e.sampleVisualRead["25_효천고_q14"]="q14 SVG opened and inspected; geometry primitives and label ownership reviewed; raster fallback font substitution recorded.";
e.sampleVisualRead["25_제일고_q14"]="q14 SVG opened and inspected; graph line topology reviewed; raster fallback font substitution recorded.";
fs.writeFileSync(file,JSON.stringify(e,null,2)+"\n");
console.log(JSON.stringify(extras.map(x=>({path:x.svg,sha256:crypto.createHash("sha256").update(fs.readFileSync(x.svg)).digest("hex"),gitBlobSha:gitBlobSha(fs.readFileSync(x.svg))})),null,2));
