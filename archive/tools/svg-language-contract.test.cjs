const test = require('node:test');
const assert = require('node:assert/strict');
const { validateSvgStudentLanguage, assertSvgStudentLanguage, hasHiddenInternalText } = require('./svg-language-contract.cjs');

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

test('student SVG language contract counts only real id attributes, not data-*-id look-alikes', () => {
  const lookAlikes = validateSvgStudentLanguage(svg('<g id="region-S1" data-mark-id="region-S1"/><g id="p1" data-point-id="p1" data-owner-id="p1" data-id="p1"/>'));
  assert.ok(!lookAlikes.errors.some(error => error.code === 'SVG_ACCESSIBILITY_DUPLICATE_ID'), JSON.stringify(lookAlikes.errors));
  const sameIdTwice = validateSvgStudentLanguage(svg('<g id="a"/><g data-mark-id="a"/><g\n  id = \'a\'/>'));
  assert.ok(sameIdTwice.errors.some(error => error.code === 'SVG_ACCESSIBILITY_DUPLICATE_ID'));
  const duplicateWithLookAlike = validateSvgStudentLanguage(svg('<g id="same" data-mark-id="x"/><g data-mark-id="y" id="same"/>'));
  assert.ok(duplicateWithLookAlike.errors.some(error => error.code === 'SVG_ACCESSIBILITY_DUPLICATE_ID'));
});

test('advisory mode lists description-quality findings without blocking, and still throws real defects', () => {
  const generic = svg('', '원과 중심', '그림입니다. 이것을 나타낸 그림입니다.');
  assert.throws(() => assertSvgStudentLanguage(generic, { assetRef: 'a.svg' }), /DESCRIPTION_NOT_SUBSTANTIVE/);
  const advisory = [];
  const result = assertSvgStudentLanguage(generic, { assetRef: 'a.svg', advisory });
  assert.equal(result.status, 'PASS');
  assert.ok(advisory.some(row => row.assetRef === 'a.svg' && row.code === 'SVG_ACCESSIBILITY_DESCRIPTION_NOT_SUBSTANTIVE'));
  // 옛 그림의 접근성 표기 누락(참조 깨짐)은 막지 않고 목록으로만 남긴다. 새 엔진 그림(data-engine-version)은 계속 막는다.
  const broken = svg('', '두 원의 교점', '그림입니다.', 'role="img" aria-labelledby="missing desc"');
  const legacyList = [];
  assert.equal(assertSvgStudentLanguage(broken, { assetRef: 'b.svg', advisory: legacyList }).status, 'PASS');
  assert.ok(legacyList.some(row => row.code === 'SVG_ACCESSIBILITY_ARIA_REFERENCE_INVALID'));
  const engineBroken = svg('', '두 원의 교점', '그림입니다.', 'data-engine-version="geometry-visual-v1" role="img" aria-labelledby="missing desc"');
  assert.throws(() => assertSvgStudentLanguage(engineBroken, { assetRef: 'b.svg', advisory: [] }), /ARIA_REFERENCE_INVALID/);
  assert.throws(() => assertSvgStudentLanguage('<svg xmlns="http://www.w3.org/2000/svg" data-engine-version="geometry-visual-v1"/>', { advisory: [] }), /TITLE_DESC_REQUIRED/);
  // 엔진 표지: 확정 표지(stat-chart 등)는 언제나, 신규 경로 표지(composite 등)는 새 파일(options.newPath)일 때만 엔진 산출물로 본다.
  const noMarkup = marker => `<svg xmlns="http://www.w3.org/2000/svg" ${marker}><circle r="5"/></svg>`;
  for (const marker of ['data-stat-chart="stat-chart-figure-v1"', 'data-set-diagram="set-diagram-figure-v1"', 'data-publication-profile="geometry-publication-v1"']) {
    assert.throws(() => assertSvgStudentLanguage(noMarkup(marker), { assetRef: 'm.svg', advisory: [] }), /TITLE_DESC_REQUIRED/, marker);
  }
  for (const marker of ['data-composite="composite-panels-v1"', 'data-ellipse-figure="ellipse-figure-v1"', 'data-lattice-path="lattice-path-figure-v1"', 'data-publication-profile="fragment-publication-spike-v1"']) {
    assert.equal(assertSvgStudentLanguage(noMarkup(marker), { assetRef: 'old.svg', advisory: [] }).status, 'PASS', marker + ' on an existing path is a legacy figure');
    assert.throws(() => assertSvgStudentLanguage(noMarkup(marker), { assetRef: 'new.svg', advisory: [], newPath: true }), /TITLE_DESC_REQUIRED/, marker + ' on a new file');
  }
  // "축척" 안내 문구: 옛 그림은 목록으로만, 엔진 표지가 있는 새 그림은 막는다. 영어 문구는 영어 코드로도 목록에 남는다.
  const scaleList = [];
  assert.equal(assertSvgStudentLanguage(svg('<text>좌표는 발문과 동일한 축척으로 표시</text>'), { assetRef: 'd.svg', advisory: scaleList }).status, 'PASS');
  assert.ok(scaleList.some(row => row.code === 'SVG_SCALE_GUIDANCE_FORBIDDEN'));
  const englishScale = [];
  assertSvgStudentLanguage(svg('<text>Coordinates drawn to scale; dashed lines show construction.</text>'), { assetRef: 'd.svg', advisory: englishScale });
  assert.ok(englishScale.some(row => row.code === 'SVG_ENGLISH_STUDENT_TEXT_REQUIRES_REVIEW'));
  assert.throws(() => assertSvgStudentLanguage(svg('<text>좌표는 발문과 동일한 축척으로 표시</text>', undefined, undefined, 'data-engine-version="geometry-visual-v1" role="img" aria-labelledby="title desc"'), { assetRef: 'd.svg', advisory: [] }), /SCALE_GUIDANCE_FORBIDDEN/);
  assert.throws(() => assertSvgStudentLanguage(svg('<text>축척: x,y 동일 단위</text>'), { assetRef: 'd.svg' }), /SCALE_GUIDANCE_FORBIDDEN/);
  // 학생 눈에 보이는 결함(내부 문구), 가리키는 id의 중복, 루트 없음은 옛 그림도 막는다.
  // 겹치는 id를 모양이 가리키면(url(#id)·href="#id") 그림이 틀어질 수 있어 막는다. 아무도 가리키지 않는 id의 중복은 그림이 그대로라 목록으로만 남긴다.
  assert.throws(() => assertSvgStudentLanguage(svg('<linearGradient id="g"/><linearGradient id="g"/><rect fill="url(#g)"/>'), { assetRef: 'e.svg', advisory: [] }), /DUPLICATE_ID/);
  assert.throws(() => assertSvgStudentLanguage(svg('<g id="same"/><g id="same"/><use href="#same"/>'), { assetRef: 'e.svg', advisory: [] }), /DUPLICATE_ID/);
  assert.throws(() => assertSvgStudentLanguage(svg('<marker id="m"/><marker id="m"/><line marker-end="url( #m )"/>'), { assetRef: 'e.svg', advisory: [] }), /DUPLICATE_ID/);
  const decorationIds = [];
  const unreferenced = assertSvgStudentLanguage(svg('<circle id="point-A"/><circle id="point-A"/>'), { assetRef: 'e.svg', advisory: decorationIds });
  assert.equal(unreferenced.status, 'PASS');
  assert.deepEqual(decorationIds.map(row => row.code), ['SVG_ACCESSIBILITY_DUPLICATE_ID_UNREFERENCED']);
  // 엔진 그림도 가리키는 이가 없는 이름표 id 중복은 목록으로만 남지만, title/desc·aria가 가리키는 id의 중복은 계속 막는다.
  const engineRoot = 'data-engine-version="geometry-visual-v1" role="img" aria-labelledby="title desc"';
  const engineSvg = body => svg(body, undefined, undefined, engineRoot);
  assert.equal(assertSvgStudentLanguage(engineSvg('<circle id="point-A"/><circle id="point-A"/>'), { assetRef: 'e.svg', advisory: [] }).status, 'PASS');
  assert.throws(() => assertSvgStudentLanguage(engineSvg('<g id="desc"/>'), { assetRef: 'e.svg', advisory: [] }), /TITLE_DESC_ID_INVALID/);
  // 직접 호출(advisory 없음: 엔진·감사 모드)은 전과 같이 엄격하다.
  assert.throws(() => assertSvgStudentLanguage(svg('<g id="same"/><g id="same"/>'), { assetRef: 'e.svg' }), /DUPLICATE_ID/);
  assert.throws(() => assertSvgStudentLanguage('<g/>', { assetRef: 'c.svg', advisory: [] }), /SVG_ROOT_MISSING/);
});

