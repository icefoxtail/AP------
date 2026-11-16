'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const { test } = require('node:test');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'archive/engine.html'), 'utf8');
const fontPath = 'archive/vendor/ap-enclosed-latin/APEnclosedLatin-Regular.woff2';
const font = fs.readFileSync(path.join(root, fontPath));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'archive/vendor/ap-enclosed-latin/subset-manifest.json')));
const points = Array.from({ length: 52 }, (_, i) => 0x24B6 + i);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

// Decode the shipped CFF WOFF2's untransformed sfnt tables. This independently
// checks actual cmap and advance bytes rather than trusting the JSON manifest.
function fontTables(bytes) {
  assert.equal(bytes.toString('ascii', 0, 4), 'wOF2');
  assert.equal(bytes.toString('ascii', 4, 8), 'OTTO');
  assert.equal(bytes.readUInt32BE(8), bytes.length);
  const tags = ['cmap','head','hhea','hmtx','maxp','name','OS/2','post','cvt ','fpgm','glyf','loca','prep','CFF ','VORG','EBDT','EBLC','gasp','hdmx','kern','LTSH','PCLT','VDMX','vhea','vmtx','BASE','GDEF','GPOS','GSUB','EBSC','JSTF','MATH','CBDT','CBLC','COLR','CPAL','SVG ','sbix','acnt','avar','bdat','bloc','bsln','cvar','fdsc','feat','fmtx','fvar','gvar','hsty','just','lcar','mort','morx','opbd','prop','trak','Zapf','Silf','Glat','Gloc','Feat','Sill'];
  let offset = 48;
  function base128() {
    let n = 0;
    for (let i = 0; i < 5; i++) {
      const b = bytes[offset++];
      assert(!(i === 0 && b === 0x80), 'overlong table size');
      n = n * 128 + (b & 0x7f);
      if (!(b & 0x80)) return n;
    }
    assert.fail('invalid table size');
  }
  const entries = [];
  for (let i = 0; i < bytes.readUInt16BE(12); i++) {
    const flags = bytes[offset++];
    const tag = (flags & 63) === 63 ? bytes.toString('ascii', offset, offset += 4) : tags[flags & 63];
    assert.equal(flags >> 6, 0, 'CFF subset has only untransformed tables');
    assert(!['glyf', 'loca'].includes(tag));
    entries.push({ tag, length: base128() });
  }
  const raw = zlib.brotliDecompressSync(bytes.subarray(offset, offset + bytes.readUInt32BE(20)));
  const result = new Map();
  let at = 0;
  for (const e of entries) { assert(!result.has(e.tag)); result.set(e.tag, raw.subarray(at, at += e.length)); }
  assert.equal(at, raw.length);
  return result;
}
function cmapOf(bytes) {
  const result = new Map();
  for (let i = 0; i < bytes.readUInt16BE(2); i++) {
    const record = 4 + 8 * i, platform = bytes.readUInt16BE(record), encoding = bytes.readUInt16BE(record + 2);
    if (!(platform === 0 || (platform === 3 && [1, 10].includes(encoding)))) continue;
    const at = bytes.readUInt32BE(record + 4), format = bytes.readUInt16BE(at);
    const add = (code, glyph) => { if (!glyph || code === 0xffff) return; if (result.has(code)) assert.equal(result.get(code), glyph); result.set(code, glyph); };
    if (format === 4) {
      const segments = bytes.readUInt16BE(at + 6) / 2;
      for (let j = 0; j < segments; j++) {
        const end = bytes.readUInt16BE(at + 14 + 2*j), start = bytes.readUInt16BE(at + 16 + 2*segments + 2*j);
        const delta = bytes.readInt16BE(at + 16 + 4*segments + 2*j), rangeAt = at + 16 + 6*segments + 2*j, range = bytes.readUInt16BE(rangeAt);
        for (let c = start; c <= end; c++) {
          const glyph = range ? bytes.readUInt16BE(rangeAt + range + 2*(c - start)) : c;
          add(c, range && !glyph ? 0 : (glyph + delta) & 0xffff);
        }
      }
    } else if (format === 12) {
      for (let j = 0; j < bytes.readUInt32BE(at + 12); j++) {
        const g = at + 16 + 12*j, from = bytes.readUInt32BE(g), to = bytes.readUInt32BE(g + 4), first = bytes.readUInt32BE(g + 8);
        for (let c = from; c <= to; c++) add(c, first + c - from);
      }
    } else assert.fail('unexpected Unicode cmap format');
  }
  return result;
}
function deferred() { let resolve, reject; const promise = new Promise((a,b) => { resolve=a; reject=b; }); return { promise, resolve, reject }; }
function clock() {
  let now = 0, next = 1;
  const timers = new Map();
  return {
    timers,
    setTimeout(fn, ms) { const id = next++; timers.set(id, { at: now + ms, fn }); return id; },
    clearTimeout(id) { timers.delete(id); },
    tick(ms) { now += ms; for (const [id,t] of timers) if (t.at <= now) { timers.delete(id); t.fn(); } }
  };
}
const flush = async () => { for (let i=0;i<12;i++) await Promise.resolve(); };
function harness({ faces, check = true, unavailable = false, defaultReady, output = { unknownText() {} } } = {}) {
  const load = deferred(), time = clock(), calls = [];
  const fonts = unavailable ? undefined : {
    load(descriptor, text) { calls.push({ event: 'load', descriptor, points: Array.from(text, c=>c.codePointAt(0)) }); return load.promise; },
    check(descriptor, text) { calls.push({ event:'check', descriptor, points:Array.from(text,c=>c.codePointAt(0)) }); return check; }
  };
  const context = vm.createContext({ window:{}, document:{baseURI:'https://example.invalid/archive/engine.html',fonts}, URL,
    console: {warn(){},info(){}},
    setTimeout: time.setTimeout, clearTimeout: time.clearTimeout });
  const script = engine.match(/<script>\s*\/\/ vendor[\s\S]*?<\/script>/);
  assert(script, 'exact production MathJax config');
  vm.runInContext(script[0].replace(/^<script>|<\/script>$/g, ''), context);
  const config = context.window.MathJax;
  config.startup.document = { outputJax: output };
  config.startup.defaultPageReady = () => { calls.push({event:'defaultReady'}); return defaultReady ? defaultReady() : Promise.resolve('typeset-ready'); };
  if (faces) load.resolve(faces);
  return { context, config, calls, load, time, start:()=>config.startup.pageReady() };
}
const loaded = () => [{family:'AP Enclosed Latin',status:'loaded'}];

