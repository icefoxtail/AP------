(function (root, factory) {
  const archive2Core =
    typeof module === 'object' && module.exports
      ? require('./archive2-core.js')
      : root && root.Archive2Core;
  const middleToc =
    typeof module === 'object' && module.exports
      ? require('./rpm-middle-toc.js')
      : root && root.ArchiveRpmMiddleToc;
  const api = factory(archive2Core, middleToc);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.UnitPastExamsCore = api;
    root.High1UnitPastExamsCore = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (archive2Core, middleToc) {
  'use strict';

  if (!archive2Core || !Array.isArray(archive2Core.HIGH_SEMANTIC_SUBJECTS)) {
    throw new Error('Archive2Core high-semantic subject registry is required.');
  }
  if (!middleToc || typeof middleToc.resolveRecord !== 'function') {
    throw new Error('ArchiveRpmMiddleToc current middle-school parent authority is required.');
  }

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

  const HIGH_SEMANTIC_UNITS = Object.freeze([
    { key: 'H22-A-01', course: '대수', name: '지수와 로그', order: 1 },
    { key: 'H22-A-02', course: '대수', name: '지수함수', order: 2 },
    { key: 'H22-A-03', course: '대수', name: '로그함수', order: 3 },
    { key: 'H22-A-04', course: '대수', name: '삼각함수', order: 4 },
    { key: 'H22-A-05', course: '대수', name: '사인법칙과 코사인법칙', order: 5 },
    { key: 'H22-A-06', course: '대수', name: '등차수열과 등비수열', order: 6 },
    { key: 'H22-A-07', course: '대수', name: '수열의 합', order: 7 },
    { key: 'H22-A-08', course: '대수', name: '수학적 귀납법', order: 8 },
    { key: 'H22-M1-01', course: '미적분Ⅰ', name: '함수의 극한', order: 1 },
    { key: 'H22-M1-02', course: '미적분Ⅰ', name: '함수의 연속', order: 2 },
    { key: 'H22-M1-03', course: '미적분Ⅰ', name: '미분계수', order: 3 },
    { key: 'H22-M1-04', course: '미적분Ⅰ', name: '도함수', order: 4 },
    { key: 'H22-M1-05', course: '미적분Ⅰ', name: '도함수의 활용', order: 5 },
    { key: 'H22-M1-06', course: '미적분Ⅰ', name: '부정적분', order: 6 },
    { key: 'H22-M1-07', course: '미적분Ⅰ', name: '정적분', order: 7 },
    { key: 'H22-M1-08', course: '미적분Ⅰ', name: '정적분의 활용', order: 8 },
    { key: 'H22-PS-01', course: '확률과 통계', name: '순열과 조합', order: 1 },
    { key: 'H22-PS-02', course: '확률과 통계', name: '이항정리', order: 2 },
    { key: 'H22-PS-03', course: '확률과 통계', name: '확률의 뜻과 활용', order: 3 },
    { key: 'H22-PS-04', course: '확률과 통계', name: '조건부확률', order: 4 },
    { key: 'H22-PS-05', course: '확률과 통계', name: '확률분포', order: 5 },
    { key: 'H22-PS-06', course: '확률과 통계', name: '통계적 추정', order: 6 },
    { key: 'H22-M2-01', course: '미적분Ⅱ', name: '수열의 극한', order: 1 },
    { key: 'H22-M2-02', course: '미적분Ⅱ', name: '급수', order: 2 },
    { key: 'H22-M2-03', course: '미적분Ⅱ', name: '지수함수와 로그함수의 미분', order: 3 },
    { key: 'H22-M2-04', course: '미적분Ⅱ', name: '삼각함수의 미분', order: 4 },
    { key: 'H22-M2-05', course: '미적분Ⅱ', name: '여러 가지 미분법', order: 5 },
    { key: 'H22-M2-06', course: '미적분Ⅱ', name: '도함수의 활용', order: 6 },
    { key: 'H22-M2-07', course: '미적분Ⅱ', name: '여러 가지 적분법', order: 7 },
    { key: 'H22-M2-08', course: '미적분Ⅱ', name: '정적분의 활용', order: 8 },
    { key: 'H22-GE-01', course: '기하', name: '이차곡선', order: 1 },
    { key: 'H22-GE-02', course: '기하', name: '이차곡선의 접선', order: 2 },
    { key: 'H22-GE-03', course: '기하', name: '공간도형', order: 3 },
    { key: 'H22-GE-04', course: '기하', name: '공간좌표', order: 4 },
    { key: 'H22-GE-05', course: '기하', name: '벡터의 연산', order: 5 },
    { key: 'H22-GE-06', course: '기하', name: '벡터의 성분', order: 6 },
    { key: 'H22-GE-07', course: '기하', name: '벡터의 내적', order: 7 },
    { key: 'H22-GE-08', course: '기하', name: '도형의 방정식', order: 8 }
  ]);
  const HIGH2_UNITS = HIGH_SEMANTIC_UNITS;

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
    'H15-M1-01': 'H22-A-01', 'H15-M1-02': 'H22-A-01',
    'H15-M1-03': 'H22-A-02', 'H15-M1-04': 'H22-A-03',
    'H21-M1-01': 'H22-A-01', 'H21-M1-02': 'H22-A-04',
    'H15-M1-05': 'H22-A-04', 'H15-M1-06': 'H22-A-04', 'H15-M1-07': 'H22-A-04',
    'H15-M1-08': 'H22-A-06', 'H15-M1-09': 'H22-A-06',
    'H15-M1-10': 'H22-A-07', 'H15-M1-11': 'H22-A-08',
    'H22-C-01': 'H22-A-01', 'H22-C-02': 'H22-A-01', 'H22-C-03': 'H22-A-02',
    'H22-C-04': 'H22-A-01', 'H22-C-05': 'H22-A-01', 'H22-C-06': 'H22-A-03',
    'H22-C-07': 'H22-A-02', 'H22-C-08': 'H22-A-02',
    'H22-C-09': 'H22-A-04', 'H22-C-10': 'H22-A-04', 'H22-C-11': 'H22-A-04',
    'H15-M2-01': 'H22-M1-01', 'H15-M2-02': 'H22-M1-02', 'H15-M2-03': 'H22-M1-03',
    'H15-M2-04': 'H22-M1-04', 'H15-M2-05': 'H22-M1-05', 'H15-M2-06': 'H22-M1-05',
    'H15-M2-07': 'H22-M1-06', 'H15-M2-08': 'H22-M1-07', 'H15-M2-09': 'H22-M1-08',
    'H22-MI1-01': 'H22-M1-01', 'H22-MI1-02': 'H22-M1-02', 'H22-MI1-03': 'H22-M1-03',
    'H22-MI1-04': 'H22-M1-04', 'H22-MI1-05': 'H22-M1-05', 'H22-MI1-06': 'H22-M1-05',
    'H22-MI1-07': 'H22-M1-06', 'H22-MI1-08': 'H22-M1-07', 'H22-MI1-09': 'H22-M1-08',
    'H15-CALC-01': 'H22-M2-01', 'H15-CALC-02': 'H22-M2-02', 'H15-CALC-03': 'H22-M2-03',
    'H15-CALC-04': 'H22-M2-04', 'H15-CALC-05': 'H22-M2-05', 'H15-CALC-06': 'H22-M2-06',
    'H15-CALC-07': 'H22-M2-07', 'H15-CALC-08': 'H22-M2-08',
    // 2015 기하와 벡터 단원 코드(archive2-unified-units.js HIGH_SEMANTIC_KEYS와 같은 대응). 06·07(성분·내적)은 2022 단원 둘에 걸쳐 유형 힌트에 맡긴다.
    'H15-GV-01': 'H22-GE-01', 'H15-GV-02': 'H22-GE-01', 'H15-GV-03': 'H22-GE-01',
    'H15-GV-04': 'H22-GE-02', 'H15-GV-05': 'H22-GE-05', 'H15-GV-08': 'H22-GE-03', 'H15-GV-09': 'H22-GE-04',
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

  const HIGH_SEMANTIC_SCOPE = Object.freeze({ ...COMMON_SCOPE, id: 'high-semantic-through-2final-v1', sourcePrefix: 'original/high/h2/', sourcePrefixes: Object.freeze(['original/high/h2/', 'original/high/h3/']) });
  const HIGH_SEMANTIC_PROFILE_DATA = Object.freeze({
    catalogId: 'high-semantic',
    scope: HIGH_SEMANTIC_SCOPE,
    courses: Object.freeze(archive2Core.highSemanticSubjectOptions().map(item => item.label)),
    units: HIGH_SEMANTIC_UNITS,
    directKeyMap: HIGH2_DIRECT_KEY_MAP,
    rawKeyMap: HIGH2_RAW_KEY_MAP,
    overrides: HIGH2_OVERRIDES
  });
  const LEGACY_HIGH_UNIT_ALIASES = Object.freeze({
    'H22-MI1-01': 'H22-M1-01',
    'H22-MI1-02': 'H22-M1-02',
    'H22-MI1-03': 'H22-M1-03',
    'H22-MI1-04': 'H22-M1-04',
    'H22-MI1-05': 'H22-M1-05',
    'H22-MI1-06': 'H22-M1-05',
    'H22-MI1-07': 'H22-M1-06',
    'H22-MI1-08': 'H22-M1-07',
    'H22-MI1-09': 'H22-M1-08'
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
      ...HIGH_SEMANTIC_PROFILE_DATA
    }),
    h3: Object.freeze({
      id: 'h3', grade: '고3', gradeLabel: '고3', title: '고3 단원별 기출',
      ...HIGH_SEMANTIC_PROFILE_DATA
    }),
    m1: Object.freeze({
      id: 'm1', grade: '중1', gradeLabel: '중1', title: '중1 단원별 기출',
      scope: Object.freeze({ ...COMMON_SCOPE, id: 'm1-through-2final-v1', sourcePrefix: 'original/middle/m1/' }),
      courses: Object.freeze(['중1 수학']), units: middleToc ? Object.freeze(middleToc.units('중1')) : MIDDLE1_UNITS,
      legacyUnits: MIDDLE1_UNITS,
      directKeyMap: Object.freeze({}), rawKeyMap: Object.freeze({}), overrides: MIDDLE_OVERRIDES
    }),
    m2: Object.freeze({
      id: 'm2', grade: '중2', gradeLabel: '중2', title: '중2 단원별 기출',
      scope: Object.freeze({ ...COMMON_SCOPE, id: 'm2-through-2final-v1', sourcePrefix: 'original/middle/m2/' }),
      courses: Object.freeze(['중2 수학']), units: middleToc ? Object.freeze(middleToc.units('중2')) : MIDDLE2_UNITS,
      legacyUnits: MIDDLE2_UNITS,
      directKeyMap: Object.freeze({}), rawKeyMap: Object.freeze({}), overrides: MIDDLE_OVERRIDES
    }),
    m3: Object.freeze({
      id: 'm3', grade: '중3', gradeLabel: '중3', title: '중3 단원별 기출',
      scope: Object.freeze({ ...COMMON_SCOPE, id: 'm3-through-2final-v1', sourcePrefix: 'original/middle/m3/' }),
      courses: Object.freeze(['중3 수학']), units: middleToc ? Object.freeze(middleToc.units('중3')) : MIDDLE3_UNITS,
      legacyUnits: MIDDLE3_UNITS,
      directKeyMap: Object.freeze({}), rawKeyMap: Object.freeze({}), overrides: MIDDLE_OVERRIDES
    })
  });

  function normalizePath(value) {
    return String(value || '').replace(/\\/g, '/').replace(/^exams\//, '');
  }

  function getSourceFileCandidates(sourceFile) {
    const normalized = normalizePath(sourceFile);
    const legacyMatch = normalized.match(/^(.*\/)(final|mid)\/([^/]+)$/);
    if (!legacyMatch) return [normalized];

    const [, parent, examType, fileName] = legacyMatch;
    const semester = fileName.match(/(?:^|_)([12])학기(?:_|$)/)?.[1] || '';
    const periods = semester ? [`${semester}${examType}`] : [`1${examType}`, `2${examType}`];
    const candidates = periods.map(period => `${parent}${period}/${fileName}`);
    candidates.push(normalized);
    return [...new Set(candidates)];
  }

  function parseQuestionNo(value) {
    if (typeof value === 'number') {
      return Number.isInteger(value) && value > 0 ? value : null;
    }
    if (typeof value === 'string') {
      const match = value.match(/\d+/);
      if (match) {
        const n = Number(match[0]);
        return Number.isInteger(n) && n > 0 ? n : null;
      }
    }
    return null;
  }

  function matchQuestionNo(questionId, targetNo) {
    const a = parseQuestionNo(questionId);
    const b = parseQuestionNo(targetNo);
    return a !== null && b !== null && a === b;
  }

  function getQuestionNo(record) {
    const direct = parseQuestionNo(record && (record.id ?? record._sourceQuestionNo ?? record.source_question_no));
    if (direct !== null) return direct;
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
    // 고2·고3 단원표는 하나라서 고3 폴더(original/high/h3/)의 시험지도 같은 풀에 든다(scope.sourcePrefixes).
    const prefixes = scope.sourcePrefixes || [scope.sourcePrefix];
    return prefixes.some(prefix => file.startsWith(prefix)) && scope.periods.includes(getPeriod(file));
  }

  function isHighSemanticProfile(profileOrId) {
    const profile = getProfile(profileOrId);
    return profile && profile.catalogId === 'high-semantic';
  }
  function resolveUnitKeyAlias(profileOrId, value) {
    const key = String(value || '').trim();
    if (!key) return '';
    const profile = getProfile(profileOrId);
    if (middleToc && profile.id.startsWith('m')) return currentMiddleUnitKey(profile, key) || key;
    return isHighSemanticProfile(profileOrId) ? (LEGACY_HIGH_UNIT_ALIASES[key] || key) : key;
  }
  // A former combined unit can have several current children. Never pick the first child
  // for an old URL, saved scope or question; one-to-one aliases alone are safe.
  function currentMiddleUnitKey(profile, legacyKey) {
    if (profile.units.some(unit => unit.key === legacyKey)) return legacyKey;
    const matches = profile.units.filter(unit => unit.legacyUnitKeys?.includes(legacyKey));
    return matches.length === 1 ? matches[0].key : '';
  }
  function resolveRpmParent(record, profileOrId) {
    if (!middleToc) return { status: 'OUT_OF_SCOPE', parent: null };
    const profile = profileOrId ? getProfile(profileOrId) : null;
    const sourceFile = String(record?.sourceFile || record?.sourceArchiveFile || record?._sourceFile || '');
    const fileGrade = sourceFile.match(/middle\/m([123])\//)?.[1];
    const grade = profile?.grade || record?.sourceGrade || (fileGrade ? `중${fileGrade}` : '');
    if (!/^중[123]$/.test(grade)) return { status: 'OUT_OF_SCOPE', parent: null };
    const curriculumKey = String(record?.originalCurriculum || record?.curriculumKey || record?.curriculum || record?.rpmCurriculum || record?.metaHintCurriculum ||
      record?.metadataAssignmentEvidence?.rpmMetadata?.rpmCurriculum || record?.rpmPrimaryPath?.curriculum ||
      archive2Core.middleCurriculumFromYear(grade, getExamYear(record)) || '').trim();
    // This object is a read-only classification input. Source metadata and saved paths stay intact.
    const resolution = middleToc.resolveRecord({ ...record, curriculumKey }, grade);
    // The status stays what the canonical resolver said. A reviewed middle parent rides along as an extra field.
    const reviewedParent = resolution.status === 'EXACT' ? null : reviewedMiddleParent(record, profile || grade);
    return reviewedParent ? { ...resolution, reviewedParent } : resolution;
  }
  // 문항별 중단원 지정표(archive/data/archive2-middle-parent-assignments.json)에서 파생된 카탈로그 필드
  // reviewedMiddleParentKey가 가리키는 정본 중단원. 지문이 판정 당시와 같은지는 카탈로그 빌더가 이미 걸러서
  // 값이 남아 있는 문항만 쓴다. 정본 중단원이 아니거나 문항 학년과 다르면 쓰지 않는다(예전 규칙으로 떨어진다).
  // 정본 판정(EXACT)을 대신하지 않으므로 호출하는 쪽이 판정이 EXACT가 아닐 때만 쓴다.
  function reviewedMiddleParent(record, profileOrId) {
    if (!middleToc || !record) return null;
    const key = String(record.reviewedMiddleParentKey || '').trim();
    if (!key) return null;
    const parent = middleToc.parent(key);
    if (!parent) return null;
    const profile = profileOrId && typeof profileOrId === 'object' ? profileOrId : null;
    const grade = (profile && profile.grade) || (typeof profileOrId === 'string' && /^중[123]$/.test(profileOrId) ? profileOrId : '') ||
      (profileOrId ? getProfile(profileOrId).grade : '') || record.effectiveBrowseGrade || record.sourceGrade || '';
    const gradeKey = middleToc.gradeKey(grade);
    return gradeKey && parent.gradeKey === gradeKey ? parent : null;
  }
  function highSemanticSubjectOptions() {
    return archive2Core.highSemanticSubjectOptions();
  }
  function highSemanticSubjectForCourseKey(courseKey) {
    return archive2Core.highSemanticSubjectForCourseKey(courseKey);
  }

  const IGNORED_IDENTITIES = Object.freeze({
    'original/high/h2/1final/25_제일고_1학기_기말_고2_대수c.js#22': '공통수학 문항'
  });

  // True when the classification of this exact question is decided by its file#number identity
  // (manual override or explicit ignore) instead of by its unit key and label alone. Callers that
  // cache classifications by key/label must not reuse a cached result for such a question.
  function hasIdentityRule(record, profileOrId = 'h1') {
    const profile = getProfile(profileOrId);
    const questionNo = getQuestionNo(record);
    if (!questionNo) return false;
    const identity = `${normalizePath(record && (record.sourceFile || record._sourceFile))}#${questionNo}`;
    return Boolean(profile.overrides[identity]) ||
      (isHighSemanticProfile(profile) && Boolean(IGNORED_IDENTITIES[identity]));
  }

  // 옛 대단원 하나가 현행 두 단원으로 갈려 판정이 "세부 분류 확인 필요"로 남던 문항을, 시험지의 옛 소단원 키(subUnitKey)로 가른다.
  // 키는 옛 대단원(standardUnitKey)과 짝이 맞을 때만 쓴다. 표에 없는 키는 건드리지 않고 다음 단계(유형 힌트)로 넘긴다.
  const LEGACY_SUBUNIT_SPLIT = Object.freeze({
    'M2-05': Object.freeze({
      '삼각형의 성질': Object.freeze([
        'M2-05-TRIANGLE_PROPERTIES', 'M2-05-ISOSCELES_PROP', 'M2-05-ISOSCELES_PROOF', 'M2-05-ISOSCELES_FOLD', 'M2-05-CIRCUMCENTER_PROP',
        'M2-05-CIRCUMCENTER_CONST', 'M2-05-INCENTER_PROP', 'M2-05-INCENTER_APPLY', 'M2-05-INCENTER_AREA', 'M2-05-OUT_IN_CENTER',
        'M2-05-OUT_IN_PROP', 'M2-05-OUT_IN_PERIMETER', 'M2-05-TRI_CONGRUENCE', 'M2-05-RIGHT_TRI_CONG',
        'M2-06-ISOSCELES_TRIANGLE', 'M2-06-RIGHT_TRIANGLE_CONGRUENCE', 'M2-06-TRIANGLE_INCENTER', 'M2-06-TRIANGLE_CIRCUMCENTER',
        'M2-06-CIRCUMCENTER_INCENTER']),
      '사각형의 성질': Object.freeze([
        'M2-05-QUADRILATERAL_PROPERTIES', 'M2-05-QUAD_PROPERTIES', 'M2-05-QUAD_DIAGONAL', 'M2-05-PARALLELOGRAM_PROP', 'M2-05-PARALLELOGRAM_COND',
        'M2-05-RHOMBUS_AREA', 'M2-05-PARALLEL_TO_RHOMBUS',
        'M2-08-ISOSCELES_TRAPEZOID', 'M2-08-PARALLELOGRAM_DIAGONAL', 'M2-08-PARALLELOGRAM_CONDITION', 'M2-08-PARALLELOGRAM_SIDE',
        'M2-08-PARALLELOGRAM_INTERNAL_POINT', 'M2-08-RHOMBUS_CONDITION', 'M2-08-RECTANGLE_DIAGONAL_ANGLE', 'M2-08-SQUARE_AREA',
        'M2-08-PARALLEL_LINE_AREA', 'M2-08-QUADRILATERAL_RELATION', 'M2-08-TRAPEZOID_EQUAL_AREA'])
    }),
    'M2-01': Object.freeze({
      '유리수와 순환소수': Object.freeze(['M2-01-REPEATING_DECIMAL', 'M2-01-RATIONAL_NUMBER_REPEATING_DECIMAL']),
      '식의 계산': Object.freeze([
        'M2-01-POLYNOMIAL_OPERATIONS', 'M2-01-EXPONENT_LAW', 'M2-02-EXPONENT_LAWS', 'M2-02-EXPONENT_RULES', 'M2-02-EXPONENT_BASIC',
        'M2-02-EXPONENT_EXPANSION', 'M2-02-EXPONENT_APPLICATION', 'M2-02-EXPONENT_DETERMINATION', 'M2-02-POLYNOMIAL_ARITHMETIC',
        'M2-02-POLYNOMIAL_CALCULATION', 'M2-02-POLYNOMIAL_GEOMETRY', 'M2-02-POLYNOMIAL_ADD_SUB', 'M2-02-POLYNOMIAL_MUL_DIV',
        'M2-02-POLYNOMIAL_SUBSTITUTION', 'M2-02-POLYNOMIAL_SUB', 'M2-02-POLYNOMIAL_ADD', 'M2-02-POLYNOMIAL_EXPANSION',
        'M2-02-POLYNOMIAL_COEFFICIENT', 'M2-02-POLYNOMIAL_DEGREE', 'M2-02-POLYNOMIAL_INVERSE', 'M2-02-MONOMIAL_CALCULATION',
        'M2-02-MONOMIAL_GEOMETRY', 'M2-02-UNKNOWN_MONOMIAL', 'M2-02-INVERSE_CALCULATION', 'M2-02-VOLUME_APPLICATION',
        'M2-02-COMPLEX_SUBSTITUTION', 'M2-02-DIGIT_COUNT', 'M2-02-EXPRESSION_VALUE', 'M2-02-EXPANSION_MATCH'])
    })
  });
  const LEGACY_SUBUNIT_LOOKUP = (() => {
    const lookup = new Map();
    for (const [oldKey, units] of Object.entries(LEGACY_SUBUNIT_SPLIT))
      for (const [unitName, subKeys] of Object.entries(units)) for (const subKey of subKeys) lookup.set(`${oldKey}|${subKey}`, unitName);
    return lookup;
  })();
  // 한 유형(PT)이 닮음 단원과 삼각형·사각형 단원에 함께 연결돼 힌트가 닮음으로 나올 수 있다. 그 문항의 소단원·유형·템플릿 키나 이름에
  // 외심·내심(삼각형의 성질) 또는 사각형·평행사변형·마름모(사각형의 성질)가 있으면 그쪽으로 보낸다(원장 지시 2026-11-24). 새로 추정한 값이 아니라 이미 있는 값을 읽는다.
  const HINT_REDIRECT_FROM = '도형의닮음과피타고라스정리';
  const HINT_REDIRECTS = Object.freeze([
    // 외심·내심 값이 있으면 삼각형의 성질. 유형 TRIANGLE_CENTERS는 무게중심(닮음)도 함께 연결돼 유형 키만으로는 보내지 않고,
    // 템플릿(TPL_TRIANGLE_CENTERS_*)이 외심·내심 템플릿이면서 무게중심 값이 없을 때만 보낸다.
    Object.freeze({ to: '삼각형의성질', pattern: /CIRCUMCENTER|INCENTER|INCIRCLE|외심|내심|외접원|내접원/,
      templatePattern: /TRIANGLE_CENTERS/, excludePattern: /CENTROID|무게중심/ }),
    Object.freeze({ to: '사각형의성질', pattern: /QUADRILATERAL|PARALLELOGRAM|RHOMBUS|사각형|평행사변형|마름모/ })
  ]);
  // 판정이 없던 문항을 채운다: ① 옛 소단원 키 → ② 카탈로그 유형 힌트(metaHintUnit). 값이 없으면 null(미정 그대로).
  function fillUnclassifiedRecord(record, profile) {
    const compact = value => String(value || '').replace(/\s+/g, '');
    const unitByName = name => profile.units.find(unit => compact(unit.name) === compact(name));
    const legacyName = LEGACY_SUBUNIT_LOOKUP.get(`${String(record.standardUnitKey || '').trim()}|${String(record.subUnitKey || '').trim()}`);
    const legacyUnit = legacyName && profile.id.startsWith('m') ? unitByName(legacyName) : null;
    if (legacyUnit) return { status: 'classified', unitKey: legacyUnit.key, reason: 'legacy-subunit' };
    const hint = String(record.metaHintUnit || '').trim();
    if (!hint) return null;
    let hinted = profile.units.find(unit => unit.key === hint) || unitByName(hint);
    if (!hinted) return null;
    if (compact(hinted.name) === HINT_REDIRECT_FROM) {
      const evidence = [record.subUnitKey, record.subUnit, record.problemTypeKey, record.templateKey, record.L3, record.L4, record.conceptLabel].join(' ');
      const templateEvidence = [record.templateKey, record.L4].join(' ');
      const redirect = HINT_REDIRECTS.find(item => item.pattern.test(evidence) ||
        (item.templatePattern && item.templatePattern.test(templateEvidence) && !item.excludePattern.test(evidence)));
      hinted = (redirect && unitByName(redirect.to)) || hinted;
    }
    return { status: 'classified', unitKey: hinted.key, reason: 'type-hint' };
  }

  // options.fillUnits: 기존 판정이 "확인 필요"(review)로 남긴 문항만 위 보충 판정으로 채운다. 기존에 정해진 판정은 바뀌지 않는다.
  function classifyRecord(record, profileOrId = 'h1', options = {}) {
    const result = classifyRecordBase(record, profileOrId);
    if (!options.fillUnits || result.status !== 'review') return result;
    return fillUnclassifiedRecord(record, getProfile(profileOrId)) || result;
  }

  function classifyRecordBase(record, profileOrId = 'h1') {
    const profile = getProfile(profileOrId);
    if (!middleToc || !profile.id.startsWith('m')) return classifyLegacyRecord(record, profile);
    const sourceFile = normalizePath(record && (record.sourceFile || record._sourceFile));
    if (!sourceFile || !getQuestionNo(record)) return { status: 'invalid', reason: '원본 파일 또는 문항 번호 없음' };
    const resolution = record.rpmParentResolution || resolveRpmParent(record, profile);
    if (resolution.status === 'EXACT' && resolution.parent)
      return { status: 'classified', unitKey: resolution.parent.unitKey, reason: 'rpm-current-parent', rpmParent: resolution.parent };
    if (resolution.reviewedParent)
      return { status: 'classified', unitKey: resolution.reviewedParent.unitKey, reason: 'reviewed-middle-parent', rpmParent: resolution.reviewedParent };
    if (hasIdentityRule(record, profile)) {
      const legacy = classifyLegacyRecord(record, { ...profile, units: profile.legacyUnits });
      const unitKey = currentMiddleUnitKey(profile, legacy.unitKey);
      return unitKey ? { ...legacy, unitKey } : { status: 'review', reason: '통합 단원의 세부 분류 확인 필요' };
    }
    const sourceUnit = String(record.standardUnit || '').replace(/\s+/g, '');
    const exactUnits = profile.units.filter(unit => unit.name.replace(/\s+/g, '') === sourceUnit);
    if (exactUnits.length === 1) return { status: 'classified', unitKey: exactUnits[0].key, reason: 'rpm-current-unit-label' };
    const parentUnits = [...new Set(middleToc.parents(profile.grade)
      .filter(parent => parent.L2.replace(/\s+/g, '') === sourceUnit).map(parent => parent.unitKey))];
    if (parentUnits.length === 1) return { status: 'classified', unitKey: parentUnits[0], reason: 'rpm-current-chapter-label' };
    const direct = currentMiddleUnitKey(profile, String(record.standardUnitKey || '').trim());
    if (direct) return { status: 'classified', unitKey: direct, reason: 'middle-compatible-unit-key' };
    // "수와 식" was one source unit but spans two current L1s. It needs a narrower path.
    if (profile.id === 'm2' && sourceUnit === '수와식') return { status: 'review', reason: '통합 단원의 세부 분류 확인 필요' };
    const legacy = classifyLegacyRecord(record, { ...profile, units: profile.legacyUnits });
    if (legacy.status !== 'classified') return legacy;
    const unitKey = currentMiddleUnitKey(profile, legacy.unitKey);
    return unitKey ? { ...legacy, unitKey } : { status: 'review', reason: '통합 단원의 세부 분류 확인 필요' };
  }

  function classifyLegacyRecord(record, profileOrId = 'h1') {
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

    if (isHighSemanticProfile(profile) && IGNORED_IDENTITIES[identity]) {
      return { status: 'ignored', reason: IGNORED_IDENTITIES[identity] };
    }

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

  function normalizeExamYear(value) {
    const n = Number(value);
    if (!Number.isInteger(n) || n < 0) return 0;
    return n < 100 ? 2000 + n : n;
  }

  function getYearFromSourceFile(record) {
    const file = normalizePath(record && (record.sourceFile || record._sourceFile));
    const match = file.split('/').pop().match(/^(\d{2,4})_/);
    if (!match) return 9999;
    return normalizeExamYear(match[1]) || 9999;
  }

  function getExamYear(record) {
    const explicit = normalizeExamYear(record && (record.examYear ?? record.exam_year ?? record.year));
    return explicit || getYearFromSourceFile(record);
  }

  function getYear(record) {
    return getExamYear(record);
  }

  function getSchool(record) {
    const explicit = String(record && (record.school || record.schoolName || record.school_name) || '').trim();
    if (explicit) return explicit;
    const file = normalizePath(record && (record.sourceFile || record._sourceFile));
    const filename = file.split('/').pop().replace(/\.js$/i, '');
    const parts = filename.split('_');
    return String(parts[1] || '').trim();
  }

  function normalizeSchoolKey(value) {
    return String(value || '')
      .normalize('NFKC')
      .trim()
      .replace(/\s+/g, '')
      .toLocaleLowerCase();
  }

  function getSchoolKey(record) {
    const explicit = String(record && (record.schoolKey || record.school_key) || '').trim();
    return explicit || normalizeSchoolKey(getSchool(record));
  }

  function getSchoolLabel(record) {
    return getSchool(record) || '학교 미상';
  }

  function getSemester(record) {
    const explicit = String(record && (record.semester || record.semesterNo || record.semester_no) || '').trim();
    if (explicit === '1' || explicit === '2') return explicit;
    const period = getPeriod(record && record.sourceFile);
    return period.startsWith('1') || period.startsWith('2') ? period.slice(0, 1) : '';
  }

  function getExamType(record) {
    const explicit = String(record && (record.examType || record.exam_type) || '').trim().toLowerCase();
    if (explicit === 'mid' || explicit === '중간') return 'mid';
    if (explicit === 'final' || explicit === '기말') return 'final';
    const period = getPeriod(record && record.sourceFile);
    return period.endsWith('mid') || period.endsWith('final') ? period.slice(1) : '';
  }

  function getSourceExamKey(record) {
    return normalizePath(record && (record.sourceExamKey || record.source_exam_key || record.sourceFile || record._sourceFile));
  }

  function compareRecords(a, b) {
    const yearDiff = compareNewestYear(a, b);
    if (yearDiff) return yearDiff;
    const periodOrder = { '1mid': 1, '1final': 2, '2mid': 3, '2final': 4 };
    const periodDiff = (periodOrder[getPeriod(a.sourceFile)] || 99) - (periodOrder[getPeriod(b.sourceFile)] || 99);
    if (periodDiff) return periodDiff;
    const fileDiff = compareText(normalizePath(a.sourceFile), normalizePath(b.sourceFile));
    return fileDiff || getQuestionNo(a) - getQuestionNo(b);
  }
  // Recency order shared with 문제지 만들기 (Archive2Core.RECENCY_POLICY): the newest school year
  // first (2026, 2025, ...), unknown years last.
  function recencyRankOf(record) {
    const year = getYear(record);
    return isValidExamYear(year) ? archive2Core.recencyRank(year) : archive2Core.recencyRank(0);
  }
  function compareNewestYear(a, b) {
    return recencyRankOf(a) - recencyRankOf(b);
  }

  function getCollectionUnitKey(record) {
    const key = String(record && (record.mappedUnitKey || record.collectionUnitKey || record.unitKey) || '').trim();
    return LEGACY_HIGH_UNIT_ALIASES[key] || key;
  }

  function normalizeCollectionScopeMode(value) {
    const mode = String(value || '').trim();
    if (mode === 'unit') return 'current';
    return ['current', 'range', 'cumulative', 'course'].includes(mode) ? mode : 'current';
  }

  function getCollectionScopeUnits(profileOrId, options = {}) {
    const profile = getProfile(profileOrId || options.profile || options.profileId || 'h1');
    const currentKey = resolveUnitKeyAlias(profile, options.unitKey || options.selectedUnitKey || '');
    const current = profile.units.find(unit => unit.key === currentKey);
    const scopeMode = normalizeCollectionScopeMode(options.scopeMode || options.collectionScope);
    const course = String(options.course || options.courseKey || current?.course || '').trim();
    const courseUnits = profile.units.filter(unit => !course || unit.course === course);
    if (scopeMode === 'course') return courseUnits;
    if (!current) return [];
    if (scopeMode === 'cumulative') {
      return courseUnits.filter(unit => unit.order <= current.order);
    }
    if (scopeMode === 'range') {
      const startKey = resolveUnitKeyAlias(profile, options.startUnitKey || options.rangeStartUnitKey || current.key);
      const endKey = resolveUnitKeyAlias(profile, options.endUnitKey || options.rangeEndUnitKey || current.key);
      const start = courseUnits.find(unit => unit.key === startKey) || current;
      const end = courseUnits.find(unit => unit.key === endKey) || current;
      const low = Math.min(start.order, end.order);
      const high = Math.max(start.order, end.order);
      return courseUnits.filter(unit => unit.order >= low && unit.order <= high);
    }
    return [current];
  }

  function getCollectionScopeRecords(records, profileOrId, options = {}) {
    const profile = getProfile(profileOrId || options.profile || options.profileId || 'h1');
    const unitKeys = new Set(getCollectionScopeUnits(profile, options).map(unit => unit.key));
    if (!unitKeys.size) return [];
    return (Array.isArray(records) ? records : []).filter(record => unitKeys.has(getCollectionUnitKey(record)));
  }

  // The archive contains a few legacy values such as "[중]" and values from
  // other level systems ("중1", "고2").  Unit-past-exams deliberately exposes
  // only the three shared difficulty buckets plus an explicit fallback.
  function normalizeDifficulty(value) {
    const normalized = String(value ?? '')
      .trim()
      .replace(/^\[|\]$/g, '')
      .trim();
    // Canonical Archive2 stores the five-level numeric bucket. This three-level
    // Unit Past projection follows the canonical legacy comparison matrix only
    // for filtering/display; source metadata stays numeric and unchanged.
    if (/^[1-5]$/.test(normalized))
      return ({ 1: '하', 2: '중', 3: '중', 4: '상', 5: '상' })[normalized];
    return ['하', '중', '상'].includes(normalized) ? normalized : '미분류';
  }

  function getDifficultyBucket(record) {
    const value = record && (record.difficultyBucket || record.normalizedLevel || record.level);
    return normalizeDifficulty(value);
  }

  // ---- 난이도 단계 (S13) ----------------------------------------------------------------------
  // Numeric difficulty step 1..5 comes ONLY from a numeric difficultyBucket / difficultyStep. The legacy
  // three-level label (하/중/상) is kept apart as display-only information and is never converted into,
  // inferred as, or stored as a numeric step. Records without a numeric step are '단계 미지정'; they are
  // never excluded.
  const DIFFICULTY_STEPS = Object.freeze([1, 2, 3, 4, 5]);
  const STEP_NONE = 'none';
  const STEP_TOKENS = Object.freeze(['1', '2', '3', '4', '5', STEP_NONE]);
  const LEGACY_LABELS = Object.freeze(['하', '중', '상']);
  const LEGACY_NONE = '없음';
  const LEGACY_RANK = Object.freeze({ '하': 0, '중': 1, '상': 2, [LEGACY_NONE]: 3 });
  const STEP_LABEL_NONE = '단계 미지정';

  function parseNumericStep(value) {
    if (typeof value === 'number') return Number.isInteger(value) && value >= 1 && value <= 5 ? value : null;
    const text = String(value ?? '').trim();
    return /^[1-5]$/.test(text) ? Number(text) : null;
  }

  function getDifficultyStep(record) {
    if (!record) return null;
    const direct = parseNumericStep(record.difficultyStep);
    if (direct) return direct;
    return parseNumericStep(record.difficultyBucket);
  }

  function getLegacyDifficultyLabel(record) {
    if (!record) return LEGACY_NONE;
    const explicit = String(record.legacyDifficultyLabel ?? '').trim();
    if (LEGACY_LABELS.includes(explicit)) return explicit;
    for (const value of [record.difficultyBucket, record.level]) {
      const text = String(value ?? '').trim().replace(/^\[|\]$/g, '').trim();
      if (LEGACY_LABELS.includes(text)) return text;
    }
    return LEGACY_NONE;
  }

  function getStepToken(record) {
    const step = getDifficultyStep(record);
    return step ? String(step) : STEP_NONE;
  }

  function stepTokenLabel(token) {
    return token === STEP_NONE ? STEP_LABEL_NONE : `${token}단계`;
  }

  function normalizeStepSelection(input) {
    const list = Array.isArray(input) ? input : typeof input === 'string' ? input.split(',') : input instanceof Set ? [...input] : [];
    const tokens = new Set(list.map(value => String(value ?? '').trim()).filter(value => STEP_TOKENS.includes(value)));
    // Empty or complete selection == every step (the default; titles and snapshot keys stay unchanged).
    if (!tokens.size || tokens.size === STEP_TOKENS.length) return [];
    return STEP_TOKENS.filter(token => tokens.has(token));
  }

  function stepSelectionLabel(selection) {
    const tokens = normalizeStepSelection(selection);
    if (!tokens.length) return '';
    const numeric = tokens.filter(token => token !== STEP_NONE);
    const parts = [];
    if (numeric.length) parts.push(`${numeric.join('·')}단계`);
    if (tokens.includes(STEP_NONE)) parts.push(STEP_LABEL_NONE);
    return parts.join(' · ');
  }

  // Sort keys are computed once per record: step 1..5 then 단계 미지정; inside 단계 미지정 the legacy
  // label 하 -> 중 -> 상 -> 없음; then the recency order (newest year first, unknown last), exam period,
  // source file and question number. This order applies INSIDE one paper; papers themselves are cut in
  // compareRecords order (newest year first) so paper 1 holds the newest exams (buildStepPapers).
  const stepSortKeys = new WeakMap();
  function getStepSortKey(record) {
    let key = record && typeof record === 'object' ? stepSortKeys.get(record) : null;
    if (key) return key;
    const step = getDifficultyStep(record);
    key = {
      step: step || 6,
      legacy: step ? 0 : LEGACY_RANK[getLegacyDifficultyLabel(record)],
      recency: recencyRankOf(record),
      period: ({ '1mid': 1, '1final': 2, '2mid': 3, '2final': 4 })[getPeriod(record.sourceFile)] || 99,
      file: normalizePath(record.sourceFile),
      no: getQuestionNo(record)
    };
    if (record && typeof record === 'object') stepSortKeys.set(record, key);
    return key;
  }

  function compareStepRecords(a, b) {
    const ka = getStepSortKey(a);
    const kb = getStepSortKey(b);
    return ka.step - kb.step || ka.legacy - kb.legacy || ka.recency - kb.recency || ka.period - kb.period ||
      compareText(ka.file, kb.file) || ka.no - kb.no;
  }

  function summarizeSteps(records) {
    const steps = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, [STEP_NONE]: 0 };
    const legacy = { '하': 0, '중': 0, '상': 0, [LEGACY_NONE]: 0 };
    for (const record of Array.isArray(records) ? records : []) {
      const token = getStepToken(record);
      steps[token] += 1;
      if (token === STEP_NONE) legacy[getLegacyDifficultyLabel(record)] += 1;
    }
    return { steps, legacy, total: Object.values(steps).reduce((sum, value) => sum + value, 0) };
  }

  // Section headings for a step-ordered paper: one heading at the first question of every step; inside
  // 단계 미지정 an extra sub-heading '기존 분류: 하/중/상/없음' at each legacy-label change. `at` is the
  // 0-based question index, `uid` guards against a reordered paper (renderers ignore a stale heading).
  function buildStepSections(records) {
    const list = Array.isArray(records) ? records : [];
    const sections = [];
    let previousToken = null;
    let previousLegacy = null;
    list.forEach((record, index) => {
      const token = getStepToken(record);
      const uid = getQuestionUid(record);
      if (token !== previousToken) {
        sections.push({ at: index, uid, title: stepTokenLabel(token), level: 1 });
        previousToken = token;
        previousLegacy = null;
      }
      if (token === STEP_NONE) {
        const legacy = getLegacyDifficultyLabel(record);
        if (legacy !== previousLegacy) {
          sections.push({ at: index, uid, title: `기존 분류: ${legacy}`, level: 2 });
          previousLegacy = legacy;
        }
      }
    });
    return sections;
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
    const key = getSubUnitKey(record);
    const rawLabel = String(record && (record.subUnit || record.sub_unit) || '').trim();
    const labels = typeof globalThis !== 'undefined' && globalThis.ARCHIVE_SUBUNIT_LABELS && typeof globalThis.ARCHIVE_SUBUNIT_LABELS === 'object'
      ? globalThis.ARCHIVE_SUBUNIT_LABELS
      : null;
    const canonicalLabel = key && labels ? String(labels[key] || '').trim() : '';
    const label = canonicalLabel || rawLabel;
    if (!label) return '';
    return /[A-Za-z]/.test(label) ? '소단원 검토 필요' : label;
  }

  function getProblemTypeKey(record) {
    return String(record && (record.problemTypeKey || record.problem_type_key) || '').trim();
  }

  function selectionSubUnit(record) {
    const resolution = record?.rpmParentResolution || resolveRpmParent(record);
    if (resolution.status === 'EXACT' && resolution.parent) return {
      key: resolution.parent.parentKey, label: resolution.parent.L2,
      order: resolution.parent.order, parent: resolution.parent,
    };
    if (resolution.reviewedParent) return {
      key: resolution.reviewedParent.parentKey, label: resolution.reviewedParent.L2,
      order: resolution.reviewedParent.order, parent: resolution.reviewedParent,
    };
    // Broad 2022 keys cannot stand in for a single official chapter. Historical groups keep
    // their own key and an explicit label; raw metadata and saved source paths are unchanged.
    if (resolution.status !== 'OUT_OF_SCOPE') return { key: '', label: '소단원 분류 확인 필요', order: 9999 };
    const key = getSubUnitKey(record), label = getSubUnitLabel(record);
    const file = String(record?.sourceFile || record?.sourceArchiveFile || '');
    return { key, label: /middle\/m[123]\//.test(file) && label ? `이전 분류 · ${label}` : label, order: 9999 };
  }
  const getSelectionSubUnitKey = record => selectionSubUnit(record).key;
  const getSelectionSubUnitLabel = record => selectionSubUnit(record).label;

  function getTemplateKey(record) {
    return String(record && (record.templateKey || record.template_key) || '').trim();
  }

  // An explicit registry label (set from the recorded-meta facets) names the key; the legacy
  // L3/L4 text remains the label for records that carry no explicit one.
  function getProblemTypeLabel(record) {
    return String(record && (record.problemTypeLabel || record.L3 || record.problemType || '') || '').trim();
  }

  function getTemplateLabel(record) {
    return String(record && (record.templateLabel || record.L4 || record.template || '') || '').trim();
  }

  // S14 recorded concept (L3) / problem type (PT) / solution template (TPL) facets. The page joins
  // them from the final catalog's content-bound usable-meta lane: conceptLabel, problemTypeKey,
  // templateKey and metaFacetStatus {l3, pt, tpl} = 'approved' | 'pending'. Status is shown, never
  // upgraded: only an approved field status counts as 승인.
  function getConceptLabel(record) {
    return String(record && record.conceptLabel || '').trim();
  }

  function getFacetStatus(record, facet) {
    const status = record && record.metaFacetStatus && record.metaFacetStatus[facet];
    return status === 'approved' ? 'approved' : status ? 'pending' : '';
  }

  function facetStatusText(option) {
    const mix = option.pending === 0 ? '승인' : option.approved === 0 ? '검토 대기' : `승인 ${option.approved} · 검토 대기 ${option.pending}`;
    return `${option.count}문항 · ${mix}`;
  }

  function addFacetCount(group, record, facet) {
    group.count += 1;
    if (getFacetStatus(record, facet) === 'approved') group.approved += 1; else group.pending += 1;
  }

  function getProblemTypeOptions(records, filters = {}) {
    const source = filterUnitRecords(records, {
      subUnitKeys: filters.subUnitKeys || [],
      conceptLabels: filters.conceptLabels || [],
      templateKeys: filters.templateKeys || [],
      approvedOnly: filters.approvedOnly === true,
      difficultyBuckets: filters.difficultyBuckets || [],
      includeUnclassified: filters.includeUnclassified === true
    });
    const groups = new Map();
    for (const record of source) {
      const key = getProblemTypeKey(record);
      const label = getProblemTypeLabel(record);
      if (!key || !label || !isProblemTypeSelectable(record)) continue;
      const group = groups.get(key) || { key, label, count: 0, approved: 0, pending: 0 };
      addFacetCount(group, record, 'pt');
      groups.set(key, group);
    }
    return [...groups.values()].sort((a, b) => b.count - a.count || compareText(a.label, b.label));
  }

  function getTemplateOptions(records, filters = {}) {
    const source = filterUnitRecords(records, {
      subUnitKeys: filters.subUnitKeys || [],
      conceptLabels: filters.conceptLabels || [],
      problemTypeKeys: filters.problemTypeKeys || [],
      approvedOnly: filters.approvedOnly === true,
      difficultyBuckets: filters.difficultyBuckets || [],
      includeUnclassified: filters.includeUnclassified === true
    });
    const groups = new Map();
    for (const record of source) {
      const key = getTemplateKey(record);
      const label = getTemplateLabel(record);
      if (!key || !label || !isProblemTypeSelectable(record)) continue;
      const group = groups.get(key) || { key, label, count: 0, approved: 0, pending: 0, parentProblemTypeKey: getProblemTypeKey(record) };
      addFacetCount(group, record, 'tpl');
      groups.set(key, group);
    }
    return [...groups.values()].sort((a, b) => b.count - a.count || compareText(a.label, b.label));
  }

  function getConceptOptions(records, filters = {}) {
    const source = filterUnitRecords(records, {
      subUnitKeys: filters.subUnitKeys || [],
      problemTypeKeys: filters.problemTypeKeys || [],
      templateKeys: filters.templateKeys || [],
      approvedOnly: filters.approvedOnly === true,
      difficultyBuckets: filters.difficultyBuckets || [],
      includeUnclassified: filters.includeUnclassified === true
    });
    const groups = new Map();
    for (const record of source) {
      const label = getConceptLabel(record);
      if (!label) continue;
      const group = groups.get(label) || { key: label, label, count: 0, approved: 0, pending: 0 };
      addFacetCount(group, record, 'l3');
      groups.set(label, group);
    }
    return [...groups.values()].sort((a, b) => b.count - a.count || compareText(a.label, b.label));
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

  const META_FOUNDATION_SCOPE_FIELDS = Object.freeze(['curriculumKey', 'courseKey', 'L1', 'L2']);
  const META_FOUNDATION_TAXONOMY_FIELDS = Object.freeze([...META_FOUNDATION_SCOPE_FIELDS, 'problemTypeKey', 'templateKey']);

  function metaFoundationTuple(record, fields) {
    return fields.map(field => String((record && record[field]) ?? '').trim()).join('\u001f');
  }

  function createMetaFoundationSelectionAuthority(runtime) {
    const active = Boolean(runtime && runtime.status === 'ACTIVE');
    const ownedScopes = new Set(
      active && Array.isArray(runtime.ownedScopes)
        ? runtime.ownedScopes.map(row => metaFoundationTuple(row, META_FOUNDATION_SCOPE_FIELDS))
        : []
    );
    const taxonomyRows = new Set(
      active && Array.isArray(runtime.taxonomyRows)
        ? runtime.taxonomyRows.map(row => metaFoundationTuple(row, META_FOUNDATION_TAXONOMY_FIELDS))
        : []
    );
    return { active, ownedScopes, taxonomyRows };
  }

  function validateMetaFoundationSelection(record, authority) {
    const runtimeOwnedRecord = String((record && record.metaFoundationStatus) || '').trim() === 'ACTIVE' &&
      Boolean(String((record && record.metaFoundationPackId) || '').trim());
    const scopeKey = metaFoundationTuple(record, META_FOUNDATION_SCOPE_FIELDS);
    const owned = runtimeOwnedRecord || Boolean(authority && authority.active && authority.ownedScopes.has(scopeKey));
    if (!owned) return { owned: false, valid: true, reason: 'NOT_OWNED' };
    if (!authority || !authority.active) return { owned: true, valid: false, reason: 'RUNTIME_UNAVAILABLE' };
    const taxonomyKey = metaFoundationTuple(record, META_FOUNDATION_TAXONOMY_FIELDS);
    const valid = authority.taxonomyRows.has(taxonomyKey);
    return { owned: true, valid, reason: valid ? 'ACTIVE_TAXONOMY_ROW' : 'BROKEN_L2_L3_OR_L4_PARENT' };
  }

  function isDefaultSelectable(record) {
    const value = record && record.defaultSelectable;
    return !(value === false || value === 0 || String(value).trim().toLowerCase() === 'false');
  }

  function isTaxonomySelectable(record) {
    const runtimeAvailable = record && record.metaFoundationRuntimeAvailable;
    if (runtimeAvailable === false || String(runtimeAvailable || '').trim().toLowerCase() === 'false') return false;
    const owned = record && (
      record.metaFoundationOwnedScope === true ||
      String(record.metaFoundationOwnedScope || '').trim().toLowerCase() === 'true'
    );
    if (!owned) return true;
    return record.metaFoundationTaxonomyValid === true ||
      String(record.metaFoundationTaxonomyValid || '').trim().toLowerCase() === 'true';
  }

  // Approved metadata: the former automatic-selection gate (metadata approved as default-selectable
  // and an intact Meta Foundation taxonomy chain). Since the 2026-10-29 user decision it is a
  // PRIORITY tier, not a usage gate.
  function isMetadataApproved(record) {
    return isDefaultSelectable(record) && isTaxonomySelectable(record);
  }

  // Usage gate = 문제지 만들기 generalUseEligibility (verified identity, intact source reference and
  // fingerprint). The page joins the result as `generalUseEligible` from the final catalog; a record
  // that was never joined (no catalog evidence) is not rejected here. Metadata approval, pending
  // review, source-issue annotations and a broken L2/L3/L4 chain are not usage gates.
  function isGeneralUseEligible(record) {
    const value = record && record.generalUseEligible;
    return !(value === false || value === 0 || String(value).trim().toLowerCase() === 'false');
  }

  function isAutomaticSelectable(record) {
    return isGeneralUseEligible(record);
  }

  // A broken or missing L2/L3/L4 chain only disables L3/L4-based selection for that record.
  // Records whose type/template come from the content-bound recorded-meta lane (metaFacetBound) are
  // selectable by those facets: the lane already requires ACTIVE registry keys with a consistent
  // PT -> TPL parent, and the status is shown instead of being a gate.
  function isProblemTypeSelectable(record) {
    return record && record.metaFacetBound === true ? true : isTaxonomySelectable(record);
  }

  function getSubUnitOptions(records) {
    const groups = new Map();
    for (const record of (Array.isArray(records) ? records : []).filter(isAutomaticSelectable)) {
      const selectedSubunit = selectionSubUnit(record);
      const key = selectedSubunit.key || '__unclassified__';
      const label = selectedSubunit.label || '미분류 소단원';
      const group = groups.get(key) || { key, label, order: selectedSubunit.order, count: 0, difficulty: { 하: 0, 중: 0, 상: 0, 미분류: 0 } };
      group.count += 1;
      group.difficulty[getDifficultyBucket(record)] += 1;
      groups.set(key, group);
    }
    return [...groups.values()].sort((a, b) => a.order - b.order || b.count - a.count || compareText(a.label, b.label));
  }

  function filterUnitRecords(records, filters = {}) {
    const source = Array.isArray(records) ? records : [];
    const subUnitKeys = new Set((filters.subUnitKeys || []).map(value => String(value || '').trim()).filter(Boolean));
    const problemTypeKeys = new Set((filters.problemTypeKeys || []).map(value => String(value || '').trim()).filter(Boolean));
    const templateKeys = new Set((filters.templateKeys || []).map(value => String(value || '').trim()).filter(Boolean));
    const conceptLabels = new Set((filters.conceptLabels || []).map(value => String(value || '').trim()).filter(Boolean));
    const approvedOnly = filters.approvedOnly === true;
    const difficultyBuckets = new Set((filters.difficultyBuckets || []).map(normalizeDifficulty));
    return source.filter(record => {
      if (filters.includeNonSelectable !== true && !isAutomaticSelectable(record)) return false;
      const subUnitKey = getSelectionSubUnitKey(record) || '__unclassified__';
      const problemTypeKey = getProblemTypeKey(record);
      const templateKey = getTemplateKey(record);
      const difficulty = getDifficultyBucket(record);
      if (subUnitKeys.size && !subUnitKeys.has(subUnitKey)) return false;
      if ((problemTypeKeys.size || templateKeys.size || conceptLabels.size) && !isProblemTypeSelectable(record)) return false;
      if (conceptLabels.size && !conceptLabels.has(getConceptLabel(record))) return false;
      if (problemTypeKeys.size && !problemTypeKeys.has(problemTypeKey)) return false;
      if (templateKeys.size && !templateKeys.has(templateKey)) return false;
      if (approvedOnly) {
        // Selected facets must be approved; with none selected, every recorded facet must be.
        const required = [];
        if (conceptLabels.size || (!problemTypeKeys.size && !templateKeys.size && getConceptLabel(record))) required.push('l3');
        if (problemTypeKeys.size || (!conceptLabels.size && !templateKeys.size && problemTypeKey)) required.push('pt');
        if (templateKeys.size || (!conceptLabels.size && !problemTypeKeys.size && templateKey)) required.push('tpl');
        if (!required.length || required.some(facet => getFacetStatus(record, facet) !== 'approved')) return false;
      }
      if (difficultyBuckets.size && !difficultyBuckets.has(difficulty)) return false;
      if (filters.includeUnclassified !== true && (subUnitKey === '__unclassified__' || difficulty === '미분류')) return false;
      return true;
    });
  }

  function normalizeCollectionSemester(value) {
    const normalized = String(value ?? '').trim().toLowerCase();
    return ['1', '2'].includes(normalized) ? normalized : '';
  }

  function normalizeCollectionExamType(value) {
    const normalized = String(value ?? '').trim().toLowerCase();
    if (normalized === 'mid' || normalized === '중간') return 'mid';
    if (normalized === 'final' || normalized === '기말') return 'final';
    return '';
  }

  function filterCollectionRecords(records, filters = {}) {
    const semester = normalizeCollectionSemester(filters.semester || filters.collectionSemester);
    const examType = normalizeCollectionExamType(filters.examType || filters.collectionExamType);
    return (Array.isArray(records) ? records : []).filter(record => {
      if (semester && getSemester(record) !== semester) return false;
      if (examType && getExamType(record) !== examType) return false;
      return true;
    });
  }

  function normalizeCollectionYearMode(value) {
    const mode = String(value || '').trim();
    if (mode === 'recent' || mode === 'recent3') return 'recentAvailable';
    if (mode === 'recent5') return 'recentAvailable';
    return ['exact', 'recentAvailable', 'range'].includes(mode) ? mode : 'exact';
  }

  function normalizeCollectionOptions(options = {}) {
    const yearModeInput = options.yearMode || options.collectionYearMode || '';
    const schoolKeys = [...new Set((Array.isArray(options.schoolKeys) ? options.schoolKeys : String(options.schoolKeys || '').split(','))
      .map(value => String(value || '').trim()).filter(Boolean))];
    const difficultyBuckets = [...new Set((Array.isArray(options.difficultyBuckets) ? options.difficultyBuckets : [])
      .map(normalizeDifficulty))];
    const yearMode = normalizeCollectionYearMode(yearModeInput);
    const requestedYear = normalizeExamYear(options.year || options.examYear);
    const recentCount = Math.max(1, Math.min(20, Number(options.yearCount || options.recentYearCount || (String(yearModeInput) === 'recent5' ? 5 : 3))));
    const yearFrom = normalizeExamYear(options.yearFrom || options.rangeYearFrom);
    const yearTo = normalizeExamYear(options.yearTo || options.rangeYearTo);
    const count = Math.max(0, Math.floor(Number(options.count || options.collectionCount || 0)));
    return {
      ...options,
      scopeMode: normalizeCollectionScopeMode(options.scopeMode || options.collectionScope),
      yearMode,
      year: requestedYear,
      yearCount: recentCount,
      yearFrom,
      yearTo,
      schoolKeys,
      subUnitKeys: Array.isArray(options.subUnitKeys) ? options.subUnitKeys : [],
      difficultyBuckets,
      semester: normalizeCollectionSemester(options.semester || options.collectionSemester),
      examType: normalizeCollectionExamType(options.examType || options.collectionExamType),
      includeUnclassified: options.includeUnclassified === true,
      outputMode: options.outputMode === 'combined' ? 'combined' : 'school',
      countMode: options.countMode === 'fixed' ? 'fixed' : 'all',
      count,
      target: Number(options.target || COMMON_SCOPE.targetQuestionsPerPaper),
      max: Number(options.max || COMMON_SCOPE.hardMaxQuestionsPerPaper)
    };
  }

  function isValidExamYear(year) {
    return Number.isInteger(year) && year >= 1900 && year <= 2200;
  }

  function resolveCollectionYearsBySchool(records, options = {}) {
    const normalized = normalizeCollectionOptions(options);
    const yearsBySchool = new Map();
    for (const record of filterCollectionRecords(records, normalized)) {
      const year = getExamYear(record);
      if (!isValidExamYear(year)) continue;
      const key = getSchoolKey(record) || '__unknown__';
      if (!yearsBySchool.has(key)) yearsBySchool.set(key, new Set());
      yearsBySchool.get(key).add(year);
    }

    const bySchool = {};
    const selected = new Set();
    for (const [schoolKey, yearSet] of yearsBySchool.entries()) {
      const available = [...yearSet].sort((a, b) => b - a);
      let years = available;
      if (normalized.yearMode === 'exact') {
        const exact = normalized.year || available[0] || 0;
        years = exact && available.includes(exact) ? [exact] : [];
      } else if (normalized.yearMode === 'recentAvailable') {
        years = available.slice(0, normalized.yearCount);
      } else if (normalized.yearMode === 'range') {
        const low = Math.min(normalized.yearFrom || 0, normalized.yearTo || normalized.yearFrom || 9999);
        const high = Math.max(normalized.yearFrom || 0, normalized.yearTo || normalized.yearFrom || 0);
        years = available.filter(year => year >= low && year <= high);
      }
      bySchool[schoolKey] = years;
      years.forEach(year => selected.add(year));
    }
    return {
      mode: normalized.yearMode,
      year: normalized.year || 0,
      yearCount: normalized.yearCount,
      yearFrom: normalized.yearFrom || 0,
      yearTo: normalized.yearTo || 0,
      bySchool,
      selectedYears: [...selected].sort((a, b) => b - a),
      availableYears: [...new Set(Object.values(bySchool).flatMap(years => years))].sort((a, b) => b - a)
    };
  }

  function getCollectionSelectionContext(records, profileOrId, options = {}) {
    const profile = getProfile(profileOrId || options.profile || options.profileId || 'h1');
    const normalized = normalizeCollectionOptions(options);
    const scoped = getCollectionScopeRecords(records, profile, normalized);
    const detailFiltered = filterCollectionRecords(filterUnitRecords(scoped, normalized), normalized);
    const requestedSchools = new Set(normalized.schoolKeys);
    const schoolFiltered = detailFiltered.filter(record => {
      const schoolKey = getSchoolKey(record) || '__unknown__';
      return !requestedSchools.size || requestedSchools.has(schoolKey);
    });
    const yearSelection = resolveCollectionYearsBySchool(schoolFiltered, normalized);
    const allowedYearsBySchool = new Map(Object.entries(yearSelection.bySchool).map(([key, years]) => [key, new Set(years)]));
    const candidates = dedupeRecords(schoolFiltered.filter(record => {
      const schoolKey = getSchoolKey(record) || '__unknown__';
      const years = allowedYearsBySchool.get(schoolKey);
      return Boolean(years && years.has(getExamYear(record)));
    }));
    return { profile, options: normalized, scoped, detailFiltered, schoolFiltered, candidates, yearSelection };
  }

  function getCollectionSchoolOptions(records, profileOrId, options = {}) {
    const profile = getProfile(profileOrId || options.profile || options.profileId || 'h1');
    const normalized = normalizeCollectionOptions({ ...options, schoolKeys: [] });
    const scoped = getCollectionScopeRecords(records, profile, normalized);
    const filtered = filterCollectionRecords(filterUnitRecords(scoped, normalized), normalized);
    const groups = new Map();
    for (const record of filtered) {
      const key = getSchoolKey(record) || '__unknown__';
      const group = groups.get(key) || { key, label: getSchoolLabel(record), count: 0, years: new Set() };
      group.count += 1;
      const year = getExamYear(record);
      if (isValidExamYear(year)) group.years.add(year);
      groups.set(key, group);
    }
    return [...groups.values()]
      .map(group => ({ ...group, years: [...group.years].sort((a, b) => b - a) }))
      .sort((a, b) => compareText(a.label, b.label) || compareText(a.key, b.key));
  }

  function getCollectionYearOptions(records, profileOrId, options = {}) {
    const profile = getProfile(profileOrId || options.profile || options.profileId || 'h1');
    const normalized = normalizeCollectionOptions({ ...options, schoolKeys: [] });
    const scoped = getCollectionScopeRecords(records, profile, normalized);
    const filtered = filterCollectionRecords(filterUnitRecords(scoped, normalized), normalized);
    return [...new Set(filtered.map(getExamYear).filter(isValidExamYear))].sort((a, b) => b - a);
  }

  function compareCollectionRecords(a, b) {
    const schoolDiff = compareText(getSchoolKey(a), getSchoolKey(b));
    if (schoolDiff) return schoolDiff;
    const yearDiff = compareNewestYear(a, b);
    if (yearDiff) return yearDiff;
    const periodOrder = { '1mid': 1, '1final': 2, '2mid': 3, '2final': 4 };
    const periodDiff = (periodOrder[getPeriod(a.sourceFile)] || 99) - (periodOrder[getPeriod(b.sourceFile)] || 99);
    if (periodDiff) return periodDiff;
    const sourceDiff = compareText(getSourceExamKey(a), getSourceExamKey(b));
    return sourceDiff || getQuestionNo(a) - getQuestionNo(b);
  }

  function selectBalancedCollectionRecords(records, requestedCount) {
    const limit = Math.max(0, Number(requestedCount || 0));
    if (!limit) return [];
    const bySchool = new Map();
    for (const record of dedupeRecords(records)) {
      const schoolKey = getSchoolKey(record) || '__unknown__';
      if (!bySchool.has(schoolKey)) bySchool.set(schoolKey, []);
      bySchool.get(schoolKey).push(record);
    }
    const schoolPools = [...bySchool.entries()]
      .sort((a, b) => compareText(getSchoolLabel(a[1][0]), getSchoolLabel(b[1][0])) || compareText(a[0], b[0]))
      .map(([schoolKey, schoolRecords]) => {
        const byYear = new Map();
        schoolRecords.sort(compareCollectionRecords).forEach(record => {
          const year = getExamYear(record);
          if (!byYear.has(year)) byYear.set(year, []);
          byYear.get(year).push(record);
        });
        return {
          schoolKey,
          groups: [...byYear.entries()].sort((a, b) => archive2Core.recencyRank(a[0]) - archive2Core.recencyRank(b[0])).map(([year, items]) => ({ year, items, index: 0 })),
          pointer: 0
        };
      });
    const selected = [];
    while (selected.length < limit) {
      let progressed = false;
      for (const pool of schoolPools) {
        if (selected.length >= limit) break;
        if (!pool.groups.length) continue;
        for (let attempt = 0; attempt < pool.groups.length; attempt += 1) {
          const group = pool.groups[pool.pointer % pool.groups.length];
          pool.pointer += 1;
          if (group.index >= group.items.length) continue;
          selected.push(group.items[group.index]);
          group.index += 1;
          progressed = true;
          break;
        }
      }
      if (!progressed) break;
    }
    return selected.sort(compareCollectionRecords);
  }

  function buildCollectionPapers(records, profileOrId, options = {}) {
    const context = getCollectionSelectionContext(records, profileOrId, options);
    const { candidates, options: normalized, yearSelection } = context;
    const selectedSchoolKeys = normalized.schoolKeys.length
      ? normalized.schoolKeys
      : [...new Set(context.schoolFiltered.map(record => getSchoolKey(record) || '__unknown__'))];
    const recordsBySchool = new Map();
    const selectedBySchool = new Map();
    for (const record of candidates) {
      const key = getSchoolKey(record) || '__unknown__';
      if (!recordsBySchool.has(key)) recordsBySchool.set(key, []);
      recordsBySchool.get(key).push(record);
    }
    for (const [key, items] of recordsBySchool.entries()) items.sort(compareCollectionRecords);
    const schoolLabel = schoolKey => getSchoolLabel((recordsBySchool.get(schoolKey) || context.schoolFiltered.filter(record => (getSchoolKey(record) || '__unknown__') === schoolKey))[0] || { school: schoolKey });
    selectedSchoolKeys.sort((a, b) => compareText(schoolLabel(a), schoolLabel(b)) || compareText(a, b));

    const paperGroups = [];
    let shortage = 0;
    if (normalized.outputMode === 'school') {
      for (const schoolKey of selectedSchoolKeys) {
        const schoolRecords = recordsBySchool.get(schoolKey) || [];
        const selected = normalized.countMode === 'fixed' ? schoolRecords.slice(0, normalized.count) : schoolRecords.slice();
        if (normalized.countMode === 'fixed' && schoolRecords.length) shortage += Math.max(0, normalized.count - selected.length);
        selectedBySchool.set(schoolKey, selected);
        const chunks = splitIntoPapers(selected, { target: normalized.target, max: normalized.max, compare: compareCollectionRecords });
        chunks.forEach((paperRecords, index) => paperGroups.push({
          records: paperRecords, schoolKey, school: getSchoolLabel(schoolRecords[0] || { school: schoolKey }), index: index + 1
        }));
      }
    } else {
      const selected = normalized.countMode === 'fixed'
        ? selectBalancedCollectionRecords(candidates, normalized.count)
        : candidates.slice().sort(compareCollectionRecords);
      if (normalized.countMode === 'fixed') shortage = Math.max(0, normalized.count - selected.length);
      selected.forEach(record => {
        const key = getSchoolKey(record) || '__unknown__';
        if (!selectedBySchool.has(key)) selectedBySchool.set(key, []);
        selectedBySchool.get(key).push(record);
      });
      const chunks = splitIntoPapers(selected, { target: normalized.target, max: normalized.max, compare: compareCollectionRecords });
      chunks.forEach((paperRecords, index) => paperGroups.push({ records: paperRecords, schoolKey: '', school: '학교 통합', index: index + 1 }));
    }

    const schools = selectedSchoolKeys.map(schoolKey => {
      const schoolRecords = recordsBySchool.get(schoolKey) || [];
      return {
        key: schoolKey,
        label: getSchoolLabel(schoolRecords[0] || { school: schoolKey }),
        candidateCount: schoolRecords.length,
        selectedCount: (selectedBySchool.get(schoolKey) || []).length,
        years: yearSelection.bySchool[schoolKey] || [],
        coverage: normalized.yearMode === 'recentAvailable'
          ? { selected: (yearSelection.bySchool[schoolKey] || []).length, requested: normalized.yearCount }
          : null,
        coverageLabel: normalized.yearMode === 'recentAvailable'
          ? `${(yearSelection.bySchool[schoolKey] || []).length}/${normalized.yearCount}개년`
          : ''
      };
    });
    const selectedCount = paperGroups.reduce((sum, paper) => sum + paper.records.length, 0);
    return {
      ok: selectedCount > 0,
      complete: selectedCount > 0 && shortage === 0,
      options: normalized,
      scopeUnits: getCollectionScopeUnits(context.profile, normalized),
      candidateCount: candidates.length,
      selectedCount,
      shortage,
      yearSelection,
      schools,
      records: candidates,
      papers: paperGroups,
      outputMode: normalized.outputMode
    };
  }

  function stableSelectionScore(record, seed) {
    return fnv1a(`${String(seed || 'unitpast-default')}|${getRecordIdentity(record)}`);
  }

  // Selection order: the newest school year first (RECENCY_POLICY: 2026, 2025, ...,
  // unknown years last); inside a year approved-metadata items first; then a
  // seed-stable random order. The sort keys are computed once per record, not once per comparison.
  function sortForSelection(records, seed) {
    const rows = records.map(record => ({
      record,
      recency: recencyRankOf(record),
      approved: isMetadataApproved(record) ? 0 : 1,
      score: stableSelectionScore(record, seed)
    }));
    rows.sort((a, b) =>
      a.recency - b.recency || a.approved - b.approved ||
      compareText(a.score, b.score) || compareRecords(a.record, b.record));
    return rows.map(row => row.record);
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
      conceptLabels: options.conceptLabels || [],
      problemTypeKeys: options.problemTypeKeys || [],
      templateKeys: options.templateKeys || [],
      approvedOnly: options.approvedOnly === true,
      difficultyBuckets: options.allowAdjacentDifficulty ? [] : (options.difficultyBuckets || []),
      includeUnclassified: options.includeUnclassified === true
    }));
    if (requestedCount > limit) {
      return {
        selected: [], candidates: pool,
        rows: normalizedRows.map((row, index) => ({
          index,
          subUnitKey: String(row.subUnitKey || '').trim(),
          conceptLabel: String(row.conceptLabel || '').trim(),
          problemTypeKey: String(row.problemTypeKey || '').trim(),
          templateKey: String(row.templateKey || '').trim(),
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
      const rowConceptLabels = row.conceptLabels || (row.conceptLabel ? [row.conceptLabel] : []);
      const rowProblemTypeKeys = row.problemTypeKeys || (row.problemTypeKey ? [row.problemTypeKey] : []);
      const rowTemplateKeys = row.templateKeys || (row.templateKey ? [row.templateKey] : []);
      const rowDifficultyBuckets = row.difficultyBuckets || (row.difficultyBucket ? [row.difficultyBucket] : []);
      const hasRowDifficulty = rowDifficultyBuckets.length > 0;
      const strictBuckets = hasRowDifficulty ? rowDifficultyBuckets : (options.difficultyBuckets || []);
      const rowCandidates = dedupeRecords(filterUnitRecords(pool, {
        subUnitKeys: rowSubUnitKeys,
        conceptLabels: rowConceptLabels,
        problemTypeKeys: rowProblemTypeKeys,
        templateKeys: rowTemplateKeys,
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
            conceptLabels: rowConceptLabels,
            problemTypeKeys: rowProblemTypeKeys,
            templateKeys: rowTemplateKeys,
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
        conceptLabel: String(row.conceptLabel || '').trim(),
        problemTypeKey: String(row.problemTypeKey || '').trim(),
        templateKey: String(row.templateKey || '').trim(),
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
      difficultyStep: getDifficultyStep(record),
      legacyDifficultyLabel: getLegacyDifficultyLabel(record),
      problemTypeKey: getProblemTypeKey(record),
      templateKey: getTemplateKey(record),
      L3: getProblemTypeLabel(record),
      L4: getTemplateLabel(record),
      defaultSelectable: isDefaultSelectable(record),
      generalUseEligible: isGeneralUseEligible(record),
      metaFoundationOwnedScope: record.metaFoundationOwnedScope === true,
      metaFoundationTaxonomyValid: record.metaFoundationTaxonomyValid === true,
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
    const comparator = typeof options.compare === 'function' ? options.compare : compareRecords;
    const sorted = [...records].sort(comparator);
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

  // Papers of one unit for a difficulty-step selection (default: every step). User decision 2026-11-10:
  // the newest year always comes first, so the selected records are first cut into papers in recency
  // order (compareRecords: newest year, then exam period; target / hard max, one exam kept together),
  // which makes paper 1 the newest exams. Only then is each paper ordered step 1 -> 5 -> 단계 미지정
  // (legacy 하 -> 중 -> 상 -> 없음 inside it) so the step headings (sections) stay per paper.
  function buildStepPapers(unit, records, scope, options = {}) {
    const tokens = normalizeStepSelection(options.difficultySteps);
    const selected = tokens.length ? records.filter(record => tokens.includes(getStepToken(record))) : records;
    const split = splitIntoPapers(selected, {
      target: options.target || scope.targetQuestionsPerPaper,
      max: options.max || scope.hardMaxQuestionsPerPaper,
      compare: compareRecords
    }).map(paperRecords => [...paperRecords].sort(compareStepRecords));
    const label = stepSelectionLabel(tokens);
    const base = label ? `${unit.name} · ${label}` : unit.name;
    return split.map((paperRecords, index) => ({
      index: index + 1,
      title: split.length === 1 ? base : `${base} · 문제지 ${index + 1}`,
      count: paperRecords.length,
      sourceCount: new Set(paperRecords.map(record => record.sourceFile)).size,
      records: paperRecords,
      stepGrouped: true,
      difficultySteps: tokens,
      stepSummary: summarizeSteps(paperRecords),
      sections: buildStepSections(paperRecords),
      snapshotKey: buildSnapshotKey(unit.key, paperRecords, scope, { difficultySteps: tokens })
    }));
  }

  function buildUnitPapers(unit, options = {}) {
    if (!unit || !Array.isArray(unit.selectableRecords)) return [];
    return buildStepPapers(unit, unit.selectableRecords, options.scope || unit.paperScope || COMMON_SCOPE, options);
  }

  // ---- 여러 단원 x 여러 단계 선택 (단원 x 단계 표) ----------------------------------------------------
  // User decision 2026-11-10: teachers pick many units and difficulty steps at once. Default = every
  // question of the chosen cells; "칸마다 N문항" takes at most N per cell and a cell with fewer questions
  // simply gives what it has (reported in `shortages`, never an error). One question is used once.
  const SELECTION_ORDERS = Object.freeze(['recent', 'unit', 'step']);
  const DEFAULT_SELECTION_SEED = 'unitpast-grid-v1';

  function normalizeStepCell(value) {
    if (value === null || value === undefined || value === '') return STEP_NONE;
    const text = String(value).trim();
    if (STEP_TOKENS.includes(text)) return text;
    if (/^(?:none|unknown)$/i.test(text)) return STEP_NONE;
    return null;
  }

  // ---- 유형 거르기 (단원별 기출 표의 "유형" 패널) ----
  // 한 문항의 유형은 problemTypeKey다. 키나 이름이 없거나 유형 연결이 끊긴(isProblemTypeSelectable 거짓) 문항은 모두
  // "유형 미지정"(NO_TYPE_KEY)으로 본다. 중학교는 유형 채움이 7~16%라 미지정이 대부분이므로 선택지로 반드시 둔다.
  // 거르기는 "뺄 유형 목록"(excluded)으로 표현한다: 기본(빈 목록)은 전부이고, 고른 단원이 바뀌어도 새 유형은 켜진 채 나타난다.
  // filterUnitRecords는 미지정 문항을 빼므로 쓰지 않는다.
  const NO_TYPE_KEY = '__none__';

  function getFilterTypeKey(record) {
    const key = getProblemTypeKey(record);
    return key && getProblemTypeLabel(record) && isProblemTypeSelectable(record) ? key : NO_TYPE_KEY;
  }

  function normalizeExcludedTypeKeys(input) {
    return [...new Set((Array.isArray(input) ? input : input instanceof Set ? [...input] : [])
      .map(value => String(value || '').trim()).filter(Boolean))].sort();
  }

  // (record) => boolean. 빼는 유형이 없으면 null(거르지 않음).
  function createTypeFilter(excluded) {
    const keys = new Set(normalizeExcludedTypeKeys(excluded));
    return keys.size ? record => !keys.has(getFilterTypeKey(record)) : null;
  }

  // 유형 패널의 선택지: { options: [{ key, label, count }] (많은 순), noneCount, total }.
  function getTypeFilterOptions(records) {
    const groups = new Map();
    let noneCount = 0;
    let total = 0;
    for (const record of Array.isArray(records) ? records : []) {
      total += 1;
      const key = getFilterTypeKey(record);
      if (key === NO_TYPE_KEY) { noneCount += 1; continue; }
      const group = groups.get(key) || { key, label: getProblemTypeLabel(record), count: 0 };
      group.count += 1;
      groups.set(key, group);
    }
    return { options: [...groups.values()].sort((a, b) => b.count - a.count || compareText(a.label, b.label)), noneCount, total };
  }

  // ---- 출처 거르기 (단원별 기출 표의 "조건 줄": 학교·연도·시험·학기) ----
  // 사용자 결정 2026-11-16: 학교별·연도별로 단원별 기출을 뽑아 "그 학교 시험이 전체적으로 어떤 모양인지" 학생이 알 수 있게 한다.
  // 옛 모아뽑기의 계산 규칙을 그대로 쓴다(학교·연도·학기·중간/기말, "최근 N년"은 학교마다 자료가 있는 최신 N개 연도).
  // 조건이 하나도 없으면 active=false이고 keep=null이라 표·문제지가 조건을 모르던 때와 같다.
  const SOURCE_YEAR_MODES = Object.freeze(['all', 'recent', 'range']);

  function normalizeSourceOptions(input) {
    const source = input && typeof input === 'object' ? input : {};
    const rawSchools = Array.isArray(source.schoolKeys) ? source.schoolKeys : source.schoolKeys instanceof Set ? [...source.schoolKeys] : String(source.schoolKeys || '').split(',');
    const schoolKeys = [...new Set(rawSchools.map(value => String(value || '').trim()).filter(Boolean))].sort();
    let yearMode = SOURCE_YEAR_MODES.includes(source.yearMode) ? source.yearMode : 'all';
    const yearCount = Number(source.yearCount) === 5 ? 5 : 3;
    const toYear = value => (Number(value) ? normalizeExamYear(value) : 0);
    let yearFrom = toYear(source.yearFrom);
    let yearTo = toYear(source.yearTo);
    if (!isValidExamYear(yearFrom)) yearFrom = 0;
    if (!isValidExamYear(yearTo)) yearTo = 0;
    if (yearMode === 'range') {
      if (!yearFrom && !yearTo) yearMode = 'all';
      else {
        if (!yearFrom) yearFrom = yearTo;
        if (!yearTo) yearTo = yearFrom;
        if (yearFrom > yearTo) [yearFrom, yearTo] = [yearTo, yearFrom];
      }
    } else { yearFrom = 0; yearTo = 0; }
    return {
      schoolKeys, yearMode, yearCount: yearMode === 'recent' ? yearCount : 3, yearFrom, yearTo,
      examType: normalizeCollectionExamType(source.examType), semester: normalizeCollectionSemester(source.semester),
      // 학교를 2곳 이상 골랐을 때만 뜻이 있다: 'school' = 학교마다 따로 권, 'mixed' = 한 권으로 섞기.
      group: source.group === 'school' && schoolKeys.length >= 2 ? 'school' : 'mixed'
    };
  }

  // 같은 조건이면 같은 문자열, 조건이 없으면 ''. 권의 snapshotKey와 표 숫자 저장에 쓴다.
  function sourceOptionsKey(options) {
    const o = normalizeSourceOptions(options);
    const parts = [];
    if (o.schoolKeys.length) parts.push(`s=${o.schoolKeys.join(',')}`);
    if (o.yearMode === 'recent') parts.push(`y=r${o.yearCount}`);
    else if (o.yearMode === 'range') parts.push(`y=${o.yearFrom}-${o.yearTo}`);
    if (o.examType) parts.push(`x=${o.examType}`);
    if (o.semester) parts.push(`m=${o.semester}`);
    return parts.join(';');
  }

  function sourcePeriodText(options) {
    const o = normalizeSourceOptions(options);
    return [o.semester ? `${o.semester}학기` : '', o.examType ? (o.examType === 'mid' ? '중간고사' : '기말고사') : ''].filter(Boolean).join(' ');
  }

  function sourceYearText(options) {
    const o = normalizeSourceOptions(options);
    if (o.yearMode === 'recent') return `최근 ${o.yearCount}년`;
    if (o.yearMode === 'range') return o.yearFrom === o.yearTo ? `${o.yearFrom}년` : `${o.yearFrom}~${o.yearTo}년`;
    return '';
  }

  // universe: 그 학년의 문항 전부(보통 모든 단원의 selectableRecords). "최근 N년"은 그 학교의 (학기·시험을 거른 뒤) 자료가 있는 최신 N개 연도다.
  // 반환: { active, options, key, keep(record) | null, yearsOf(schoolKey) }
  function createSourceFilter(universe, input) {
    const options = normalizeSourceOptions(input);
    const key = sourceOptionsKey(options);
    const active = Boolean(key);
    if (!active) return { active: false, options, key: '', keep: null, yearsOf: () => [] };
    const schools = new Set(options.schoolKeys);
    const periodOk = record => (!options.semester || getSemester(record) === options.semester) && (!options.examType || getExamType(record) === options.examType);
    const schoolOf = record => getSchoolKey(record) || '__unknown__';
    let allowed = null;
    if (options.yearMode === 'recent') {
      const yearsBySchool = new Map();
      for (const record of Array.isArray(universe) ? universe : []) {
        if (!periodOk(record)) continue;
        const year = getExamYear(record);
        if (!isValidExamYear(year)) continue;
        const school = schoolOf(record);
        if (!yearsBySchool.has(school)) yearsBySchool.set(school, new Set());
        yearsBySchool.get(school).add(year);
      }
      allowed = new Map([...yearsBySchool].map(([school, years]) => [school, new Set([...years].sort((a, b) => b - a).slice(0, options.yearCount))]));
    }
    const yearOk = record => {
      if (options.yearMode === 'all') return true;
      const year = getExamYear(record);
      if (!isValidExamYear(year)) return false;
      if (options.yearMode === 'range') return year >= options.yearFrom && year <= options.yearTo;
      const years = allowed.get(schoolOf(record));
      return Boolean(years && years.has(year));
    };
    return {
      active, options, key,
      keep: record => periodOk(record) && (!schools.size || schools.has(schoolOf(record))) && yearOk(record),
      yearsOf: schoolKey => (allowed && allowed.get(schoolKey) ? [...allowed.get(schoolKey)].sort((a, b) => b - a) : [])
    };
  }

  // 학교 고르기 목록: 그 학년에 기출이 있는 학교와 (학교를 뺀 나머지 조건으로 센) 문항 수, 문항이 많은 학교부터.
  function getSourceSchoolOptions(universe, input) {
    const filter = createSourceFilter(universe, { ...normalizeSourceOptions(input), schoolKeys: [] });
    const groups = new Map();
    for (const record of Array.isArray(universe) ? universe : []) {
      const school = getSchool(record);
      if (!school) continue;
      const schoolKey = getSchoolKey(record);
      const group = groups.get(schoolKey) || { key: schoolKey, label: school, count: 0, total: 0, years: new Set() };
      group.total += 1;
      if (!filter.keep || filter.keep(record)) {
        group.count += 1;
        const year = getExamYear(record);
        if (isValidExamYear(year)) group.years.add(year);
      }
      groups.set(schoolKey, group);
    }
    return [...groups.values()]
      .map(group => ({ ...group, years: [...group.years].sort((a, b) => b - a) }))
      .sort((a, b) => b.count - a.count || compareText(a.label, b.label) || compareText(a.key, b.key));
  }

  // Cell counts per unit: { [unitKey]: { 1..5, none, total, children?: { [childKey]: { 1..5, none, total } } } }. Computed per
  // grade by the screen (never inside a render), from the units' automatically selectable records.
  // options.childOf(record, unit) -> childKey ('' = no child): adds the per-중단원/소단원 rows (Archive2UnitTree).
  // options.excludedTypeKeys: records of an excluded 유형 are not counted (same rule as buildSelectionPapers).
  // options.sourceFilter: createSourceFilter(...) 결과. 학교·연도·시험·학기 조건에 맞는 문항만 센다(조건이 없으면 모르는 척한다).
  function countGrid(units, options = {}) {
    const childOf = typeof options.childOf === 'function' ? options.childOf : null;
    const typeKeep = createTypeFilter(options.excludedTypeKeys);
    const sourceKeep = options.sourceFilter && options.sourceFilter.active ? options.sourceFilter.keep : null;
    const keep = typeKeep && sourceKeep ? record => typeKeep(record) && sourceKeep(record) : typeKeep || sourceKeep;
    const blank = () => ({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, [STEP_NONE]: 0, total: 0 });
    const grid = {};
    for (const unit of Array.isArray(units) ? units : []) {
      const row = blank();
      const children = childOf ? {} : null;
      for (const record of Array.isArray(unit && unit.selectableRecords) ? unit.selectableRecords : []) {
        if (keep && !keep(record)) continue;
        const token = getStepToken(record);
        row[token] += 1;
        row.total += 1;
        if (children) {
          const childKey = childOf(record, unit);
          if (childKey) {
            const child = children[childKey] || (children[childKey] = blank());
            child[token] += 1;
            child.total += 1;
          }
        }
      }
      if (children) row.children = children;
      grid[unit.key] = row;
    }
    return grid;
  }

  function selectionStepLabel(tokens) {
    const list = STEP_TOKENS.filter(token => tokens.includes(token));
    if (!list.length) return '';
    if (list.length === STEP_TOKENS.length) return '전체 단계';
    const numeric = list.filter(token => token !== STEP_NONE).map(Number);
    let text = '';
    if (numeric.length === 1) text = `${numeric[0]}단계`;
    else if (numeric.length > 1) {
      const contiguous = numeric[numeric.length - 1] - numeric[0] + 1 === numeric.length;
      text = contiguous ? `${numeric[0]}~${numeric[numeric.length - 1]}단계` : `${numeric.join('·')}단계`;
    }
    if (list.includes(STEP_NONE)) text = text ? `${text} · ${STEP_LABEL_NONE}` : STEP_LABEL_NONE;
    return text;
  }

  function selectionUnitLabel(unitNames) {
    if (unitNames.length <= 1) return unitNames[0] || '';
    return `${unitNames[0]} 외 ${unitNames.length - 1}단원`;
  }

  // Headings of a paper built from several units. `primary: 'unit'` = unit heading (level 1) with the
  // step as sub heading; `primary: 'step'` = step heading with the unit as sub heading. A one-unit
  // selection has no unit heading (same look as buildStepSections).
  function buildSelectionSections(records, options = {}) {
    const list = Array.isArray(records) ? records : [];
    const primaryUnit = options.primary === 'unit';
    const showUnit = options.showUnit !== false;
    const nameOf = options.unitNames instanceof Map ? options.unitNames : new Map();
    const sections = [];
    let prevUnit = null;
    let prevToken = null;
    let prevLegacy = null;
    list.forEach((record, index) => {
      const unitKey = String(record.mappedUnitKey || '');
      const token = getStepToken(record);
      const uid = getQuestionUid(record);
      const unitTitle = nameOf.get(unitKey) || String(record.mappedUnit || '') || unitKey;
      const push = (title, level) => sections.push({ at: index, uid, title, level });
      const first = prevUnit === null;
      const unitChanged = unitKey !== prevUnit;
      const tokenChanged = token !== prevToken;
      if (primaryUnit && showUnit) {
        if (first || unitChanged) push(unitTitle, 1);
        if (first || unitChanged || tokenChanged) push(stepTokenLabel(token), 2);
      } else if (primaryUnit) {
        if (first || tokenChanged) push(stepTokenLabel(token), 1);
      } else {
        if (first || tokenChanged) push(stepTokenLabel(token), 1);
        if (showUnit && (first || tokenChanged || unitChanged)) push(unitTitle, 2);
      }
      if (token === STEP_NONE) {
        const legacy = getLegacyDifficultyLabel(record);
        if (first || tokenChanged || unitChanged || legacy !== prevLegacy) push(`기존 분류: ${legacy}`, 2);
        prevLegacy = legacy;
      } else prevLegacy = null;
      prevUnit = unitKey;
      prevToken = token;
    });
    return sections;
  }

  // selection: [{ unitKey, step, childKey? }] (step 1..5, or 'none' / null / 'UNKNOWN' = 단계 미지정).
  //   childKey = 그 단원의 중단원(중등) / 소단원 묶음(고등) 하나만(Archive2UnitTree가 정한 키). 없으면 단원 전체.
  //   단원 전체 칸이 같은 단계에 있으면 그 단원의 중단원 칸은 이미 들어 있으므로 따로 세지 않는다.
  // options: { units | catalog, perCell: null | N, order: 'recent' | 'unit' | 'step', seed, target, max,
  //   childOf(record, unit) -> childKey (childKey 칸을 쓰려면 필요), childName(unitKey, childKey) -> 이름(권 제목용),
  //   childRank(unitKey, childKey) -> 목차 순서, excludedTypeKeys: 뺄 유형(NO_TYPE_KEY = 유형 미지정) }.
  //   recent: papers are cut newest year first (paper 1 = newest); inside a paper unit -> easy step first.
  //   unit:   papers are cut in unit order; inside a paper unit -> step -> newest year.
  //   step:   papers are cut easy step first; inside a paper step -> unit -> newest year.
  // Never throws for an empty selection, an unknown unit or an empty cell: it returns what exists.
  function buildSelectionPapers(selection, options = {}) {
    const units = Array.isArray(options.units) ? options.units : (options.catalog && Array.isArray(options.catalog.units) ? options.catalog.units : []);
    const unitByKey = new Map(units.map((unit, index) => [unit.key, { unit, index }]));
    const rawPerCell = Number(options.perCell);
    const perCell = Number.isFinite(rawPerCell) && rawPerCell >= 1 ? Math.floor(rawPerCell) : null;
    const order = SELECTION_ORDERS.includes(options.order) ? options.order : 'recent';
    const seed = options.seed || DEFAULT_SELECTION_SEED;
    const childOf = typeof options.childOf === 'function' ? options.childOf : null;
    const childNameOf = typeof options.childName === 'function' ? options.childName : () => '';
    const childRankOf = typeof options.childRank === 'function' ? options.childRank : () => 0;
    const excludedTypeKeys = normalizeExcludedTypeKeys(options.excludedTypeKeys);
    const typeFilter = createTypeFilter(excludedTypeKeys);
    // 학교·연도·시험·학기 조건(createSourceFilter 결과). 없거나 조건이 없으면 모르는 척한다.
    const sourceFilter = options.sourceFilter && options.sourceFilter.active ? options.sourceFilter : null;
    const poolKeep = typeFilter && sourceFilter ? record => typeFilter(record) && sourceFilter.keep(record) : typeFilter || (sourceFilter ? sourceFilter.keep : null);
    const groupBySchool = Boolean(sourceFilter && sourceFilter.options.group === 'school');
    const schoolOf = record => getSchoolKey(record) || '__unknown__';
    const scopeKeyOf = (unitKey, childKey) => (childKey ? `${unitKey}~${childKey}` : unitKey);

    const cellMap = new Map();
    for (const raw of Array.isArray(selection) ? selection : []) {
      const found = raw && unitByKey.get(String(raw.unitKey || '').trim());
      const token = raw ? normalizeStepCell(raw.step) : null;
      if (!found || !token) continue;
      const childKey = childOf ? String(raw.childKey || '').trim() : '';
      cellMap.set(`${scopeKeyOf(found.unit.key, childKey)}|${token}`, { unitKey: found.unit.key, childKey, step: token, unitIndex: found.index });
    }
    const wholeUnitCells = new Set([...cellMap.values()].filter(cell => !cell.childKey).map(cell => `${cell.unitKey}|${cell.step}`));
    const cells = [...cellMap.values()]
      .filter(cell => !cell.childKey || !wholeUnitCells.has(`${cell.unitKey}|${cell.step}`))
      .sort((a, b) => a.unitIndex - b.unitIndex || STEP_TOKENS.indexOf(a.step) - STEP_TOKENS.indexOf(b.step) ||
        (a.childKey ? childRankOf(a.unitKey, a.childKey) : -1) - (b.childKey ? childRankOf(b.unitKey, b.childKey) : -1));

    // 이미 준 문항(givenUids: 이 학생·반에게 준 문항 UID 집합): 칸마다 N문항이면 새 문항으로 먼저 채우고 모자랄 때만 이미 준 문항으로
    // 채운다(빈 자리보다 겹침이 낫다). N을 정하지 않은 "있는 만큼 전부"는 이미 준 문항을 뺀다.
    // 옵션이 없거나 비어 있으면 아래 코드는 이전과 같은 결과를 낸다.
    const givenSet = options.givenUids instanceof Set && options.givenUids.size ? options.givenUids : null;
    const isGiven = givenSet ? record => { const uid = getQuestionUid(record); return Boolean(uid) && givenSet.has(uid); } : null;
    const newFirst = isGiven ? list => [...list.filter(record => !isGiven(record)), ...list.filter(isGiven)] : list => list;
    let taken, picked, unitIndexOf, scopeOfRecord, cellReports, givenSeen;
    const runPicking = dropGiven => {
      taken = new Set();
      picked = [];
      unitIndexOf = new Map();
      scopeOfRecord = new Map();
      cellReports = [];
      givenSeen = new Set(); // 고른 칸 후보 중 이미 준 문항(칸이 겹쳐도 한 번만 센다)
      for (const cell of cells) {
        const unit = unitByKey.get(cell.unitKey).unit;
        const scopeKey = scopeKeyOf(cell.unitKey, cell.childKey);
        const pool = (Array.isArray(unit.selectableRecords) ? unit.selectableRecords : []).filter(record =>
          getStepToken(record) === cell.step &&
          (!cell.childKey || childOf(record, unit) === cell.childKey) &&
          (!poolKeep || poolKeep(record)));
        if (isGiven) for (const record of pool) if (isGiven(record)) givenSeen.add(getRecordIdentity(record));
        // 학교별로 한 권씩이면 "칸마다 N문항"은 학교마다 N문항이다(한 학교가 칸을 차지하지 않게).
        let ordered;
        let wanted = perCell;
        if (perCell && groupBySchool) {
          const bySchool = new Map();
          for (const record of pool) { const school = schoolOf(record); if (!bySchool.has(school)) bySchool.set(school, []); bySchool.get(school).push(record); }
          ordered = [...bySchool.entries()].sort((a, b) => compareText(getSchoolLabel(a[1][0]), getSchoolLabel(b[1][0])) || compareText(a[0], b[0]))
            .flatMap(([school, items]) => newFirst(sortForSelection(items, `${seed}|${scopeKey}|${cell.step}|${school}`)));
          wanted = perCell * bySchool.size;
        } else ordered = perCell ? newFirst(sortForSelection(pool, `${seed}|${scopeKey}|${cell.step}`)) : pool;
        let got = 0;
        const gotBySchool = new Map();
        for (const record of ordered) {
          if (perCell) {
            if (groupBySchool) { if ((gotBySchool.get(schoolOf(record)) || 0) >= perCell) continue; }
            else if (got >= perCell) break;
          }
          if (dropGiven && isGiven(record)) continue;
          const identity = getRecordIdentity(record);
          if (taken.has(identity)) continue;
          taken.add(identity);
          picked.push(record);
          unitIndexOf.set(record, cell.unitIndex);
          scopeOfRecord.set(record, scopeKey);
          got += 1;
          if (groupBySchool) gotBySchool.set(schoolOf(record), (gotBySchool.get(schoolOf(record)) || 0) + 1);
        }
        cellReports.push({ unitKey: cell.unitKey, childKey: cell.childKey, scopeKey, step: cell.step, available: pool.length, wanted, got });
      }
    };
    runPicking(Boolean(isGiven) && !perCell);
    // 있는 만큼 전부인데 고른 범위가 전부 이미 준 문항이면 빈 문제지 대신 그 문항을 그대로 넣는다.
    let allGivenFallback = false;
    if (isGiven && !perCell && !picked.length && givenSeen.size) { allGivenFallback = true; runPicking(false); }
    const shortages = perCell
      ? cellReports.filter(cell => cell.got < cell.wanted).map(cell => ({ unitKey: cell.unitKey, childKey: cell.childKey, scopeKey: cell.scopeKey, step: cell.step, wanted: cell.wanted, got: cell.got }))
      : [];

    const base = { order, perCell, cells: cellReports, shortages, total: picked.length, papers: [], unitKeys: [], seed, excludedTypeKeys, scopes: [], groupBy: 'mixed', sourceKey: '', sourceLabel: '', schools: [] };
    if (givenSet) {
      // excluded = 고른 칸 후보 중 이미 준 문항인데 결과에서 빠진 수, overlap = 모자라서 이미 준 문항으로 채운 수.
      const overlap = picked.filter(isGiven).length;
      base.given = { active: true, candidates: givenSeen.size, excluded: givenSeen.size - overlap, overlap, allGiven: allGivenFallback };
    }
    if (!picked.length) return base;

    const usedCells = cellReports.filter(cell => cell.got > 0);
    const usedUnitIndexes = [...new Set(usedCells.map(cell => unitByKey.get(cell.unitKey).index))].sort((a, b) => a - b);
    const usedUnits = usedUnitIndexes.map(index => units[index]);
    const usedTokens = [...new Set(usedCells.map(cell => cell.step))];
    const unitNames = new Map(usedUnits.map(unit => [unit.key, unit.name]));
    const multiUnit = usedUnits.length > 1;
    // 표의 한 줄(단원 하나 또는 단원의 중단원 하나)마다 한 항목: 요약표·권 제목·권 줄이 같은 이름을 쓴다.
    const scopeMap = new Map();
    for (const cell of usedCells) {
      if (scopeMap.has(cell.scopeKey)) continue;
      const unit = unitByKey.get(cell.unitKey).unit;
      const childLabel = cell.childKey ? (childNameOf(cell.unitKey, cell.childKey) || cell.childKey) : '';
      scopeMap.set(cell.scopeKey, {
        scopeKey: cell.scopeKey, unitKey: cell.unitKey, childKey: cell.childKey, unitIndex: unitByKey.get(cell.unitKey).index,
        rank: cell.childKey ? childRankOf(cell.unitKey, cell.childKey) : -1,
        label: childLabel ? `${unit.name} › ${childLabel}` : unit.name, childLabel
      });
    }
    const scopes = [...scopeMap.values()].sort((a, b) => a.unitIndex - b.unitIndex || a.rank - b.rank)
      .map(({ unitIndex, rank, ...scope }) => scope);
    const unitScopeLabel = unit => {
      const own = scopes.filter(scope => scope.unitKey === unit.key);
      if (!own.length || own.some(scope => !scope.childKey)) return unit.name;
      return own.length === 1 ? own[0].label : `${unit.name} › ${own[0].childLabel} 외 ${own.length - 1}`;
    };
    const uIdx = record => (unitIndexOf.has(record) ? unitIndexOf.get(record) : 9999);
    const stepOf = record => getStepSortKey(record);
    const legacyThenRest = compareStepRecords;
    const cutCompare = order === 'unit'
      ? (a, b) => uIdx(a) - uIdx(b) || compareRecords(a, b)
      : order === 'step'
        ? (a, b) => stepOf(a).step - stepOf(b).step || stepOf(a).legacy - stepOf(b).legacy || compareRecords(a, b)
        : compareRecords;
    const innerCompare = order === 'step'
      ? (a, b) => stepOf(a).step - stepOf(b).step || stepOf(a).legacy - stepOf(b).legacy || uIdx(a) - uIdx(b) || legacyThenRest(a, b)
      : (a, b) => uIdx(a) - uIdx(b) || legacyThenRest(a, b);

    const scope = (usedUnits[0] && usedUnits[0].paperScope) || options.scope || COMMON_SCOPE;
    const splitOptions = { target: options.target || scope.targetQuestionsPerPaper, max: options.max || scope.hardMaxQuestionsPerPaper, compare: cutCompare };
    const sortInner = records => [...records].sort(innerCompare);
    // books: 한 권마다 { records, schoolKey, school, bookIndex, bookTotal }. 학교별로 한 권씩이면 학교마다 따로 나누고 번호도 학교 안에서 센다.
    let books;
    if (groupBySchool) {
      const bySchool = new Map();
      for (const record of picked) { const school = schoolOf(record); if (!bySchool.has(school)) bySchool.set(school, []); bySchool.get(school).push(record); }
      books = [];
      for (const [schoolKey, items] of [...bySchool.entries()].sort((a, b) => compareText(getSchoolLabel(a[1][0]), getSchoolLabel(b[1][0])) || compareText(a[0], b[0]))) {
        const parts = splitIntoPapers(items, splitOptions).map(sortInner);
        parts.forEach((records, i) => books.push({ records, schoolKey, school: getSchoolLabel(records[0]), bookIndex: i + 1, bookTotal: parts.length }));
      }
    } else {
      const parts = splitIntoPapers(picked, splitOptions).map(sortInner);
      books = parts.map((records, i) => ({ records, schoolKey: '', school: '', bookIndex: i + 1, bookTotal: parts.length }));
    }
    const yearRangeText = records => {
      const years = records.map(getExamYear).filter(isValidExamYear);
      return years.length ? (Math.min(...years) === Math.max(...years) ? String(years[0]) : `${Math.min(...years)}~${Math.max(...years)}`) : '';
    };
    // 조건 줄을 쓴 권: 제목 앞에 학교·연도·시험을 붙인다(조건이 없으면 붙이지 않아 옛 제목·키와 같다).
    const pickedSchools = [];
    if (sourceFilter) {
      const counts = new Map();
      for (const record of picked) { const school = schoolOf(record); counts.set(school, (counts.get(school) || 0) + 1); }
      pickedSchools.push(...[...counts.entries()].map(([key, count]) => ({ key, count, label: getSchoolLabel(picked.find(record => schoolOf(record) === key)) }))
        .sort((a, b) => compareText(a.label, b.label) || compareText(a.key, b.key)));
    }
    const sourcePeriod = sourceFilter ? sourcePeriodText(sourceFilter.options) : '';
    const sourceYear = sourceFilter ? sourceYearText(sourceFilter.options) : '';
    const schoolsText = sourceFilter && sourceFilter.options.schoolKeys.length && pickedSchools.length ? (pickedSchools.length === 1 ? pickedSchools[0].label : `${pickedSchools[0].label} 외 ${pickedSchools.length - 1}교`) : '';
    const sourceLabel = [schoolsText, sourceYear, sourcePeriod].filter(Boolean).join(' · ');

    const unitLabel = selectionUnitLabel(usedUnits.map(unitScopeLabel));
    const stepLabel = selectionStepLabel(usedTokens);
    const baseTitle = [unitLabel, stepLabel].filter(Boolean).join(' · ');
    const snapshotUnitKey = usedUnits.length === 1 ? usedUnits[0].key : `multi-${fnv1a(usedUnits.map(unit => unit.key).join(','))}`;
    const difficultySteps = normalizeStepSelection(usedTokens);
    const sectionOptions = { primary: order === 'step' || !multiUnit ? 'step' : 'unit', showUnit: multiUnit, unitNames };
    // 같은 조건이면 같은 키가 되도록 고른 중단원·소단원과 (거르기를 켰을 때) 남은 유형을 키에 넣는다. 안 쓰면 비어 있어 옛 키와 같다.
    const subUnitKeys = [...new Set(usedCells.filter(cell => cell.childKey).map(cell => cell.scopeKey))].sort();
    const problemTypeKeys = typeFilter ? [...new Set(picked.map(getFilterTypeKey))].sort() : [];
    base.unitKeys = usedUnits.map(unit => unit.key);
    base.unitNames = usedUnits.map(unit => unit.name);
    base.courses = [...new Set(usedUnits.map(unit => unit.course))];
    base.stepLabel = stepLabel;
    base.unitLabel = unitLabel;
    base.snapshotUnitKey = snapshotUnitKey;
    base.scopes = scopes;
    base.groupBy = groupBySchool ? 'school' : 'mixed';
    base.sourceKey = sourceFilter ? sourceFilter.key : '';
    base.sourceLabel = sourceLabel;
    base.schools = pickedSchools;
    base.papers = books.map((book, index) => {
      const records = book.records;
      const years = records.map(getExamYear).filter(isValidExamYear);
      const prefix = !sourceFilter ? '' : groupBySchool ? [book.school, yearRangeText(records), sourcePeriod].filter(Boolean).join(' · ') : sourceLabel;
      const fullTitle = [prefix, baseTitle].filter(Boolean).join(' · ');
      const schoolsHere = sourceFilter ? pickedSchools.filter(item => records.some(record => schoolOf(record) === item.key)) : [];
      const paperUnits = usedUnits.filter(unit => records.some(record => uIdx(record) === unitByKey.get(unit.key).index));
      const paperScopeKeys = new Set(records.map(record => scopeOfRecord.get(record)));
      return {
        index: index + 1,
        gridId: `grid-${index + 1}`,
        title: book.bookTotal === 1 ? fullTitle : `${fullTitle} · ${book.bookIndex}권/${book.bookTotal}권`,
        count: records.length,
        ...(givenSet ? { givenCount: records.filter(isGiven).length } : {}),
        sourceCount: new Set(records.map(record => record.sourceFile)).size,
        records,
        stepGrouped: true,
        selectionGrouped: true,
        sectionOptions,
        difficultySteps,
        stepSummary: summarizeSteps(records),
        unitNames: paperUnits.map(unit => unit.name),
        scopeNames: scopes.filter(item => paperScopeKeys.has(item.scopeKey)).map(item => item.label),
        yearMin: years.length ? Math.min(...years) : 0,
        yearMax: years.length ? Math.max(...years) : 0,
        sections: buildSelectionSections(records, sectionOptions),
        ...(sourceFilter ? {
          sourceLabel: prefix, schools: schoolsHere.map(item => ({ key: item.key, label: item.label, count: records.filter(record => schoolOf(record) === item.key).length })),
          school: schoolsHere.length === 1 ? schoolsHere[0].label : '', schoolKey: schoolsHere.length === 1 ? schoolsHere[0].key : ''
        } : {}),
        snapshotKey: buildSnapshotKey(snapshotUnitKey, records, scope, {
          mode: 'grid',
          difficultySteps,
          subUnitKeys,
          problemTypeKeys,
          seed: `${seed}|${order}|${perCell || 'all'}`,
          paperKey: groupBySchool ? `${book.schoolKey}:${book.bookIndex}/${book.bookTotal}` : `${index + 1}/${books.length}`,
          ...(sourceFilter ? { collection: { source: sourceFilter.key, group: groupBySchool ? 'school' : 'mixed' } } : {})
        })
      };
    });
    return base;
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
      problemTypeKeys: selection.problemTypeKeys || [],
      templateKeys: selection.templateKeys || [],
      difficultyPlan: selection.difficultyPlan || [],
      taxonomyPlan: selection.taxonomyPlan || [],
      ...(normalizeStepSelection(selection.difficultySteps).length ? { difficultySteps: normalizeStepSelection(selection.difficultySteps) } : {}),
      seed: selection.seed || '',
      collection: selection.collection || null,
      paperKey: selection.paperKey || ''
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
      const result = classifyRecord(record, profile, { fillUnits: options.fillUnits !== false });
      if (result.status === 'classified') {
        const unit = unitByKey[result.unitKey];
        const placed = normalizeClassifiedRecord(record, unit, profile);
        // 보충 판정(옛 소단원 키·유형 힌트)으로 들어온 문항은 근거를 남겨 나중에 셀 수 있게 한다. 기존 판정 문항은 그대로다.
        if (result.reason === 'legacy-subunit' || result.reason === 'type-hint') placed.unitBasis = result.reason;
        byUnit[result.unitKey].push(placed);
      } else if (result.status === 'invalid') invalid.push({ ...record, classificationReason: result.reason });
      else if (result.status === 'ignored') ignored.push({ ...record, classificationReason: result.reason });
      else review.push({ ...record, classificationReason: result.reason });
    }

    const units = profile.units.map(unit => {
      const unitRecords = byUnit[unit.key].sort(compareRecords);
      const selectableRecords = unitRecords.filter(isAutomaticSelectable);
      const papers = buildStepPapers(unit, selectableRecords, scope, options);
      return {
        ...unit,
        count: unitRecords.length,
        selectableCount: selectableRecords.length,
        approvedCount: selectableRecords.filter(isMetadataApproved).length,
        excludedFromAutomaticCount: unitRecords.length - selectableRecords.length,
        records: unitRecords,
        // Shared with the paper rebuild for a chosen difficulty-step subset (buildUnitPapers).
        selectableRecords,
        paperScope: scope,
        stepSummary: summarizeSteps(selectableRecords),
        papers
      };
    });

    const classifiedCount = units.reduce((sum, unit) => sum + unit.count, 0);
    const selectableCount = units.reduce((sum, unit) => sum + unit.selectableCount, 0);
    const approvedCount = units.reduce((sum, unit) => sum + unit.approvedCount, 0);
    return {
      profile, scope, scannedCount: scanned.length,
      candidateCount: classifiedCount + review.length,
      classifiedCount,
      selectableCount,
      approvedCount,
      excludedFromAutomaticCount: classifiedCount - selectableCount,
      review, invalid, ignored, units
    };
  }

  return {
    MiddleToc: middleToc,
    PROFILES,
    SCOPE: PROFILES.h1.scope,
    UNITS: HIGH1_UNITS,
    UNIT_BY_KEY: Object.freeze(Object.fromEntries(HIGH1_UNITS.map(unit => [unit.key, unit]))),
    DIRECT_KEY_MAP: HIGH1_DIRECT_KEY_MAP,
    RAW_KEY_MAP: HIGH1_RAW_KEY_MAP,
    QUESTION_OVERRIDES: HIGH1_OVERRIDES,
    getProfile,
    isHighSemanticProfile,
    resolveUnitKeyAlias,
    resolveRpmParent,
    reviewedMiddleParent,
    highSemanticSubjectOptions,
    highSemanticSubjectForCourseKey,
    normalizePath,
    getSourceFileCandidates,
    parseQuestionNo,
    matchQuestionNo,
    getQuestionNo,
    getQuestionUid,
    getPeriod,
    getYear,
    getExamYear,
    getSchool,
    getSchoolKey,
    getSchoolLabel,
    getSemester,
    getExamType,
    getSourceExamKey,
    isInScope,
    classifyRecord,
    hasIdentityRule,
    compareRecords,
    normalizeDifficulty,
    getDifficultyBucket,
    DIFFICULTY_STEPS,
    STEP_TOKENS,
    getDifficultyStep,
    getLegacyDifficultyLabel,
    getStepToken,
    stepTokenLabel,
    normalizeStepSelection,
    stepSelectionLabel,
    compareStepRecords,
    summarizeSteps,
    buildStepSections,
    buildUnitPapers,
    SELECTION_ORDERS,
    NO_TYPE_KEY,
    getFilterTypeKey,
    normalizeExcludedTypeKeys,
    createTypeFilter,
    getTypeFilterOptions,
    normalizeSourceOptions,
    sourceOptionsKey,
    sourcePeriodText,
    sourceYearText,
    createSourceFilter,
    getSourceSchoolOptions,
    countGrid,
    buildSelectionSections,
    selectionStepLabel,
    buildSelectionPapers,
    getSubUnitKey,
    getSubUnitParentKey,
    getSubUnitLabel,
    getSelectionSubUnitKey,
    getSelectionSubUnitLabel,
    getProblemTypeKey,
    getProblemTypeLabel,
    getConceptLabel,
    getFacetStatus,
    facetStatusText,
    getConceptOptions,
    getProblemTypeOptions,
    getTemplateKey,
    getTemplateLabel,
    getTemplateOptions,
    isSubUnitInParentScope,
    getRecordIdentity,
    dedupeRecords,
    getDifficultySummary,
    createMetaFoundationSelectionAuthority,
    validateMetaFoundationSelection,
    isDefaultSelectable,
    isTaxonomySelectable,
    isMetadataApproved,
    isGeneralUseEligible,
    isProblemTypeSelectable,
    isAutomaticSelectable,
    recencyRankOf,
    getSubUnitOptions,
    filterUnitRecords,
    normalizeCollectionSemester,
    normalizeCollectionExamType,
    filterCollectionRecords,
    getCollectionScopeUnits,
    getCollectionScopeRecords,
    getCollectionSchoolOptions,
    getCollectionYearOptions,
    resolveCollectionYearsBySchool,
    compareCollectionRecords,
    selectBalancedCollectionRecords,
    buildCollectionPapers,
    selectRecords,
    selectByBlueprint,
    splitIntoPapers,
    buildSnapshotKey,
    buildCatalog
  };
});
