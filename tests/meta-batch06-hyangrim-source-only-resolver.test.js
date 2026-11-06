// Source-only BATCH-06 [69] — resolver projection regression for two independently solved QIDs.
// No student answer/solution or old registration approvals are synthesized by this test.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const sourceArchiveFile = 'original/middle/m2/2mid/21_향림중_2학기_중간_중2_수학.js';
(async () => {
  const { objectSha } = await import('../archive/tools/pipeline-core/canonical.mjs');
  const { resolveMetaRoute, validateResolverEvidence, buildDecisionIsolatedInput, questionUidForSource } =
    await import('../archive/tools/meta-foundation/rpm-active-resolver.mjs');
  const source = fs.readFileSync(path.join(root, 'archive/exams', sourceArchiveFile), 'utf8');
  const matched = source.match(/window\.questionBank\s*=\s*(\[[\s\S]*\])\s*;\s*$/);
  assert.ok(matched, 'production questionBank missing');
  const bank = JSON.parse(matched[1]);
  assert.equal(bank.length, 26);
  const crosswalk = JSON.parse(fs.readFileSync(
    path.join(root, 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json'), 'utf8'));
  const specs = [
    { id: 21, uid: 'qid_v1_7d44d8050bb50cc8cc54a80e8249bde0c85915537fc5d401870727e76d483a0e',
      record: 'M2-RPM-066', tpl: 'TPL_TRIANGLE_INCENTER',
      proof: '둔각삼각형의 내심은 내각 이등분선의 교점이므로 삼각형 내부; 보기 ④ 거짓' },
    { id: 22, uid: 'qid_v1_a399a62366462b694b82bef6fec9aaea7b8f8213c113150a08d346bd8b491099',
      record: 'M2-RPM-069', tpl: 'TPL_TRIANGLE_CENTERS_COMBINED',
      proof: 'R=17/2,r=3,c=17,a+b=23,a²+b²=289,2ab=240, 넓이=60' },
  ];
  for (const spec of specs) {
    const q = bank[spec.id - 1];
    const row = crosswalk.records.find(r => r.id === spec.record);
    assert.equal(q.id, spec.id);
    assert.equal(q.answer, '', 'student answer preserved blank');
    assert.equal(q.solution, '', 'student explanation preserved blank');
    assert.equal(questionUidForSource(sourceArchiveFile, spec.id), spec.uid);
    assert.equal(row.curriculum, '2015');
    assert.equal(row.bindingStatus, 'ACTIVE');
    assert.equal(row.standardUnitKey, 'M2-05');
    assert.equal(row.subUnitKey, 'M2-05-TRIANGLE_PROPERTIES');
    assert.deepEqual(q.rpmPrimaryPath, row.rpmPath);
    assert.equal(q.rpmPrimaryRecordId, row.id);
    assert.equal(q.problemTypeKey, 'PT_TRIANGLE_CENTERS');
    assert.equal(q.templateKey, spec.tpl);
    assert.equal(q.curriculum, '2015');
    assert.equal(q.standardCourse, '중2 수학');
    if (spec.id === 21) {
      assert.equal(q.choices.length, 5);
      assert.match(q.choices[3], /둔각삼각형의 내심은 삼각형의 외부/);
    } else {
      assert.equal(q.choices[1], '60');
      assert.equal((23 ** 2 - 17 ** 2) / 4, 60);
      assert.deepEqual(q.crossConceptKeys, ['CC_PYTHAGOREAN']);
    }
    // This solutionIdentity hashes the independent frozen math check, not a stored student solution.
    const input = {
      sourceIdentity: {
        sourceArchiveFile, questionUid: spec.uid, sourceIdentityKey: spec.uid,
        sourceOrdinal: spec.id, contentHash: objectSha(q.question),
        choicesHash: objectSha(q.choices),
        imageRefHash: objectSha((q.question.match(/<img[^>]*src="([^"]+)"/) || [])[1] || ''),
      },
      solutionIdentity: { status: 'VERIFIED_FINAL', independentVerification: true,
        solutionHash: objectSha(spec.proof) },
      curriculumContext: {
        grade: 'M2', curriculum: '2015', scope: 'M2-2', standardCourse: '중2 수학',
        standardUnitKey: 'M2-05', subUnitKey: 'M2-05-TRIANGLE_PROPERTIES',
      },
      semanticDecision: {
        primaryMethod: q.primaryMethod, decisiveStep: q.decisiveStep,
        rpmPath: { curriculum: '2015', scope: 'M2-2', ...row.rpmPath },
      },
    };
    if (row.mappingStatus === 'FAMILY_ACTIVE') {
      const frozen = buildDecisionIsolatedInput(input);
      input.familyTemplateSelection = {
        stage: 'POST_CROSSWALK', inputBundleSha: frozen.inputBundleSha,
        crosswalkRecordId: row.id, templateKey: spec.tpl,
        decisiveStepReason: '내외접원 반지름에서 빗변과 합을 얻고 피타고라스로 넓이를 확정',
      };
    }
    const result = resolveMetaRoute(input, { repoRoot: root });
    assert.equal(result.disposition, 'RPM_SEMANTIC_FINAL', 'q' + spec.id);
    assert.equal(result.projectionStatus, 'PROJECTION_REUSE', 'q' + spec.id);
    assert.equal(result.problemTypeKey, q.problemTypeKey);
    assert.equal(result.templateKey, spec.tpl);
    assert.equal(result.crosswalkRecordId, spec.record);
    assert.equal(validateResolverEvidence(input, result, { repoRoot: root }).status, 'PASS');
  }
  console.log('PASS BATCH06_HYANGRIM_Q21_Q22_OFFICIAL_RESOLVER 2/2; student solution pending');
})().catch(e => { console.error(e); process.exitCode = 1; });
