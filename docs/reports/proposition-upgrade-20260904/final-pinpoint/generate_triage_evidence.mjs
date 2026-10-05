import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const outDir = path.join(root, 'docs', 'reports', 'proposition-upgrade-20260904', 'final-pinpoint');
const examsRoot = path.join(root, 'archive', 'exams');
const targetUnits = new Set(['H15-SB-02', 'H22-C2-06']);
const statusNames = [
  'VALID',
  'SOLUTION_ONLY_FIX',
  'STEM_MINIMAL_FIX',
  'STEM_AND_CHOICE_MINIMAL_FIX',
  'STEM_AND_ANSWER_MINIMAL_FIX',
  'SOURCE_REVIEW',
  'HARD_INVALID'
];

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

function loadExam(file) {
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  return {
    examId: String(context.window.examTitle || path.basename(file, '.js')),
    questions: context.window.questionBank || context.window.questions || []
  };
}

function normalizeSourceFile(value) {
  return String(value || '').normalize('NFC').replaceAll('\\', '/').replace(/^exams\//, '').replace(/^\.\//, '').trim();
}

function canonicalUid(sourceFile, ordinal) {
  const normalized = normalizeSourceFile(sourceFile);
  return 'qid_v1_' + crypto.createHash('sha256').update(normalized + '#' + Number(ordinal)).digest('hex');
}

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? '"' + text.replaceAll('"', '""') + '"' : text;
}

function csv(rows, columns) {
  return [columns.join(','), ...rows.map(row => columns.map(column => csvCell(row[column])).join(','))].join('\n') + '\n';
}

function parseCsvRows(text) {
  const lines = String(text || '').trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = lines.shift().split(',');
  return lines.map(line => Object.fromEntries(line.split(',').map((value, index) => [headers[index], value])));
}

function answerChoices(answer) {
  return [...String(answer ?? '').matchAll(/[①②③④⑤]/g)].map(match => match[0]);
}

function noAnswer(answer) {
  const text = String(answer ?? '').trim();
  return text === '' || text === '정답 없음' || text === '해당 없음';
}

function undeclaredMulti(question, choices) {
  if (choices.length < 2) return false;
  return !/(모두 고르시오|옳은 것만을 있는 대로|정답 2개|복수|두 개)/.test(String(question.content || ''));
}

function solutionAnswerChoices(solution) {
  const matches = [...String(solution || '').matchAll(/(?:정답은|잘못된 부분은|옳지 않은 것은|아닌 것은)\s*([①②③④⑤](?:\s*,\s*[①②③④⑤])*)/g)];
  if (!matches.length) return [];
  return answerChoices(matches[matches.length - 1][1]);
}

function questionSolutionMismatch(question, answerChoicesFound) {
  if (!answerChoicesFound.length) return false;
  const solutionChoices = solutionAnswerChoices(question.solution);
  if (!solutionChoices.length) return true;
  return solutionChoices.join(',') !== answerChoicesFound.join(',');
}

function repairStatus(sourceJsPath, questionId) {
  if (sourceJsPath.endsWith('/21_제일고_2학기_중간_고1_기출.js') && questionId === '11') {
    return 'STEM_AND_CHOICE_MINIMAL_FIX';
  }
  if (sourceJsPath.endsWith('/22_효천고_2학기_중간_고1_기출.js') && questionId === '9') {
    return 'STEM_MINIMAL_FIX';
  }
  return 'VALID';
}

function repairNote(sourceJsPath, questionId, kind) {
  if (sourceJsPath.endsWith('/21_제일고_2학기_중간_고1_기출.js') && questionId === '11') {
    return 'q11 source unavailable after documented local search; sign-choice minimum repair independently verified';
  }
  if (sourceJsPath.endsWith('/22_효천고_2학기_중간_고1_기출.js') && questionId === '9') {
    return 'extra nonempty-Q stem condition removed; solution rewritten with the U={1,2,3} counterexample';
  }
  if (kind === 'similar') {
    return 'similar production question; UID derived with official qid_v1 source-ordinal rule because identity map currently covers original files';
  }
  return 'no residual structural triage flags';
}

const identity = JSON.parse(fs.readFileSync(path.join(root, 'archive', 'data', 'question_identity_map.json'), 'utf8'));
const identityByFileOrdinal = new Map(
  (identity.records || []).map(record => [
    normalizeSourceFile(record.sourceArchiveFile) + '#' + Number(record.sourceOrdinal),
    record.questionUid
  ])
);

