import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fixture } from './fixtures/type-judgment/context.mjs';
import { buildOptions, buildWorkload, integrity, formatMarkdown, runCli as optionsCli } from '../archive/tools/type-judgment/options.mjs';
import { writeOutput, parseArgs, readExam } from '../archive/tools/type-judgment/common.mjs';
import { validateLedger, compareLedgers, runCli as ledgerCli } from '../archive/tools/type-judgment/check-ledger.mjs';

test('broad options isolate course/curriculum, ACTIVE packs and children; approved samples only', () => {
  const {context} = fixture();
  context.records.push({...context.records[0],questionUid:'q2',fieldStatus:{problemType:'manual_review_pending',template:'manual_review_pending'}});
  const before = JSON.stringify(context.records);
  const result = buildOptions(context,{curriculum:'2015',course:'수학',unit:'U-01',sub:'S-01'});
  assert.equal(result.status,'BROAD'); assert.equal(result.candidates[0].bindingStatus,'EXACT'); assert.deepEqual(result.candidates.map(x=>x.key),['PT_A']);
  assert.deepEqual(result.candidates[0].templates.map(x=>x.key),['TPL_A','TPL_A2']);
  assert.deepEqual(result.candidates[0].representatives.map(x=>x.questionUid),['q1']);
  assert.equal(JSON.stringify(context.records),before);
});
test('unit-wide candidates carry binding debt; no invented adjacent expansion; invalid scope fails closed', () => {
  const {context}=fixture(), scope={curriculum:'2015',course:'수학',unit:'U-01',sub:'S-02'};
  assert.equal(buildOptions(context,scope).candidates[0].bindingStatus,'ALIAS');
  assert.equal(buildOptions(context,scope).candidates[0].bindingReason,'UNIT_WIDE');
  const result=buildOptions(context,{...scope,unit:'U-02',sub:null});
  assert.equal(result.status,'NO_CANDIDATES'); assert.equal(result.candidates.length,0);
  assert.deepEqual(result.candidateExpansion,[]);
  assert.equal(buildOptions(context,{...scope,sub:'UNREGISTERED'}).status,'INVALID_CANONICAL_SCOPE');
});
test('workload omits source text, deduplicates option sets, preserves missing metadata', () => {
  const {context,exam}=fixture(); exam.rows.push({...exam.rows[0],questionUid:'q2',sourceOrdinal:2},{questionUid:'q3',sourceOrdinal:3,metadata:null});
  const result=buildWorkload(context,exam);
  assert.equal(Object.keys(result.optionSets).length,1); assert.equal(result.rows[2].status,'MISSING_CANONICAL_METADATA');
  assert.ok(!JSON.stringify(result).includes(exam.questions[0].content));
  assert.ok(!JSON.stringify(result).includes('양변에서 1을 뺀다.'));
});
test('integrity failure remains advisory and visibly headed', () => {
  const {context}=fixture(); context.registry.status='UNAVAILABLE'; context.registry.errors=['HASH_STALE'];
  const result={...integrity(context),options:buildOptions(context,{curriculum:'2015',course:'수학',unit:'U-01',sub:null})};
  assert.equal(result.verified,false); assert.equal(result.options.candidates.length,1);
  assert.ok(formatMarkdown(result).startsWith('# 레지스트리 무결성 미확인'));
});
test('output cannot touch repository, symlink alias, existing file or another checkout', () => {
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'type-judgment-test-'));
  try {
    const repo=path.join(temp,'repo'); fs.mkdirSync(repo); fs.symlinkSync(repo,path.join(temp,'link'));
    assert.throws(()=>writeOutput('bad',path.join(repo,'out'),repo),/INSIDE_REPOSITORY/);
    assert.throws(()=>writeOutput('bad',path.join(temp,'link/out'),repo),/INSIDE_REPOSITORY/);
    const other=path.join(temp,'other');fs.mkdirSync(other);fs.writeFileSync(path.join(other,'.git'),'gitdir: external');
    assert.throws(()=>writeOutput('bad',path.join(other,'out'),repo),/INSIDE_REPOSITORY/);
    const out=path.join(temp,'out'); writeOutput('safe',out,repo); assert.equal(fs.readFileSync(out,'utf8'),'safe');
    assert.throws(()=>writeOutput('bad',out,repo),/EEXIST/);
  } finally { fs.rmSync(temp,{recursive:true,force:true}); }
});
test('CLI arguments reject ambiguity and bad format without reading source', () => {
  assert.throws(()=>parseArgs(['--x','one','--x','two'],['--x']),/DUPLICATE/);
  assert.throws(()=>optionsCli(['--exam','x','--course','x']),/CANONICAL_SCOPE_ONLY/);
  assert.throws(()=>optionsCli(['--format','yaml']),/FORMAT/);
  assert.throws(()=>ledgerCli([]),/usage/);
});
test('source loader checks canonical UID identity and refuses escaping archive symlinks', () => {
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'type-judgment-source-'));
  try {
    fs.mkdirSync(path.join(temp,'archive/exams'),{recursive:true});
    fs.writeFileSync(path.join(temp,'archive/exams/a.js'),'window.questionBank = [{content:"문항"}];');
    const context={root:temp,records:[]}; const exam=readExam(context,'a.js');
    assert.equal(exam.rows.length,1); assert.equal(exam.rows[0].metadata,null);
    context.records=[{sourceArchiveFile:'a.js',sourceOrdinal:1,questionUid:'wrong'}];
    assert.throws(()=>readExam(context,'a.js'),/IDENTITY_CONFLICT/);
    fs.writeFileSync(path.join(temp,'outside.js'),'');fs.symlinkSync(path.join(temp,'outside.js'),path.join(temp,'archive/exams/escape.js'));
    assert.throws(()=>readExam(context,'escape.js'),/OUTSIDE_ARCHIVE/);
  } finally {fs.rmSync(temp,{recursive:true,force:true});}
});
// Ledger fixtures intentionally contain only two PT/TPL definitions and one exam question.
function ledgerFixture() {
  const registry = {
    status: 'ACTIVE', errors: [], activePacks: new Map([['PACK', {}]]),
    problemTypes: new Map([
      ['PT_A', { status: 'ACTIVE', ownerPack: 'PACK', canonicalLabelKo: '기존 이름', aliases: ['기존 별칭'] }],
      ['PT_B', { status: 'ACTIVE', ownerPack: 'PACK' }],
    ]),
    templates: new Map([
      ['TPL_A', { status: 'ACTIVE', ownerPack: 'PACK', parentProblemTypeKey: 'PT_A' }],
      ['TPL_A2', { status: 'ACTIVE', ownerPack: 'PACK', parentProblemTypeKey: 'PT_A' }],
      ['TPL_B', { status: 'ACTIVE', ownerPack: 'PACK', parentProblemTypeKey: 'PT_B' }],
    ]),
    bindingRows: [{ status: 'ACTIVE', ownerPack: 'PACK', curriculum: '2015', standardCourse: '과목', standardUnitKey: 'U', subUnitKey: 'S', problemTypeKey: 'PT_A' }],
  };
  const context = { registry, packs: new Map([['PACK', { curricula: ['2015'], standardCourses: ['과목'] }]]), aliases: [{ alias: '합성 별칭', canonicalKey: 'TPL_B' }],
    master: new Map([['U', { keyType: 'standardUnitKey', status: 'active' }], ['S', { keyType: 'subUnitKey', status: 'active', parentKey: 'U' }]]) };
  const exam = { exam: 'archive/exams/fixture.js', sourceArchiveFile: 'fixture.js',
    questions: [{ content: '다음 $x + 1 = 2$를 푼다.', choices: ['다른 보기'], solution: '양변에서 1을 뺀다.' }],
    rows: [{ questionUid: 'qid_fixture', sourceOrdinal: 1, metadata: { curriculum: '2015', standardCourse: '과목', standardUnitKey: 'U', subUnitKey: 'S' } }] };
  const ledger = { schemaVersion: 'type-judgment-ledger-v1', exam: exam.exam, entries: [{ questionUid: 'qid_fixture', sourceOrdinal: 1, decision: 'PICK', problemTypeKey: 'PT_A', templateKey: 'TPL_A', decisiveStep: '양변에서 1을 뺀다.', cue: 'x+1=2' }] };
  return { context, exam, ledger };
}

