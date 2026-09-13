import fs from 'node:fs';
import path from 'node:path';
import { fileRef, writeNewJson } from '../../../../../../tools/pipeline-core/canonical.mjs';

const root = process.cwd();
const job = 'past20-maesan-repair-912f9b7fb';
const bridge = 'alive/runtime/provider-bridge/' + job;
const launchId = job + ':1';
const bridgeAbs = path.resolve(root, bridge);
const planRef = fileRef(root, bridge + '/preflight.json');
const packetRef = fileRef(root, bridge + '/u1-packet.json');
const requestRef = fileRef(root, bridge + '/u1-request.json');
const plan = JSON.parse(fs.readFileSync(path.join(bridgeAbs, 'preflight.json'), 'utf8'));
const request = JSON.parse(fs.readFileSync(path.join(bridgeAbs, 'u1-request.json'), 'utf8'));
const observedAt = new Date().toISOString();
const evidenceRelative = bridge + '/provider-transport-failure.json';
const receiptRelative = bridge + '/provider-transport-failure-receipt.json';

const evidence = {
  schemaVersion: 'APMATH_PROVIDER_TRANSPORT_FAILURE_v1',
  status: 'FAILED',
  failureCode: 'PROVIDER_TRANSPORT_UNAVAILABLE',
  workBatchId: job,
  launchId,
  externalId: plan.externalId,
  provider: plan.provider,
  model: plan.model,
  phase: 'U1',
  preDispatchFailure: false,
  observedAt,
  dispatchResult: {
    canonicalStatus: 'HOLD:PROVIDER_TRANSPORT_UNAVAILABLE',
    responseReturned: false,
    responseAttestationReturned: false,
    evidenceReturned: false,
    laterPhasesInvoked: false,
  },
  sealedInputRefs: { providerPlanRef: planRef, packetRef, requestRef },
  requestInputSha: request.inputSha,
  transport: {
    command: 'node',
    args: [
      'alive/runtime/provider-bridge/codex-appserver-adapter.mjs',
      '--job',
      job,
    ],
    automaticRetry: false,
  },
  rootCauseEvidence: 'archive/_generated/past-exams/_manual/20_매산고_2학기_중간_고1_기출_fresh_393877dda/reports/repair-912f9b7fb-provider-root-cause-3.json',
  disposition: 'Terminal provider failure; no retry or synthetic review evidence is authorized.',
};
writeNewJson(path.resolve(root, evidenceRelative), evidence);
const evidenceRef = fileRef(root, evidenceRelative);

const receipt = {
  schemaVersion: 'APMATH_PROVIDER_ATTESTATION_BRIDGE_v1',
  launchId,
  externalId: plan.externalId,
  status: 'FAILED',
  preDispatchFailure: false,
  provider: plan.provider,
  model: plan.model,
  reasoningEffort: plan.reasoningEffort || null,
  providerPlanRef: planRef,
  failedPhase: 'U1',
  failureCode: 'PROVIDER_TRANSPORT_UNAVAILABLE',
  independentAgentLaunchCount: 1,
  expensiveAgentLaunchCount: 1,
  concurrentExpensiveAgentPeak: 1,
  recursiveSubagentLaunchCount: 0,
  retryLaunchCount: 0,
  usedTokens: 23540,
  usedTokensByPhase: { U1: 23540, U2: null, U3: null },
  phaseAttestationRefs: [],
  evidenceRefs: [evidenceRef],
  defects: [],
  executionIdentity: plan.executionIdentity || null,
  failedAt: observedAt,
};
writeNewJson(path.resolve(root, receiptRelative), receipt);
console.log(JSON.stringify({ status: 'FAILURE_EVIDENCE_READY', evidenceRef, receiptRef: fileRef(root, receiptRelative) }, null, 2));
