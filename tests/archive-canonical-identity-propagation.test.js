const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const indexBuilder = fs.readFileSync(path.join(root, 'archive', 'tools', 'build-question-index.mjs'), 'utf8');
const mixer = fs.readFileSync(path.join(root, 'archive', 'mixer.html'), 'utf8');
const mixedEngine = fs.readFileSync(path.join(root, 'archive', 'mixed_engine.html'), 'utf8');
const examsRoute = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'exams.js'), 'utf8');
const schema = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'schema.sql'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'migrations', '20260820_exam_blueprint_canonical_question_identity.sql'), 'utf8');

assert(
  indexBuilder.includes('sourceOrdinal: slot + 1') && indexBuilder.includes('sourceOrdinal: r.sourceOrdinal'),
  'question index builder must retain original source ordinal'
);

assert(
  /question-identity\.js\?v=\d+\.\d+/.test(mixer) &&
    mixer.includes('function resolveMixerQuestionIdentity') &&
    mixer.includes('questions[normalized.sourceOrdinal - 1]') &&
    mixer.includes('source_question_uid: normalized.questionUid || \'\'') &&
    mixer.includes('source_question_ordinal: normalized.sourceOrdinal || null'),
  'mixer must resolve and preserve canonical source identity without first-id fallback'
);

assert(
  mixedEngine.includes('function getMixedQuestionIdentity') &&
    mixedEngine.includes('function getMixedQuestionSourceOrdinal') &&
    mixedEngine.includes('source_question_uid: sourceUid || null') &&
    mixedEngine.includes('source_question_ordinal: sourceOrdinal || null'),
  'mixed engine must send canonical source identity in blueprint payloads'
);

assert(
    examsRoute.includes("const BLUEPRINT_IDENTITY_COLUMNS = ['source_question_uid', 'source_question_ordinal'];") &&
    examsRoute.includes('async function makeCanonicalQuestionUid') &&
    examsRoute.includes('file, questionNo, file, questionNo') &&
    examsRoute.includes('...blueprintIdentityColumns.map(col => `${col}=excluded.${col}`)'),
  'worker must calculate or persist additive canonical blueprint identity columns'
);

assert(
  schema.includes('source_question_uid TEXT') && schema.includes('source_question_ordinal INTEGER') &&
    migration.includes('ALTER TABLE exam_blueprints ADD COLUMN source_question_uid TEXT') &&
    migration.includes('ALTER TABLE exam_blueprints ADD COLUMN source_question_ordinal INTEGER'),
  'schema and migration must include additive canonical identity columns'
);

console.log('archive canonical identity propagation checks passed');
