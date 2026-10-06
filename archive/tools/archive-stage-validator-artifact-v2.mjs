import { createHash } from 'node:crypto';

export const QUALITY_CONTRACT_V2 = 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';

const META_FIELDS = Object.freeze([
  'problemTypeKey',
  'templateKey',
  'crossConceptKeys',
  'conditionKeys',
  'integrationPattern',
]);

const DIFFICULTY_FIELDS = Object.freeze([
  'difficultyBucket',
  'difficultyConfidence',
  'difficultyBoundaryFlag',
  'legacyLevelCompatibility',
]);

const EXCLUDED_ANSWERS = new Set(['__EXCLUDED__', 'EXCLUDED_CANDIDATE']);
const CIRCLED_PREFIX = /^[\\s]*(?:①|②|③|④|⑤)[\\s]*/;
const CONTROL_ESCAPE = /[\\t\\f\\v\\b]/;

const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object || {}, key);
const array = value => Array.isArray(value) ? value : [];

export function solutionSha256(solution) {
  return createHash('sha256').update(String(solution ?? ''), 'utf8').digest('hex');
}

function rowMap(evidence) {
  return new Map(array(evidence?.rows)
    .map(row => [Number(row?.qid), row])
    .filter(([qid]) => Number.isInteger(qid)));
}

function inspectControlEscapes(question, qid, issues) {
  const values = [
    ['content', question?.content],
    ['solution', question?.solution],
    ['decisiveStep', question?.decisiveStep],
    ...array(question?.choices).map((value, index) => ['choices[' + index + ']', value]),
  ];

  for (const [field, value] of values) {
    if (typeof value === 'string' && CONTROL_ESCAPE.test(value)) {
      issues.push('ARTIFACT_CONTROL_ESCAPE:' + field + ':q' + qid);
    }
  }
}

function validateMeta(question, row, qid, issues) {
  for (const field of META_FIELDS) {
    if (!hasOwn(question, field)) {
      issues.push('ARTIFACT_META_FIELD_REQUIRED:' + field + ':q' + qid);
    }
  }

  if (hasOwn(question, 'crossConceptKeys') && !Array.isArray(question.crossConceptKeys)) {
    issues.push('ARTIFACT_META_ARRAY_REQUIRED:crossConceptKeys:q' + qid);
  }
  if (hasOwn(question, 'conditionKeys') && !Array.isArray(question.conditionKeys)) {
    issues.push('ARTIFACT_META_ARRAY_REQUIRED:conditionKeys:q' + qid);
  }
  if (hasOwn(question, 'integrationPattern') && !nonEmpty(question.integrationPattern)) {
    issues.push('ARTIFACT_META_VALUE_REQUIRED:integrationPattern:q' + qid);
  }

  const debtFields = new Set(array(row?.metaDebtFields).map(String));
  for (const field of ['problemTypeKey', 'templateKey']) {
    if (hasOwn(question, field) && !nonEmpty(question[field])) {
      if (!debtFields.has(field)) {
        issues.push('ARTIFACT_META_DEBT_REQUIRED:' + field + ':q' + qid);
      }
    }
  }
  if (debtFields.size > 0 && !nonEmpty(row?.metaDebtReason)) {
    issues.push('ARTIFACT_META_DEBT_REASON_REQUIRED:q' + qid);
  }
}

function validateDifficulty(question, qid, issues) {
  for (const field of DIFFICULTY_FIELDS) {
    if (!hasOwn(question, field)) {
      issues.push('ARTIFACT_DIFFICULTY_FIELD_REQUIRED:' + field + ':q' + qid);
    }
  }
  if (hasOwn(question, 'difficultyBucket')
      && (!Number.isInteger(question.difficultyBucket)
        || question.difficultyBucket < 1
        || question.difficultyBucket > 5)) {
    issues.push('ARTIFACT_DIFFICULTY_BUCKET_INVALID:q' + qid);
  }
  for (const field of ['difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility']) {
    if (hasOwn(question, field) && !nonEmpty(question[field])) {
      issues.push('ARTIFACT_DIFFICULTY_VALUE_REQUIRED:' + field + ':q' + qid);
    }
  }
}

