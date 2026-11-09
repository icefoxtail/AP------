// Bind browser evidence to the PR head and the actual tested merge checkout.
// A commit label alone is not proof that the rendered source had those bytes.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const sha256 = value => createHash('sha256').update(value).digest('hex');
const git = (root, args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const hashCache = new Map();

export function evidenceProvenance(root, { baseline = false, env = process.env, toolRoot = path.dirname(fileURLToPath(import.meta.url)) } = {}) {
  const sourceCommit = git(root, ['rev-parse', 'HEAD']);
  const candidateHeadSha = env.APMATH_CANDIDATE_HEAD_SHA || sourceCommit;
  if (!/^[a-f0-9]{40}$/.test(candidateHeadSha)) throw Error('Invalid candidate head SHA');
  return {
    sourceRole: baseline ? 'BASELINE' : 'CANDIDATE',
    sourceCommit,
    sourceTree: git(root, ['rev-parse', 'HEAD^{tree}']),
    candidateHeadSha,
    testedCheckoutSha: git(toolRoot, ['rev-parse', 'HEAD']),
    testedCheckoutTree: git(toolRoot, ['rev-parse', 'HEAD^{tree}']),
    baselineSha: env.APMATH_BASE_SHA || (baseline ? sourceCommit : null),
    eventName: env.GITHUB_EVENT_NAME || 'local',
    checkoutRef: env.GITHUB_REF || null,
    eventSha: env.GITHUB_SHA || null,
    runId: env.GITHUB_RUN_ID || null,
    runAttempt: env.GITHUB_RUN_ATTEMPT || null,
    repository: env.GITHUB_REPOSITORY || null,
    pullRequest: env.APMATH_PR_NUMBER || null
  };
}

export function bindLabSources(root, lab, provenance) {
  const html = path.posix.join('apmath/playground', lab.next);
  const source = fs.readFileSync(path.join(root, html), 'utf8');
  const files = new Set([html, 'apmath/playground/next/kit/apl-catalog.js']);
  const externalResources = [];
  // Inline code is covered by the HTML hash; local scripts and styles are
  // individually bound. External font resources are explicitly not hashed.
  for (const match of source.matchAll(/<(script|link)\b[^>]*>/gi)) {
    if (match[1].toLowerCase() === 'link' && !/\brel=["']stylesheet["']/i.test(match[0])) continue;
    const ref = /\b(?:src|href)=["']([^"']+)["']/i.exec(match[0])?.[1];
    if (!ref) continue;
    if (/^(?:[a-z]+:)?\/\//i.test(ref) || /^[a-z]+:/i.test(ref)) { externalResources.push(ref); continue; }
    const relative = path.posix.normalize(path.posix.join(path.posix.dirname(html), ref.split(/[?#]/)[0]));
    if (!relative.startsWith('apmath/playground/')) throw Error(`Source dependency leaves playground: ${relative}`);
    files.add(relative);
  }
  const errors = [];
  const entries = [...files].sort().map(file => {
    const data = fs.readFileSync(path.join(root, file));
    const entry = { path: file, sha256: sha256(data), bytes: data.length };
    if (provenance.sourceRole === 'CANDIDATE') {
      const key = `${root}:${provenance.candidateHeadSha}:${file}`;
      try {
        if (!hashCache.has(key)) hashCache.set(key, sha256(execFileSync('git', ['show', `${provenance.candidateHeadSha}:${file}`], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] })));
        entry.candidateHeadSha256 = hashCache.get(key);
        entry.matchesCandidateHead = entry.sha256 === entry.candidateHeadSha256;
        if (!entry.matchesCandidateHead) errors.push({ file, reason: 'tested-source-differs-from-candidate-head' });
      } catch {
        entry.matchesCandidateHead = false;
        errors.push({ file, reason: 'candidate-head-source-unavailable' });
      }
    }
    return entry;
  });
  return {
    lab: lab.id, html,
    htmlSha256: entries.find(e => e.path === html).sha256,
    sourceSetSha256: sha256(JSON.stringify(entries.map(({ path: file, sha256: hash }) => [file, hash]))),
    files: entries, externalResources,
    candidateHeadSourceVerified: provenance.sourceRole === 'CANDIDATE' ? errors.length === 0 : null,
    errors
  };
}
