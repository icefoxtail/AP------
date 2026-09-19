const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname, '../archive', name), 'utf8');
const output = require('../archive/archive2-output.js');

test('default entry preserves navigation/session handoff; legacy and native assignment handoffs stay put', () => {
  for (const source of ['https://example.test/archive/', 'https://example.test/archive/index', 'https://example.test/archive/index.html']) {
    let destination;
    const url = new URL(source + '?view=find&grade=고1#apmsess=synthetic');
    vm.runInNewContext(read('archive-home.js'), { URL, URLSearchParams, location: { href:url.href, search:url.search, hash:url.hash, replace:v => destination=v } });
    const target = new URL(destination);
    assert.equal(target.pathname, '/archive/workspace.html');
    assert.equal(target.searchParams.get('grade'), '고1');
    assert.equal(target.hash, '#apmsess=synthetic');
  }
  for (const query of ['legacy=1', 'archive2Issue=original%2Fexam.js&archive2Embedded=1', 'unitPastAssign=paper-1&qpp=6']) {
    vm.runInNewContext(read('archive-home.js'), {URLSearchParams, location:{search:'?'+query, replace:() => assert.fail('must keep legacy handoff')}});
  }
});

test('both entry pages share existing session restoration and strip credentials from URL/password fields', () => {
  const incoming = {login_id:'synthetic-teacher', session_token:'synthetic-token', name:'검증 교사', password:'discard', raw_password:'discard', pw:'discard'};
  const store = new Map(); let cleaned;
  const location = {hash:'#apmsess='+encodeURIComponent(Buffer.from(JSON.stringify(incoming)).toString('base64')),pathname:'/archive/workspace.html',search:'?view=find'};
  vm.runInNewContext(read('archive-session.js'), {window:{location}, localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)}, history:{replaceState:(_a,_b,v)=>cleaned=v}, atob:s=>Buffer.from(s,'base64').toString('binary'),escape,decodeURIComponent,Date});
  const saved = JSON.parse(store.get('APMATH_SESSION'));
  assert.equal(saved.name,incoming.name); assert.equal(saved.session_token,incoming.session_token);
  for (const field of ['password','pw','raw_password']) assert.equal(saved[field],undefined);
  assert.equal(cleaned,'/archive/workspace.html?view=find');
  for (const file of ['index.html','workspace.html']) assert.match(read(file),/src="archive-session.js"/);
});

test('material browse labels distinguish variants without changing canonical provenance', () => {
  const source = {file:'similar/high/h1/1final/25_학교_유사2.js',contentType:'유형',year:25,school:'학교',grade:'고1',semester:1,examType:'final'};
  const before = JSON.stringify(source);
  assert.equal(output.materialKind(source),'similar');
  assert.equal(output.matchesMaterial(source,'nonexam'),true);
  assert.equal(output.matchesMaterial({file:'original/high/example.js',contentType:'기출'},'nonexam'),false);
  assert.equal(output.matchesMaterial({...source,contentType:'단원평가'},'nonexam'),true);
  assert.equal(output.matchesMaterial({contentType:'쪽지'},'nonexam'),true);
  assert.match(output.displayTitle(source),/유사문제 2$/);
  assert.equal(JSON.stringify(source),before);
  assert.equal(output.materialKind({...source,contentType:'단원평가'}),'unit');
  assert.match(output.displayTitle({...source,contentType:'단원평가',topic:'중간평가'}),/단원평가 유사 2/);
});

test('render-only review retains QR choice while assignment writes remain disabled', () => {
  for (const includeQr of [false,true]) {
    const url = output.applyUrl(new URL('https://example.test/archive/engine.html'),{includeQr});
    url.searchParams.set('archive2Review','1');
    assert.equal(url.searchParams.get('solQr'),includeQr?'1':'0');
    assert.equal(url.searchParams.get('submitQr'),'0');
    assert.equal(url.searchParams.get('preRegistered'),'1');
    assert.equal(url.searchParams.get('assignmentRegistered'),'1');
    assert.equal(url.searchParams.has('preview'),false);
  }
});
