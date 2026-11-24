'use strict';
// 전체 SVG의 문구 품질 목록(수리 목록)을 파일 하나로 쓴다. 색인은 쓰지 않고, 차단하지 않고, 항상 성공으로 끝난다.
// 사용: node archive/tools/build-svg-accessibility-index.cjs --quality-report <out.tsv|out.json>
// 이유: 등록 실행의 advisory 출력은 바뀐 그림만, 앞 50개까지다. 수리 대상 전체(수천 개)를 일괄 수리에 넣을 수 있게 전체 목록을 따로 뽑는다.
const fs = require('node:fs');
const path = require('node:path');
const { validateSvgStudentLanguage, LEGACY_ACCESSIBILITY_CODES, isAdvisoryError, isEngineSvg, substituteAccessibilityText } = require('./svg-language-contract.cjs');
const { collectSvgAccessibilitySourceIndex } = require('./collect-svg-accessibility-source-index.cjs');

// 학생 눈에 보이는 글자 문제일 수 있는 코드를 맨 앞에 둔다.
const PRIORITY = [
  'SVG_ENGLISH_STUDENT_TEXT_REQUIRES_REVIEW',
  'SVG_MATH_MARKUP_ACCESSIBILITY_REQUIRES_REVIEW',
  'SVG_ACCESSIBILITY_KOREAN_MEANING_REQUIRED',
  'SVG_ACCESSIBILITY_DESCRIPTION_NOT_SUBSTANTIVE'
];

function walkSvgs(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkSvgs(full, out);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.svg')) out.push(full);
  }
  return out;
}

const decode = value => String(value ?? '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
function tagText(source, tag) {
  const match = source.match(new RegExp('<(?:[a-z_][\\w.-]*:)?' + tag + '\\b[^>]*>([\\s\\S]*?)</(?:[a-z_][\\w.-]*:)?' + tag + '\\s*>', 'i'));
  return match ? decode(match[1]).replace(/\s+/g, ' ').trim() : '';
}
const rank = codes => {
  const indexes = codes.map(code => PRIORITY.indexOf(code)).filter(index => index >= 0);
  return indexes.length ? Math.min(...indexes) : PRIORITY.length;
};

function collectQualityRows({ repoRoot, uses } = {}) {
  repoRoot = path.resolve(repoRoot || path.resolve(__dirname, '../..'));
  const assetsDir = path.join(repoRoot, 'archive', 'assets');
  const usesByAsset = new Map();
  const index = uses || collectSvgAccessibilitySourceIndex({ repoRoot, failOnParseError: false });
  for (const entry of index.uses || []) usesByAsset.set(entry.assetRef, entry.uses || []);
  const rows = [];
  let scanned = 0;
  for (const file of walkSvgs(assetsDir)) {
    scanned += 1;
    const assetRef = path.relative(path.join(repoRoot, 'archive'), file).split(path.sep).join('/');
    const source = fs.readFileSync(file, 'utf8');
    const result = validateSvgStudentLanguage(source, { assetRef });
    if (result.status === 'PASS') continue;
    const codes = [...new Set(result.errors.map(error => error.code))];
    // 등록기가 막는 것(defect)과 목록으로만 남기는 것(quality, legacy-a11y)을 같은 기준으로 가른다.
    const engine = isEngineSvg(source);
    const blocking = result.errors.filter(error => !isAdvisoryError(error, !engine));
    const found = usesByAsset.get(assetRef) || [];
    rows.push({
      assetRef,
      kind: blocking.length ? 'defect' : codes.some(code => LEGACY_ACCESSIBILITY_CODES.has(code)) ? 'legacy-a11y' : 'quality',
      engine,
      codes,
      exams: [...new Set(found.map(use => use.sourceExamRef))].sort(),
      questions: [...new Set(found.map(use => `${use.sourceExamRef}#${use.sourceQid}`))].sort(),
      roles: [...new Set(found.map(use => use.visualRole))].sort(),
      title: tagText(source, 'title'),
      desc: tagText(source, 'desc'),
      // title/desc가 없는 옛 그림에 색인이 넣을 기계 대체 문구(시험지·문항·역할만 씀)
      substituteText: !engine && codes.includes('SVG_ACCESSIBILITY_TITLE_DESC_REQUIRED') && found.length ? found.map(substituteAccessibilityText).join(' | ') : ''
    });
  }
  rows.sort((a, b) => rank(a.codes) - rank(b.codes) || (a.assetRef < b.assetRef ? -1 : a.assetRef > b.assetRef ? 1 : 0));
  return { rows, scanned };
}

function writeQualityReport({ repoRoot, outPath, uses } = {}) {
  const started = Date.now();
  const { rows, scanned } = collectQualityRows({ repoRoot, uses });
  const counts = {};
  for (const row of rows) for (const code of row.codes) counts[code] = (counts[code] || 0) + 1;
  fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
  if (/\.json$/i.test(outPath)) {
    fs.writeFileSync(outPath, JSON.stringify({ scanned, flagged: rows.length, countsByCode: counts, rows }, null, 2) + '\n');
  } else {
    const cell = value => String(value ?? '').replace(/[\t\r\n]+/g, ' ');
    const header = ['assetRef', 'kind', 'codes', 'role', 'exams', 'questions', 'title', 'desc', 'substituteText'];
    const lines = [header.join('\t'), ...rows.map(row => [row.assetRef, row.kind, row.codes.join(','), row.roles.join(','),
      row.exams.join(';'), row.questions.join(';'), row.title, row.desc, row.substituteText].map(cell).join('\t'))];
    fs.writeFileSync(outPath, lines.join('\n') + '\n');
  }
  return { scanned, flagged: rows.length, countsByCode: counts, elapsedMs: Date.now() - started, outPath };
}

module.exports = { collectQualityRows, writeQualityReport, PRIORITY };
