import fs from 'node:fs';
import path from 'node:path';
import { fileRef, readBoundFile } from '../../../../../../../../../archive/tools/pipeline-core/canonical.mjs';
import { loadBoundQuestionBanks } from '../../../../../../../../../archive/tools/pipeline-core/closure.mjs';
import { buildAuditorPacket, buildU3CandidatePayload, loadCandidateReviewContext, visualApplicabilityForQuestion } from '../../../../../../../../../archive/tools/pipeline-core/review-isolation-runner.mjs';
import { visualAssetPayload, sourceVisualAssetPayload } from '../../../../../../../../../archive/tools/pipeline-core/native-visual.mjs';
import { sourcePixelPayloads } from '../../../../../../../../../archive/tools/pipeline-core/review-isolation-runner.mjs';
import { buildNativeTurnInput } from '../../../../../../../../../alive/runtime/provider-bridge/codex-appserver-adapter.mjs';

const root = process.cwd();
const base = 'archive-work/textbooks/visang-common2/workbook/geometry';
const setKey = '비상_공통수학2_도형의방정식_익힘책_고1';
const evidence = `${base}/evidence/${setKey}`;
const core = `${evidence}/pipeline-core`;
const runPath = `${core}/run-main-rebound/run.machine-r1.json`;
const captureDir = `${core}/render-capture-main-r1`;
const reviewDir = `${core}/provider-review-main`;
const compactRenderDir = `${core}/pipeline-renders/main`;
const planPath = 'alive/runtime/provider-bridge/visang-workbook-geometry-20260929-main/preflight-plan.json';
const run = JSON.parse(fs.readFileSync(path.join(root, runPath), 'utf8'));
const plan = JSON.parse(fs.readFileSync(path.join(root, planPath), 'utf8'));
const runRef = fileRef(root, runPath);
const captureRefs = run.evidence.filter(ref => ref.path.startsWith(captureDir + '/') && ref.path.endsWith('.json'));
const captureByModeViewport = new Map(captureRefs.map(ref => [path.basename(ref.path).replace('candidate-0-', '').replace('.json', ''), { ref, value: JSON.parse(readBoundFile(root, ref)) }]));
const candidateContext = loadCandidateReviewContext(root, run);
const actual = loadBoundQuestionBanks(root, run);
const declaredByUid = new Map(run.questions.map(question => [question.questionUid, question]));
const runInputRefs = new Map(run.inputs.map(ref => [ref.path, ref]));
const allUids = actual.map(question => question.questionUid);
const phaseSpec = {
  U1: { inputVisibilityProfile: 'SOURCE_ONLY', lane: 'source' },
  U2: { inputVisibilityProfile: 'ARTIFACT_ONLY', lane: 'visual' },
  U3: { inputVisibilityProfile: 'CANDIDATE_ONLY', lane: 'candidate' },
};
const packets = [];

