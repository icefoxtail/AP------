export const APP_SERVER_LAUNCH_STATE_VERSION = 'APMATH_CODEX_APPSERVER_LAUNCH_STATE_v1';
export const APP_SERVER_PHASES = Object.freeze(['U1', 'U2', 'U3']);

const nonempty = value => typeof value === 'string' && value.length > 0;

export function launchContextRecord({ launchId, requestSha, control, contexts, createdAt = new Date().toISOString() }) {
  if (!nonempty(launchId) || !nonempty(requestSha) || !control?.id || !control?.sessionId) throw new Error('CODEX_LAUNCH_IDENTITY_REQUIRED');
  if (!contexts || APP_SERVER_PHASES.some(phase => !contexts[phase]?.sessionId || !contexts[phase]?.contextId || !contexts[phase]?.threadId)) throw new Error('CODEX_LAUNCH_PHASE_CONTEXTS_REQUIRED');
  return { launchId, requestSha, control: { id: control.id, sessionId: control.sessionId, threadId: control.threadId || control.id }, contexts: Object.fromEntries(APP_SERVER_PHASES.map(phase => [phase, { sessionId: contexts[phase].sessionId, contextId: contexts[phase].contextId, threadId: contexts[phase].threadId }])), createdAt };
}

export async function getOrCreateLaunchContext(state, { launchId, requestSha, create }) {
  const launches = state?.launches || {};
  const existing = launches[launchId];
  if (existing) {
    if (existing.requestSha !== requestSha) throw new Error('CODEX_LAUNCH_REQUEST_SHA_MISMATCH');
    return { state, launch: existing, created: false };
  }
  const launch = launchContextRecord({ launchId, requestSha, ...(await create()) });
  return { state: { ...state, launches: { ...launches, [launchId]: launch } }, launch, created: true };
}

export function phaseContextForLaunch(state, launchId, phase) {
  if (!APP_SERVER_PHASES.includes(phase)) throw new Error('CODEX_PHASE_INVALID');
  const launch = state?.launches?.[launchId];
  if (!launch) throw new Error('CODEX_LOGICAL_LAUNCH_NOT_FOUND');
  return { launch, context: launch.contexts[phase] };
}
