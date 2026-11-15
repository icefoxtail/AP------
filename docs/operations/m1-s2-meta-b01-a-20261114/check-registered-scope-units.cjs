#!/usr/bin/env node
'use strict';
// Read-only, network-free B01-A check of the registered student site's two unit views.
// Usage: node check-registered-scope-units.cjs --site-root /scratch/extracted-site --registered-sha <H>
// Only --check syntax validation is appropriate before the real registered Pages artifact exists.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const SCOPE = {"assignmentId":"M1S2-20261114-B01-A","provenance":{"path":"/workspace/scratch/54cb21af3005/inspect-main-registration-artifact.py","sha256":"d2a38dc1c3aa7020d04e8d43cfe1f038c71971975e470d4d6d3b07c65d7dd45f","uidOrder":"source ordinal, 1-based","selectedFields":["examNumber","sourceArchiveFile","questionCount","allUids"],"selectedPayloadSha256":"28b4d496eecc900e779bb6d5dd4aefaa38f73e53702d842fb0cd5955c9f0208a"},"targets":[{"examNumber":1,"sourceArchiveFile":"original/middle/m1/2final/25_연향중_2학기_기말_중1_기출.js","questionCount":23,"allUids":["qid_v1_4645375fc8d91e4a879bc3a19c5d48db2a0f3789bde9dee9d7360d13fb3218d6","qid_v1_53311861e37719615dc603db64c1ff8a413a01daec5580b8b0a5a129b9f5afbf","qid_v1_4bb877da6e4bb5441e18c36687a9f0bbc01eab3d19cac457cc3cb7ef799342b8","qid_v1_1df6f3c53c22679b87c4c170c6f368d867b924be560cd69f6baa2cd3468255f5","qid_v1_40c01ce6a1b0c59462238a9569acf481e61d32f6dd115b1429906782353e9d2b","qid_v1_71c1c30b662418fb46def41379a06967e78c5e19d7239c004b1a5b0be6a28ad8","qid_v1_60a01803a994f2e64293b2fda6278172505188e40653c8646b7316ca665f7645","qid_v1_1fc449531d368e7283a46b223907aa72e6b1a5178930267671e61c65c5d14075","qid_v1_92ad3a05430b30ee63b375de09ae635f950339391df4569f2f87edf7c15b03cb","qid_v1_3e6a4452298d733fdd51ed48e9a37c02ab8ead4ce4e30ad48ead8389d146a3dd","qid_v1_a94ccfc2dd22bf72606b84f2284aecfc83018bd9d9dc2d547614576d4f754196","qid_v1_dac159f88b041dbfe23bee2a8bb6a54536139a7106304c35721e829d53c1e4dc","qid_v1_28c548b3d7d879690980de8f555292c118522ce28c8eb0952b131e8c9dd3c584","qid_v1_93f3c56129d4f5ed10271eeb13a5e4ac319314b53e1fdf529f89f9893afa7ae2","qid_v1_ffcd4992e7ec7512be232e19f56037887e79e2d8706930dd9561b3857daa473a","qid_v1_64d3b95ee51ba9885c4b63cf4ae32b89c5d421ca6be5f1cb58aecbe432228be5","qid_v1_f37124d064bc58716515294d2299d077f71db938c78e70532b833154e5fef9db","qid_v1_107e12507edec26393f63b78e6ce047d05afc5365a3f0284575460f1ad83ed47","qid_v1_355e74d9f609e333c2940cdb78799a0b31689ad41d5e1a7ad02c251d863c1d7d","qid_v1_6b1b1ca5a079ec503132ad4834946469bfa7e36bb50dc6b92dd36973d819ebf7","qid_v1_67eb2d2f33f50a13c3ca2f82f8eccb73051fc85492458f4258234c4e0bbd3af9","qid_v1_7b83f4c730303f4668dc2d0d44df70d20c35664a10a45b77d11a229ba97eb882","qid_v1_182ccc2b6c2772f8a12f87e0048539e10c4f52e8f341ab35103b859e3d2e46dd"]},{"examNumber":2,"sourceArchiveFile":"original/middle/m1/2final/25_왕운중_2학기_기말_중1_기출.js","questionCount":24,"allUids":["qid_v1_cbad75c4eb55bd19cf1de16ffa0a5259b1f9730cb717f5a7e9817720db19bc15","qid_v1_0bc8c861739c94238388304386b6fb85000500f1f463bc9e21d0423c4b0b874b","qid_v1_94282bace49b7efac917d83724beb6c5b9f77411b3af8b4eee228a073829bf8b","qid_v1_385d314e84730242ba2e90344059e54559444f286192d8ae88beb5835ea826c3","qid_v1_bf96f1e1a94e3d1d870f8dcadcfb1b43e00f25468d52ec16892851e7d7902017","qid_v1_76bd5d12df09268493b1f61107cacb61746c366839eba4339034447ac95951e6","qid_v1_033e9f7a2a765b9c0c16ec9a3a7d1407ae2fd1581765f2718a9b3a5229908383","qid_v1_3096b414386ca69f7d356adbe704b481843bbe095cf4f87b2f899766cb982e97","qid_v1_58619239fa5796489ce1cad319ecdeaea957b763109843e4e2dec5e6a46cd4fb","qid_v1_00dfff2608c2a51eb012e1e6731bb4e01c8b6411ef96c0817bbf1d3aba552ede","qid_v1_c89c38b53a4ff4f49954f91d1a20d9d0123e9fd117f7122de40fbca1c5146832","qid_v1_cb9115964cd7a5270799edf570788c87706c67085edc250a39bbf6ed7b2dccea","qid_v1_8c06039ac25ba0c28436e749c93b6d2833392d970a95df1a1a798cae44ca3eb2","qid_v1_1a8159b4dc0fa361db9e4e976d3a3b4009b4bc927f6fae737f7d54aa94dc1dde","qid_v1_5877b6de040fb2ad6562ab96ec6affdeb618c0bdfd7017dbcce572c49e263953","qid_v1_81bfb7002460d5476195b35a673184d06288914753f5cecd84af6aec3d40d002","qid_v1_adadf0810ade818ef1f3ddc6f9de24615497bad4df4e73de69286658a8daae79","qid_v1_77c11c683e138f6fcc117c68e4347724ac2aa5797b4c78db03c27ced1cc6b065","qid_v1_d9f125289ff7fb870667cd902ed5e7a60846069f8f9139709f3ca42b52b23ad9","qid_v1_03941b7e264dfb63c7271e2399e09076840e7c73e18261e767f43ac6283c9aac","qid_v1_382314a3713c9d61ec63b7c54dde290271cd467b42c1e9c58d3dd7274790b554","qid_v1_37458bc65f27a6f3a2ffb6fdd229d027b984e3134ff4aa5962900a0aa547154a","qid_v1_378417836e32662281c15dd16fae018a76dfb486b235ebe1d91c4a6041f4f3fc","qid_v1_4fcdf70b120a3b9e8f0b47a1afb8867e4eff5cec7e9c84cd73182733d5f2b391"]},{"examNumber":3,"sourceArchiveFile":"original/middle/m1/2mid/25_연향중_2학기_중간_중1_기출.js","questionCount":24,"allUids":["qid_v1_739e1aa780820f52cc6e83ca25b1a1508345da33cfd41c2b2aa15b02ab622d81","qid_v1_539d36380fba5e6eaca4f2755efe690eaada61820b364928db2cccfa13614058","qid_v1_3f786ea3f678d34b1c57c95643f071599c532fb6e51eca405d0cffd64777b46e","qid_v1_ac28d71dcdee035cda402539898e93d767004e529304b6430d4a7e8257bfaea9","qid_v1_e33fa670068a0649ff0431a64e1551ae2694a047277ca6fa2a9633c5274825f2","qid_v1_b71e5dd308c16ae4d40ceb1cd4b974220eca9177e0ca07e555eecddc5627f1d0","qid_v1_008e99d3101749b349c08fa5e412c4f59c9bfc8b098e48d8ce26d08a4c8c053a","qid_v1_d485821d8e9f62c6ddb2f155dfd0d84a217db84aeeb32b41b9a3ce95629fd54a","qid_v1_335da5e2c7a6f42520c7c59790de98393e76b80210f54b7b91d6c433ffd93782","qid_v1_f9c54052280ef5a5bf6ebc57c42509083d2d7740770ceceef12adc7d73c700ea","qid_v1_e91debd5d9851ee135e3d3f941c2476429d2e9cf1d37e29994a0663f768014b6","qid_v1_00d5faf57a4654c3c6cf9814946c4f5c29bfb232f33b2a09418d166032122f1b","qid_v1_618d09e48445ce3e0556235122b322e592ecd1eac03133418968ef89dbeed46e","qid_v1_4c7fca50942ca10775327523c18ccbe2d18160249662d698ea44a96c72f5e774","qid_v1_bdb9d3bbc904d9ae1bc39e408002ef43155c4f853dee344645c378b4b9a20270","qid_v1_c45b20b2f087a643b82bdbc0405b2b2c1c96194ba953a77af50d9d15c31a1798","qid_v1_26a62a5c2fc811fe37310857f79339211a308a9983b16cec54deb0b0f8f0fb62","qid_v1_fdc2c11452f888f0c7e935b40eee4f284b64de7f0344a354b368d8fd841da5f6","qid_v1_63f6f87ada000980090636747d14c464d02f8b8833e329b72f3df7b18eec46f4","qid_v1_aa67f2a9ec608f26ddcb2a911e675f1db7ebef15bd969c2b9dde373fde0bbeb3","qid_v1_71befc5c53542a307028afdb767f331a43590195f1537cc323e6dd76013291c6","qid_v1_dbd2626d30b8c1157df867b00f5eddc5e4f528aad38fd308424ea68bd9e31af2","qid_v1_7e7daaa8de9d161000e9669ff4da4f7bf381397beaa4ad5f3b499110fb9d0125","qid_v1_9c648fe8e985af08e260cc06bde504a2d65e296cf1139d81723717bcf202549e"]},{"examNumber":4,"sourceArchiveFile":"original/middle/m1/2mid/25_왕의중_2학기_중간_중1_수학.js","questionCount":24,"allUids":["qid_v1_0ee31a8617859f5a8f0090bb6d1a13af4c47c62aeedba338acf8af39b94b94bd","qid_v1_f36c896c76828c6f22a77abd6733d63c943326317c2bbe17ecf766dbe374cae5","qid_v1_8fefacc7377977e7d202171f2572deb5df047dc37cb42668e30bf928269ad9c7","qid_v1_da90f2e94b1e04b94755c573a2f5786592b17561a9b92d050089ddbb1ae26c39","qid_v1_5b2fdfe974ead21d89c52ffaf85f6dd4a3e88e4e15a8f9170de86425c90b8660","qid_v1_022b0ec1efd064ef47e2ac232b7bc88e29a6bd93dac5d74dc25bde7636217fe6","qid_v1_db992e5f8aef95b1223311bf0dbdb4d67cd2e0cfded4c0f97d52607efff5e0a3","qid_v1_8431ee3bd4df3895ef8ca1fd54fc7136761c1396d5c27350bbb29e3ccff96191","qid_v1_134c29fd3862476f394b04d939c5eb3ed5a94056f4313b939b2949320381d968","qid_v1_b02d2dc46b20083602584d8ce6786be763e708503ca13267c06c7f41cfd3de93","qid_v1_05b2a7160ed874cf3445fedb2e7b9e7ef3eb756d18c4f41e45c7696e2e67f4ee","qid_v1_4fe0556f3bfaafa7500dae34feadcdd9015598f7960f37c07b710bc62df23a5e","qid_v1_efd4f2cf5eb98e85c40414ca19702d725c6e41c6994fa20a12147352b05b35bb","qid_v1_2cfa18c1f4ffb7ed65d11c0c643a0bf8aaa2da3ea2bd2097fae7f7167ad5cda3","qid_v1_83bca144794af90fb844d2c2c640d293ccf7fa690cf6075c150b6bdf83b37f80","qid_v1_ea46f9d463fb4f1aeeb7e5deaba6d5c2f91db952029ace8ad4f31b92ab3b5138","qid_v1_1ae24cf5c559c262aa94f72eed1a0439cf84a3056f18f2a9884aa5e0886086bd","qid_v1_067dc2c69b264cd8714ce78a0c0ade967111edaeabac40074373499ce2f957cc","qid_v1_97ba9773e526e9742012fac950e7b061acde40b29e723dc29cd1823f23a7c060","qid_v1_c9638401d996469034940b48bedf48c4966b43160628edd1f0980b3ac7679044","qid_v1_19b0e03abefda951bfd4aa21f0a957e55bc681fe6e8915e98a5720f4dcf0f657","qid_v1_18bcc5cd2692ad84322f864082ef275c787d061ac9560ed035b441d43b4e41c3","qid_v1_4449ad0a401e744e39838df6077b897146763b5bbb3750a66c6747134db68357","qid_v1_33ce79ce6d63307569c57580f67a056ddbf76be1a97558e402b871daa1ff2a9f"]}]};
const SHA40 = /^[a-f0-9]{40}$/;
const SHA64 = /^[a-f0-9]{64}$/;
const UID = /^qid_v1_[a-f0-9]{64}$/;
const BASE_URI = 'https://scope.test/AP------/archive/workspace.html';
const MANIFEST_PATH = 'archive/data/archive2-canonical-input-manifest.json';
const MODULES = [
  'archive/mixer-selector.js',
  'archive/archive2-canonical.js',
  'archive/archive2-core.js',
  'archive/rpm-middle-toc.js',
  'archive/unit-past-exams-core.js',
  'archive/archive2-unified-units.js'
];
const FUNCTIONS = [
  { path: 'tests/archive2-unified-units.test.js', function: 'unified classification agrees with every 단원별 기출 classification', reference: 'sourceFile#sourceQuestionNo join and assert.equal(entry.unitKey, result.unitKey)' },
  { path: 'tests/helpers/archive2-scope-harness.cjs', function: 'productionCatalog', reference: 'same VM + local fetch route; do not import top-level readProjection fixture' },
  { path: 'archive/meta-foundation-runtime.js', function: 'applyArchiveMetaFoundationCatalog', reference: 'loadInputBundle -> resolveCatalog -> finalCatalog' },
  { path: 'archive/archive2-canonical.js', function: 'loadInputBundle / resolveCatalog', reference: 'official manifest version, input digest and canonical resolution checks' },
  { path: 'archive/archive2-unified-units.js', function: 'buildIndex / classify / private unitFor', reference: 'actual unitKey' },
  { path: 'archive/unit-past-exams-core.js', function: 'normalizePath / getQuestionNo / classifyRecord', reference: 'expected unitKey' }
];
const fingerprints = new Map();
const issues = [];
let phase = 'ARGUMENTS';
let siteRoot;
let allowedFetchPaths;
let observedManifest;
const report = {
  schemaVersion: 'B01_A_REGISTERED_SCOPE_UNITS_V1',
  assignmentId: SCOPE.assignmentId,
  status: 'NOT_RUN',
  registeredMainSHA: 'UNKNOWN',
  operation: 'READ_ONLY_LOCAL_ARTIFACT',
  network: 'DISABLED',
  sourceExamExecution: 'NOT_PERFORMED',
  registrationAndDeploymentSuccess: 'NOT_INFERRED',
  readinessReceiptCheck: 'SEPARATE_OFFICIAL_WRITER_GATE',
  scopeManifest: SCOPE.provenance,
  officialFunctions: FUNCTIONS,
  counts: { expected: 95, catalogRows: 0, catalogUniqueAssignedUids: 0, questionIndexRows: 0, joined: 0, compared: 0, matched: 0, unplaced: 0, unclassified: 0, mismatched: 0 },
  exams: [],
  results: [],
  mismatches: [],
  issues,
  inputFiles: []
};

