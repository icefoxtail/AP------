import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {solveSolidFigure,solidFigureSpec,composeSolidFigurePanel} from '../production/solid-figure-v1.mjs';
import {composeCompositeCandidate} from '../production/composite-candidate-svg-v1.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {objectSha,fileRef} from '../../pipeline-core/canonical.mjs';
import {renderPlan} from '../production/render-plan.mjs';
const identity=assetIdentity('24_향림중_2학기_중간_중1_기출|9','PROBLEM_VISUAL');
const source='archive/assets/images/24_향림중_2학기_중간_중1_기출/q9.png';
const plain=()=>({capability:'solid-figure-v1',solids:[{id:'s1',kind:'PRISM',base:{kind:'POLYGON',points:[[0,0],[4,0],[4.8,2.5]]},height:3.5,names:{base:'DEF',top:'ABC'}}],caption:'삼각기둥'});
const figure=()=>({...plain(),problemSourceEdgeStyles:{scope:'PROBLEM_ONLY',sourceImageRef:fileRef(process.cwd(),source),edges:[{solid:'s1',from:'B',to:'E',stroke:'DASHED'},{solid:'s1',from:'D',to:'F',stroke:'SOLID'}]}});

test('source stroke reuses the same edges and leaves the entire automatic model and all endpoints unchanged',()=>{
  const base=plain(),model=solveSolidFigure(base),spec=solidFigureSpec(base,model),plan=figure(),optModel=solveSolidFigure(plan,{identity}),optSpec=solidFigureSpec(plan,optModel,{identity});
  assert.deepEqual(optModel,model);assert.deepEqual([model.solids[0].vertices.length,model.solids[0].edges.length,model.solids[0].faces.length],[6,9,5]);
  assert.equal(optSpec.prims.length,spec.prims.length);assert.deepEqual(optSpec.labels,spec.labels);
  for(let i=0;i<spec.prims.length;i++){
    const original=spec.prims[i],current=optSpec.prims[i];
    if(!current.sourceStroke)assert.deepEqual(current,original);
    else{assert.equal(current.computedVis,original.vis);const {sourceStroke,computedVis,...rest}=current;assert.deepEqual({...rest,vis:original.vis},original);}
  }
  assert.equal(optSpec.prims.filter(p=>p.sourceStroke).length,2);
});
test('default model/spec matches byte fingerprints verified against the immutable pre-feature implementation',()=>{
  // Compared directly with the module at 2b90b85dd848806ba62f844b85225db8bcae5ee3 before pinning these
  // canonical byte fingerprints; runtime tests need no network or old Git object hydration.
  const plan=plain(),model=solveSolidFigure(plan);
  assert.equal(objectSha(model),'sha256:c38230d3038b84a16c33b189d5481947c7bc37332a7794a127a3e364d73f43c4');
  assert.equal(objectSha(solidFigureSpec(plan,model)),'sha256:bfd3ad37ad08ee12f28caba8fa2cf341086eef7bddcc103c783fcd8013bb6d3a');
});
test('source strokes refuse default/solution identities, wrong PNG binding and arbitrary style or topology changes',()=>{
  assert.throws(()=>solveSolidFigure(figure()),/IDENTITY_REQUIRED/);
  assert.throws(()=>solveSolidFigure(figure(),{identity:assetIdentity(identity.questionUid,'SOLUTION_VISUAL')}),/IDENTITY_REQUIRED/);
  for(const [mutate,code] of [
    [p=>p.problemSourceEdgeStyles.sourceImageRef.sha256='sha256:'+'0'.repeat(64),'SOURCE_MISMATCH'],
    [p=>p.problemSourceEdgeStyles.sourceImageRef.path=source.replace('q9','q10'),'SOURCE_SCOPE'],
    [p=>p.problemSourceEdgeStyles.edges[0].to='F','NOT_AN_EDGE'],
    [p=>p.problemSourceEdgeStyles.edges[0].to='X','NOT_AN_EDGE'],
    [p=>p.problemSourceEdgeStyles.edges[1]={solid:'s1',from:'E',to:'B',stroke:'SOLID'},'DUPLICATE'],
    [p=>p.problemSourceEdgeStyles.edges[0].width=5,'ENTRY'],
    [p=>p.problemSourceEdgeStyles.edges[0].color='BLUE','ENTRY'],
    [p=>p.segments=[{from:'B',to:'E',style:'DASHED'}],'SHAPE_UNSUPPORTED']
  ]){const p=figure();mutate(p);assert.throws(()=>solveSolidFigure(p,{identity}),new RegExp(code));}
});
test('solution composer and general composite entrypoints refuse problem strokes before font/browser work',async()=>{
  const plan=figure(),model=solveSolidFigure(plan,{identity}),solution=assetIdentity(identity.questionUid,'SOLUTION_VISUAL'),policy={baseFontPx:20,displayScale:1};
  const result=await composeSolidFigurePanel({plan,model,identity:solution,typographyPolicy:policy});assert.equal(result.status,'SOLID_SPEC_ERROR');assert.match(result.detail.code,/IDENTITY_REQUIRED/);
  const composite=await composeCompositeCandidate({plan:{capability:'composite-panels-v1'},panels:[{plan,model}],identity,typographyPolicy:policy});assert.equal(composite.status,'PROBLEM_SOURCE_STROKE_STANDALONE_REQUIRED');
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'source-stroke-'));try{
    const r=await renderPlan({item:{sourcePath:'archive/exams/original/middle/m1/2mid/24_향림중_2학기_중간_중1_기출.js',ordinal:9,surface:'PROBLEM_VISUAL'},plan:{capability:'composite-panels-v1',panels:[{plan}]},outDir:out});assert.equal(r.status,'FAILED');assert.match(r.detail,/STANDALONE_REQUIRED/);
  }finally{fs.rmSync(out,{recursive:true,force:true});}
});

