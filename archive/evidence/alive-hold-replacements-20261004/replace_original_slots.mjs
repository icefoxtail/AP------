import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const replacementReportPath = path.join(root, 'archive/evidence/alive-hold-replacements-20261004/original-slot-replacements.json');
if (fs.existsSync(replacementReportPath)) throw new Error('ORIGINAL_SLOT_REPLACEMENT_ALREADY_RECORDED');
const cases = [
  { source: 'archive/exams/original/high/h2/2final/19_순천여고_2학기_기말_고2_수학II.js', sourceEvidence: 'archive/evidence/source-intake-math2-20261004/19_순천여고_2학기_기말_고2_수학II.json', candidate: 'archive/exams/similar/high/h2/2final/19_순천여고_2학기_기말_고2_수학II_ALIVE대체.js', qids: [21] },
  { source: 'archive/exams/original/high/h2/2final/21_매산여고_2학기_기말_고2_수학II.js', sourceEvidence: 'archive/evidence/source-intake-math2-20261004/21_매산여고_2학기_기말_고2_수학II.json', candidate: 'archive/exams/similar/high/h2/2final/21_매산여고_2학기_기말_고2_수학II_ALIVE대체.js', qids: [6, 20] },
  { source: 'archive/exams/original/high/h2/2final/21_순천여고_2학기_기말_고2_수학II.js', sourceEvidence: 'archive/evidence/source-intake-math2-20261004/21_순천여고_2학기_기말_고2_수학II.json', candidate: 'archive/exams/similar/high/h2/2final/21_순천여고_2학기_기말_고2_수학II_ALIVE대체.js', qids: [8, 9, 10, 13, 15] },
];
const sha = bytes => `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
const parseWindow = text => { const sandbox = { window: {} }; vm.runInNewContext(text, sandbox, { timeout: 1000 }); return sandbox.window; };
function objectSpans(text) {
  const assignment = text.indexOf('window.questionBank');
  const arrayStart = text.indexOf('[', assignment);
  if (assignment < 0 || arrayStart < 0) throw new Error('QUESTION_BANK_NOT_FOUND');
  const spans = [];
  let objectStart = -1, braces = 0, inString = false, escaped = false;
  for (let i = arrayStart + 1; i < text.length; i += 1) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') { inString = true; continue; }
    if (ch === '{') { if (braces === 0) objectStart = i; braces += 1; continue; }
    if (ch === '}') {
      braces -= 1;
      if (braces === 0) {
        const sandbox = { window: {} };
        const object = vm.runInNewContext(`(${text.slice(objectStart, i + 1)})`, sandbox, { timeout: 1000 });
        spans.push({ start: objectStart, end: i + 1, object });
      }
      continue;
    }
    if (ch === ']' && braces === 0) break;
  }
  return spans;
}

const replacements = [];
for (const item of cases) {
  const sourcePath = path.join(root, item.source), candidatePath = path.join(root, item.candidate);
  const sourceBytes = fs.readFileSync(sourcePath), candidateBytes = fs.readFileSync(candidatePath);
  const sourceText = sourceBytes.toString('utf8'), candidateText = candidateBytes.toString('utf8');
  const sourceWindow = parseWindow(sourceText), candidateWindow = parseWindow(candidateText);
  const title = sourceWindow.examTitle;
  const spans = objectSpans(sourceText);
  const replacementMap = new Map();
  for (const qid of item.qids) {
    const original = spans.find(row => row.object.id === qid)?.object;
    const generated = candidateWindow.questionBank.find(row => row.id === qid);
    if (!original || !generated) throw new Error(`SOURCE_CANDIDATE_QID_MISSING:${item.source}/q${qid}`);
    if (generated.questionType === '객관식' && (generated.choices?.length !== 5 || !['①', '②', '③', '④', '⑤'].includes(generated.answer))) throw new Error(`MCQ_CONTRACT:${item.candidate}/q${qid}`);
    const imageSource = generated.image ? path.join(root, 'archive', generated.image) : null;
    const targetImageRelative = generated.image ? `assets/images/${title}/q${qid}.svg` : null;
    const targetImage = targetImageRelative ? path.join(root, 'archive', targetImageRelative) : null;
    if (imageSource) {
      fs.mkdirSync(path.dirname(targetImage), { recursive: true });
      fs.copyFileSync(imageSource, targetImage);
    }
    const finalQuestion = { ...generated, id: qid, ...(targetImageRelative ? { image: targetImageRelative } : {}) };
    replacementMap.set(qid, { original, finalQuestion, assetPath: targetImageRelative, assetSha256: targetImage ? sha(fs.readFileSync(targetImage)) : null });
    replacements.push({ examId: title, sourcePath: item.source, candidatePath: item.candidate, qid, sourceQuestionSha256: sha(Buffer.from(JSON.stringify(original))), candidateQuestionSha256: sha(Buffer.from(JSON.stringify(generated))), replacementQuestionSha256: sha(Buffer.from(JSON.stringify(finalQuestion))), assetPath: targetImage ? `archive/${targetImageRelative}` : null, assetSha256: targetImage ? sha(fs.readFileSync(targetImage)) : null });
  }
  const edits = spans.filter(row => replacementMap.has(row.object.id)).map(row => ({ start: row.start, end: row.end, text: JSON.stringify(replacementMap.get(row.object.id).finalQuestion) }));
  let nextText = sourceText;
  for (const edit of edits.sort((a, b) => b.start - a.start)) nextText = nextText.slice(0, edit.start) + edit.text + nextText.slice(edit.end);
  const outputWindow = parseWindow(nextText);
  if (outputWindow.examTitle !== title || outputWindow.questionBank.length !== sourceWindow.questionBank.length) throw new Error(`EXAM_PARITY:${item.source}`);
  for (const qid of item.qids) {
    const outputQuestion = outputWindow.questionBank.find(row => row.id === qid);
    if (JSON.stringify(outputQuestion) !== JSON.stringify(replacementMap.get(qid).finalQuestion)) throw new Error(`REPLACEMENT_PARITY:${item.source}/q${qid}`);
  }
  fs.writeFileSync(sourcePath, nextText, 'utf8');
  const evidence = JSON.parse(fs.readFileSync(path.join(root, item.sourceEvidence), 'utf8'));
  const nowBytes = fs.readFileSync(sourcePath);
  replacements.filter(row => row.sourcePath === item.source).forEach(row => { row.sourcePdf = evidence.sourcePdf; row.sourcePdfSha256 = evidence.sourcePdfSha256; row.sourceBeforeJsSha256 = sha(sourceBytes); row.sourceAfterJsSha256 = sha(nowBytes); });
}
const report = { schemaVersion: 'ALIVE_ORIGINAL_SLOT_REPLACEMENT_PROVENANCE_v1', workBatchId: 'alive-hold-replacements-20261004', replacementCount: replacements.length, replacedQuestions: replacements, note: 'The original JS question slots now carry the one generated ALIVE variant each. Historical source transcription and source PDF SHA remain in the linked source-intake evidence. ALIVE v2 final closure remains blocked and is recorded separately.' };
fs.writeFileSync(replacementReportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
process.stdout.write(JSON.stringify({ status: 'REPLACED', count: replacements.length, exams: cases.map(item => item.source) }) + '\n');
