// Bind a public audit to the released source, never to the dispatch workflow's head SHA.
// Release artifacts are read as data only. This helper never executes artifact contents.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const shaPattern = /^[a-f0-9]{40}$/;
const integerPattern = /^[1-9][0-9]*$/;
const workflowPath = '.github/workflows/archive-pages-release.yml';
const hash = value => createHash('sha256').update(value).digest('hex');
const requireThat = (condition, message) => { if (!condition) throw new Error(message); };
const requiredContextKeys = new Set(['source_sha', 'run_id', 'run_attempt', 'workflow_ref', 'workflow_sha', 'workflow_blob', 'verified_release_main_sha', 'release_gate']);

export function parseReleaseContext(text) {
  const out = {};
  requireThat(typeof text === 'string' && text.length > 0 && text.length <= 1024 * 1024, 'Release context is missing or oversized');
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue;
    const split = line.indexOf('=');
    if (split < 0) continue;
    const key = line.slice(0, split);
    if (!requiredContextKeys.has(key)) continue;
    requireThat(!Object.hasOwn(out, key), `Duplicate release context field: ${key}`);
    out[key] = line.slice(split + 1);
  }
  return out;
}

export function resolveReleaseSource({ eventName, event, repository, expectedMainSha = '', contextText, jobs }) {
  requireThat(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository || ''), 'Repository identity is required');
  requireThat(event?.repository?.full_name === repository, 'Event repository does not match the audit repository');
  if (eventName === 'workflow_dispatch') {
    requireThat(shaPattern.test(expectedMainSha), 'Manual public verification requires an explicit 40-character expected_main_sha');
    return { status: 'BOUND_EXPLICIT_MAIN_SOURCE', verify: true, source_sha: expectedMainSha, binding: 'manual_expected_main_sha', release_run_id: null, release_run_attempt: null };
  }
  requireThat(eventName === 'workflow_run', 'Unsupported public verification event');
  const run = event.workflow_run;
  requireThat(run?.name === 'Archive Pages Release' && run.status === 'completed' && run.conclusion === 'success', 'Release run must be the completed successful Archive Pages Release workflow');
  requireThat(run.head_branch === 'main' && run.head_repository?.full_name === repository, 'Release run must originate from this repository main');
  requireThat(integerPattern.test(String(run.id)) && integerPattern.test(String(run.run_attempt)), 'Release run ID and attempt are required');
  requireThat(shaPattern.test(run.head_sha || ''), 'Release event head SHA is invalid');
  const context = parseReleaseContext(contextText);
  requireThat(context.run_id === String(run.id) && context.run_attempt === String(run.run_attempt), 'Release context belongs to a different run or attempt');
  requireThat(context.workflow_ref === `${repository}/${workflowPath}@refs/heads/main`, 'Release context identifies a different workflow or branch');
  requireThat(shaPattern.test(context.source_sha || '') && shaPattern.test(context.workflow_sha || '') && shaPattern.test(context.workflow_blob || ''), 'Release source/workflow identity is missing or invalid');
  if (expectedMainSha) requireThat(context.source_sha === expectedMainSha, 'Requested source SHA differs from the release artifact');
  requireThat(Array.isArray(jobs?.jobs) && jobs.total_count === jobs.jobs.length, 'Complete release-attempt job evidence is required');
  const deployments = jobs.jobs.filter(job => job.name === 'Deploy the verified student release');
  requireThat(deployments.length === 1, 'Exactly one release deployment job is required');
  const deployment = deployments[0];
  // The jobs endpoint is scoped to /attempts/<attempt>/jobs. GitHub's job
  // response schema may omit run_attempt; when present it must also agree.
  requireThat(String(deployment.run_id) === String(run.id) && (deployment.run_attempt == null || String(deployment.run_attempt) === String(run.run_attempt)), 'Deployment job belongs to a different run or attempt');
  const binding = {
    binding: 'release_artifact_and_deployment',
    release_run_id: String(run.id), release_run_attempt: String(run.run_attempt),
    release_artifact: `archive-pages-release-evidence-${run.id}-${run.run_attempt}`,
    release_event_head_sha: run.head_sha,
    release_workflow_sha: context.workflow_sha,
    release_workflow_blob: context.workflow_blob,
    context_sha256: hash(contextText),
    deployment_job_id: String(deployment.id),
    deployment_conclusion: deployment.conclusion
  };
  // A successful release workflow can legitimately defer registration or do a content NO_OP.
  // Neither event proves that its requested source was deployed, so it cannot yield an audit PASS.
  if (deployment.status === 'completed' && deployment.conclusion === 'skipped') {
    return { ...binding, status: 'NOT_RUN_RELEASE_NOT_DEPLOYED', verify: false, source_sha: null, requested_source_sha: context.source_sha };
  }
  requireThat(deployment.status === 'completed' && deployment.conclusion === 'success', 'Release deployment job did not succeed');
  const steps = (deployment.steps || []).filter(step => step.name === 'Deploy Pages artifact');
  requireThat(steps.length === 1 && steps[0].status === 'completed' && steps[0].conclusion === 'success', 'Deploy Pages artifact step did not succeed');
  requireThat(context.verified_release_main_sha === context.source_sha, 'The deployed source was not verified by the release snapshot guard');
  requireThat(context.release_gate === 'RELEASE_GATE_PASS', 'Release gate evidence is not PASS');
  return { ...binding, status: 'BOUND_DEPLOYED_MAIN_SOURCE', verify: true, source_sha: context.source_sha };
}