class CheckError extends Error {
  constructor(code, details = {}) { super(code); this.code = code; this.details = details; }
}
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const issue = (code, details = {}) => issues.push({ code, ...details });
const stop = (code, details = {}) => { throw new CheckError(code, details); };
const keyValue = value => typeof value === 'string' && /^[A-Za-z0-9_:-]{1,180}$/.test(value) ? value : value == null || value === '' ? '' : '[NON_KEY_VALUE]';
const safeUid = value => UID.test(String(value || '')) ? value : '[INVALID_UID]';

function argumentsOf(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!['--site-root', '--registered-sha'].includes(argv[i]) || !argv[i + 1] || argv[i + 1].startsWith('--')) stop('INVALID_ARGUMENTS');
    if (Object.hasOwn(options, argv[i])) stop('DUPLICATE_ARGUMENT');
    options[argv[i]] = argv[i + 1];
  }
  if (!options['--site-root'] || !SHA40.test(options['--registered-sha'] || '')) stop('EXACT_SITE_ROOT_AND_REGISTERED_SHA_REQUIRED');
  return options;
}

function relativeInsideSite(relative) {
  if (typeof relative !== 'string' || relative.includes('\0') || path.isAbsolute(relative)) stop('INVALID_SITE_RELATIVE_PATH');
  const absolute = path.resolve(siteRoot, relative);
  const canonical = path.relative(siteRoot, absolute).split(path.sep).join('/');
  if (!canonical || canonical === '..' || canonical.startsWith('../') || path.isAbsolute(canonical)) stop('SITE_PATH_ESCAPE');
  return canonical;
}

