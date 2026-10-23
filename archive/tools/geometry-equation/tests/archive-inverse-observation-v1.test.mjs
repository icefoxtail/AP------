// R1-b tests: the tool-neutral inverse-observation packet (prepare -> freeze -> bind). No provider and no AI observer is ever called.
// EVERY observation record in this file is a HAND-MADE FIXTURE written from what the figure shows; none is a real AI observation.
// Capture sources (recorded in the log lines R1B_CAPTURE_SOURCES / R1B_REAL):
//   FIXTURE  = HAND_BUILT_CAPTURE_REAL_PNG: a capture object written by this test around a REAL L1 COMPOSED svg and REAL Chrome PNGs of those bytes
//              (plans P: a right triangle with a circle, two lines and a right-angle mark; Q: the L1 base triangle with repeated tick texts).
//              It has no Archive row: archiveRowSha256 and friends are labelled fixture hashes. It exercises everything the module reads.
//   REAL R1-a = test R: the real measureArchiveTypographyPolicy -> L1 -> captureArchiveCandidate path (real engine.html, LOCAL_ONLY, real Chrome).
// plan, model and identity are always real (the real SymPy worker, specFor and assetIdentity); composed is the real L1 result.
// Cases marked INJECTED edit files or objects after the fact to reach an axis that honest inputs cannot reach.
// The module is imported lazily so that every case fails on its own while the module does not exist.
import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {objectSha,bytesSha,canonicalJson,fileRef} from '../../pipeline-core/canonical.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {specFor} from '../production/phase2.mjs';
import {requestedProfileTypographyPolicy} from '../production/display-envelope.mjs';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {node,pointNode} from './construction-v1-fixture.mjs';

const root=fileURLToPath(new URL('../../../../',import.meta.url));
const MODULE_URL=new URL('../production/archive-inverse-observation-v1.mjs',import.meta.url);
const CAPTURE_MODULE_URL=new URL('../production/construction-archive-capture-v1.mjs',import.meta.url);
const load=()=>import(MODULE_URL.href);
const HASH=/^sha256:[0-9a-f]{64}$/;
const FLAGS={numericAccuracy:'OUT_OF_SCOPE_PRIMITIVE_OBSERVER',qualification:'NOT_RUN',publication:'NOT_RUN',productionAuthorized:false};
const PACKET_FILES=['context.png','image.png','instructions.md','observation.schema.json','packet.json'];
const CATEGORIES=['labels','segments','lines','circles','rightAngles'];
const RECORD='archive-inverse-observation-record-v1';
const rect=(width,height)=>({x:20,y:30,width,height});
// The L1-test fixture observation: a hand-written typography policy (NOT an Archive measurement), large class, base font 20 px, display scale 0.5625.
const FIXTURE_OBSERVATION={status:'PASS',synthetic:false,runtime:'playwright-chromium',profiles:[['small',126,105],['medium',174,145],['large',216,180],['full',384,320]].map(([sizeClass,width,height])=>({sizeClass,status:'PASS',imageRect:rect(width,height),naturalWidth:384,naturalHeight:320}))};
const policy=requestedProfileTypographyPolicy({requestedSizeClass:'large',intrinsicSvg:{width:384,height:320},observation:FIXTURE_OBSERVATION});
const identityOf=n=>assetIdentity('r1b_unit_exam|'+n,'SOLUTION_VISUAL','decisive-relation');
const modelOf=async graph=>{const response=await pythonWorker({action:'construction',graph});assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;};
const runDir=tag=>{const dir=path.join(root,'.tmp/archive',`r1b-${tag}-${crypto.randomUUID()}`);fs.mkdirSync(dir,{recursive:true});return dir;};
const relOf=file=>path.relative(root,file).replaceAll('\\','/');
const read=file=>fs.readFileSync(file);
const clone=value=>JSON.parse(JSON.stringify(value));

// Plan P: a right triangle (right angle at A) whose circumcircle has its centre at the midpoint M of the hypotenuse; two displayed lines, one of which
// passes through the labelled point M besides its two defining points. Off the axes on purpose. The 560x440 canvas is what the L1 layout needs here.
const P_GRAPH={schemaVersion:'construction-spike-v1',nodes:[pointNode('A',-2,-1),pointNode('B',4,-1),pointNode('C',-2,3),node('M','MIDPOINT',['B','C'],'POINT'),node('lineBC','LINE_THROUGH',['B','C'],'LINE'),node('lineAM','LINE_THROUGH',['A','M'],'LINE'),node('circM','CIRCLE_THROUGH_POINT',['M','B'],'CIRCLE')]};
const P_PLAN={capability:'construction-spike-v1',caption:'직각삼각형과 외접원',mathPlan:P_GRAPH,displaySegments:[{id:'sAB',refs:['A','B']},{id:'sCA',refs:['C','A']}],displayLines:['lineBC','lineAM'],rightAngles:[{id:'raA',refs:['B','A','C']}],coordinateLabels:['A','B','C'],coordinateCanvas:{width:560,height:440}};
// Plan Q: the L1 base triangle; its tick texts 2 and 4 each appear on both axes. M's coordinate is not labelled: M sits on the x-axis tick 2, so a
// coordinate label there would need a leader through the tick and its text (the layout refuses that since leaders are required from 20 px).
const Q_GRAPH={schemaVersion:'construction-spike-v1',nodes:[pointNode('A',0,0),pointNode('B',4,0),pointNode('C',0,3),node('M','MIDPOINT',['A','B'],'POINT')]};
const Q_PLAN={capability:'construction-spike-v1',caption:'삼각형과 중점',mathPlan:Q_GRAPH,displaySegments:[{id:'sAB',refs:['A','B']},{id:'sBC',refs:['B','C']},{id:'sCA',refs:['C','A']},{id:'sCM',refs:['C','M']}],coordinateLabels:['A','B','C']};
// What a careful reader sees in each figure, written by hand (not taken from the module). Texts keep the typographic minus the engine draws.
const P_SEEN={
  labels:['x','y','5','−2','2','4','M','A','(−2,−1)','B','(4,−1)','C','(−2,3)'],
  segments:[['A','B'],['C','A']],lines:[['B','C','M'],['A','M']],circles:[{center:'M',through:['A','B','C']}],rightAngles:['A']
};
const Q_SEEN={
  labels:['x','y','2','4','2','4','A','(0,0)','B','(4,0)','C','(0,3)','M'],
  segments:[['A','B'],['B','C'],['C','A'],['C','M']],lines:[],circles:[],rightAngles:[]
};
// Real R1-a triangle (Bx=6, as in the R1-a tests), seen at the medium class.
const R_SEEN={
  labels:['x','y','5','−2','2','4','A','(0,0)','B','(6,0)','C','(0,3)','M','(3,0)'],
  segments:[['A','B'],['B','C'],['C','A'],['C','M']],lines:[],circles:[],rightAngles:[]
};

const OBSERVER={agentKind:'claude-code',model:'hand-made-fixture',sessionRef:'r1b-unit-test',isolation:'INSTRUCTED_NOT_ENFORCED',inputsRead:['image.png','context.png','instructions.md','observation.schema.json','packet.json']};
function recordOf(packetSha256,seen,{observer={},extra={}}={}){
  return {schemaVersion:RECORD,packetSha256,observer:{...OBSERVER,...observer},observedAt:'2026-10-20T00:00:00.000Z',
    labels:seen.labels.map(text=>({text})),segments:seen.segments.map(between=>({between})),lines:seen.lines.map(through=>({through})),
    circles:seen.circles.map(circle=>({center:circle.center,through:circle.through})),rightAngles:seen.rightAngles.map(at=>({at})),
    otherMarks:[],readability:[],unobservable:[],...extra};
}
// The expectation the module must derive, written out again here: normalized, sorted, and hashed as documented.
const norm=text=>text.normalize('NFC').replace(/\s+/gu,'').replace(/[\u2010\u2011\u2212\ufe63\uff0d]/gu,'-');
const byKey=items=>[...items].sort((a,b)=>{const x=canonicalJson(a),y=canonicalJson(b);return x<y?-1:x>y?1:0;});
const unique=names=>[...new Set(names.map(norm))].sort();
const expectationOf=seen=>({
  labels:seen.labels.map(norm).sort(),
  segments:byKey(seen.segments.map(pair=>pair.map(norm).sort())),
  lines:byKey(seen.lines.map(through=>({through:unique(through)}))),
  circles:byKey(seen.circles.map(circle=>({center:circle.center===null?null:norm(circle.center),through:unique(circle.through)}))),
  rightAngles:byKey(seen.rightAngles.map(at=>({at:norm(at)})))
});

