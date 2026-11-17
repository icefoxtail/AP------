import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {nativeLanes,prepareRegistration,checkRegistration} from '../tools/ci/archive-registration-writer.mjs';
import {BOUNDED_RENDERER_UI_INPUTS} from '../tools/4slot/bounded-renderer-ui-inputs.mjs';
import {seedSourceQualityHoldFixture} from './helpers/source-quality-hold-fixture.mjs';
// Real native lane dependency planner; synthetic producer output has no student authority.
const git=(r,...a)=>execFileSync('git',['-C',r,...a],{stdio:['ignore','pipe','pipe']}).toString().trim();
async function fixture(t){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'bounded-renderer-writer-')),root=path.join(dir,'repo'),work=path.join(dir,'work');fs.mkdirSync(root);t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const write=(p,v)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'?v:JSON.stringify(v)+'\n');};
 seedSourceQualityHoldFixture(root);
 for(const p of ['tools/ci/archive-pages-registration.paths','tools/ci/archive-meta-register-commit.paths','tools/ci/archive-meta-register-trigger-paths.txt'])write(p,'out/fixture.json\n');
 write('archive/data/svg-accessibility-index.js','globalThis.APSvgAccessibilityIndex={buildScope:{baseRef:"'+ 'a'.repeat(40)+'"}};\n');
 write('archive/data/item-4slot-index.json',{synthetic:true});write('out/barrier.json',{synthetic:true});
 for(const p of BOUNDED_RENDERER_UI_INPUTS.filter(p=>!p.endsWith('/')&&p!=='archive/data/svg-accessibility-index.js'))write(p,'SYNTHETIC RUNTIME '+p+'\n');
 git(root,'init','-q');git(root,'config','user.name','Synthetic');git(root,'config','user.email','synthetic@example.invalid');
 const commit=()=>{git(root,'add','-A');git(root,'commit','-qm','synthetic planner fixture');};commit();
 const native=nativeLanes(root).find(l=>l.id==='fourSlot');assert.equal(native.required,false,'existing optional policy unchanged');
 const lanes=[{id:'shared',inputs:[],outputs:['out/barrier.json'],required:true,commands:[]},{...native,commands:[]}];let executions=0;
 const execute=async({lane})=>{if(lane.id==='fourSlot'){executions++;write('archive/data/item-4slot-index.json',{synthetic:true,execution:executions});}return{advisories:[]};};
 const options={root,work,lanes,execute,env:{}};await prepareRegistration(options);commit();assert.equal(checkRegistration(options).needed,false);executions=0;
 return{root,write,commit,options,executions:()=>executions};
}
test('bounded input list is literal and contains only the exact four new evidence directories',()=>{assert.equal(BOUNDED_RENDERER_UI_INPUTS.length,new Set(BOUNDED_RENDERER_UI_INPUTS).size);assert(BOUNDED_RENDERER_UI_INPUTS.every(p=>!p.includes('*')));assert.deepEqual(BOUNDED_RENDERER_UI_INPUTS.filter(p=>p.endsWith('/')),['.archive-meta-register/4slot-m1s2-problem-renderer-continuity/','.archive-meta-register/4slot-m3s2-layout-continuity/','docs/operations/m1s2-problem-seven-ui-26fc-20261116/','docs/operations/m3s2-q16-layout-ui-26fc-20261116/']);});
for(const [name,p]of[
 ['new M1 sidecar','.archive-meta-register/4slot-m1s2-problem-renderer-continuity/synthetic.json'],
 ['new M3 sidecar','.archive-meta-register/4slot-m3s2-layout-continuity/synthetic.json'],
 ['student engine','archive/engine.html'],['capture implementation','tools/capture-m1s2-problem-surface.cjs'],
 ['M1 producer','tools/check-m1s2-problem-seven-browser.cjs'],['M3 fixture','tests/fixtures/archive-m3s2-q16-layout-ui.json'],
 ['captured original PNG','docs/operations/m1s2-problem-seven-ui-26fc-20261116/synthetic.png'],
 ['M3 visual reference','docs/operations/m3s2-q16-layout-ui-26fc-20261116/independent-visual-review.json'],
 ['actual loaded font','archive/vendor/nanum-myeongjo/OFL.txt']
])test(name+' reopens the native four-slot lane rather than NO_OP',async t=>{const f=await fixture(t);f.write(p,'SYNTHETIC CHANGED');f.commit();const check=checkRegistration(f.options);assert.equal(check.lanes.find(l=>l.id==='fourSlot').needed,true);assert.equal(check.lanes.find(l=>l.id==='shared').needed,false);await prepareRegistration(f.options);assert.equal(f.executions(),1);});
test('an unrelated document does not reopen the four-slot lane',async t=>{const f=await fixture(t);f.write('docs/operations/unrelated/synthetic.txt','SYNTHETIC OUTSIDE');f.commit();assert.equal(checkRegistration(f.options).needed,false);await prepareRegistration(f.options);assert.equal(f.executions(),0);});
test('removing an existing typed sidecar forces revalidation',async t=>{const f=await fixture(t),p='.archive-meta-register/4slot-m1s2-problem-renderer-continuity/synthetic.json';f.write(p,'SYNTHETIC');f.commit();await prepareRegistration(f.options);f.commit();fs.unlinkSync(path.join(f.root,p));f.commit();assert.equal(checkRegistration(f.options).lanes.find(l=>l.id==='fourSlot').needed,true);});
