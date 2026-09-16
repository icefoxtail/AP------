import { nonempty } from './canonical.mjs';

export const VISUAL_REPAIR_VERSION = 'APMATH_VISUAL_EVIDENCE_REPAIR_v1';

// This handler is intentionally limited to binding an already-produced source
// visual as a native provider input. It does not invent an SVG/PNG or turn a
// missing visual producer into an ACTIVE capability.
export function materializeVisualEvidence(run, { questionUids = null } = {}) {
  if (!run?.questions?.length) throw new Error('VISUAL_REPAIR_RUN_REQUIRED');
  const selected = questionUids ? new Set(questionUids) : new Set(run.questions.map(question => question.questionUid));
  const bindings = [];
  for (const question of run.questions) {
    if (!selected.has(question.questionUid)) continue;
    const paths = [
      ...(question.problemAssetPaths || []),
      ...(question.problemAssetRefs || []).map(ref => ref.path).filter(Boolean),
    ].filter(nonempty);
    if (!paths.length) continue;
    const refs = run.inputs.filter(ref => paths.includes(ref.path) && ref.role === 'asset');
    if (refs.length !== paths.length) throw new Error(`VISUAL_REPAIR_ASSET_NOT_BOUND:${question.questionUid}`);
    bindings.push({ questionUid: question.questionUid, assetRefs: refs.map(ref => ({ ...ref })) });
  }
  return { status: 'READY', version: VISUAL_REPAIR_VERSION, run, bindings };
}