function readTracked(relative, role) {
  const canonical = relativeInsideSite(relative);
  let current = siteRoot;
  const parts = canonical.split('/');
  for (let i = 0; i < parts.length; i++) {
    current = path.join(current, parts[i]);
    let stat;
    try { stat = fs.lstatSync(current); } catch { stop('INPUT_MISSING', { path: canonical }); }
    if (stat.isSymbolicLink()) stop('INPUT_SYMLINK_REFUSED', { path: canonical });
    if (i < parts.length - 1 ? !stat.isDirectory() : !stat.isFile()) stop('INPUT_NOT_REGULAR_FILE', { path: canonical });
  }
  const bytes = fs.readFileSync(current);
  const digest = sha256(bytes);
  const previous = fingerprints.get(canonical);
  if (previous && previous.sha256 !== digest) stop('INPUT_CHANGED_DURING_READ', { path: canonical });
  const text = bytes.toString('utf8');
  const entry = previous || { path: canonical, bytes: bytes.length, sha256: digest, sha256LfText: sha256(text.replace(/\r\n/g, '\n')), roles: [] };
  if (!entry.roles.includes(role)) entry.roles.push(role);
  fingerprints.set(canonical, entry);
  return text;
}

function parseTracked(relative, role) {
  try { return JSON.parse(readTracked(relative, role)); }
  catch (error) { if (error instanceof CheckError) throw error; stop('INVALID_INPUT_JSON', { path: relativeInsideSite(relative) }); }
}