test('shipped font contains exactly 52 enclosed Latin glyphs with positive preserved advances', () => {
  const tables = fontTables(font), cmap = cmapOf(tables.get('cmap'));
  assert.deepEqual([...cmap.keys()].sort((a,b)=>a-b), points);
  assert.equal(tables.get('maxp').readUInt16BE(4), 53);
  assert.equal(tables.get('head').readUInt16BE(18), 1000);
  const metrics = tables.get('hmtx'), count = tables.get('hhea').readUInt16BE(34);
  for (const cp of points) {
    const glyphId = cmap.get(cp), advance = metrics.readUInt16BE(Math.min(glyphId,count-1)*4);
    const lsb = metrics.readInt16BE(glyphId<count ? glyphId*4+2 : count*4+(glyphId-count)*2);
    const row = manifest.glyphs.find(x=>x.codepoint===`U+${cp.toString(16).toUpperCase()}`);
    assert(glyphId>0 && advance>0);
    assert.deepEqual({glyphId,advanceWidth:advance,leftSideBearing:lsb},{glyphId:row.glyphId,advanceWidth:row.advanceWidth,leftSideBearing:row.leftSideBearing});
    assert.match(row.outlineSha256,/^[a-f0-9]{64}$/);
  }
  for (const cp of [0x20,0x41,0x61,0x2460,0x24b5,0x24ea,0xac00]) assert(!cmap.has(cp), 'unrelated glyph must retain prior fallback');
});
test('font bytes, renamed family, provenance and complete OFL notice are fixed', () => {
  assert.equal(sha(font),manifest.output.sha256); assert.equal(font.length,manifest.output.bytes); assert.equal(font.length,5100);
  assert.equal(manifest.output.path,fontPath); assert.equal(manifest.fontFamily,'AP Enclosed Latin');
  assert.equal(manifest.source.faceIndex,1); assert.equal(manifest.source.family,'Noto Sans CJK KR');
  assert.equal(manifest.generator.outlineAndAdvancePreserved,true); assert.equal(manifest.generator.fallbackCoverageOutsideRange,false);
  const license=fs.readFileSync(path.join(root,manifest.license.path)); assert.equal(sha(license),manifest.license.sha256);
  for(const text of ['2014-2021 Adobe','SIL OPEN FONT LICENSE Version 1.1','PERMISSION & CONDITIONS','TERMINATION','DISCLAIMER']) assert(license.toString().includes(text));
});
test('engine keeps TeX math font and serif fallback and limits the added face to U24B6–U24E9', () => {
  const {config}=harness();
  assert.equal(config.output.font,'mathjax-tex');assert.equal(config.output.unknownFamily,undefined);
  assert.equal(config.output.displayOverflow,'linebreak');assert.deepEqual(JSON.parse(JSON.stringify(config.output.linebreaks)),{inline:true,width:'100%',lineleading:0.2});
  assert.equal(config.startup.typeset,false); assert.equal(config.options.enableMenu,false);
  const face=engine.match(/@font-face\s*\{[^}]*font-family:\s*'AP Enclosed Latin';[^}]*\}/g);
  assert.equal(face?.length,1); assert.match(face[0],/unicode-range:\s*U\+24B6-24E9;/);
  assert.match(face[0],/src:\s*url\('vendor\/ap-enclosed-latin\/APEnclosedLatin-Regular\.woff2'\) format\('woff2'\);/);
  assert.match(engine,/body \{ margin: 0; font-family: 'Nanum Myeongjo', serif;/);
  assert(!engine.includes('mjx-utext {')); assert(!engine.includes('mtextInheritFont: true'));
});
function vendoredOutput() {
  const vendor = fs.readFileSync(path.join(root, 'archive/vendor/mathjax-tex-font/tex-mml-chtml-mathjax-tex.js'), 'utf8');
  const defaults=vendor.match(/\.defaultCssFonts=(\{[^;]+?\}),[A-Za-z_$][\w$]*\.default/);
  const methods = {
    define: vendor.match(/(defineCssFonts\(t\)\{[^}]+\})defineDelimiters/),
    font: vendor.match(/(getCssFont\(t\)\{[^}]*\}getFamily\(t\)\{[^}]*\})getRemappedChar/),
    style: vendor.match(/(cssFontStyles\(t,e=\{\}\)\{[^}]*\})getFontData/),
    unknown: vendor.match(/(unknownText\(t,e,s=null\)\{[^\n]+?\})measureTextNode\(t\)/),
    measure: vendor.match(/(measureText\(t,e,s=\["",!1,!1\]\)\{[^\n]+?\})measureTextNodeWithCache\(t,e,s/)
  };
  assert(defaults && Object.values(methods).every(Boolean), 'review vendored CHTML binding if the bundle changes');
  assert(vendor.includes('unknownFamily:"serif"'));
  const parentOf = new WeakMap();
  const append = (parent, child) => { parent.children.push(child); parentOf.set(child, parent); };
  const adaptor = {
    append,
    firstChild: node => node.children[0],
    remove: child => { const parent = parentOf.get(child); parent.children.splice(parent.children.indexOf(child), 1); },
    setAttributes: (node, props) => Object.assign(node.props.style, props.style)
  };
  const html = (tag, props, children) => {
    const node = { tag, props, children: [] };
    for (const child of children) append(node, child);
    return node;
  };
  const font = vm.runInNewContext(`const f={cssFontMap:{},cssFamilyPrefix:'MJX-TEX-ZERO',options:{unknownFamily:'serif'},${methods.define[1]},${methods.font[1].replace('}getFamily(', '},getFamily(')}};f.defineCssFonts(${defaults[1]});f;`);
  return vm.runInNewContext(`({font,adaptor,html,${methods.style[1]},${methods.unknown[1]},${methods.measure[1]},
    math:{metrics:{scale:1}}, fixed:w=>String(w), text:text=>({text}), measureTextNodeWithCache:node=>node})`,
    { font, adaptor, html, Hr: text => Array.from(text, c => c.codePointAt(0)) });
}

