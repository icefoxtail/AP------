const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const schema = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'schema.sql'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'migrations', '20260824_archive_blueprint_metadata_bridge.sql'), 'utf8');
const examsRoute = fs.readFileSync(path.join(root, 'apmath', 'worker-backup', 'worker', 'routes', 'exams.js'), 'utf8');
const mixedEngine = fs.readFileSync(path.join(root, 'archive', 'mixed_engine.html'), 'utf8');

const columns = ['sub_unit_key', 'type_key', 'template_key', 'difficulty', 'metadata_revision', 'metadata_hash'];
for (const column of columns) {
  assert(
    schema.includes(`${column} TEXT`),
    `schema must declare additive exam_blueprints column: ${column}`
  );
}

// type_key and difficulty already exist in the deployed baseline.  The
// Phase 2A migration must add only the missing archive bridge columns and
// must not attempt a duplicate ALTER for those legacy columns.
const migrationColumns = ['sub_unit_key', 'template_key', 'metadata_revision', 'metadata_hash'];
for (const column of migrationColumns) {
  assert(
    migration.includes(`ALTER TABLE exam_blueprints ADD COLUMN ${column} TEXT`),
    `migration must add exam_blueprints column: ${column}`
  );
}
assert(!migration.includes('ALTER TABLE exam_blueprints ADD COLUMN type_key TEXT'), 'migration must preserve baseline type_key');
assert(!migration.includes('ALTER TABLE exam_blueprints ADD COLUMN difficulty TEXT'), 'migration must preserve baseline difficulty');

assert(!/\bDROP\s+(TABLE|COLUMN)\b/i.test(migration), 'Phase 2A migration must not drop tables or columns');
assert(!/PRIMARY\s+KEY\s*\(/i.test(migration), 'Phase 2A migration must not redefine the blueprint primary key');

assert(
  schema.includes('CREATE INDEX IF NOT EXISTS idx_exam_blueprints_sub_unit') &&
    migration.includes('CREATE INDEX IF NOT EXISTS idx_exam_blueprints_sub_unit'),
  'sub-unit index must be declared in schema and migration'
);
assert(
  schema.includes('CREATE INDEX IF NOT EXISTS idx_exam_blueprints_metadata_hash') &&
    migration.includes('CREATE INDEX IF NOT EXISTS idx_exam_blueprints_metadata_hash'),
  'metadata hash index must be declared in schema and migration'
);

assert(
  examsRoute.includes("const BLUEPRINT_META_COLUMNS = ['assessment_pack_id', 'type_key', 'difficulty'];"),
  'worker legacy blueprint metadata mapping must remain compatible'
);
assert(
  examsRoute.includes("const BLUEPRINT_ARCHIVE_METADATA_COLUMNS = ['sub_unit_key', 'template_key', 'metadata_revision', 'metadata_hash'];"),
  'worker archive metadata column mapping must be declared'
);
assert(examsRoute.includes('function buildArchiveQuestionMetadata(question)'), 'archive metadata normalizer must exist');
assert(examsRoute.includes('async function buildArchiveMetadataHash(metadata)'), 'archive metadata hash builder must exist');
assert(examsRoute.includes('const canCompareMetadata = blueprintColumns.has(\'metadata_revision\') && blueprintColumns.has(\'metadata_hash\');'), 'worker must detect migrated metadata columns before comparing');
assert(examsRoute.includes("if (blueprintIdentityColumns.includes('source_question_ordinal')) existingSelect.push('source_question_ordinal');"), 'metadata comparison must retain source ordinal identity');
assert(examsRoute.includes('existing.metadata_hash || \'\''), 'worker must compare the stored metadata hash');
assert(examsRoute.includes('...blueprintArchiveMetadataColumns.map(col => `${col}=excluded.${col}`)'), 'POST blueprint upsert must persist archive metadata columns');
assert(examsRoute.includes('metadata_hash || item.metadataHash'), 'POST blueprint payload must accept metadata hash aliases');
assert(mixedEngine.includes('sub_unit_key: q?.subUnitKey || q?.sub_unit_key || \'\''), 'MIXED blueprint payload must carry sub-unit metadata');
assert(mixedEngine.includes('metadata_revision: q?.metadataRevision || q?.metadata_revision || \'archive-metadata-v1\''), 'MIXED blueprint payload must carry metadata revision');
assert(mixedEngine.includes("q?.metadataRevision || q?.metadata_revision || 'archive-metadata-v1'"), 'MIXED blueprint registration signature must include metadata revision');
assert(!examsRoute.includes('SELECT 1 FROM exam_blueprints WHERE archive_file = ? LIMIT 1'), 'legacy any-row skip must be removed');
assert(
  examsRoute.includes('ON CONFLICT(archive_file, question_no) DO UPDATE SET'),
  'blueprint upsert contract must remain intact for metadata-aware sync'
);

console.log('archive blueprint metadata bridge Phase 2B contract checks passed');
