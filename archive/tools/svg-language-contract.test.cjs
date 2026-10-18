const test = require('node:test');
const assert = require('node:assert/strict');
const { validateSvgStudentLanguage } = require('./svg-language-contract.cjs');

function svg(body = '', title = '두 원의 교점', description = '두 원의 중심과 교점을 좌표평면에 나타낸 그림', rootAttrs = 'role="img" aria-labelledby="title desc"') {
  return `<svg xmlns="http://www.w3.org/2000/svg" ${rootAttrs}><title id="title">${title}</title><desc id="desc">${description}</desc>${body}</svg>`;
}

test('student SVG language contract accepts standard functions, point labels and units', () => {
  const result = validateSvgStudentLanguage(svg('<text>sin(A), max/min, AB=3 cm, yz평면, Pmin</text>'));
  assert.equal(result.status, 'PASS', JSON.stringify(result.errors));
  const labels = validateSvgStudentLanguage(svg('<text>Apr Bpr Cp Tx Ty OCmax OCmin</text>'));
  assert.equal(labels.status, 'PASS', JSON.stringify(labels.errors));
  const compactEquation = validateSvgStudentLanguage(svg('<text>y=mx+5</text>'));
  assert.equal(compactEquation.status, 'PASS', JSON.stringify(compactEquation.errors));
  const implicitProducts = validateSvgStudentLanguage(svg('<text>cf(4)=9; ab≤10; af′(a)</text>'));
  assert.equal(implicitProducts.status, 'PASS', JSON.stringify(implicitProducts.errors));
  const curriculumTerms = validateSvgStudentLanguage(svg('<text>역함수와 공통접선의 증감표</text>'));
  assert.equal(curriculumTerms.status, 'PASS', JSON.stringify(curriculumTerms.errors));
});

test('student SVG language contract accepts namespace-prefixed nodes and separate description binding', () => {
  const namespaced = '<ns0:svg xmlns:ns0="http://www.w3.org/2000/svg" role="img" aria-labelledby="title" aria-describedby="desc"><ns0:title id="title">두 원의 교점</ns0:title><ns0:desc id="desc">두 원의 중심과 교점을 좌표평면에 나타낸 그림</ns0:desc><ns0:text>sin(A), AB=3 cm</ns0:text></ns0:svg>';
  const result = validateSvgStudentLanguage(namespaced);
  assert.equal(result.status, 'PASS', JSON.stringify(result.errors));
});

test('student SVG language contract ignores RDF title metadata when counting SVG title elements', () => {
  const source = svg('<metadata><dc:title xmlns:dc="http://purl.org/dc/elements/1.1/">Matplotlib chart</dc:title></metadata>');
  const result = validateSvgStudentLanguage(source);
  assert.equal(result.status, 'PASS', JSON.stringify(result.errors));
});

test('student SVG language contract preserves variable products, integral notation, and point/subscript identifiers', () => {
  const result = validateSvgStudentLanguage(svg('<text>f(x)=Ax^3+Bx^2+Cx+D; ab=uv; nm=3; ∫0^4 f(x)dx; Int0ˣ t(x-t)dt; dx[(x-2)f(x)]; 2x]{f(t)-|f(t)|}dt; 3](x-t)|x-t|dt에; Apr Bpr Cp Tx Ty OCmax OCmin xA yA xCD yCD</text>'));
  assert.equal(result.status, 'PASS', JSON.stringify(result.errors));
});

test('student SVG language gate separates raw TeX accessibility markup from English prose', () => {
  const mathMarkup = validateSvgStudentLanguage(svg('', '분수의 계산', String.raw`기울기는 \dfrac{1}{2}이고, 점은 A\rightarrow B로 이동한다.`));
  assert.ok(mathMarkup.errors.some(error => error.code === 'SVG_MATH_MARKUP_ACCESSIBILITY_REQUIRES_REVIEW' && error.token === 'dfrac'));
  assert.ok(mathMarkup.errors.some(error => error.code === 'SVG_MATH_MARKUP_ACCESSIBILITY_REQUIRES_REVIEW' && error.token === 'rightarrow'));
  const newlineEscape = validateSvgStudentLanguage(svg(String.raw`<text>조건 정리:\nAP=6</text>`));
  assert.equal(newlineEscape.status, 'PASS', JSON.stringify(newlineEscape.errors));
});

