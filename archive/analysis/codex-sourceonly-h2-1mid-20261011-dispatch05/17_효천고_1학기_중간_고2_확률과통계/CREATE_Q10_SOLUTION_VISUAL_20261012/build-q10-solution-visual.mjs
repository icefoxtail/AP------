import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { gitBlobSha } from '../../../../../archive/tools/archive-stage-validator.mjs';

const root = path.resolve('.');
const examRel = 'archive/exams/original/high/h2/1mid/17_효천고_1학기_중간_고2_확률과통계.js';
const pngRel = 'archive/assets/images/17_효천고_1학기_중간_고2_확률과통계/q10.png';
const svgRel = 'archive/assets/images/17_효천고_1학기_중간_고2_확률과통계/q10-solution.svg';
const examPath = path.join(root, examRel);
const pngPath = path.join(root, pngRel);
const svgPath = path.join(root, svgRel);
const expectedSourceSha256 = '97d37e06747b4dff432b999a34266a05ac6dd16cfeb92fa6c9e74586cfdf2803';
const expectedPngSha256 = '712d44da802680d20519db4a3051552fe39adb737d1d48f57526168e8ad358c3';
const sha256 = b => crypto.createHash('sha256').update(b).digest('hex');
const examOriginal = fs.readFileSync(examPath);
const sourceShaBefore = sha256(examOriginal);
if (sourceShaBefore !== expectedSourceSha256) throw new Error(`SOURCE_SHA_MISMATCH:${sourceShaBefore}`);
const png = fs.readFileSync(pngPath);
const pngSha = sha256(png);
if (pngSha !== expectedPngSha256) throw new Error(`PNG_SHA_MISMATCH:${pngSha}`);
const sourceText = examOriginal.toString('utf8');
const qStart = sourceText.indexOf('    "id": 10,');
const qEnd = sourceText.indexOf('\n  },', qStart);
if (qStart < 0 || qEnd < 0) throw new Error('Q10_BLOCK_NOT_FOUND');
const qBlock = sourceText.slice(qStart, qEnd);
if (qBlock.includes('"solutionImage"')) throw new Error('Q10_SOLUTION_IMAGE_ALREADY_PRESENT');
const solutionLine = qBlock.match(/    "solution": .*?(\r?\n)/);
if (!solutionLine) throw new Error('Q10_SOLUTION_LINE_NOT_FOUND');
const props = [
  '    "solutionImage": "assets/images/17_효천고_1학기_중간_고2_확률과통계/q10-solution.svg",',
  '    "solutionImageAlt": "불규칙한 도로망의 각 교점에 최단 경로 수를 표시하고 P, Q를 0으로 둔 그림",',
  '    "solutionImageCaption": "왼쪽 교점과 아래 교점의 수를 더해 맨 위 행의 B=64를 얻는다.",',
  '    "solutionImageSize": "full",',
].join('\n') + '\n';
const svgHeader = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="860" height="470" viewBox="0 0 860 470" role="img" aria-labelledby="title desc">
  <title id="title">교점마다 왼쪽과 아래의 경로 수를 더하기</title>
  <desc id="desc">원본 도로망 그림 위에 아래 행부터 최단 경로 수를 표시한다. 금지된 P와 Q는 0이며 B의 값은 64이다.</desc>
  <defs>
    <style>
      .title { font-family: "Noto Sans KR", "Malgun Gothic", sans-serif; font-size: 25px; font-weight: 700; fill: #172b3a; }
      .count { font-family: "Arial", "Noto Sans KR", sans-serif; font-size: 18px; font-weight: 700; text-anchor: middle; dominant-baseline: central; fill: #12344a; }
      .count-box { fill: #ffffff; fill-opacity: 0.97; stroke: #2b718b; stroke-width: 1.4; }
      .blocked-box { fill: #fff1ed; stroke: #b53f38; stroke-width: 1.8; }
      .terminal-box { fill: #fff1c9; stroke: #c47b16; stroke-width: 2.2; }
      .hint { font-family: "Noto Sans KR", "Malgun Gothic", sans-serif; font-size: 16px; fill: #254458; }
      .hint-strong { font-weight: 700; fill: #164e69; }
      .terminal { font-family: "Arial", "Noto Sans KR", sans-serif; font-size: 22px; font-weight: 800; fill: #7a4b00; }
    </style>
  </defs>
  <rect width="860" height="470" fill="#ffffff"/>
  <text class="title" x="24" y="42">교점마다 왼쪽과 아래의 경로 수를 더하기</text>
  <text class="hint" x="24" y="72">아래 행부터 차례로 채우고, 지나면 안 되는 P와 Q에는 0을 둔다.</text>
  <image x="20" y="112" width="820" height="290" preserveAspectRatio="none" href="data:image/png;base64,`;
const svgFooter = `" aria-hidden="true"/>
  <g aria-label="원본 그림의 각 도로 교점에 놓은 경로 수">
`;
const xCoords = [112,175,239,302,365,428,493];
const rowDefs = [
  {y:230, xs:xCoords, values:[1,1,1,1,1,1,1], blocked:new Set()},
  {y:183, xs:xCoords, values:[1,2,3,4,5,6,7], blocked:new Set()},
  {y:132, xs:xCoords, values:[1,3,0,4,9,15,22], blocked:new Set([2])},
  {y:81, xs:xCoords, values:[1,4,4,8,0,15,37], blocked:new Set([4])},
  {y:30, xs:xCoords.slice(2), values:[4,12,12,27,64], blocked:new Set()},
];
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
let groups = '';
for (let r=0;r<rowDefs.length;r++) {
  const row=rowDefs[r];
  for (let i=0;i<row.values.length;i++) {
    const x=20+row.xs[i], y=112+row.y-18, value=row.values[i];
    const isBlocked=row.blocked.has(i), isTerminal=r===4&&i===4;
    const w=String(value).length===1?25:33, h=23;
    const klass=isBlocked?'blocked-box':isTerminal?'terminal-box':'count-box';
    const textClass=isTerminal?'terminal':'count';
    groups += `    <g data-row="${r}" data-column="${i}" data-source-point="${row.xs[i]},${row.y}" data-value="${value}" data-role="${isBlocked?'FORBIDDEN_ZERO':isTerminal?'TERMINAL':'COUNT'}"><rect class="${klass}" x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="${isTerminal?8:6}"/><text class="${textClass}" x="${x}" y="${y}">${esc(value)}</text></g>\n`;
  }
}
const svgTail = `  </g>
  <rect x="20" y="414" width="820" height="42" rx="10" fill="#f2f7fa" stroke="#cbd9e1"/>
  <text class="hint hint-strong" x="36" y="440">각 교점의 수 = 왼쪽 값 + 아래 값</text>
  <text class="hint" x="386" y="440">금지점 P, Q = 0</text>
  <text class="hint-strong" x="625" y="440">맨 위 행 → <tspan class="terminal">B=64</tspan></text>
</svg>
`;
const svg = svgHeader + png.toString('base64') + svgFooter + groups + svgTail;
fs.writeFileSync(svgPath, svg, {flag:'wx'});
const patchedBlock = qBlock.replace(solutionLine[0], solutionLine[0] + props);
if (patchedBlock === qBlock) throw new Error('Q10_REFERENCE_INSERT_NOOP');
const sourceAfter = sourceText.slice(0,qStart) + patchedBlock + sourceText.slice(qEnd);
fs.writeFileSync(examPath, sourceAfter, 'utf8');
const svgBytes=fs.readFileSync(svgPath), examBytes=fs.readFileSync(examPath);
const result={examRel,pngRel,svgRel,sourceSha256Before:sourceShaBefore,sourceSha256After:sha256(examBytes),pngSha256:pngSha,svgSha256:sha256(svgBytes),sourceBlobSha:gitBlobSha(examBytes),svgBlobSha:gitBlobSha(svgBytes),sourceChangedOnlyQ10:true,sourcePngBytesEmbeddedExactly:true};
fs.writeFileSync(path.join(root,'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/CREATE_Q10_SOLUTION_VISUAL_20261012/CREATE.q10.visual-build.receipt.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result,null,2));

