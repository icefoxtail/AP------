#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(SCRIPT_DIR, '../..');
const DEFAULT_MANIFEST = path.join(DEFAULT_ROOT, 'tools', 'skills', 'manifest.json');
const ALLOWED_STATUSES = new Set(['active', 'deprecated', 'experimental']);

function parseArgs(argv) {
  const args = { root: DEFAULT_ROOT, manifest: null, upstream: null, json: false, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--json') {
      args.json = true;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      args.help = true;
      continue;
    }
    if (arg === '--root' || arg === '--manifest' || arg === '--upstream') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new Error(arg + ' requires a value');
      args[arg.slice(2)] = value;
      index += 1;
      continue;
    }
    throw new Error('Unknown argument: ' + arg);
  }
  return args;
}

function printHelp() {
  console.log([
    'Usage: node tools/skills/verify-skills.mjs [options]',
    '',
    'Verify repository-managed project skills in the current worktree.',
    '',
    'Options:',
    "  --root <path>      Repository root; defaults to this script's repository",
    '  --manifest <path>  Manifest path relative to the repository root',
    '  --upstream <ref>   Upstream ref; defaults to manifest upstream or origin/main',
    '  --json             Emit a machine-readable report',
    '  --help             Show this help'
  ].join('\n'));
}

function runGit(root, args) {
  const result = spawnSync('git', ['-C', root, ...args], {
    encoding: 'utf8',
    windowsHide: true
  });
  if (result.error) return { ok: false, status: null, stdout: '', stderr: result.error.message };
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || ''
  };
}

function parseAheadBehind(text) {
  const values = text.trim().split(/\s+/);
  if (values.length !== 2 || !values.every(value => /^\d+$/.test(value))) return null;
  return { ahead: Number(values[0]), behind: Number(values[1]) };
}

function verifyUpstream(root, branch, commit, upstreamRef, errors) {
  if (typeof upstreamRef !== 'string' || !upstreamRef.trim()) {
    errors.push('upstream ref must be a non-empty Git ref');
    return null;
  }
  const ref = upstreamRef.trim();
  const upstreamResult = runGit(root, ['rev-parse', '--verify', '--quiet', ref + '^{commit}']);
  if (!upstreamResult.ok) {
    errors.push('upstream ref is unavailable: ' + ref + ' (run git fetch origin main)');
    return { ref, commit: null, ahead: null, behind: null, status: 'MISSING' };
  }
  const upstreamCommit = upstreamResult.stdout.trim();
  const comparison = runGit(root, ['rev-list', '--left-right', '--count', commit + '...' + ref]);
  const aheadBehind = comparison.ok ? parseAheadBehind(comparison.stdout) : null;
  if (!aheadBehind) {
    errors.push('could not compare HEAD with upstream ref: ' + ref);
    return { ref, commit: upstreamCommit, ahead: null, behind: null, status: 'UNKNOWN' };
  }

  let contains = null;
  if (branch === 'main') {
    if (aheadBehind.ahead !== 0 || aheadBehind.behind !== 0) {
      errors.push(
        'main is not synchronized with ' + ref +
        ' (ahead=' + aheadBehind.ahead + ', behind=' + aheadBehind.behind + ')'
      );
    }
  } else {
    contains = runGit(root, ['merge-base', '--is-ancestor', ref, commit]);
    if (!contains.ok) {
      errors.push(
        'branch does not contain the latest ' + ref +
        ' (ahead=' + aheadBehind.ahead + ', behind=' + aheadBehind.behind + ')'
      );
    }
  }
  return {
    ref,
    commit: upstreamCommit,
    ahead: aheadBehind.ahead,
    behind: aheadBehind.behind,
    status: (branch === 'main' && (aheadBehind.ahead !== 0 || aheadBehind.behind !== 0)) ||
      (branch !== 'main' && !contains?.ok)
      ? 'FAIL'
      : 'PASS'
  };
}

function samePath(left, right) {
  const normalize = value => path.resolve(value).replace(/[\\/]+$/, '').toLowerCase();
  return normalize(left) === normalize(right);
}

function isInside(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (
    relative !== '..' &&
    !relative.startsWith('..' + path.sep) &&
    !path.isAbsolute(relative)
  );
}

function normalizeRepoPath(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(label + ' must be a non-empty relative path');
  const normalized = value.trim().replace(/\\/g, '/');
  if (
    normalized.startsWith('/') ||
    /^[A-Za-z]:\//.test(normalized) ||
    normalized.split('/').some(part => part === '..') ||
    normalized.includes('\0')
  ) {
    throw new Error(label + ' must stay inside the repository: ' + value);
  }
  const clean = normalized.split('/').filter(part => part && part !== '.').join('/');
  if (!clean) throw new Error(label + ' must not resolve to the repository root');
  return clean;
}

