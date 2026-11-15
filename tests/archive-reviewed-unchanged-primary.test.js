const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

async function main() {
  const { bindUnchangedReviewedPrimary } = await import(pathToFileURL(path.join(__dirname,
    '../archive/tools/meta-foundation/reviewed-source-reassessment.mjs')).href);
  const uid = 'qid_v1_existing_reviewed_primary';
  function fixture() {
    const question = { standardCourse: 'middle2', standardUnitKey: 'M2-07', subUnitKey: 'M2-07-APPLICATION',
      problemTypeKey: 'PT_EXISTING', templateKey: 'TPL_EXISTING', conditionKeys: [], integrationPattern: 'SEQUENTIAL' };
    const pt = { problemTypeKey: question.problemTypeKey, status: 'ACTIVE', supportingQuestionUids: [uid] };
    const tpl = { templateKey: question.templateKey, parentProblemTypeKey: pt.problemTypeKey,
      status: 'ACTIVE', supportingQuestionUids: [uid] };
    const canonical = () => ({ pt: new Map([[pt.problemTypeKey, structuredClone(pt)]]),
      tpl: new Map([[tpl.templateKey, structuredClone(tpl)]]) });
    const binding = { curriculum: '2015', standardCourse: question.standardCourse,
      standardUnitKey: question.standardUnitKey, subUnitKey: question.subUnitKey,
      problemTypeKey: pt.problemTypeKey, status: 'ACTIVE' };
    return { native: { review: { schemaVersion: 'm2-s2-meta-review-v1', sourceArchiveFile: 'original/middle/m2/source.js' },
        committedBank: [structuredClone(question)], reviewedBank: [structuredClone(question)] },
      row: { rpmDecision: 'KEEP', rpmPath: { curriculum: '2015' },
        fieldReview: { condition: 'No independent condition.', integration: 'Existing sequential auxiliary application.' },
        activeDefinitionMatch: { problemTypeKey: pt.problemTypeKey, templateKey: tpl.templateKey,
          problemTypeStatus: 'ACTIVE', templateStatus: 'ACTIVE', templateParent: pt.problemTypeKey, exactBindings: [binding] } },
      accepted: { crossConceptKeys: ['CC_ORIGINAL', 'CC_FINALIZED'] },
      patch: { questionUid: uid, sourceOrdinal: 1, after: structuredClone(question) },
      question: structuredClone(question), final: { ...structuredClone(question), curriculum: '2015' },
      canonicalBefore: canonical(), canonicalAfter: canonical(),
      proposalFinalization: { proof: { schemaVersion: 'archive-native-proposal-finalization-v1',
        nativeProposalBindings: [{ type: 'CC' }], definitions: [{ collection: 'concepts' }] } } };
  }
  let checked = 0;
  const f = fixture(), before = structuredClone(f.accepted), result = bindUnchangedReviewedPrimary(f);
  assert.deepEqual(result.fields, { problemTypeKey: 'PT_EXISTING', templateKey: 'TPL_EXISTING',
    conditionKeys: [], integrationPattern: 'SEQUENTIAL' });
  assert.deepEqual(f.accepted, before, 'binding returns evidence without mutating caller inputs');
  assert.equal(result.proof.newDefinitions, false); assert.equal(result.proof.newMathematicalQa, false);
  assert.equal(Object.keys(result.proof.fieldSha256).length, 4); checked++;

  for (const [label, mutate] of [
    ['unresolved proposal', x => { delete x.proposalFinalization; }],
    ['another native schema', x => { x.native.review.schemaVersion = 'm3-s2-complete-semantic-review-v1'; }],
    ['new classification decision', x => { x.row.rpmDecision = 'CORRECT'; }],
    ['template finalization', x => { x.proposalFinalization.proof.nativeProposalBindings[0].type = 'TPL'; }],
    ['condition registry change', x => { x.proposalFinalization.proof.definitions[0].collection = 'conditions'; }],
    ['partially reviewed new primary', x => { x.accepted.problemTypeKey = 'PT_DIFFERENT'; }],
  ]) {
    const x = fixture(); mutate(x); assert.equal(bindUnchangedReviewedPrimary(x), null, label); checked++;
  }
  for (const [label, mutate] of [
    ['changed current primary', x => { x.question.problemTypeKey = 'PT_OTHER'; }],
    ['borrowed reviewed primary', x => { x.native.reviewedBank[0].templateKey = 'TPL_OTHER'; }],
    ['changed final primary', x => { x.final.templateKey = 'TPL_OTHER'; }],
    ['changed request primary', x => { x.patch.after.problemTypeKey = 'PT_OTHER'; }],
    ['changed source parent', x => { x.question.subUnitKey = 'M2-OTHER'; }],
    ['new definition body', x => { x.canonicalAfter.pt.get('PT_EXISTING').definition = 'new'; }],
    ['inactive definition', x => { x.canonicalBefore.tpl.get('TPL_EXISTING').status = 'DRAFT'; }],
    ['UID not supported by PT', x => { x.canonicalBefore.pt.get('PT_EXISTING').supportingQuestionUids = []; }],
    ['UID not supported by template', x => { x.canonicalBefore.tpl.get('TPL_EXISTING').supportingQuestionUids = []; }],
    ['native active match absent', x => { delete x.row.activeDefinitionMatch; }],
    ['native template parent changed', x => { x.row.activeDefinitionMatch.templateParent = 'PT_OTHER'; }],
    ['wrong curriculum', x => { x.final.curriculum = '2022'; }],
    ['missing exact binding', x => { x.row.activeDefinitionMatch.exactBindings = []; }],
    ['ambiguous exact binding', x => { x.row.activeDefinitionMatch.exactBindings.push(structuredClone(x.row.activeDefinitionMatch.exactBindings[0])); }],
    ['new condition', x => { x.patch.after.conditionKeys = ['COND_NEW']; x.question.conditionKeys = ['COND_NEW']; x.final.conditionKeys = ['COND_NEW']; }],
    ['existing nonempty conditions', x => { for (const q of [x.question, x.final, x.patch.after, x.native.committedBank[0], x.native.reviewedBank[0]]) q.conditionKeys = ['COND_UNREVIEWED']; }],
    ['changed integration', x => { x.patch.after.integrationPattern = 'PARALLEL'; x.question.integrationPattern = 'PARALLEL'; x.final.integrationPattern = 'PARALLEL'; }],
    ['missing native condition review', x => { delete x.row.fieldReview.condition; }],
    ['missing native integration review', x => { delete x.row.fieldReview.integration; }],
  ]) {
    const x = fixture(); mutate(x); assert.throws(() => bindUnchangedReviewedPrimary(x), /source reassessment:/, label); checked++;
  }
  const noPrimary = fixture(); delete noPrimary.patch.after.problemTypeKey; delete noPrimary.patch.after.templateKey;
  assert.equal(bindUnchangedReviewedPrimary(noPrimary), null); checked++;
  console.log(`PASS unchanged reviewed primary binding: ${checked} cases; no new classifications or definitions`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
