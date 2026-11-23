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

  // ---- 보이는 제목 한 벌 (2026-11-23, 원장님 지시: 출력물 제목은 어디서나 한글 제목) ----
  // 내부 식별자(파일 이름 키, 경로, 확장자, MIXED:·unitpast_ 스냅샷 키, 영문 snake_case)가 제목 자리에 보이지 않게 한다.
  // 이미 사람이 읽는 제목(공백이 있는 문장형 제목 등)은 그대로 돌려준다. 저장되는 값·식별자는 바꾸지 않는다: 보이는 문자열만 만든다.
  const SNAPSHOT_KEY = /^(?:MIXED:)?(?:unitpast_|archive2-saved-)/i;
  const PATH_OR_EXT = /(?:^|[\\/])(?:exams|similar|archive)[\\/]|\.js(?:[?#]|$)|^MIXED:/i;
  const NEUTRAL_TITLE = '시험지';
  const HANGUL = /[가-힣]/;

  function looksInternal(text) {
    if (!text) return false;
    if (PATH_OR_EXT.test(text) || SNAPSHOT_KEY.test(text)) return true;
    if (/\s/.test(text)) return false; // 공백이 있으면 문장형 제목이다
    if (text.includes('_')) return true; // 공백 없는 밑줄 이름: 파일 이름 모양
    return /^[A-Za-z0-9.-]+$/.test(text) && /-/.test(text) && /[A-Za-z]/.test(text); // 영문 kebab 키(예: custom-pack)
  }

  function leafOf(text) {
    const compact = String(text).replace(/^MIXED:/i, '').replace(/[?#].*$/, '');
    const leaf = compact.split(/[\\/]/).filter(Boolean).pop() || compact;
    return leaf.replace(/\.js$/i, '').trim();
  }

  // 영문 키(예: 25_yeonhyang_m3_final)에서 읽을 수 있는 만큼만 푼다: 연도·학년·학기·시험. 영문 학교 이름은 지어내지 않는다.
  function decodeAsciiKey(name) {
    const parts = [];
    const tokens = String(name).split(/[_-]+/).filter(Boolean);
    const year = /^(\d{2}|\d{4})$/.exec(tokens[0] || '');
    if (year) parts.push(year[1].length === 2 ? '20' + year[1] : year[1]);
    let grade = '';
    let semester = '';
    let term = '';
    for (const token of tokens.slice(year ? 1 : 0)) {
      const g = /^([mh])([1-3])$/i.exec(token);
      if (g && !grade) { grade = (g[1].toLowerCase() === 'm' ? '중' : '고') + g[2]; continue; }
      const t = /^([12])?(mid|midterm|final|finalterm)$/i.exec(token);
      if (t && !term) { term = /^mid/i.test(t[2]) ? '중간' : '기말'; if (t[1]) semester = t[1] + '학기'; continue; }
      const sem = /^([12])(?:st|nd)?(?:sem|semester)$/i.exec(token);
      if (sem && !semester) semester = sem[1] + '학기';
    }
    for (const piece of [grade, semester, term]) if (piece) parts.push(piece);
    return parts.length >= 2 ? parts.join(' ') : '';
  }

  /** 보이는 제목. raw가 내부 키면 한글 제목으로 풀고, 못 풀면 opts.hint(사람이 읽는 다른 제목) 또는 "시험지". */
  function displayTitleOf(raw, opts) {
    const options = opts || {};
    const hint = String(options.hint == null ? '' : options.hint).trim();
    const hintOk = hint && !looksInternal(hint);
    const text = String(raw == null ? '' : raw).trim();
    if (!text) return hintOk ? hint : (options.fallback == null ? '' : String(options.fallback));
    if (!looksInternal(text)) return text;
    if (SNAPSHOT_KEY.test(text)) return hintOk ? hint : '단원별 기출';
    const name = leafOf(text);
    if (!name) return hintOk ? hint : NEUTRAL_TITLE;
    const readable = readableExamTitle(name);
    if (readable !== name) return readable;
    if (HANGUL.test(name)) {
      const joined = name.split('_').filter(token => token && !MARKER_TOKENS.has(token)).join(' ').trim();
      if (joined) return joined;
    }
    const decoded = decodeAsciiKey(name);
    if (decoded) return decoded;
    return hintOk ? hint : NEUTRAL_TITLE;
  }

  /** 해설·정답 출력의 탭·파일 이름용 제목: sol -> "제목 해설", ans -> "제목 정답". */
  function titleWithMode(title, mode) {
    const base = String(title == null ? '' : title).trim();
    const suffix = mode === 'sol' ? ' 해설' : (mode === 'ans' ? ' 정답' : '');
    return (base || NEUTRAL_TITLE) + suffix;
  }

  return { readableExamTitle, displayTitleOf, titleWithMode, looksInternal, PATTERN };
});
