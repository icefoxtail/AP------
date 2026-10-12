import fs from 'node:fs';
import path from 'node:path';
import { readExam, physical, writeFresh } from '../../../../tools/archive-codex-artifact-io.mjs';
import { normalizeStudentBundle, disclosePostfreeze } from '../../../../tools/archive-student-bundle.mjs';

const outputDir = import.meta.dirname;
const root = path.resolve(outputDir, '../../../../..');
const examFile = path.join(root, 'archive/exams/original/high/h2/1mid/24_강남여고_1학기_중간_고2_확률과통계.js');
const fullBundleFile = path.join(outputDir, 'current-full-student-only.bundle.json');
const unchangedFreezeFile = path.join(root, 'archive/analysis/24_강남여고_1학기_중간_고2_확률과통계/r1/r1-independent-freeze-original.json');
const cleanQ1FreezeFile = path.join(outputDir, 'q1-independent-answer-freeze.json');
const mergedFreezeFile = path.join(outputDir, 'current-composite-independent-freeze.for-helper.json');
const disclosureFile = path.join(outputDir, 'q1-postfreeze-answer-solution-only.disclosure.json');

const exam = readExam(examFile);
const bundle = normalizeStudentBundle(JSON.parse(fs.readFileSync(fullBundleFile, 'utf8')), {
  inputFile: fullBundleFile,
  expectedSourceRawSha256: exam.rawSha256,
});
const prior = JSON.parse(fs.readFileSync(unchangedFreezeFile, 'utf8'));
const cleanQ1 = JSON.parse(fs.readFileSync(cleanQ1FreezeFile, 'utf8'));
if (prior.rows?.length !== bundle.rows.length || prior.rows.some((row, index) => Number(row.qid) !== bundle.qids[index])) {
  throw new Error('PRIOR_UNCHANGED_FREEZE_DENOMINATOR_OR_ORDER_MISMATCH');
}
if (Number(cleanQ1.qid) !== 1 || cleanQ1.sourceRawSha256 !== exam.rawSha256 || cleanQ1.studentBundleSha256 !== physical(path.join(outputDir, 'current-student-only.bundle.json')).sha256) {
  throw new Error('CLEAN_Q1_FREEZE_BINDING_MISMATCH');
}

const rows = prior.rows.map(row => ({ ...row }));
rows[0] = { qid: 1, independentAnswer: cleanQ1.independentAnswer, reasoning: cleanQ1.reasoning };
const merged = {
  ...prior,
  sourceRawSha256: exam.rawSha256,
  studentBundle: physical(fullBundleFile),
  studentQidOrder: bundle.qids,
  rows,
  continuation: {
    type: 'CURRENT_STUDENT_PARITY_REBIND_WITH_FRESH_Q1_METADATA_BLIND_FREEZE',
    priorUnchangedFreeze: physical(unchangedFreezeFile),
    cleanQ1Freeze: physical(cleanQ1FreezeFile),
    currentFullStudentBundle: physical(fullBundleFile),
    reusedUnchangedQids: bundle.qids.filter(qid => qid !== 1),
    refreshedQids: [1],
  },
};
const mergedRef = writeFresh(mergedFreezeFile, merged);
const disclosure = disclosePostfreeze({
  sourceFile: examFile,
  studentBundleFile: fullBundleFile,
  freezeFile: mergedFreezeFile,
  freezeSha256: mergedRef.sha256,
  qids: [1],
  output: disclosureFile,
});
console.log(JSON.stringify({
  status: disclosure.disclosure.studentParity,
  sourceRawSha256: exam.rawSha256,
  currentFullBundle: physical(fullBundleFile),
  mergedFreeze: mergedRef,
  disclosedQids: disclosure.disclosure.rows.map(row => row.qid),
  disclosure: disclosure.ref,
}));