test('ledger validates literal normalized evidence and reports binding debt without approval', () => {
  const { context, exam, ledger } = ledgerFixture();
  const check = validateLedger(context, ledger, exam);
  assert.equal(check.valid, true);
  assert.equal(check.rows[0].status, 'VALID_PICK');
  assert.equal(check.approval, 'NOT_EVALUATED');
  context.registry.bindingRows = [];
  assert.equal(validateLedger(context, ledger, exam).rows[0].status, 'NEEDS_BINDING');
  context.registry.status = 'UNAVAILABLE'; context.registry.errors = ['STALE'];
  assert.equal(validateLedger(context, ledger, exam).notice, '레지스트리 무결성 미확인');
});

test('ledger rejects identity, completeness, evidence and parent failures', () => {
  for (const mutate of [
    l => { l.entries[0].questionUid = 'other'; },
    l => { l.entries[0].sourceOrdinal = '1'; },
    l => { l.entries.push({ ...l.entries[0] }); },
    l => { l.entries = []; },
    l => { l.entries[0].cue = '없는 원문 구절'; },
    l => { l.entries[0].cue = '$ $ '; },
    l => { l.entries[0].templateKey = 'TPL_B'; },
    l => { l.entries[0].problemTypeKey = 'UNKNOWN'; },
    l => { l.entries[0].decisiveStep = '첫 줄\n둘째 줄'; },
    l => { l.entries[0].surprise = true; },
    l => { l.entries[0].decision = 'anything'; },
    l => { l.entries[0].decision = 'toString'; },
  ]) {
    const { context, exam, ledger } = ledgerFixture(); mutate(ledger);
    assert.equal(validateLedger(context, ledger, exam).valid, false);
  }
  const { context, exam, ledger } = ledgerFixture();
  exam.rows[0].metadata = null;
  assert.equal(validateLedger(context, ledger, exam).valid, false);
});