test('internal terms in title, desc or aria-label do not block (listed), but internal terms in visible text still do, engine figures included', () => {
  const engineRoot = 'data-engine-version="geometry-visual-v1" role="img" aria-labelledby="title desc"';
  for (const root of [undefined, engineRoot]) {
    const advisory = [];
    const hidden = svg('<circle r="5"/>', '도형', '두 원 source 사이의 관계를 나타낸 그림', root);
    assert.equal(assertSvgStudentLanguage(hidden, { assetRef: 'h.svg', advisory }).status, 'PASS');
    assert.ok(advisory.some(row => row.code === 'SVG_INTERNAL_STUDENT_TEXT_FORBIDDEN' && row.surface === 'desc'), JSON.stringify(advisory));
    assert.equal(hasHiddenInternalText(hidden), true);
    const titleHidden = svg('', 'svg 도형', '두 원의 중심과 교점을 좌표평면에 나타낸 그림', root);
    assert.equal(assertSvgStudentLanguage(titleHidden, { assetRef: 'h.svg', advisory: [] }).status, 'PASS');
    // visible text keeps blocking
    assert.throws(() => assertSvgStudentLanguage(svg('<text>source</text>', undefined, undefined, root), { assetRef: 'v.svg', advisory: [] }), /INTERNAL_STUDENT_TEXT_FORBIDDEN:source@text/);
    // a visible <text> blocks even when the hidden desc is also flagged
    assert.throws(() => assertSvgStudentLanguage(svg('<text id="t1">debug</text>', '도형', '두 원 source 사이의 관계를 나타낸 그림', root), { assetRef: 'v.svg', advisory: [] }), /INTERNAL_STUDENT_TEXT_FORBIDDEN:debug@text#t1/);
  }
  // direct call without advisory (engine generation, audit) stays strict
  assert.throws(() => assertSvgStudentLanguage(svg('', '도형', '두 원 source 사이의 관계를 나타낸 그림'), { assetRef: 'h.svg' }), /INTERNAL_STUDENT_TEXT_FORBIDDEN:source@desc/);
});