async function localFetch(input) {
  const url = new URL(String(input), BASE_URI);
  if (url.origin !== 'https://scope.test' || url.username || url.password || url.search || url.hash) stop('NETWORK_OR_UNBOUND_URL_REFUSED');
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { stop('INVALID_FETCH_PATH_ENCODING'); }
  let relative;
  if (pathname.startsWith('/AP------/archive/')) relative = 'archive/' + pathname.slice('/AP------/archive/'.length);
  else if (pathname.startsWith('/AP------/docs/')) relative = 'docs/' + pathname.slice('/AP------/docs/'.length);
  else stop('FETCH_OUTSIDE_CANONICAL_SITE_ROUTE');
  relative = relativeInsideSite(relative);
  if (relative !== MANIFEST_PATH && !allowedFetchPaths?.has(relative)) stop('FETCH_NOT_IN_INPUT_MANIFEST', { path: relative });
  const text = readTracked(relative, 'CANONICAL_LOADER_INPUT');
  if (relative === MANIFEST_PATH) {
    try { observedManifest = JSON.parse(text); } catch { stop('INVALID_INPUT_JSON', { path: relative }); }
    if (!Array.isArray(observedManifest.files)) stop('MANIFEST_FILES_MISSING');
    allowedFetchPaths = new Set(observedManifest.files.map(row => relativeInsideSite(path.posix.join('archive', String(row.path || '')))));
  }
  return { ok: true, status: 200, text: async () => text, json: async () => JSON.parse(text) };
}

