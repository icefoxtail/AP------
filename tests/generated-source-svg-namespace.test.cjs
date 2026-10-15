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
