import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
const [root, candidateRoot, packagePath, reportPath] = process.argv.slice(2);
if (!root || !candidateRoot || !packagePath || !reportPath) throw new Error('CATALOG_PARITY_ARGS_REQUIRED');
const core = (await import(pathToFileURL(path.join(root, 'archive/archive2-core.js')))).default;
const mainCatalogPath = path.join(root, 'archive/data/archive2-catalog.json');
const candidateCatalogPath = path.join(candidateRoot, 'archive/data/archive2-catalog.json');
const mainManifestPath = path.join(root, 'archive/data/archive2-canonical-input-manifest.json');
const candidateManifestPath = path.join(candidateRoot, 'archive/data/archive2-canonical-input-manifest.json');
const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const stable = v => Array.isArray(v) ? v.map(stable) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, stable(v[k])])) : v;
const jsonEq = (a, b) => JSON.stringify(stable(a)) === JSON.stringify(stable(b));
const mainPacked = readJson(mainCatalogPath), candidatePacked = readJson(candidateCatalogPath);
const mainDecoded = core.decodeCatalog(mainPacked), candidateDecoded = core.decodeCatalog(candidatePacked);
const targetFile = 'original/high/h2/1mid/26_금당고_1학기_중간_고2_대수.js';
const packageValue = readJson(packagePath);
const expectedTargetRows = packageValue.targetOutputs.catalogRows;
const mainTargetRows = mainDecoded.records.filter(r => r.sourceFile === targetFile);
const candidateTargetRows = candidateDecoded.records.filter(r => r.sourceFile === targetFile);
const mainNonTargetRows = mainDecoded.records.filter(r => r.sourceFile !== targetFile);
const candidateNonTargetRows = candidateDecoded.records.filter(r => r.sourceFile !== targetFile);
const decodedTopLevelDifferences = Object.keys(mainDecoded).filter(k => !jsonEq(mainDecoded[k], candidateDecoded[k]));
const packedTopLevelDifferences = Object.keys(mainPacked).filter(k => !jsonEq(mainPacked[k], candidatePacked[k]));
const manifestMain = readJson(mainManifestPath), manifestCandidate = readJson(candidateManifestPath);
const manifestTopLevelDifferences = Object.keys(manifestMain).filter(k => !jsonEq(manifestMain[k], manifestCandidate[k]));
const manifestFileMap = value => new Map((value.files || []).map(row => [row.path, row.sha256]));
const mainManifestFiles = manifestFileMap(manifestMain), candidateManifestFiles = manifestFileMap(manifestCandidate);
const manifestFileDiffPaths = [...new Set([...mainManifestFiles.keys(), ...candidateManifestFiles.keys()])]
  .filter(file => mainManifestFiles.get(file) !== candidateManifestFiles.get(file)).sort();
const unexpectedManifestDifferences = manifestTopLevelDifferences
  .filter(k => !['generatedFromCatalogIndexVersion', 'projectionVersion', 'files'].includes(k));
const manifestFilesOnlyCatalogDiff = jsonEq(manifestFileDiffPaths, ['data/archive2-catalog.json'])
  && mainManifestFiles.get('data/archive2-catalog.json') === sha(fs.readFileSync(mainCatalogPath))
  && candidateManifestFiles.get('data/archive2-catalog.json') === sha(fs.readFileSync(candidateCatalogPath));
