const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const core = require('../../archive/archive2-core.js');
const archiveDir = path.resolve(__dirname, '../../archive');
const workspaceSource = fs.readFileSync(path.join(archiveDir, 'archive2-workspace.js'), 'utf8');

function readProjection() {
  const manifest = JSON.parse(fs.readFileSync(path.join(archiveDir, 'data/archive2-canonical-input-manifest.json'), 'utf8'));
  const resources = {}, files = {};
  for (const row of manifest.files) {
    const bytes = fs.readFileSync(path.resolve(archiveDir, row.path));
    const actualSha = crypto.createHash('sha256').update(bytes).digest('hex');
    if (actualSha !== row.sha256) throw new Error('Archive2 test input digest mismatch: ' + row.path);
    resources[row.path] = JSON.parse(bytes.toString('utf8'));
    files[row.path] = { sha256: row.sha256 };
  }
  const sorted = manifest.files.map(row => ({ path: row.path, sha256: row.sha256.toLowerCase() }))
    .sort((a, b) => a.path.localeCompare(b.path));
  const version = 'archive2-canonical-v1:' + crypto.createHash('sha256')
    .update(JSON.stringify({ resolverVersion: manifest.resolverVersion, files: sorted })).digest('hex');
  if (version !== manifest.projectionVersion) throw new Error('Archive2 test manifest version mismatch');
  return core.Canonical.resolveCatalog({ versionBundle: { manifest, projectionVersion: version, files, resources } });
}
const catalog = readProjection();

function withTestAssignments(data, records = data.records || []) {
  const authority = {
    ...data.canonicalAuthority,
    examGradeByFile: { ...data.canonicalAuthority.examGradeByFile },
    identityByUid: { ...data.canonicalAuthority.identityByUid },
    gradeCourses: [...data.canonicalAuthority.gradeCourses],
    canonicalParents: [...data.canonicalAuthority.canonicalParents],
    assignmentsByUid: { ...data.canonicalAuthority.assignmentsByUid },
  };
  for (const row of records.filter((candidate) => candidate.__testApprovedAssignment === true)) {
    const gradeCourse = { grade: row.sourceGrade, curriculumKey: row.curriculumKey, courseKey: row.courseKey };
    if (!authority.gradeCourses.some((candidate) => JSON.stringify(candidate) === JSON.stringify(gradeCourse)))
      authority.gradeCourses.push(gradeCourse);
    authority.examGradeByFile[row.sourceFile] = row.sourceGrade;
    authority.identityByUid[row.questionUid] = {
      questionUid: row.questionUid,
      sourceArchiveFile: row.sourceFile,
      sourceOrdinal: row.sourceOrdinal,
      status: "VERIFIED",
    };
    authority.assignmentsByUid[row.questionUid] = [{
      store: "test_approved_assignment",
      questionUid: row.questionUid,
      sourceFile: row.sourceFile,
      sourceOrdinal: row.sourceOrdinal,
      sourceFingerprint: row.assignmentFingerprint,
      assignmentFingerprint: row.assignmentFingerprint,
      grade: row.sourceGrade,
      curriculumKey: row.curriculumKey,
      courseKey: row.courseKey,
      L1: row.L1,
      L2: row.L2,
      approvalStatus: "APPROVED",
      taxonomyVersion: authority.taxonomyVersion,
      reviewEvidence: {
        status: "PASS",
        reference: "tests/helpers/archive2-scope-harness.cjs",
        sha256: "e".repeat(64),
      },
    }];
  }
  return { ...data, canonicalAuthority: authority };
}

function workspace(filters = { grade: '중1' }, data = catalog) {
  data = withTestAssignments(data);
  const listeners = {}, controls = {};
  const window = { Archive2Core: core, Archive2Canonical: core.Canonical };
  vm.runInNewContext(workspaceSource.slice(0, workspaceSource.indexOf('  document.addEventListener("submit"')) +
    '\nrender = () => {}; scheduleSave = () => {}; window.scopeTest = { state, scopeOptions, renderScopes, selectedScopePaths, selectedScopeQuestionUids, taxonomyRowsForFilters, planRows, request, pool };\n})();', {
    window, crypto,
    document: { addEventListener: (name, fn) => listeners[name] = fn, getElementById: id => controls[id] },
  });
  Object.assign(window.scopeTest.state, { catalog: data, filters });
  return { ...window.scopeTest, controls, click: dataset => listeners.click({ target: { closest: () => ({ dataset }) } }) };
}

async function productionCatalog() {
  const window = { Archive2Core: core, Archive2Canonical: core.Canonical };
  vm.runInNewContext(fs.readFileSync(path.join(archiveDir, 'meta-foundation-runtime.js'), 'utf8'), {
    window, document: { baseURI: 'https://scope.test/AP------/archive/workspace.html' }, URL, console,
    fetch: async url => {
      const pathname = decodeURIComponent(new URL(String(url)).pathname);
      let file;
      if (pathname.startsWith('/AP------/archive/'))
        file = path.join(archiveDir, pathname.slice('/AP------/archive/'.length));
      else if (pathname.startsWith('/AP------/docs/'))
        file = path.resolve(archiveDir, '..', 'docs', pathname.slice('/AP------/docs/'.length));
      else return new Response('not found', { status: 404 });
      return fs.existsSync(file) ? new Response(fs.readFileSync(file)) : new Response('not found', { status: 404 });
    },
  });
  const data = await window.applyArchiveMetaFoundationCatalog();
  return { data, runtime: window.ARCHIVE_META_FOUNDATION_RUNTIME };
}

function filterCases() {
  const cases = [];
  for (const curriculumKey of ['', '2015', '2022']) {
    for (const grade of ['중1', '중2', '중3'])
      for (const courseKey of ['', `M${grade[1]}-1`, `M${grade[1]}-2`])
        cases.push({ grade, curriculumKey, courseKey });
    for (const semanticSubject of ['', ...core.subjectProjectionOptions('고1').map(s => s.value)])
      cases.push({ grade: '고1', curriculumKey, semanticSubject });
    for (const grade of ['고2', '고3'])
      for (const { value: semanticSubject } of core.highSemanticSubjectOptions())
        cases.push({ grade, curriculumKey, semanticSubject });
  }
  return cases;
}

module.exports = { core, catalog, workspace, productionCatalog, filterCases, withTestAssignments };