for (const phase of ['U1', 'U2', 'U3']) {
  const payload = [];
  for (const question of actual) {
    const uid = question.questionUid;
    const declared = declaredByUid.get(uid);
    if (phase === 'U1') {
      const source = question.sourceRecord || {};
      const problemAssets = [];
      if (source.image) {
        const candidates = source.image.startsWith('archive/')
          ? [source.image]
          : [path.posix.join(run.assetRoot || 'archive', source.image), `archive/${source.image}`];
        const refs = [...runInputRefs.values()].filter(ref => candidates.includes(ref.path));
        if (refs.length !== 1) throw new Error(`SOURCE_ASSET_BINDING:${uid}:${source.image}:${refs.length}`);
        problemAssets.push(sourceVisualAssetPayload(root, refs[0]));
      }
      payload.push({
        questionUid: uid,
        content: source.content || '',
        choices: source.choices || [],
        problemAssets,
        sourcePixels: sourcePixelPayloads(root, run, source),
      });
    } else if (phase === 'U2') {
      const visualApplicability = visualApplicabilityForQuestion({ ...declared, ...question, visual: declared.visual });
      const assetRefs = [];
      let renderWitnesses = [];
      if (declared.visual.requirement === 'VISUAL_REQUIRED') {
        for (const assetPath of declared.solutionAssetPaths || []) {
          const ref = runInputRefs.get(assetPath);
          if (!ref) throw new Error(`U2_ASSET_BINDING:${uid}:${assetPath}`);
          assetRefs.push(visualAssetPayload(root, ref));
        }
        renderWitnesses = assetRefs.map(asset => ({
          visibility: 'ARTIFACT_ONLY',
          subjectUid: uid,
          artifact: asset,
        }));
      }
      payload.push({ questionUid: uid, artifact: assetRefs.length ? { assetRefs } : null, renderWitnesses, visualApplicability });
    } else {
      const capture = captureByModeViewport.get('solution-desktop');
      if (!capture) throw new Error('SOLUTION_DESKTOP_CAPTURE_REQUIRED');
      const witness = capture.value.payload.itemWitnesses.find(item => item.questionUid === uid);
      if (!witness) throw new Error(`U3_RENDER_WITNESS:${uid}`);
      const compactRenderPath = `${compactRenderDir}/q${String(declared.displayNo || question.questionNo || question.id).padStart(2, '0')}_solution_desktop.png`;
      fs.mkdirSync(path.dirname(path.join(root, compactRenderPath)), { recursive: true });
      fs.copyFileSync(path.join(root, witness.screenshot.path), path.join(root, compactRenderPath));
      const compactRenderRef = fileRef(root, compactRenderPath);
      const screenshotAsset = visualAssetPayload(root, compactRenderRef);
      const renderWitness = {
        questionUid: uid,
        mode: witness.mode,
        viewportProfile: witness.viewportProfile,
        visibility: 'CANDIDATE_ONLY',
        screenshot: screenshotAsset,
        sourceCapturePath: capture.ref.path,
        sourceCaptureSha: capture.ref.sha256,
        sourceScreenshotPath: witness.screenshot.path,
        screenshotSha: witness.screenshot.sha256,
        checks: capture.value.payload.checks,
      };
      payload.push(buildU3CandidatePayload(candidateContext, uid, { renderWitnesses: [renderWitness] }));
    }
  }

  const ctx = plan.contexts[phase];
  const packet = buildAuditorPacket({
    phase,
    questionUid: allUids[0],
    questionUids: allUids,
    payload,
    affectedUidSet: allUids,
    declaredContextDependencyUidSet: run.declaredContextDependencyUidSet || [],
    auditorId: plan.auditorId,
    auditorSessionId: ctx.sessionId,
    builderId: run.builderId,
    builderSessionId: run.builderSessionId,
    auditorPrincipalType: 'STATELESS_MODEL',
    contextId: ctx.contextId,
    inputVisibilityProfile: phaseSpec[phase].inputVisibilityProfile,
    priorReviewVisibility: 'NONE',
    sealed: true,
    launchId: plan.launchId,
    externalTaskId: plan.externalId,
    candidateContext: phase === 'U3' ? candidateContext : null,
  });
  const packetPath = `${reviewDir}/${phase.toLowerCase()}-packet.json`;
  fs.writeFileSync(path.join(root, packetPath), JSON.stringify(packet, null, 2));
  packets.push({ phase, ref: fileRef(root, packetPath), packet });
}

const refsPath = `${reviewDir}/packet_refs.json`;
fs.writeFileSync(path.join(root, refsPath), JSON.stringify(packets.map(({ phase, ref }) => ({ phase, ref })), null, 2));

const reviewContract = {
  U1: 'Independently audit source fidelity, source defects and mathematics using only the provided source pixels, source text and ordered choices. Do not review other questions visible on a page outside the declared UID scope. Source-page pixels are evidence, not candidate solutions.',
  U2: 'Independently audit only supplied visual artifacts and artifact renders: crop completeness, geometry, labels, coordinates and visual fidelity. Do not infer intended answers or consume source/candidate solutions or peer reports.',
  U3: 'Independently audit the current candidate problem, choices, answer, solution, necessary problem visuals and actual browser renders for mathematical correctness, intermediate reasoning and student output consistency. No U1/U2 reports are available. Return independentAnswer and independentDerivation for MATH_A2, not peer evidence hashes.',
};
const outputContract = {
  evidence: 'Return an array of JSON-encoded strings. Each string must encode exactly one evidence object.',
  defects: 'Return an array of JSON-encoded strings. Each string must encode exactly one defect object.',
  assessments: 'For an explicit correctness claim, evidence.payload.assessments may contain {domain: SOURCE|MATH|VISUAL|SOLUTION, status: PASS|FAIL, subjectSha: the reviewed source/candidate/artifact SHA}. Report only domains you actually reviewed. Never infer agreement from absent findings. Conflicts are resolved by a deterministic merger, not by an auditor.',
};
const sizes = [];
for (const { phase, packet } of packets) {
  const prompt = JSON.stringify({ packet, reviewContract: reviewContract[phase], outputContract });
  const nativeInput = await buildNativeTurnInput(prompt, packet);
  const bytes = Buffer.byteLength(JSON.stringify(nativeInput));
  sizes.push({ phase, bytes, underOneMiB: bytes < 1024 * 1024, questionCount: packet.questionUids.length, attachmentCount: nativeInput.length - 1 });
}
const sizeAudit = { status: sizes.every(row => row.underOneMiB) ? 'PASS' : 'HOLD', limitBytes: 1024 * 1024, sizes, runRef, planPath, packetRefsPath: refsPath };
const sizeAuditPath = `${reviewDir}/native_input_size_audit.json`;
fs.writeFileSync(path.join(root, sizeAuditPath), JSON.stringify(sizeAudit, null, 2));
console.log(JSON.stringify({ status: sizeAudit.status, sizes, packetRefsPath: refsPath, sizeAuditPath }, null, 2));
if (sizeAudit.status !== 'PASS') process.exitCode = 1;
