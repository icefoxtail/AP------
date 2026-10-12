/**
 * GitHub Contents CAS ledger bridge for GPT2 Library writes.
 * Runs on a DEDICATED non-main branch. The injected github client exposes the
 * connector's fetch_file, create_file and update_file actions. The source
 * branch must be pre-created by an authorized operator, never auto-created here.
 */
const valid = path => typeof path === 'string' && /^gpt2-locks\/[a-f0-9]{64}\.json$/.test(path);
const missing = e => /(?:NOT_FOUND|404|Not Found)/.test(String(e?.message || e));
const alreadyExists = e => /(?:already exists|sha.*required|sha.*wasn.t supplied|409|422.*already|422.*exists)/i.test(String(e?.message || e));
const versionConflict = e => /(?:409|sha.*does not match|sha.*mismatch|update.*conflict)/i.test(String(e?.message || e));
export function createGitHubCasLedger({ github, repository, branch } = {}) {
  if (!github || ['fetch_file','create_file','update_file'].some(k => typeof github[k] !== 'function') ||
      typeof repository !== 'string' || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository) ||
      typeof branch !== 'string' || !/^(?:ops|gpt2-cas)\/[-A-Za-z0-9_./]+$/.test(branch) ||
      branch === 'main') throw Error('DEDICATED_GITHUB_CAS_BRANCH_REQUIRED');
  const args = path => {
    if (!valid(path)) throw Error('INVALID_CAS_PATH');
    return { repository_full_name: repository, path };
  };
  return {
    capabilities: { atomicCreateIfAbsent: true, atomicCompareAndSwap: true, readAfterWrite: true },
    async get(path) {
      const req = args(path);
      try {
        const r = (await github.fetch_file({ ...req, ref: branch })).result;
        if (!r || !/^[a-f0-9]{40}$/.test(r.sha) || typeof r.content !== 'string')
          throw Error('GITHUB_LEDGER_READ_INVALID');
        return { version: r.sha, value: JSON.parse(r.content) };
      } catch (e) { if (missing(e)) return null; throw e; }
    },
    async createIfAbsent(path, value) {
      const req = args(path);
      try {
        const r = await github.create_file({ ...req, branch,
          content: JSON.stringify(value, null, 2) + '\n', message: 'chore(gpt2-cas): claim immutable Library object' });
        if (!r?.result?.commit_sha) throw Error('GITHUB_CAS_CREATE_UNCONFIRMED');
        return { created: true };
      } catch (e) {
        if (!alreadyExists(e)) throw e;
        const existing = await this.get(path);
        if (!existing) throw Error('GITHUB_CAS_CREATE_CONFLICT_UNRESOLVED');
        return { created: false };
      }
    },
    async compareAndSwap(path, version, value) {
      const req = args(path);
      if (!/^[a-f0-9]{40}$/.test(version || '')) throw Error('GITHUB_CAS_VERSION_REQUIRED');
      try {
        const r = await github.update_file({ ...req, branch, sha: version,
          content: JSON.stringify(value, null, 2) + '\n', message: 'chore(gpt2-cas): advance immutable Library claim' });
        if (!r?.result?.content_sha) throw Error('GITHUB_CAS_UPDATE_UNCONFIRMED');
        return { updated: true };
      } catch (e) {
        if (!versionConflict(e)) throw e;
        return { updated: false };
      }
    },
  };
}