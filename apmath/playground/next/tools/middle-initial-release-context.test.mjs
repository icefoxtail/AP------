import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseReleaseContext, resolveReleaseSource, verifyMainAncestor } from './middle-initial-release-context.mjs';

const repository = 'icefoxtail/AP------', source = 'a'.repeat(40), head = 'b'.repeat(40), blob = 'c'.repeat(40);
const clone = value => JSON.parse(JSON.stringify(value));
function fixture() {
  const event = { repository: { full_name: repository }, workflow_run: { id: 42600001, run_attempt: 2, name: 'Archive Pages Release', status: 'completed', conclusion: 'success', head_branch: 'main', head_repository: { full_name: repository }, head_sha: head } };
  const contextText = `source_sha=${source}\nrun_id=42600001\nrun_attempt=2\nworkflow_ref=${repository}/.github/workflows/archive-pages-release.yml@refs/heads/main\nworkflow_sha=${head}\nworkflow_blob=${blob}\nverified_release_main_sha=${source}\nrelease_gate=RELEASE_GATE_PASS\n# diagnostic comment\n`;
  const jobs = { total_count: 1, jobs: [{ id: 91, run_id: 42600001, name: 'Deploy the verified student release', status: 'completed', conclusion: 'success', steps: [{ name: 'Deploy Pages artifact', status: 'completed', conclusion: 'success' }] }] };
  return { eventName: 'workflow_run', repository, event, contextText, jobs };
}

test('the deployed artifact source wins when the workflow event head is a different main commit', () => {
  const result = resolveReleaseSource(fixture());
  assert.equal(result.verify, true);
  assert.equal(result.source_sha, source);
  assert.notEqual(result.source_sha, head);
  assert.equal(result.release_event_head_sha, head);
  assert.equal(result.release_run_id, '42600001');
  assert.equal(result.release_run_attempt, '2');
  assert.equal(result.release_artifact, 'archive-pages-release-evidence-42600001-2');
  assert.match(result.context_sha256, /^[a-f0-9]{64}$/);
});

test('different artifact runs, rerun attempts, workflows, source guards and duplicate keys fail closed', () => {
  const replacements = [
    ['run_id=42600001','run_id=42600000'], ['run_attempt=2','run_attempt=1'],
    ['@refs/heads/main','@refs/heads/other'], ['archive-pages-release.yml','unrelated.yml'],
    [`source_sha=${source}`,'source_sha=main'], [`verified_release_main_sha=${source}`,`verified_release_main_sha=${head}`],
    ['release_gate=RELEASE_GATE_PASS','release_gate=RELEASE_GATE_FAIL'],
    ['release_gate=RELEASE_GATE_PASS',''], [`workflow_sha=${head}`,'workflow_sha=HEAD'],
    [`workflow_blob=${blob}`,'workflow_blob=missing']
  ];
  for (const [before,after] of replacements) {
    const input=fixture();input.contextText=input.contextText.replace(before,after);
    assert.throws(()=>resolveReleaseSource(input),undefined,`${before} must be bound to this successful release`);
  }
  const duplicate=fixture();duplicate.contextText+=`source_sha=${head}\n`;
  assert.throws(()=>resolveReleaseSource(duplicate),/Duplicate/);
  assert.throws(()=>parseReleaseContext(''),/missing/);
  assert.throws(()=>resolveReleaseSource({...fixture(),expectedMainSha:head}),/differs/);
});

test('failed, incomplete, foreign and non-main workflow events cannot select a source', () => {
  const mutations=[
    input=>input.event.repository.full_name='someone/fork',
    input=>input.event.workflow_run.head_repository.full_name='someone/fork',
    input=>input.event.workflow_run.head_branch='feature',
    input=>input.event.workflow_run.name='Another workflow',
    input=>input.event.workflow_run.status='in_progress',
    input=>input.event.workflow_run.conclusion='failure',
    input=>delete input.event.workflow_run.run_attempt,
    input=>input.event.workflow_run.id='not-an-id',
    input=>input.event.workflow_run.head_sha='main'
  ];
  for(const mutate of mutations){const input=fixture();mutate(input);assert.throws(()=>resolveReleaseSource(input));}
});

test('actual deployment and step evidence is required even when the overall release succeeded', () => {
  const mutations=[
    input=>input.jobs.total_count=2,
    input=>input.jobs.jobs=[],
    input=>input.jobs.jobs[0].run_id=42600000,
    input=>input.jobs.jobs[0].run_attempt=1,
    input=>input.jobs.jobs[0].conclusion='failure',
    input=>input.jobs.jobs[0].status='in_progress',
    input=>input.jobs.jobs[0].steps[0].conclusion='skipped',
    input=>input.jobs.jobs[0].steps[0].status='queued',
    input=>input.jobs.jobs[0].steps=[],
    input=>{input.jobs.jobs.push(clone(input.jobs.jobs[0]));input.jobs.total_count=2;}
  ];
  for(const mutate of mutations){const input=fixture();mutate(input);assert.throws(()=>resolveReleaseSource(input));}
  const input=fixture();input.jobs.jobs[0].run_attempt=2;
  assert.equal(resolveReleaseSource(input).verify,true,'explicit run_attempt agrees when the API includes it');
});

