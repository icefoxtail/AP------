import fs from 'node:fs';
import path from 'node:path';
import { m2RendererFixture, m2RendererWriterFixture, sha, stable } from './m2-current-renderer-fixture.mjs';
import { M2_RENDERER_REFRESH_SCHEMA, M2_RENDERER_REFRESH_REVIEW_SCHEMA } from '../../archive/tools/meta-foundation/reviewed-m2-current-renderer-continuity.mjs';

const clone = value => structuredClone(value);
const omit = (value, keys) => Object.fromEntries(Object.entries(value).filter(([key]) => !keys.includes(key)));

export function m2RefreshFixture(t, { mode = 'tall', writer = false, ...options } = {}) {
  const make = writer ? m2RendererWriterFixture : m2RendererFixture;
  const f = make(t, mode === 'tall' ? { ...options, extraDelta: { imageSize: 'tall', ...options.extraDelta }, sealV1: false } : options);
  const witnessPath = '.archive-meta-register/evidence/m2-current-renderer-refresh-fixture/transport.json';
  const oldV1Path = f.witnessPath;
  const sourceRef = (commit, question) => {
    const bytes = Buffer.from(f.git('show', `${commit}:${f.sourcePath}`) + '\n');
    // Source fixtures always end with exactly one newline.
    return { commit, path: f.sourcePath, gitBlobSha1: f.git('rev-parse', `${commit}:${f.sourcePath}`), sha256: sha(bytes), questionSha256: sha(stable(question)) };
  };
  const fileRef = (commit, relative) => ({ commit, path: relative, gitBlobSha1: f.git('rev-parse', `${commit}:${relative}`),
    sha256: sha(fs.readFileSync(path.join(f.root, relative))) });
  const shared = { schemaVersion: M2_RENDERER_REFRESH_REVIEW_SCHEMA, scope: 'M2_EXISTING_METADATA_WITH_CURRENT_RENDERER_REFRESH',
    mode: mode === 'tall' ? 'DIRECT_NATIVE_TO_TALL' : 'REUSE_EXACT_V1_OBSERVATION', transportAuthor: 'refresh-transport-author',
    selectedUidCount: 1, rows: [], newObservation: mode === 'tall', newMathematicalQa: false, newMetadataApprovals: 0,
    newDifficultyJudgments: 0, newReviewPassCount: 0 };
  let raw, rawRow, refreshRow;
  const rawPath = 'docs/operations/synthetic-m2-refresh/direct-observations.json';
  if (mode === 'tall') {
    rawRow = { sourceArchiveFile: f.request.sourceArchiveFile, questionUid: f.patch.questionUid, sourceOrdinal: f.patch.sourceOrdinal,
      nativeSourceRef: omit(sourceRef(f.patch.sourceReview.reviewCommit, f.old), ['questionSha256']),
      observedCurrentSourceRef: omit(f.witnessRow.currentSourceRef, ['questionSha256']),
      assets: [['native', f.patch.sourceReview.reviewCommit, f.oldAsset], ['current', f.witnessRow.currentSourceRef.commit, f.newAsset]].map(([state, commit, relative]) =>
        ({ state, ref: fileRef(commit, relative), viewedPngSha256: sha('synthetic viewed PNG'), actuallyViewed: true, viewMethod: 'SYNTHETIC FIXTURE; no production observation' })),
      stemAndChoicesRead: true, stemAndChoicesUnchanged: true, answerAndSolutionFieldsByteComparedOnly: true, answerAndSolutionFieldsUnchanged: true,
      observations: { relations: ['Synthetic fixture relation'], stemSupport: ['Synthetic fixture given'], newUnsupportedConditionObserved: false },
      decision: 'SELECTED_STUDENT_CONDITIONS_PRESERVED' };
    raw = { schemaVersion: 'root-targeted-m2-renderer-direct-observations-v1', taskId: 'synthetic-fixture', reviewer: 'synthetic-independent-observer',
      observedAtUtc: 'synthetic-observation-time', scope: 'Synthetic targeted test only', selectedUidCount: 1, rows: [rawRow],
      priorTruncatedImageOutputUsedAsObservation: false, fullExamIndependentReview: false, e006Q21NewObservation: false,
      newMetadataApprovals: 0, sourceWrites: 0, assetWrites: 0, productionRegistration: 0, nextAction: 'Synthetic contract test only' };
    refreshRow = { ...omit(clone(f.witnessRow), ['visualChecks', 'observed']), observationRowSha256: sha(stable(rawRow)) };
  } else {
    const prior = clone(f.patch.sourceReview.m2RendererProof);
    fs.appendFileSync(path.join(f.root, f.sourcePath), '// Unrelated source-file formatting; selected whole question unchanged.\n');
    const currentCommit = f.commit(), currentSourceRef = sourceRef(currentCommit, f.current);
    f.request.expectedSourceBlobSha1 = currentSourceRef.gitBlobSha1;
    refreshRow = { questionUid: f.patch.questionUid, sourceOrdinal: f.patch.sourceOrdinal, sourceArchiveFile: f.request.sourceArchiveFile,
      expectedQuestionCount: 1, priorV1Proof: prior, priorObservationRowSha256: sha(stable(f.witnessRow)),
      currentSourceRef, currentAssets: clone(f.witnessRow.currentAssets), newObservation: false };
  }
  shared.rows = [refreshRow];
  const originalRefs = [...f.request.approval.evidenceRefs];
  const reseal = () => {
    const refs = [...originalRefs, { path: f.frozenCopy, sha256: sha(fs.readFileSync(path.join(f.root, f.frozenCopy))) },
      ...[...f.witnessRow.beforeAssets, ...refreshRow.currentAssets].map(value => ({ path: value.path, sha256: value.sha256 }))];
    if (mode === 'tall') {
      const ref = f.put(rawPath, raw), commit = f.commit();
      shared.actualObservationRef = { commit, ...ref };
      refreshRow.observationRowSha256 = sha(stable(rawRow));
      refs.push(ref);
    }
    const ref = f.put(witnessPath, shared), reviewCommit = f.commit();
    refs.push(ref);
    f.patch.sourceReview.m2RendererProof = { schemaVersion: M2_RENDERER_REFRESH_SCHEMA, reviewCommit, reviewRef: ref };
    f.request.approval.evidenceRefs = f.patch.evidenceRefs = [...new Map(refs.map(value => [value.path, value])).values()];
    f.args.cache = new Map();
  };
  reseal();
  return Object.assign(f, { raw, rawRow, rawPath, refresh: shared, refreshRow, refreshReseal: reseal, witnessPath, oldV1Path, sourceRef });
}
