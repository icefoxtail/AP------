import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readScope } from './archive-ci-scope.mjs';

export const playgroundTests = [
  'catalog', 'hub-no-legacy', 'alg-sequence-plus', 'polyhedra-names',
  'cube-section', 'polyhedra-dual', 'video', 'label-sweep',
].map(name => `apmath/playground/next/tools/${name}.test.mjs`);

// The command registry (including exclusions and special Worker test arguments)
// comes from run-tests.js. These are consumer groups, not duplicate commands.
// Include the shared UID / saved-paper Worker fixtures because registered Meta
// flows through APMS assignments and clinic payloads as well as Archive search.
const metadataConsumers = [
  /^tests\/(?:meta-foundation-|item-4slot-|generated-(?:main-source-consumer-sync|meta-|source-svg-namespace))/,
  /^tests\/archive2-(?:canonical-|core\.|compose-|finder-|generated-|key-resolver\.|meta-|original-source-|quick-pools\.|registered-rpm-path\.|textbook-manifest\.|uid-route\.|unified-units\.|unit-count-links\.|worker-|saved-paper-|assignment-)/,
  /^tests\/archive-(?:blueprint-metadata-|canonical-identity-|mixer-selector-|question-identity-|question-metadata-|subject-synonym-|unit-past-exams-|saved-papers-|output-metadata-loader\.)/,
  /^tests\/(?:problem-bank-meta|apms-result-clinic-uid-bridge\.|apmath-omr-result-identity\.|apms-clinic-uid-refresh\.)/,
];
const registrationContracts = [
  /^tests\/archive-(?:registration-|register-|single-writer-|main-merge-meta\.|pr-registration-|pages-|package-only\.|reviewed-apply-bridge\.|meta-backlog-)/,
  /^tests\/(?:git-push-derived-with-retry\.|ci-signal-hygiene\.|run-tests-output-guard\.|apms-worker-deploy\.)/,
];
const outputConsumers = [
  // Common output modules serve originals, Generated, saved papers and APMS
  // print/preview handoffs. Keep their existing registered Archive regressions.
  /^tests\/archive(?:2)?-/,
  /^tests\/(?:render-authority-|mixed-render-authority-|clinic-render-authority-|common-render-|print-|equal-slot-)/,
  /^tests\/assessment-(?:archive-print-flow\.|mvp-archive-style\.|check-solution-link\.|result-items-storage\.|submit-qr-student-page-route\.|assignment-metadata-flow\.)/,
  /^tests\/apmath-(?:exam-pdf-artifacts\.|exam-assignment-identity\.|wrong-print-qr-solution-regression\.|clinic-print-assignment-visibility\.)/,
  /^tests\/student-portal-(?:mixed-review-payload\.|omr-review-ui\.|output-envelope\.)/,
];
const filesInCommand = args => args.filter(arg => /\.(?:js|mjs|cjs)$/.test(arg));
const packageCommand = ['archive/tools/build-archive2-catalog.mjs', '--package-only'];
const isPackageCommand = args => JSON.stringify(args) === JSON.stringify(packageCommand);
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

export function packageShardsReady(root) {
  // This proves only that temporary files already equal this index's declared
  // bytes. Catalog/UID/Consumer correctness is still checked by the real tests.
  // P5's local proof can additionally reuse the entire prepared registration.
  const indexPath = 'data/archive2-source-verification-index.json';
  const indexBytes = fs.readFileSync(path.join(root, 'archive', indexPath), 'utf8').replace(/\r\n/g, '\n');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/archive2-canonical-input-manifest.json'), 'utf8'));
  const indexEntries = manifest.files?.filter(entry => entry.path === indexPath);
  if (indexEntries?.length !== 1 || indexEntries[0].sha256 !== sha256(indexBytes)) throw new Error('package source index is not bound to the current manifest');
  const index = JSON.parse(indexBytes), mixed = index.mixedLookup;
  const prefix = 'data/archive2-source-verification/mixed-v1/';
  if (index.schemaVersion !== 'archive2-source-verification-index-v1' ||
      !['archive2-mixed-source-verification-index-v1', 'archive2-mixed-source-verification-index-v2'].includes(mixed?.schemaVersion) ||
      mixed.resolverVersion !== index.resolverVersion || index.resolverVersion !== manifest.resolverVersion ||
      mixed.baseProjectionVersion !== index.baseProjectionVersion ||
      index.generatedFromCatalogIndexVersion !== manifest.generatedFromCatalogIndexVersion ||
      mixed.context?.path !== `${prefix}context.json` || !Array.isArray(index.files) || !index.files.length ||
      !Array.isArray(mixed.files) || mixed.files.length !== index.files.length ||
      !Array.isArray(mixed.uidBuckets) || mixed.uidBuckets.length !== 16) throw new Error('unsupported or incomplete mixed package index');
  const rows = [{ ...mixed.context }], sourceFiles = new Set(), buckets = new Set();
  for (const [i, row] of mixed.files.entries()) {
    const sourceFile = index.files[i]?.sourceFile;
    if (row.sourceIndex !== i || typeof sourceFile !== 'string' || !sourceFile || sourceFiles.has(sourceFile)) {
      throw new Error('invalid mixed package source row');
    }
    sourceFiles.add(sourceFile);
    rows.push({ ...row, path: `${prefix}sources/${sha256(sourceFile)}.json` });
  }
  for (const row of mixed.uidBuckets) {
    if (typeof row.prefix !== 'string' || !/^[a-f0-9]$/.test(row.prefix) || buckets.has(row.prefix) || row.path !== `${prefix}uid-buckets/${row.prefix}.json`) {
      throw new Error('invalid mixed package UID bucket');
    }
    buckets.add(row.prefix); rows.push(row);
  }
  for (const row of rows) {
    if (!/^[a-f0-9]{64}$/.test(row.sha256 || '') || !Number.isSafeInteger(row.byteLength) || row.byteLength < 1) {
      throw new Error('invalid mixed package byte identity');
    }
    let file = root;
    for (const part of ['archive', ...row.path.split('/')]) {
      file = path.join(file, part);
      let stat;
      try { stat = fs.lstatSync(file); }
      catch (error) {
        if (error.code === 'ENOENT') return { ready: false, reason: 'missing mixed package file', file: `archive/${row.path}` };
        throw error;
      }
      if (stat.isSymbolicLink()) throw new Error('mixed package symlink is forbidden');
    }
    const bytes = fs.readFileSync(file);
    if (bytes.length !== row.byteLength || sha256(bytes) !== row.sha256) {
      return { ready: false, reason: 'mixed package bytes differ from the current index', file: `archive/${row.path}` };
    }
  }
  return { ready: true, fileCount: rows.length, indexSha256: sha256(indexBytes) };
}

