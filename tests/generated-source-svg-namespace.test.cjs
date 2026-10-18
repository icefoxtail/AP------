const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const text=fs.readFileSync(require('node:path').join(__dirname,'../archive/tools/generated-meta/rebuild-main-source-consumer.mjs'),'utf8');
const start=text.indexOf('function hasSvgDocumentRoot(svg){'),end=text.indexOf('\nconst issueFor=',start);
const valid=vm.runInNewContext('('+text.slice(start,end).trim()+')');
test('Source projection accepts both plain SVG and valid XML-prefixed SVG roots',()=>{
 assert.equal(valid('<svg xmlns="http://www.w3.org/2000/svg"><path/></svg>'),true);
 assert.equal(valid('<ns0:svg xmlns:ns0="http://www.w3.org/2000/svg"><ns0:path/></ns0:svg>'),true);
});
test('prefixed SVG must bind its own namespace and close its matching root',()=>{
 assert.equal(valid('<ns0:svg xmlns:ns0="urn:other"></ns0:svg>'),false);
 assert.equal(valid('<ns0:svg xmlns="http://www.w3.org/2000/svg"></ns0:svg>'),false);
 assert.equal(valid('<ns0:svg xmlns:ns0="http://www.w3.org/2000/svg"></svg>'),false);
 assert.equal(valid('<svg xmlns="http://www.w3.org/2000/svg">'),false);
});

const normalizeQid9Svg=require('../archive/tools/generated-meta/normalize-qid9-svg.cjs');
const {validateSvgStudentLanguage}=require('../archive/tools/svg-language-contract.cjs');

test('QID9 accessibility normalization ignores RDF dc:title metadata in the live blocked source',()=>{
 const sourcePath=require('node:path').join(__dirname,'../alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_효천고_2학기_기말_고1/assets/q20-B3-solution.svg');
 const source=fs.readFileSync(sourcePath,'utf8');
 assert.match(source,/<dc:title>/);
 const normalized=normalizeQid9Svg(source,'ALIVE-2025-HYOCHEON-H1-2FINAL-Q20-B3');
 assert.match(normalized,/<title id=/);
 assert.match(normalized,/<desc id=/);
 assert.match(normalized,/<dc:title>Matplotlib v3\.10\.8, https:\/\/matplotlib\.org\/<\/dc:title>/);
});

test('QID9 normalization counts accessibility tags only in the SVG root namespace',()=>{
 const prefixed='<s:svg xmlns:s="http://www.w3.org/2000/svg" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>metadata</dc:title><s:title>Diagram</s:title><s:desc>Student description.</s:desc><s:path d="M0 0"/></s:svg>';
 const normalized=normalizeQid9Svg(prefixed,'ALITE-TEST-Q02-A1');
 assert.match(normalized,/<dc:title>metadata<\/dc:title>/);
 assert.match(normalized,/<s:title id="qid9-ALITE-TEST-Q02-A1-title">Diagram<\/s:title>/);
 assert.match(normalized,/<s:desc id="qid9-ALITE-TEST-Q02-A1-desc">Student description\.<\/s:desc>/);
 assert.match(normalized,/<s:svg[^>]*role="img"[^>]*aria-labelledby="qid9-ALITE-TEST-Q02-A1-title qid9-ALITE-TEST-Q02-A1-desc"/);
 assert.throws(()=>normalizeQid9Svg(prefixed.replace('</s:desc>','</s:desc><s:title>Duplicate</s:title>'),'ALITE-TEST-Q02-A1'),/QID9_SVG_ACCESSIBILITY_TITLE_DESC_REQUIRED/);
});

test('QID9 derived SVG receives deterministic title and description bindings without changing artwork',()=>{
 const source='<svg xmlns="http://www.w3.org/2000/svg" width="390" height="290" role="img" aria-label="원 밖의 점에서 그은 두 접선"><title>q07 A1 두 접선과 접점</title><desc>외부점 P에서 원의 접점 T1 T2까지 그은 두 접선, 중심 C와 접점의 반지름 및 수직 관계</desc><rect width="390" height="290" fill="white"/><path d="M1 2L3 4"/></svg>';
 const normalized=normalizeQid9Svg(source,'ALITE-JEIL25-2FINAL-Q07-A1-solution');
 assert.equal(validateSvgStudentLanguage(normalized,{assetRef:'derived/q07.svg'}).status,'PASS');
 assert.match(normalized,/role="img"/);
 assert.match(normalized,/aria-labelledby="qid9-ALITE-JEIL25-2FINAL-Q07-A1-solution-title qid9-ALITE-JEIL25-2FINAL-Q07-A1-solution-desc"/);
 assert.match(normalized,/<title id="qid9-ALITE-JEIL25-2FINAL-Q07-A1-solution-title">q07 A1 두 접선과 접점<\/title>/);
 assert.match(normalized,/<desc id="qid9-ALITE-JEIL25-2FINAL-Q07-A1-solution-desc">외부점 P에서 원의 접점 T1 T2까지 그은 두 접선, 중심 C와 접점의 반지름 및 수직 관계<\/desc>/);
 assert.equal(normalized.match(/<rect[^>]*>/)[0],source.match(/<rect[^>]*>/)[0]);
 assert.equal(normalized.match(/<path[^>]*>/)[0],source.match(/<path[^>]*>/)[0]);
});

test('QID9 derived SVG refuses to invent missing student title or description',()=>{
 assert.throws(()=>normalizeQid9Svg('<svg><title>설명할 제목</title><path d="M0 0"/></svg>','ALITE-TEST-Q01-A1'),/QID9_SVG_ACCESSIBILITY_TITLE_DESC_REQUIRED/);
});


