const { test } = require('node:test');
const assert = require('node:assert/strict');
const core = require('../archive/archive2-core.js');
const unit = require('../archive/unit-past-exams-core.js');
const base = {
  questionUid: 'qid_v1_' + 'a'.repeat(64), identityStatus: 'VERIFIED', sourceStatus: 'VERIFIED',
  sourceFile: 'original/middle/m1/fixture.js', sourceOrdinal: 1,
  taxonomyStatus: 'CONFIRMED', curriculumKey: '2022', courseKey: 'M1-1', L1: '수와 연산', L2: '정수와 유리수',
  effectiveBrowseGrade: '중1', curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true,
  reviewStatus: 'reviewed_pass', subUnitKey: 'M1-02-INTEGER_RATIONAL', metadataConflicts: []
};
for (const grade of ['중1','중2','중3','고1','고2','고3']) {
  test(`${grade}: A/B/D/E/F/G — optional absence, HOLD and difficulty conflict are BASIC PASS`, () => {
    for (const delta of [{}, {difficultyBucket:'UNKNOWN'},
      {l3Disposition:'HOLD',l4Disposition:'HOLD',foundationTaxonomyStatus:'HOLD',holdReasons:['L3_HOLD','L4_HOLD']},
      {rpmPathStatus:'RPM_PRIMARY_MIGRATION_GAP',holdReasons:['RPM_PRIMARY_MIGRATION_GAP']},
      {difficultyBucket:3}, {defaultSelectable:false}, {legacyLevelCompatibility:'BORDERLINE_REVIEW'},
      {legacyLevelCompatibility:'STRONG_CONFLICT'}, {metadataConflicts:['problemTypeKey','templateKey','difficultyBucket']}])
      assert.equal(core.basicEligibility({...base,effectiveBrowseGrade:grade,...delta}).ok,true,JSON.stringify(delta));
  });
}
test('C/H/I/J: L1/L2-only compose includes absent capabilities; only requested filters exclude them', () => {
  const pool=[base,{...base,questionUid:'qid_v1_'+'b'.repeat(64),difficultyBucket:3},
    {...base,questionUid:'qid_v1_'+'c'.repeat(64),difficultyBucket:2,metaFoundationPackVersion:'1.0.0',problemTypeKey:'PT_OK',l3CapabilityValid:true}];
  const paths=[core.pathKey(base,4)];
  const request={filters:{grade:"중1",primaryPaths:paths},rows:[{id:'basic',paths,count:3}]};
  assert.equal(core.selectBlueprint(pool,request).selected.length,3);
  assert.equal(core.capabilityMatch(base,{}),true);
  assert.equal(core.capabilityMatch(base,{difficultyBuckets:[2]}),false);
  assert.equal(core.capabilityMatch(pool[1],{difficultyBuckets:[3]}),true);
  assert.equal(core.capabilityMatch(pool[1],{difficultyBuckets:[4]}),false);
  assert.equal(core.matches(base,{L3:'mf:PT_OK'}),false);
  assert.equal(core.matches(pool[2],{L3:'mf:PT_OK'}),true); // L4 is optional even for L3 filtering.
  assert.equal(core.matches(pool[2],{L4:'mf:TPL_OK'}),false);
  assert.equal(core.capabilities(base).difficulty,false);
  assert.equal(unit.filterUnitRecords(pool).length,3);
});
test('K–R: actual source/solution/semantic/identity/parent/scope defects remain hard blocks', () => {
  for(const delta of [{identityStatus:'UNRESOLVED'},{sourceStatus:'HOLD'},{sourceIssueHold:true},
    {sourceQualityDisposition:'SOLUTION_REPAIR_REQUIRED'},{semanticDisposition:'HOLD'},
    {semanticDisposition:'ROUTE_OUT'},{reviewStatus:'HOLD'},{L1:''},{L2:''},
    {l1l2ParentValid:false},{basicTaxonomyStatus:'UNKNOWN'},{basicScopeDefaultSelectable:false},
    {curriculumApplicability:'SUPPLEMENTARY_OUTSIDE_CORE',defaultSelectable:false},
    {holdReasons:['SOURCE_OR_SOLUTION_ISSUE']},{holdReasons:['UNRECOGNIZED_HOLD']}])
    assert.equal(core.basicEligibility({...base,...delta}).ok,false,JSON.stringify(delta));
});
test('diagnostic migration requires positive evidence and preserves source and independent semantic holds', () => {
  const polluted={...base,metaFoundationPackId:'H1_FOUNDATION',reviewStatus:'HOLD',semanticDisposition:'HOLD',defaultSelectable:false,holdReasons:['L3_HOLD','L4_HOLD']};
  const migrated=core.projectBasicEligibility(polluted);
  assert.equal(core.basicEligibility(migrated).ok,true);
  assert.deepEqual(migrated.advancedHoldReasons,['L3_HOLD','L4_HOLD']);
  for(const delta of [{sourceIssueHold:true},{basicSemanticDisposition:'HOLD'},
    {holdReasons:['L3_HOLD','SOURCE_OR_SOLUTION_ISSUE']},{holdReasons:['UNRECOGNIZED_HOLD']},
    {semanticDisposition:'ROUTE_OUT'},{sourceHoldReason:'SOURCE_DRIFT'}])
    assert.equal(core.basicEligibility(core.projectBasicEligibility({...polluted,...delta})).ok,false);
});
test('invalid optional capabilities cannot satisfy an advanced filter but retain BASIC',()=>{
  const row={...base,metaFoundationPackVersion:'1',problemTypeKey:'BAD',templateKey:'BAD',l3CapabilityValid:false,l4CapabilityValid:false};
  assert.equal(core.basicEligibility(row).ok,true);
  assert.equal(core.matches(row,{L3:'mf:BAD'}),false);
  assert.equal(core.matches(row,{L4:'mf:BAD'}),false);
});

