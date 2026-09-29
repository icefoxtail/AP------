import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const inventoryPath = 'archive-work/textbooks/visang-common2/source-inventory.json';
const productPrefix = 'textbooks/비상교육_공통수학2';
const productRoot = path.join(root, 'archive/exams', productPrefix);
const manifestPath = path.join(root, 'archive-work/textbooks/visang-common2/evidence/product-integration/product-registration-manifest.json');
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const inventory = JSON.parse(fs.readFileSync(path.join(root, inventoryPath), 'utf8'));
if (inventory.sets.length !== 13 || inventory.sets.reduce((n, set) => n + set.count, 0) !== 174) {
  throw new Error('TEXTBOOK_DENOMINATOR_MISMATCH');
}
fs.mkdirSync(productRoot, { recursive: true });

function parseBank(jsPath) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(jsPath, 'utf8'), context, { filename: jsPath, timeout: 1500 });
  const bank = context.window.questionBank;
  if (!Array.isArray(bank) || !context.window.examTitle) throw new Error(`JS_BANK_REQUIRED:${jsPath}`);
  return { examTitle: context.window.examTitle, bank };
}

function pathInside(base, target) {
  const relative = path.relative(base, target);
  return relative && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
}

function resolveAsset(sourceSetRoot, reference) {
  let source;
  let productRef;
  if (reference.startsWith('assets/images/')) {
    source = path.resolve(sourceSetRoot, reference);
    productRef = reference;
  } else if (reference.startsWith('../archive-work/textbooks/')) {
    source = path.resolve(root, 'archive', reference);
    const marker = `${path.sep}assets${path.sep}`;
    const index = source.toLowerCase().indexOf(marker.toLowerCase());
    if (index < 0) throw new Error(`ASSET_PATH_NOT_CANONICAL:${reference}`);
    let subpath = source.slice(index + marker.length).split(path.sep).join('/');
    if (!subpath.startsWith('images/')) subpath = `images/${subpath}`;
    productRef = `assets/${subpath}`;
  } else if (reference.startsWith('archive/assets/')) {
    source = path.resolve(root, reference);
    productRef = reference.slice('archive/'.length);
  } else {
    throw new Error(`ASSET_REFERENCE_UNSUPPORTED:${reference}`);
  }
  if (!pathInside(root, source) || !fs.existsSync(source) || !fs.statSync(source).isFile()) {
    throw new Error(`ASSET_SOURCE_MISSING:${reference}:${source}`);
  }
  const archiveRelative = path.posix.join('archive', productRef);
  return { source, productRef, archiveRelative };
}