test('NO_OP or deferred release with skipped deployment is recorded as NOT_RUN', () => {
  const input=fixture();input.jobs.jobs[0].conclusion='skipped';input.jobs.jobs[0].steps=[];
  input.contextText=input.contextText.replace(`verified_release_main_sha=${source}\n`,'').replace('release_gate=RELEASE_GATE_PASS\n','');
  const result=resolveReleaseSource(input);
  assert.equal(result.status,'NOT_RUN_RELEASE_NOT_DEPLOYED');assert.equal(result.verify,false);
  assert.equal(result.source_sha,null);assert.equal(result.requested_source_sha,source);
});

test('manual checks require a literal full SHA and never fall back to a workflow event head', () => {
  const base={eventName:'workflow_dispatch',repository,event:{repository:{full_name:repository}}};
  assert.equal(resolveReleaseSource({...base,expectedMainSha:source}).source_sha,source);
  for(const value of ['',undefined,'main',source.slice(0,7),`${source}\nsource_sha=${head}`,'$(echo unsafe)']){
    assert.throws(()=>resolveReleaseSource({...base,expectedMainSha:value}),/explicit 40-character/);
  }
});

test('main ancestry is checked with real Git, including a reachable commit outside main', t => {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'apmath-release-source-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const git=(...args)=>execFileSync('git',['-c','user.name=Geometry QA','-c','user.email=qa@example.invalid',...args],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  git('init','-q','--initial-branch=main');git('commit','--allow-empty','-qm','initial');const initial=git('rev-parse','HEAD');
  git('commit','--allow-empty','-qm','second');const main=git('rev-parse','HEAD');git('update-ref','refs/remotes/origin/main',main);
  const outside=git('commit-tree','HEAD^{tree}','-p',main,'-m','not on main');
  assert.equal(verifyMainAncestor(initial,root),true);assert.equal(verifyMainAncestor(main,root),true);
  assert.throws(()=>verifyMainAncestor(outside,root),/not an ancestor/);
  assert.throws(()=>verifyMainAncestor('HEAD',root),/full commit SHA/);
});

test('CLI persists failure evidence and emits no source output for an implicit manual request', t => {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'apmath-release-cli-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const event=path.join(root,'event.json'),out=path.join(root,'binding.json'),outputs=path.join(root,'outputs');
  fs.writeFileSync(event,JSON.stringify({repository:{full_name:repository}}));
  const result=spawnSync(process.execPath,[fileURLToPath(new URL('./middle-initial-release-context.mjs',import.meta.url)),'--event',event,'--out',out],{encoding:'utf8',env:{...process.env,GITHUB_EVENT_NAME:'workflow_dispatch',GITHUB_REPOSITORY:repository,EXPECTED_MAIN_SHA:'',GITHUB_OUTPUT:outputs,GITHUB_STEP_SUMMARY:''}});
  assert.equal(result.status,1);
  assert.equal(JSON.parse(fs.readFileSync(out,'utf8')).status,'FAIL_RELEASE_SOURCE_BINDING');
  assert.match(fs.readFileSync(outputs,'utf8'),/^verify=false\nsource_sha=\n/);
});

test('the public workflow downloads the exact release attempt and checks out only the resolved source', () => {
  const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
  const workflowPath='.github/workflows/middle-initial-public.yml';
  // The inventory job uses a sparse checkout. Check its exact HEAD blob rather
  // than skipping the workflow contract when the worktree omits .github.
  const workflow=fs.existsSync(path.join(repo,workflowPath))
    ? fs.readFileSync(path.join(repo,workflowPath),'utf8')
    : execFileSync('git',['show',`HEAD:${workflowPath}`],{cwd:repo,encoding:'utf8'});
  assert.match(workflow,/actions: read/);
  assert.match(workflow,/name: archive-pages-release-evidence-\$\{\{ github\.event\.workflow_run\.id \}\}-\$\{\{ github\.event\.workflow_run\.run_attempt \}\}/);
  assert.match(workflow,/run-id: \$\{\{ github\.event\.workflow_run\.id \}\}/);
  assert.match(workflow,/\/attempts\/\$RELEASE_RUN_ATTEMPT\/jobs\?per_page=100/);
  assert.match(workflow,/if: needs\.snapshot\.outputs\.verify == 'true'/);
  assert.match(workflow,/ref: \$\{\{ needs\.snapshot\.outputs\.source_sha \}\}/);
  assert.match(workflow,/ref: \$\{\{ needs\.inventory\.outputs\.source_sha \}\}/);
  assert.doesNotMatch(workflow,/ref:.*workflow_run\.head_sha/);
  assert.match(workflow,/expected_main_sha:[\s\S]*?required: true/);
});