let shared,contextPromise,apiPromise;
const api=()=>apiPromise??=load();
after(async()=>{await shared?.close();});
const SHOT_STYLE=(width,height)=>`display:block;width:${width}px;height:${height}px`;
// Real Chrome PNGs of the L1 bytes at the policy display size: the image alone, and the image inside a padded page.
async function renderPngs(composed){
  const {width,height}=composed.renderedLayout.display,svg=composed.svg.replace('<svg','<svg style="'+SHOT_STYLE(width,height)+'"');
  const page=await shared.newPage({viewport:{width:Math.ceil(width)+80,height:Math.ceil(height)+80}});
  try{
    await page.setContent('<body style="margin:0;background:#fff"><div style="padding:40px">'+svg+'</div></body>');
    const image=await page.locator('svg').first().screenshot(),context=await page.screenshot();
    return {image,context,page:context};
  }finally{await page.close();}
}
async function fixtureCapture(composed,tag){
  const dir=runDir('fx-'+tag),pngs=await renderPngs(composed),paths={},sha={};
  for(const [name,bytes] of Object.entries(pngs)){const file=path.join(dir,name+'.png');fs.writeFileSync(file,bytes);paths[name]=relOf(file);sha[name]=bytesSha(bytes);}
  const fake=label=>bytesSha(Buffer.from('r1b-fixture-hash:'+label));
  // there is no Archive here: the "raw row" is a stand-in file, only so that the module's row-hash binding has a real file to read
  const rowBytes=Buffer.from(JSON.stringify({fixture:'HAND_BUILT_CAPTURE_REAL_PNG',note:'not an Archive row',svgSha256:composed.lineage.svgSha256}),'utf8'),rowFile=path.join(dir,'fixture-row.json');fs.writeFileSync(rowFile,rowBytes);
  return {schemaVersion:'construction-archive-capture-v1',status:'ARCHIVE_BOUND',detail:null,
    lineage:{l1SvgSha256:composed.lineage.svgSha256,policySha256:fake('policy'),candidateBankSha256:fake('bank'),assetPath:null,assetResponseSha256:composed.lineage.svgSha256,archiveRowSha256:bytesSha(rowBytes),screenshotSha256s:sha,matrixSha256:fake('matrix'),engineSha256:fake('engine')},
    paths:{runRoot:relOf(dir),asset:null,candidateBank:null,matrix:null,archiveRow:relOf(rowFile),screenshots:paths},
    checks:{network:'PASS',assetResponse:'PASS',bankResponse:'PASS',naturalSize:'PASS',sizeClass:'PASS',displayScale:'PASS',layout:'PASS'},
    evidenceIntegrity:'NO_CALLER_HOOK',uidAuthority:'STRUCTURAL_ONLY',independentInverseObservation:'NOT_RUN',qualification:'NOT_RUN',publication:'NOT_RUN',productionAuthorized:false,fixtureClassification:'HAND_BUILT_CAPTURE_REAL_PNG'};
}
const context=()=>contextPromise??=(async()=>{
  await api();shared=await launchBrowser();
  const identity=identityOf(1),build=async(plan,graph,tag)=>{
    const model=await modelOf(graph),composed=await composeConstructionCandidate({plan,model,identity,typographyPolicy:policy,browser:shared});
    assert.equal(composed.status,'COMPOSED',tag+JSON.stringify(composed.detail));
    return {plan,model,identity,composed,capture:await fixtureCapture(composed,tag),seen:tag==='P'?P_SEEN:Q_SEEN};
  };
  const P=await build(P_PLAN,P_GRAPH,'P'),Q=await build(Q_PLAN,Q_GRAPH,'Q');
  console.log('R1B_CAPTURE_SOURCES='+JSON.stringify({P:P.capture.fixtureClassification,Q:Q.capture.fixtureClassification,R:'REAL_R1A_PATH (test R)'}));
  return {P,Q};
})();

const bindArgs=(c,packet,observationPath,extra={})=>({capture:c.capture,composed:c.composed,plan:c.plan,model:c.model,identity:c.identity,packetDir:packet.packetDir,observationPath,...extra});
async function packetFor(c,tag){
  const {prepareInverseObservationPacket}=await api(),packetDir=path.join(runDir(tag),'packet'),result=await prepareInverseObservationPacket({capture:c.capture,packetDir});
  assert.equal(result.status,'PACKET_READY',JSON.stringify(result.detail));
  return {packetDir:result.packetDir,result};
}
const writeObservation=(packet,content,name='observation.json')=>{const file=path.join(packet.packetDir,name);fs.writeFileSync(file,typeof content==='string'||Buffer.isBuffer(content)?content:JSON.stringify(content,null,2));return file;};
// prepare -> write -> freeze -> bind. `record` is an object, a function of packetSha256, or raw text/bytes. Returns every step.
async function flow(c,tag,record,{freeze=true,bindExtra={}}={}){
  const {freezeInverseObservation,bindInverseObservation}=await api(),packet=await packetFor(c,tag);
  const content=typeof record==='function'?record(packet.result.packetSha256):record,observationPath=writeObservation(packet,content);
  const frozen=freeze?await freezeInverseObservation({packetDir:packet.packetDir,observationPath}):null;
  const receipt=await bindInverseObservation(bindArgs(c,packet,observationPath,bindExtra));
  return {packet,observationPath,frozen,receipt};
}
const consistentFlow=(c,tag,seen=c.seen,options)=>flow(c,tag,sha=>recordOf(sha,seen),options);
function assertFlags(result){for(const [key,value] of Object.entries(FLAGS))assert.equal(result[key],value,key);}
const empty=()=>Object.fromEntries(CATEGORIES.map(key=>[key,[]]));
function assertDiscrepancy(receipt,{missing={},unexpected={}}){
  assert.equal(receipt.status,'OBSERVED_DISCREPANCY',JSON.stringify(receipt.detail??receipt.missing));assertFlags(receipt);
  assert.deepEqual(receipt.missing,{...empty(),...missing});assert.deepEqual(receipt.unexpected,{...empty(),...unexpected});
}
const treeOf=dir=>Object.fromEntries(fs.readdirSync(dir).sort().map(name=>[name,bytesSha(read(path.join(dir,name)))]));

test('N1 exactly what the spec shows -> OBSERVED_CONSISTENT; every receipt hash equals the real file or object, and the packet carries only the five documented files',async()=>{
  const {P:c}=await context(),{INSTRUCTIONS,OBSERVATION_SCHEMA}=await api();
  const {packet,observationPath,frozen,receipt}=await consistentFlow(c,'n1');
  assert.deepEqual(fs.readdirSync(packet.packetDir).sort(),[...PACKET_FILES,'observation.freeze.json','observation.json'].sort(),'packet + the observer record + the freeze file, nothing else');
  // packet, re-read independently of the module
  const packetJson=JSON.parse(read(path.join(packet.packetDir,'packet.json')).toString('utf8'));
  assert.deepEqual(Object.keys(packetJson).sort(),['manifest','packetSha256']);
  assert.equal(packetJson.packetSha256,objectSha(packetJson.manifest));assert.equal(packet.result.packetSha256,packetJson.packetSha256);assert.deepEqual(packet.result.manifest,packetJson.manifest);
  assert.equal(packet.result.packetDir,path.resolve(packet.packetDir));
  const {manifest}=packetJson;
  assert.deepEqual(Object.keys(manifest).sort(),['captureBinding','files','instructionsSha256','schemaSha256','schemaVersion']);
  assert.equal(manifest.schemaVersion,'archive-inverse-observation-packet-v1');
  assert.deepEqual(manifest.files.map(file=>file.name),['context.png','image.png','instructions.md','observation.schema.json']);
  for(const file of manifest.files){const bytes=read(path.join(packet.packetDir,file.name));assert.equal(file.bytes,bytes.length,file.name);assert.equal(file.sha256,bytesSha(bytes),file.name);}
  const L=c.capture.lineage,shotBytes=name=>read(path.join(root,c.capture.paths.screenshots[name]));
  assert.deepEqual(manifest.captureBinding,{l1SvgSha256:L.l1SvgSha256,assetResponseSha256:L.assetResponseSha256,archiveRowSha256:L.archiveRowSha256,screenshotSha256s:L.screenshotSha256s});
  assert.equal(L.l1SvgSha256,c.composed.lineage.svgSha256);
  assert.deepEqual(read(path.join(packet.packetDir,'image.png')),shotBytes('image'),'the packet image is the captured image, byte for byte');
  assert.deepEqual(read(path.join(packet.packetDir,'context.png')),shotBytes('context'));
  assert.equal(read(path.join(packet.packetDir,'instructions.md')).toString('utf8'),INSTRUCTIONS);assert.equal(manifest.instructionsSha256,bytesSha(Buffer.from(INSTRUCTIONS,'utf8')));
  assert.deepEqual(JSON.parse(read(path.join(packet.packetDir,'observation.schema.json')).toString('utf8')),OBSERVATION_SCHEMA);
  assert.equal(manifest.schemaSha256,bytesSha(read(path.join(packet.packetDir,'observation.schema.json'))));
  // freeze, re-read independently
  const freezeFile=path.join(packet.packetDir,'observation.freeze.json'),freezeBytes=read(freezeFile),freeze=JSON.parse(freezeBytes.toString('utf8'));
  assert.equal(frozen.status,'FROZEN');assertFlags(frozen);assert.equal(frozen.observationSha256,bytesSha(read(observationPath)));
  assert.deepEqual(frozen.freezeRef,{path:freezeFile,bytes:freezeBytes.length,sha256:bytesSha(freezeBytes)});
  assert.equal(freeze.packetSha256,packetJson.packetSha256);assert.equal(freeze.observationSha256,frozen.observationSha256);assert.ok(!Number.isNaN(Date.parse(freeze.frozenAt)));
  // receipt
  assert.equal(receipt.schemaVersion,'archive-inverse-observation-binding-v1');assert.equal(receipt.status,'OBSERVED_CONSISTENT',JSON.stringify(receipt.detail??receipt.missing));assertFlags(receipt);
  assert.equal(receipt.packetSha256,packetJson.packetSha256);assert.equal(receipt.observationSha256,bytesSha(read(observationPath)));assert.equal(receipt.freezeSha256,bytesSha(freezeBytes));
  assert.deepEqual(receipt.observer,JSON.parse(read(observationPath).toString('utf8')).observer,'the observer block is echoed as written');
  assert.deepEqual(receipt.captureBinding,manifest.captureBinding);
  assert.equal(receipt.expectationSha256,objectSha(expectationOf(P_SEEN)),'the expectation hash is that of the hand-derived normalized expectation');
  assert.deepEqual(receipt.missing,empty());assert.deepEqual(receipt.unexpected,empty());
  const E=expectationOf(P_SEEN);assert.deepEqual(receipt.matched,E,'every expected item matched');
  assert.deepEqual(receipt.readabilityIssues,[]);assert.deepEqual(receipt.unobservable,[]);assert.deepEqual(receipt.otherMarks,[]);
  assert.equal(receipt.isolationEnforcementVerified,false);
  for(const key of ['expectation','svg','plan','model','spec'])assert.ok(!Object.hasOwn(receipt,key),key);
});