function runModule(context, relative, role = 'OFFICIAL_RUNTIME_MODULE') {
  const source = readTracked(relative, role);
  new vm.Script(source, { filename: relative }).runInContext(context, { timeout: 30000 });
}

function validateScope() {
  const targets = SCOPE.targets;
  if (targets.length !== 4 || targets.some((target, i) => target.examNumber !== i + 1 || target.questionCount !== [23, 24, 24, 24][i] || target.allUids.length !== target.questionCount)) stop('EMBEDDED_SCOPE_DENOMINATOR_INVALID');
  const all = targets.flatMap(target => target.allUids);
  if (all.length !== 95 || new Set(all).size !== 95 || all.some(uid => !UID.test(uid))) stop('EMBEDDED_SCOPE_UID_INVALID');
  if (new Set(targets.map(target => target.sourceArchiveFile)).size !== 4) stop('EMBEDDED_SCOPE_SOURCE_INVALID');
}

function validateReleaseReceipt(expectedSHA) {
  const receipt = parseTracked('_archive-release.json', 'SITE_RELEASE_RECEIPT');
  if (receipt.schemaVersion !== 'ARCHIVE_PAGES_RELEASE_V1' || receipt.registeredMainSHA !== expectedSHA || receipt.releaseGate !== 'RELEASE_GATE_PASS') stop('SITE_RECEIPT_SHA_OR_GATE_MISMATCH');
  const digests = ['packageDigest', 'externalDependencyDigest', 'validatorDigest', 'archiveValidationDigest'];
  if (digests.some(field => !SHA64.test(receipt[field] || '')) || !Number.isSafeInteger(receipt.fileCount) || receipt.fileCount < 1 || !Number.isSafeInteger(receipt.totalBytes) || receipt.totalBytes < 0 || receipt.totalBytes >= 1_000_000_000) stop('SITE_RECEIPT_FORMAT_INVALID');
  report.siteReceipt = Object.fromEntries(['schemaVersion', 'registeredMainSHA', 'releaseGate', ...digests, 'fileCount', 'totalBytes'].map(field => [field, receipt[field]]));
  report.snapshotBinding = {
    basis: 'ACTUAL_SITE_RECEIPT_PLUS_OFFICIAL_CANONICAL_INPUT_DIGEST_CHECKS',
    fullPackageDigestRecomputed: false,
    artifactOriginBinding: 'EXTERNAL_PAGES_ARTIFACT_AND_DIAGNOSTICS_REQUIRED',
    successfulCheckMeans: 'ONLY_95_ASSIGNED_UNIT_COMPARISONS_ON_THE_SUPPLIED_SITE_BYTES'
  };
}

