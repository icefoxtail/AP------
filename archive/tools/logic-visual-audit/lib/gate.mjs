import { canonicalFactHash, projectSemantic, semanticHash, validateFact } from './facts.mjs';
import { sha256 } from './io.mjs';

export function evaluateItem({ expectedFact, observedFact, schema, projection, required = true, structureFingerprint = null }) {
  const expectedErrors = expectedFact ? validateFact(expectedFact, schema) : ['expected fact missing'];
  const observedErrors = observedFact ? validateFact(observedFact, schema) : ['observed fact missing'];
  const expectedSemanticSha = expectedFact && !expectedErrors.length ? semanticHash(expectedFact, projection) : null;
  const observedSemanticSha = observedFact && !observedErrors.length ? semanticHash(observedFact, projection) : null;
  const parity = Boolean(expectedSemanticSha && observedSemanticSha && expectedSemanticSha === observedSemanticSha);
  const status = required ? (expectedErrors.length || observedErrors.length || !parity ? 'FAIL' : 'PASS') : 'NOT_APPLICABLE';
  return {
    logicVisualItemStatus: status,
    expectedSchemaErrors: expectedErrors,
    observedSchemaErrors: observedErrors,
    expectedLogicalFactSha: expectedFact ? canonicalFactHash(expectedFact) : null,
    observedVisualFactSha: observedFact ? canonicalFactHash(observedFact) : null,
    expectedSemanticSha,
    observedSemanticSha,
    expectedObservedSemanticParity: parity ? 'PASS' : 'FAIL',
    visualStructureFingerprint: structureFingerprint,
    logicVisualStaticContract: observedErrors.length ? 'FAIL' : 'PASS',
    cGate: status,
    dGate: 'NOT_TESTED',
    evidenceSha: sha256({ expectedSemanticSha, observedSemanticSha, status, structureFingerprint })
  };
}

export function structureFingerprint(observedFact) {
  const structure = {
    visualType: observedFact?.visualType ?? null,
    regionTopology: observedFact?.boundaryTopology ?? null,
    boundaryTopology: observedFact?.boundaryTopology ?? null,
    arrowTopology: observedFact?.arrowTopology ?? null,
    intervalComponentTopology: observedFact?.intervalComponents?.map((component) => ({ fromEndpoint: component.fromEndpoint?.kind, toEndpoint: component.toEndpoint?.kind })) ?? null,
    tableShape: observedFact?.tableShape ?? null,
    panelStructure: observedFact?.panelStructure ?? null,
    semanticRolePattern: observedFact?.semanticRolePattern ?? null
  };
  return sha256(structure);
}

export function compareStructureReuse(entries) {
  const byFingerprint = new Map();
  for (const entry of entries) {
    if (!entry.visualStructureFingerprint) continue;
    const list = byFingerprint.get(entry.visualStructureFingerprint) ?? [];
    list.push(entry);
    byFingerprint.set(entry.visualStructureFingerprint, list);
  }
  const findings = [];
  for (const [fingerprint, list] of byFingerprint) {
    const semanticShas = [...new Set(list.map((item) => item.expectedSemanticSha).filter(Boolean))];
    if (list.length > 1 && semanticShas.length > 1) findings.push({ fingerprint, status: 'FAIL_STRUCTURAL_REUSE', questionUids: list.map((item) => item.questionUid).sort(), expectedSemanticShas: semanticShas.sort() });
    if (list.length > 1 && semanticShas.length === 1) findings.push({ fingerprint, status: 'ALLOWED_SHARED_SEMANTIC', questionUids: list.map((item) => item.questionUid).sort(), expectedSemanticShas: semanticShas });
  }
  return findings;
}
