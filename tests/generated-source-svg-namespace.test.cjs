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
