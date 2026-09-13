import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// A validator or a bookkeeping reducer is not a recovery producer.  Keep the
// distinction explicit here so a route cannot become ACTIVE merely because a
// familiar capability string was supplied by a caller.
export const RECOVERY_CAPABILITY_VERSION = 'APMATH_RECOVERY_CAPABILITY_REGISTRY_v1';

export const RECOVERY_ROUTES = Object.freeze([
  'SOURCE_FIDELITY_RESTORATION',
  'ANSWER_KEY_RECOVERY',
  'DERIVED_SOURCE_RECOVERY',
  'CANDIDATE_REPAIR',
  'VISUAL_EVIDENCE_REPAIR',
  'AUTHORITY_BINDING_REPAIR',
  'EXECUTION_RECOVERY',
]);

const definitions = Object.freeze({
  SOURCE_FIDELITY_RESTORATION: {
    handler: 'archive/tools/past-exam-pipeline/run-one-exam.mjs',
    producer: true,
    probe: root => fs.existsSync(path.join(root, 'archive/tools/past-exam-pipeline/run-one-exam.mjs')),
  },
  ANSWER_KEY_RECOVERY: {
    handler: 'alive/engine/alive_cli.py source-recovery',
    producer: true,
    probe: root => fs.existsSync(path.join(root, 'alive/engine/alive_cli.py')) && fs.existsSync(path.join(root, 'alive/engine/source_recovery.py')),
  },
  // source-recovery.mjs and alive/engine/source_recovery.py validate and
  // reduce injected candidates, but neither exposes a default derived-source
  // question producer.  This route must therefore remain fail-closed.
  DERIVED_SOURCE_RECOVERY: {
    handler: null,
    producer: false,
    probe: () => false,
    reason: 'PRODUCER_NOT_IMPLEMENTED',
  },
  CANDIDATE_REPAIR: {
    handler: 'archive/tools/pipeline-core/work-batch.mjs#recordWorkBatchRepair',
    producer: true,
    probe: root => fs.existsSync(path.join(root, 'archive/tools/pipeline-core/work-batch.mjs')),
  },
  // phase2_artifacts.py is an artifact validator, not a repair producer.  Do
  // not report it as a visual repair capability merely because it exists.
  VISUAL_EVIDENCE_REPAIR: {
    handler: 'archive/tools/pipeline-core/visual-repair.mjs#materializeVisualEvidence',
    producer: true,
    probe: root => fs.existsSync(path.join(root, 'archive/tools/pipeline-core/visual-repair.mjs')),
  },
  AUTHORITY_BINDING_REPAIR: {
    handler: 'archive/tools/pipeline-core/authority-repair.mjs#materializeAuthorityBinding',
    producer: true,
    probe: root => fs.existsSync(path.join(root, 'archive/tools/pipeline-core/authority-repair.mjs')),
  },
  EXECUTION_RECOVERY: {
    handler: 'archive/tools/pipeline-core/work-batch.mjs#reserveWorkBatchReview',
    producer: true,
    probe: root => fs.existsSync(path.join(root, 'archive/tools/pipeline-core/work-batch.mjs')),
  },
});

const implementationRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

const hasInput = inputReady => inputReady === true || (inputReady && typeof inputReady === 'object');

function rowFor(root, route, { inputReady = false, handlers = {} } = {}) {
  const definition = definitions[route];
  if (!definition) return { route, implemented: false, available: false, inputReady: false, handler: null, reason: 'UNKNOWN_ROUTE' };
  // Only execution recovery is wired end-to-end by the default runner. The
  // other modules are preparation/reducers; a caller must register a producer
  // which persists the revision, recollects evidence and returns frozen refs.
  const registered = typeof handlers[route] === 'function';
  const implemented = registered || route === 'EXECUTION_RECOVERY' && Boolean(definition.probe(root) || root !== implementationRoot && definition.probe(implementationRoot));
  const ready = hasInput(inputReady);
  const available = implemented && ready;
  return {
    route,
    implemented,
    available,
    inputReady: ready,
    handler: registered ? `REGISTERED_PRODUCER:${route}` : definition.handler,
    reason: !implemented ? 'PRODUCER_NOT_IMPLEMENTED' : !ready ? 'INPUT_NOT_READY' : null,
  };
}

export function probeRecoveryCapabilities(root, { inputReady = false, routes = RECOVERY_ROUTES, handlers = {} } = {}) {
  const resolvedRoot = path.resolve(root || process.cwd());
  return routes.map(route => rowFor(resolvedRoot, route, { inputReady, handlers }));
}

export function recoveryCapabilityRegistry(root, options = {}) {
  const routes = probeRecoveryCapabilities(root, options);
  return {
    schemaVersion: RECOVERY_CAPABILITY_VERSION,
    status: routes.every(row => row.available || row.reason === 'INPUT_NOT_READY') ? 'READY' : 'BOUNDED',
    routes,
    byRoute: Object.fromEntries(routes.map(row => [row.route, row])),
  };
}

export function capabilityForRoute(registry, route) {
  if (!registry) return null;
  if (Array.isArray(registry)) return registry.find(row => row?.route === route) || null;
  return registry.byRoute?.[route] || registry[route] || null;
}

export function capabilityStatusForRoute(registry, route) {
  const row = capabilityForRoute(registry, route);
  return row ? (row.available ? 'ACTIVE' : 'UNAVAILABLE') : 'UNKNOWN';
}

export function isCapabilityAvailable(registry, route) {
  return capabilityForRoute(registry, route)?.available === true;
}

export function recoveryCapabilityDefinitions() {
  return Object.fromEntries(Object.entries(definitions).map(([route, { probe, ...definition }]) => [route, { ...definition, producer: route === 'EXECUTION_RECOVERY' }]));
}
