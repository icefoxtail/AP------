(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.UnitPastExamsCore = api;
    root.High1UnitPastExamsCore = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const COMMON_SCOPE = Object.freeze({
    periods: Object.freeze(['1mid', '1final', '2mid', '2final']),
    targetQuestionsPerPaper: 50,
    hardMaxQuestionsPerPaper: 80
  });

  const HIGH1_UNITS = Object.freeze([
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

  const HIGH2_UNITS = Object.freeze([
    { key: 'H22-A-01', course: '대수', name: '지수와 로그', order: 1 },
    { key: 'H22-A-02', course: '대수', name: '지수함수', order: 2 },
    { key: 'H22-A-03', course: '대수', name: '로그함수', order: 3 },
    { key: 'H22-A-04', course: '대수', name: '삼각함수', order: 4 },
    { key: 'H22-A-05', course: '대수', name: '사인법칙과 코사인법칙', order: 5 },
    { key: 'H22-A-06', course: '대수', name: '등차수열과 등비수열', order: 6 },
    { key: 'H22-A-07', course: '대수', name: '수열의 합', order: 7 },
    { key: 'H22-A-08', course: '대수', name: '수학적 귀납법', order: 8 },
    { key: 'H22-MI1-01', course: '미적분Ⅰ', name: '함수의 극한', order: 1 },
    { key: 'H22-MI1-02', course: '미적분Ⅰ', name: '함수의 연속', order: 2 },
    { key: 'H22-MI1-03', course: '미적분Ⅰ', name: '미분계수', order: 3 },
    { key: 'H22-MI1-04', course: '미적분Ⅰ', name: '도함수', order: 4 },
    { key: 'H22-MI1-05', course: '미적분Ⅰ', name: '접선의 방정식', order: 5 },
    { key: 'H22-MI1-06', course: '미적분Ⅰ', name: '도함수의 활용', order: 6 },
    { key: 'H22-MI1-07', course: '미적분Ⅰ', name: '부정적분', order: 7 },
    { key: 'H22-MI1-08', course: '미적분Ⅰ', name: '정적분', order: 8 },
    { key: 'H22-MI1-09', course: '미적분Ⅰ', name: '정적분의 활용', order: 9 },
    { key: 'H22-PS-01', course: '확률과 통계', name: '순열과 조합', order: 1 },
    { key: 'H22-PS-02', course: '확률과 통계', name: '중복조합과 이항정리', order: 2 },
    { key: 'H22-PS-03', course: '확률과 통계', name: '확률의 뜻과 활용', order: 3 },
    { key: 'H22-PS-04', course: '확률과 통계', name: '조건부확률', order: 4 },
    { key: 'H22-PS-05', course: '확률과 통계', name: '확률분포', order: 5 },
    { key: 'H22-PS-06', course: '확률과 통계', name: '통계적 추정', order: 6 }
  ]);

  const MIDDLE1_UNITS = Object.freeze([
    { key: 'M22-1-01', course: '중1 수학', name: '소인수분해', order: 1 },
    { key: 'M22-1-02', course: '중1 수학', name: '정수와 유리수', order: 2 },
    { key: 'M22-1-03', course: '중1 수학', name: '문자와 식', order: 3 },
    { key: 'M22-1-04', course: '중1 수학', name: '좌표평면과 그래프', order: 4 },
    { key: 'M22-1-05', course: '중1 수학', name: '기본 도형', order: 5 },
    { key: 'M22-1-06', course: '중1 수학', name: '평면도형', order: 6 },
    { key: 'M22-1-07', course: '중1 수학', name: '입체도형', order: 7 },
    { key: 'M22-1-08', course: '중1 수학', name: '자료의 정리와 해석', order: 8 },
    { key: 'M22-1-X1', course: '중1 수학', name: '경우의 수', order: 9 }
  ]);

  const MIDDLE2_UNITS = Object.freeze([
    { key: 'M22-2-01', course: '중2 수학', name: '유리수와 순환소수', order: 1 },
    { key: 'M22-2-02', course: '중2 수학', name: '식의 계산', order: 2 },
    { key: 'M22-2-03', course: '중2 수학', name: '일차부등식', order: 3 },
    { key: 'M22-2-04', course: '중2 수학', name: '연립일차방정식', order: 4 },
    { key: 'M22-2-05', course: '중2 수학', name: '일차함수', order: 5 },
    { key: 'M22-2-06', course: '중2 수학', name: '삼각형과 사각형의 성질', order: 6 },
    { key: 'M22-2-07', course: '중2 수학', name: '도형의 닮음', order: 7 },
    { key: 'M22-2-08', course: '중2 수학', name: '피타고라스 정리', order: 8 },
    { key: 'M22-2-09', course: '중2 수학', name: '경우의 수와 확률', order: 9 }
  ]);

  const MIDDLE3_UNITS = Object.freeze([
    { key: 'M22-3-01', course: '중3 수학', name: '제곱근과 실수', order: 1 },
    { key: 'M22-3-02', course: '중3 수학', name: '다항식의 곱셈과 인수분해', order: 2 },
    { key: 'M22-3-03', course: '중3 수학', name: '이차방정식', order: 3 },
    { key: 'M22-3-04', course: '중3 수학', name: '이차함수와 그래프', order: 4 },
    { key: 'M22-3-05', course: '중3 수학', name: '삼각비', order: 5 },
    { key: 'M22-3-06', course: '중3 수학', name: '원의 성질', order: 6 },
    { key: 'M22-3-07', course: '중3 수학', name: '통계', order: 7 }
  ]);

  const MIDDLE_UNIT_NAME_MAPS = Object.freeze({
    m1: Object.freeze({
      '소인수분해': 'M22-1-01', '정수와 유리수': 'M22-1-02', '문자와 식': 'M22-1-03',
      '좌표평면과 그래프': 'M22-1-04', '좌표와 그래프': 'M22-1-04',
      '기본 도형': 'M22-1-05', '기본도형': 'M22-1-05',
      '다각형': 'M22-1-06', '평면도형': 'M22-1-06', '평면도형의 성질': 'M22-1-06',
      '평면도형과 입체도형': 'M22-1-06', '입체도형': 'M22-1-07', '입체도형의 성질': 'M22-1-07',
      '통계': 'M22-1-08', '자료의 정리와 해석': 'M22-1-08', '경우의 수': 'M22-1-X1'
    }),
    m2: Object.freeze({
      '수와 식': 'M22-2-01', '유리수와 순환소수': 'M22-2-01',
      '식의 계산': 'M22-2-02', '일차부등식': 'M22-2-03',
      '연립방정식': 'M22-2-04', '연립일차방정식': 'M22-2-04',
      '일차함수': 'M22-2-05', '일차함수와 그래프': 'M22-2-05',
      '도형의 성질': 'M22-2-06', '삼각형과 사각형의 성질': 'M22-2-06',
      '도형의 닮음': 'M22-2-07', '피타고라스 정리': 'M22-2-08',
      '경우의 수와 확률': 'M22-2-09', '확률': 'M22-2-09'
    }),
    m3: Object.freeze({
      '실수와 그 계산': 'M22-3-01', '제곱근과 실수': 'M22-3-01',
      '다항식의 곱셈': 'M22-3-02', '다항식의 곱셈과 인수분해': 'M22-3-02', '인수분해': 'M22-3-02',
      '이차방정식': 'M22-3-03', '이차함수와 그래프': 'M22-3-04',
      '삼각비': 'M22-3-05', '원의 성질': 'M22-3-06', '통계': 'M22-3-07',
      '피타고라스 정리': 'M22-3-05'
    })
  });

  const HIGH1_DIRECT_KEY_MAP = Object.freeze({
    'H15-SA-01': 'H22-C-01', 'H15-SA-02': 'H22-C-02', 'H15-SA-03': 'H22-C-03',
    'H15-SA-04': 'H22-C-04', 'H15-SA-05': 'H22-C-05', 'H15-SA-06': 'H22-C-05',
    'H15-SA-07': 'H22-C-06', 'H15-SA-08': 'H22-C-06', 'H15-SA-09': 'H22-C2-01',
    'H15-SA-10': 'H22-C2-02', 'H15-SA-11': 'H22-C2-03', 'H15-SA-12': 'H22-C2-04',
    'H15-SA-13': 'H22-C-05', 'H15-SB-01': 'H22-C2-05', 'H15-SB-02': 'H22-C2-06',
    'H15-SB-03': 'H22-C2-07', 'H15-SB-04': 'H22-C2-08', 'H15-SB-05': 'H22-C2-09',
    'H15-SB-06': 'H22-C-07', 'H15-SB-07': 'H22-C-08', 'H15-SB-08': 'H22-C-08',
    'M3-04': 'H22-C-05'
  });

  const HIGH1_RAW_KEY_MAP = Object.freeze({
    'RAW-수치계산의공식화': 'H22-C-01', 'RAW-다항식의성질': 'H22-C-01',
    'RAW-다항식의변형': 'H22-C-01', 'RAW-다항식추론': 'H22-C-02',
    'RAW-다항식의결정': 'H22-C-02', 'RAW-서술형': 'H22-C-02',
    'RAW-서술형2': 'H22-C-02', 'RAW-서술형3': 'H22-C-05'
  });

  const HIGH2_DIRECT_KEY_MAP = Object.freeze({
    'H15-M1-01': 'H22-A-01', 'H21-M1-01': 'H22-A-01',
    'H15-M1-02': 'H22-A-04', 'H21-M1-02': 'H22-A-04',
    'H15-M1-05': 'H22-A-04', 'H15-M1-06': 'H22-A-04', 'H15-M1-07': 'H22-A-04',
    'H15-M1-08': 'H22-A-06', 'H15-M1-09': 'H22-A-06',
    'H15-M1-10': 'H22-A-07', 'H15-M1-11': 'H22-A-08',
    'H22-C-01': 'H22-A-01', 'H22-C-02': 'H22-A-01', 'H22-C-03': 'H22-A-02',
    'H22-C-04': 'H22-A-01', 'H22-C-05': 'H22-A-01', 'H22-C-06': 'H22-A-03',
    'H22-C-07': 'H22-A-02', 'H22-C-08': 'H22-A-02',
    'H22-C-09': 'H22-A-04', 'H22-C-10': 'H22-A-04', 'H22-C-11': 'H22-A-04',
    'H15-M2-01': 'H22-MI1-01', 'H15-M2-02': 'H22-MI1-02', 'H15-M2-03': 'H22-MI1-03',
    'H15-M2-04': 'H22-MI1-04', 'H15-M2-05': 'H22-MI1-05', 'H15-M2-06': 'H22-MI1-06',
    'H15-M2-07': 'H22-MI1-07', 'H15-M2-08': 'H22-MI1-08', 'H15-M2-09': 'H22-MI1-09',
    'H15-PS-01': 'H22-PS-01', 'H15-PS-02': 'H22-PS-02', 'H15-PS-03': 'H22-PS-03',
    'H15-PS-04': 'H22-PS-04', 'H15-PS-05': 'H22-PS-05', 'H15-PS-06': 'H22-PS-06',
    'H_ST_01_01': 'H22-PS-01', 'H_ST_01_02': 'H22-PS-02', 'H_ST_02_01': 'H22-PS-03',
    'STAT-01': 'H22-PS-01', 'STAT-02': 'H22-PS-01'
  });

  const HIGH2_RAW_KEY_MAP = Object.freeze({
    'RAW-로그': 'H22-A-01', 'RAW-로그와이차방정식': 'H22-A-03',
    'RAW-로그의실생활응용': 'H22-A-03', 'RAW-로그의실생활활용(서술형)': 'H22-A-03',
    'RAW-산술기하평균과로그': 'H22-A-01', 'RAW-삼각함수': 'H22-A-04',
    'RAW-삼각함수그래프의해석': 'H22-A-04', 'RAW-삼각함수사이의관계': 'H22-A-04',
    'RAW-삼각함수의각변환': 'H22-A-04', 'RAW-삼각함수의사분면': 'H22-A-04',
    'RAW-이차방정식과지수': 'H22-A-02', 'RAW-지수': 'H22-A-01',
    'RAW-지수/로그의역함수': 'H22-A-02', 'RAW-지수의대소비교': 'H22-A-01'
  });

  const HIGH1_OVERRIDES = Object.freeze({
    'original/high/h1/1final/22_효천고_1학기_기말_고1_기출.js#12': 'H22-C-06'
  });

  const HIGH2_OVERRIDES = Object.freeze((() => {
    const overrides = {
      'original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js#5': 'H22-A-02',
      'original/high/h2/1final/26_제일고_1학기_기말_고2_대수.js#19': 'H22-A-04'
    };
    const file = 'original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js';
    [1, 2, 9, 10, 11, 13, 15, 21, 22, 23, 24].forEach(id => { overrides[`${file}#${id}`] = 'H22-PS-05'; });
    [3, 4, 5, 6, 7, 8, 12, 14, 16, 17, 18, 19, 20].forEach(id => { overrides[`${file}#${id}`] = 'H22-PS-06'; });
    return overrides;
  })());

  const MIDDLE_OVERRIDES = Object.freeze({
    'original/middle/m2/1mid/21_연향중_1학기_중간_중2_기출.js#20': 'M22-2-02',
    'original/middle/m2/1mid/21_연향중_1학기_중간_중2_기출.js#21': 'M22-2-03',
    'original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js#21': 'M22-2-02',
    'original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js#22': 'M22-2-02',
    'original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js#23': 'M22-2-02',
    'original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js#24': 'M22-2-03',
    'original/middle/m2/1mid/21_풍덕중_1학기_중간_중2_기출.js#23': 'M22-2-02',
    'original/middle/m2/1mid/21_풍덕중_1학기_중간_중2_기출.js#24': 'M22-2-06',
    'original/middle/m2/1mid/24_연향중_1학기_중간_중2_기출.js#21': 'M22-2-02',
    'original/middle/m2/1mid/24_연향중_1학기_중간_중2_기출.js#23': 'M22-2-03',
    'original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js#21': 'M22-2-02',
    'original/middle/m2/1mid/25_왕운중_1학기_중간_중2_기출.js#20': 'M22-2-03',
    'original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#13': 'M22-3-02',
    'original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#14': 'M22-3-02',
    'original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#15': 'M22-3-02',
    'original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#16': 'M22-3-02',
    'original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#17': 'M22-3-02',
    'original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#18': 'M22-3-02',
    'original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#19': 'M22-3-02',
    'original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#20': 'M22-3-02',
    'original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#21': 'M22-3-01',
    'original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#22': 'M22-3-01',
    'original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#23': 'M22-3-02',
    'original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#24': 'M22-3-02'
  });

  const PROFILES = Object.freeze({
    h1: Object.freeze({
      id: 'h1', grade: '고1', gradeLabel: '고1', title: '고1 단원별 기출',
      scope: Object.freeze({ ...COMMON_SCOPE, id: 'h1-through-2final-v2', sourcePrefix: 'original/high/h1/' }),
      courses: Object.freeze(['공통수학1', '공통수학2']), units: HIGH1_UNITS,
      directKeyMap: HIGH1_DIRECT_KEY_MAP, rawKeyMap: HIGH1_RAW_KEY_MAP, overrides: HIGH1_OVERRIDES
    }),
    h2: Object.freeze({
      id: 'h2', grade: '고2', gradeLabel: '고2', title: '고2 단원별 기출',
      scope: Object.freeze({ ...COMMON_SCOPE, id: 'h2-through-2final-v1', sourcePrefix: 'original/high/h2/' }),
      courses: Object.freeze(['대수', '미적분Ⅰ', '확률과 통계']), units: HIGH2_UNITS,
      directKeyMap: HIGH2_DIRECT_KEY_MAP, rawKeyMap: HIGH2_RAW_KEY_MAP, overrides: HIGH2_OVERRIDES
    }),
    m1: Object.freeze({
      id: 'm1', grade: '중1', gradeLabel: '중1', title: '중1 단원별 기출',
      scope: Object.freeze({ ...COMMON_SCOPE, id: 'm1-through-2final-v1', sourcePrefix: 'original/middle/m1/' }),
      courses: Object.freeze(['중1 수학']), units: MIDDLE1_UNITS,
      directKeyMap: Object.freeze({}), rawKeyMap: Object.freeze({}), overrides: MIDDLE_OVERRIDES
    }),
    m2: Object.freeze({
      id: 'm2', grade: '중2', gradeLabel: '중2', title: '중2 단원별 기출',
      scope: Object.freeze({ ...COMMON_SCOPE, id: 'm2-through-2final-v1', sourcePrefix: 'original/middle/m2/' }),
      courses: Object.freeze(['중2 수학']), units: MIDDLE2_UNITS,
      directKeyMap: Object.freeze({}), rawKeyMap: Object.freeze({}), overrides: MIDDLE_OVERRIDES
    }),
    m3: Object.freeze({
      id: 'm3', grade: '중3', gradeLabel: '중3', title: '중3 단원별 기출',
      scope: Object.freeze({ ...COMMON_SCOPE, id: 'm3-through-2final-v1', sourcePrefix: 'original/middle/m3/' }),
      courses: Object.freeze(['중3 수학']), units: MIDDLE3_UNITS,
      directKeyMap: Object.freeze({}), rawKeyMap: Object.freeze({}), overrides: MIDDLE_OVERRIDES
    })
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
    const match = normalizePath(sourceFile).match(/^original\/(?:high\/h\d|middle\/m\d)\/([^/]+)\//);
    return match ? match[1] : '';
  }

  function getProfile(profileOrId) {
    if (profileOrId && typeof profileOrId === 'object' && profileOrId.units) return profileOrId;
    return PROFILES[profileOrId] || PROFILES.h1;
  }

  function isInScope(record, scope = PROFILES.h1.scope) {
    const file = normalizePath(record && (record.sourceFile || record._sourceFile));
    return file.startsWith(scope.sourcePrefix) && scope.periods.includes(getPeriod(file));
  }

  function isHigh2ExcludedKey(sourceKey) {
    return sourceKey.startsWith('H15-CALC-') || sourceKey.startsWith('H22-GE-');
  }

  function classifyRecord(record, profileOrId = 'h1') {
    const profile = getProfile(profileOrId);
    const sourceFile = normalizePath(record && (record.sourceFile || record._sourceFile));
    const questionNo = getQuestionNo(record);
    if (!sourceFile || !questionNo) return { status: 'invalid', reason: '원본 파일 또는 문항 번호 없음' };

    const identity = `${sourceFile}#${questionNo}`;
    const overrideKey = profile.overrides[identity];
    if (overrideKey) return { status: 'classified', unitKey: overrideKey, reason: 'manual-override' };

    const sourceKey = String(record && record.standardUnitKey || '').trim();
    const sourceUnit = String(record && record.standardUnit || '').trim();
    const unitByKey = Object.fromEntries(profile.units.map(unit => [unit.key, unit]));
    if (unitByKey[sourceKey]) return { status: 'classified', unitKey: sourceKey, reason: 'h22-direct' };

    if (profile.id.startsWith('m')) {
      const byName = MIDDLE_UNIT_NAME_MAPS[profile.id] || {};
      const mappedByName = byName[sourceUnit];
      if (mappedByName) return { status: 'classified', unitKey: mappedByName, reason: 'middle-unit-name' };

      const rawText = `${sourceKey} ${sourceUnit}`.replace(/\s+/g, '');
      if (profile.id === 'm2') {
        if (/피타고라스/.test(rawText)) return { status: 'classified', unitKey: 'M22-2-08', reason: 'middle-raw' };
        if (/내심|외심|이등변삼각형|삼각형의분류|삼각형의성립조건|삼각형의합동/.test(rawText)) return { status: 'classified', unitKey: 'M22-2-06', reason: 'middle-raw' };
        if (/연립|미지수가2개/.test(rawText)) return { status: 'classified', unitKey: 'M22-2-04', reason: 'middle-raw' };
        if (/부등식/.test(rawText)) return { status: 'classified', unitKey: 'M22-2-03', reason: 'middle-raw' };
        if (/지수법칙|다항식|동류항|식의대입|바른계산|바르게계산|자릿수|도형의부피|거듭제곱/.test(rawText)) return { status: 'classified', unitKey: 'M22-2-02', reason: 'middle-raw' };
      }
      if (profile.id === 'm3') {
        if (/분모의유리화/.test(rawText)) return { status: 'classified', unitKey: 'M22-3-01', reason: 'middle-raw' };
        if (/곱셈공식|다항식/.test(rawText)) return { status: 'classified', unitKey: 'M22-3-02', reason: 'middle-raw' };
      }
    }

    if (profile.id === 'h2') {
      if (isHigh2ExcludedKey(sourceKey)) return { status: 'ignored', reason: '요청 과목 외 문항' };
      if (identity === 'original/high/h2/1final/25_제일고_1학기_기말_고2_대수c.js#22') {
        return { status: 'ignored', reason: '공통수학 문항' };
      }
    }

    let mapped = profile.directKeyMap[sourceKey] || profile.rawKeyMap[sourceKey] || '';

    if (profile.id === 'h1') {
      if (sourceKey === 'H15-SA-02' && sourceUnit === '방정식과 부등식') mapped = 'H22-C-06';
      if (sourceKey === 'H15-SA-03' && sourceUnit === '복소수') mapped = 'H22-C-04';
      if (sourceKey === 'H15-SA-04' && sourceUnit === '이차방정식') mapped = 'H22-C-05';
      if (sourceKey === 'H15-SA-06' && sourceUnit.includes('여러 가지')) mapped = 'H22-C-06';
      if (sourceKey === 'H15-SB-02' && sourceUnit === '함수') mapped = 'H22-C2-07';
    }

    if (mapped && unitByKey[mapped]) return { status: 'classified', unitKey: mapped, reason: 'legacy-map' };
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
    const periodOrder = { '1mid': 1, '1final': 2, '2mid': 3, '2final': 4 };
    const periodDiff = (periodOrder[getPeriod(a.sourceFile)] || 99) - (periodOrder[getPeriod(b.sourceFile)] || 99);
    if (periodDiff) return periodDiff;
    const yearDiff = getYear(a) - getYear(b);
    if (yearDiff) return yearDiff;
    const fileDiff = compareText(normalizePath(a.sourceFile), normalizePath(b.sourceFile));
    return fileDiff || getQuestionNo(a) - getQuestionNo(b);
  }

  // The archive contains a few legacy values such as "[중]" and values from
  // other level systems ("중1", "고2").  Unit-past-exams deliberately exposes
  // only the three shared difficulty buckets plus an explicit fallback.
  function normalizeDifficulty(value) {
    const normalized = String(value ?? '')
      .trim()
      .replace(/^\[|\]$/g, '')
      .trim();
    return ['하', '중', '상'].includes(normalized) ? normalized : '미분류';
  }

  function getDifficultyBucket(record) {
    const value = record && (record.difficultyBucket || record.normalizedLevel || record.level);
    return normalizeDifficulty(value);
  }

  function getQuestionUid(record) {
    return String(record && (record.questionUid || record.question_uid) || '').trim();
  }

  function getSubUnitParentKey(record) {
    return String(record && (record.subUnitParentKey || record.sub_unit_parent_key || record.standardUnitKey || record.standard_unit_key) || '').trim();
  }

  function getSubUnitKey(record) {
    return String(record && (record.subUnitKey || record.sub_unit_key) || '').trim();
  }

  function getSubUnitLabel(record) {
    return String(record && (record.subUnit || record.sub_unit) || '').trim();
  }

  function getRecordIdentity(record) {
    const uid = getQuestionUid(record);
    if (uid) return uid;
    return `${normalizePath(record && record.sourceFile)}#${record && (record.sourceQuestionNo || getQuestionNo(record))}`;
  }

  function isSubUnitInParentScope(subUnitKey, parentUnitKey) {
    const subUnit = String(subUnitKey || '').trim();
    const parentUnit = String(parentUnitKey || '').trim();
    if (!subUnit) return true;
    if (!parentUnit) return false;
    return subUnit === parentUnit || subUnit.startsWith(`${parentUnit}-`);
  }

  function getDifficultySummary(records) {
    const summary = { 하: 0, 중: 0, 상: 0, 미분류: 0 };
    for (const record of Array.isArray(records) ? records : []) summary[getDifficultyBucket(record)] += 1;
    return summary;
  }

  function getSubUnitOptions(records) {
    const groups = new Map();
    for (const record of Array.isArray(records) ? records : []) {
      const key = getSubUnitKey(record) || '__unclassified__';
      const label = getSubUnitLabel(record) || '미분류 소단원';
      const group = groups.get(key) || { key, label, count: 0, difficulty: { 하: 0, 중: 0, 상: 0, 미분류: 0 } };
      group.count += 1;
      group.difficulty[getDifficultyBucket(record)] += 1;
      groups.set(key, group);
    }
    return [...groups.values()].sort((a, b) => b.count - a.count || compareText(a.label, b.label));
  }

  function filterUnitRecords(records, filters = {}) {
    const source = Array.isArray(records) ? records : [];
    const subUnitKeys = new Set((filters.subUnitKeys || []).map(value => String(value || '').trim()).filter(Boolean));
    const difficultyBuckets = new Set((filters.difficultyBuckets || []).map(normalizeDifficulty));
    return source.filter(record => {
      const subUnitKey = getSubUnitKey(record) || '__unclassified__';
      const difficulty = getDifficultyBucket(record);
      if (subUnitKeys.size && !subUnitKeys.has(subUnitKey)) return false;
      if (difficultyBuckets.size && !difficultyBuckets.has(difficulty)) return false;
      if (filters.includeUnclassified !== true && (subUnitKey === '__unclassified__' || difficulty === '미분류')) return false;
      return true;
    });
  }

  function stableSelectionScore(record, seed) {
    return fnv1a(`${String(seed || 'unitpast-default')}|${getRecordIdentity(record)}`);
  }

  function sortForSelection(records, seed) {
    return [...records].sort((a, b) => {
      const scoreDiff = compareText(stableSelectionScore(a, seed), stableSelectionScore(b, seed));
      return scoreDiff || compareRecords(a, b);
    });
  }

  function dedupeRecords(records) {
    const seen = new Set();
    return (Array.isArray(records) ? records : []).filter(record => {
      const identity = getRecordIdentity(record);
      if (seen.has(identity)) return false;
      seen.add(identity);
      return true;
    });
  }

  function getAdjacentDifficultyBuckets(bucket) {
    const order = ['하', '중', '상'];
    const index = order.indexOf(normalizeDifficulty(bucket));
    if (index < 0) return [];
    return order
      .map((value, valueIndex) => ({ value, distance: Math.abs(valueIndex - index) }))
      .filter(item => item.distance > 0)
      .sort((a, b) => a.distance - b.distance)
      .map(item => item.value);
  }

  function selectionLimit(options = {}) {
    return Math.max(1, Number(options.maxCount || COMMON_SCOPE.hardMaxQuestionsPerPaper));
  }

  function selectRecords(records, options = {}) {
    const candidates = dedupeRecords(filterUnitRecords(records, {
      ...options,
      includeUnclassified: options.includeUnclassified === true
    }));
    const requestedCount = Math.max(0, Number(options.count || 0));
    const limit = selectionLimit(options);
    if (requestedCount > limit) {
      return {
        selected: [], candidates, requestedCount, selectedCount: 0,
        shortage: requestedCount, limit, limitExceeded: true, ok: false
      };
    }
    const selected = sortForSelection(candidates, options.seed).slice(0, requestedCount);
    return {
      selected,
      candidates,
      requestedCount,
      selectedCount: selected.length,
      shortage: Math.max(0, requestedCount - selected.length),
      ok: selected.length === requestedCount
    };
  }

  function selectByBlueprint(records, rows = [], options = {}) {
    const normalizedRows = (Array.isArray(rows) ? rows : []).filter(row => Number(row && row.count) > 0);
    const requestedCount = normalizedRows.reduce((sum, row) => sum + Math.max(0, Number(row.count || 0)), 0);
    const limit = selectionLimit(options);
    const pool = dedupeRecords(filterUnitRecords(records, {
      subUnitKeys: options.subUnitKeys || [],
      difficultyBuckets: options.allowAdjacentDifficulty ? [] : (options.difficultyBuckets || []),
      includeUnclassified: options.includeUnclassified === true
    }));
    if (requestedCount > limit) {
      return {
        selected: [], candidates: pool,
        rows: normalizedRows.map((row, index) => ({
          index,
          subUnitKey: String(row.subUnitKey || '').trim(),
          difficultyBucket: row.difficultyBucket ? normalizeDifficulty(row.difficultyBucket) : '',
          requestedCount: Math.max(0, Number(row.count || 0)), availableCount: 0,
          selectedCount: 0, shortage: Math.max(0, Number(row.count || 0)),
          fallbackDifficultyBuckets: [], relaxedCount: 0, ok: false
        })),
        requestedCount, selectedCount: 0, shortage: requestedCount,
        limit, limitExceeded: true, ok: false
      };
    }
    const used = new Set();
    const selected = [];
    const reports = [];
    normalizedRows.forEach((row, index) => {
      const requestedCount = Math.max(0, Number(row.count || 0));
      const rowSubUnitKeys = row.subUnitKeys || (row.subUnitKey ? [row.subUnitKey] : []);
      const rowDifficultyBuckets = row.difficultyBuckets || (row.difficultyBucket ? [row.difficultyBucket] : []);
      const hasRowDifficulty = rowDifficultyBuckets.length > 0;
      const strictBuckets = hasRowDifficulty ? rowDifficultyBuckets : (options.difficultyBuckets || []);
      const rowCandidates = dedupeRecords(filterUnitRecords(pool, {
        subUnitKeys: rowSubUnitKeys,
        difficultyBuckets: strictBuckets,
        includeUnclassified: options.includeUnclassified === true
      })).filter(record => !used.has(getRecordIdentity(record)));
      let availableCandidates = rowCandidates;
      const fallbackDifficultyBuckets = [];
      if (options.allowAdjacentDifficulty && hasRowDifficulty && rowCandidates.length < requestedCount) {
        const fallbackBuckets = rowDifficultyBuckets.length === 1 ? getAdjacentDifficultyBuckets(rowDifficultyBuckets[0]) : [];
        for (const bucket of fallbackBuckets) {
          if (availableCandidates.length >= requestedCount) break;
          const fallback = dedupeRecords(filterUnitRecords(pool, {
            subUnitKeys: rowSubUnitKeys,
            difficultyBuckets: [bucket],
            includeUnclassified: options.includeUnclassified === true
          })).filter(record => !used.has(getRecordIdentity(record)) && !availableCandidates.some(item => getRecordIdentity(item) === getRecordIdentity(record)));
          if (fallback.length) {
            fallbackDifficultyBuckets.push(bucket);
            availableCandidates = availableCandidates.concat(fallback);
          }
        }
      }
      const picked = sortForSelection(availableCandidates, `${options.seed || 'unitpast-default'}|row-${index}`).slice(0, requestedCount);
      picked.forEach(record => { used.add(getRecordIdentity(record)); selected.push(record); });
      const relaxedCount = picked.filter(record => hasRowDifficulty && !rowDifficultyBuckets.includes(getDifficultyBucket(record))).length;
      reports.push({
        index,
        subUnitKey: String(row.subUnitKey || '').trim(),
        difficultyBucket: row.difficultyBucket ? normalizeDifficulty(row.difficultyBucket) : '',
        requestedCount,
        availableCount: availableCandidates.length,
        selectedCount: picked.length,
        shortage: Math.max(0, requestedCount - picked.length),
        fallbackDifficultyBuckets,
        relaxedCount,
        ok: picked.length === requestedCount
      });
    });
    return {
      selected,
      candidates: pool,
      rows: reports,
      requestedCount,
      selectedCount: selected.length,
      shortage: reports.reduce((sum, row) => sum + row.shortage, 0),
      limit,
      limitExceeded: false,
      ok: reports.every(row => row.ok)
    };
  }

  function normalizeClassifiedRecord(record, unit, profile) {
    const subUnitKey = getSubUnitKey(record);
    const subUnitParentKey = getSubUnitParentKey(record);
    const safeSubUnitKey = isSubUnitInParentScope(subUnitKey, subUnitParentKey) ? subUnitKey : '';
    return {
      ...record,
      sourceFile: normalizePath(record.sourceFile || record._sourceFile),
      sourceQuestionNo: getQuestionNo(record),
      questionUid: getQuestionUid(record),
      subUnitParentKey,
      subUnitKey: safeSubUnitKey,
       subUnit: safeSubUnitKey ? getSubUnitLabel(record) : '',
      difficultyBucket: getDifficultyBucket(record),
      mappedUnitKey: unit.key,
      mappedUnit: unit.name,
      mappedCourse: unit.course,
      mappedGrade: profile.grade
    };
  }

  function splitOversizedGroup(group, max) {
    if (group.length <= max) return [group];
    const chunks = [];
    for (let i = 0; i < group.length; i += max) chunks.push(group.slice(i, i + max));
    return chunks;
  }

  function splitIntoPapers(records, options = {}) {
    const target = Number(options.target || COMMON_SCOPE.targetQuestionsPerPaper);
    const max = Number(options.max || COMMON_SCOPE.hardMaxQuestionsPerPaper);
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
    const flush = () => { if (current.length) papers.push(current); current = []; };
    for (const group of atomicGroups) {
      if (!current.length) { current = [...group]; continue; }
      const combined = current.length + group.length;
      const keepTogether = combined <= max && Math.abs(target - combined) <= Math.abs(target - current.length);
      if (combined <= target || keepTogether) current.push(...group);
      else { flush(); current = [...group]; }
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

  function buildSnapshotKey(unitKey, records, scope, selection = {}) {
    const identity = records.map(getRecordIdentity).join('|');
    const selectionKey = JSON.stringify({
      mode: selection.mode || '',
      subUnitKeys: selection.subUnitKeys || [],
      difficultyBuckets: selection.difficultyBuckets || [],
      difficultyPlan: selection.difficultyPlan || [],
      seed: selection.seed || ''
    });
    return `unitpast_${scope.id}_${unitKey}_${fnv1a(`${scope.id}|${unitKey}|${selectionKey}|${identity}`)}`;
  }

  function buildCatalog(records, options = {}) {
    const profile = getProfile(options.profile || options.profileId || 'h1');
    const scope = options.scope || profile.scope;
    const scanned = (Array.isArray(records) ? records : []).filter(record => isInScope(record, scope));
    const byUnit = Object.fromEntries(profile.units.map(unit => [unit.key, []]));
    const unitByKey = Object.fromEntries(profile.units.map(unit => [unit.key, unit]));
    const review = [];
    const invalid = [];
    const ignored = [];

    for (const record of scanned) {
      const result = classifyRecord(record, profile);
      if (result.status === 'classified') {
        const unit = unitByKey[result.unitKey];
        byUnit[result.unitKey].push(normalizeClassifiedRecord(record, unit, profile));
      } else if (result.status === 'invalid') invalid.push({ ...record, classificationReason: result.reason });
      else if (result.status === 'ignored') ignored.push({ ...record, classificationReason: result.reason });
      else review.push({ ...record, classificationReason: result.reason });
    }

    const units = profile.units.map(unit => {
      const unitRecords = byUnit[unit.key].sort(compareRecords);
      const split = splitIntoPapers(unitRecords, { ...options, target: options.target || scope.targetQuestionsPerPaper, max: options.max || scope.hardMaxQuestionsPerPaper });
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

    const classifiedCount = units.reduce((sum, unit) => sum + unit.count, 0);
    return {
      profile, scope, scannedCount: scanned.length,
      candidateCount: classifiedCount + review.length,
      classifiedCount, review, invalid, ignored, units
    };
  }

  return {
    PROFILES,
    SCOPE: PROFILES.h1.scope,
    UNITS: HIGH1_UNITS,
    UNIT_BY_KEY: Object.freeze(Object.fromEntries(HIGH1_UNITS.map(unit => [unit.key, unit]))),
    DIRECT_KEY_MAP: HIGH1_DIRECT_KEY_MAP,
    RAW_KEY_MAP: HIGH1_RAW_KEY_MAP,
    QUESTION_OVERRIDES: HIGH1_OVERRIDES,
    getProfile,
    normalizePath,
    getQuestionNo,
    getQuestionUid,
    getPeriod,
    isInScope,
    classifyRecord,
    compareRecords,
    normalizeDifficulty,
    getDifficultyBucket,
    getSubUnitKey,
    getSubUnitParentKey,
    getSubUnitLabel,
    isSubUnitInParentScope,
    getRecordIdentity,
    dedupeRecords,
    getDifficultySummary,
    getSubUnitOptions,
    filterUnitRecords,
    selectRecords,
    selectByBlueprint,
    splitIntoPapers,
    buildSnapshotKey,
    buildCatalog
  };
});