test('vendored CHTML keeps default families and byte-identical markup for ordinary unknown glyphs', async () => {
  const output = vendoredOutput();
  assert.deepEqual(Array.from(output.font.getCssFont('normal')), ['serif', false, false]);
  assert.deepEqual(Array.from(output.font.getCssFont('bold')), ['serif', false, true]);
  assert.deepEqual(Array.from(output.font.getCssFont('script')), ['cursive', false, false]);
  const inputs = [['①②', 'normal'], ['계급의 도수', 'bold'], ['ㄱㄴㄷ', 'normal'], ['⒵⓪', 'script'], ['𝒜', 'normal']];
  const render = () => JSON.stringify(inputs.map(args => output.unknownText(...args)));
  const original = render();
  await harness({ faces: loaded(), output }).start();
  assert.equal(render(), original);
});

test('CHTML paints and measures only enclosed Latin runs with the local face, preserving mixed text order and style', async () => {
  const output = vendoredOutput();
  const letters = String.fromCodePoint(...points);
  const text = `①한글${letters}ㄱⓐ②`;
  const before = JSON.parse(JSON.stringify(output.unknownText(text, 'bold', 1)));
  await harness({ faces: loaded(), output }).start();
  const render = JSON.parse(JSON.stringify(output.unknownText(text, 'bold', 1)));
  const run = contents => ({ tag: 'span', props: { class: 'ap-enclosed-latin', style: { 'font-family': 'MJX-TEX-ZERO, "AP Enclosed Latin", serif' } }, children: [{ text: contents }] });
  assert.deepEqual(render, { ...before, children: [{ text: '①한글' }, run(letters), { text: 'ㄱ' }, run('ⓐ'), { text: '②' }] });
  const measured = JSON.parse(JSON.stringify(output.measureText(text, '-explicitFont', ['monospace', true, false])));
  assert.deepEqual(measured.props.style, { 'font-family': 'MJX-TEX-ZERO, monospace', 'font-style': 'italic' });
  assert.deepEqual(measured.children, render.children);
});
test('first typeset remains pending until the exact face for all 52 letters is loaded', async () => {
  const h=harness(), p=h.start(); await flush();
  assert.deepEqual(h.calls,[{event:'load',descriptor:'16px "AP Enclosed Latin"',points}]);
  h.time.tick(4999);await flush();assert(!h.calls.some(x=>x.event==='defaultReady'));
  h.load.resolve(loaded()); assert.equal(await p,'typeset-ready');
  assert.equal(h.calls.filter(x=>x.event==='defaultReady').length,1);assert.equal(h.time.timers.size,0);
});
test('5000ms timeout rejects and a late font success cannot start typesetting', async () => {
  const h=harness(), observed=h.start().then(()=>({ok:true}),e=>({error:e.message}));await flush();
  h.time.tick(4999);await flush();assert.equal(h.time.timers.size,1);
  h.time.tick(1);assert.deepEqual(await observed,{error:'ENCLOSED_LATIN_FONT_TIMEOUT'});assert.equal(h.time.timers.size,0);
  h.load.resolve(loaded());await flush();assert(!h.calls.some(x=>x.event==='defaultReady'));
});
test('early resolution clears the pending timeout and runs the normal startup exactly once', async () => {
  const h=harness({faces:loaded()});assert.equal(await h.start(),'typeset-ready');assert.equal(h.time.timers.size,0);
  h.time.tick(5000);await flush();assert.equal(h.calls.filter(x=>x.event==='defaultReady').length,1);
});
test('font load rejection is not converted to a ready state and clears its timer',async()=>{
  const h=harness(), p=h.start();h.load.reject(new Error('font bytes unavailable'));
  await assert.rejects(p,/font bytes unavailable/);assert.equal(h.time.timers.size,0);assert(!h.calls.some(x=>x.event==='defaultReady'));
});
test('missing browser font API refuses readiness',async()=>{const h=harness({unavailable:true});await assert.rejects(h.start(),/ENCLOSED_LATIN_FONT_API_UNAVAILABLE/);assert.equal(h.time.timers.size,0);});
for(const [name,faces,check] of [
  ['empty load result',[],true],['duplicate faces',[...loaded(),...loaded()],true],
  ['wrong face',[{family:'serif',status:'loaded'}],true],['unloaded face',[{family:'AP Enclosed Latin',status:'loading'}],true],
  ['failed glyph coverage check',loaded(),false]
]) test(`${name} cannot trigger normal startup`,async()=>{
  const h=harness({faces,check});await assert.rejects(h.start(),/ENCLOSED_LATIN_FONT_NOT_LOADED/);
  assert.equal(h.time.timers.size,0);assert(!h.calls.some(x=>x.event==='defaultReady'));
});
test('quoted family names returned by browser FontFace are accepted without changing the font choice',async()=>{
  const h=harness({faces:[{family:'"AP Enclosed Latin"',status:'loaded'}]});assert.equal(await h.start(),'typeset-ready');
});
test('normal MathJax startup rejection is preserved',async()=>{
  const h=harness({faces:loaded(),defaultReady:()=>Promise.reject(new Error('MathJax startup failed'))});
  await assert.rejects(h.start(),/MathJax startup failed/);assert.equal(h.time.timers.size,0);
});
test('missing CHTML output refuses readiness before the default startup', async () => {
  const h = harness({ faces: loaded(), output: {} });
  await assert.rejects(h.start(), /ENCLOSED_LATIN_MATHJAX_OUTPUT_UNAVAILABLE/);
  assert.equal(h.time.timers.size, 0);
  assert(!h.calls.some(call => call.event === 'defaultReady'));
});

