#!/usr/bin/env node

/**
 * Build deterministic school fingerprints from original exam JS only.
 *
 * This is a derived-data builder. It never edits an exam JS, question-index,
 * identity map, or the database. The generated fingerprint is deliberately
 * kept separate from the Mixer runtime until the Phase 4 gate is approved.
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCHIVE_ROOT = path.resolve(HERE, '..');
const ORIGINAL_ROOT = path.join(ARCHIVE_ROOT, 'exams', 'original');
const ALIAS_PATH = path.join(ARCHIVE_ROOT, 'data', 'master_tables', 'school_alias_master.json');
const OUTPUT_PATH = path.join(ARCHIVE_ROOT, 'data', 'school-fingerprints.json');

export const SCHEMA_VERSION = 'school-fingerprint.v1';
export const SAMPLE_POLICY = Object.freeze({
  status: 'candidate_v1_not_operational',
  operator: 'OR',
  minExamCount: 3,
  minQuestionCount: 60,
});

const LEVEL_SCORE = Object.freeze({ 하: 1, 중: 2, 상: 3 });
const SUBJECTIVE_TYPES = new Set(['주관식', '서술형', '논술형', '단답형', '주관식/서술형']);
const TEMPLATE_FIELDS = ['templateId', 'templateKey', 'template', 'problemTemplate'];

function listJsFiles(root) {
  const result = [];
  const walk = dir => {
    for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, name.name);
      if (name.isDirectory()) walk(full);
      else if (name.isFile() && name.name.endsWith('.js')) result.push(full);
    }
  };
  walk(root);
  return result.sort((a, b) => a.localeCompare(b, 'en'));
}

function loadAliasMaster() {
  if (!fs.existsSync(ALIAS_PATH)) return { schemaVersion: 'school-alias-master.v1', aliases: {} };
  const parsed = JSON.parse(fs.readFileSync(ALIAS_PATH, 'utf8'));
  return { ...parsed, aliases: parsed.aliases && typeof parsed.aliases === 'object' ? parsed.aliases : {} };
}

function normalizeName(value) {
  return String(value || '').normalize('NFC').trim().replace(/\s+/g, ' ');
}

function aliasLookup(aliasMaster) {
  const lookup = new Map();
  for (const [canonical, aliases] of Object.entries(aliasMaster.aliases || {})) {
    const canonicalName = normalizeName(canonical);
    if (!canonicalName) continue;
    lookup.set(canonicalName, canonicalName);
    for (const alias of Array.isArray(aliases) ? aliases : []) {
      const source = normalizeName(alias);
      if (source) lookup.set(source, canonicalName);
    }
  }
  return lookup;
}

function parseExamTitle(title, filePath) {
  const fallback = path.basename(filePath, '.js');
  const parts = String(title || fallback).split('_');
  const yearToken = parts[0] || '';
  const yearNumber = /^\d{4}$/.test(yearToken)
    ? Number(yearToken)
    : /^\d{2}$/.test(yearToken) ? 2000 + Number(yearToken) : null;
  const semesterIndex = parts.findIndex(part => /^[12]학기$/.test(part));
  const examIndex = parts.findIndex(part => /^(중간|기말)$/.test(part));
  const gradeIndex = parts.findIndex(part => /^(중|고)\d+$/.test(part));
  const school = normalizeName(parts.slice(1, semesterIndex > 1 ? semesterIndex : 2).join('_'));
  const grade = gradeIndex >= 0 ? parts[gradeIndex] : '';
  const semester = semesterIndex >= 0 ? parts[semesterIndex] : '';
  const examType = examIndex >= 0 ? parts[examIndex] : '';
  return {
    title: String(title || fallback),
    year: yearNumber,
    school,
    grade,
    semester,
    examType,
  };
}

function loadExam(filePath) {
  const window = {};
  const context = {
    window,
    document: {},
    console: { log() {}, warn() {}, error() {} },
  };
  vm.runInNewContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath });
  const questions = Array.isArray(window.questionBank) ? window.questionBank : [];
  return { title: window.examTitle || path.basename(filePath, '.js'), questions };
}

function increment(map, key, label) {
  const normalizedKey = normalizeName(key) || 'UNSPECIFIED';
  const row = map.get(normalizedKey) || { key: normalizedKey, label: normalizeName(label) || normalizedKey, count: 0 };
  row.count += 1;
  map.set(normalizedKey, row);
}

function sortedDistribution(map) {
  return [...map.values()].sort((a, b) => b.count - a.count || a.key.localeCompare(b.key, 'en'));
}

function questionTemplate(question) {
  for (const field of TEMPLATE_FIELDS) {
    if (question && question[field]) return normalizeName(question[field]);
  }
  return 'UNSPECIFIED';
}

function hasImage(question) {
  return Boolean(question && (question.image || question.imageUrl || question.imagePath || question.imageSrc));
}

function metricForQuestions(questions) {
  const unit = new Map();
  const subunit = new Map();
  const concept = new Map();
  const problemType = new Map();
  const template = new Map();
  const difficulty = new Map();
  let subjectiveCount = 0;
  let imageCount = 0;

  questions.forEach(question => {
    increment(unit, question.standardUnitKey, question.standardUnit);
    increment(subunit, question.subUnitKey, question.subUnit);
    increment(concept, question.category || question.originalCategory, question.category || question.originalCategory);
    increment(problemType, question.questionType, question.questionType);
    increment(template, questionTemplate(question), questionTemplate(question));
    increment(difficulty, question.level, question.level);
    if (SUBJECTIVE_TYPES.has(normalizeName(question.questionType))) subjectiveCount += 1;
    if (hasImage(question)) imageCount += 1;
  });

  const lateStart = Math.max(0, Math.ceil(questions.length * 0.8) - 1);
  const lateQuestions = questions.slice(lateStart);
  const lateDistribution = new Map();
  let lateScoreTotal = 0;
  let lateScoredCount = 0;
  lateQuestions.forEach(question => {
    increment(lateDistribution, question.level, question.level);
    const score = LEVEL_SCORE[normalizeName(question.level)];
    if (score) {
      lateScoreTotal += score;
      lateScoredCount += 1;
    }
  });

  return {
    questionCount: questions.length,
    unitDistribution: sortedDistribution(unit),
    subunitDistribution: sortedDistribution(subunit),
    conceptDistribution: sortedDistribution(concept),
    problemTypeDistribution: sortedDistribution(problemType),
    templateDistribution: sortedDistribution(template),
    difficultyDistribution: sortedDistribution(difficulty),
    subjectiveRatio: questions.length ? subjectiveCount / questions.length : 0,
    imageRatio: questions.length ? imageCount / questions.length : 0,
    lateQuestionDifficulty: {
      windowRatio: 0.2,
      questionCount: lateQuestions.length,
      distribution: sortedDistribution(lateDistribution),
      meanScore: lateScoredCount ? lateScoreTotal / lateScoredCount : null,
    },
  };
}

function mergeMetrics(examRows) {
  const allQuestions = examRows.flatMap(row => row.questions);
  return metricForQuestions(allQuestions);
}

function sourceRelative(filePath) {
  return path.relative(path.dirname(ARCHIVE_ROOT), filePath).split(path.sep).join('/');
}

function axisKey(row) {
  return [row.grade || 'UNKNOWN_GRADE', row.semester || 'UNKNOWN_SEMESTER', row.examType || 'UNKNOWN_EXAM', row.standardCourse || 'UNKNOWN_COURSE'].join('|');
}

function buildFingerprint({ files = listJsFiles(ORIGINAL_ROOT), aliasMaster = loadAliasMaster() } = {}) {
  const aliases = aliasLookup(aliasMaster);
  const examRows = [];
  const sourceNames = new Set();
  const canonicalToSources = new Map();
  const parseErrors = [];

  for (const filePath of files) {
    try {
      const loaded = loadExam(filePath);
      const parsed = parseExamTitle(loaded.title, filePath);
      const sourceSchool = parsed.school || 'UNSPECIFIED_SCHOOL';
      const canonicalSchool = aliases.get(sourceSchool) || sourceSchool;
      sourceNames.add(sourceSchool);
      const sourceSet = canonicalToSources.get(canonicalSchool) || new Set();
      sourceSet.add(sourceSchool);
      canonicalToSources.set(canonicalSchool, sourceSet);
      const courses = [...new Set(loaded.questions.map(question => normalizeName(question.standardCourse)).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ko'));
      const standardCourse = courses[0] || 'UNSPECIFIED_COURSE';
      examRows.push({
        sourcePath: sourceRelative(filePath),
        title: loaded.title,
        sourceSchool,
        canonicalSchool,
        year: parsed.year,
        grade: parsed.grade || 'UNSPECIFIED_GRADE',
        semester: parsed.semester || 'UNSPECIFIED_SEMESTER',
        examType: parsed.examType || 'UNSPECIFIED_EXAM',
        standardCourse,
        questions: loaded.questions,
      });
    } catch (error) {
      parseErrors.push({ sourcePath: sourceRelative(filePath), message: error instanceof Error ? error.message : String(error) });
    }
  }

  const schoolMap = new Map();
  for (const exam of examRows) {
    const school = schoolMap.get(exam.canonicalSchool) || {
      schoolKey: exam.canonicalSchool,
      schoolName: exam.canonicalSchool,
      sourceNames: new Set(),
      exams: [],
    };
    school.sourceNames.add(exam.sourceSchool);
    school.exams.push(exam);
    schoolMap.set(exam.canonicalSchool, school);
  }

  const schools = [...schoolMap.values()].sort((a, b) => a.schoolKey.localeCompare(b.schoolKey, 'ko')).map(school => {
    const axisMap = new Map();
    for (const exam of school.exams) {
      const key = axisKey(exam);
      const axis = axisMap.get(key) || {
        axisKey: key,
        grade: exam.grade,
        semester: exam.semester,
        examType: exam.examType,
        standardCourse: exam.standardCourse,
        exams: [],
      };
      axis.exams.push(exam);
      axisMap.set(key, axis);
    }
    const metrics = mergeMetrics(school.exams);
    const exams = school.exams.map(exam => ({
      sourcePath: exam.sourcePath,
      title: exam.title,
      sourceSchool: exam.sourceSchool,
      canonicalSchool: exam.canonicalSchool,
      year: exam.year,
      grade: exam.grade,
      semester: exam.semester,
      examType: exam.examType,
      standardCourse: exam.standardCourse,
      questionCount: exam.questions.length,
    })).sort((a, b) => a.sourcePath.localeCompare(b.sourcePath, 'en'));
    const axes = [...axisMap.values()].sort((a, b) => a.axisKey.localeCompare(b.axisKey, 'en')).map(axis => ({
      axisKey: axis.axisKey,
      grade: axis.grade,
      semester: axis.semester,
      examType: axis.examType,
      standardCourse: axis.standardCourse,
      examCount: axis.exams.length,
      questionCount: axis.exams.reduce((sum, exam) => sum + exam.questions.length, 0),
      yearRange: yearRange(axis.exams.map(exam => exam.year)),
      metrics: mergeMetrics(axis.exams),
      mixerPreset: fingerprintToMixerPreset({
        schoolKey: school.schoolKey,
        schoolName: school.schoolName,
        sourceNames: [...school.sourceNames].sort((a, b) => a.localeCompare(b, 'ko')),
        examCount: axis.exams.length,
        questionCount: axis.exams.reduce((sum, exam) => sum + exam.questions.length, 0),
        yearRange: yearRange(axis.exams.map(exam => exam.year)),
        metrics: mergeMetrics(axis.exams),
        sampleEligible: sampleEligible(axis.exams.length, axis.exams.reduce((sum, exam) => sum + exam.questions.length, 0)),
      }, { axisKey: axis.axisKey }),
    }));
    const examCount = school.exams.length;
    const questionCount = school.exams.reduce((sum, exam) => sum + exam.questions.length, 0);
    return {
      schoolKey: school.schoolKey,
      schoolName: school.schoolName,
      sourceNames: [...school.sourceNames].sort((a, b) => a.localeCompare(b, 'ko')),
      examCount,
      questionCount,
      yearRange: yearRange(school.exams.map(exam => exam.year)),
      sampleEligible: sampleEligible(examCount, questionCount),
      metrics,
      // Keep a school-level preset alongside axis presets. The UI bridge can
      // consume this root preset without reconstructing metric ratios in the
      // runtime; axis presets remain available for curriculum-scoped flows.
      mixerPreset: fingerprintToMixerPreset({
        schoolKey: school.schoolKey,
        schoolName: school.schoolName,
        sourceNames: [...school.sourceNames].sort((a, b) => a.localeCompare(b, 'ko')),
        examCount,
        questionCount,
        yearRange: yearRange(school.exams.map(exam => exam.year)),
        metrics,
        sampleEligible: sampleEligible(examCount, questionCount),
      }),
      axes,
      exams,
    };
  });

  const aliasCollisions = [...canonicalToSources.entries()]
    .filter(([, names]) => names.size > 1)
    .map(([canonical, names]) => ({ canonical, sourceNames: [...names].sort((a, b) => a.localeCompare(b, 'ko')) }))
    .sort((a, b) => a.canonical.localeCompare(b.canonical, 'ko'));
  return {
    schemaVersion: SCHEMA_VERSION,
    source: {
      root: 'archive/exams/original',
      fileCount: examRows.length,
      questionCount: examRows.reduce((sum, exam) => sum + exam.questions.length, 0),
      parseErrorCount: parseErrors.length,
    },
    samplePolicy: SAMPLE_POLICY,
    aliasAudit: {
      aliasMaster: 'archive/data/master_tables/school_alias_master.json',
      sourceSchoolCount: sourceNames.size,
      canonicalSchoolCount: schools.length,
      collisionCount: aliasCollisions.length,
      collisions: aliasCollisions,
      explicitAliasSourceNames: [...sourceNames].filter(name => aliases.has(name)).sort((a, b) => a.localeCompare(b, 'ko')),
      implicitCanonicalSourceNames: [...sourceNames].filter(name => !aliases.has(name)).sort((a, b) => a.localeCompare(b, 'ko')),
    },
    schools,
    parseErrors,
  };
}

function yearRange(values) {
  const years = values.filter(value => Number.isInteger(value)).sort((a, b) => a - b);
  return years.length ? { min: years[0], max: years[years.length - 1] } : { min: null, max: null };
}

function sampleEligible(examCount, questionCount) {
  return examCount >= SAMPLE_POLICY.minExamCount || questionCount >= SAMPLE_POLICY.minQuestionCount;
}

function topRatios(distribution) {
  const total = distribution.reduce((sum, row) => sum + row.count, 0);
  if (!total) return [];
  return distribution.map(row => ({ key: row.key, label: row.label, count: row.count, ratio: row.count / total }));
}

export function fingerprintToMixerPreset(fingerprint, { axisKey: requestedAxisKey = null } = {}) {
  const metrics = fingerprint.metrics || {};
  return {
    presetId: `school:${fingerprint.schoolKey}${requestedAxisKey ? `:${requestedAxisKey}` : ''}`,
    schoolKey: fingerprint.schoolKey,
    schoolName: fingerprint.schoolName,
    sourceScope: 'archive',
    schoolInclude: [fingerprint.schoolName],
    axisKey: requestedAxisKey,
    sample: {
      examCount: fingerprint.examCount,
      questionCount: fingerprint.questionCount,
      eligible: Boolean(fingerprint.sampleEligible),
      policy: SAMPLE_POLICY.status,
    },
    targetDistribution: {
      unit: topRatios(metrics.unitDistribution || []),
      subunit: topRatios(metrics.subunitDistribution || []),
      difficulty: topRatios(metrics.difficultyDistribution || []),
      problemType: topRatios(metrics.problemTypeDistribution || []),
    },
    constraints: {
      schoolInclude: [fingerprint.schoolName],
      sourceIdentityRequired: true,
      canonicalUidRequired: true,
      maxDistributionDelta: 0.10,
    },
  };
}

function ratioMap(distribution) {
  const total = (distribution || []).reduce((sum, row) => sum + Number(row.count || 0), 0);
  return new Map((distribution || []).map(row => [row.key, total ? Number(row.count || 0) / total : 0]));
}

/**
 * Compare a selected set's distributions with the fingerprint target. This
 * helper is intentionally pure so a later Mixer UI can block a preset whose
 * target drifts outside the Phase 4 tolerance without mutating the archive.
 */