export function verifyMainAncestor(sourceSha, root = '.') {
  requireThat(shaPattern.test(sourceSha || ''), 'Only a full commit SHA may be checked out');
  const resolved = execFileSync('git', ['rev-parse', '--verify', `${sourceSha}^{commit}`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  requireThat(resolved === sourceSha, 'Source SHA does not resolve to the expected commit');
  try { execFileSync('git', ['merge-base', '--is-ancestor', sourceSha, 'origin/main'], { cwd: root, stdio: 'pipe' }); }
  catch { throw new Error('Source SHA is not an ancestor of origin/main'); }
  return true;
}

function main() {
  const args = {};
  for (let i = 2; i < process.argv.length; i += 2) {
    const key = process.argv[i];
    requireThat(['--event', '--context', '--jobs', '--out', '--root'].includes(key) && process.argv[i + 1], `Unknown or valueless argument: ${key}`);
    args[key] = process.argv[i + 1];
  }
  requireThat(args['--out'], '--out is required');
  let result;
  try {
    const eventName = process.env.GITHUB_EVENT_NAME;
    const event = JSON.parse(fs.readFileSync(args['--event'] || process.env.GITHUB_EVENT_PATH, 'utf8'));
    const automated = eventName === 'workflow_run';
    const contextText = automated ? fs.readFileSync(args['--context'], 'utf8') : undefined;
    const jobsText = automated ? fs.readFileSync(args['--jobs'], 'utf8') : undefined;
    result = resolveReleaseSource({ eventName, event, repository: process.env.GITHUB_REPOSITORY, expectedMainSha: process.env.EXPECTED_MAIN_SHA || '', contextText, jobs: automated ? JSON.parse(jobsText) : undefined });
    if (result.verify) result.main_ancestor_verified = verifyMainAncestor(result.source_sha, args['--root'] || '.');
    if (jobsText) result.jobs_sha256 = hash(jobsText);
  } catch (error) {
    result = { status: 'FAIL_RELEASE_SOURCE_BINDING', verify: false, error: error.message };
    process.exitCode = 1;
  }
  fs.mkdirSync(path.dirname(args['--out']), { recursive: true });
  fs.writeFileSync(args['--out'], JSON.stringify(result, null, 2) + '\n');
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `verify=${result.verify}\nsource_sha=${result.source_sha || ''}\nrelease_run_id=${result.release_run_id || ''}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Public audit source binding\n\nStatus: ${result.status}\n\nSource: ${result.source_sha || 'NOT_RUN'}\n\nRelease run: ${result.release_run_id || 'explicit manual SHA'}\n\n`);
  console.log(JSON.stringify(result));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
