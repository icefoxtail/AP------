import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {evaluatePublicationFonts} from './verify-publication-fonts.mjs';

// Synthetic inputs exercise policy only; they are not browser evidence.
const here=path.dirname(fileURLToPath(import.meta.url));
const sha='a'.repeat(64),otherSha='b'.repeat(64);
const inspection=()=>({path:'root',svgSha256:sha,rootMarked:true,runtime:'playwright-chromium',synthetic:false,fontStatus:'loaded',textOrLabelElementCount:0,foreignObjectCount:0,embeddedImageCount:0,visibleGeometryPrimitiveCount:8});
const empty=()=>({expectedLabelCount:0,measuredLabelCount:0,labels:[],embedded:[],fontInspection:inspection()});
const normal=font=>({expectedLabelCount:1,measuredLabelCount:1,labels:[{id:'length',finalViewportCssFontPx:font}],embedded:[],fontInspection:{...inspection(),rootMarked:false,textOrLabelElementCount:1}});
const decide=m=>evaluatePublicationFonts(m,sha,sha);
const report=(m,decision)=>({status:'PASS',sourceSvgSha:sha,responseSha:sha,...m,...decision});
const notApplicable=m=>({fontApplicability:'NOT_APPLICABLE',minFontPx:null,explicitTextFree:{schemaVersion:'APMATH_EXPLICIT_TEXT_FREE_FONT_EVIDENCE_v1',...m.fontInspection,sourceSvgSha:sha,responseSha:sha}});

test('explicit flat marks-only diagram is not applicable; ordinary empty inventory fails',()=>{
  const valid=empty(),decision=decide(valid);
  assert.equal(decision.fontApplicability,'NOT_APPLICABLE');
  assert.equal(decision.minFontPx,null);
  assert.equal(decision.explicitTextFree.svgSha256,sha);
  const unmarked=empty();unmarked.fontInspection.rootMarked=false;
  assert.throws(()=>decide(unmarked),/missing or unmeasurable/);
});

test('text-free declaration never excuses visible, outlined, hidden or embedded text',()=>{
  const labelled=normal(14);labelled.fontInspection.rootMarked=true;
  assert.throws(()=>decide(labelled),/text-free SVG contains labels/);
  const outlined=empty();outlined.fontInspection.textOrLabelElementCount=1;
  assert.throws(()=>decide(outlined),/missing or unmeasurable/);
  const foreign=empty();foreign.fontInspection.foreignObjectCount=1;
  assert.throws(()=>decide(foreign),/missing or unmeasurable/);
  const embedded=empty();embedded.fontInspection.embeddedImageCount=1;embedded.embedded=[{...empty(),fontInspection:{...inspection(),path:'root/image[0]'}}];
  assert.throws(()=>decide(embedded),/missing or unmeasurable/);
  const embeddedText=empty();embeddedText.expectedLabelCount=embeddedText.measuredLabelCount=1;embeddedText.fontInspection.embeddedImageCount=1;embeddedText.embedded=[normal(14)];
  assert.throws(()=>decide(embeddedText),/text-free SVG contains labels/);
});

test('empty, unready, synthetic or differently hashed drawings fail closed',()=>{
  for(const mutation of [e=>{e.visibleGeometryPrimitiveCount=0;},e=>{e.fontStatus='loading';},e=>{e.synthetic=true;},e=>{e.svgSha256=otherSha;}]){
    const m=empty();mutation(m.fontInspection);assert.throws(()=>decide(m));
  }
  assert.throws(()=>evaluatePublicationFonts(empty(),sha,otherSha),/response SHA/);
  const missing=empty();delete missing.fontInspection;assert.throws(()=>decide(missing));
});

test('ordinary 11 CSS px threshold and complete measurement remain mandatory',()=>{
  assert.deepEqual(decide(normal(11)),{fontApplicability:'APPLICABLE',minFontPx:11});
  assert.throws(()=>decide(normal(10.99)),/below 11/);
  assert.throws(()=>decide(normal(NaN)),/unmeasurable/);
  const missing=normal(14);missing.measuredLabelCount=0;assert.throws(()=>decide(missing),/unmeasurable/);
  // Existing recursive measurement remains available to ordinary SVGs.
  const parent=empty();parent.fontInspection.rootMarked=false;parent.fontInspection.embeddedImageCount=1;
  parent.expectedLabelCount=parent.measuredLabelCount=1;parent.embedded=[normal(12)];
  assert.deepEqual(decide(parent),{fontApplicability:'APPLICABLE',minFontPx:12});
});

test('Python publication consumer enforces the same zero-label evidence and normal threshold',()=>{
  const valid=empty(),validRow=report(valid,decide(valid));
  const cases=[{name:'explicit diagram',row:validRow,ok:true}];
  const invalid=(name,change)=>{const row=structuredClone(validRow);change(row);cases.push({name,row,ok:false});};
  invalid('unmarked',r=>{r.explicitTextFree.rootMarked=false;});
  invalid('text or outline',r=>{r.explicitTextFree.textOrLabelElementCount=1;});
  invalid('foreign text',r=>{r.explicitTextFree.foreignObjectCount=1;});
  invalid('embedded image',r=>{r.explicitTextFree.embeddedImageCount=1;});
  invalid('no geometry',r=>{r.explicitTextFree.visibleGeometryPrimitiveCount=0;});
  invalid('unready fonts',r=>{r.explicitTextFree.fontStatus='loading';});
  invalid('synthetic',r=>{r.explicitTextFree.synthetic=true;});
  invalid('missing evidence',r=>{delete r.explicitTextFree;});
  invalid('source mismatch',r=>{r.sourceSvgSha=otherSha;});
  invalid('response mismatch',r=>{r.responseSha=otherSha;});
  invalid('evidence hash mismatch',r=>{r.explicitTextFree.svgSha256=otherSha;});
  invalid('measured mismatch',r=>{r.measuredLabelCount=1;});
  invalid('N/A with labels',r=>{r.expectedLabelCount=r.measuredLabelCount=1;r.labels=[{finalViewportCssFontPx:14}];});
  invalid('unexpected font number',r=>{r.minFontPx=14;});
  const standard=normal(11);cases.push({name:'normal 11px',row:report(standard,decide(standard)),ok:true});
  cases.push({name:'normal below 11px',row:report(normal(10.99),{fontApplicability:'APPLICABLE',minFontPx:10.99}),ok:false});
  const unmarked=empty();unmarked.fontInspection.rootMarked=false;
  cases.push({name:'ordinary empty',row:report(unmarked,notApplicable(unmarked)),ok:false});
  const script="import json,sys;sys.path.insert(0,sys.argv[1]);from pubflow import validate_font_row\nresults=[]\nfor case in json.load(sys.stdin):\n try:\n  validate_font_row(case['row'],sys.argv[2]);results.append(True)\n except ValueError:\n  results.append(False)\nprint(json.dumps(results))";
  const result=spawnSync(process.env.PYTHON||'python',['-c',script,here,sha],{cwd:here,input:JSON.stringify(cases),encoding:'utf8',env:{...process.env,PYTHONUTF8:'1'},timeout:30000});
  assert.equal(result.status,0,result.stderr);
  const actual=JSON.parse(result.stdout);
  assert.equal(actual.length,cases.length);
  for(let i=0;i<cases.length;i++)assert.equal(actual[i],cases[i].ok,cases[i].name);
});