function connectedCaller(options = {}) {
  const h=harness(options), c=h.context;
  const begin=engine.indexOf('async function waitForEnclosedLatinMath('), end=engine.indexOf('async function measureRenderPhase(',begin);
  assert(begin>0 && end>begin);vm.runInContext(engine.slice(begin,end),c);
  c.window.waitForEnclosedLatinMath=c.waitForEnclosedLatinMath;
  const waitBegin=engine.indexOf('const AP_MATHJAX_WAIT_MS ='),waitEnd=engine.indexOf('// 렌더가 끝나기 전에',waitBegin);
  assert(waitBegin>0 && waitEnd>waitBegin);vm.runInContext(engine.slice(waitBegin,waitEnd),c);
  vm.runInContext(fs.readFileSync(path.join(root,'archive/mathjax_render_loop.js'),'utf8'),c);
  let measurements=0;
  h.config.typesetPromise=async()=>{measurements++;return true;};
  h.config.startup.promise=h.start();h.config.startup.promise.catch(()=>{});
  // MathJax moves the initial configuration under MathJax.config at startup.
  h.config.config = { startup: { pageReady: h.config.startup.pageReady } };
  delete h.config.startup.pageReady;
  return {...h,measurements:()=>measurements,
    call:async (text='ⓐ',directFallback=false)=>{
      await c.waitForMathJaxOrContinue();
      if(directFallback)c.window.APRenderLoop=undefined;
      return c.typesetMath('font-regression',[{textContent:text}]);
    }, runtimeCall:text=>c.window.APRenderLoop.typeset('background-font-regression',[{textContent:text}])};
}
for(const directFallback of [false,true]) {
  const pathName=directFallback?'engine direct fallback':'shared APRenderLoop';
  for(const [name,faces,error] of [
    ['rejected font',null,'font request failed'],['empty face',[],'ENCLOSED_LATIN_FONT_NOT_LOADED'],
    ['unloaded face',[{family:'AP Enclosed Latin',status:'loading'}],'ENCLOSED_LATIN_FONT_NOT_LOADED']
  ]) test(`${pathName}: existing startup catch cannot allow a first enclosed-glyph measurement after ${name}`,async()=>{
    const h=connectedCaller(faces?{faces}:{});
    if(!faces)h.load.reject(new Error(error));
    await assert.rejects(h.call('ⓐ',directFallback),new RegExp(error));
    assert.equal(h.measurements(),0);assert(!h.calls.some(x=>x.event==='defaultReady'));
  });
  test(`${pathName}: timeout and later font success remain refused before measurement`,async()=>{
    const h=connectedCaller();
    const p=h.call('ⓐ',directFallback);const rejected=assert.rejects(p,/ENCLOSED_LATIN_FONT_TIMEOUT/);
    await flush();h.time.tick(5000);await rejected;
    h.load.resolve(loaded());await flush();
    await assert.rejects(h.call('ⓐ',directFallback),/ENCLOSED_LATIN_FONT_TIMEOUT/);
    assert.equal(h.measurements(),0);
  });
  test(`${pathName}: loaded font keeps the existing typeset and original elements`,async()=>{
    const h=connectedCaller({faces:loaded()});assert.equal(await h.call('ⓐ',directFallback),true);assert.equal(h.measurements(),1);
  });
  test(`${pathName}: ordinary math still uses the original continuation after startup failure`,async()=>{
    const h=connectedCaller();h.load.reject(new Error('font request failed'));
    assert.equal(await h.call('$x+1$',directFallback),true);assert.equal(h.measurements(),1);
  });
}
test('runtime direct calls cannot bypass the pending named-glyph readiness promise',async()=>{
  const h=connectedCaller(),p=h.runtimeCall('ⓐ');await flush();assert.equal(h.measurements(),0);
  h.load.resolve(loaded());assert.equal(await p,true);assert.equal(h.measurements(),1);
});
test('missing startup promise refuses named-glyph measurement but not unrelated unknown symbols',async()=>{
  const h=connectedCaller({faces:loaded()});await h.config.startup.promise;delete h.config.startup.promise;
  await assert.rejects(h.runtimeCall('ⓐ'),/ENCLOSED_LATIN_FONT_NOT_READY/);assert.equal(h.measurements(),0);
  assert.equal(await h.runtimeCall('한글'),true);assert.equal(h.measurements(),1);
});
test('another MathJax startup configuration retains its existing continuation contract',async()=>{
  const h=connectedCaller();h.load.reject(new Error('font request failed'));h.config.config={startup:{pageReady(){}}};
  assert.equal(await h.call('ⓐ'),true);assert.equal(h.measurements(),1);
});
test('undefined elements and selector inputs still guard actual enclosed glyphs',async()=>{
  const h=connectedCaller();h.load.reject(new Error('font request failed'));await flush();
  h.context.document.body={textContent:'ⓕ'};h.context.document.querySelectorAll=()=>[{textContent:'Ⓐ'}];
  await assert.rejects(h.context.window.APRenderLoop.typeset('body',undefined),/font request failed/);
  await assert.rejects(h.context.window.APRenderLoop.typeset('selector',['.choices']),/font request failed/);
  assert.equal(h.measurements(),0);
});
