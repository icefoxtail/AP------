import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
const examFile = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\.tmp\archive\codex-20261007-2sem-mid-jeil-calc1\26_제일고_2학기_중간_고2_미적분I\candidate\26_제일고_2학기_중간_고2_미적분I.js`;
const outputFile = String.raw`C:\Users\USER\.codex\worktrees\archive-exam-import-2026-2mid\AP------\archive\analysis\26_제일고_2학기_중간_고2_미적분I\codex-20261007-2sem-mid-jeil-calc1\evidence\R1-q8-postfreeze-disclosure.json`;
const expectedSha = '5024ab6365b997669b47edfa0985900d8adfef50db7523ef9f6924787585198c';
const bytes = fs.readFileSync(examFile);
const rawSha = crypto.createHash('sha256').update(bytes).digest('hex');
if (rawSha !== expectedSha) throw new Error(`ARTIFACT_SHA_MISMATCH:${rawSha}`);
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(bytes.toString('utf8'), sandbox, { filename: examFile, timeout: 5000 });
const questions = sandbox.window.questionBank || sandbox.window.questions;
if (!Array.isArray(questions)) throw new Error('QUESTION_BANK_REQUIRED');
const q = questions.filter(x => Number(x?.id) === 8);
if (q.length !== 1) throw new Error(`Q8_CARDINALITY:${q.length}`);
const item = q[0];
const disclosure = { schemaVersion: "JS_ARCHIVE_R1_QID_LIMITED_POSTFREEZE_KEYS_V1", qid: 8, sourceArtifactRawSha256: rawSha, keys: Object.keys(item), metaLikeFields: Object.fromEntries(Object.entries(item).filter(([k]) => /meta|difficulty|subunit|standardunit|level|tag|review|category|course|problemtype|template|concept|condition|integration/i.test(k))) };
fs.writeFileSync(outputFile, `${JSON.stringify(disclosure, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ outputFile, qid: 8, keys: disclosure.keys, metaLikeFieldNames: Object.keys(disclosure.metaLikeFields || {}), rawSha, outputSha256: crypto.createHash('sha256').update(fs.readFileSync(outputFile)).digest('hex') }, null, 2));



