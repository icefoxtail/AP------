/* 원본 기출의 머리글 제목을 사람이 읽는 이름으로 바꾼다 (2026-11-16).
   시험지 JS의 `window.examTitle`("22_강남여고_1학기_중간_고1_기출")은 식별용 값이라 그대로 두고, 화면에 찍는 제목만 바꾼다.
   - 우선순위는 엔진이 정한다: examDisplayTitle이 있으면 그것, 없으면 이 함수의 결과, 해석할 수 없으면 원래 문자열.
   - 해석하는 모양은 하나뿐이다: `YY_학교_N학기_중간|기말|N차_학년[_과목...]` (연도는 2자리 또는 4자리).
     그 밖의 이름(자연어 제목, 학기 없는 이름 등)은 지어내지 않고 원문을 그대로 돌려준다.
   - 과목 뒤의 "기출", "기출c", "기출_c", "기출_content" 꼬리는 과목이 아니라 자료 표시라 붙이지 않는다.
   인쇄 본문·레이아웃은 건드리지 않는다. 제목 문자열만 만든다. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.ExamDisplayTitle = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null), function () {
  // 연도(2자리|4자리) _ 학교(밑줄이 들어 있어도 됨) _ N학기 _ 중간|기말|N차 _ 학년 [_ 나머지]
  const PATTERN = /^(\d{2}|\d{4})_(.+?)_([12])학기_(중간|기말|[1-9]차)_((?:고|중)[1-3])(?:_(.+))?$/;
  // 자료 표시 꼬리(밑줄로 나뉜 조각 단위): 과목이 아니다.
  const MARKER_TOKENS = new Set(['기출', '기출c', 'c', 'content']);

  function subjectOf(rest) {
    if (!rest) return '';
    const tokens = String(rest).split('_').filter(Boolean);
    const kept = [];
    for (let i = 0; i < tokens.length; i += 1) {
      const token = tokens[i];
      if (MARKER_TOKENS.has(token.toLowerCase())) continue; // 대소문자 변형("기출C", "C")도 같은 표시
      kept.push(token);
    }
    return kept.join(' ');
  }

  function readableExamTitle(raw) {
    const text = String(raw ?? '');
    const m = PATTERN.exec(text.trim());
    if (!m) return text;
    const [, yy, school, semester, term, grade, rest] = m;
    const year = yy.length === 2 ? '20' + yy : yy;
    const subject = subjectOf(rest);
    const base = `${year} ${school} ${grade} ${semester}학기 ${term}`;
    return subject ? `${base} · ${subject}` : base;
  }

  // ---- 과목 칸 표시 (2026-11-23, 원장님 지시: "기출c"도 "기출"로) ----
  // 파일 이름 끝의 "c"(content, 초반에 '정리 끝난 시험지'를 뜻하던 표시)는 지금은 의미가 없어 화면에 나오지 않게 한다.
  // 카탈로그 subject 값(예: "기출c", "기출_c", "c", "대수c")은 파일 이름에서 온 값이라 그대로 두고, 보이는 글자만 바꾼다.
  // "기출c"·"기출C"·"기출_c"·"기출_content"는 모두 "기출"과 같게 취급한다. 파일 이름·식별자·검색 색인 값은 건드리지 않는다.
  /** 글 속의 content 표시("c")를 걷어 낸다: 기출c·기출_c → 기출, 단독 c 조각 제거, 대수c → 대수. */
  function withoutContentMark(raw) {
    return String(raw == null ? '' : raw)
      .replace(/기출[\s_]*(?:c|content)(?![A-Za-z0-9])/gi, '기출')
      .replace(/(^|[\s_])(?:c|content)(?=$|[\s_])/gi, '$1')
      .replace(/([가-힣])[cC](?![A-Za-z0-9])/g, '$1')
      .replace(/[\s_]+/g, ' ')
      .trim();
  }

  /** 과목 칸에 보이는 글자. "기출"뿐인 값(기출c·기출_c·c 포함)은 과목이 아니므로 opts.fallback(예: 표준 과목)이 있으면 그것, 없으면 "기출". */
  function displaySubjectOf(raw, opts) {
    const options = opts || {};
    const fallback = String(options.fallback == null ? '' : options.fallback).trim();
    const raw0 = String(raw == null ? '' : raw).trim();
    if (!raw0) return fallback;
    const text = withoutContentMark(raw0);
    if (!text || text === '기출') return fallback || '기출';
    return text;
  }

  /** 시험(카탈로그 레코드 모양) 하나의 과목 칸: subject를 정리하고, 과목이 아닌 값이면 표준 과목으로 대신한다. */
  function displaySubjectOfExam(exam) {
    const row = exam || {};
    const course = String(row.primaryStandardCourse || (row.courseRanges && row.courseRanges[0] && row.courseRanges[0].standardCourse) || '').trim();
    return displaySubjectOf(row.subject, { fallback: course });
  }

  return { readableExamTitle, withoutContentMark, displaySubjectOf, displaySubjectOfExam, PATTERN };
});