test('ledger NEW_KEY checks definitions, active parents and name/alias collisions', () => {
  const { context, exam, ledger } = ledgerFixture();
  const base = { questionUid: 'qid_fixture', sourceOrdinal: 1, decision: 'NEW_KEY', proposedName: 'TPL_NEW', parentProblemTypeKey: 'PT_A', definition: '새 풀이 순서', internalSkeleton: '첫 단계 다음 단계', decisiveStep: '양변에서 1을 뺀다.', cue: 'x + 1 = 2' };
  ledger.entries = [base];
  assert.equal(validateLedger(context, ledger, exam).valid, true);
  for (const proposedName of ['pt_a', '기존이름', '기존 별칭', '합성별칭']) {
    ledger.entries = [{ ...base, proposedName }];
    assert.equal(validateLedger(context, ledger, exam).valid, false);
  }
  ledger.entries = [{ ...base, definition: '' }];
  assert.equal(validateLedger(context, ledger, exam).valid, false);
  ledger.entries = [{ ...base, parentProblemTypeKey: 'MISSING' }];
  assert.equal(validateLedger(context, ledger, exam).valid, false);
});

test('ledger comparison covers every outcome and refuses invalid ledgers', () => {
  const { context, exam, ledger } = ledgerFixture();
  const other = structuredClone(ledger);
  assert.equal(compareLedgers(context, ledger, other, exam).counts.AGREE, 1);
  other.entries[0].templateKey = 'TPL_A2';
  assert.equal(compareLedgers(context, ledger, other, exam).counts.PT_ONLY, 1);
  other.entries[0].problemTypeKey = 'PT_B'; other.entries[0].templateKey = 'TPL_B';
  assert.equal(compareLedgers(context, ledger, other, exam).counts.DIFF, 1);
  const hold = { questionUid: 'qid_fixture', sourceOrdinal: 1, decision: 'HOLD', reason: '결정 단계 확인 필요' };
  other.entries = [hold];
  assert.equal(compareLedgers(context, ledger, other, exam).counts.ONE_HOLD, 1);
  ledger.entries = [{ ...hold }];
  assert.equal(compareLedgers(context, ledger, other, exam).counts.DIFF, 1);
  const proposed = { questionUid: 'qid_fixture', sourceOrdinal: 1, decision: 'NEW_KEY', proposedName: 'TPL_NEW', parentProblemTypeKey: 'PT_A', definition: '정의', internalSkeleton: '풀이 구조', decisiveStep: '양변에서 1을 뺀다.', cue: 'x+1=2' };
  ledger.entries = [{ ...proposed }]; other.entries = [{ ...proposed }];
  assert.equal(compareLedgers(context, ledger, other, exam).counts.BOTH_NEW_KEY, 1);
  other.entries = [];
  const invalid = compareLedgers(context, ledger, other, exam);
  assert.equal(invalid.valid, false); assert.deepEqual(invalid.rows, []);
});
test('options CLI returns advisory 0 or strict 1 on unverified registry', () => {
  const {context}=fixture();const temp=fs.mkdtempSync(path.join(os.tmpdir(),'type-judgment-cli-'));
  try {
    context.root=path.join(temp,'repo');fs.mkdirSync(context.root);
    context.registry.status='UNAVAILABLE';context.registry.errors=['HASH_STALE'];
    const args=['--curriculum','2015','--course','수학','--unit','U-01','--out',path.join(temp,'advisory.json')];
    assert.equal(optionsCli(args,context),0);
    assert.equal(optionsCli([...args.slice(0,-1),path.join(temp,'strict.json'),'--strict'],context),1);
    assert.equal(JSON.parse(fs.readFileSync(path.join(temp,'strict.json'))).heading,'레지스트리 무결성 미확인');
  } finally {fs.rmSync(temp,{recursive:true,force:true});}
});

