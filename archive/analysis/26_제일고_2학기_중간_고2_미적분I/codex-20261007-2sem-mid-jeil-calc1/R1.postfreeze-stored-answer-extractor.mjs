import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const examPath = process.argv[2];
const raw = fs.readFileSync(examPath, 'utf8');
const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
vm.runInNewContext(raw, context, { timeout: 3000, filename: 'postfreeze-current-final-exam.js' });
const bank = context.window.questionBank;
if (!Array.isArray(bank)) throw new Error('questionBank unavailable');
const expected = Array.from({length: 22}, (_, i) => i + 1);
const rows = bank.filter(q => expected.includes(Number(q?.id))).map(q => ({ qid: Number(q.id), storedAnswer: q.answer }));
if (rows.length !== 22 || rows.some((r, i) => r.qid !== expected[i] || r.storedAnswer === undefined || r.storedAnswer === null || r.storedAnswer === '')) throw new Error('qid coverage/answer field mismatch');
process.stdout.write(JSON.stringify({ artifactRawSha256: crypto.createHash('sha256').update(raw).digest('hex'), qids: expected, rows }, null, 2));