function findAssetReferences(value, refs = new Set()) {
  if (typeof value === 'string') {
    for (const match of value.matchAll(/(?:^|["'(\s])((?:assets\/images\/|\.\.\/archive-work\/textbooks\/)[^"'<>\s)]+)/g)) refs.add(match[1]);
  } else if (Array.isArray(value)) value.forEach(item => findAssetReferences(item, refs));
  else if (value && typeof value === 'object') Object.values(value).forEach(item => findAssetReferences(item, refs));
  return refs;
}

function courseRanges(bank) {
  const groups = new Map();
  for (const q of bank) {
    const key = String(q.standardUnitKey || '').trim();
    const course = String(q.standardCourse || q.course || '공통수학2').trim();
    const match = key.match(/^(.*?)-(\d{2})$/);
    const courseCode = match?.[1] || 'H22-C2';
    const order = Number.isFinite(Number(q.standardUnitOrder)) && Number(q.standardUnitOrder) > 0
      ? Number(q.standardUnitOrder)
      : Number(match?.[2] || 0);
    const unit = String(q.standardUnit || '').trim();
    if (!key || !unit || !order) continue;
    const groupKey = `${course}\u0000${courseCode}`;
    const group = groups.get(groupKey) || { course, courseCode, units: new Map() };
    group.units.set(key, { key, unit, order });
    groups.set(groupKey, group);
  }
  return [...groups.values()].map(group => {
    const units = [...group.units.values()].sort((a, b) => a.order - b.order || a.key.localeCompare(b.key));
    const start = units[0], end = units.at(-1);
    return {
      standardCourse: group.course,
      courseCode: group.courseCode,
      rangeStartUnitKey: start.key,
      rangeStartUnit: start.unit,
      rangeStartUnitOrder: start.order,
      rangeEndUnitKey: end.key,
      rangeEndUnit: end.unit,
      rangeEndUnitOrder: end.order,
    };
  }).sort((a, b) => a.rangeStartUnitOrder - b.rangeStartUnitOrder || a.courseCode.localeCompare(b.courseCode));
}

const productEntries = [];
const outputFiles = [];
let questionCount = 0;
const seenAssets = new Map();

for (const set of inventory.sets) {
  const sourceJs = path.resolve(root, set.canonicalJs);
  const sourceSetRoot = path.dirname(path.dirname(sourceJs));
  const { examTitle, bank } = parseBank(sourceJs);
  if (bank.length !== set.count) throw new Error(`SOURCE_DENOMINATOR_MISMATCH:${set.canonicalJs}`);
  const jsName = path.basename(sourceJs);
  const productJsRelative = path.posix.join(productPrefix, jsName);
  const productJs = path.join(root, 'archive/exams', ...productJsRelative.split('/'));
  const sourceBytes = fs.readFileSync(sourceJs);
  let productText = sourceBytes.toString('utf8');
  const refMap = new Map();

  for (const reference of findAssetReferences(bank)) {
    const asset = resolveAsset(sourceSetRoot, reference);
    refMap.set(reference, asset.productRef);
    const existing = seenAssets.get(asset.archiveRelative);
    const bytes = fs.readFileSync(asset.source);
    const digest = sha256(bytes);
    if (existing && existing.sha256 !== digest) throw new Error(`PRODUCT_ASSET_COLLISION:${asset.archiveRelative}`);
    if (!existing) {
      const target = path.join(root, ...asset.archiveRelative.split('/'));
      fs.mkdirSync(path.dirname(target), { recursive: true });
      if (fs.existsSync(target)) {
        const targetSha = sha256(fs.readFileSync(target));
        if (targetSha !== digest) throw new Error(`PRODUCT_ASSET_TARGET_COLLISION:${asset.archiveRelative}`);
      } else fs.writeFileSync(target, bytes);
      seenAssets.set(asset.archiveRelative, { source: path.relative(root, asset.source).split(path.sep).join('/'), sha256: digest, bytes: bytes.length });
    }
  }
  for (const [oldRef, newRef] of refMap) productText = productText.split(oldRef).join(newRef);
  const productBytes = Buffer.from(productText, 'utf8');
  fs.mkdirSync(path.dirname(productJs), { recursive: true });
  if (fs.existsSync(productJs)) {
    if (sha256(fs.readFileSync(productJs)) !== sha256(productBytes)) throw new Error(`PRODUCT_JS_TARGET_COLLISION:${productJsRelative}`);
  } else fs.writeFileSync(productJs, productBytes);

  const ranges = courseRanges(bank);
  const primaryCourse = String(bank.find(q => q.standardCourse || q.course)?.standardCourse || bank.find(q => q.course)?.course || '공통수학2').trim();
  productEntries.push({
    file: productJsRelative,
    school: '비상교육',
    topic: examTitle,
    grade: '고1',
    semester: '2',
    examType: 'textbook',
    subject: '공통수학2',
    contentType: '교과서',
    qCount: bank.length,
    ...(ranges.length ? {
      rangeStartUnitKey: ranges[0].rangeStartUnitKey,
      rangeStartUnit: ranges[0].rangeStartUnit,
      rangeStartUnitOrder: ranges[0].rangeStartUnitOrder,
      rangeEndUnitKey: ranges.at(-1).rangeEndUnitKey,
      rangeEndUnit: ranges.at(-1).rangeEndUnit,
      rangeEndUnitOrder: ranges.at(-1).rangeEndUnitOrder,
      courseRanges: ranges,
    } : {}),
    primaryStandardCourse: primaryCourse,
  });
  outputFiles.push({
    file: productJsRelative,
    sourceJs: path.relative(root, sourceJs).split(path.sep).join('/'),
    questionCount: bank.length,
    title: examTitle,
    sourceSha256: sha256(sourceBytes),
    productSha256: sha256(productBytes),
    assetPathRepairs: [...refMap].filter(([from, to]) => from !== to).map(([from, to]) => ({ from, to })),
  });
  questionCount += bank.length;
}

const dbFile = path.join(root, 'archive/db.js');
const dbText = fs.readFileSync(dbFile, 'utf8');
const dbContext = { window: {} };
vm.runInNewContext(dbText, dbContext, { filename: dbFile, timeout: 3000 });
const db = dbContext.window.mainDB;
if (!db || !Array.isArray(db.exams)) throw new Error('MAIN_DB_EXAMS_REQUIRED');
const existingByFile = new Map(db.exams.map(entry => [entry.file, entry]));
const existingProduct = productEntries.filter(entry => existingByFile.has(entry.file));
if (existingProduct.length && existingProduct.length !== productEntries.length) throw new Error('PARTIAL_TEXTBOOK_DB_REGISTRATION');
if (existingProduct.length === productEntries.length) {
  for (const entry of productEntries) {
    if (JSON.stringify(existingByFile.get(entry.file)) !== JSON.stringify(entry)) throw new Error(`TEXTBOOK_DB_ENTRY_DRIFT:${entry.file}`);
  }
} else {
  db.exams.push(...productEntries);
  const marker = dbText.indexOf('=');
  if (marker < 0) throw new Error('MAIN_DB_ASSIGNMENT_REQUIRED');
  const assignment = dbText.slice(0, marker + 1);
  fs.writeFileSync(dbFile, `${assignment} ${JSON.stringify(db, null, 2)};\n`, 'utf8');
}

const report = {
  schemaVersion: 'VISANG_TEXTBOOK_PRODUCT_REGISTRATION_v1',
  status: 'MATERIALIZED',
  productRoot: `archive/exams/${productPrefix}`,
  textbookTitle: '비상교육 고등 공통수학2',
  examFileCount: productEntries.length,
  questionCount,
  assetFileCount: seenAssets.size,
  files: outputFiles,
  assets: Object.entries(Object.fromEntries(seenAssets)).map(([path, info]) => ({ path, ...info })),
  dbEntries: productEntries,
  reviewDisposition: 'CONTENT_REVIEW_NOT_RUN_PER_USER_INSTRUCTION',
  productionAuthorized: false,
};
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
fs.writeFileSync(manifestPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: report.status, examFileCount: report.examFileCount, questionCount, assetFileCount: report.assetFileCount, productRoot: report.productRoot, manifest: path.relative(root, manifestPath).split(path.sep).join('/') }, null, 2));