test('ledger rejects disagreeing curriculum aliases but records course binding debt', () => {
  const { context, exam, ledger } = ledgerFixture();
  exam.rows[0].metadata.curriculumKey = '2022';
  let result = validateLedger(context, ledger, exam);
  assert.equal(result.valid, false);
  assert.ok(result.rows[0].errors.some(e => e.code === 'CANONICAL_CURRICULUM_ALIAS_INVALID'));
  exam.rows[0].metadata.curriculumKey = '2015';
  exam.rows[0].metadata.courseKey = '지원하지 않는 과목';
  result = validateLedger(context, ledger, exam);
  assert.equal(result.valid, true);
  assert.equal(result.rows[0].status,'NEEDS_BINDING');
  assert.ok(result.rows[0].warnings.some(e => e.code === 'CANONICAL_COURSE_ALIAS_UNVERIFIED'));
  context.packs.get('PACK').standardCourses.push('지원하지 않는 과목');
  assert.equal(validateLedger(context, ledger, exam).rows[0].status, 'VALID_PICK');
});

test('NEW_KEY validates parent-binding aliases while missing binding remains debt', () => {
  const { context, exam, ledger } = ledgerFixture();
  ledger.entries = [{ questionUid: 'qid_fixture', sourceOrdinal: 1, decision: 'NEW_KEY', proposedName: 'TPL_NEW', parentProblemTypeKey: 'PT_A', definition: '정의', internalSkeleton: '풀이 구조', decisiveStep: '양변에서 1을 뺀다.', cue: 'x+1=2' }];
  exam.rows[0].metadata.courseKey = '지원하지 않는 과목';
  assert.equal(validateLedger(context, ledger, exam).valid, true);
  context.registry.bindingRows = [];
  const result = validateLedger(context, ledger, exam);
  assert.equal(result.valid, true);
  assert.equal(result.rows[0].status, 'NEW_KEY_REVIEW_REQUIRED');
  assert.equal(result.rows[0].warnings[0].code, 'CANONICAL_COURSE_ALIAS_UNVERIFIED');
});