const targetSourceHash = candidateDecoded.sourceHashes.find(([file]) => file === targetFile)?.[1] ?? null;
const sourceBytes = fs.readFileSync(path.join(root, 'archive/exams', targetFile));
const cleanLfSha = sha(Buffer.from(sourceBytes.toString('utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n'), 'utf8'));
const recordsCurrentCanonical = jsonEq(mainDecoded.records, candidateDecoded.records);
const targetRowsCurrentCanonical = jsonEq(mainTargetRows, candidateTargetRows);
const targetRowsMatchPackage = jsonEq(candidateTargetRows, expectedTargetRows);
const nonTargetRowsCurrentCanonical = jsonEq(mainNonTargetRows, candidateNonTargetRows);
const packingKeys = ['encoding', 'columns', 'strings'];
const packingParity = Object.fromEntries(packingKeys.map(k => [k, jsonEq(mainPacked[k], candidatePacked[k])]));
const nonHeaderDecodedDifferences = decodedTopLevelDifferences.filter(k => k !== 'indexVersion');
const targetQids = [...new Set(candidateTargetRows.map(r => Number(r.sourceOrdinal)))].sort((a, b) => a - b);
const expectedQids = Array.from({ length: 21 }, (_, i) => i + 1);
const report = {
  schemaVersion: 'ROOT_POSTAPPLY_CATALOG_PAYLOAD_PARITY_V1',
  status: 'PENDING',
  examUid: '26_금당고_1학기_중간_고2_대수',
  targetFile,
  currentCatalog: { path: mainCatalogPath, sha256: sha(fs.readFileSync(mainCatalogPath)), indexVersion: mainDecoded.indexVersion },
  canonicalCandidate: { path: candidateCatalogPath, sha256: sha(fs.readFileSync(candidateCatalogPath)), indexVersion: candidateDecoded.indexVersion },
  manifest: { currentPath: mainManifestPath, currentSha256: sha(fs.readFileSync(mainManifestPath)), candidatePath: candidateManifestPath, candidateSha256: sha(fs.readFileSync(candidateManifestPath)), topLevelDifferences: manifestTopLevelDifferences, fileDiffPaths: manifestFileDiffPaths, filesOnlyCatalogDigestChanged: manifestFilesOnlyCatalogDiff, allowedDifferenceKeysOnly: unexpectedManifestDifferences.length === 0 && manifestFilesOnlyCatalogDiff },
  rows: { mainDecodedCount: mainDecoded.records.length, candidateDecodedCount: candidateDecoded.records.length, targetCount: candidateTargetRows.length, targetQids, expectedQids, targetOrdinalCoverage: jsonEq(targetQids, expectedQids), targetRowsCurrentCanonical, targetRowsMatchPackage, nonTargetCount: candidateNonTargetRows.length, expectedNonTargetCount: 12966, nonTargetRowsCurrentCanonical, recordsCurrentCanonical },
  packing: { keys: packingKeys, parity: packingParity, allParity: Object.values(packingParity).every(Boolean), packedTopLevelDifferences },
  sourceHash: { catalogSourceHash: targetSourceHash, cleanLfSha256: cleanLfSha, matchesCleanLf: targetSourceHash === cleanLfSha },
  decodedTopLevelDifferences,
  onlyAllowedHeaderDifference: nonHeaderDecodedDifferences.length === 0,
  checks: { targetSourceHashMatchesCleanLf: targetSourceHash === cleanLfSha, targetCoverage21: candidateTargetRows.length === 21 && jsonEq(targetQids, expectedQids), targetCanonicalAndPackageParity: targetRowsCurrentCanonical && targetRowsMatchPackage, nonTarget12966DeepParity: candidateNonTargetRows.length === 12966 && nonTargetRowsCurrentCanonical, allDecodedRecordsCanonical: recordsCurrentCanonical, packingColumnDictionaryParity: Object.values(packingParity).every(Boolean), indexVersionOnlyDecodedHeaderDrift: nonHeaderDecodedDifferences.length === 0, manifestIndexProjectionAndCatalogDigestRepairOnly: unexpectedManifestDifferences.length === 0 && manifestFilesOnlyCatalogDiff },
  createdAt: new Date().toISOString(),
};
report.status = Object.values(report.checks).every(Boolean) ? 'PASS_CANONICAL_HEADER_REPAIR_ONLY' : 'FAIL';
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
process.stdout.write(JSON.stringify({ status: report.status, checks: report.checks, decodedTopLevelDifferences, manifestTopLevelDifferences, manifestFileDiffPaths, packedTopLevelDifferences, currentCatalogSha256: report.currentCatalog.sha256, candidateCatalogSha256: report.canonicalCandidate.sha256, reportPath, reportSha256: sha(fs.readFileSync(reportPath)) }, null, 2) + '\n');
if (report.status !== 'PASS_CANONICAL_HEADER_REPAIR_ONLY') process.exitCode = 1;
