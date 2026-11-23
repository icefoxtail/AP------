// Browser copy of the approved question metadata sidecar: the same records, with only the fields the screens read.
//
// archive/data/question_metadata.json is 90 MB (16.5 MB compressed) and about 55% of it is review evidence
// (typeApproval, fieldStatus, approvalEvidence, ...). The teacher screens that load it through question-meta.js
// (단원별 기출, the original exam window when it registers a class assignment, the mixed output window, mixer) only
// read the fields below. This projection keeps those fields byte for byte (same values, same record order) and drops
// the rest, so the unit page downloads about 4 MB instead of 16.5 MB and parses 28 MB instead of 90 MB.
//
// Nothing is stored in git: the file exists only in the staged Pages site and is rebuilt on every release, like
// archive/data/exam-list-v1.json (tools/lib/build-exam-list.mjs). A local checkout has no such file and question-meta.js
// then reads the full sidecar as before. `node tools/lib/build-question-metadata-browser.mjs --write` writes a git-ignored
// local copy for trying the light load with a static server.
//
// BROWSER_RECORD_FIELDS is the union of every record field a browser script reads. tests/question-metadata-browser.test.js
// reads the scripts and fails when one of them reads a record field that is not listed here.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const QUESTION_METADATA_BROWSER_PATH = 'archive/data/question-metadata-browser-v1.json';
export const QUESTION_METADATA_BROWSER_INPUTS = ['archive/data/question_metadata.json'];
export const QUESTION_METADATA_BROWSER_SCHEMA = 'archive2-question-metadata-browser-v1';

export const BROWSER_RECORD_FIELDS = Object.freeze([
  // identity (question-meta.js lookup by uid and by file#ordinal; the unit page joins on file#ordinal / file#id:<no>)
  'questionUid', 'question_uid', 'sourceArchiveFile', 'sourceOrdinal', 'sourceQuestionNo',
  // question-meta.js mergeArchiveQuestionMetadata copies exactly these onto a question
  'curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'L4', 'secondaryConceptKeys', 'curriculumApplicability', 'defaultSelectable',
  'standardCourse', 'standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit', 'conceptClusterKey', 'problemTypeKey',
  'templateKey', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility',
  'tagConfidence', 'tagStatus', 'reviewStatus', 'metadataStatus', 'metadataRevision',
  // unit-past-exams.js joinApprovedMetadata (older snake_case spellings) and core.validateMetaFoundationSelection
  'standard_unit_key', 'sub_unit_key', 'sub_unit', 'problem_type_key', 'template_key', 'metaFoundationStatus', 'metaFoundationPackId',
]);

// Pure function of the sidecar's text, so the release identity check can recompute it from the registered shards' assembly.
export function projectQuestionMetadata(text) {
  const doc = JSON.parse(text);
  if (!Array.isArray(doc.records) || !doc.records.length) throw new Error('question metadata has no records');
  const keep = new Set(BROWSER_RECORD_FIELDS);
  const records = doc.records.map((record) => {
    const slim = {};
    for (const key of Object.keys(record)) if (keep.has(key)) slim[key] = record[key];
    return slim;
  });
  // Every other top-level key (schemaVersion, metadataRevision, digest of the full sidecar, ...) stays as it is; one marker says this is the browser copy.
  const out = { browserProjection: QUESTION_METADATA_BROWSER_SCHEMA };
  for (const key of Object.keys(doc)) out[key] = key === 'records' ? records : doc[key];
  return Buffer.from(`${JSON.stringify(out)}\n`, 'utf8');
}

export function buildQuestionMetadataBrowser(root) {
  for (const input of QUESTION_METADATA_BROWSER_INPUTS) {
    if (!fs.statSync(path.join(root, input), { throwIfNoEntry: false })?.isFile())
      throw new Error(`question-metadata browser copy input is missing: ${input} (assemble it first: node archive/tools/meta-foundation/question-metadata-format.mjs assemble)`);
  }
  const content = projectQuestionMetadata(fs.readFileSync(path.join(root, QUESTION_METADATA_BROWSER_INPUTS[0]), 'utf8'));
  return {
    path: QUESTION_METADATA_BROWSER_PATH,
    content,
    bytes: content.length,
    sourceBytes: 0,
    reasons: ['the approved question metadata sidecar without review evidence (browser copy), derived from archive/data/question_metadata.json'],
    questionMetadataBrowserInputs: [...QUESTION_METADATA_BROWSER_INPUTS],
  };
}

export const sha256Hex = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url) && process.argv.includes('--write')) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const built = buildQuestionMetadataBrowser(root);
  fs.writeFileSync(path.join(root, built.path), built.content);
  console.log(`question metadata browser copy: ${built.bytes} bytes -> ${built.path} (git-ignored local copy)`);
}
