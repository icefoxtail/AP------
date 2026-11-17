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
      if (MARKER_TOKENS.has(token)) continue;
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

  return { readableExamTitle, PATTERN };
});