test('N1b readability, unobservable and otherMarks are passed through unjudged; a UTF-8 BOM and key order do not matter',async()=>{
  const {P:c}=await context();
  const extra={otherMarks:[{description:'coordinate axes with tick marks'}],readability:[{issue:'label touches a line',target:'M'},{issue:'text is small',target:null}],unobservable:[{description:'the tick mark under 5 is too faint'}]};
  // the record is written with a UTF-8 BOM (PowerShell does) and with its keys in reverse order
  const {receipt}=await flow(c,'n1b',sha=>'\ufeff'+JSON.stringify(Object.fromEntries(Object.entries(recordOf(sha,P_SEEN,{extra})).reverse()),null,1));
  assert.equal(receipt.status,'OBSERVED_CONSISTENT',JSON.stringify(receipt.detail??receipt.missing));
  assert.deepEqual(receipt.readabilityIssues,extra.readability);assert.deepEqual(receipt.unobservable,extra.unobservable);assert.deepEqual(receipt.otherMarks,extra.otherMarks);
});

test('N1c the packet is a function of the capture alone: preparing twice gives identical files and packetSha256; bind changes nothing on disk and is repeatable',async()=>{
  const {P:c,Q}=await context();
  const a=await packetFor(c,'n1c-a'),b=await packetFor(c,'n1c-b'),other=await packetFor(Q,'n1c-q');
  assert.equal(a.result.packetSha256,b.result.packetSha256);assert.deepEqual(treeOf(a.packetDir),treeOf(b.packetDir));
  assert.notEqual(other.result.packetSha256,a.result.packetSha256,'another capture is another packet');
  const {bindInverseObservation}=await api(),run=await consistentFlow(c,'n1c-c'),before=treeOf(run.packet.packetDir),obsBefore=bytesSha(read(run.observationPath));
  const again=await bindInverseObservation(bindArgs(c,run.packet,run.observationPath));
  assert.deepEqual(again,run.receipt);assert.deepEqual(treeOf(run.packet.packetDir),before);assert.equal(bytesSha(read(run.observationPath)),obsBefore);
});