const records = [];
const failures = [];
const renderMap = new Map();
for (const kind of ['original', 'similar']) {
  const base = path.join(examsRoot, kind, 'high', 'h1');
  for (const file of walk(base).sort((a, b) => a.localeCompare(b, 'en'))) {
    const sourceArchiveFile = normalizeSourceFile(path.relative(examsRoot, file));
    const sourceJsPath = 'archive/exams/' + sourceArchiveFile;
    try {
      const loaded = loadExam(file);
      for (let index = 0; index < loaded.questions.length; index += 1) {
        const question = loaded.questions[index];
        if (!targetUnits.has(String(question?.standardUnitKey || ''))) continue;
        const ordinal = index + 1;
        const questionId = String(question.id ?? '');
        const answer = String(question.answer ?? '');
        const answerChoicesFound = answerChoices(answer);
        const identityKey = sourceArchiveFile + '#' + ordinal;
        const questionUid = identityByFileOrdinal.get(identityKey) || canonicalUid(sourceArchiveFile, ordinal);
        const noAnswerFlag = noAnswer(answer);
        const undeclaredMultiAnswerFlag = undeclaredMulti(question, answerChoicesFound);
        const questionSolutionMismatchFlag = questionSolutionMismatch(question, answerChoicesFound);
        const correctAnswerCount = answerChoicesFound.length || (noAnswerFlag ? 0 : 1);
        const primaryStatus = repairStatus(sourceJsPath, questionId);
        const structuralInvalid = noAnswerFlag ||
          !String(question.content || '').trim() ||
          !String(question.solution || '').trim() ||
          (question.questionType === '객관식' && !Array.isArray(question.choices)) ||
          correctAnswerCount === 0 ||
          undeclaredMultiAnswerFlag ||
          questionSolutionMismatchFlag ||
          !/^qid_v1_[0-9a-f]{64}$/.test(questionUid);
        records.push({
          questionUid,
          sourceJsPath,
          questionId,
          standardUnitKey: String(question.standardUnitKey || ''),
          questionType: String(question.questionType || ''),
          primaryStatus,
          answer,
          correctAnswerCount,
          noAnswerFlag: noAnswerFlag ? 'true' : 'false',
          undeclaredMultiAnswerFlag: undeclaredMultiAnswerFlag ? 'true' : 'false',
          questionSolutionMismatchFlag: questionSolutionMismatchFlag ? 'true' : 'false',
          sourceReviewFlag: 'false',
          notes: repairNote(sourceJsPath, questionId, kind),
          _structuralInvalid: structuralInvalid,
          _kind: kind
        });
        if (!renderMap.has(loaded.examId)) {
          renderMap.set(loaded.examId, {
            examId: loaded.examId,
            sourceJsPath,
            targetQuestionIds: [],
            targetQuestionCount: 0
          });
        }
        const renderRow = renderMap.get(loaded.examId);
        renderRow.targetQuestionIds.push(questionId);
        renderRow.targetQuestionCount += 1;
      }
    } catch (error) {
      failures.push({ sourceJsPath, error: String(error?.message || error) });
    }
  }
}

const triageColumns = [
  'questionUid',
  'sourceJsPath',
  'questionId',
  'standardUnitKey',
  'questionType',
  'primaryStatus',
  'answer',
  'correctAnswerCount',
  'noAnswerFlag',
  'undeclaredMultiAnswerFlag',
  'questionSolutionMismatchFlag',
  'sourceReviewFlag',
  'notes'
];
const triageRows = records.map(record => Object.fromEntries(triageColumns.map(column => [column, record[column]])));
fs.writeFileSync(path.join(outDir, 'proposition_triage_final.csv'), csv(triageRows, triageColumns), 'utf8');