test('legacy M3 L4 gap scope migrates only through a canonical same-curriculum parent',()=>{
  const row={...base,curriculumKey:'2015',courseKey:'중3 수학',L1:'통계',L2:'대푯값과 산포도',L3:'대푯값',L4:'',
    metadataStatus:'approved_direct_tagging_with_foundation_gap',curriculumApplicability:'UNKNOWN',defaultSelectable:false};
  const scope={curriculumKey:'2015',courseKey:'M3-2',L1:'통계',L2:'대푯값과 산포도',curriculumApplicability:'DEFAULT_SCOPE',defaultSelectable:true};
  assert.equal(core.resolveBasicParentScope(row,[scope]).courseKey,'M3-2');
  assert.equal(core.resolveBasicParentScope({...row,L2:'없는 단원'},[scope]),null);
  assert.equal(core.resolveBasicParentScope({...row,curriculumKey:'2022'},[scope]),null);
  const projected=core.projectBasicEligibility(row,{basicScope:scope});
  assert.equal(core.basicEligibility(projected).ok,true);
  assert.equal(projected.L4,'');
  assert.equal(projected.difficultyBucket,undefined);
  assert.ok(projected.advancedHoldReasons.includes('LEGACY_L4_FOUNDATION_GAP'));
  assert.equal(core.basicEligibility(core.projectBasicEligibility({...row,sourceIssueHold:true},{basicScope:scope})).ok,false);
  assert.equal(core.basicEligibility(core.projectBasicEligibility(row)).ok,false); // no scope proof => no fabricated default
  const rpm={...base,L3:'canonical concept',L4:'',rpmCapabilityValid:false,rpmL3CapabilityValid:true,rpmL4CapabilityValid:false};
  assert.equal(core.capabilities(rpm).l3,true);
  assert.equal(core.capabilities(rpm).l4,false);
});

test('legacy unit consumer preserves actual runtime HARD blocks and capability availability',()=>{
  const cached={subUnitKey:'L2',curriculumApplicability:'DEFAULT_SCOPE',defaultSelectable:true,
    runtimeSelectable:true,basicEligibilityStatus:'PASS',difficultyBucket:3};
  assert.equal(unit.isAutomaticSelectable(cached),true);
  assert.equal(unit.isAutomaticSelectable({...cached,runtimeSelectable:false,basicEligibilityStatus:'BLOCKED'}),false);
  assert.equal(unit.isAutomaticSelectable({...cached,sourceQualityDisposition:'SOLUTION_REPAIR_REQUIRED'}),false);
  assert.equal(unit.isAutomaticSelectable({...cached,semanticDisposition:'HOLD'}),false);
  assert.equal(unit.isAutomaticSelectable({...cached,curriculumApplicability:'SUPPLEMENTARY_OUTSIDE_CORE'}),false);
  assert.equal(unit.filterUnitRecords([{...cached,problemTypeKey:'PT_UNVERIFIED',l3CapabilityValid:false}],{problemTypeKeys:['PT_UNVERIFIED']}).length,0);
  assert.equal(unit.getSubUnitOptions([cached])[0].difficulty['3'],1);
  assert.equal(unit.getDifficultySummary([cached])['3'],1);
});
