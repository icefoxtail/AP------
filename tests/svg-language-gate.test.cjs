const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { compileManifest, gitBlobSha } = require('../archive/tools/build-svg-accessibility-index.cjs');

function compileFixture(t, svg, metadata = {}) {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'svg-language-gate-'));
  t.after(() => fs.rmSync(repoRoot, { recursive: true, force: true }));
  const assetRef = 'assets/images/language-gate.svg';
  const assetPath = path.join(repoRoot, 'archive', assetRef);
  const manifestPath = path.join(repoRoot, 'archive', 'data', 'svg-accessibility-manifest.v1.json');
  const sourceIndexPath = path.join(repoRoot, 'archive', 'analysis', 'svg-language-cleanup-20261014', 'stage3-source-index.json');
  const outputPath = path.join(repoRoot, 'archive', 'data', 'svg-accessibility-index.js');
  fs.mkdirSync(path.dirname(assetPath), { recursive: true });
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.mkdirSync(path.dirname(sourceIndexPath), { recursive: true });
  const bytes = Buffer.from(svg, 'utf8');
  fs.writeFileSync(assetPath, bytes);
  const titleKo = metadata.titleKo || '두 원의 교점';
  const descriptionKo = metadata.descriptionKo || '두 원의 중심과 교점을 좌표평면에 나타낸 그림';
  const record = {
    assetRef,
    svgSha256: `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`,
    gitBlobSha: gitBlobSha(bytes),
    visualRole: 'solution',
    titleKo,
    descriptionKo,
    sourceExamRef: 'archive/exams/sample.js',
    sourceQid: 'q1',
    provenanceStatus: 'SOURCE_BOUND',
    answerHintFree: false,
  };
  fs.writeFileSync(manifestPath, JSON.stringify({ schemaVersion: 'SVG_STUDENT_ACCESSIBILITY_V1', recordCount: 1, records: [record] }));
  fs.writeFileSync(sourceIndexPath, JSON.stringify({
    schemaVersion: 'SVG_LANGUAGE_STAGE3_SOURCE_INDEX_V1',
    uses: [{ assetRef, uses: [{ visualRole: 'solution', sourceExamRef: record.sourceExamRef, sourceQid: record.sourceQid }] }],
  }));
  return compileManifest({ repoRoot, manifestPath, sourceIndexPath, outputPath });
}

function accessibleSvg(body = '', title = '두 원의 교점', description = '두 원의 중심과 교점을 좌표평면에 나타낸 그림', rootAttrs = 'role="img" aria-labelledby="title desc"') {
  return `<svg xmlns="http://www.w3.org/2000/svg" ${rootAttrs}><title id="title">${title}</title><desc id="desc">${description}</desc>${body}</svg>\n`;
}

test('manifest release gate rejects unknown English prose mixed with Korean accessibility text', t => {
  const svg = accessibleSvg('', '두 원의 교점', '두 원 사이의 reconstruct the orbit 관계를 나타낸 그림');
  assert.throws(
    () => compileFixture(t, svg, { descriptionKo: '두 원 사이의 reconstruct the orbit 관계를 나타낸 그림' }),
    /SVG_ENGLISH_STUDENT_TEXT_REQUIRES_REVIEW/
  );
});

test('manifest release gate rejects English prose in visible SVG labels', t => {
  const svg = accessibleSvg('<text>negative branch</text>');
  assert.throws(() => compileFixture(t, svg), /SVG_ENGLISH_STUDENT_TEXT_REQUIRES_REVIEW/);
});

test('manifest release gate permits standard function, point-label, and unit notation', t => {
  const svg = accessibleSvg('<text>sin(A), max/min, AB=3 cm</text>');
  const result = compileFixture(t, svg);
  assert.equal(result.recordCount, 1);
  assert.match(result.outputPath, /svg-accessibility-index\.js$/);
});

test('manifest release gate accepts the frozen Korean proportional-geometry explanation as substantive', t => {
  const title = '평행선으로 생긴 닮은 삼각형의 변의 길이';
  const description = 'DE∥BC이므로 △ADF∼△ABG이고 16:24=24:AB에서 AB=36, x=DB=12이다. △AFE∼△AGC에서 12:y=2:3이므로 y=18, 따라서 y−x=6이다.';
  const result = compileFixture(t, accessibleSvg('', title, description), { titleKo: title, descriptionKo: description });
  assert.equal(result.recordCount, 1);
});

test('manifest release gate accepts complete Korean function-value and range reasoning as substantive', t => {
  const title = '절댓값 삼각함수의 함수값 범위';
  const description = 'f(x)=|6sin2x+3|이며 f(t)=4를 만족하는 범위는 3<t<9이다.';
  const result = compileFixture(t, accessibleSvg('', title, description), { titleKo: title, descriptionKo: description });
  assert.equal(result.recordCount, 1);
});

test('manifest release gate preserves escaped inequality symbols in a Korean trigonometric interval explanation', t => {
  const title = '삼각부등식의 공통해 구간';
  const description = '0≤x<2π에서 sin x>√2/2의 해는 π/4<x<3π/4이고 cos x<1/2의 해와 겹치는 공통 범위는 π/3<x<3π/4이다.';
  const encodedDescription = description.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const result = compileFixture(t, accessibleSvg('', title, encodedDescription), { titleKo: title, descriptionKo: description });
  assert.equal(result.recordCount, 1);
});

test('manifest release gate still rejects generic scaffold text without a concrete mathematical relation', t => {
  const title = '도형의 관계';
  const description = '문항의 핵심 관계를 표시한 도형';
  assert.throws(
    () => compileFixture(t, accessibleSvg('', title, description), { titleKo: title, descriptionKo: description }),
    /SVG_ACCESSIBILITY_DESCRIPTION_NOT_SUBSTANTIVE/
  );
});

test('manifest release gate rejects clipped mathematical reasoning without a completed Korean explanation', t => {
  const title = '평행선으로 생긴 닮은 삼각형의 변의 길이';
  const description = 'DE∥BC이므로 △ADF∼△ABG이고 16:24=24:AB에서';
  assert.throws(
    () => compileFixture(t, accessibleSvg('', title, description), { titleKo: title, descriptionKo: description }),
    /SVG_ACCESSIBILITY_DESCRIPTION_NOT_SUBSTANTIVE/
  );
});

test('manifest release gate rejects student-visible scale guidance', t => {
  const svg = accessibleSvg('<text>축척: x,y 동일 단위</text>');
  assert.throws(() => compileFixture(t, svg), /SVG_SCALE_GUIDANCE_FORBIDDEN/);
});

test('manifest release gate requires role img and valid title/description aria references', t => {
  const cases = [
    [accessibleSvg('', '두 원의 교점', '두 원의 중심과 교점을 좌표평면에 나타낸 그림', 'aria-labelledby="title desc"'), /SVG_ACCESSIBILITY_ROLE_IMG_REQUIRED/],
    [accessibleSvg('', '두 원의 교점', '두 원의 중심과 교점을 좌표평면에 나타낸 그림', 'role="img" aria-labelledby="missing desc"'), /SVG_ACCESSIBILITY_ARIA_REFERENCE_INVALID/],
    [accessibleSvg('', '두 원의 교점', '두 원의 중심과 교점을 좌표평면에 나타낸 그림', 'role="img" aria-labelledby="title title"'), /SVG_ACCESSIBILITY_ARIA_REFERENCE_INVALID/],
  ];
  for (const [svg, expectedError] of cases) {
    assert.throws(() => compileFixture(t, svg), expectedError);
  }
});