test('N2 the verdict does not depend on the tool: codex, antigravity, claude-code and other give the same comparison',async()=>{
  const {P:c}=await context(),receipts={};
  for(const agentKind of ['codex','antigravity','claude-code','other']){
    const {receipt}=await flow(c,'n2-'+agentKind,sha=>recordOf(sha,P_SEEN,{observer:{agentKind,model:agentKind+'-model',sessionRef:agentKind+'-session'}}));
    assert.equal(receipt.status,'OBSERVED_CONSISTENT',agentKind+JSON.stringify(receipt.detail));assert.equal(receipt.observer.agentKind,agentKind);receipts[agentKind]=receipt;
  }
  const strip=receipt=>({...receipt,observer:null,observationSha256:null,freezeSha256:null});
  const [first,...rest]=Object.values(receipts);
  for(const receipt of rest)assert.deepEqual(strip(receipt),strip(first));
  // the same wrong record is wrong for everyone, in the same way
  const wrong={...P_SEEN,labels:P_SEEN.labels.filter(text=>text!=='M')};
  const verdicts=[];
  for(const agentKind of ['codex','antigravity','claude-code']){const {receipt}=await flow(c,'n2w-'+agentKind,sha=>recordOf(sha,wrong,{observer:{agentKind}}));verdicts.push(strip(receipt));}
  for(const verdict of verdicts){assert.equal(verdict.status,'OBSERVED_DISCREPANCY');assert.deepEqual(verdict,verdicts[0]);}
  // source scan: an agentKind literal appears once (the enum) and is never compared or switched on
  const source=fs.readFileSync(fileURLToPath(MODULE_URL),'utf8');
  for(const kind of ['codex','claude-code','antigravity'])assert.equal(source.split("'"+kind+"'").length-1,1,kind+' appears once, in the enum');
  assert.equal(/agentKind\s*[!=]==?\s*['"`]/.test(source),false);assert.equal(/switch\s*\([^)]*agentKind/.test(source),false);assert.equal(/agentKind\s*\?/.test(source),false);
});

test('N3 labels that differ only by spaces or minus characters match; set members and segment ends may be in any order',async()=>{
  const {P:c}=await context();
  const seen={...P_SEEN,
    labels:[' x','y ','5','-2','2','4','M','A','( -2 , -1 )','B','(4,\u2011 1)','C','(\u22122,\u00a03)'],// ASCII hyphen, U+2011, U+2212, a no-break space, plain spaces
    segments:[['B','A'],['A','C']],lines:[['M','C','B'],['M','A']],circles:[{center:'M',through:['C','B','A']}]};
  const {receipt}=await consistentFlow(c,'n3',seen);
  assert.equal(receipt.status,'OBSERVED_CONSISTENT',JSON.stringify(receipt.missing)+JSON.stringify(receipt.unexpected));
  assert.equal(receipt.expectationSha256,objectSha(expectationOf(P_SEEN)));
});

test('N3b normalization is NFC + whitespace + minus signs only: anything else stays a discrepancy',async()=>{
  const {normalizeObservedText}=await api();
  assert.equal(normalizeObservedText('e\u0301'),'\u00e9');assert.equal(normalizeObservedText(' ( \u22122 ,\t3 ) '),'(-2,3)');
  for(const minus of ['\u2010','\u2011','\u2212','\ufe63','\uff0d','-'])assert.equal(normalizeObservedText('a'+minus+'b'),'a-b');
  assert.notEqual(normalizeObservedText('a\u2013b'),'a-b','an en dash is not a minus');assert.notEqual(normalizeObservedText('a\u2014b'),'a-b');
  assert.notEqual(normalizeObservedText('\uff08\u22122\uff09'),'(-2)','full-width parentheses are not ASCII parentheses (NFC, not NFKC)');
  assert.notEqual(normalizeObservedText('A'),normalizeObservedText('a'),'case is kept');assert.notEqual(normalizeObservedText('O'),normalizeObservedText('0'));
  assert.notEqual(normalizeObservedText('\u00b2'),normalizeObservedText('2'),'a superscript two is not a two');
  const {P:c}=await context();
  const seen={...P_SEEN,labels:P_SEEN.labels.map(text=>text==='A'?'a':text==='−2'?'\u20132':text==='(4,−1)'?'\uff084,\u22121\uff09':text)};
  const {receipt}=await consistentFlow(c,'n3b',seen);
  assertDiscrepancy(receipt,{missing:{labels:['(4,-1)','-2','A'].sort()},unexpected:{labels:['(4,-1)'.replace('(','\uff08').replace(')','\uff09'),'a','\u20132'].map(norm).sort()}});
});

test('N4 repeated texts count by occurrence: Q shows 2 and 4 on both axes',async()=>{
  const {Q:c}=await context();
  assert.deepEqual(Q_SEEN.labels.filter(text=>text==='2'),['2','2']);
  const full=await consistentFlow(c,'n4');
  assert.equal(full.receipt.status,'OBSERVED_CONSISTENT',JSON.stringify(full.receipt.missing)+JSON.stringify(full.receipt.unexpected));
  assert.equal(full.receipt.expectationSha256,objectSha(expectationOf(Q_SEEN)));assert.deepEqual(full.receipt.matched.labels,Q_SEEN.labels.map(norm).sort());
  const once={...Q_SEEN,labels:Q_SEEN.labels.filter((text,index)=>Q_SEEN.labels.indexOf(text)===index)};
  const {receipt}=await consistentFlow(c,'n4b',once);
  assertDiscrepancy(receipt,{missing:{labels:['2','4']}});
  const extra=await consistentFlow(c,'n4c',{...Q_SEEN,labels:[...Q_SEEN.labels,'A']});
  assertDiscrepancy(extra.receipt,{unexpected:{labels:['A']}});
});

test('E1 one label missing -> OBSERVED_DISCREPANCY with exactly that label in missing; each category reaches its own missing axis',async()=>{
  const {P:c}=await context();
  const {receipt}=await consistentFlow(c,'e1',{...P_SEEN,labels:P_SEEN.labels.filter(text=>text!=='M')});
  assertDiscrepancy(receipt,{missing:{labels:['M']}});assert.equal(receipt.matched.labels.length,P_SEEN.labels.length-1);
  const drops={
    labels:seen=>({...seen,labels:seen.labels.filter(text=>text!=='(−2,3)')}),
    segments:seen=>({...seen,segments:seen.segments.slice(1)}),
    lines:seen=>({...seen,lines:seen.lines.slice(0,1)}),
    circles:seen=>({...seen,circles:[]}),
    rightAngles:seen=>({...seen,rightAngles:[]})
  };
  const expected={labels:['(-2,3)'],segments:[['A','B']],lines:[{through:['A','M']}],circles:[{center:'M',through:['A','B','C']}],rightAngles:[{at:'A'}]};
  for(const category of CATEGORIES){
    const run=await consistentFlow(c,'e1-'+category,drops[category](P_SEEN));
    assertDiscrepancy(run.receipt,{missing:{[category]:expected[category]}});
  }
});

test('E2 a segment that is not drawn -> OBSERVED_DISCREPANCY with it in unexpected; each category reaches its own unexpected axis',async()=>{
  const {P:c}=await context();
  const {receipt}=await consistentFlow(c,'e2',{...P_SEEN,segments:[...P_SEEN.segments,['B','M']]});
  assertDiscrepancy(receipt,{unexpected:{segments:[['B','M']]}});
  const adds={
    labels:seen=>({...seen,labels:[...seen.labels,'N']}),
    lines:seen=>({...seen,lines:[...seen.lines,['A','B']]}),
    circles:seen=>({...seen,circles:[...seen.circles,{center:null,through:['A']}]}),
    rightAngles:seen=>({...seen,rightAngles:[...seen.rightAngles,'B']})
  };
  const expected={labels:['N'],lines:[{through:['A','B']}],circles:[{center:null,through:['A']}],rightAngles:[{at:'B'}]};
  for(const category of Object.keys(adds)){
    const run=await consistentFlow(c,'e2-'+category,adds[category](P_SEEN));
    assertDiscrepancy(run.receipt,{unexpected:{[category]:expected[category]}});
  }
});

test('E2b set semantics are exact: a line that omits an incidental labelled point, a circle with the wrong centre or an incomplete through set are discrepancies, not matches',async()=>{
  const {P:c}=await context();
  // line BC also passes through the labelled midpoint M: omitting M is a miss (no subset relaxation)
  const omitM=await consistentFlow(c,'e2b-line',{...P_SEEN,lines:[['B','C'],['A','M']]});
  assertDiscrepancy(omitM.receipt,{missing:{lines:[{through:['B','C','M']}]},unexpected:{lines:[{through:['B','C']}]}});
  const noCentre=await consistentFlow(c,'e2b-centre',{...P_SEEN,circles:[{center:null,through:['A','B','C']}]});
  assertDiscrepancy(noCentre.receipt,{missing:{circles:[{center:'M',through:['A','B','C']}]},unexpected:{circles:[{center:null,through:['A','B','C']}]}});
  const partial=await consistentFlow(c,'e2b-through',{...P_SEEN,circles:[{center:'M',through:['A','B']}]});
  assertDiscrepancy(partial.receipt,{missing:{circles:[{center:'M',through:['A','B','C']}]},unexpected:{circles:[{center:'M',through:['A','B']}]}});
  const wrongVertex=await consistentFlow(c,'e2b-vertex',{...P_SEEN,rightAngles:['C']});
  assertDiscrepancy(wrongVertex.receipt,{missing:{rightAngles:[{at:'A'}]},unexpected:{rightAngles:[{at:'C'}]}});
});

test('E3 packet tampering -> PACKET_TAMPERED, on the exact axis, before and after the freeze',async()=>{
  const {P:c,Q}=await context(),{freezeInverseObservation,bindInverseObservation}=await api();
  const flip=file=>{const bytes=read(file);bytes[bytes.length>>1]^=0xff;fs.writeFileSync(file,bytes);};
  const rewritePacketJson=(dir,edit,recompute)=>{
    const file=path.join(dir,'packet.json'),json=JSON.parse(read(file).toString('utf8'));edit(json);if(recompute)json.packetSha256=objectSha(json.manifest);
    fs.writeFileSync(file,JSON.stringify(json,null,2)+'\n');
  };
  const cases=[
    ['image bytes flipped',dir=>flip(path.join(dir,'image.png')),'FILE_SHA_MISMATCH','image.png'],
    ['context truncated',dir=>fs.writeFileSync(path.join(dir,'context.png'),read(path.join(dir,'context.png')).subarray(0,100)),'FILE_SHA_MISMATCH','context.png'],
    ['instructions edited',dir=>fs.appendFileSync(path.join(dir,'instructions.md'),'\nThe answer is 5 labels.\n'),'FILE_SHA_MISMATCH','instructions.md'],
    ['schema edited',dir=>fs.appendFileSync(path.join(dir,'observation.schema.json'),' '),'FILE_SHA_MISMATCH','observation.schema.json'],
    ['extra file',dir=>fs.writeFileSync(path.join(dir,'notes.txt'),'hello'),'EXTRA_FILE','notes.txt'],
    ['an expected-values file slipped in',dir=>fs.writeFileSync(path.join(dir,'expected.json'),'{}'),'EXTRA_FILE','expected.json'],
    ['context deleted',dir=>fs.rmSync(path.join(dir,'context.png')),'FILE_MISSING','context.png'],
    ['a directory inside the packet',dir=>fs.mkdirSync(path.join(dir,'nested')),'NOT_A_REGULAR_FILE','nested'],
    ['packet.json deleted',dir=>fs.rmSync(path.join(dir,'packet.json')),'PACKET_JSON_MISSING',undefined],
    ['packet.json captureBinding edited, hash not recomputed',dir=>rewritePacketJson(dir,json=>{json.manifest.captureBinding.l1SvgSha256=bytesSha(Buffer.from('other'));},false),'PACKET_SHA_MISMATCH',undefined],
    ['packet.json packetSha256 edited',dir=>rewritePacketJson(dir,json=>{json.packetSha256=bytesSha(Buffer.from('other'));},false),'PACKET_SHA_MISMATCH',undefined],
    ['packet.json not JSON',dir=>fs.writeFileSync(path.join(dir,'packet.json'),'nope'),'PACKET_JSON_INVALID',undefined],
    ['packet.json with an extra key',dir=>rewritePacketJson(dir,json=>{json.verdict='PASS';},false),'PACKET_JSON_INVALID',undefined],
    ['INJECTED self-consistent forged manifest with another captureBinding',dir=>rewritePacketJson(dir,json=>{json.manifest.captureBinding.archiveRowSha256=bytesSha(Buffer.from('forged'));},true),'CAPTURE_BINDING_MISMATCH',undefined],
    ['INJECTED another image with a re-hashed, self-consistent manifest',dir=>{
      const bytes=read(path.join(dir,'image.png')).subarray(0,200),file=path.join(dir,'image.png');fs.writeFileSync(file,bytes);
      rewritePacketJson(dir,json=>{const entry=json.manifest.files.find(item=>item.name==='image.png');entry.bytes=bytes.length;entry.sha256=bytesSha(bytes);},true);
    },'IMAGE_NOT_CAPTURE','image.png']
  ];
  for(const [name,tamper,reason,file] of cases){
    // after the freeze: bind refuses
    const packet=await packetFor(c,'e3'),observationPath=writeObservation(packet,recordOf(packet.result.packetSha256,P_SEEN));
    const frozen=await freezeInverseObservation({packetDir:packet.packetDir,observationPath});assert.equal(frozen.status,'FROZEN',name);
    tamper(packet.packetDir);
    const receipt=await bindInverseObservation(bindArgs(c,packet,observationPath));
    assert.equal(receipt.status,'PACKET_TAMPERED',name+JSON.stringify(receipt.detail));assert.equal(receipt.detail.reason,reason,name);assertFlags(receipt);
    if(file!==undefined)assert.equal(receipt.detail.name,file,name);
    for(const key of ['matched','missing','unexpected','expectationSha256'])assert.ok(!Object.hasOwn(receipt,key),name+' '+key);
    // before the freeze: freeze refuses (it never freezes a record against a damaged packet) and writes no freeze file.
    // The capture binding is the one thing freeze cannot see (it takes no capture): bind checks it.
    const early=await packetFor(c,'e3-early'),earlyObservation=writeObservation(early,recordOf(early.result.packetSha256,P_SEEN));
    tamper(early.packetDir);
    const refused=await freezeInverseObservation({packetDir:early.packetDir,observationPath:earlyObservation});
    if(reason==='CAPTURE_BINDING_MISMATCH')assert.equal(refused.status,'FROZEN',name+': freeze looks at the packet alone');
    else{assert.equal(refused.status,'PACKET_TAMPERED',name);assert.equal(refused.detail.reason,reason,name);assert.equal(fs.existsSync(path.join(early.packetDir,'observation.freeze.json')),false,name);}
  }
  // a packet of another capture does not pass for this one
  const other=await packetFor(Q,'e3-other'),otherObservation=writeObservation(other,recordOf(other.result.packetSha256,Q_SEEN));
  assert.equal((await freezeInverseObservation({packetDir:other.packetDir,observationPath:otherObservation})).status,'FROZEN');
  const swapped=await bindInverseObservation(bindArgs(c,other,otherObservation));
  assert.equal(swapped.status,'PACKET_TAMPERED');assert.equal(swapped.detail.reason,'CAPTURE_BINDING_MISMATCH');
  // a missing or wrong packet directory
  const missing=await bindInverseObservation(bindArgs(c,{packetDir:path.join(runDir('e3-none'),'absent')},otherObservation));
  assert.equal(missing.status,'PACKET_TAMPERED');assert.equal(missing.detail.reason,'PACKET_DIR_MISSING');
});

test('E4 freeze: no freeze -> OBSERVATION_NOT_FROZEN; a change after the freeze -> OBSERVATION_CHANGED_AFTER_FREEZE; a second freeze -> FREEZE_EXISTS',async()=>{
  const {P:c,Q}=await context(),{freezeInverseObservation,bindInverseObservation}=await api();
  const packet=await packetFor(c,'e4'),observationPath=writeObservation(packet,recordOf(packet.result.packetSha256,P_SEEN));
  const notFrozen=await bindInverseObservation(bindArgs(c,packet,observationPath));
  assert.equal(notFrozen.status,'OBSERVATION_NOT_FROZEN',JSON.stringify(notFrozen.detail));assert.equal(notFrozen.detail.reason,'NO_FREEZE_FILE');assertFlags(notFrozen);assert.ok(!Object.hasOwn(notFrozen,'matched'));
  const frozen=await freezeInverseObservation({packetDir:packet.packetDir,observationPath});assert.equal(frozen.status,'FROZEN');
  const freezeFile=path.join(packet.packetDir,'observation.freeze.json'),freezeSha=bytesSha(read(freezeFile));
  assert.equal((await bindInverseObservation(bindArgs(c,packet,observationPath))).status,'OBSERVED_CONSISTENT');
  // a second freeze, with the same or a changed record, is refused and leaves the freeze file alone
  const again=await freezeInverseObservation({packetDir:packet.packetDir,observationPath});
  assert.equal(again.status,'FREEZE_EXISTS');assertFlags(again);assert.equal(bytesSha(read(freezeFile)),freezeSha);
  // INJECTED change after the freeze: one more space, then the record rewritten to say something else
  const original=read(observationPath);
  fs.appendFileSync(observationPath,' ');
  const spaced=await bindInverseObservation(bindArgs(c,packet,observationPath));
  assert.equal(spaced.status,'OBSERVATION_CHANGED_AFTER_FREEZE');assert.equal(spaced.detail.frozen,frozen.observationSha256);assert.equal(spaced.detail.current,bytesSha(read(observationPath)));
  fs.writeFileSync(observationPath,JSON.stringify(recordOf(packet.result.packetSha256,{...P_SEEN,labels:P_SEEN.labels.slice(1)})));
  assert.equal((await bindInverseObservation(bindArgs(c,packet,observationPath))).status,'OBSERVATION_CHANGED_AFTER_FREEZE');
  const refrozen=await freezeInverseObservation({packetDir:packet.packetDir,observationPath});assert.equal(refrozen.status,'FREEZE_EXISTS','a changed record cannot be frozen over the old freeze');assert.equal(bytesSha(read(freezeFile)),freezeSha);
  fs.rmSync(observationPath);
  const gone=await bindInverseObservation(bindArgs(c,packet,observationPath));assert.equal(gone.status,'OBSERVATION_CHANGED_AFTER_FREEZE');assert.equal(gone.detail.reason,'OBSERVATION_FILE_MISSING');
  fs.writeFileSync(observationPath,original);
  assert.equal((await bindInverseObservation(bindArgs(c,packet,observationPath))).status,'OBSERVED_CONSISTENT','the frozen bytes restored are the frozen record again');
  // INJECTED: a freeze file that belongs to another packet is not a freeze of this one
  const other=await packetFor(Q,'e4-other'),otherObservation=writeObservation(other,recordOf(other.result.packetSha256,Q_SEEN));
  await freezeInverseObservation({packetDir:other.packetDir,observationPath:otherObservation});
  const target=await packetFor(c,'e4-target'),targetObservation=writeObservation(target,recordOf(target.result.packetSha256,P_SEEN));
  fs.copyFileSync(path.join(other.packetDir,'observation.freeze.json'),path.join(target.packetDir,'observation.freeze.json'));
  const foreign=await bindInverseObservation(bindArgs(c,target,targetObservation));
  assert.equal(foreign.status,'OBSERVATION_NOT_FROZEN');assert.equal(foreign.detail.reason,'FREEZE_FOR_OTHER_PACKET');
  // a broken freeze file is not a freeze either
  fs.writeFileSync(path.join(target.packetDir,'observation.freeze.json'),'{');
  assert.equal((await bindInverseObservation(bindArgs(c,target,targetObservation))).detail.reason,'FREEZE_UNREADABLE');
  // the observation file must exist and be small enough to freeze
  const noFile=await freezeInverseObservation({packetDir:(await packetFor(c,'e4-nofile')).packetDir,observationPath:path.join(runDir('e4-x'),'none.json')});
  assert.equal(noFile.status,'OBSERVATION_INVALID');assert.equal(noFile.detail.reason,'FILE_UNREADABLE');
  const big=await packetFor(c,'e4-big'),bigFile=writeObservation(big,Buffer.alloc(300000,0x20));
  const tooBig=await freezeInverseObservation({packetDir:big.packetDir,observationPath:bigFile});
  assert.equal(tooBig.status,'OBSERVATION_INVALID');assert.equal(tooBig.detail.reason,'TOO_LARGE');assert.equal(fs.existsSync(path.join(big.packetDir,'observation.freeze.json')),false);
});

test('E5 inputsRead outside the packet -> OBSERVER_INPUT_OUT_OF_PACKET; packet file names, in any subset and order, pass',async()=>{
  const {P:c}=await context();
  const cases=[['a path outside the packet',['image.png','../secrets.txt']],['the repository',['archive/engine.html']],['the generator source',['image.png','context.png','svg-source.svg']],['an absolute path',['/etc/passwd']],['the record itself',['observation.json']],['a case variant',['Image.PNG']]];
  for(const [name,inputsRead] of cases){
    const {receipt}=await flow(c,'e5',sha=>recordOf(sha,P_SEEN,{observer:{inputsRead}}));
    assert.equal(receipt.status,'OBSERVER_INPUT_OUT_OF_PACKET',name+JSON.stringify(receipt.detail));assertFlags(receipt);
    assert.deepEqual(receipt.detail.names,inputsRead.filter(item=>!PACKET_FILES.includes(item)),name);
    for(const key of ['matched','missing','unexpected','expectationSha256'])assert.ok(!Object.hasOwn(receipt,key),name);
  }
  for(const inputsRead of [['image.png'],['packet.json','image.png'],[...PACKET_FILES].reverse()]){
    const {receipt}=await flow(c,'e5ok',sha=>recordOf(sha,P_SEEN,{observer:{inputsRead}}));
    assert.equal(receipt.status,'OBSERVED_CONSISTENT',JSON.stringify(inputsRead));assert.deepEqual(receipt.observer.inputsRead,inputsRead);
  }
  // the record names another packet
  const wrong=await flow(c,'e5-packet',()=>recordOf(bytesSha(Buffer.from('another packet')),P_SEEN));
  assert.equal(wrong.receipt.status,'OBSERVATION_PACKET_MISMATCH');assert.equal(wrong.receipt.detail.recorded,bytesSha(Buffer.from('another packet')));assert.equal(wrong.receipt.detail.packetSha256,wrong.packet.result.packetSha256);
});

test('E6 a verdict field, a field outside the schema or any other schema violation -> OBSERVATION_INVALID, on the exact path',async()=>{
  const {P:c}=await context();
  const text=value=>({text:value}),withLabels=(record,labels)=>({...record,labels});
  const cases=[
    ['verdict field',r=>({...r,verdict:'PASS'}),'UNKNOWN_FIELD','$.verdict'],
    ['status field',r=>({...r,status:'OBSERVED_CONSISTENT'}),'UNKNOWN_FIELD','$.status'],
    ['pass field',r=>({...r,pass:true}),'UNKNOWN_FIELD','$.pass'],
    ['a field on a label',r=>withLabels(r,[{text:'A',confidence:0.9}]),'UNKNOWN_FIELD','$.labels[0].confidence'],
    ['a field on the observer',r=>({...r,observer:{...r.observer,verdict:'ok'}}),'UNKNOWN_FIELD','$.observer.verdict'],
    ['a coordinate estimate on a label',r=>withLabels(r,[{text:'A',at:[1,2]}]),'UNKNOWN_FIELD','$.labels[0].at'],
    ['rightAngles missing',r=>{const {rightAngles,...rest}=r;return rest;},'MISSING_FIELD','$.rightAngles'],
    ['label text missing',r=>withLabels(r,[{}]),'MISSING_FIELD','$.labels[0].text'],
    ['another schemaVersion',r=>({...r,schemaVersion:'archive-inverse-observation-record-v2'}),'SCHEMA_VERSION','$.schemaVersion'],
    ['agentKind outside the enum',r=>({...r,observer:{...r.observer,agentKind:'gpt'}}),'ENUM','$.observer.agentKind'],
    ['isolation outside the enum',r=>({...r,observer:{...r.observer,isolation:'SANDBOXED'}}),'ENUM','$.observer.isolation'],
    ['labels is not an array',r=>({...r,labels:'A B C'}),'TYPE','$.labels'],
    ['a label that is a bare string',r=>withLabels(r,['A']),'NOT_AN_OBJECT','$.labels[0]'],
    ['a numeric label text',r=>withLabels(r,[{text:5}]),'TYPE','$.labels[0].text'],
    ['empty label text',r=>withLabels(r,[text('')]),'EMPTY','$.labels[0].text'],
    ['whitespace-only label text',r=>withLabels(r,[text(' \u00a0 ')]),'EMPTY_AFTER_NORMALIZATION','$.labels[0].text'],
    ['label text over the limit',r=>withLabels(r,[text('x'.repeat(121))]),'TOO_LONG','$.labels[0].text'],
    ['too many labels',r=>withLabels(r,Array.from({length:201},()=>text('x'))),'TOO_MANY','$.labels'],
    ['a control character in a label',r=>withLabels(r,[text('A\nB')]),'CONTROL_CHAR','$.labels[0].text'],
    ['observedAt is not ISO 8601',r=>({...r,observedAt:'yesterday'}),'FORMAT','$.observedAt'],
    ['observedAt is a real-looking but impossible date',r=>({...r,observedAt:'2026-13-45T25:61:61Z'}),'FORMAT','$.observedAt'],
    ['packetSha256 is malformed',r=>({...r,packetSha256:'abc'}),'FORMAT','$.packetSha256'],
    ['a segment with three ends',r=>({...r,segments:[{between:['A','B','C']}]}),'LENGTH','$.segments[0].between'],
    ['a segment with one end',r=>({...r,segments:[{between:['A']}]}),'LENGTH','$.segments[0].between'],
    ['a line through the same label twice, after normalization',r=>({...r,lines:[{through:['A','\u00a0A']}]}),'DUPLICATE','$.lines[0].through'],
    ['inputsRead empty',r=>({...r,observer:{...r.observer,inputsRead:[]}}),'TOO_FEW','$.observer.inputsRead'],
    ['inputsRead repeats a name',r=>({...r,observer:{...r.observer,inputsRead:['image.png','image.png']}}),'DUPLICATE','$.observer.inputsRead'],
    ['circle centre is a number',r=>({...r,circles:[{center:3,through:[]}]}),'TYPE','$.circles[0].center'],
    ['readability target is missing',r=>({...r,readability:[{issue:'blurry'}]}),'MISSING_FIELD','$.readability[0].target'],
    ['an issue longer than the limit',r=>({...r,readability:[{issue:'x'.repeat(501),target:null}]}),'TOO_LONG','$.readability[0].issue'],
    ['otherMarks with a verdict in it',r=>({...r,otherMarks:[{description:'axes',verdict:'ok'}]}),'UNKNOWN_FIELD','$.otherMarks[0].verdict'],
    ['unobservable is an object',r=>({...r,unobservable:{description:'x'}}),'TYPE','$.unobservable'],
    ['model over the limit',r=>({...r,observer:{...r.observer,model:'m'.repeat(101)}}),'TOO_LONG','$.observer.model'],
    ['an empty sessionRef',r=>({...r,observer:{...r.observer,sessionRef:''}}),'EMPTY','$.observer.sessionRef']
  ];
  for(const [name,edit,reason,at] of cases){
    const {frozen,receipt}=await flow(c,'e6',sha=>edit(recordOf(sha,P_SEEN)));
    assert.equal(frozen.status,'FROZEN',name+' (freeze records bytes only)');
    assert.equal(receipt.status,'OBSERVATION_INVALID',name+JSON.stringify(receipt.detail));assert.equal(receipt.detail.reason,reason,name);assert.equal(receipt.detail.path,at,name);assertFlags(receipt);
    for(const key of ['matched','missing','unexpected','expectationSha256'])assert.ok(!Object.hasOwn(receipt,key),name);
  }
  for(const [name,raw,reason] of [['not JSON','this is prose','NOT_JSON'],['a JSON array','[]','NOT_AN_OBJECT'],['JSON null','null','NOT_AN_OBJECT'],['invalid UTF-8',Buffer.from([0x7b,0xff,0xfe,0x7d]),'NOT_JSON'],['empty file',Buffer.from(' '),'NOT_JSON']]){
    const {receipt}=await flow(c,'e6raw',raw);
    assert.equal(receipt.status,'OBSERVATION_INVALID',name);assert.equal(receipt.detail.reason,reason,name);assert.equal(receipt.detail.path,'$',name);
  }
  // the limits are exactly the documented ones: the boundary values are valid
  const boundary=sha=>recordOf(sha,P_SEEN,{extra:{labels:Array.from({length:200},(_,index)=>text(index===0?'x'.repeat(120):'y'))}});
  const edge=await flow(c,'e6edge',boundary);assert.equal(edge.receipt.status,'OBSERVED_DISCREPANCY','200 labels of up to 120 characters are accepted (and then compared)');
});

test('E7 another plan, model, identity, spec or composed SVG -> EXPECTATION_LINEAGE_MISMATCH, on the exact axis; nothing is compared',async()=>{
  const {P:c,Q}=await context(),{bindInverseObservation}=await api();
  const run=await consistentFlow(c,'e7'),args=(extra={})=>({...bindArgs(c,run.packet,run.observationPath),...extra});
  assert.equal((await bindInverseObservation(args())).status,'OBSERVED_CONSISTENT');
  const forgedLineage=edit=>{const composed=clone(c.composed);edit(composed.lineage);return composed;};
  const cases=[
    ['another plan',args({plan:Q.plan}),'PLAN_SHA'],
    ['the same plan with one label changed',args({plan:{...c.plan,caption:c.plan.caption+'!'}}),'PLAN_SHA'],
    ['another model',args({model:Q.model}),'MODEL_SHA'],
    ['another identity (the spec id is the asset id)',args({identity:identityOf(2)}),'SPEC_SHA'],
    ['a forged spec hash in the lineage',args({composed:forgedLineage(lineage=>{lineage.specSha256=bytesSha(Buffer.from('forged'));})}),'SPEC_SHA'],
    ['a forged plan hash in the lineage',args({composed:forgedLineage(lineage=>{lineage.planSha256=bytesSha(Buffer.from('forged'));})}),'PLAN_SHA'],
    ['a forged model hash in the lineage',args({composed:forgedLineage(lineage=>{lineage.modelSha256=bytesSha(Buffer.from('forged'));})}),'MODEL_SHA'],
    ['a tampered identity field',args({identity:{...c.identity,visualAssetKey:bytesSha(Buffer.from('forged'))}}),'IDENTITY_INVALID'],
    ['an identity without fields',args({identity:{questionUid:c.identity.questionUid}}),'IDENTITY_INVALID'],
    ['plan, model and composed all of Q, capture of P',args({plan:Q.plan,model:Q.model,composed:Q.composed}),'SVG_NOT_CAPTURED'],
    ['composed svg bytes edited',args({composed:{...c.composed,svg:c.composed.svg+' '}}),'COMPOSED_SVG_SHA'],
    ['composed is not COMPOSED',args({composed:{...c.composed,status:'RENDERED_LAYOUT_FAIL'}}),'COMPOSED_INPUT_INVALID'],
    ['no composed',args({composed:undefined}),'COMPOSED_INPUT_INVALID'],
    ['no plan',args({plan:undefined}),'PLAN_NOT_CANONICAL'],
    ['no model',args({model:undefined}),'MODEL_NOT_CANONICAL']
  ];
  for(const [name,input,reason] of cases){
    const receipt=await bindInverseObservation(input);
    assert.equal(receipt.status,'EXPECTATION_LINEAGE_MISMATCH',name+JSON.stringify(receipt.detail));assert.equal(receipt.detail.reason,reason,name);assertFlags(receipt);
    for(const key of ['matched','missing','unexpected','expectationSha256'])assert.ok(!Object.hasOwn(receipt,key),name);
  }
  // the capture that does not match the packet or L1 is refused before the lineage
  const foreignCapture=clone(c.capture);foreignCapture.lineage.l1SvgSha256=Q.composed.lineage.svgSha256;
  const inconsistent=await bindInverseObservation(args({capture:foreignCapture}));
  assert.equal(inconsistent.status,'CAPTURE_INPUT_INVALID');assert.equal(inconsistent.detail.reason,'ASSET_RESPONSE_NOT_L1_BYTES');
  foreignCapture.lineage.assetResponseSha256=Q.composed.lineage.svgSha256;
  const swapped=await bindInverseObservation(args({capture:foreignCapture}));
  assert.equal(swapped.status,'PACKET_TAMPERED');assert.equal(swapped.detail.reason,'CAPTURE_BINDING_MISMATCH');
});

test('E9 INJECTED a forged composed with a consistent hash chain whose spec the module cannot map, or the engine cannot prepare -> EXPECTATION_UNAVAILABLE, never a silent skip',async()=>{
  const {P:c}=await context(),{bindInverseObservation}=await api(),run=await consistentFlow(c,'e9');
  // a graph plan: specFor builds a spec (FUNCTION_GRAPH objects) that no L1 SVG corresponds to; the lineage is forged to match it so that only the expectation step can refuse
  const forge=viewport=>{
    const plan={capability:'polynomial-spike-v1',caption:'forged graph plan',graphPlan:{family:'polynomial',coefficients:['0','0','1'],domain:[-1,1],viewport}},model={},spec=specFor(plan,model,c.identity.assetId);
    const composed={...c.composed,lineage:{...c.composed.lineage,planSha256:objectSha(plan),modelSha256:objectSha(model),specSha256:objectSha(spec)}};
    return bindInverseObservation({...bindArgs(c,run.packet,run.observationPath),composed,plan,model});
  };
  // Since Q1-G the polynomial graph spec is mapped (FUNCTION_GRAPH is not an observation category): the forged lineage must still never read as consistent.
  const forged=await forge([-3,3,-1,5]);
  assert.equal(forged.status,'OBSERVED_DISCREPANCY',JSON.stringify(forged.detail));assertFlags(forged);
  const failing=await forge([1,1,0,1]);
  assert.equal(failing.status,'EXPECTATION_UNAVAILABLE',JSON.stringify(failing.detail));assert.equal(failing.detail.reason,'PREPARE_NOT_OK');assert.equal(failing.detail.code,'INVALID_VIEWPORT');
  for(const key of ['matched','missing','unexpected','expectationSha256'])assert.ok(!Object.hasOwn(failing,key));
});

test('E8 a hook or otherwise unusable capture -> CAPTURE_INPUT_INVALID and no packet; an existing packet directory -> PACKET_DIR_EXISTS and nothing is overwritten',async()=>{
  const {P:c}=await context(),{prepareInverseObservationPacket,bindInverseObservation}=await api();
  const target=path.join(runDir('e8'),'packet');
  const bad=(name,capture,reason)=>prepareInverseObservationPacket({capture,packetDir:target}).then(result=>{
    assert.equal(result.status,'CAPTURE_INPUT_INVALID',name+JSON.stringify(result.detail));assert.equal(result.detail.reason,reason,name);assertFlags(result);assert.equal(fs.existsSync(target),false,name+': nothing is created on a refusal');
  });
  const edit=fn=>{const copy=clone(c.capture);fn(copy);return copy;};
  await bad('hook capture',edit(copy=>{copy.evidenceIntegrity='CALLER_HOOK_PRESENT';}),'EVIDENCE_NOT_NO_CALLER_HOOK');
  await bad('integrity flag missing',edit(copy=>{delete copy.evidenceIntegrity;}),'EVIDENCE_NOT_NO_CALLER_HOOK');
  await bad('not ARCHIVE_BOUND',edit(copy=>{copy.status='ARCHIVE_CAPTURE_FAIL';}),'STATUS_NOT_ARCHIVE_BOUND');
  await bad('another schema',edit(copy=>{copy.schemaVersion='construction-archive-capture-v0';}),'SCHEMA_VERSION');
  await bad('a check that is not PASS',edit(copy=>{copy.checks.layout='FAIL';}),'CHECKS_NOT_PASS');
  await bad('no checks',edit(copy=>{delete copy.checks;}),'CHECKS_NOT_PASS');
  await bad('not an object',null,'NOT_AN_OBJECT');
  await bad('no lineage',edit(copy=>{delete copy.lineage;}),'LINEAGE_MISSING');
  await bad('a malformed l1 hash',edit(copy=>{copy.lineage.l1SvgSha256='abc';}),'LINEAGE_HASH_INVALID');
  await bad('no image hash',edit(copy=>{delete copy.lineage.screenshotSha256s.image;}),'LINEAGE_HASH_INVALID');
  await bad('the Archive received other bytes than L1 made',edit(copy=>{copy.lineage.assetResponseSha256=bytesSha(Buffer.from('other bytes'));}),'ASSET_RESPONSE_NOT_L1_BYTES');
  await bad('no screenshot path',edit(copy=>{delete copy.paths.screenshots.image;}),'SCREENSHOT_PATH_INVALID');
  await bad('no raw Archive row path',edit(copy=>{copy.paths.archiveRow=null;}),'ARCHIVE_ROW_PATH_INVALID');
  await bad('a raw Archive row outside .tmp/archive',edit(copy=>{copy.paths.archiveRow='archive/engine.html';}),'ARCHIVE_ROW_PATH_SCOPE');
  await bad('a raw Archive row that is gone',edit(copy=>{copy.paths.archiveRow='.tmp/archive/r1b-absent/row.json';}),'ARCHIVE_ROW_UNREADABLE');
  await bad('a raw Archive row whose bytes changed (INJECTED)',edit(copy=>{
    const dir=runDir('e8-row'),file=path.join(dir,'row.json');fs.writeFileSync(file,Buffer.concat([read(path.join(root,c.capture.paths.archiveRow)),Buffer.from(' ')]));copy.paths.archiveRow=relOf(file);
  }),'ARCHIVE_ROW_SHA_MISMATCH');
  await bad('a screenshot outside .tmp/archive',edit(copy=>{copy.paths.screenshots.image='archive/engine.html';}),'SCREENSHOT_PATH_SCOPE');
  await bad('a path that climbs out',edit(copy=>{copy.paths.screenshots.image='.tmp/archive/../../package.json';}),'SCREENSHOT_UNREADABLE');
  await bad('a screenshot that is gone',edit(copy=>{copy.paths.screenshots.context='.tmp/archive/r1b-absent/context.png';}),'SCREENSHOT_UNREADABLE');
  await bad('a screenshot whose bytes changed (INJECTED)',edit(copy=>{
    const dir=runDir('e8-png'),file=path.join(dir,'image.png'),bytes=Buffer.from(read(path.join(root,c.capture.paths.screenshots.image)));bytes[bytes.length>>1]^=0xff;fs.writeFileSync(file,bytes);copy.paths.screenshots.image=relOf(file);
  }),'SCREENSHOT_SHA_MISMATCH');
  await bad('a screenshot that is not a PNG (INJECTED)',edit(copy=>{
    const dir=runDir('e8-txt'),file=path.join(dir,'context.png'),bytes=Buffer.from('not a png');fs.writeFileSync(file,bytes);copy.paths.screenshots.context=relOf(file);copy.lineage.screenshotSha256s.context=bytesSha(bytes);
  }),'SCREENSHOT_NOT_PNG');
  // bind refuses the same captures (shape only)
  const packet=await packetFor(c,'e8-bind'),observationPath=writeObservation(packet,recordOf(packet.result.packetSha256,P_SEEN));
  const hooked=await bindInverseObservation(bindArgs({...c,capture:edit(copy=>{copy.evidenceIntegrity='CALLER_HOOK_PRESENT';})},packet,observationPath));
  assert.equal(hooked.status,'CAPTURE_INPUT_INVALID');assert.equal(hooked.detail.reason,'EVIDENCE_NOT_NO_CALLER_HOOK');
  // an existing packet directory is never reused or overwritten
  const first=await prepareInverseObservationPacket({capture:c.capture,packetDir:target});assert.equal(first.status,'PACKET_READY');
  const before=treeOf(target);
  const second=await prepareInverseObservationPacket({capture:c.capture,packetDir:target});
  assert.equal(second.status,'PACKET_DIR_EXISTS');assertFlags(second);assert.deepEqual(treeOf(target),before);
  const emptyDir=path.join(runDir('e8-empty'),'packet');fs.mkdirSync(emptyDir);
  assert.equal((await prepareInverseObservationPacket({capture:c.capture,packetDir:emptyDir})).status,'PACKET_DIR_EXISTS');assert.deepEqual(fs.readdirSync(emptyDir),[]);
  const filePath=path.join(runDir('e8-file'),'packet');fs.writeFileSync(filePath,'a file');
  assert.equal((await prepareInverseObservationPacket({capture:c.capture,packetDir:filePath})).status,'PACKET_DIR_EXISTS');assert.equal(read(filePath).toString('utf8'),'a file');
  // a packet directory that has an observer record in it is also refused, even after a freeze
  const used=await consistentFlow(c,'e8-used');assert.equal((await prepareInverseObservationPacket({capture:c.capture,packetDir:used.packet.packetDir})).status,'PACKET_DIR_EXISTS');
  // not a path at all
  for(const packetDir of [undefined,'',5,null]){const result=await prepareInverseObservationPacket({capture:c.capture,packetDir});assert.equal(result.status,'PACKET_DIR_INVALID',String(packetDir));}
});

test('L1 no expected information reaches the observer: instructions, schema and manifest carry no plan, label list, SVG source or verdict',async()=>{
  const {P:c}=await context(),{INSTRUCTIONS,OBSERVATION_SCHEMA}=await api(),packet=await packetFor(c,'l1');
  const texts={instructions:INSTRUCTIONS,schema:JSON.stringify(OBSERVATION_SCHEMA),packetJson:read(path.join(packet.packetDir,'packet.json')).toString('utf8')};
  const secrets=[c.plan.caption,'lineBC','lineAM','circM','raA','sCA','sAB','mathPlan','LINE_THROUGH','MIDPOINT','construction-spike','(−2,−1)','(4,−1)','(−2,3)',
    c.composed.lineage.planSha256,c.composed.lineage.modelSha256,c.composed.lineage.specSha256,c.composed.lineage.typographyPolicySha256,c.identity.questionUid,c.identity.assetId,c.identity.visualAssetKey,
    ...Object.values(c.composed.lineage.fragmentSha256s),'<svg','<line','data-fragment-sha'];
  for(const [name,text] of Object.entries(texts))for(const secret of secrets)assert.equal(text.includes(secret),false,name+' leaks '+secret);
  assert.equal(JSON.parse(texts.packetJson).manifest.captureBinding.l1SvgSha256,c.composed.lineage.svgSha256,'only hashes of captured bytes are bound');
  for(const word of ['verdict','expected','pass'])assert.equal(Object.keys(JSON.parse(texts.schema).properties).includes(word),false);
  assert.equal(/\b(?:expect\w*|answer)\b/i.test(INSTRUCTIONS.replace(/PASS\/FAIL/g,'')),false,'the instructions name no expectation');
  // what the instructions DO ask of the observer
  for(const needle of ['labels','segments','lines','circles','rightAngles','otherMarks','readability','unobservable','observation.json','packetSha256','INSTRUCTED_NOT_ENFORCED','PASS','√(3)','x^(2)','image.png의 그림에서만'])assert.ok(INSTRUCTIONS.includes(needle),needle);
  assert.ok(Buffer.byteLength(INSTRUCTIONS,'utf8')<8192);
  // the observer record schema has no verdict-like field anywhere
  const names=new Set(),walk=value=>{if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object'){for(const [key,child] of Object.entries(value)){if(key==='properties')Object.keys(child).forEach(name=>names.add(name));walk(child);}}};walk(OBSERVATION_SCHEMA);
  for(const forbidden of ['status','verdict','pass','result','score','ok','correct','expected','x','y','coordinates'])assert.equal(names.has(forbidden),false,forbidden);
});

test('S the exported schema file matches the validator: documented limits and enums are the ones enforced',async()=>{
  const {OBSERVATION_SCHEMA,OBSERVATION_LIMITS}=await api(),schema=OBSERVATION_SCHEMA;
  assert.equal(schema.additionalProperties,false);assert.equal(schema.properties.schemaVersion.const,RECORD);
  assert.deepEqual(schema.required,Object.keys(schema.properties));
  assert.deepEqual(schema.properties.observer.properties.agentKind.enum,['codex','claude-code','antigravity','other']);
  assert.deepEqual(schema.properties.observer.properties.isolation.enum,['INSTRUCTED_NOT_ENFORCED','ENFORCED']);
  assert.equal(schema.properties.labels.maxItems,OBSERVATION_LIMITS.labels);assert.equal(schema.properties.labels.items.properties.text.maxLength,OBSERVATION_LIMITS.text);
  assert.equal(OBSERVATION_LIMITS.labels,200);assert.equal(OBSERVATION_LIMITS.text,120);assert.equal(OBSERVATION_LIMITS.fileBytes,262144);
  for(const key of ['labels','segments','lines','circles','rightAngles','otherMarks','readability','unobservable'])assert.equal(schema.properties[key].type,'array',key);
  for(const key of ['labels','segments','lines','circles','rightAngles','otherMarks','readability','unobservable'])assert.equal(schema.properties[key].additionalProperties,undefined);
  assert.ok(Object.isFrozen(OBSERVATION_LIMITS));
});

test('R real R1-a capture (measure -> L1 -> captureArchiveCandidate, real engine.html and Chrome) -> packet -> hand-made observation -> OBSERVED_CONSISTENT',async()=>{
  await context();
  const capture=await import(CAPTURE_MODULE_URL.href),sourcePath='archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',examUid=path.basename(sourcePath,'.js');
  const identity=assetIdentity(`${examUid}|1`,'SOLUTION_VISUAL','decisive-relation'),intrinsic={width:384,height:320};
  const graph={schemaVersion:'construction-spike-v1',nodes:[pointNode('A',0,0),pointNode('B',6,0),pointNode('C',0,3),node('M','MIDPOINT',['A','B'],'POINT')]};
  const plan={...Q_PLAN,coordinateLabels:['A','B','C','M'],caption:'기술 fixture 삼각형',mathPlan:graph},model=await modelOf(graph),common={identity,sourcePath,ordinal:1,requestedSizeClass:'medium'};
  const measured=await capture.measureArchiveTypographyPolicy({...common,intrinsicSvg:intrinsic,runId:'r1b-real-measure-'+crypto.randomUUID()});
  assert.equal(measured.status,'MEASURED',JSON.stringify(measured.detail));
  const composed=await composeConstructionCandidate({plan,model,identity,typographyPolicy:measured.policy,browser:shared});
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  const bound=await capture.captureArchiveCandidate({...common,composed,measuredPolicy:measured,alt:'기술 fixture: 삼각형과 중점(원 문항과 무관)',fixtureClassification:'CONTROLLED_TECHNICAL_FIXTURE',runId:'r1b-real-capture-'+crypto.randomUUID()});
  assert.equal(bound.status,'ARCHIVE_BOUND',JSON.stringify(bound.detail));assert.equal(bound.evidenceIntegrity,'NO_CALLER_HOOK');
  console.log('R1B_REAL='+JSON.stringify({captureSource:'REAL_R1A_PATH',screenshots:bound.paths.screenshots,archiveRow:bound.paths.archiveRow,screenshotSha256s:bound.lineage.screenshotSha256s}));
  const c={plan,model,identity,composed,capture:bound,seen:R_SEEN},{freezeInverseObservation,bindInverseObservation}=await api();
  const packet=await packetFor(c,'real'),observationPath=writeObservation(packet,recordOf(packet.result.packetSha256,R_SEEN,{observer:{model:'hand-made-fixture-for-real-capture'}}));
  assert.deepEqual(read(path.join(packet.packetDir,'image.png')),read(path.join(root,bound.paths.screenshots.image)),'the real captured image is in the packet, byte for byte');
  assert.deepEqual(packet.result.manifest.captureBinding,{l1SvgSha256:bound.lineage.l1SvgSha256,assetResponseSha256:bound.lineage.assetResponseSha256,archiveRowSha256:bound.lineage.archiveRowSha256,screenshotSha256s:bound.lineage.screenshotSha256s});
  assert.equal(packet.result.manifest.captureBinding.archiveRowSha256,fileRef(root,bound.paths.archiveRow).sha256,'bound to the real raw Archive row');
  assert.equal((await freezeInverseObservation({packetDir:packet.packetDir,observationPath})).status,'FROZEN');
  const receipt=await bindInverseObservation(bindArgs(c,packet,observationPath));
  assert.equal(receipt.status,'OBSERVED_CONSISTENT',JSON.stringify(receipt.missing)+JSON.stringify(receipt.unexpected)+JSON.stringify(receipt.detail));assertFlags(receipt);
  assert.equal(receipt.expectationSha256,objectSha(expectationOf(R_SEEN)));assert.equal(receipt.captureBinding.l1SvgSha256,composed.lineage.svgSha256);
});
