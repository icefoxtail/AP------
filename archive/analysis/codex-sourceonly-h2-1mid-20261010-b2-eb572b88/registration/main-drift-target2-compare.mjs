import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import vm from 'node:vm';

const relative = 'archive/exams/original/high/h2/1mid/24_순천여고_1학기_중간_고2_수학I.js';
const localBytes = fs.readFileSync(relative);
const remoteBytes = execFileSync('git', ['show', `origin/main:${relative}`]);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const load = (bytes, filename) => {
  const box = { window: {} };
  vm.runInNewContext(bytes.toString('utf8'), vm.createContext(box), { filename, timeout: 5000 });
  return box.window.questionBank;
};
const local = load(localBytes, relative);
const remote = load(remoteBytes, `origin/main:${relative}`);
if (!Array.isArray(local) || !Array.isArray(remote) || local.length !== 22 || remote.length !== 22) throw new Error('TARGET2_DENOMINATOR_MISMATCH');
const fields = ['content','question','choices','answer','solution','image','imageSize','solutionImage','solutionImageSize','sourceType','sourceQid','sourceMode','questionUid','standardCourse','standardUnitKey','subUnitKey','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern','rpmL1','rpmL2','rpmL3','rpmL4','rpmSemanticStatus'];
const differences = [];
for (let index = 0; index < local.length; index += 1) {
  const left = local[index], right = remote[index], changed = fields.filter(key => JSON.stringify(left?.[key] ?? null) !== JSON.stringify(right?.[key] ?? null));
  if (changed.length) differences.push({ qid: Number(left?.id), changedFields: changed, studentBodyExact: JSON.stringify([left?.content,left?.question,left?.choices,left?.image??null]) === JSON.stringify([right?.content,right?.question,right?.choices,right?.image??null]), answerExact: JSON.stringify(left?.answer??null) === JSON.stringify(right?.answer??null), solutionExact: JSON.stringify(left?.solution??null) === JSON.stringify(right?.solution??null) });
}
console.log(JSON.stringify({ schemaVersion:'ROOT_TARGET2_REMOTE_MAIN_DRIFT_COMPARE_V1', baseHead: execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(), remoteHead:execFileSync('git',['rev-parse','origin/main'],{encoding:'utf8'}).trim(), relativePath:relative, localRawSha256:sha(localBytes), remoteRawSha256:sha(remoteBytes), localGitBlobSha1:execFileSync('git',['hash-object',relative],{encoding:'utf8'}).trim(), remoteGitBlobSha1:execFileSync('git',['rev-parse',`origin/main:${relative}`],{encoding:'utf8'}).trim(), questionCount:local.length, changedQuestionCount:differences.length, differences },null,2));
