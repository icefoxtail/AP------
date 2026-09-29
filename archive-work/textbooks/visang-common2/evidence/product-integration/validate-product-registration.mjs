import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const root = process.cwd();
const base = 'archive-work/textbooks/visang-common2/evidence/product-integration';
const registration = JSON.parse(fs.readFileSync(path.join(root, base, 'product-registration-manifest.json'), 'utf8'));
const browser = JSON.parse(fs.readFileSync(path.join(root, base, 'product-browser-render-check.json'), 'utf8'));
const identity = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/question_identity_map.json'), 'utf8'));
const metadata = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/question_metadata.json'), 'utf8'));
const loadWindow = relative => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, relative), 'utf8'), context, { filename: relative, timeout: 5000 });
  return context.window;
};
const db = loadWindow('archive/db.js').mainDB.exams;
const index = loadWindow('archive/question-index.js').questionIndex;
const dependencyRoot = process.env.APMATH_NODE_MODULES;
if (!dependencyRoot) throw new Error('APMATH_NODE_MODULES_REQUIRED');
const require = createRequire(path.join(dependencyRoot, '..', 'package.json'));
const archive2Core = require(path.join(root, 'archive/archive2-core.js'));
const catalog = archive2Core.decodeCatalog(JSON.parse(fs.readFileSync(path.join(root, 'archive/data/archive2-catalog.json'), 'utf8')));
const prefix = `${registration.productRoot.split('/').slice(2).join('/')}/`;
const dbRows = db.filter(row => row.file.startsWith(prefix));
const indexRows = index.filter(row => row.sourceFile.startsWith(prefix));
const catalogExams = catalog.exams.filter(row => row.file.startsWith(prefix));
const catalogRecords = catalog.records.filter(row => row.sourceFile.startsWith(prefix));
const expectedFiles = new Set(registration.files.map(row => row.file));
const identityByFile = identity.records.filter(row => expectedFiles.has(row.sourceArchiveFile));
const metadataByUid = new Map(metadata.records.map(row => [row.questionUid, row]));
const questions = identityByFile.map(row => metadataByUid.get(row.questionUid)).filter(Boolean);
const pendingMetadataCount = questions.filter(row => row.metadataStatus === 'registration_pending_semantic_review' && row.reviewStatus === 'review_required').length;
const verifiedCatalogIdentityCount = catalogRecords.filter(row => row.identityStatus === 'VERIFIED' && row.sourceStatus === 'VERIFIED').length;
const assets = registration.assets.map(asset => {
  const file = path.join(root, asset.path);
  const exists = fs.existsSync(file);
  const actualSha = exists ? crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') : null;
  return { path: asset.path, exists, hashMatches: exists && actualSha === asset.sha256 };
});
const dbQuestionCount = dbRows.reduce((sum, row) => sum + Number(row.qCount), 0);
const failures = [];
if (registration.examFileCount !== 13 || registration.questionCount !== 174) failures.push('REGISTRATION_MANIFEST_DENOMINATOR');
if (dbRows.length !== 13 || dbQuestionCount !== 174) failures.push('DB_DENOMINATOR');
if (indexRows.length !== 174 || new Set(indexRows.map(row => row.sourceFile)).size !== 13) failures.push('QUESTION_INDEX_DENOMINATOR');
if (catalogExams.length !== 13 || catalogRecords.length !== 174) failures.push('ARCHIVE2_CATALOG_DENOMINATOR');
if (verifiedCatalogIdentityCount !== 174) failures.push('ARCHIVE2_IDENTITY_OR_SOURCE_VERIFICATION');
if (identityByFile.length !== 174 || questions.length !== 174) failures.push('IDENTITY_METADATA_DENOMINATOR');
if (pendingMetadataCount !== 174) failures.push('CONTENT_REVIEW_PENDING_STATE_NOT_VISIBLE');
if (assets.some(row => !row.exists || !row.hashMatches)) failures.push('ASSET_REGISTRATION_HASH');
if (browser.status !== 'PASS' || browser.modeCount !== 39 || browser.contentReviewPerformed !== false) failures.push('PRODUCT_BROWSER_RENDER_GATE');
const report = {
  schemaVersion: 'VISANG_TEXTBOOK_PRODUCT_REGISTRATION_AUDIT_v1',
  status: failures.length ? 'FAIL' : 'PASS_TECHNICAL_CONTENT_REVIEW_PENDING',
  textbookRoot: registration.productRoot,
  bookCount: 1,
  examFileCount: dbRows.length,
  questionCount: dbQuestionCount,
  indexRows: indexRows.length,
  archive2CatalogExams: catalogExams.length,
  archive2CatalogQuestions: catalogRecords.length,
  archive2IdentityAndSourceVerified: verifiedCatalogIdentityCount,
  identityRecords: identityByFile.length,
  metadataRecords: questions.length,
  contentReviewPending: pendingMetadataCount,
  productRenderModes: browser.modeCount,
  assets: { count: assets.length, pass: assets.filter(row => row.exists && row.hashMatches).length },
  contentReviewPerformed: false,
  productionContentReviewStatus: 'PENDING_PER_USER_INSTRUCTION',
  failures,
};
fs.writeFileSync(path.join(root, base, 'product-registration-validation.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