async function loadProductionCatalog() {
  const sandbox = {
    crypto: crypto.webcrypto, TextEncoder, TextDecoder, URL,
    console: { log() {}, warn() {}, error() {}, info() {}, debug() {} },
    document: { baseURI: BASE_URI }, fetch: localFetch
  };
  sandbox.window = sandbox;
  const context = vm.createContext(sandbox, { codeGeneration: { strings: false, wasm: false } });
  for (const relative of MODULES) runModule(context, relative);
  if (!context.Archive2UnifiedUnits?.buildIndex || !context.UnitPastExamsCore?.classifyRecord || !context.Archive2Canonical?.loadInputBundle) stop('OFFICIAL_FUNCTION_MISSING');
  runModule(context, 'archive/meta-foundation-runtime.js');
  if (typeof context.applyArchiveMetaFoundationCatalog !== 'function') stop('OFFICIAL_PRODUCTION_LOADER_MISSING');
  let timer;
  const deadline = new Promise((_, reject) => { timer = setTimeout(() => reject(new CheckError('CANONICAL_LOADER_TIMEOUT')), 60000); });
  let data;
  try { data = await Promise.race([context.applyArchiveMetaFoundationCatalog(), deadline]); }
  finally { clearTimeout(timer); }
  if (!Array.isArray(data?.records) || !data.canonicalAuthority || !data.projectionPolicy) stop('RESOLVED_CATALOG_INCOMPLETE');
  report.canonicalInput = {
    resolverVersion: observedManifest.resolverVersion,
    projectionVersion: observedManifest.projectionVersion,
    resolvedIndexVersion: data.indexVersion,
    manifestFileCount: observedManifest.files.length,
    fetchedInputCount: [...fingerprints.values()].filter(entry => entry.roles.includes('CANONICAL_LOADER_INPUT')).length,
    digestValidation: 'OFFICIAL_LOADER_PASSED'
  };
  return { context, data };
}

