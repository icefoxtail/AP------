import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..', '..');
const evidenceDir = path.join(repoRoot, 'archive', 'data', 'meta-foundation', 'evidence', 'middle-geometry', 'v1');
const batchFiles = [
  'difficulty_blind_batch_01_m3_trig_001_025.json',
  'difficulty_blind_batch_02_m3_trig_026_050.json',
  'difficulty_blind_batch_03_m3_trig_051_075.json',
  'difficulty_blind_batch_04_m3_trig_076_100.json',
  'difficulty_blind_batch_05_m3_trig_101_125.json',
  'difficulty_blind_batch_06_m3_trig_126_150.json',
  'difficulty_blind_batch_07_m3_trig_151_175.json'
];

const manualMismatchUids = new Set([
  'qid_v1_7eeb01ba3f5211af0cd83d88eb9ff18a7182136c0d234f178915aba3f3efaffe',
  'qid_v1_535340b50cb29b21db6d369bcbfd4e81701a42c10196f5c4fe516391cc61fc02',
  'qid_v1_b1a85fa8cbda851713da571650107925da1abbef633266796fcb9085f3fc480c',
  'qid_v1_171c3168d2b05fe8278d13ea71e6c69f5e11be9d8c516c9e1f6c382fdacba166',
  'qid_v1_e4ba2b9da32f044d69365ba770f627de7a5c507022acc721246243608a99f94a',
  'qid_v1_50420e20370de4341a6e1c32103ee9a79317b9c6274011542d5f56fee39d30c5',
  'qid_v1_fdbd516ce3ca19531a267d28aef6270435b38bf63621e30e1400f6f22a4ba1cf',
  'qid_v1_7cab381aa1964afe56c02ca94552f98ab34da430c16bb61d75ac913fd30a5f36',
  'qid_v1_b0e8a002e9d7658f7bb3c7bfb1cf3f3e48c126152ea149652b9f5482d52bf5e0',
  'qid_v1_42a29e56136aa2254522310a07d19cc6052db2efe5d850357b662f201a00dbda',
  'qid_v1_95c2f0d27f0a6015013785cd00d004fba94383bf2d2f2d8aa240eaeec7bb2419',
  'qid_v1_e86a1351bc58f9e590ba4441ac1be35acc83122f1a0f96dd48abf67f7f7816d0',
  'qid_v1_4bd8db027ae3b29e591bb647e4d6f66d46c7c7b41dc15d4ff9cce864047ae6de',
  'qid_v1_020eec100424bc478eabae41c66b091d4bf1c17939e7a07be556532478e2f1b0',
  'qid_v1_b9bb8d4ace10d292ab68efb2acd20162e1d7e08d929994a6cce781790b10e558',
  'qid_v1_3b4595999c22c82e40420fa1d0d09f36072fd9c9c779ef54e115324d30a86c5b'
]);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadQuestionBank(sourceArchiveFile) {
  const sourcePath = path.join(repoRoot, 'archive', 'exams', sourceArchiveFile);
  const window = {};
  vm.runInNewContext(fs.readFileSync(sourcePath, 'utf8'), { window }, { filename: sourcePath });
  return window.questionBank;
}

function audit() {
  const ledger = readJson(path.join(evidenceDir, 'item_level_assignment_928.json'));
  const byUid = new Map(ledger.records.map(record => [record.questionUid, record]));
  const seen = new Set();
  const mismatchesFound = [];
  let sourceContentLoaded = 0;
  let sourceSolutionLoaded = 0;
  let sourceTupleParity = 0;
  for (const file of batchFiles) {
    const batch = readJson(path.join(evidenceDir, file));
    for (const decision of batch.records || []) {
      if (seen.has(decision.questionUid)) throw new Error(`duplicate UID in parity scope: ${decision.questionUid}`);
      seen.add(decision.questionUid);
      const record = byUid.get(decision.questionUid);
      if (!record) throw new Error(`UID absent from ledger: ${decision.questionUid}`);
      const expectedSource = `${record.sourceArchiveFile}#${record.sourceOrdinal}`;
      if (decision.source !== expectedSource) {
        throw new Error(`source tuple mismatch: ${decision.questionUid}: ${decision.source} != ${expectedSource}`);
      }
      sourceTupleParity += 1;
      const question = loadQuestionBank(record.sourceArchiveFile)[record.sourceOrdinal - 1];
      if (!question?.content) throw new Error(`source content missing: ${decision.source}`);
      if (!question?.solution) throw new Error(`source solution missing: ${decision.source}`);
      sourceContentLoaded += 1;
      sourceSolutionLoaded += 1;
      if (manualMismatchUids.has(decision.questionUid)) mismatchesFound.push(decision.questionUid);
    }
  }
  const result = {
    status: sourceTupleParity === 175 && sourceContentLoaded === 175 && sourceSolutionLoaded === 175 && seen.size === 175 && mismatchesFound.length === manualMismatchUids.size ? 'PASS' : 'FAIL',
    denominator: 175,
    sourceTupleParity,
    sourceContentLoaded,
    sourceSolutionLoaded,
    uniqueReviewedUids: seen.size,
    manuallyRejudgedMismatchUids: mismatchesFound.length,
    expectedManuallyRejudgedMismatchUids: manualMismatchUids.size,
    legacyUsed: false
  };
  if (result.status !== 'PASS') throw new Error(JSON.stringify(result));
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) audit();