function resolveRepoPath(root, relative, label) {
  const normalized = normalizeRepoPath(relative, label);
  const absolute = path.resolve(root, ...normalized.split('/'));
  if (!isInside(root, absolute)) throw new Error(label + ' escapes the repository: ' + relative);
  return { relative: normalized, absolute };
}

function readJson(file, label) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(label + ' is not valid JSON: ' + error.message);
  }
}

function stripScalar(value) {
  const trimmed = value.trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseSkillFrontmatter(text, label) {
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') throw new Error(label + ' must begin with YAML frontmatter');
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (end < 0) throw new Error(label + ' has no closing YAML frontmatter delimiter');
  const fields = {};
  for (const line of lines.slice(1, end)) {
    const match = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);
    if (match && fields[match[1]] === undefined) fields[match[1]] = stripScalar(match[2]);
  }
  if (!fields.name) throw new Error(label + ' frontmatter is missing name');
  if (!fields.description) throw new Error(label + ' frontmatter is missing description');
  return { name: fields.name, description: fields.description };
}

function listDirectSkillPaths(root, canonicalRoots, errors) {
  const discovered = [];
  for (const canonicalRoot of canonicalRoots) {
    const resolved = resolveRepoPath(root, canonicalRoot, 'canonicalRoots entry');
    if (!fs.existsSync(resolved.absolute)) {
      errors.push('canonical skill root does not exist: ' + resolved.relative);
      continue;
    }
    if (!fs.statSync(resolved.absolute).isDirectory()) {
      errors.push('canonical skill root is not a directory: ' + resolved.relative);
      continue;
    }
    for (const entry of fs.readdirSync(resolved.absolute, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const skillPath = path.join(resolved.absolute, entry.name, 'SKILL.md');
      if (!fs.existsSync(skillPath) || !fs.statSync(skillPath).isFile()) continue;
      discovered.push(path.relative(root, path.dirname(skillPath)).split(path.sep).join('/'));
    }
  }
  return discovered.sort();
}

function gitTrackedFiles(root, repoPath) {
  const result = runGit(root, ['ls-files', '--', repoPath]);
  return result.ok ? result.stdout.split(/\r?\n/).filter(Boolean) : [];
}

function gitStatusEntries(root, repoPath) {
  const result = runGit(root, ['status', '--short', '--untracked-files=all', '--ignored', '--', repoPath]);
  if (!result.ok) return { entries: [], error: result.stderr.trim() || 'git status failed' };
  return {
    entries: result.stdout.split(/\r?\n/).filter(Boolean),
    error: null
  };
}

function statusPath(line) {
  return line.length > 3 ? line.slice(3).trim() : line.trim();
}

function isGeneratedCache(repoPath) {
  const normalized = repoPath.replace(/\\/g, '/');
  return normalized.split('/').some(part => ['__pycache__', '.pytest_cache', '.mypy_cache', '.ruff_cache'].includes(part)) ||
    normalized.endsWith('.pyc');
}

function verify(root, manifestPath, requestedUpstream) {
  const errors = [];
  const warnings = [];
  const gitRootResult = runGit(root, ['rev-parse', '--show-toplevel']);
  if (!gitRootResult.ok) {
    return {
      status: 'FAIL',
      root,
      branch: null,
      commit: null,
      upstream: null,
      manifest: manifestPath,
      skillCount: 0,
      skills: [],
      errors: ['not a Git worktree: ' + (gitRootResult.stderr.trim() || root)],
      warnings
    };
  }

  const gitRoot = path.resolve(gitRootResult.stdout.trim());
  if (!samePath(root, gitRoot)) errors.push('verification root must be the Git worktree root: ' + gitRoot);

  const branchResult = runGit(gitRoot, ['symbolic-ref', '--quiet', '--short', 'HEAD']);
  const commitResult = runGit(gitRoot, ['rev-parse', 'HEAD']);
  const branch = branchResult.ok ? branchResult.stdout.trim() : 'DETACHED';
  const commit = commitResult.ok ? commitResult.stdout.trim() : null;

  let manifest;
  try {
    manifest = readJson(manifestPath, 'skill manifest');
  } catch (error) {
    errors.push(error.message);
    return { status: 'FAIL', root: gitRoot, branch, commit, upstream: null, manifest: manifestPath, skillCount: 0, skills: [], errors, warnings };
  }

  if (manifest.schemaVersion !== 1) errors.push('skill manifest schemaVersion must be 1');
  if (manifest.source !== 'repository') errors.push('skill manifest source must be "repository"');
  if (manifest.upstream !== undefined && typeof manifest.upstream !== 'string') errors.push('skill manifest upstream must be a Git ref string');
  const upstreamRef = requestedUpstream || manifest.upstream || 'origin/main';
  const upstream = verifyUpstream(gitRoot, branch, commit, upstreamRef, errors);
  if (!Array.isArray(manifest.canonicalRoots) || !manifest.canonicalRoots.length) {
    errors.push('skill manifest canonicalRoots must be a non-empty array');
  }
  if (!Array.isArray(manifest.skills) || !manifest.skills.length) {
    errors.push('skill manifest skills must be a non-empty array');
  }

  let canonicalRoots = [];
  try {
    canonicalRoots = (manifest.canonicalRoots || []).map((value, index) =>
      normalizeRepoPath(value, 'canonicalRoots[' + index + ']')
    );
  } catch (error) {
    errors.push(error.message);
  }

  const skillReports = [];
  const names = new Set();
  const paths = new Set();
  for (const [index, entry] of (manifest.skills || []).entries()) {
    const label = 'skills[' + index + ']';
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      errors.push(label + ' must be an object');
      continue;
    }
    const report = {
      name: entry.name || null,
      path: entry.path || null,
      status: entry.status || null,
      trackedFileCount: 0,
      modifiedFiles: [],
      unmanagedFiles: [],
      requiredFiles: []
    };
    skillReports.push(report);

    if (typeof entry.name !== 'string' || !entry.name.trim()) errors.push(label + '.name must be non-empty');
    else if (names.has(entry.name)) errors.push('duplicate skill name: ' + entry.name);
    else names.add(entry.name);

    let skillPath;
    try {
      skillPath = resolveRepoPath(root, entry.path, label + '.path');
      report.path = skillPath.relative;
    } catch (error) {
      errors.push(error.message);
      continue;
    }
    if (paths.has(skillPath.relative)) errors.push('duplicate skill path: ' + skillPath.relative);
    else paths.add(skillPath.relative);
    if (!canonicalRoots.some(rootPath => skillPath.relative === rootPath || skillPath.relative.startsWith(rootPath + '/'))) {
      errors.push(label + '.path is outside canonicalRoots: ' + skillPath.relative);
    }

    if (!ALLOWED_STATUSES.has(entry.status)) {
      errors.push(label + '.status must be active, deprecated, or experimental');
    }
    if (typeof entry.scope !== 'string' || !entry.scope.trim()) errors.push(label + '.scope must be non-empty');
    if (entry.canonicalName !== undefined && typeof entry.canonicalName !== 'string') {
      errors.push(label + '.canonicalName must be a string when provided');
    }

    const entrypoint = entry.entrypoint || 'SKILL.md';
    let entrypointRelative;
    try {
      const normalizedEntrypoint = normalizeRepoPath(entrypoint, label + '.entrypoint');
      entrypointRelative = skillPath.relative + '/' + normalizedEntrypoint;
      resolveRepoPath(root, entrypointRelative, label + '.entrypoint');
      report.requiredFiles.push(normalizedEntrypoint);
    } catch (error) {
      errors.push(error.message);
      continue;
    }
    const requiredFiles = Array.isArray(entry.requiredFiles) ? entry.requiredFiles : [entrypoint];
    if (!requiredFiles.includes(entrypoint)) errors.push(label + '.requiredFiles must include entrypoint');
    for (const [fileIndex, requiredFile] of requiredFiles.entries()) {
      try {
        const normalizedFile = normalizeRepoPath(requiredFile, label + '.requiredFiles[' + fileIndex + ']');
        const requiredPath = resolveRepoPath(root, skillPath.relative + '/' + normalizedFile, label + '.requiredFiles[' + fileIndex + ']');
        if (!report.requiredFiles.includes(normalizedFile)) report.requiredFiles.push(normalizedFile);
        if (!fs.existsSync(requiredPath.absolute) || !fs.statSync(requiredPath.absolute).isFile()) {
          errors.push('missing required skill file: ' + skillPath.relative + '/' + normalizedFile);
        }
      } catch (error) {
        errors.push(error.message);
      }
    }

    if (!fs.existsSync(skillPath.absolute) || !fs.statSync(skillPath.absolute).isDirectory()) {
      errors.push('missing skill directory: ' + skillPath.relative);
      continue;
    }
    const entrypointAbsolute = path.join(skillPath.absolute, ...entrypoint.replace(/\\/g, '/').split('/'));
    if (!fs.existsSync(entrypointAbsolute) || !fs.statSync(entrypointAbsolute).isFile()) {
      errors.push('missing skill entrypoint: ' + skillPath.relative + '/' + entrypoint);
    } else {
      try {
        const frontmatter = parseSkillFrontmatter(
          fs.readFileSync(entrypointAbsolute, 'utf8'),
          skillPath.relative + '/' + entrypoint
        );
        if (frontmatter.name !== entry.name) {
          errors.push('skill name mismatch: manifest=' + entry.name + ', frontmatter=' + frontmatter.name);
        }
      } catch (error) {
        errors.push(error.message);
      }
    }

    report.trackedFileCount = gitTrackedFiles(gitRoot, skillPath.relative).length;
    if (!report.trackedFileCount) errors.push('skill has no Git-tracked files: ' + skillPath.relative);
    const status = gitStatusEntries(gitRoot, skillPath.relative);
    if (status.error) errors.push(skillPath.relative + ': ' + status.error);
    for (const line of status.entries) {
      const code = line.slice(0, 2);
      const file = statusPath(line);
      if (code === '??' || code === '!!') {
        if (isGeneratedCache(file)) warnings.push('ignored generated skill cache: ' + file);
        else report.unmanagedFiles.push(file);
      } else report.modifiedFiles.push(file);
    }
    if (report.unmanagedFiles.length) {
      errors.push('skill contains untracked or ignored files: ' + report.unmanagedFiles.join(', '));
    }
    if (report.modifiedFiles.length) {
      errors.push('skill has uncommitted tracked changes: ' + report.modifiedFiles.join(', '));
    }
  }

  const discovered = listDirectSkillPaths(root, canonicalRoots, errors);
  for (const discoveredPath of discovered) {
    if (!paths.has(discoveredPath)) errors.push('skill directory is missing from manifest: ' + discoveredPath);
  }
  for (const declaredPath of paths) {
    if (!discovered.includes(declaredPath)) errors.push('manifest skill has no direct SKILL.md: ' + declaredPath);
  }
  for (const report of skillReports) {
    const entry = (manifest.skills || []).find(item => item && item.name === report.name);
    if (entry?.canonicalName && !names.has(entry.canonicalName)) {
      errors.push(report.name + ' canonicalName is not declared: ' + entry.canonicalName);
    }
  }

  let manifestRelative = null;
  try {
    manifestRelative = path.relative(root, manifestPath).split(path.sep).join('/');
    normalizeRepoPath(manifestRelative, 'manifest');
  } catch (error) {
    errors.push(error.message);
  }
  if (manifestRelative) {
    const manifestTracked = gitTrackedFiles(gitRoot, manifestRelative).length > 0;
    if (!manifestTracked) warnings.push('skill manifest is not Git-tracked yet: ' + manifestRelative);
  }

  return {
    status: errors.length ? 'FAIL' : 'PASS',
    root: gitRoot,
    branch,
    commit,
    upstream,
    manifest: manifestRelative || manifestPath,
    skillCount: skillReports.length,
    skills: skillReports,
    errors,
    warnings
  };
}

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error('FAIL: ' + error.message);
    process.exitCode = 2;
    return;
  }
  if (args.help) {
    printHelp();
    return;
  }

  const root = path.resolve(args.root);
  const manifestPath = args.manifest ? path.resolve(root, args.manifest) : DEFAULT_MANIFEST;
  const report = verify(root, manifestPath, args.upstream);
  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log('Skill verification: ' + report.status);
    console.log('Repository: ' + report.root);
    console.log('Branch: ' + (report.branch || 'UNKNOWN'));
    console.log('Commit: ' + (report.commit || 'UNKNOWN'));
    if (report.upstream) {
      console.log('Upstream: ' + report.upstream.ref + ' @ ' + (report.upstream.commit || 'MISSING') +
        ' (ahead=' + report.upstream.ahead + ', behind=' + report.upstream.behind + ')');
    }
    console.log('Manifest: ' + report.manifest);
    console.log('Skills: ' + report.skillCount);
    for (const skill of report.skills) {
      const suffix = skill.modifiedFiles.length ? ' (modified)' : '';
      const hasError = report.errors.some(error => skill.path && error.includes(skill.path));
      console.log('  ' + (hasError ? 'FAIL ' : 'PASS ') + skill.name + ' [' + skill.status + ']' + suffix);
    }
    for (const warning of report.warnings) console.log('WARN: ' + warning);
    for (const error of report.errors) console.log('ERROR: ' + error);
  }
  process.exitCode = report.status === 'PASS' ? 0 : 1;
}

main();
