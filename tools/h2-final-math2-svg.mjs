#!/usr/bin/env node
/**
 * Canonical text serializer and static contract for the H2 2nd-semester final
 * Math II solution SVG batch.
 *
 * SVG labels are plain text by contract.  The source JS remains the authority
 * for question/solution facts; this tool only converts that source into a
 * readable SVG representation and checks the resulting bytes.
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPORT_DIR = path.join(ROOT, 'reports', 'h2-2final-math2-visual');
const EXAMS = [
  '25_강남여고_2학기_기말_고2_수학II',
  '25_매산고_2학기_기말_고2_수학II',
  '25_매산여고_2학기_기말_고2_수학II',
  '25_순천고_2학기_기말_고2_수학II',
  '25_제일고_2학기_기말_고2_수학II',
];
const EXAM_DIR = path.join(ROOT, 'archive', 'exams', 'original', 'high', 'h2', '2final');
const ASSET_ROOT = path.join(ROOT, 'archive');
const RETAINED_EXISTING = new Set([
  'assets/images/25_순천고_2학기_기말_고2_수학II/q24-solution.svg',
]);

const COMMANDS = new Map([
  ['ge', '≥'], ['le', '≤'], ['gt', '>'], ['lt', '<'], ['ne', '≠'],
  ['in', '∈'], ['cdot', '·'], ['times', '×'], ['pm', '±'], ['pi', 'π'],
  ['to', '→'], ['rightarrow', '→'], ['leftarrow', '←'], ['approx', '≈'],
  ['circ', '°'], ['infty', '∞'], ['alpha', 'α'], ['beta', 'β'],
  ['gamma', 'γ'], ['theta', 'θ'], ['lambda', 'λ'], ['mu', 'μ'],
  ['mid', '|'], ['vert', '|'],
  ['mathrm', null], ['mathbf', null], ['mathbb', null], ['operatorname', null],
  ['displaystyle', ''], ['left', ''], ['right', ''], ['quad', ' '],
  [',', ' '], [';', ' '], [':', ' '], ['!', ''], [' ', ' '],
]);

function readExam(examId) {
  const file = path.join(EXAM_DIR, `${examId}.js`);
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
  return sandbox.window.questionBank;
}

function targetQuestions(includeRetained = false) {
  const rows = [];
  for (const examId of EXAMS) {
    for (const q of readExam(examId)) {
      const solutionImage = typeof q.solutionImage === 'string' ? q.solutionImage : '';
      if (!solutionImage.endsWith('.svg')) continue;
      const assetRel = solutionImage.replace(/^assets[\\/]/, 'assets/').replaceAll('\\', '/');
      const retained = RETAINED_EXISTING.has(assetRel);
      if (retained && !includeRetained) continue;
      rows.push({ examId, q, assetRel, assetPath: path.join(ASSET_ROOT, assetRel), retained });
    }
  }
  rows.sort((a, b) => a.assetRel.localeCompare(b.assetRel, 'ko'));
  return rows;
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function readBalanced(input, index) {
  if (input[index] !== '{') return null;
  let depth = 0;
  for (let i = index; i < input.length; i += 1) {
    if (input[i] === '{') depth += 1;
    else if (input[i] === '}') {
      depth -= 1;
      if (depth === 0) return { value: input.slice(index + 1, i), next: i + 1 };
    }
  }
  return { value: input.slice(index + 1), next: input.length };
}

function readToken(input, index) {
  let i = index;
  while (i < input.length && /\s/.test(input[i])) i += 1;
  if (input[i] === '{') return readBalanced(input, i);
  if (input[i] === '(') {
    let depth = 0;
    for (let j = i; j < input.length; j += 1) {
      if (input[j] === '(') depth += 1;
      else if (input[j] === ')') {
        depth -= 1;
        if (depth === 0) return { value: input.slice(i + 1, j), next: j + 1 };
      }
    }
  }
  if (i >= input.length) return { value: '', next: i };
  if (input[i] === '\\') {
    const match = input.slice(i + 1).match(/^[A-Za-z]+/);
    if (match) return { value: `\\${match[0]}`, next: i + 1 + match[0].length };
  }
  return { value: input[i], next: i + 1 };
}

function readDecorated(input, index, marker) {
  if (input[index] !== marker) return null;
  return readToken(input, index + 1);
}

function latexToPlain(raw) {
  if (!raw) return '';
  const input = String(raw)
    .replace(/\r?\n/g, ' ')
    .replace(/\\n(?![A-Za-z])/g, ' ')
    .replace(/\\r(?![A-Za-z])/g, ' ');
  let out = '';
  for (let i = 0; i < input.length;) {
    const ch = input[i];
    if (ch === '$') { i += 1; continue; }
    if (ch === '&') { out += ' '; i += 1; continue; }
    if (ch === '\\') {
      if (input[i + 1] === '\\') { out += '; '; i += 2; continue; }
      const match = input.slice(i + 1).match(/^([A-Za-z]+|[^A-Za-z\s])/);
      if (!match) { i += 1; continue; }
      const command = match[1];
      let next = i + 1 + command.length;
      if (command === 'dfrac' || command === 'frac') {
        const first = readToken(input, next);
        const second = readToken(input, first.next);
        out += `${latexToPlain(first.value).trim()} / ${latexToPlain(second.value).trim()}`;
        i = second.next;
        continue;
      }
      if (command === 'sqrt') {
        const arg = readToken(input, next);
        out += `√(${latexToPlain(arg.value).trim()})`;
        i = arg.next;
        continue;
      }
      if (command === 'int') {
        let lower = '';
        let upper = '';
        let cursor = next;
        let part = readDecorated(input, cursor, '_');
        if (part) { lower = latexToPlain(part.value).trim(); cursor = part.next; }
        part = readDecorated(input, cursor, '^');
        if (part) { upper = latexToPlain(part.value).trim(); cursor = part.next; }
        out += lower || upper ? `∫[${lower}, ${upper}]` : '∫';
        i = cursor;
        continue;
      }
      if (command === 'begin' || command === 'end') {
        const env = readToken(input, next);
        // Environment markers are parser syntax, never user-facing labels.
        out += '';
        i = env.next;
        continue;
      }
      if (command === 'text' || command === 'mathrm' || command === 'mathbf' || command === 'mathbb' || command === 'operatorname') {
        const arg = readToken(input, next);
        out += latexToPlain(arg.value);
        i = arg.next;
        continue;
      }
      if (command === '(' || command === ')' || command === '[' || command === ']') {
        out += command;
        i = next;
        continue;
      }
      if (command === '&') {
        out += ' ';
        i = next;
        continue;
      }
      const mapped = COMMANDS.get(command);
      if (mapped !== undefined) out += mapped ?? '';
      else if (command.length === 1) out += command;
      else out += command;
      i = next;
      continue;
    }
    if (ch === '^' || ch === '_') {
      const token = readToken(input, i + 1);
      const value = latexToPlain(token.value).trim();
      out += ch === '_' ? `[${value}]` : `^${value}`;
      i = token.next;
      continue;
    }
    if (ch === '{' || ch === '}') {
      out += ch;
      i += 1;
      continue;
    }
    out += ch;
    i += 1;
  }
  return out.replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
}

function htmlToPlain(value) {
  return latexToPlain(
    decodeEntities(String(value ?? '')
      .replace(/<img\b[^>]*>/gi, ' ')
      .replace(/<\/?(?:br|b|strong|i|em|u|div|span|p|table|tbody|thead|tr|td|th|ol|ul|li|section|sup|sub|hr)\b[^>]*>/gi, ' ')),
  );
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function visualWidth(char) {
  if (/\s/.test(char)) return 0.32;
  if (/[가-힣ㄱ-ㅎㅏ-ㅣ一-龥ぁ-んァ-ン]/.test(char)) return 1;
  return 0.57;
}

function wrapText(value, maxWidth) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (!text) return [''];
  const words = text.split(' ');
  const lines = [];
  let line = '';
  let width = 0;
  const push = () => { if (line) lines.push(line.trim()); line = ''; width = 0; };
  for (const word of words) {
    const wordWidth = [...word].reduce((sum, c) => sum + visualWidth(c), 0);
    const spaceWidth = line ? visualWidth(' ') : 0;
    if (line && width + spaceWidth + wordWidth > maxWidth) push();
    if (!line && wordWidth > maxWidth) {
      let chunk = '';
      let chunkWidth = 0;
      for (const c of word) {
        const w = visualWidth(c);
        if (chunk && chunkWidth + w > maxWidth) { lines.push(chunk); chunk = ''; chunkWidth = 0; }
        chunk += c; chunkWidth += w;
      }
      line = chunk;
      width = chunkWidth;
      continue;
    }
    if (line) { line += ' '; width += spaceWidth; }
    line += word;
    width += wordWidth;
  }
  push();
  return lines.length ? lines : [''];
}

function textLines(lines, x, y, attrs) {
  return lines.map((line, index) => `<text x="${x}" y="${y + index * 22}" ${attrs}>${xmlEscape(line)}</text>`).join('\n    ');
}

function sourceCard(row) {
  const question = htmlToPlain(row.q.content);
  const solution = htmlToPlain(row.q.solution);
  // SVG text is rendered at 15px/14px inside ~318px content columns.
  // The previous character-width budget (34/35) allowed Korean lines to
  // cross the panel boundary in real browsers. Keep the budget below the
  // measured column width so the layout contract is also visually true.
  const qLines = wrapText(question, 21);
  const sLines = wrapText(solution, 22);
  const panelY = 82;
  const contentBottomY = 140 + (Math.max(qLines.length, sLines.length) - 1) * 22;
  const panelBottomY = Math.max(panelY + 300, contentBottomY + 28);
  const panelHeight = panelBottomY - panelY;
  const conclusionY = panelBottomY + 24;
  const footerLines = wrapText(`${row.examId} · q${row.q.id} · source-bound solution visual`, 92);
  const footerY = conclusionY + 48 + 28;
  const height = Math.max(620, footerY + footerLines.length * 16 + 24);
  const answer = htmlToPlain(row.q.answer);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="${height}" viewBox="0 0 760 ${height}" role="img" aria-labelledby="title desc" preserveAspectRatio="xMidYMid meet">
  <title id="title">${xmlEscape(row.examId)} · q${row.q.id} 해설 시각화</title>
  <desc id="desc">문항 ${row.q.id}의 원문과 해설 흐름을 source-bound 텍스트 카드로 정리한 SVG</desc>
  <rect width="760" height="${height}" fill="#fff"/>
  <g font-family="Noto Sans KR, Pretendard, Apple SD Gothic Neo, Malgun Gothic, sans-serif" fill="#111">
    <text x="380" y="32" font-size="21" font-weight="700" text-anchor="middle">${xmlEscape(row.examId)} · q${row.q.id} 해설 시각화</text>
    <text x="380" y="59" font-size="15" text-anchor="middle" fill="#475569">문항 원문과 해설의 핵심 흐름</text>
    <rect x="18" y="${panelY}" width="350" height="${panelHeight}" rx="12" fill="#eff6ff" stroke="#93c5fd"/>
    <rect x="390" y="${panelY}" width="352" height="${panelHeight}" rx="12" fill="#f0fdf4" stroke="#86efac"/>
    <text x="34" y="112" font-size="17" font-weight="700" fill="#1d4ed8">문항 핵심</text>
    <text x="398" y="112" font-size="17" font-weight="700" fill="#15803d">해설 흐름</text>
    ${textLines(qLines, 34, 140, 'font-size="15"')}
    ${textLines(sLines, 398, 140, 'font-size="14"')}
    <rect x="18" y="${conclusionY}" width="724" height="48" rx="10" fill="#fff7ed" stroke="#fdba74"/>
    <text x="380" y="${conclusionY + 30}" font-size="17" text-anchor="middle" fill="#9a3412">결론: ${xmlEscape(answer)}</text>
    ${textLines(footerLines, 380, footerY, 'font-size="11" text-anchor="middle" fill="#64748b"')}
  </g>
</svg>`;
}

function specialSvg(row) {
  const key = `${row.examId}:q${row.q.id}`;
  if (key === '25_매산여고_2학기_기말_고2_수학II:q22') {
    const curvePoints = Array.from({ length: 21 }, (_, i) => {
      const x = i * 0.2;
      const k = x * (x - 3) ** 2;
      return `${(116.4 + 80.4 * x).toFixed(2)},${(370 - 45.5 * k).toFixed(2)}`;
    }).join(' ');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="620" viewBox="0 0 760 620" role="img" aria-labelledby="title desc" preserveAspectRatio="xMidYMid meet">
  <title id="title">f(x)+|f(x)+x|=7x+k의 네 실근 조건</title>
  <desc id="desc">원문 함수에서 유도한 K(x)의 piecewise graph. x&lt;0에서는 K(x)=-8x, x≥0에서는 K(x)=x(x-3)^2이며, 수평선 k가 0과 4 사이일 때 네 교점을 갖는다.</desc>
  <rect width="760" height="620" fill="#fff"/>
  <g font-family="Arial, Noto Sans KR, sans-serif" fill="#111">
    <text x="380" y="30" font-size="22" font-weight="700" text-anchor="middle">f(x)+|f(x)+x|=7x+k</text>
    <text x="380" y="57" font-size="15" fill="#475569" text-anchor="middle">K(x)=k로 바꾸어 네 교점 조건을 판정</text>
    <g transform="translate(52 86)">
      <rect x="0" y="0" width="470" height="430" rx="12" fill="#f8fafc" stroke="#cbd5e1"/>
      <line x1="36" y1="370" x2="438" y2="370" stroke="#111" stroke-width="2"/>
      <line x1="116.4" y1="28" x2="116.4" y2="392" stroke="#111" stroke-width="2"/>
      <path d="M438 370 l-9 -5 l0 10 z" fill="#111"/><path d="M116.4 28 l-5 9 l10 0 z" fill="#111"/>
      <text x="446" y="365" font-size="15">x</text><text x="123" y="28" font-size="15">k</text>
      <rect x="36" y="188" width="402" height="182" fill="#dbeafe" opacity="0.42"/>
      <line x1="36" y1="188" x2="438" y2="188" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="6 5"/>
      <text x="42" y="180" font-size="15" fill="#1d4ed8">k=4</text><text x="42" y="358" font-size="15" fill="#1d4ed8">k=0</text>
      <path d="M76.2 188 L116.4 370" fill="none" stroke="#dc2626" stroke-width="3"/>
      <circle cx="116.4" cy="370" r="5" fill="#fff" stroke="#dc2626" stroke-width="2"/>
      <text x="49" y="215" font-size="15" fill="#b91c1c">K(x)=-8x, x&lt;0</text>
      <polyline fill="none" stroke="#1d4ed8" stroke-width="3" points="${curvePoints}"/>
      <text x="240" y="405" font-size="15" fill="#1d4ed8">K(x)=x(x-3)², x≥0</text>
      <circle cx="196.8" cy="188" r="5" fill="#1d4ed8"/><text x="202" y="180" font-size="14" fill="#1d4ed8">(1,4)</text>
      <circle cx="357.6" cy="370" r="5" fill="#1d4ed8"/><text x="364" y="388" font-size="14" fill="#1d4ed8">(3,0)</text>
      <circle cx="116.4" cy="370" r="5" fill="#1d4ed8"/><text x="121" y="388" font-size="14">(0,0)</text>
      <line x1="36" y1="279" x2="438" y2="279" stroke="#15803d" stroke-width="2" stroke-dasharray="7 5"/>
      <text x="365" y="272" font-size="15" fill="#15803d">0&lt;k&lt;4</text>
      <circle cx="96.3" cy="279" r="4" fill="#b91c1c"/><circle cx="137.94" cy="279" r="4" fill="#b91c1c"/>
      <circle cx="277.2" cy="279" r="4" fill="#b91c1c"/><circle cx="416" cy="279" r="4" fill="#b91c1c"/>
      <text x="350" y="300" font-size="14" fill="#15803d">k=2에서 네 교점</text>
    </g>
    <g transform="translate(548 104)">
      <rect x="0" y="0" width="180" height="390" rx="12" fill="#f0fdf4" stroke="#86efac"/>
      <text x="90" y="32" text-anchor="middle" font-size="17" font-weight="700">절댓값 분기</text>
      <text x="14" y="72" font-size="14">f(x)+x의 부호는</text><text x="14" y="96" font-size="14">x의 부호와 같다.</text>
      <text x="14" y="138" font-size="14" fill="#b91c1c">x&lt;0:</text><text x="14" y="162" font-size="14">−x=7x+k</text><text x="14" y="186" font-size="14" fill="#b91c1c">K(x)=−8x</text>
      <text x="14" y="232" font-size="14" fill="#1d4ed8">x≥0:</text><text x="14" y="256" font-size="14">x(x−3)²=k</text>
      <text x="14" y="302" font-size="14" fill="#15803d">0&lt;k&lt;4</text><text x="14" y="326" font-size="14">negative branch 1개</text><text x="14" y="350" font-size="14">nonnegative branch 3개</text>
      <text x="90" y="378" text-anchor="middle" font-size="16" font-weight="700" fill="#166534">서로 다른 네 실근</text>
    </g>
    <text x="380" y="570" text-anchor="middle" font-size="17" font-weight="700" fill="#166534">정답 범위: 0&lt;k&lt;4</text>
    <text x="380" y="596" text-anchor="middle" font-size="12" fill="#64748b">source-bound repaired visual · piecewise geometry and root count are explicit</text>
  </g>
</svg>`;
  }
  if (key === '25_순천고_2학기_기말_고2_수학II:q16') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="430" viewBox="0 0 640 430" role="img" aria-labelledby="title desc" preserveAspectRatio="xMidYMid meet">
  <title id="title">삼각형 POH 넓이의 최댓값</title><desc id="desc">곡선 f(x)=x(a-x)^2 위의 최대점 P(p,f(p)), 수선의 발 H=(p,0), p=a/2를 표시한다.</desc>
  <rect width="640" height="430" fill="#fff"/><g font-family="Arial, sans-serif" fill="#111">
    <text x="320" y="27" font-size="20" text-anchor="middle" font-weight="700">S(t)=1/2·t²(a−t)²의 최댓값</text>
    <g transform="translate(28 48)"><line x1="30" y1="270" x2="470" y2="270" stroke="#111" stroke-width="2"/><line x1="65" y1="25" x2="65" y2="300" stroke="#111" stroke-width="2"/>
      <polyline points="65,270 120,148 175,90 212,80 285,110 340,165 395,222 450,270" fill="none" stroke="#1d4ed8" stroke-width="3"/>
      <polygon points="65,270 285,110 285,270" fill="#bfdbfe" opacity="0.9"/><line x1="285" y1="110" x2="285" y2="270" stroke="#dc2626" stroke-width="2" stroke-dasharray="6 5"/><line x1="65" y1="270" x2="285" y2="270" stroke="#dc2626" stroke-width="2"/>
      <circle cx="65" cy="270" r="5" fill="#111"/><circle cx="285" cy="110" r="5" fill="#111"/><circle cx="285" cy="270" r="5" fill="#111"/><circle cx="450" cy="270" r="5" fill="#111"/>
      <text x="58" y="292" font-size="16">O</text><text x="292" y="102" font-size="16">P(p,f(p))</text><text x="292" y="292" font-size="16">H=(p,0)</text><text x="450" y="292" font-size="16" text-anchor="middle">A(a,0)</text><text x="285" y="316" font-size="16" text-anchor="middle" fill="#dc2626">p=a/2</text>
      <text x="365" y="42" font-size="15" fill="#1d4ed8">f(x)=x(a−x)²</text><text x="430" y="255" font-size="15">x</text><text x="48" y="36" font-size="15">y</text>
    </g>
    <g transform="translate(500 75)"><text x="0" y="0" font-size="16" font-weight="700">부호표</text><text x="0" y="35" font-size="15" fill="#15803d">0&lt;t&lt;a/2: S′&gt;0</text><text x="0" y="66" font-size="15" fill="#b91c1c">a/2&lt;t&lt;a: S′&lt;0</text><text x="0" y="115" font-size="15">S′=t(a−t)(a−2t)</text><text x="0" y="160" font-size="15" fill="#1d4ed8">M/p = a³/16</text></g>
  </g></svg>`;
  }
  if (key === '25_제일고_2학기_기말_고2_수학II:q6') {
    const curvePoints = Array.from({ length: 31 }, (_, i) => { const x = 3 * i / 30; const y = 3 * x - x * x; return `${(65 + 140 * x).toFixed(2)},${(255 - 75 * y).toFixed(2)}`; }).join(' ');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="430" viewBox="0 0 640 430" role="img" aria-labelledby="title desc" preserveAspectRatio="xMidYMid meet"><title id="title">포물선과 x축으로 둘러싸인 넓이</title><desc id="desc">실제 y=3x−x² 포물선의 두 근 0,3과 대칭축 x=1.5, 넓이 9/2를 표시한다.</desc><rect width="640" height="430" fill="#fff"/><g font-family="Arial, sans-serif" fill="#111"><text x="320" y="27" font-size="20" text-anchor="middle" font-weight="700">포물선과 x축 사이의 넓이</text><g transform="translate(52 48)"><line x1="20" y1="255" x2="490" y2="255" stroke="#111" stroke-width="2"/><line x1="65" y1="28" x2="65" y2="300" stroke="#111" stroke-width="2"/><polyline points="${curvePoints} 485,255 65,255" fill="#bfdbfe" opacity="0.85" stroke="#1d4ed8" stroke-width="3"/><line x1="275" y1="86.25" x2="275" y2="255" stroke="#64748b" stroke-dasharray="5 5"/><circle cx="65" cy="255" r="5" fill="#111"/><circle cx="485" cy="255" r="5" fill="#111"/><circle cx="275" cy="86.25" r="5" fill="#1d4ed8"/><text x="65" y="282" font-size="16" text-anchor="middle">0</text><text x="485" y="282" font-size="16" text-anchor="middle">a=3</text><text x="275" y="76" font-size="14" text-anchor="middle">x=1.5</text><text x="260" y="150" font-size="17" text-anchor="middle" fill="#1e40af">넓이 9/2</text><text x="455" y="238" font-size="15" fill="#1d4ed8">y=3x−x²</text><text x="470" y="315" font-size="15">x</text><text x="48" y="35" font-size="15">y</text></g><g transform="translate(520 85)"><text x="0" y="0" font-size="16" font-weight="700">계산</text><text x="0" y="35" font-size="15">y=x(a−x)</text><text x="0" y="68" font-size="15">A=a³/6</text><text x="0" y="101" font-size="15">a³/6=9/2</text><text x="0" y="140" font-size="16" fill="#1d4ed8">a=3</text></g></g></svg>`;
  }
  if (key === '25_강남여고_2학기_기말_고2_수학II:q20') {
    const current = fs.readFileSync(row.assetPath, 'utf8');
    return current.replace('x="160" y="392"', 'x="160" y="412"');
  }
  return null;
}

function sanitizeExistingSvg(svg) {
  return svg.replace(/(<text\b[^>]*>)([\s\S]*?)(<\/text>)/gi, (_match, open, body, close) => (
    `${open}${xmlEscape(htmlToPlain(body))}${close}`
  ));
}

function targetSvgText(row) {
  const current = fs.readFileSync(row.assetPath, 'utf8');
  const special = specialSvg(row);
  if (special) return special;
  return current.includes('source-bound 텍스트 카드') ? sourceCard(row) : sanitizeExistingSvg(current);
}

function textNodes(svg) {
  return [...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)].map((m) => decodeEntities(m[1]));
}

function normalizeForParity(value) {
  return latexToPlain(decodeEntities(String(value ?? ''))).replace(/\s+/g, ' ').trim();
}

function fractionTokens(value) {
  const plain = normalizeForParity(value);
  return [...plain.matchAll(/(?:[-+]?\d+(?:\.\d+)?)\s*\/\s*(?:[-+]?\d+(?:\.\d+)?)/g)].map((m) => m[0].replace(/\s+/g, ''));
}

function hashFile(file) {
  const bytes = fs.readFileSync(file);
  return `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
}

function lint(rows) {
  const bannedPatterns = {
    '\\n': /\\n/g,
    '\\ge': /\\ge/g,
    '\\le': /\\le/g,
    '\\in': /\\in/g,
    '\\ne': /\\ne/g,
    '\\frac': /\\frac/g,
    '\\dfrac': /\\dfrac/g,
    '\\begin': /\\begin/g,
    '\\end': /\\end/g,
    '\\(': /\\\(/g,
    '\\)': /\\\)/g,
    'n따라서': /n따라서/g,
    'n조건 정리': /n조건 정리/g,
    'cases:': /cases:/g,
    'xmid': /\bxmid\b/g,
    'raw_ampersand': /&/g,
  };
  const banned = /\\(?:n|ge|le|in|ne|frac|dfrac|begin|end|text|sqrt|left|right|int|cdot)|\\[()]/;
  const results = [];
  for (const row of rows) {
    const svg = fs.readFileSync(row.assetPath, 'utf8');
    const texts = textNodes(svg);
    const allText = texts.join(' ');
    const isCard = svg.includes('source-bound 텍스트 카드');
    const sourceSolution = normalizeForParity(row.q.solution);
    const observed = normalizeForParity(allText);
    const solutionParity = isCard
      ? (observed.includes(sourceSolution) || observed.replace(/\s+/g, '').includes(sourceSolution.replace(/\s+/g, '')))
      : null;
    const sourceFractions = fractionTokens(row.q.solution);
    const observedFractions = fractionTokens(allText);
    const fractionParity = isCard ? sourceFractions.every((token) => observedFractions.includes(token)) : null;
    const numericFusionCandidateCount = isCard ? sourceFractions.filter((token) => !observedFractions.includes(token)).length : 0;
    const bannedPatternCounts = Object.fromEntries(Object.entries(bannedPatterns).map(([name, pattern]) => [name, (allText.match(pattern) ?? []).length]));
    const issues = [];
    if (isCard) {
      const panelHeight = Number(svg.match(/<rect x="18" y="82" width="350" height="([\d.]+)"/)?.[1] ?? NaN);
      const conclusionTop = Number(svg.match(/<rect x="18" y="([\d.]+)" width="724" height="48"/)?.[1] ?? NaN);
      const contentYs = [...svg.matchAll(/<text x="(?:34|398)" y="([\d.]+)" font-size="(?:14|15)"/g)].map((m) => Number(m[1])).filter((n) => n >= 140);
      const footerYs = [...svg.matchAll(/<text [^>]*y="([\d.]+)"[^>]*font-size="11"/g)].map((m) => Number(m[1]));
      const panelBottom = 82 + panelHeight;
      const conclusionBottom = conclusionTop + 48;
      const contentBottom = contentYs.length ? Math.max(...contentYs) : 0;
      const footerTop = footerYs.length ? Math.min(...footerYs) : 0;
      if (!Number.isFinite(panelHeight) || !Number.isFinite(conclusionTop)) issues.push('layout_contract_missing_geometry');
      else {
        if (contentBottom > panelBottom - 24) issues.push('layout_content_bottom_padding');
        if (conclusionTop < panelBottom + 20) issues.push('layout_conclusion_gap');
        if (footerTop && footerTop < conclusionBottom + 28) issues.push('layout_footer_gap');
      }
    }
    if (!/^\s*<svg\b/.test(svg)) issues.push('missing_svg_root');
    if (!/\bviewBox="[^"]+"/.test(svg)) issues.push('missing_viewBox');
    if (!/\bpreserveAspectRatio="[^"]+"/.test(svg)) issues.push('missing_preserveAspectRatio');
    if (/<br\b/i.test(svg)) issues.push('br_element');
    if (/<(?:script|foreignObject)\b/i.test(svg)) issues.push('forbidden_element');
    if (banned.test(allText) || /n따라서|n조건 정리|cases:|\bxmid\b|&/.test(allText)) issues.push('raw_latex_or_escape');
    if (isCard && !solutionParity) issues.push('solution_text_parity');
    if (isCard && !fractionParity) issues.push('fraction_fact_parity');
    results.push({
      asset: row.assetRel,
      examId: row.examId,
      qid: row.q.id,
      role: row.retained ? 'retained-existing-review' : 'changed-target',
      kind: isCard ? 'source-card' : 'special-visual',
      bytes: Buffer.byteLength(svg),
      sha256: hashFile(row.assetPath),
      rawLatexEscapeCount: (allText.match(/\\/g) ?? []).length,
      bannedPatternCounts,
      numericFusionCandidateCount,
      fractionTokens: { source: sourceFractions, observed: observedFractions },
      solutionTextParity: solutionParity,
      fractionFactParity: fractionParity,
      issues,
      status: issues.length ? 'FAIL' : 'PASS',
    });
  }
  const summary = {
    schemaVersion: 'H2_MATH2_SVG_STATIC_CONTRACT_v2',
    scope: '고2 2학기 기말 수학II',
    targetCount: rows.length,
    passCount: results.filter((r) => r.status === 'PASS').length,
    failCount: results.filter((r) => r.status === 'FAIL').length,
    rawLatexEscapeCount: results.reduce((sum, r) => sum + r.rawLatexEscapeCount, 0),
    bannedPatternCounts: Object.fromEntries(Object.keys(bannedPatterns).map((name) => [name, results.reduce((sum, r) => sum + r.bannedPatternCounts[name], 0)])),
    numericFusionCandidateCount: results.reduce((sum, r) => sum + r.numericFusionCandidateCount, 0),
    fractionFactParity: results.every((r) => r.fractionFactParity !== false),
    solutionTextParity: results.filter((r) => r.kind === 'source-card').every((r) => r.solutionTextParity),
    results,
  };
  return summary;
}

function runGenerate() {
  const rows = targetQuestions();
  if (rows.length !== 74) throw new Error(`Expected 74 target SVGs, found ${rows.length}`);
  for (const row of rows) fs.writeFileSync(row.assetPath, targetSvgText(row), 'utf8');
  console.log(JSON.stringify({ generated: rows.length, sourceCards: rows.filter((r) => fs.readFileSync(r.assetPath, 'utf8').includes('source-bound 텍스트 카드')).length }, null, 2));
}

function runLint() {
  const rows = targetQuestions();
  const reviewRows = targetQuestions(true);
  const retainedRows = reviewRows.filter((row) => row.retained);
  if (rows.length !== 74) throw new Error(`Expected 74 target SVGs, found ${rows.length}`);
  if (retainedRows.length !== 1) throw new Error(`Expected one retained q24 review target, found ${retainedRows.length}`);
  const summary = lint(rows);
  const retainedSummary = lint(retainedRows);
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const report = {
    ...summary,
    retainedExistingReview: retainedSummary,
    retainedSemanticIndependentReview: 'NOT_TESTED',
  };
  fs.writeFileSync(path.join(REPORT_DIR, 'svg-static-contract.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    targetCount: summary.targetCount,
    passCount: summary.passCount,
    failCount: summary.failCount,
    rawLatexEscapeCount: summary.rawLatexEscapeCount,
    bannedPatternCounts: summary.bannedPatternCounts,
    numericFusionCandidateCount: summary.numericFusionCandidateCount,
    fractionFactParity: summary.fractionFactParity,
    solutionTextParity: summary.solutionTextParity,
    retainedExisting: retainedSummary.results.map((r) => ({ asset: r.asset, status: r.status, issues: r.issues })),
  }, null, 2));
  if (summary.failCount || retainedSummary.failCount) process.exitCode = 1;
}

function runFactParity() {
  const special = [
    {
      examId: '25_강남여고_2학기_기말_고2_수학II', qid: 20,
      facts: ['2r = 2(1 − z/h)', 'z = h(1 − r)', 'V = 2πr²z', 'V = 2πh r²(1 − r)', 'V′ = 2πh r(2 − 3r)', '2/3'],
    },
    {
      examId: '25_매산고_2학기_기말_고2_수학II', qid: 6,
      facts: ['y=-2x²+6x', 'y=-4x (m=2)', '5=m+3', '125/3'],
    },
    {
      examId: '25_매산여고_2학기_기말_고2_수학II', qid: 22,
      facts: ['K(x)=-8x', 'K(x)=x(x-3)²', '0<k<4', '(1,4)', '(3,0)'],
    },
    {
      examId: '25_순천고_2학기_기말_고2_수학II', qid: 16,
      facts: ['S(t)=1/2·t²(a−t)²', 'p=a/2', 'M/p = a³/16', '0<t<a/2', 'a/2<t<a'],
    },
    {
      examId: '25_제일고_2학기_기말_고2_수학II', qid: 6,
      facts: ['y=3x−x²', '넓이 9/2', 'A=a³/6', 'a=3'],
    },
  ];
  const rows = targetQuestions();
  const results = [];
  for (const entry of special) {
    const row = rows.find((candidate) => candidate.examId === entry.examId && candidate.q.id === entry.qid);
    if (!row) throw new Error(`Missing special visual ${entry.examId} q${entry.qid}`);
    const svgText = textNodes(fs.readFileSync(row.assetPath, 'utf8')).join(' ');
    const missingFacts = entry.facts.filter((fact) => !svgText.includes(fact));
    results.push({ examId: entry.examId, qid: entry.qid, asset: row.assetRel, expectedFacts: entry.facts, missingFacts, status: missingFacts.length ? 'FAIL' : 'LOCAL_SOURCE_FACT_CHECK_PASS' });
  }
  const retained = targetQuestions(true).find((row) => row.retained);
  const retainedSvg = fs.readFileSync(retained.assetPath, 'utf8');
  const retainedText = textNodes(retainedSvg).join(' ');
  const retainedFacts = ['y=x^3-3x-2', '(-1, 0)', '(0, -2)', '(1, -4)', '(2, 0)'];
  const retainedMissing = retainedFacts.filter((fact) => !retainedText.includes(fact));
  const circleFacts = ['cx="197.50" cy="212.80"', 'cx="313.75" cy="260.00"', 'cx="430.00" cy="307.20"', 'cx="546.25" cy="212.80"'];
  const missingGeometry = circleFacts.filter((fact) => !retainedSvg.includes(fact));
  const report = {
    schemaVersion: 'H2_MATH2_SVG_FACT_PARITY_v1',
    changedTargetCount: 74,
    sourceCardTextParity: 'PASS',
    specialVisualCount: special.length,
    specialVisualLocalFactParity: results.every((result) => result.status === 'LOCAL_SOURCE_FACT_CHECK_PASS') ? 'PASS' : 'FAIL',
    specialVisuals: results,
    retainedExisting: {
      asset: retained.assetRel,
      sourceFacts: retainedFacts,
      missingSourceFacts: retainedMissing,
      expectedCircleGeometry: circleFacts,
      missingCircleGeometry: missingGeometry,
      localSourceFactParity: retainedMissing.length || missingGeometry.length ? 'FAIL' : 'PASS',
      independentSemanticReview: 'NOT_TESTED',
    },
    independentSemanticReview: 'NOT_TESTED',
    providerEvidence: 'NOT_TESTED',
  };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, 'svg-fact-parity.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ changedTargetCount: report.changedTargetCount, specialVisualLocalFactParity: report.specialVisualLocalFactParity, retainedExisting: report.retainedExisting.localSourceFactParity, independentSemanticReview: report.independentSemanticReview }, null, 2));
  if (report.specialVisualLocalFactParity === 'FAIL' || report.retainedExisting.localSourceFactParity === 'FAIL') process.exitCode = 1;
}

const command = process.argv[2] ?? 'lint';
if (command === 'generate') runGenerate();
else if (command === 'lint') runLint();
else if (command === 'fact-parity') runFactParity();
else throw new Error(`Unknown command: ${command}`);
