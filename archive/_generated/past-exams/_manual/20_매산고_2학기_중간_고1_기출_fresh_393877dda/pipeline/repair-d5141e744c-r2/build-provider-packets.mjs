import fs from 'node:fs';
import path from 'node:path';
import { fileRef, objectSha, writeNewJson } from '../../../../../../tools/pipeline-core/canonical.mjs';
import {
  buildU3CandidatePayload,
  loadCandidateReviewContext,
  validateAuditorPacket,
} from '../../../../../../tools/pipeline-core/review-isolation-runner.mjs';

const root = process.cwd();
const job = 'past20-maesan-repair-d5141e744d';
const stage = 'archive/_generated/past-exams/_manual/20_매산고_2학기_중간_고1_기출_fresh_393877dda';
const workdir = stage + '/pipeline/repair-d5141e744c-r2';
const run = JSON.parse(fs.readFileSync(path.resolve(root, workdir + '/run-machine-current.json'), 'utf8'));
const plan = JSON.parse(fs.readFileSync(path.resolve(root, 'alive/runtime/provider-bridge/' + job + '/preflight.json'), 'utf8'));
const oldDir = path.resolve(root, 'alive/runtime/provider-bridge/past20-maesan-final-393877dda');
const newDir = path.resolve(root, 'alive/runtime/provider-bridge/' + job);
const targetUids = plan.scope.map(row => row.questionUid);
const candidateContext = loadCandidateReviewContext(root, run);

const packetForPhase = phase => {
  const old = JSON.parse(fs.readFileSync(path.join(oldDir, phase.toLowerCase() + '-packet.json'), 'utf8'));
  const packet = {
    ...old,
    auditorId: plan.auditorId,
    auditorSessionId: plan.contexts[phase].sessionId,
    contextId: plan.contexts[phase].contextId,
    launchId: plan.launchId,
    externalTaskId: plan.externalId,
  };
  if (phase === 'U3') {
    const oldItems = new Map(old.payload.map(item => [item.questionUid, item]));
    packet.payload = targetUids.map(questionUid => {
      const oldItem = oldItems.get(questionUid);
      if (!oldItem) throw new Error('MISSING_OLD_U3_ITEM:' + questionUid);
      const frozenInputs = { ...oldItem };
      delete frozenInputs.currentQuestion;
      delete frozenInputs.currentAnswer;
      delete frozenInputs.currentSolution;
      delete frozenInputs.questionUid;
      frozenInputs.dependencies = {
        ...(oldItem.dependencies || {}),
        currentRunInputSha: run.inputSha,
      };
      return buildU3CandidatePayload(candidateContext, questionUid, frozenInputs);
    });
  }
  const { packetSha: ignored, ...body } = packet;
  packet.packetSha = objectSha(body);
  const validation = validateAuditorPacket(packet, {
    affectedUidSet: targetUids,
    declaredContextDependencyUidSet: [],
    builderId: run.builderId,
    builderSessionId: run.builderSessionId,
    candidateContext: phase === 'U3' ? candidateContext : null,
  });
  if (validation.status !== 'PASS') throw new Error(phase + '_PACKET_INVALID:' + validation.errors.join(','));
  return packet;
};

fs.mkdirSync(newDir, { recursive: true });
const packetRefs = [];
for (const phase of ['U1', 'U2', 'U3']) {
  const relative = 'alive/runtime/provider-bridge/' + job + '/' + phase.toLowerCase() + '-packet.json';
  writeNewJson(path.resolve(root, relative), packetForPhase(phase));
  packetRefs.push({ phase, ref: fileRef(root, relative) });
}
const packetRefsPath = workdir + '/packet-refs.json';
writeNewJson(path.resolve(root, packetRefsPath), packetRefs);
console.log(JSON.stringify({ status: 'PACKETS_READY', packetRefsPath, packetRefs }, null, 2));