function validateChoiceStructure(question, qid, issues) {
  const choices = array(question?.choices);
  for (let index = 0; index < choices.length; index += 1) {
    const choice = choices[index];
    if (typeof choice !== 'string' || !choice.trim()) {
      issues.push('ARTIFACT_CHOICE_VALUE_REQUIRED:q' + qid + ':i' + index);
      continue;
    }
    if (CIRCLED_PREFIX.test(choice)) {
      issues.push('ARTIFACT_CHOICE_ENGINE_LABEL_DUPLICATED:q' + qid + ':i' + index);
    }
  }

  if (choices.length > 0) {
    const answer = question?.answer;
    if (!(typeof answer === 'string' || typeof answer === 'number') || String(answer).trim() === '') {
      issues.push('ARTIFACT_ANSWER_REQUIRED_WITH_CHOICES:q' + qid);
    }
  }
}

function validateSmallBoard(question, row, qid, issues) {
  if (!nonEmpty(question?.solution)) {
    issues.push('ARTIFACT_SOLUTION_REQUIRED:q' + qid);
    return;
  }
  if (String(row?.smallBoardContinuityStatus || '').toUpperCase() !== 'PASS') {
    issues.push('ARTIFACT_SMALL_BOARD_CONTINUITY_REQUIRED:q' + qid);
  }
  const expected = solutionSha256(question.solution);
  if (!nonEmpty(row?.solutionSha256)) {
    issues.push('ARTIFACT_SOLUTION_SHA256_REQUIRED:q' + qid);
  } else if (row.solutionSha256 !== expected) {
    issues.push('ARTIFACT_SOLUTION_SHA256_MISMATCH:q' + qid);
  }
}

export function validateArtifactContract({ stage, evidence, questions }) {
  const active = evidence?.qualityContractVersion === QUALITY_CONTRACT_V2;
  if (!active) {
    return {
      validatorLayer: 'ARTIFACT_CONTRACT_V2',
      active: false,
      qualityContractVersion: evidence?.qualityContractVersion || null,
      issues: [],
    };
  }

  const issues = [];
  const normalizedStage = String(stage || '').toUpperCase();
  const rows = rowMap(evidence);

  if (!Array.isArray(questions) || questions.length === 0) {
    issues.push('ARTIFACT_QUESTION_BANK_REQUIRED');
  }

  if (['CREATE', 'R1'].includes(normalizedStage)) {
    if (evidence?.goldenCalibrationReviewed !== true) {
      issues.push('ARTIFACT_GOLDEN_CALIBRATION_REQUIRED');
    }
    if (!Array.isArray(evidence?.goldenCalibrationSet) || evidence.goldenCalibrationSet.length === 0) {
      issues.push('ARTIFACT_GOLDEN_SET_REQUIRED');
    }
  }

  for (const question of array(questions)) {
    const qid = Number(question?.id);
    if (!Number.isInteger(qid)) {
      issues.push('ARTIFACT_QID_INVALID');
      continue;
    }

    validateChoiceStructure(question, qid, issues);
    inspectControlEscapes(question, qid, issues);

    if (EXCLUDED_ANSWERS.has(String(question?.answer || ''))) continue;

    validateMeta(question, rows.get(qid), qid, issues);
    validateDifficulty(question, qid, issues);

    if (['CREATE', 'R1'].includes(normalizedStage)) {
      validateSmallBoard(question, rows.get(qid), qid, issues);
    }
  }

  return {
    validatorLayer: 'ARTIFACT_CONTRACT_V2',
    active: true,
    qualityContractVersion: QUALITY_CONTRACT_V2,
    stage: normalizedStage,
    questionCount: array(questions).length,
    disposition: issues.length ? 'FAIL' : 'PASS',
    issues,
  };
}
