export function fixture() {
  const pt = (key, status = 'ACTIVE', ownerPack = 'P') => ({ problemTypeKey: key, canonicalLabelKo: `이름 ${key}`, definition: `정의 ${key}`, status, ownerPack, aliases: [] });
  const tpl = (key, parent, status = 'ACTIVE') => ({ templateKey: key, parentProblemTypeKey: parent, canonicalLabelKo: `이름 ${key}`, definition: '풀이 정의', internalSkeleton: '풀이 구조', status, ownerPack: 'P' });
  const binding = (unit, sub, key, extra = {}) => ({ curriculum: '2015', standardCourse: '수학', standardUnitKey: unit, subUnitKey: sub, problemTypeKey: key, status: 'ACTIVE', ownerPack: 'P', ...extra });
  const registry = { status: 'ACTIVE', errors: [], activePacks: new Map([['P', {}]]),
    problemTypes: new Map([pt('PT_A'), pt('PT_B'), pt('PT_OLD', 'RETIRED'), pt('PT_UNOWNED', 'ACTIVE', 'OFF')].map(r => [r.problemTypeKey, r])),
    templates: new Map([tpl('TPL_A', 'PT_A'), tpl('TPL_A2', 'PT_A'), tpl('TPL_B', 'PT_B'), tpl('TPL_OLD', 'PT_A', 'RETIRED')].map(r => [r.templateKey, r])),
    bindingRows: [binding('U-01','S-01','PT_A'), binding('U-03',null,'PT_B'), binding('U-01','S-01','PT_OLD'), binding('U-01','S-01','PT_UNOWNED'), binding('U-01','S-01','PT_B',{standardCourse:'다른 과목'}), binding('U-01','S-01','PT_B',{curriculum:'2022'})] };
  const metadata = {questionUid:'q1',sourceArchiveFile:'fixture.js',sourceOrdinal:1,curriculum:'2015',standardCourse:'수학',standardUnitKey:'U-01',subUnitKey:'S-01',problemTypeKey:'PT_A',templateKey:'TPL_A',fieldStatus:{problemType:'approved_source',template:'approved_classification'}};
  const context = {registry, records:[metadata], packs:new Map([['P',{curricula:['2015'],standardCourses:['수학']}]]), aliases:[{alias:'기존 별칭',canonicalKey:'TPL_A'}],
    master:new Map([...['U-01','U-02','U-03'].map(key=>({key,keyType:'standardUnitKey',status:'active'})),{key:'S-01',keyType:'subUnitKey',standardUnitKey:'U-01',status:'active'},{key:'S-02',keyType:'subUnitKey',standardUnitKey:'U-01',status:'active'}].map(r=>[r.key,r]))};
  const exam = {exam:'archive/exams/fixture.js',sourceArchiveFile:'fixture.js',questions:[{content:'식 $x + 1 = 2$를 푸시오.',choices:['첫째 보기'],solution:'양변에서 1을 뺀다.'}],rows:[{questionUid:'q1',sourceOrdinal:1,metadata}]};
  const ledger = {schemaVersion:'type-judgment-ledger-v1',exam:exam.exam,entries:[{questionUid:'q1',sourceOrdinal:1,decision:'PICK',problemTypeKey:'PT_A',templateKey:'TPL_A',decisiveStep:'양변에서 1을 뺀다.',cue:'x+1=2'}]};
  return {context,exam,ledger};
}
