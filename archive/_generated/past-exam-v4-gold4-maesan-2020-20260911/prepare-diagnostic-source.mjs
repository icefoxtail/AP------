import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const base = 'archive/_generated/past-exam-v4-gold4-maesan-2020-20260911';
const examId = '20_매산고_2학기_기말_고1_기출';
const candidate = path.join(root, base, '20_매산고_2학기_기말_고1_기출-r3/candidate/20_매산고_2학기_기말_고1_기출.candidate.js');
const sourceRel = `${base}/20_매산고_2학기_기말_고1_기출-r3/source/${examId}.source.js`;
const source = path.join(root, sourceRel);
fs.mkdirSync(path.dirname(source), { recursive: true });
fs.copyFileSync(candidate, source);
const sourceSha256 = `sha256:${crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex')}`;
const documentSha = 'sha256:6c1d97b65a12db7a306e7406264d82bc654da95bd8abe90996c92b3f1100f7dd';
const entries = Array.from({ length: 20 }, (_, index) => {
  const ordinal = index + 1;
  const uid = `${examId}|${ordinal}`;
  return {
    canonicalSourceExamId: examId,
    sourceExamId: examId,
    sourceIdentityKey: documentSha,
    status: 'ACTIVE',
    sourceQuestionOrdinal: ordinal,
    questionUidV2: uid,
    legacyQuestionUid: `${sourceRel}|${examId}|${ordinal}`,
    sourcePath: sourceRel,
    sourceSha256
  };
});
const registryRel = `${base}/source-exam-id-registry.json`;
fs.writeFileSync(path.join(root, registryRel), `${JSON.stringify({ schemaVersion: 'SOURCE_EXAM_ID_REGISTRY_v1', entries }, null, 2)}\n`, 'utf8');
const registryBytes = fs.readFileSync(path.join(root, registryRel));
const registryRefRel = `${base}/source-exam-id-registry.ref.json`;
fs.writeFileSync(path.join(root, registryRefRel), `${JSON.stringify({ path: registryRel, bytes: registryBytes.length, sha256: `sha256:${crypto.createHash('sha256').update(registryBytes).digest('hex')}` }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ sourceRel, sourceSha256, registryRel, registryRefRel }, null, 2));