test('independent Python depth/stroke observer rejects source, geometry, coverage and styling tampering',()=>{
  // In-memory edge-only unit fixture from the production spec. It is not an engine SVG publication,
  // typography measurement, browser rendering or independent visual quality verdict.
  const python=String.raw`
import sys,json,math,xml.etree.ElementTree as ET
sys.path.insert(0,'archive/tools/geometry-equation/production')
import solid_figure_observer as o
d=json.load(sys.stdin);plan=d['plan'];spec=d['spec'];root=ET.Element(o.NS+'svg',{'data-visual-surface':'PROBLEM_VISUAL'} if plan.get('problemSourceEdgeStyles') else {})
for p in spec['prims']:
 if p.get('role')!='edge':continue
 attrs={k:str(p[k]) for k in ('id','x1','x2','y1','y2')};attrs.update({'data-role':'edge','data-solid':p['solid'],'data-edge':p['edge'],'data-vis':p['vis'],'stroke':p.get('testStroke','#111'),'stroke-width':str(p.get('testWidth',1.6))})
 if p['vis']=='hidden':attrs['stroke-dasharray']='5 4'
 if p.get('testDash'):attrs['stroke-dasharray']=p['testDash']
 if p.get('sourceStroke'):attrs.update({'data-source-stroke':p['sourceStroke'],'data-computed-vis':p['computedVis']})
 ET.SubElement(root,o.NS+'line',attrs)
try:
 o.set_view(o.plan_yaw(plan));solid=o.build_solid(plan['solids'][0]);styles=o.problem_source_styles(plan,[solid],d['identity'],root)
 points=[o.project(p) for _,p in solid['verts']];lines=list(root);S=spec['frame']['scale'];tx=min(float(e.get('x1')) for e in lines)-S*min(p[0] for p in points);ty=max(max(float(e.get('y1')),float(e.get('y2'))) for e in lines)+S*min(p[1] for p in points)
 px=lambda p:(tx+S*o.project(p)[0],ty-S*o.project(p)[1])
 errors=[];o.check_poly_edges(solid,root,px,S,errors,styles);print(json.dumps(errors))
except (ValueError,KeyError,TypeError) as e:print(json.dumps([str(e)]))
`;
  const audit=(plan,spec,who=identity)=>JSON.parse(execFileSync(process.env.GEOMETRY_PYTHON||'python',['-c',python],{input:JSON.stringify({plan,spec,identity:who}),encoding:'utf8'}));
  const plan=figure(),spec=solidFigureSpec(plan,solveSolidFigure(plan,{identity}),{identity});
  assert.deepEqual(audit(plan,spec),[]);
  for(const mutate of [
    s=>s.prims.find(p=>p.sourceStroke).computedVis='solid',
    s=>s.prims.find(p=>p.sourceStroke).vis='hidden',
    s=>s.prims.find(p=>p.sourceStroke).x1+=10,
    s=>s.prims.push(structuredClone(s.prims.find(p=>p.sourceStroke))),
    s=>s.prims.splice(s.prims.findIndex(p=>p.sourceStroke),1),
    s=>s.prims.find(p=>p.sourceStroke).testStroke='#f00',
    s=>s.prims.find(p=>p.sourceStroke).testWidth=5
  ]){const changed=structuredClone(spec);mutate(changed);assert.ok(audit(plan,changed).length,'tamper must fail');}
  assert.match(audit(plan,spec,assetIdentity(identity.questionUid,'SOLUTION_VISUAL')).join(','),/IDENTITY_REQUIRED/);
  const dashTamper=structuredClone(spec);dashTamper.prims.find(p=>p.sourceStroke==='DASHED').testDash='2 2';assert.match(audit(plan,dashTamper).join(','),/UNBOUNDED_DASH/);
  const base=plain(),defaultSpec=solidFigureSpec(base,solveSolidFigure(base));assert.deepEqual(audit(base,defaultSpec),[]);
  const changed=structuredClone(defaultSpec),edge=changed.prims.find(p=>p.edge==='EB');edge.vis='hidden';assert.match(audit(base,changed).join(','),/VISIBILITY_MISMATCH/);
});
