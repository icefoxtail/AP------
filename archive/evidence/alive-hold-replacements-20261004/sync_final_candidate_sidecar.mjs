import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const sidecarPath = path.join(root, 'archive/evidence/alive-hold-replacements-20261004/alive-validation-sidecars.json');
const sidecar = JSON.parse(fs.readFileSync(sidecarPath, 'utf8'));
const sha = data => `sha256:${crypto.createHash('sha256').update(data).digest('hex')}`;
const candidatePaths = [...new Set(sidecar.questions.map(row => row.candidate.candidatePath))];
for (const candidatePath of candidatePaths) {
  const bytes = fs.readFileSync(path.join(root, candidatePath));
  const window = { window: {} };
  vm.runInNewContext(bytes.toString('utf8'), window, { timeout: 1000 });
  const exam = window.window;
  for (const row of sidecar.questions.filter(item => item.candidate.candidatePath === candidatePath)) {
    const qid = Number(row.questionUid.split('|').at(-1));
    const question = exam.questionBank.find(item => item.id === qid);
    if (!question) throw new Error(`CANDIDATE_QID_MISSING:${candidatePath}/q${qid}`);
    row.candidate.candidateJsSha256 = sha(bytes);
    row.candidate.candidateQuestionSha256 = sha(Buffer.from(JSON.stringify(question)));
    row.candidate.question = question;
    const assetPath = question.image ? path.join(root, 'archive', question.image) : null;
    if (assetPath) row.candidate.assetSha256 = sha(fs.readFileSync(assetPath));
  }
}
fs.writeFileSync(sidecarPath, `${JSON.stringify(sidecar, null, 2)}\n`, 'utf8');
process.stdout.write(JSON.stringify({ status: 'SYNCED', questionCount: sidecar.questions.length }) + '\n');
