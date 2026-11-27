#!/usr/bin/env node
// Read-only registration failure triage. Never edits sources, metadata, gates, or a running writer.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ISSUE_TITLE = '[자동 진단] Archive 등록기 차단 오류';
const ISSUE_MARKER = '<!-- archive-registration-assistant:v1 -->';

function gh(args) {
  return execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
}

function api(repository, endpoint) {
  return JSON.parse(gh(['api', `repos/${repository}/${endpoint}`]));
}

// Do not quote unfiltered runner logs into issues: logs can contain secrets or untrusted text.
export function classifyRegistrationFailure(rawLog, failingStep = '') {
  const log = String(rawLog).replace(/\x1b\[[0-9;]*m/g, '');
  const svg = log.match(/SVG_STUDENT_LANGUAGE_CONTRACT_FAIL:(assets\/[\p{L}\p{N}_./-]+\.svg):(SVG_[A-Z0-9_]+)(?:@([a-z]+))?/u);
  if (svg && !svg[1].includes('..')) {
    return {
      type: 'SOURCE_VALIDATION',
      code: svg[2],
      asset: `archive/${svg[1]}`,
      location: svg[3] || 'unknown',
      guidance: 'SVG 접근성 문구를 실제 수학 내용에 맞게 수정하고 원래 검증을 통과시킨 뒤 재등록해야 합니다. 검증 우회·무작정 재시도는 하지 않습니다.',
    };
  }
  const accessibility = log.match(/(SVG_ACCESSIBILITY_[A-Z0-9_]+):(assets\/[\p{L}\p{N}_./-]+\.svg)/u);
  if (accessibility && !accessibility[2].includes('..')) {
    return {
      type: 'SOURCE_VALIDATION', code: accessibility[1],
      asset: `archive/${accessibility[2]}`, location: 'accessibility text',
      guidance: '대상 SVG의 title/desc 문구를 실제 그림 내용에 맞는 한국어로 고친 뒤 공식 접근성 검증을 재실행해야 합니다.',
    };
  }
  const native = log.match(/NATIVE_COMMAND_FAILED:([A-Za-z][A-Za-z0-9_-]*):\d+/);
  if (native) {
    return {
      type: 'NATIVE_LANE_FAILED', code: 'NATIVE_COMMAND_FAILED', asset: '',
      location: native[1],
      guidance: '실패한 레인의 원본 로그와 입력을 확인해야 합니다. 이전 검증을 성공으로 처리하지 않습니다.',
    };
  }
  return {
    type: 'UNCLASSIFIED', code: 'REGISTRATION_FAILURE', asset: '',
    location: /^(?:[\w -]{1,100})$/.test(failingStep) ? failingStep : 'unknown',
    guidance: '실패 로그를 담당 작업자가 분석해야 합니다. 원인이 확인되기 전에는 자동 재시도하지 않습니다.',
  };
}

export function issueBody(run, job, finding) {
  const runId = Number(run.id);
  const jobId = Number(job?.id);
  const server = 'https://github.com';
  const repository = String(run.repository || '').match(/^[\w.-]+\/[\w.-]+$/)?.[0] || '';
  const runUrl = `${server}/${repository}/actions/runs/${runId}`;
  const jobUrl = jobId ? `${runUrl}/job/${jobId}` : runUrl;
  return [
    ISSUE_MARKER,
    '## 자동 등록기 차단 원인',
    '',
    `- 등록 실행: ${runUrl}`,
    `- 실패 작업: ${job?.name || 'UNKNOWN'} (${jobUrl})`,
    `- 유형: \`${finding.type}\``,
    `- 오류 코드: \`${finding.code}\``,
    `- 실패 위치: \`${finding.location}\``,
    ...(finding.asset ? [`- 대상: \`${finding.asset}\``] : []),
    '',
    '### 후속 조치',
    finding.guidance,
    '',
    '등록기 단일 writer와 기존 학생 배포 검증은 그대로 유지됩니다. 이 이슈는 자동 진단이며 수정·등록·배포 완료 증거가 아닙니다.',
  ].join('\n');
}

function findIssue(repository) {
  // Recently updated issues first; one issue is reused instead of creating one per failed push.
  const issues = api(repository, 'issues?state=all&sort=updated&direction=desc&per_page=100');
  return issues.find(issue => !issue.pull_request && issue.title === ISSUE_TITLE &&
    typeof issue.body === 'string' && issue.body.includes(ISSUE_MARKER));
}

function writeIssue(repository, existing, body) {
  if (existing) {
    gh(['api', `repos/${repository}/issues/${existing.number}`, '-X', 'PATCH',
      '-f', 'state=open', '-f', `body=${body}`]);
    return `UPDATED #${existing.number}`;
  }
  const created = JSON.parse(gh(['api', `repos/${repository}/issues`, '-X', 'POST',
    '-f', `title=${ISSUE_TITLE}`, '-f', `body=${body}`]));
  return `CREATED #${created.number}`;
}

function latestCompletedRun(repository) {
  const data = api(repository, 'actions/workflows/archive-main-auto-meta.yml/runs?branch=main&status=completed&per_page=10');
  return data.workflow_runs?.[0];
}

export function shouldTriage(run, newest) {
  return !!run && !!newest && Number(run.id) === Number(newest.id) &&
    run.head_branch === 'main' && run.event !== 'pull_request';
}

function main() {
  const repository = process.env.GITHUB_REPOSITORY || '';
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository)) throw new Error('GITHUB_REPOSITORY required');
  const specifiedId = process.argv[2];
  const newest = latestCompletedRun(repository);
  const run = specifiedId ? api(repository, `actions/runs/${Number(specifiedId)}`) : newest;
  if (!shouldTriage(run, newest)) {
    process.stdout.write('SKIPPED: stale or non-main registration run\n');
    return;
  }
  const existing = findIssue(repository);
  if (run.conclusion === 'success') {
    if (existing?.state === 'open') {
      gh(['api', `repos/${repository}/issues/${existing.number}`, '-X', 'PATCH', '-f', 'state=closed']);
      process.stdout.write(`RESOLVED #${existing.number}: latest registrar succeeded\n`);
    } else process.stdout.write('SUCCESS: no open registration blocker\n');
    return;
  }
  if (run.conclusion !== 'failure') {
    process.stdout.write(`SKIPPED: registration conclusion ${run.conclusion}\n`);
    return;
  }
  const jobs = api(repository, `actions/runs/${run.id}/jobs?per_page=100`).jobs || [];
  const job = jobs.find(item => item.name === 'register' && item.conclusion === 'failure') ||
    jobs.find(item => item.conclusion === 'failure');
  const step = job?.steps?.find(item => item.conclusion === 'failure')?.name || '';
  let log = '';
  if (job) {
    try { log = gh(['run', 'view', String(run.id), '--job', String(job.id), '--log', '--repo', repository]); }
    catch { /* The issue still records the failed job when logs are temporarily unavailable. */ }
  }
  const finding = classifyRegistrationFailure(log, step);
  const body = issueBody({ ...run, repository }, job, finding);
  const result = writeIssue(repository, existing, body);
  process.stdout.write(`${result}: ${finding.type} ${finding.code} ${finding.asset}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Registration assistant\n${body}\n`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try { main(); } catch (error) { process.stderr.write(`Registration assistant failed: ${error.message}\n`); process.exitCode = 1; }
}