function compareScope(context, data) {
  const Unified = context.Archive2UnifiedUnits;
  const UnitCore = context.UnitPastExamsCore;
  const expectedByUid = new Map();
  const targets = new Map(SCOPE.targets.map(target => [target.sourceArchiveFile, target]));
  for (const target of targets.values()) target.allUids.forEach((uid, i) => expectedByUid.set(uid, { target, ordinal: i + 1 }));
  const globalUidOccurrences = new Map();
  const targetRecords = [];
  for (const row of data.records) {
    if (expectedByUid.has(row.questionUid)) {
      const occurrences = globalUidOccurrences.get(row.questionUid) || [];
      occurrences.push(row);
      globalUidOccurrences.set(row.questionUid, occurrences);
      if (row.sourceFile !== expectedByUid.get(row.questionUid).target.sourceArchiveFile) issue('ASSIGNED_UID_SOURCE_MISMATCH', { questionUid: row.questionUid });
    }
    if (targets.has(row.sourceFile)) targetRecords.push(row);
  }
  report.counts.catalogRows = targetRecords.length;
  report.counts.catalogUniqueAssignedUids = globalUidOccurrences.size;
  for (const [uid] of expectedByUid) {
    const count = globalUidOccurrences.get(uid)?.length || 0;
    if (count !== 1) issue(count ? 'DUPLICATE_ASSIGNED_UID' : 'MISSING_ASSIGNED_UID', { questionUid: uid, count });
  }
  const catalogIdentity = new Map();
  for (const row of targetRecords) {
    const questionNo = String(row.sourceQuestionNo ?? '');
    if (!/^[1-9]\d{0,4}$/.test(questionNo) || Number(questionNo) > targets.get(row.sourceFile).questionCount) {
      issue('INVALID_CATALOG_QUESTION_NUMBER', { sourceFile: row.sourceFile, questionUid: safeUid(row.questionUid) });
      continue;
    }
    const identity = `${row.sourceFile}#${row.sourceQuestionNo}`;
    const entries = catalogIdentity.get(identity) || [];
    entries.push(row); catalogIdentity.set(identity, entries);
    if (!expectedByUid.has(row.questionUid)) issue('UNEXPECTED_SCOPE_UID', { sourceFile: row.sourceFile, questionUid: safeUid(row.questionUid) });
  }
  for (const [identity, entries] of catalogIdentity) if (entries.length !== 1) issue('DUPLICATE_CATALOG_IDENTITY', { identity, count: entries.length });

  const indexContext = vm.createContext({ window: {} }, { codeGeneration: { strings: false, wasm: false } });
  indexContext.window = indexContext;
  runModule(indexContext, 'archive/question-index.js', 'OFFICIAL_QUESTION_INDEX');
  const allIndexRows = indexContext.questionIndex || indexContext.window.questionIndex;
  if (!Array.isArray(allIndexRows)) stop('QUESTION_INDEX_UNAVAILABLE');
  const indexRows = allIndexRows.filter(row => targets.has(UnitCore.normalizePath(row.sourceFile)));
  report.counts.questionIndexRows = indexRows.length;
  const indexIdentity = new Map();
  for (const row of indexRows) {
    const identity = `${UnitCore.normalizePath(row.sourceFile)}#${UnitCore.getQuestionNo(row)}`;
    const entries = indexIdentity.get(identity) || [];
    entries.push(row); indexIdentity.set(identity, entries);
  }
  for (const [identity, entries] of indexIdentity) if (entries.length !== 1) issue('DUPLICATE_QUESTION_INDEX_IDENTITY', { identity, count: entries.length });

  const unified = Unified.buildIndex(targetRecords, { projectionPolicy: data.projectionPolicy });
  for (const target of targets.values()) {
    const counts = { examNumber: target.examNumber, sourceFile: target.sourceArchiveFile, expected: target.questionCount,
      catalogRows: targetRecords.filter(row => row.sourceFile === target.sourceArchiveFile).length,
      questionIndexRows: indexRows.filter(row => UnitCore.normalizePath(row.sourceFile) === target.sourceArchiveFile).length,
      joined: 0, compared: 0, matched: 0, unplaced: 0, unclassified: 0, mismatched: 0 };
    report.exams.push(counts);
    if (counts.catalogRows !== target.questionCount || counts.questionIndexRows !== target.questionCount) issue('EXAM_ROW_DENOMINATOR_MISMATCH', { examNumber: target.examNumber, catalogRows: counts.catalogRows, questionIndexRows: counts.questionIndexRows, expected: target.questionCount });
    for (let ordinal = 1; ordinal <= target.questionCount; ordinal++) {
      const uid = target.allUids[ordinal - 1];
      const identity = `${target.sourceArchiveFile}#${ordinal}`;
      const result = { examNumber: target.examNumber, sourceOrdinal: ordinal, questionUid: uid, identity, status: 'FAIL' };
      report.results.push(result);
      const records = catalogIdentity.get(identity) || [];
      const indexes = indexIdentity.get(identity) || [];
      if (records.length !== 1 || indexes.length !== 1) { issue('IDENTITY_JOIN_NOT_UNIQUE', { identity, catalogCount: records.length, indexCount: indexes.length }); continue; }
      const record = records[0], indexRow = indexes[0];
      if (record.questionUid !== uid || Number(record.sourceOrdinal) !== ordinal || globalUidOccurrences.get(uid)?.length !== 1) { issue('UID_OR_ORDINAL_JOIN_MISMATCH', { identity, expectedUid: uid, observedUid: safeUid(record.questionUid) }); continue; }
      const indexUid = indexRow.questionUid || indexRow.uid;
      if (indexUid && indexUid !== uid) { issue('QUESTION_INDEX_UID_MISMATCH', { identity, expectedUid: uid, observedUid: safeUid(indexUid) }); continue; }
      report.counts.joined++; counts.joined++;
      const entry = unified.byRecord.get(record);
      if (!entry || entry.grade !== '중1') { issue('UNPLACED_OR_WRONG_GRADE', { identity, questionUid: uid }); report.counts.unplaced++; counts.unplaced++; continue; }
      const profile = Unified.GRADE_PROFILE[indexRow.grade || indexRow.sourceGrade];
      if (profile !== 'm1') { issue('QUESTION_INDEX_PROFILE_MISMATCH', { identity }); continue; }
      const expected = UnitCore.classifyRecord(indexRow, profile);
      if (entry.unclassified || !entry.unitKey || expected.status !== 'classified' || !expected.unitKey) {
        issue('UNIT_UNCLASSIFIED', { identity, actualUnitKey: keyValue(entry.unitKey), expectedUnitKey: keyValue(expected.unitKey), expectedStatus: keyValue(expected.status) });
        report.counts.unclassified++; counts.unclassified++; continue;
      }
      report.counts.compared++; counts.compared++;
      result.actualUnitKey = keyValue(entry.unitKey);
      result.expectedUnitKey = keyValue(expected.unitKey);
      try { assert.equal(entry.unitKey, expected.unitKey, identity); }
      catch {
        const mismatch = { identity, questionUid: uid, actualUnitKey: keyValue(entry.unitKey), expectedUnitKey: keyValue(expected.unitKey) };
        report.mismatches.push(mismatch); issue('UNIT_KEY_MISMATCH', mismatch);
        report.counts.mismatched++; counts.mismatched++; continue;
      }
      result.status = 'PASS'; report.counts.matched++; counts.matched++;
    }
  }
  for (const field of ['catalogRows', 'catalogUniqueAssignedUids', 'questionIndexRows', 'joined', 'compared', 'matched']) {
    if (report.counts[field] !== 95) issue('SCOPE_95_DENOMINATOR_MISMATCH', { field, expected: 95, observed: report.counts[field] });
  }
  report.focusExam1Q3 = report.results.find(row => row.examNumber === 1 && row.sourceOrdinal === 3);
}

