import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {buildAliasEvidence,courseGroup,coursesEquivalent,crossCurriculumScopes,evidenceConflict,unitFamily} from '../archive/tools/type-judgment/alias-evidence.mjs';
const context={records:[
 {questionUid:'a',standardCourse:'중2수학',standardUnitKey:'M2-01',sourceArchiveFile:'original/middle/m2/1mid/a.js'},
 {questionUid:'b',standardCourse:'수학',standardUnitKey:'M2-02',sourceArchiveFile:'original/middle/m2/1mid/b.js'},
 {questionUid:'c',standardCourse:'수학',standardUnitKey:'M3-01',sourceArchiveFile:'original/middle/m3/1mid/c.js'},
 {questionUid:'wrong',standardCourse:'중1 수학',standardUnitKey:'M2-05',sourceArchiveFile:'original/middle/m1/1mid/x.js'},
 {questionUid:'wrong-course',standardCourse:'중1 수학',standardUnitKey:'M2-05',sourceArchiveFile:'original/middle/m2/1mid/x.js'},
],registry:{bindingRows:[{standardCourse:'중2 수학',standardUnitKey:'M2-01',curriculum:'2015'}]}};
test('observed aliases are contextual and conflicts never become aliases',()=>{
 const e=buildAliasEvidence(context),scope=(course,unit='M2-01',curriculum='2015')=>({course,unit,curriculum});
 assert.equal(e.mismatchCount,2);assert.equal(e.groups.find(g=>g.id==='M2').evidenceQuestionCount,2);
 assert.equal(coursesEquivalent(scope('중2수학'),scope('중2 수학'),e),true);
 assert.equal(coursesEquivalent(scope('수학'),scope('수학','M3-01'),e),false);
 assert.equal(coursesEquivalent(scope('중1 수학'),scope('중2 수학'),e),false);
 assert.equal(coursesEquivalent(scope('수학'),scope('수학','M2-01','2022'),e),false);
 assert.equal(courseGroup(scope('invented'),e),null);
 assert.equal(e.observedSpellings.some(r=>r.value==='중1 수학'),true);
});
test('path and unit grade comparisons preserve high-school elective flexibility',()=>{
 assert.equal(unitFamily('M22-2-03'),'M2');assert.equal(unitFamily('RPM22-M3-L1-01'),'M3');
 assert.equal(evidenceConflict({standardUnitKey:'H15-M1-01',sourceArchiveFile:'original/high/h3/1mid/a.js'}),null);
 assert.equal(evidenceConflict({standardUnitKey:'H22-C-01',sourceArchiveFile:'original/middle/m2/1mid/a.js'}).reason,'PATH_UNIT_GRADE_MISMATCH');
 assert.equal(courseGroup({course:'중2수학',unit:'M2-01',sourceArchiveFile:'original/middle/m1/1mid/a.js'},buildAliasEvidence(context)),null);
});
test('second courseKey cannot introduce an explicit conflicting grade',()=>{
 const e=buildAliasEvidence({records:[{standardCourse:'중2 수학',courseKey:'M1-1',standardUnitKey:'M2-01',sourceArchiveFile:'original/middle/m2/1mid/a.js'}],registry:{bindingRows:[]}});
 assert.equal(e.groups[0].aliases.some(a=>a.value==='M1-1'),false);assert.equal(e.mismatchCount,1);
});
test('cross-curriculum candidates require an existing identical complete RPM leaf',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'alias-map-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const dir=path.join(root,'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0');fs.mkdirSync(dir,{recursive:true});
 const leaf={majorUnit:'A',midUnit:'B',l3:'C',l4:'D'};
 fs.writeFileSync(path.join(dir,'fixture.json'),JSON.stringify({records:[
  {id:'old',curriculum:'2015',scope:'M2-1',standardUnitKey:'M2-01',bindingStatus:'ACTIVE',rpmPath:leaf},
  {id:'new',curriculum:'2022',scope:'M2-1',standardUnitKey:'M22-2-01',bindingStatus:'ACTIVE',rpmPath:leaf},
  {id:'other',curriculum:'2022',scope:'M2-1',standardUnitKey:'M22-2-02',bindingStatus:'ACTIVE',rpmPath:{...leaf,l4:'Different'}},
  {id:'bad',curriculum:'2022',scope:'M2-1',standardUnitKey:'M22-2-03',bindingStatus:'HOLD',rpmPath:leaf},
 ]}));
 const result=crossCurriculumScopes({root},{curriculum:'2015',course:'M2-1',unit:'M2-01'});
 assert.equal(result.length,1);assert.equal(result[0].unit,'M22-2-01');assert.match(result[0].evidence,/#old:new$/);
 assert.deepEqual(crossCurriculumScopes({root},{curriculum:'2015',course:'UNSEEN_COURSE',unit:'M2-01'}),[]);
});

test('high courses sharing a key prefix stay separate and invalid-unit evidence is excluded',()=>{
 const records=[
  {standardCourse:'대수',standardUnitKey:'H22-A-01',sourceArchiveFile:'original/high/h2/1mid/a.js'},
  {standardCourse:'수학(상)',standardUnitKey:'H22-A-01',sourceArchiveFile:'original/high/h2/1mid/b.js'},
  {standardCourse:'공통수학1',standardUnitKey:'H22-A-09',sourceArchiveFile:'original/high/h1/1mid/c.js'},
  {standardCourse:'공통수학1',courseKey:'공통수학2',standardUnitKey:'H22-C-05',sourceArchiveFile:'original/high/h1/1mid/d.js'},
 ];
 const master=new Map(['H22-A-01','H22-C-05'].map(key=>[key,{key,keyType:'standardUnitKey',status:'active'}]));
 const e=buildAliasEvidence({records,master,registry:{bindingRows:[
  {standardCourse:'대수',standardUnitKey:'H22-A-01',status:'ACTIVE'},
  {standardCourse:'공통수학1',standardUnitKey:'H22-C-05',status:'ACTIVE'},
 ]}});
 assert.equal(e.mismatchCount,2);assert.equal(e.unresolvedCount,1);
 assert.equal(courseGroup({course:'공통수학1',unit:'H22-A-01'},e),null);
 assert.equal(coursesEquivalent({course:'대수',unit:'H22-A-01',curriculum:'2022'},{course:'수학(상)',unit:'H22-A-01',curriculum:'2022'},e),false);
 assert.equal(courseGroup({course:'공통수학2',unit:'H22-C-05'},e),null);
});