export function selectTechnicalCommands(scope, availableCommands) {
  if (!Array.isArray(availableCommands) || !availableCommands.length) throw new Error('technical scope requires the existing test command registry');
  const groups = scope.groups;
  if (!Array.isArray(groups) || !groups.length || groups.some(group => !['metadata', 'output', 'registration'].includes(group))) {
    throw new Error('unknown technical test group');
  }
  const patterns = [...metadataConsumers];
  if (groups.includes('output')) patterns.push(...outputConsumers);
  if (groups.includes('registration')) patterns.push(...registrationContracts);
  const selected = availableCommands.filter(command => filesInCommand(command.args).some(file => patterns.some(re => re.test(file))));
  if (!selected.length) throw new Error('technical scope selected no registered tests');
  return selected;
}

export function commandsForScope(scope, availableCommands) {
  if (scope.mode === 'full') return null;
  if (scope.mode === 'archive-content') return [['archive/tools/verify-archive-content-scope.mjs', '--scope']];
  if (['archive-metadata', 'archive-output', 'archive-registration', 'archive-technical'].includes(scope.mode)) {
    const selected = selectTechnicalCommands(scope, availableCommands);
    // Run changed source syntax, including a changed producer/validator itself.
    // JSON is parsed before execution below; shell/producer behavior is covered
    // by the selected native orchestration fixtures and workflow syntax checks.
    const syntax = (scope.changedFiles || []).filter(file => /\.(?:js|mjs|cjs)$/.test(file)).map(file => ['--check', file]);
    // Fresh checkouts omit ignored mixed-verification shards. Reconstruct only
    // those package files from the current catalog; do not repeat its shared
    // registration build or rewrite the catalog after the CI preparation step.
    return [...syntax, packageCommand,
      ...selected.map(command => command.args)];
  }
  if (scope.mode !== 'playground') throw new Error('unknown test scope');
  const tests = new Set([...playgroundTests,
    ...(scope.changedFiles || []).filter(file => /^apmath\/playground\/.*\.test\.(?:mjs|js|cjs)$/.test(file)),
  ]);
  return [
    ['tests/student-portal-geometry-lab-entry.test.js'],
    ['tests/apms-drawer-nav.test.js'],
    ...[...tests].sort().map(file => ['--test', file]),
  ];
}

export function runScopedTests({ root, scopeFile, availableCommands, run = spawnSync }) {
  const scope = readScope(scopeFile, root);
  let commands = commandsForScope(scope, availableCommands);
  console.log(`CI scope: ${scope.mode}; ${scope.reason}. Excluded suites are NOT_APPLICABLE, not verified PASS.`);
  if (commands === null) return false;
  // Node's --test can silently ignore a missing path when other tests exist.
  // A mapping typo or removed selected test must fail before reporting a scope.
  for (const args of commands) for (const file of filesInCommand(args)) {
    if (!fs.existsSync(path.resolve(root, file))) throw new Error(`selected check is missing: ${file}`);
  }
  for (const file of scope.groups?.length ? scope.changedFiles || [] : []) {
    if (/\.json$/.test(file)) JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  }
  if (commands.some(isPackageCommand)) {
    const packages = packageShardsReady(root);
    if (packages.ready) {
      commands = commands.filter(args => !isPackageCommand(args));
      console.log(`Package generation NO_OP: ${packages.fileCount} existing files match the manifest-bound index SHA and exact bytes.`);
    }
  }
  const failures = [];
  for (const original of commands) {
    const args = original.at(-1) === '--scope' ? [...original, path.resolve(scopeFile)] : original;
    const registered = availableCommands?.find(command => JSON.stringify(command.args) === JSON.stringify(original));
    const timeout = registered?.timeout || (scope.groups?.length ? 60000 : 180000);
    const result = run(process.execPath, args, { cwd: root, stdio: 'inherit', timeout });
    if (result.error) console.error(result.error.message);
    if (result.error || result.status !== 0) failures.push(original[0] === '--test' ? original[1] : original[0]);
    if (isPackageCommand(original)) {
      if (result.error || result.status !== 0) throw new Error('Scoped package preparation failed');
      if (!packageShardsReady(root).ready) throw new Error('Scoped package preparation did not produce the indexed bytes');
    }
  }
  console.log(`Selected scope ${scope.mode}: ${commands.length - failures.length} passed / ${failures.length} failed (${commands.length} executed commands).`);
  if (failures.length) throw new Error('Scoped checks failed: ' + failures.join(', '));
  return true;
}