export function validatePresetDistribution(preset, metrics, tolerance = 0.10) {
  const dimensions = {
    unit: 'unitDistribution',
    subunit: 'subunitDistribution',
    difficulty: 'difficultyDistribution',
    problemType: 'problemTypeDistribution',
  };
  const actualCount = Number(metrics?.questionCount || 0);
  const effectiveTolerance = actualCount ? Math.max(Number(tolerance), 2 / actualCount) : Number(tolerance);
  const checks = [];
  for (const [name, metricField] of Object.entries(dimensions)) {
    const expected = new Map((preset?.targetDistribution?.[name] || []).map(row => [row.key, Number(row.ratio || 0)]));
    const actual = ratioMap(metrics?.[metricField]);
    const keys = new Set([...expected.keys(), ...actual.keys()]);
    let maxDelta = 0;
    for (const key of keys) maxDelta = Math.max(maxDelta, Math.abs((expected.get(key) || 0) - (actual.get(key) || 0)));
    checks.push({ dimension: name, maxDelta, tolerance: effectiveTolerance, ok: maxDelta <= effectiveTolerance });
  }
  return { ok: checks.every(check => check.ok), checks, tolerance: effectiveTolerance };
}

export function buildSchoolFingerprints(options = {}) {
  return buildFingerprint(options);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const output = buildSchoolFingerprints();
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    status: output.parseErrors.length ? 'BUILT_WITH_PARSE_ERRORS' : 'BUILD_PASS',
    output: path.relative(process.cwd(), OUTPUT_PATH).split(path.sep).join('/'),
    files: output.source.fileCount,
    questions: output.source.questionCount,
    schools: output.schools.length,
    eligibleSchools: output.schools.filter(school => school.sampleEligible).length,
    aliasCollisions: output.aliasAudit.collisionCount,
  }, null, 2));
}