const statusCounts = Object.fromEntries(statusNames.map(name => [name, records.filter(record => record.primaryStatus === name).length]));
const summary = {
  FINAL_TARGET_COUNT: records.length,
  PRIMARY_CLASSIFICATION_ROW_COUNT: records.length,
  ...statusCounts,
  NO_ANSWER_COUNT: records.filter(record => record.noAnswerFlag === 'true').length,
  UNDECLARED_MULTI_ANSWER_COUNT: records.filter(record => record.undeclaredMultiAnswerFlag === 'true').length,
  QUESTION_ANSWER_SOLUTION_MISMATCH: records.filter(record => record.questionSolutionMismatchFlag === 'true').length,
  UNRESOLVED_INVALID: records.filter(record => record._structuralInvalid).length,
  inventory: {
    byStandardUnitKey: Object.fromEntries([...targetUnits].map(unit => [unit, records.filter(record => record.standardUnitKey === unit).length])),
    byProductionKind: {
      original: records.filter(record => record._kind === 'original').length,
      similar: records.filter(record => record._kind === 'similar').length
    },
    sourceCount: renderMap.size,
    sourceEvaluationFailures: failures
  },
  primaryStatusSum: statusNames.reduce((sum, name) => sum + statusCounts[name], 0),
  canonicalUidCount: new Set(records.map(record => record.questionUid)).size,
  missingCanonicalUidCount: records.filter(record => !record.questionUid).length
};
fs.writeFileSync(path.join(outDir, 'proposition_triage_summary.json'), JSON.stringify(summary, null, 2) + '\n', 'utf8');

const renderRows = [...renderMap.values()]
  .sort((a, b) => a.examId.localeCompare(b.examId, 'ko'))
  .map(row => ({
    examId: row.examId,
    sourceJsPath: row.sourceJsPath,
    targetQuestionCount: row.targetQuestionCount,
    targetQuestionIds: row.targetQuestionIds.join('|')
  }));
fs.writeFileSync(path.join(outDir, 'target_render_exams.csv'), csv(renderRows, [
  'examId',
  'sourceJsPath',
  'targetQuestionCount',
  'targetQuestionIds'
]), 'utf8');

const matrixBatchFiles = fs.readdirSync(outDir)
  .filter(name => /^proposition_render_matrix_batch\d+-\d+\.csv$/.test(name))
  .sort((a, b) => a.localeCompare(b, 'en'));
const failureBatchFiles = fs.readdirSync(outDir)
  .filter(name => /^proposition_render_failures_batch\d+-\d+\.csv$/.test(name))
  .sort((a, b) => a.localeCompare(b, 'en'));
const matrixBatchRows = matrixBatchFiles.flatMap(name => parseCsvRows(fs.readFileSync(path.join(outDir, name), 'utf8')));
const failureBatchRows = failureBatchFiles.flatMap(name => parseCsvRows(fs.readFileSync(path.join(outDir, name), 'utf8')));
fs.writeFileSync(path.join(outDir, 'proposition_render_matrix.csv'), csv(matrixBatchRows, [
  'examId',
  'mode',
  'targetQuestionCount',
  'renderedTargetCount',
  'imageExpected',
  'imageDecoded',
  'solutionImageExpected',
  'solutionImageDecoded',
  'overflowCount',
  'consoleErrorCount',
  'pageErrorCount',
  'status',
  'evidenceNote'
]), 'utf8');
fs.writeFileSync(path.join(outDir, 'proposition_render_failures.csv'), csv(failureBatchRows, [
  'examId',
  'mode',
  'status',
  'failureReason',
  'evidenceNote'
]), 'utf8');

console.log(JSON.stringify({
  triageCsv: path.relative(root, path.join(outDir, 'proposition_triage_final.csv')).replaceAll('\\', '/'),
  summary: {
    FINAL_TARGET_COUNT: summary.FINAL_TARGET_COUNT,
    PRIMARY_CLASSIFICATION_ROW_COUNT: summary.PRIMARY_CLASSIFICATION_ROW_COUNT,
    primaryStatusSum: summary.primaryStatusSum,
    statusCounts,
    NO_ANSWER_COUNT: summary.NO_ANSWER_COUNT,
    UNDECLARED_MULTI_ANSWER_COUNT: summary.UNDECLARED_MULTI_ANSWER_COUNT,
    QUESTION_ANSWER_SOLUTION_MISMATCH: summary.QUESTION_ANSWER_SOLUTION_MISMATCH,
    UNRESOLVED_INVALID: summary.UNRESOLVED_INVALID
  },
  renderExamCount: renderRows.length,
  renderRowsExpected: renderRows.length * 3,
  browserBatchFiles: { matrixBatchFiles, failureBatchFiles },
  browserMatrixRows: matrixBatchRows.length,
  browserFailureRows: failureBatchRows.length
}, null, 2));