async function main() {
  const options = argumentsOf(process.argv.slice(2));
  report.registeredMainSHA = options['--registered-sha'];
  const requestedRoot = path.resolve(options['--site-root']);
  let stat;
  try { stat = fs.lstatSync(requestedRoot); } catch { stop('SITE_ROOT_MISSING'); }
  if (!stat.isDirectory() || stat.isSymbolicLink()) stop('SITE_ROOT_NOT_REGULAR_DIRECTORY');
  siteRoot = fs.realpathSync(requestedRoot);
  report.siteRoot = siteRoot;
  phase = 'EMBEDDED_SCOPE'; validateScope();
  phase = 'RELEASE_RECEIPT'; validateReleaseReceipt(report.registeredMainSHA);
  phase = 'OFFICIAL_PRODUCTION_CATALOG';
  const { context, data } = await loadProductionCatalog();
  phase = 'ASSIGNED_95_UNIT_COMPARISON'; compareScope(context, data);
  report.status = issues.length ? 'FAIL' : 'PASS';
}

main().catch(error => {
  issue(error instanceof CheckError ? error.code : 'OFFICIAL_LOADER_OR_CLASSIFIER_ERROR', {
    phase,
    ...(error instanceof CheckError ? error.details : { errorType: keyValue(error?.name), officialErrorCode: keyValue(error?.code) })
  });
  report.status = 'FAIL';
}).finally(() => {
  report.inputFiles = [...fingerprints.values()].sort((a, b) => a.path.localeCompare(b.path));
  report.helperSha256 = sha256(fs.readFileSync(__filename));
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  process.exitCode = report.status === 'PASS' ? 0 : 1;
});
