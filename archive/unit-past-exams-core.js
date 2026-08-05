(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.High1UnitPastExamsCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SCOPE = Object.freeze({
    id: 'h1-through-2mid-v1',
    sourcePrefix: 'original/high/h1/',
    periods: Object.freeze(['1mid', '1final', '2mid']),
    targetQuestionsPerPaper: 50,
    hardMaxQuestionsPerPaper: 80
  });

  const UNITS = Object.freeze([
    { key: 'H22-C-01', course: '공통수학1', name: '다항식의 연산', order: 1 },
    { key: 'H22-C-02', course: '공통수학1', name: '항등식과 나머지 정리', order: 2 },
    { key: 'H22-C-03', course: '공통수학1', name: '인수분해', order: 3 },
    { key: 'H22-C-04', course: '공통수학1', name: '복소수와 이차방정식', order: 4 },
    { key: 'H22-C-05', course: '공통수학1', name: '이차방정식과 이차함수', order: 5 },
    { key: 'H22-C-06', course: '공통수학1', name: '여러 가지 방정식과 부등식', order: 6 },
    { key: 'H22-C-07', course: '공통수학1', name: '합의 법칙과 곱의 법칙', order: 7 },
    { key: 'H22-C-08', course: '공통수학1', name: '순열과 조합', order: 8 },
    { key: 'H22-C-09', course: '공통수학1', name: '행렬과 그 연산', order: 9 },
    { key: 'H22-C2-01', course: '공통수학2', name: '평면좌표', order: 1 },
    { key: 'H22-C2-02', course: '공통수학2', name: '직선의 방정식', order: 2 },
    { key: 'H22-C2-03', course: '공통수학2', name: '원의 방정식', order: 3 },
    { key: 'H22-C2-04', course: '공통수학2', name: '도형의 이동', order: 4 },
    { key: 'H22-C2-05', course: '공통수학2', name: '집합', order: 5 },
    { key: 'H22-C2-06', course: '공통수학2', name: '명제', order: 6 },
    { key: 'H22-C2-07', course: '공통수학2', name: '함수', order: 7 },
    { key: 'H22-C2-08', course: '공통수학2', name: '유리함수', order: 8 },
    { key: 'H22-C2-09', course: '공통수학2', name: '무리함수', order: 9 }
  ]);

  const UNIT_BY_KEY = Object.freeze(Object.fromEntries(UNITS.map(unit => [unit.key, unit])));

  const DIRECT_KEY_MAP = Object.freeze({
    'H15-SA-01': 'H22-C-01',
    'H15-SA-02': 'H22-C-02',
    'H15-SA-03': 'H22-C-03',
    'H15-SA-04': 'H22-C-04',
    'H15-SA-05': 'H22-C-05',
    'H15-SA-06': 'H22-C-05',
    'H15-SA-07': 'H22-C-06',
    'H15-SA-08': 'H22-C-06',
    'H15-SA-09': 'H22-C2-01',
    'H15-SA-10': 'H22-C2-02',
    'H15-SA-11': 'H22-C2-03',
    'H15-SA-12': 'H22-C2-04',
    'H15-SA-13': 'H22-C-05',
    'H15-SB-01': 'H22-C2-05',
    'H15-SB-02': 'H22-C2-06',
    'H15-SB-03': 'H22-C2-07',
    'H15-SB-04': 'H22-C2-08',
    'H15-SB-05': 'H22-C2-09',
    'H15-SB-06': 'H22-C-07',
    'H15-SB-07': 'H22-C-08',
    'H15-SB-08': 'H22-C-08',
    'M3-04': 'H22-C-05'
  });

  const RAW_KEY_MAP = Object.freeze({
    'RAW-수치계산의공식화': 'H22-C-01',
    'RAW-다항식의성질': 'H22-C-01',
    'RAW-다항식의변형': 'H22-C-01',
    'RAW-다항식추론': 'H22-C-02',
    'RAW-다항식의결정': 'H22-C-02',
    'RAW-서술형': 'H22-C-02',
    'RAW-서술형2': 'H22-C-02',
    'RAW-서술형3': 'H22-C-05'
  });

  const QUESTION_OVERRIDES = Object.freeze({
    'original/high/h1/1final/22_효천고_1학기_기말_고1_기출.js#12': 'H22-C-06'
  });

  function normalizePath(value) {
    return String(value || '').replace(/\\/g, '/').replace(/^exams\//, '');
  }

  function getQuestionNo(record) {
    const direct = Number(record && (record.id || record._sourceQuestionNo || record.source_question_no));
    if (Number.isInteger(direct) && direct > 0) return direct;
    const match = String(record && (record.qKey || record._qKey) || '').match(/\.js_(\d+)$/);
    return match ? Number(match[1]) : 0;
  }

  function getPeriod(sourceFile) {
    const match = normalizePath(sourceFile).match(/^original\/high\/h1\/([^/]+)\//);
    return match ? match[1] : '';
  }

  function isInScope(record, scope = SCOPE) {
    const file = normalizePath(record && (record.sourceFile || record._sourceFile));
    return file.startsWith(scope.sourcePrefix) && scope.periods.includes(getPeriod(file));
  }

  function classifyRecord(record) {
    const sourceFile = normalizePath(record && (record.sourceFile || record._sourceFile));
    const questionNo = getQuestionNo(record);
    if (!sourceFile || !questionNo) return { status: 'invalid', reason: '원본 파일 또는 문항 번호 없음' };

    const overrideKey = QUESTION_OVERRIDES[`${sourceFile}#${questionNo}`];
    if (overrideKey) return { status: 'classified', unitKey: overrideKey, reason: 'manual-override' };

    const sourceKey = String(record && record.standardUnitKey || '').trim();
    const sourceUnit = String(record && record.standardUnit || '').trim();
    if (UNIT_BY_KEY[sourceKey]) return { status: 'classified', unitKey: sourceKey, reason: 'h22-direct' };

    let mapped = DIRECT_KEY_MAP[sourceKey] || RAW_KEY_MAP[sourceKey] || '';

    // 과거 데이터 중 키보다 단원명이 더 구체적인 오기록을 바로잡는다.
    if (sourceKey === 'H15-SA-02' && sourceUnit === '방정식과 부등식') mapped = 'H22-C-06';
    if (sourceKey === 'H15-SA-03' && sourceUnit === '복소수') mapped = 'H22-C-04';
    if (sourceKey === 'H15-SA-04' && sourceUnit === '이차방정식') mapped = 'H22-C-05';
    if (sourceKey === 'H15-SA-06' && sourceUnit.includes('여러 가지')) mapped = 'H22-C-06';
    if (sourceKey === 'H15-SB-02' && sourceUnit === '함수') mapped = 'H22-C2-07';

    if (mapped && UNIT_BY_KEY[mapped]) return { status: 'classified', unitKey: mapped, reason: 'legacy-map' };
    return { status: 'review', reason: sourceKey ? `미지원 단원 키: ${sourceKey}` : '단원 키 없음' };
  }

  function compareText(a, b) {
    const left = String(a || '');
    const right = String(b || '');
    return left < right ? -1 : left > right ? 1 : 0;
  }

  function getYear(record) {
    const file = normalizePath(record && (record.sourceFile || record._sourceFile));
    const match = file.split('/').pop().match(/^(\d{2,4})_/);
    if (!match) return 9999;
    const n = Number(match[1]);
    return n < 100 ? 2000 + n : n;
  }

  function compareRecords(a, b) {
    const periodOrder = { '1mid': 1, '1final': 2, '2mid': 3 };
    const periodDiff = (periodOrder[getPeriod(a.sourceFile)] || 99) - (periodOrder[getPeriod(b.sourceFile)] || 99);
    if (periodDiff) return periodDiff;
    const yearDiff = getYear(a) - getYear(b);
    if (yearDiff) return yearDiff;
    const fileDiff = compareText(normalizePath(a.sourceFile), normalizePath(b.sourceFile));
    return fileDiff || getQuestionNo(a) - getQuestionNo(b);
  }

  function normalizeClassifiedRecord(record, unitKey) {
    const unit = UNIT_BY_KEY[unitKey];
    return {
      ...record,
      sourceFile: normalizePath(record.sourceFile || record._sourceFile),
      sourceQuestionNo: getQuestionNo(record),
      mappedUnitKey: unitKey,
      mappedUnit: unit.name,
      mappedCourse: unit.course
    };
  }

  function splitOversizedGroup(group, max) {
    if (group.length <= max) return [group];
    const chunks = [];
    for (let i = 0; i < group.length; i += max) chunks.push(group.slice(i, i + max));
    return chunks;
  }

  function splitIntoPapers(records, options = {}) {
    const target = Number(options.target || SCOPE.targetQuestionsPerPaper);
    const max = Number(options.max || SCOPE.hardMaxQuestionsPerPaper);
    if (!(target > 0 && max >= target)) throw new Error('invalid paper split limits');

    const sorted = [...records].sort(compareRecords);
    const grouped = [];
    for (const record of sorted) {
      const file = normalizePath(record.sourceFile);
      const last = grouped[grouped.length - 1];
      if (last && last[0].sourceFile === file) last.push(record);
      else grouped.push([record]);
    }

    const atomicGroups = grouped.flatMap(group => splitOversizedGroup(group, max));
    const papers = [];
    let current = [];
    const flush = () => {
      if (current.length) papers.push(current);
      current = [];
    };

    for (const group of atomicGroups) {
      if (!current.length) {
        current = [...group];
        continue;
      }
      const combined = current.length + group.length;
      const keepTogether = combined <= max && Math.abs(target - combined) <= Math.abs(target - current.length);
      if (combined <= target || keepTogether) current.push(...group);
      else {
        flush();
        current = [...group];
      }
    }
    flush();
    return papers;
  }

  function fnv1a(text) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  function buildSnapshotKey(unitKey, records, scope = SCOPE) {
    const identity = records.map(record => `${normalizePath(record.sourceFile)}#${record.sourceQuestionNo || getQuestionNo(record)}`).join('|');
    return `unitpast_${scope.id}_${unitKey}_${fnv1a(`${scope.id}|${unitKey}|${identity}`)}`;
  }

  function buildCatalog(records, options = {}) {
    const scope = options.scope || SCOPE;
    const candidates = (Array.isArray(records) ? records : []).filter(record => isInScope(record, scope));
    const byUnit = Object.fromEntries(UNITS.map(unit => [unit.key, []]));
    const review = [];
    const invalid = [];

    for (const record of candidates) {
      const result = classifyRecord(record);
      if (result.status === 'classified') byUnit[result.unitKey].push(normalizeClassifiedRecord(record, result.unitKey));
      else if (result.status === 'invalid') invalid.push({ ...record, classificationReason: result.reason });
      else review.push({ ...record, classificationReason: result.reason });
    }

    const units = UNITS.map(unit => {
      const unitRecords = byUnit[unit.key].sort(compareRecords);
      const split = splitIntoPapers(unitRecords, options);
      const papers = split.map((paperRecords, index) => ({
        index: index + 1,
        title: split.length === 1 ? unit.name : `${unit.name} · 문제지 ${index + 1}`,
        count: paperRecords.length,
        sourceCount: new Set(paperRecords.map(record => record.sourceFile)).size,
        records: paperRecords,
        snapshotKey: buildSnapshotKey(unit.key, paperRecords, scope)
      }));
      return { ...unit, count: unitRecords.length, records: unitRecords, papers };
    });

    return {
      scope,
      candidateCount: candidates.length,
      classifiedCount: units.reduce((sum, unit) => sum + unit.count, 0),
      review,
      invalid,
      units
    };
  }

  return {
    SCOPE,
    UNITS,
    UNIT_BY_KEY,
    DIRECT_KEY_MAP,
    RAW_KEY_MAP,
    QUESTION_OVERRIDES,
    normalizePath,
    getQuestionNo,
    getPeriod,
    isInScope,
    classifyRecord,
    compareRecords,
    splitIntoPapers,
    buildSnapshotKey,
    buildCatalog
  };
});