test('QID9 derived SVG fills a missing description from existing labels and preserves artwork',()=>{
 const source='<svg xmlns="http://www.w3.org/2000/svg" width="620" height="420"><title>C1 유리함수와 원의 교점</title><rect width="620" height="420" fill="white"/><path d="M1 2L3 4"/></svg>';
 const normalized=normalizeQid9Svg(source,'ALITE-SUNCHEON25-2FINAL-Q18-C1',{title:'C1 원·유리함수와 교점 P,Q·현 PQ 그래프',description:'두 교점의 대칭 좌표와 거리·현을 표시한다.'});
 assert.equal(validateSvgStudentLanguage(normalized,{assetRef:'derived/q18.svg'}).status,'PASS');
 assert.match(normalized,/<title id="qid9-ALITE-SUNCHEON25-2FINAL-Q18-C1-title">C1 유리함수와 원의 교점<\/title>/);
 assert.match(normalized,/<desc id="qid9-ALITE-SUNCHEON25-2FINAL-Q18-C1-desc">두 교점의 대칭 좌표와 거리·현을 표시한다\.<\/desc>/);
 assert.equal(normalized.match(/<rect[^>]*>/)[0],source.match(/<rect[^>]*>/)[0]);
 assert.equal(normalized.match(/<path[^>]*>/)[0],source.match(/<path[^>]*>/)[0]);
});

test('QID9 derived SVG still fails closed without existing title/description labels',()=>{
 assert.throws(()=>normalizeQid9Svg('<svg><path d="M0 0"/></svg>','ALITE-TEST-Q01-A1'),/QID9_SVG_ACCESSIBILITY_TITLE_DESC_REQUIRED/);
});


test('QID9 normalized SVG drops stale root aria-label after title/desc binding',()=>{
 const source='<svg xmlns="http://www.w3.org/2000/svg" aria-label="비율이 실제와 다를 수 있는 개념도"><title>두 함수의 그래프</title><desc>교점 관계를 나타낸다.</desc><path d="M1 2L3 4"/></svg>';
 const normalized=normalizeQid9Svg(source,'ALITE-JEIL25-2FINAL-Q12-A1');
 assert.doesNotMatch(normalized, /aria-label=/);
 assert.match(normalized, /aria-labelledby=/);
 assert.equal(validateSvgStudentLanguage(normalized,{assetRef:'derived/q12.svg'}).status,'PASS');
 assert.equal(normalized.match(/<path[^>]*>/)[0],source.match(/<path[^>]*>/)[0]);
});

test('QID9 derived SVG removes scale guidance from description while keeping the source explanation and artwork',()=>{
 const source='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 410"><title id="title">A1 점근선 직사각형 해설</title><desc id="desc">수직 점근선 x=2, x=5와 수평 점근선 y=0, y=5가 만드는 직사각형. 가로 3, 세로 5, 넓이 15. x축과 y축의 단위 축척 동일.</desc><rect x="0" y="0" width="620" height="410" fill="white"/><path d="M1 2L3 4"/></svg>';
 const normalized=normalizeQid9Svg(source,'ALITE-JEIL25-2FINAL-Q14-A1-solution');
 assert.equal(validateSvgStudentLanguage(normalized,{assetRef:'derived/q14-solution.svg'}).status,'PASS');
 assert.doesNotMatch(normalized,/축척/);
 assert.match(normalized,/<desc id="desc">수직 점근선 x=2, x=5와 수평 점근선 y=0, y=5가 만드는 직사각형\. 가로 3, 세로 5, 넓이 15\.<\/desc>/);
 assert.equal(normalized.match(/<rect[^>]*>/)[0],source.match(/<rect[^>]*>/)[0]);
 assert.equal(normalized.match(/<path[^>]*>/)[0],source.match(/<path[^>]*>/)[0]);
});

test('QID9 derived SVG fails closed when scale guidance is its only description',()=>{
 assert.throws(()=>normalizeQid9Svg('<svg><title>점근선 직사각형</title><desc>x축과 y축의 단위 축척은 같다.</desc></svg>','ALITE-TEST-Q14-A1'),/QID9_SVG_ACCESSIBILITY_DESCRIPTION_SCALE_GUIDANCE_UNRESOLVED/);
});

test('QID9 derived SVG removes internal format wording from desc and uses the approved student caption without changing artwork',()=>{
 const source='<svg xmlns="http://www.w3.org/2000/svg" width="440" height="285" viewBox="0 0 440 285" role="img" aria-labelledby="title desc"><title id="title">제일고 q18 A1 합성함수 구간별 해설 그래프</title><desc id="desc">합성함수 그래프의 구간별 꼭짓점과 좌표축을 표시하여 사다리꼴과 삼각형 넓이를 계산하도록 돕는 해설용 SVG.</desc><rect x="0" y="0" width="440" height="285" fill="white"/><path d="M1 2L3 4"/></svg>';
 const description='내부 함수값의 범위별로 그래프의 분기점과 도형 넓이를 확인한다.';
 const normalized=normalizeQid9Svg(source,'ALITE-JEIL25-2FINAL-Q18-A1',{description});
 const desc=normalized.match(/<desc\b[^>]*>([\s\S]*?)<\/desc>/i);
 assert.equal(validateSvgStudentLanguage(normalized,{assetRef:'derived/q18-solution.svg'}).status,'PASS');
 assert.ok(desc);
 assert.equal(desc[1],description);
 assert.doesNotMatch(desc[1],/\bsvg\b/i);
 assert.equal(normalized.match(/<rect[^>]*>/)[0],source.match(/<rect[^>]*>/)[0]);
 assert.equal(normalized.match(/<path[^>]*>/)[0],source.match(/<path[^>]*>/)[0]);
});