test('student SVG language contract flags unknown English mixed into Korean accessibility prose', () => {
  const result = validateSvgStudentLanguage(svg('', '두 원의 교점', '두 원 사이의 reconstruct the orbit 관계를 나타낸 그림'));
  assert.ok(result.errors.some(error => error.code === 'SVG_ENGLISH_STUDENT_TEXT_REQUIRES_REVIEW' && error.token === 'reconstruct' && error.surface === 'desc'));
  assert.ok(result.errors.some(error => error.code === 'SVG_ENGLISH_STUDENT_TEXT_REQUIRES_REVIEW' && error.token === 'orbit' && error.text.includes('reconstruct the orbit')));
});

test('student SVG language contract flags English visible prose and generator markers', () => {
  const result = validateSvgStudentLanguage(svg('<text>negative branch</text><text>source-bound visual</text><text>inverse common tangent sign chart</text><text>By April</text>'));
  assert.ok(result.errors.some(error => error.code === 'SVG_ENGLISH_STUDENT_TEXT_REQUIRES_REVIEW' && error.token === 'branch'));
  assert.ok(result.errors.some(error => error.code === 'SVG_ENGLISH_STUDENT_TEXT_REQUIRES_REVIEW' && error.token === 'inverse'));
  assert.ok(result.errors.some(error => error.code === 'SVG_ENGLISH_STUDENT_TEXT_REQUIRES_REVIEW' && error.token === 'By'));
  assert.ok(result.errors.some(error => error.code === 'SVG_INTERNAL_STUDENT_TEXT_FORBIDDEN' && error.token === 'source'));
});

test('student SVG language contract rejects visible scale guidance without changing geometry checks', () => {
  const result = validateSvgStudentLanguage(svg('<text>축척: x,y 동일 단위</text>'));
  assert.ok(result.errors.some(error => error.code === 'SVG_SCALE_GUIDANCE_FORBIDDEN'));
  assert.equal(result.errors.some(error => error.code.startsWith('SVG_GEOMETRY_')), false);
});

test('student SVG language contract requires a named image with unique title and description references', () => {
  const noRole = validateSvgStudentLanguage(svg('', '두 원의 교점', '두 원의 중심과 교점을 좌표평면에 나타낸 그림', 'aria-labelledby="title desc"'));
  assert.ok(noRole.errors.some(error => error.code === 'SVG_ACCESSIBILITY_ROLE_IMG_REQUIRED'));
  const badRef = validateSvgStudentLanguage(svg('', '두 원의 교점', '두 원의 중심과 교점을 좌표평면에 나타낸 그림', 'role="img" aria-labelledby="missing desc"'));
  assert.ok(badRef.errors.some(error => error.code === 'SVG_ACCESSIBILITY_ARIA_REFERENCE_INVALID'));
});

test('student SVG language contract rejects Korean but generic descriptions', () => {
  const generic = validateSvgStudentLanguage(svg('', '원과 중심', '그림입니다. 이것을 나타낸 그림입니다.'));
  assert.ok(generic.errors.some(error => error.code === 'SVG_ACCESSIBILITY_DESCRIPTION_NOT_SUBSTANTIVE'));
  const specific = validateSvgStudentLanguage(svg('', '원과 중심', '중심에서 원 위 점까지의 거리가 같은 관계를 나타낸 그림'));
  assert.equal(specific.status, 'PASS', JSON.stringify(specific.errors));
  const specificDuplicate = validateSvgStudentLanguage(svg('', '유리함수의 중심과 두 점근선을 나타낸 해설 그래프', '유리함수의 중심과 두 점근선을 나타낸 해설 그래프'));
  assert.equal(specificDuplicate.status, 'PASS', JSON.stringify(specificDuplicate.errors));
  const venn = validateSvgStudentLanguage(svg('', '두 집합의 교집합', '50명에서 두 집합의 교집합 최댓값과 최솟값을 실제 벤 다이어그램 배치로 비교'));
  assert.equal(venn.status, 'PASS', JSON.stringify(venn.errors));
});

test('student SVG language contract rejects any duplicate ID and dangling nested accessible reference', () => {
  const duplicate = validateSvgStudentLanguage(svg('<g id="same"/><g id="same"/>'));
  assert.ok(duplicate.errors.some(error => error.code === 'SVG_ACCESSIBILITY_DUPLICATE_ID'));
  const danglingNestedRef = validateSvgStudentLanguage(svg('<g aria-labelledby="missing">원</g>'));
  assert.ok(danglingNestedRef.errors.some(error => error.code === 'SVG_ACCESSIBILITY_ARIA_REFERENCE_INVALID'));
});
