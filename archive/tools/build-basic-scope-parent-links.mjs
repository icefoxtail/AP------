import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import core from '../archive2-core.js';
import sourceBank from '../archive2-source.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
const sha = text => crypto.createHash('sha256').update(text).digest('hex');
const inputManifest = JSON.parse(read('archive/data/archive2-canonical-input-manifest.json'));
const authorityInputFiles = (inputManifest.files || [])
  .filter(row => !['data/archive2-catalog.json', 'data/basic-scope-parent-links.json'].includes(row.path))
  .map(({ path: inputPath, sha256 }) => ({ path: inputPath, sha256: String(sha256 || '').toLowerCase() }))
  .sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
const authorityInputsSha256 = sha(JSON.stringify({
  resolverVersion: inputManifest.resolverVersion || '',
  files: authorityInputFiles,
}));
const masterPath = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const masterText = read(masterPath);
const parents = core.taxonomyPaths(JSON.parse(masterText));
const dir = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0';
const records = [], refs = [], seen = new Set();
const course = scope => ({ 수학_상: '수학(상)', 수학_하: '수학(하)' })[scope] || scope;
for (const file of fs.readdirSync(path.join(root, dir)).filter(f => f.endsWith('.json')).sort()) {
  const source = `${dir}/${file}`, text = read(source), crosswalk = JSON.parse(text);
  if (crosswalk.status !== 'ACTIVE_REFERENCE') throw new Error(`Inactive basic scope reference: ${source}`);
  refs.push({ source, sha256: sha(text) });
  const grade = file.startsWith('middle') ? `중${file.match(/middle([123])/)[1]}` : file === 'high1.json' ? '고1' : '고2';
  for (const row of crosswalk.records) {
    if (!row.standardUnitKey) continue;
    const canonical = parents.find(p => p.curriculumKey === row.curriculum &&
      core.normalizeCourseIdentity(p.courseKey) === core.normalizeCourseIdentity(course(row.scope)) &&
      p.L1 === row.rpmPath.majorUnit && p.L2 === row.rpmPath.midUnit);
    if (!canonical) throw new Error(`Unregistered RPM parent: ${source} ${row.id}`);
    const record = { grade, curriculumKey: row.curriculum, courseKey: canonical.courseKey,
      standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey || '',
      problemTypeKey: row.problemTypeKey || '', templateKey: row.templateKey || '',
      L1: canonical.L1, L2: canonical.L2 };
    const key = JSON.stringify(record);
    if (!seen.has(key)) { seen.add(key); records.push(record); }
  }
}
const overridesPath = 'archive/data/basic-scope-source-links.json';
const overridesText = read(overridesPath), overrides = JSON.parse(overridesText);
if (overrides.status !== 'REVIEWED_SCOPE_LINKS' || !Array.isArray(overrides.records)) throw new Error('Invalid reviewed source links');
refs.push({ source: overridesPath, sha256: sha(overridesText) });
const sourceBanks = new Map();
for (const record of overrides.records) {
  if (!parents.some(p => p.curriculumKey === record.curriculumKey &&
    core.normalizeCourseIdentity(p.courseKey) === core.normalizeCourseIdentity(record.courseKey) && p.L1 === record.L1 && p.L2 === record.L2))
    throw new Error(`Unregistered source parent: ${record.sourceFile}#${record.sourceOrdinal}`);
  if (!/^[a-f0-9]{64}$/.test(record.sourceFingerprint)) throw new Error('Source link requires a SHA-256 fingerprint');
  if (!sourceBanks.has(record.sourceFile)) sourceBanks.set(record.sourceFile, sourceBank.evaluate(read(`archive/exams/${record.sourceFile}`), record.sourceFile));
  const question = sourceBanks.get(record.sourceFile)[record.sourceOrdinal - 1];
  const bodyFingerprint = sha(JSON.stringify({ content: question.content ?? null, choices: Array.isArray(question.choices) ? question.choices : null, image: question.image ?? null }));
  // Solver-only revisions do not invalidate a reviewed L1/L2 topic. A changed
  // statement, choice set or visual reference requires a new parent review.
  if (bodyFingerprint !== record.sourceBodyFingerprint) continue;
  records.push({
    ...record,
    assignmentFingerprint: bodyFingerprint,
    sourceFingerprint: await sourceBank.fingerprint(question),
  });
}
const groupsPath = 'archive/data/basic-scope-parent-groups.json', groupsText = read(groupsPath), groupData = JSON.parse(groupsText);
if (groupData.status !== 'REVIEWED_DISPLAY_GROUPS' || !Array.isArray(groupData.groups)) throw new Error('Invalid basic parent display groups');
refs.push({ source: groupsPath, sha256: sha(groupsText) });
for (const group of groupData.groups) for (const member of group.members) {
  if (!parents.some(p => p.curriculumKey === member.curriculumKey && p.courseKey === member.courseKey && p.L1 === member.L1 && p.L2 === member.L2))
    throw new Error(`Unregistered grouped parent: ${JSON.stringify(member)}`);
}
// Compile existing reviewed assignments into parent-only source links once.
// The published UI links never require L3, L4, template or difficulty fields.
const semanticLinks = records.slice();
const existingParentLinks = JSON.parse(read('archive/data/basic-scope-parent-links.json'));
const canonical = {
  ...core.Canonical,
  async loadInputBundle(fetcher, baseUrl, expectedVersion) {
    const bundle = await core.Canonical.loadInputBundle(fetcher, baseUrl, expectedVersion);
    return {
      ...bundle,
      resources: {
        ...bundle.resources,
        'data/basic-scope-parent-links.json': {
          ...bundle.resources['data/basic-scope-parent-links.json'],
          records: semanticLinks,
        },
      },
    };
  },
};
const window = { Archive2Core: core, Archive2Canonical: canonical };
vm.runInNewContext(read('archive/meta-foundation-runtime.js'), {
  window, document: { baseURI: 'https://basic-scope.test/archive/' }, URL, console,
  fetch: async url => {
    const relative = decodeURIComponent(new URL(url).pathname).replace(/^\/+/, '');
    const absolute = path.resolve(root, relative);
    const fromRoot = path.relative(root, absolute);
    if (fromRoot.startsWith('..') || path.isAbsolute(fromRoot) || !fs.existsSync(absolute))
      return { ok: false, status: 404, text: async () => '', json: async () => ({}) };
    const body = fs.readFileSync(absolute, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
    return { ok: true, text: async () => body, json: async () => JSON.parse(body) };
  },
});
const catalogText = read('archive/data/archive2-catalog.json');
const catalog = await window.applyArchiveMetaFoundationCatalog(core.decodeCatalog(JSON.parse(catalogText)));
const uniqueParent = candidates => {
  const mapped = new Map(candidates.map(link => [[link.courseKey, link.L1, link.L2].join('|'), link]));
  return mapped.size === 1 ? [...mapped.values()][0] : null;
};
const sourceParents = [];
for (const item of catalog.records) {
  let parent = core.basicScopeParent(item, semanticLinks);
  const courseKey = core.normalizeCourseIdentity(item.courseKey);
  const compatible = semanticLinks.filter(link => link.grade === item.effectiveBrowseGrade &&
    (!item.curriculumKey || link.curriculumKey === item.curriculumKey) &&
    (core.normalizeCourseIdentity(link.courseKey) === courseKey || /^중[123]수학$/.test(courseKey)));
  const exact = compatible.some(link => link.L1 === item.L1 && link.L2 === item.L2);
  const reviewedSource = compatible.some(link => link.sourceFile === item.sourceFile && link.sourceOrdinal === item.sourceOrdinal);
  const confirmed = item.foundationTaxonomyStatus === 'CONFIRMED' || item.metaFoundationL3Status === 'FINAL' || item.tagStatus === 'approved_semantic_review';
  if (!exact && !reviewedSource && confirmed && item.problemTypeKey) {
    const methods = compatible.filter(link => link.problemTypeKey === item.problemTypeKey);
    const templates = item.templateKey ? methods.filter(link => link.templateKey === item.templateKey) : [];
    parent = uniqueParent(templates.length ? templates : methods) || parent;
  }
  if (parent && item.questionUid && (parent.L1 !== item.L1 || parent.L2 !== item.L2 ||
    (parent.courseKey && core.normalizeCourseIdentity(parent.courseKey) !== courseKey))) {
    sourceParents.push({ grade: item.effectiveBrowseGrade, curriculumKey: item.curriculumKey || '',
      courseKey: parent.courseKey || item.courseKey, questionUid: item.questionUid,
        sourceFingerprint: item.sourceFingerprint, assignmentFingerprint: item.assignmentFingerprint,
        metadataParent: [item.courseKey || '', item.L1 || '', item.L2 || ''],
      L1: parent.L1, L2: parent.L2 });
  }
}
const currentByUid = new Map(catalog.records.filter(item => item.questionUid).map(item => [item.questionUid, item]));
const sourceGradeByFile = catalog.canonicalAuthority?.examGradeByFile || {};
const identityByUid = catalog.canonicalAuthority?.identityByUid || {};
const gradeCourses = catalog.canonicalAuthority?.gradeCourses || [];
const sourceParentByUid = new Map(sourceParents.map(link => [link.questionUid, link]));
for (const link of existingParentLinks.sourceParents || []) {
  const item = currentByUid.get(link.questionUid);
  const identity = identityByUid[link.questionUid];
  if (!item || !identity || identity.status !== 'VERIFIED') continue;
  const sourceFile = core.normalizeFile(item.sourceFile);
  const gradeEvidence = core.Canonical.resolveSourceGrade({
    registeredGrade: sourceGradeByFile[sourceFile],
    sourceFile,
    identitySourceFile: identity.sourceArchiveFile,
  });
  const canonicalParent = parents.some(parent => parent.curriculumKey === link.curriculumKey &&
    core.normalizeCourseIdentity(parent.courseKey) === core.normalizeCourseIdentity(link.courseKey) &&
    parent.L1 === link.L1 && parent.L2 === link.L2);
  const currentGradeCourse = gradeCourses.some(row => row.grade === gradeEvidence.grade &&
    row.curriculumKey === item.curriculumKey &&
    core.normalizeCourseIdentity(row.courseKey) === core.normalizeCourseIdentity(item.courseKey));
  const assignment = core.Canonical.validateBasicAssignment(item, catalog.canonicalAuthority);
  const assignmentEvidence = (catalog.canonicalAuthority.assignmentsByUid?.[link.questionUid] || [])[0];
  const stillValid = gradeEvidence.status === 'VALID' &&
    gradeEvidence.grade === item.sourceGrade &&
    link.grade === item.sourceGrade &&
    (!link.assignmentFingerprint || link.assignmentFingerprint === item.assignmentFingerprint) &&
    link.curriculumKey === item.curriculumKey &&
    core.normalizeCourseIdentity(link.courseKey) === core.normalizeCourseIdentity(item.courseKey) &&
    link.L1 === item.L1 && link.L2 === item.L2 &&
    Number(identity.sourceOrdinal) === Number(item.sourceOrdinal) &&
    core.normalizeFile(identity.sourceArchiveFile) === sourceFile &&
    canonicalParent && currentGradeCourse &&
    assignment.ok;
  if (!stillValid) continue;
  const refreshedLink = {
    ...link,
    sourceFingerprint: assignmentEvidence?.reviewEvidence?.reviewedSourceFingerprint || link.sourceFingerprint,
    assignmentFingerprint: item.assignmentFingerprint,
  };
  const existing = sourceParentByUid.get(link.questionUid);
  if (existing && JSON.stringify(existing) !== JSON.stringify(refreshedLink))
    throw new Error(`Conflicting canonical source parents: ${link.questionUid}`);
  sourceParentByUid.set(link.questionUid, refreshedLink);
}
// Reviewed source links are recorded by source path and ordinal. Materialize a
// UID-level assignment only when that exact source identity, assignment-body
// fingerprint, approved metadata evidence, namespace and canonical parent all
// join. The full answer/solution fingerprint remains a separate release gate.
const itemsBySource = new Map(catalog.records.map(item =>
  [`${core.normalizeFile(item.sourceFile)}#${Number(item.sourceOrdinal)}`, item]));
const reviewedLinksBySource = new Map();
for (const link of records.filter(row => row.sourceFile && row.sourceOrdinal && row.sourceBodyFingerprint)) {
  const key = `${core.normalizeFile(link.sourceFile)}#${Number(link.sourceOrdinal)}`;
  const prior = reviewedLinksBySource.get(key);
  if (prior && (prior.L1 !== link.L1 || prior.L2 !== link.L2 ||
      prior.curriculumKey !== link.curriculumKey || prior.courseKey !== link.courseKey))
    throw new Error(`Conflicting reviewed source links: ${key}`);
  reviewedLinksBySource.set(key, link);
}
for (const [sourceKey, link] of reviewedLinksBySource) {
  const item = itemsBySource.get(sourceKey);
  if (!item?.questionUid || item.identityStatus !== 'VERIFIED') continue;
  const identity = identityByUid[item.questionUid];
  const sourceFile = core.normalizeFile(item.sourceFile);
  const sourceOrdinal = Number(item.sourceOrdinal);
  const gradeEvidence = core.Canonical.resolveSourceGrade({
    registeredGrade: sourceGradeByFile[sourceFile],
    sourceFile,
    identitySourceFile: identity?.sourceArchiveFile,
  });
  const assignmentEvidence = item.metadataAssignmentEvidence || {};
  const existingAssignments = catalog.canonicalAuthority?.assignmentsByUid?.[item.questionUid] || [];
  const assignmentFingerprint = item.assignmentFingerprint;
  const bodyFingerprintMatches = Boolean(assignmentFingerprint) &&
    assignmentFingerprint === link.sourceBodyFingerprint &&
    assignmentFingerprint === link.assignmentFingerprint &&
    assignmentFingerprint === assignmentEvidence.assignmentFingerprint;
  const identityMatches = identity?.status === 'VERIFIED' &&
    core.normalizeFile(identity.sourceArchiveFile) === sourceFile &&
    Number(identity.sourceOrdinal) === sourceOrdinal &&
    assignmentEvidence.questionUid === item.questionUid &&
    core.normalizeFile(assignmentEvidence.sourceFile) === sourceFile &&
    Number(assignmentEvidence.sourceOrdinal) === sourceOrdinal;
  const metadataStatus = String(assignmentEvidence.metadataStatus || '');
  const metadataReviewed = (metadataStatus.startsWith('approved_') || metadataStatus === 'MOTHER_FINAL') &&
    /^approved(?:_|$)/i.test(String(assignmentEvidence.fieldStatus?.standardUnit || '')) &&
    ( /^approved(?:_|$)/i.test(String(assignmentEvidence.fieldStatus?.subUnit || '')) ||
      (metadataStatus === 'approved_r2e_final' && assignmentEvidence.fieldStatus?.subUnit === 'r2e_curriculum_binding') ) &&
    Array.isArray(assignmentEvidence.evidenceRefs) && assignmentEvidence.evidenceRefs.some(ref => String(ref || '').trim()) &&
    /^[a-f0-9]{64}$/i.test(String(assignmentEvidence.evidenceDigest || ''));
  const namespaceMatches = gradeEvidence.status === 'VALID' &&
    gradeEvidence.grade === link.grade && gradeEvidence.grade === item.sourceGrade &&
    gradeCourses.some(row => row.grade === gradeEvidence.grade &&
      row.curriculumKey === link.curriculumKey && row.courseKey === link.courseKey);
  const canonicalParent = parents.some(parent => parent.curriculumKey === link.curriculumKey &&
    core.normalizeCourseIdentity(parent.courseKey) === core.normalizeCourseIdentity(link.courseKey) &&
    parent.L1 === link.L1 && parent.L2 === link.L2);
  if (!bodyFingerprintMatches || !identityMatches || !metadataReviewed || !namespaceMatches ||
      !canonicalParent || existingAssignments.length !== 0 || !String(link.reason || '').trim()) continue;

  const metadataTaxonomy = item.unverifiedTaxonomy || {};
  const joinedLink = {
    grade: gradeEvidence.grade,
    curriculumKey: link.curriculumKey,
    courseKey: link.courseKey,
    questionUid: item.questionUid,
    sourceFile,
    sourceOrdinal,
    sourceFingerprint: assignmentEvidence.sourceFingerprint || link.sourceFingerprint,
    assignmentFingerprint,
    metadataParent: [metadataTaxonomy.courseKey || '', metadataTaxonomy.L1 || '', metadataTaxonomy.L2 || ''],
    L1: link.L1,
    L2: link.L2,
  };
  const existing = sourceParentByUid.get(item.questionUid);
  if (existing && JSON.stringify(existing) !== JSON.stringify(joinedLink))
    throw new Error(`Conflicting canonical source parents: ${item.questionUid}`);
  sourceParentByUid.set(item.questionUid, joinedLink);
}
sourceParents.splice(0, sourceParents.length, ...sourceParentByUid.values());
const published = [], publishedKeys = new Set();
for (const row of records) {
  const { problemTypeKey, templateKey, ...parent } = row;
  const key = JSON.stringify(parent);
  if (!publishedKeys.has(key)) { publishedKeys.add(key); published.push(parent); }
}
const data = { schemaVersion: 'archive2-basic-scope-parent-links-v1', status: 'DERIVED_READ_ONLY',
  authority: { source: masterPath, sha256: sha(masterText) }, references: refs,
  policy: 'Basic display and selection use only L1/L2 parent links, source identity and fingerprint. L3/L4 and difficulty are optional capabilities and cannot gate basic linkage.',
  generatedAgainst: { authorityInputsSha256 }, records: published, sourceParents, groups: groupData.groups };
const output = JSON.stringify(data, null, 2) + '\n';
const target = 'archive/data/basic-scope-parent-links.json';
if (process.argv.includes('--check')) {
  if (read(target) !== output) throw new Error('Basic scope parent links are stale; rebuild them from the current crosswalks.');
} else fs.writeFileSync(path.join(root, target), output, 'utf8');
console.log(`${published.length} parent references and ${sourceParents.length} source parent links from ${refs.length} references`);
