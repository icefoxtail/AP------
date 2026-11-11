/* 화면 안 "반에 출제" 패널 (2026-11-10).
   보관함·문제지 만들기에서 저장본을 옛 화면(index.html)의 모달 없이 바로 반과 학생을 골라 낸다.
   세 부분으로 나뉜다: (1) 상태 기계 createModel — DOM 없이 돌고 테스트에서 가짜 request를 꽂는다,
   (2) 글자 렌더 render* — 상태에서 HTML 문자열만 만든다, (3) 화면 제어 open — dialog·포커스·닫기 잠금.
   서버(Worker)는 바꾸지 않고 기존 API만 쓴다. 요청 본문·헤더는 옛 모달(index.html registerIndexClassExamAssignment)의
   저장본 출제와 정확히 같다: POST /class-exam-assignments, 헤더 X-Archive2-Contract: archive2-v1,
   본문 {contract_version, saved_paper_id, assignment_batch_id, class_id, student_ids, exam_date}.

   원본 시험지 출제(2026-11-11): items[]의 항목이 {kind:"original", file, title, count, sourceHash, settings, …}이면
   학교 기출·유사문제 줄의 출제를 같은 패널로 낸다. 본문은 옛 구현(archive2-entry.js prepareArchive2OriginalAssignment +
   index.html registerIndexClassExamAssignment 원본 분기)이 보내는 것과 키 하나까지 같다(originalBodyFor 참고).
   서버 원본 분기에는 batch id가 없다: 쓰기 키 = sha256([반, 출제일, "exams/<파일>"])(routes/archive2.js 쓰기 키 계산).
   같은 키로 본문이 같으면 기존 건을 돌려주고(멱등), 학생 구성·제목·쪽당 문항이 다르면 409, 취소된 건이면 409다.
   그래서 '확인하기'는 저장본과 같이 얼려 둔 같은 본문을 다시 보낸다.

   단원별 기출 출제(2026-11-11): items[]의 항목이 {kind:"unit", snapshotKey, title, identityTitle, count, …}이면 단원별 문제지(권)를
   같은 패널로 낸다. 서버는 문항별 승인 대조를 통과할 필드가 없어 계약 헤더 경로로는 단원별 문제지를 받지 못한다. 그래서 옛 모달
   (index.html registerIndexClassExamAssignment)과 같은 본문(MIXED:<snapshotKey> + mixed_payload_json)을 헤더 없이 보낸다(unitBodyFor).
   이 경로는 받는 사람을 항상 반 전체로 기록하므로, 학생을 일부만 고른 반은 POST 성공 뒤 exclude-students로 고르지 않은 학생을 뺀다.
   제외가 실패하면 성공으로 표시하지 않는다(그동안 반 전체에게 보인다). 같은 (반, 출제일, MIXED:키)는 서버가 기존 건을 갱신하므로
   재전송해도 새 건이 생기지 않는다. 문항은 open({unit:{load}})이 준다. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2Assign = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const CONTRACT = "archive2-v1";
  const STORAGE_KEY = "archive2.assign.batch.v1";
  const BATCH_TTL_MS = 7 * 24 * 60 * 60 * 1000;
  // 읽기(반 목록·명단)는 api()와 같은 30초. 출제 POST는 서버가 그 안에서 PDF를 동기로 만든다:
  // exam-pdf.js의 페이지 열기 45초 + 렌더 완료 대기 45초 + PDF 출력·저장이 한 요청에 들어가므로 최악 약 2분이다.
  // 그보다 짧으면 정상 출제를 '응답 없음'으로 오판하고, 너무 길면 끊긴 요청을 오래 붙든다 → 150초.
  // 제한에 걸려도 출제를 실패로 단정하지 않고 '결과 확인 필요'로 두며, 같은 batch id로 다시 보내 확인한다.
  const READ_TIMEOUT_MS = 30000;
  const WRITE_TIMEOUT_MS = 150000;
  // 원본 출제: 학교별 기출 화면에는 이력이 없으니 최근 90일 출제 목록을 한 번 받아 같은 파일·같은 반·같은 날을 찾는다.
  const HISTORY_DAYS = 90;
  const HISTORY_LIMIT = 1000;
  const HISTORY_TTL_MS = 60000;
  const QPP_VALUES = [4, 6, 8];
  const GRADES = ["중1", "중2", "중3", "고1", "고2", "고3"];
  const GRADE_CLASS = { 중1: "grade-m1", 중2: "grade-m2", 중3: "grade-m3", 고1: "grade-h1", 고2: "grade-h2", 고3: "grade-h3" };
  const HANGUL = /[가-힣]/;
  const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const ID_ERROR_MESSAGE = "이 브라우저에서는 출제 번호를 만들 수 없습니다. 브라우저를 최신으로 바꾸거나 관리자에게 알려 주세요.";

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
  const text = (value) => String(value ?? "").trim();
  const gradeClassOf = (grade) => GRADE_CLASS[text(grade)] || "grade-none";

  // 옛 모달과 같은 기준: 한국 시간(UTC+9) 오늘.
  function kstToday(now = Date.now()) {
    return new Date(now + 9 * 60 * 60 * 1000).toISOString().split("T")[0];
  }
  function validDate(value) {
    const match = text(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return false;
    const date = new Date(`${match[0]}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === match[0];
  }
  function dayLabel(value, today = "") {
    const match = text(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return "";
    const year = Number(match[1]);
    const thisYear = Number(text(today).slice(0, 4)) || new Date().getFullYear();
    return `${year === thisYear ? "" : `${year}년 `}${Number(match[2])}월 ${Number(match[3])}일`;
  }

  // 반 학년 판정은 archive2-history.js의 classGrade와 같은 규칙(서버 checkTargetClassGrade도 같은 함수).
  function defaultClassGrade(row) {
    const explicit = String(row?.grade || row?.grade_label || row?.class_grade || "").replace(/\s/g, "");
    const name = String(row?.name || row?.class_name || "").match(/(?:중|고)[123]/)?.[0];
    const grade = explicit || name || "";
    return GRADES.includes(grade) ? grade : "";
  }

  // ---- batch id 보관 --------------------------------------------------------------------------------
  // assignment_batch_id는 서버가 같은 출제를 알아보는 열쇠다(서버 쓰기 키 = sha256([반, 출제일, MIXED:archive2-saved-<문제지>-<batch id>])).
  // 모달을 열 때마다 새로 만들면 같은 반·같은 날 출제가 두 번 생긴다. 그래서 (문제지, 반, 출제일)마다
  // 한 번 만들어 보관하고, 서버가 성공을 확인해 줄 때까지 같은 값을 다시 쓴다(닫았다 열어도, 새로고침해도).
  // 성공하면 지운다. localStorage가 막혀 있으면 메모리로만 보관해 출제는 그대로 된다.
  function createBatchStore({ storage = null, uuid = null, now = Date.now } = {}) {
    const memory = new Map();
    // 서버는 UUID v4 형식만 받는다(SAVED_PAPER_BATCH_ID). 만들 수 없거나 형식이 틀리면 임의 값을 만들어 보내지 않고 던진다.
    const makeId = () => {
      let id = "";
      try {
        if (typeof uuid === "function") id = String(uuid());
        else {
          const c = typeof globalThis !== "undefined" ? globalThis.crypto : null;
          if (c && typeof c.randomUUID === "function") id = c.randomUUID();
        }
      } catch { id = ""; }
      if (!UUID_V4.test(id)) throw new Error(ID_ERROR_MESSAGE);
      return id;
    };
    const keyOf = (paperId, classId, date) => `${paperId}|${classId}|${date}`;
    function read() {
      try {
        const parsed = JSON.parse(storage?.getItem(STORAGE_KEY) || "null");
        return parsed && typeof parsed === "object" && parsed.items && typeof parsed.items === "object" ? parsed.items : {};
      } catch { return {}; }
    }
    function write(items) {
      try { storage?.setItem(STORAGE_KEY, JSON.stringify({ v: 1, items })); } catch { /* 메모리로 계속한다 */ }
    }
    function load() {
      const items = read();
      const cutoff = now() - BATCH_TTL_MS;
      let pruned = false;
      for (const [key, entry] of Object.entries(items)) {
        if (!entry || typeof entry.id !== "string" || !entry.id || !(Number(entry.at) > cutoff)) {
          delete items[key];
          pruned = true;
        }
      }
      if (pruned) write(items);
      return items;
    }
    function merged() {
      const items = load();
      for (const [key, entry] of memory) items[key] = { ...(items[key] || {}), ...entry };
      return items;
    }
    function put(key, entry) {
      memory.set(key, entry);
      const items = load();
      items[key] = entry;
      write(items);
    }
    return {
      // 있으면 그 값을, 없으면 새로 만들어 보관한다.
      ensure(paperId, classId, date) {
        const key = keyOf(paperId, classId, date);
        const current = merged()[key];
        if (current) return { ...current };
        const entry = { id: makeId(), at: now(), st: "new" };
        put(key, entry);
        return { ...entry };
      },
      peek(paperId, classId, date) {
        const current = merged()[keyOf(paperId, classId, date)];
        return current ? { ...current } : null;
      },
      // 원본 출제용: 서버가 batch id를 받지 않으므로 번호는 만들지 않고 '보냈는데 결과를 모름' 표시만 남긴다(id "-").
      touch(paperId, classId, date) {
        const key = keyOf(paperId, classId, date);
        if (!merged()[key]) put(key, { id: "-", at: now(), st: "new" });
      },
      // 요청을 보내기 직전 'sent', 확정 실패(서버가 거절) 'failed'. 'sent'로 남은 것은 결과를 모르는 건이다.
      mark(paperId, classId, date, st) {
        const key = keyOf(paperId, classId, date);
        const current = merged()[key];
        if (current) put(key, { ...current, st });
      },
      clear(paperId, classId, date) {
        const key = keyOf(paperId, classId, date);
        memory.delete(key);
        const items = load();
        if (key in items) { delete items[key]; write(items); }
      },
      // 같은 문제지·같은 반에서 결과를 확인하지 못한 채 남은 건(다른 날짜 포함).
      unknownFor(paperId, classId) {
        const prefix = `${paperId}|${classId}|`;
        return Object.entries(merged())
          .filter(([key, entry]) => key.startsWith(prefix) && entry.st === "sent")
          .map(([key]) => key.slice(prefix.length))
          .sort();
      },
    };
  }

  // ---- 이번 접속에서 이 패널로 성공한 (문제지, 반, 날짜) ------------------------------------------------
  // 문제지 만들기 화면에서 연 패널은 보관함 이력이 없다. 방금 낸 조합을 메모리 + sessionStorage에 기억해 같은 경고를 낸다.
  const DONE_KEY = "archive2.assign.done.v1";
  function createDoneStore({ storage = null } = {}) {
    const memory = new Map();
    const read = () => {
      try {
        const parsed = JSON.parse(storage?.getItem(DONE_KEY) || "null");
        return Array.isArray(parsed) ? parsed.filter((k) => typeof k === "string") : [];
      } catch { return []; }
    };
    return {
      add(paperId, classId, date) {
        const key = `${paperId}|${classId}|${date}`;
        memory.set(key, true);
        try { storage?.setItem(DONE_KEY, JSON.stringify([...new Set([...read(), key])].slice(-200))); } catch { /* 메모리로 계속한다 */ }
      },
      // 같은 문제지·같은 반에서 이번 접속에 성공한 날짜들(새 것부터).
      datesFor(paperId, classId) {
        const prefix = `${paperId}|${classId}|`;
        const keys = new Set([...memory.keys(), ...read()]);
        return [...keys].filter((k) => k.startsWith(prefix)).map((k) => k.slice(prefix.length)).sort().reverse();
      },
    };
  }
  let sharedDone = null;
  function sharedDoneStore(storage) {
    if (!sharedDone) sharedDone = createDoneStore({ storage });
    return sharedDone;
  }

  // ---- 서버 오류를 교사 말로 -------------------------------------------------------------------------
  // 서버 문장은 화면에 내지 않는다(영문·코드형은 물론 한글이어도 "roster"·"Assignment" 같은 내부 용어가 섞인다).
  // 알려진 문구만 교사가 할 일을 알려 주는 말로 바꾸고, 그 밖에는 일반 안내를 낸다. 원문은 콘솔에만 남긴다.
  const CANCELLED_MESSAGE = "이 출제는 취소된 상태입니다.";
  const PDF_DELAY_MESSAGE = "출제는 됐습니다. 출력용 PDF 준비가 늦어지고 있으니 PDF 다시 준비 버튼을 눌러 주세요.";
  const PDF_RETRY_MESSAGE = "PDF를 아직 준비하지 못했습니다. 잠시 뒤 PDF 다시 준비 버튼을 다시 눌러 주세요.";
  const GENERIC_FAILURE = "출제하지 못했습니다. 다시 시도하고, 계속되면 관리자에게 알려 주세요.";
  const warnRaw = (raw) => { try { if (raw) console.warn("[archive2-assign] server message:", raw); } catch { /* 콘솔이 없어도 된다 */ } };
  const KNOWN_MESSAGES = [
    [/고정 roster/, "이 반에 이미 보낸 출제와 학생 구성이 다릅니다. 출제 내역에서 먼저 확인해 주세요."],
    [/이미 배부된 시험/, "같은 날 이 반에 낸 시험지와 내용이 달라 출제할 수 없습니다. 출제 내역을 확인해 주세요."],
    [/취소된 Assignment/, CANCELLED_MESSAGE],
    [/대상 반보다 높은 학년/, "이 문제지에는 반 학년보다 높은 학년의 문항이 있어 이 반에는 낼 수 없습니다."],
    [/반 학년을 확인할 수 없/, "반 학년 정보가 없어 출제할 수 없습니다. APMS에서 반 학년을 확인해 주세요."],
    [/반 소속 또는 재원 상태가 변경/, "학생 명단이 바뀌었습니다. 패널을 닫고 다시 열어 주세요."],
    [/저장본이 삭제되었거나|저장한 시험지를 찾을 수 없/, "문제지를 찾을 수 없습니다. 삭제되었을 수 있습니다."],
    [/출제 대상 학생을 선택/, "출제할 학생이 없습니다."],
    [/문항 수가 일치하지/, "저장한 문제지의 문항 수가 맞지 않아 출제할 수 없습니다. 관리자에게 알려 주세요."],
  ];
  // 원본 시험지 출제에서만 나오는 서버 문구(archive2.js·archive2-questions.js validateOriginalSnapshot). 저장본 문구와 겹치면 이쪽이 먼저다.
  const SOURCE_CHANGED_MESSAGE = "시험 자료가 새로 바뀌어 지금 화면과 맞지 않습니다. 페이지를 새로고침한 뒤 다시 출제해 주세요.";
  const ORIGINAL_CANCELLED_MESSAGE = "이 반에 같은 날 낸 출제가 취소된 상태라 같은 날짜로는 다시 낼 수 없습니다. 출제일을 바꿔 주세요.";
  const ORIGINAL_MESSAGES = [
    [/취소된 Assignment/, ORIGINAL_CANCELLED_MESSAGE],
    [/고정 roster/, "이 반에 같은 날 이미 낸 출제와 학생 구성이 다릅니다. 출제일을 바꾸거나 출제 내역에서 확인해 주세요."],
    [/이미 배부된 시험/, "이 반에 같은 날 이미 낸 것과 내용(한 쪽 문항 수 등)이 달라 출제할 수 없습니다. 출제 내역에서 확인하거나 출제일을 바꿔 주세요."],
    [/원본 시험의 문항 수가 일치|원본 내용 또는 문항 순서가 변경|index_version|projection|canonical/i, SOURCE_CHANGED_MESSAGE],
    [/최대 80문항/, "이 시험지는 문항이 80개를 넘어 한 번에 출제할 수 없습니다."],
    [/payload exceeds/i, "시험지가 너무 커서 이 방법으로는 낼 수 없습니다. 관리자에게 알려 주세요."],
    [/원본 문항이 필요|원본 경로가 올바르지/, "시험지 원본을 확인할 수 없습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요."],
  ];
  // 단원별 기출 출제(헤더 없는 옛 본문). 서버 400 'mixed_payload_json with questions is required'는 본문이 비었거나 900000자를 넘을 때다.
  const UNIT_TOO_BIG_MESSAGE = "문제지가 너무 커서 낼 수 없습니다. 문항 수를 줄여 다시 만들어 주세요.";
  const UNIT_MESSAGES = [
    [/mixed_payload_json/i, UNIT_TOO_BIG_MESSAGE],
    [/확정 배부는 원본을 변경할 수 없/, "이 반에 같은 날 같은 이름으로 이미 낸 출제가 있어 바꿀 수 없습니다. 출제 내역에서 확인해 주세요."],
    [/payload exceeds/i, UNIT_TOO_BIG_MESSAGE],
  ];
  const UNIT_LOAD_MESSAGE = "문제지 문항을 준비하지 못했습니다. 잠시 뒤 다시 시도해 주세요.";
  const UNIT_EMPTY_MESSAGE = "문제지에 문항이 없어 출제할 수 없습니다. 단원별 기출 화면에서 다시 만들어 주세요.";
  const SOURCE_LOAD_MESSAGE = "시험지 원본을 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요.";
  const SOURCE_COUNT_MESSAGE = "시험지 원본의 문항 수가 목록과 달라 출제하지 않았습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.";
  function friendlyMessage(error, status, ctx = {}) {
    const raw = text(error?.data?.error || error?.message).replace(/^[A-Z][A-Z0-9_]{3,}:\s*/, "");
    if (ctx.original) for (const [pattern, message] of ORIGINAL_MESSAGES) if (pattern.test(raw)) return message;
    if (ctx.unit) for (const [pattern, message] of UNIT_MESSAGES) if (pattern.test(raw)) return message;
    for (const [pattern, message] of KNOWN_MESSAGES) if (pattern.test(raw)) return message;
    if (status === 413) return ctx.unit ? UNIT_TOO_BIG_MESSAGE : "시험지가 너무 커서 이 방법으로는 낼 수 없습니다. 관리자에게 알려 주세요.";
    if (status === 403) return "이 반에 출제할 권한이 없습니다.";
    if (status === 404) return "문제지나 반을 찾을 수 없습니다.";
    if (status === 503) return "서버가 준비 중입니다. 잠시 뒤 다시 시도해 주세요.";
    warnRaw(raw);
    return GENERIC_FAILURE;
  }
  // kind: ok-pdf(출제는 저장됨) | failed(서버가 거절, 만들어지지 않음) | cancelled(같은 번호의 출제가 취소됨) | unknown(응답을 못 받아 모름)
  function classifyError(error, ctx = {}) {
    const status = Number(error?.status) || 0;
    const assignment = error?.data?.assignment;
    if (assignment?.id) {
      // 서버는 출제를 저장한 뒤 PDF 생성에 실패하면 502와 함께 assignment를 돌려준다: 출제는 된 것이다.
      return {
        kind: "ok-pdf", assignmentId: text(assignment.id),
        message: PDF_DELAY_MESSAGE, raw: text(assignment.pdf_error || error?.data?.error),
      };
    }
    if (status === 401) {
      return { kind: "failed", auth: true, message: "로그인이 끝났습니다. 다시 로그인한 뒤 이어서 출제해 주세요." };
    }
    const noAnswer = Boolean(error?.timeout) || status === 0 || status >= 500 && status !== 503 || (status >= 200 && status < 300);
    if (noAnswer) {
      return { kind: "unknown", message: "서버에서 응답을 받지 못했습니다. 출제가 되었는지 확인이 필요합니다." };
    }
    if (/취소된 Assignment/.test(text(error?.data?.error || error?.message)))
      return { kind: "cancelled", message: ctx.original || ctx.unit ? ORIGINAL_CANCELLED_MESSAGE : CANCELLED_MESSAGE };
    return { kind: "failed", message: friendlyMessage(error, status, ctx) };
  }

  // ---- 상태 기계 ------------------------------------------------------------------------------------
  // ---- 원본 시험지 항목 -------------------------------------------------------------------------------
  const fileKey = (value) => String(value ?? "").normalize("NFC").replace(/\\/g, "/");
  // O.settings(archive2-output.js)와 같은 모양. 항목이 settings를 주지 않으면 같은 기본값을 쓴다.
  function defaultOriginalSettings(title, subject) {
    return {
      header: { title, subtitle: text(subject), metaRight: "", showNameLine: true, showScoreLine: true, applyToSolution: true, applyToAnswer: true },
      qpp: 4, includeQr: false,
    };
  }
  function normalizeOriginal(row) {
    const file = text(row.file);
    const count = Number(row.count ?? row.qCount);
    if (!file || !Number.isInteger(count) || count < 1) return null;
    const subject = text(row.subject);
    const settings = row.settings && typeof row.settings === "object" ? row.settings : defaultOriginalSettings(text(row.title) || file, subject);
    const examTitle = text(settings.header?.title) || text(row.title) || file;
    const qpp = QPP_VALUES.includes(Number(settings.qpp)) ? Number(settings.qpp) : 4;
    return {
      kind: "original",
      id: `exams/${file}`,
      file,
      title: text(row.title) || examTitle,
      // 서버가 응시 여부를 가르는 제목(exam_sessions.exam_title)은 출제 때 보내는 exam_title이다.
      originalTitle: examTitle,
      identityTitle: text(row.identityTitle) || file.split("/").pop().replace(/\.js$/, ""),
      sourceHash: text(row.sourceHash),
      settings: { ...settings, header: { ...settings.header, title: examTitle }, qpp, includeQr: settings.includeQr === true },
      grade: text(row.grade),
      subject,
      count,
      partIndex: 0,
      partCount: 1,
    };
  }
  // 단원별 기출 문제지 항목. 패널 안 id와 서버의 archive_file은 MIXED:<snapshotKey>다(옛 모달과 같다).
  // 서버가 응시 여부를 가르는 제목(exam_title)은 옛 경로가 보내던 값 identityTitle||title이다.
  const SNAPSHOT_KEY = /^[a-zA-Z0-9_-]+$/;
  function normalizeUnit(row) {
    const snapshotKey = text(row.snapshotKey);
    const count = Number(row.count ?? row.qCount);
    if (!SNAPSHOT_KEY.test(snapshotKey) || !Number.isInteger(count) || count < 1) return null;
    const title = text(row.title) || text(row.identityTitle) || "단원별 기출";
    const partCount = Number(row.partCount) > 1 ? Number(row.partCount) : 1;
    return {
      kind: "unit",
      id: `MIXED:${snapshotKey}`,
      snapshotKey,
      title,
      originalTitle: text(row.identityTitle) || title,
      identityTitle: text(row.identityTitle) || title,
      ref: row.ref ?? null, // 호출한 화면이 문항을 찾을 때 쓰는 값(패널은 읽지 않는다)
      grade: text(row.grade),
      subject: text(row.subject),
      count,
      partIndex: Number.isInteger(Number(row.partIndex)) ? Number(row.partIndex) : 0,
      partCount,
    };
  }
  // 최근 출제 목록(recent-summary)에서 원본 시험(saved_paper_id 없음, archive_file = exams/<파일>)과
  // 단원별 기출(archive_file = MIXED:<키>, saved_paper_id 없음)만 파일별로 묶는다.
  // 모양은 보관함 이력(archive2-library groupIssuesByPaper)과 같아 저장본과 같은 판정 코드를 쓴다. 취소된 건도 담는다.
  function groupIssuesByFile(assignments) {
    const byFile = new Map();
    for (const row of Array.isArray(assignments) ? assignments : []) {
      const file = fileKey(row?.archive_file);
      const id = text(row?.id);
      if (!id || !(file.startsWith("exams/") || file.startsWith("MIXED:")) || text(row?.saved_paper_id)) continue;
      if (!byFile.has(file)) byFile.set(file, []);
      byFile.get(file).push({
        id, classId: text(row.class_id), className: text(row.class_name),
        date: text(row.exam_date).slice(0, 10),
        cancelled: Boolean(text(row.cancelled_at)) || Number(row.is_cancelled) === 1,
      });
    }
    return byFile;
  }
  function historyFrom(nowMs) {
    return new Date(nowMs + 9 * 60 * 60 * 1000 - HISTORY_DAYS * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  }
  // 같은 페이지 안에서 60초 동안은 한 번 받은 최근 출제 목록을 다시 쓴다(패널을 여러 번 열어도 서버를 한 번만 부른다).
  function createRecentCache({ ttlMs = HISTORY_TTL_MS } = {}) {
    let entry = null;
    return {
      get(request, nowMs) {
        if (entry && (entry.pending || nowMs - entry.at < ttlMs)) return entry.promise;
        const next = { at: nowMs, pending: true, promise: null };
        next.promise = Promise.resolve()
          .then(() => request(`/class-exam-assignments/recent-summary?limit=${HISTORY_LIMIT}&from=${historyFrom(nowMs)}`, { method: "GET", timeoutMs: READ_TIMEOUT_MS }))
          .then((data) => { next.pending = false; return data; }, (error) => { if (entry === next) entry = null; throw error; });
        entry = next;
        return next.promise;
      },
      reset() { entry = null; },
    };
  }
  const sharedRecent = createRecentCache();

  function normalizePapers(input) {
    const seen = new Set();
    const out = [];
    for (const row of Array.isArray(input) ? input : []) {
      if (row?.kind === "original") {
        const item = normalizeOriginal(row);
        if (item && !seen.has(item.id)) { seen.add(item.id); out.push(item); }
        continue;
      }
      if (row?.kind === "unit") {
        const item = normalizeUnit(row);
        if (item && !seen.has(item.id)) { seen.add(item.id); out.push(item); }
        continue;
      }
      const id = text(row?.id);
      if (!id || seen.has(id)) continue;
      seen.add(id);
      const count = Number(row.count ?? row.question_count);
      out.push({
        id,
        title: text(row.library_display_name || row.title) || "저장한 시험지",
        // 서버는 원래 제목(archive_saved_papers.title = 출제의 exam_title)으로 응시 여부를 가른다. 보관함에서 바꾼 이름과 따로 둔다.
        originalTitle: text(row.title),
        grade: text(row.grade),
        subject: text(row.subject),
        count: Number.isFinite(count) && count >= 0 ? count : 0,
        partIndex: Number.isInteger(Number(row.partIndex ?? row.part_index)) ? Number(row.partIndex ?? row.part_index) : 0,
        partCount: Number(row.partCount ?? row.part_count) > 1 ? Number(row.partCount ?? row.part_count) : 1,
      });
    }
    return out;
  }

  function createModel(options = {}) {
    const request = options.request;
    if (typeof request !== "function") throw new Error("request function required");
    const now = options.now || (() => Date.now());
    const store = options.store || createBatchStore({ storage: options.storage || null, uuid: options.uuid, now });
    const classGrade = options.classGrade || defaultClassGrade;
    const papers = normalizePapers(options.items || options.papers);
    const history = options.history || null;
    const onDone = options.onDone || (() => {});
    const issuedHere = options.doneStore || createDoneStore({ storage: options.sessionStorage || null });
    const originalCtx = options.original || {};
    const unitCtx = options.unit || {};
    const recentCache = options.recentCache || sharedRecent;
    const hasOriginal = papers.some((paper) => paper.kind === "original");
    const hasUnit = papers.some((paper) => paper.kind === "unit");
    // 저장본이 아닌 항목(원본·단원별)은 보관함 이력이 없어 최근 출제 목록을 따로 받고, 한 쪽 문항 수를 정한다.
    const unsaved = (paper) => paper.kind === "original" || paper.kind === "unit";
    const usesRecent = hasOriginal || hasUnit;
    const makeUuid = () => {
      let id = "";
      try {
        if (typeof options.uuid === "function") id = String(options.uuid());
        else {
          const c = typeof globalThis !== "undefined" ? globalThis.crypto : null;
          if (c && typeof c.randomUUID === "function") id = c.randomUUID();
        }
      } catch { id = ""; }
      if (!UUID_V4.test(id)) throw new Error(ID_ERROR_MESSAGE);
      return id;
    };
    const listeners = new Set();
    const state = {
      phase: "loading", // loading | login | error | empty | select | running | done
      error: "",
      papers,
      classes: [],
      date: kstToday(now()),
      // 원본 출제 전용: 최근 출제 목록(같은 파일·반·날 확인)과 쪽당 문항 수.
      historyState: usesRecent ? "loading" : "idle", // idle | loading | ready | error
      historyTruncated: false,
      qpp: 4, // 원본 패널은 항상 4문항으로 시작한다(`바꾸기`로만 6·8)
      qppOpen: false,
      excluded: new Set(),
      jobs: [],
      starting: false,
      working: false,
      dirty: false,
      authLost: false,
      busyNote: false,
      closeWarn: false, // 고르지 않은 학생을 빼지 못한 채 닫으려 했을 때 한 번 알린다
      prepareNote: "",
      openGroups: new Set(),
    };
    let loadSeq = 0;
    const emit = () => { for (const listener of listeners) { try { listener(state); } catch { /* 화면 오류가 출제를 막지 않는다 */ } } };
    const comboKey = (paperId, classId) => `${paperId}|${classId}`;
    const classById = (id) => state.classes.find((cls) => cls.id === id);
    const selectedIds = (cls) => {
      if (cls.rosterState !== "ready" || !cls.roster) return [];
      return cls.studentIds ? cls.roster.filter((s) => cls.studentIds.has(s.id)).map((s) => s.id) : cls.roster.map((s) => s.id);
    };

    // 같은 문제지·같은 반의 이전 출제(취소 제외). 반은 class_id로, id가 없는 이력은 반 이름으로 맞춘다.
    let originalIssues = new Map(); // 원본 시험: archive_file(exams/<파일>) → 출제 행들(취소 포함)
    const sameClass = (row, cls) => (row.classId ? row.classId === cls.id : Boolean(row.className) && row.className === cls.name);
    const recordedRows = (paperId) => history?.byPaper?.get?.(String(paperId)) || originalIssues.get(fileKey(paperId)) || [];
    function priorIssues(paperId, cls) {
      const rows = recordedRows(paperId).filter((row) => !row.cancelled && sameClass(row, cls));
      // 이력에 아직 없는, 이번 접속에서 이 패널로 성공한 건을 합친다.
      for (const date of issuedHere.datesFor(paperId, cls.id))
        if (!rows.some((row) => row.date === date)) rows.push({ id: "", classId: cls.id, className: cls.name, date, cancelled: false, fromSession: true });
      return rows.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    }
    function dupInfo(paperId, cls) {
      const rows = priorIssues(paperId, cls);
      // 원본 시험은 (반, 날짜, 파일)이 서버의 쓰기 키라 취소된 건이 있으면 같은 날짜로는 다시 낼 수 없다.
      const cancelledSameDate = unsaved(papers.find((paper) => paper.id === paperId) || {})
        ? recordedRows(paperId).find((row) => row.cancelled && row.date === state.date && sameClass(row, cls)) || null : null;
      return { sameDate: rows.find((row) => row.date === state.date) || null, latest: rows[0] || null, count: rows.length, cancelledSameDate };
    }
    function pendingNotes(paperId, cls) {
      return store.unknownFor(paperId, cls.id);
    }

    // 원본 시험지의 이전 출제 기록. 실패해도 출제는 할 수 있다(기록 확인만 못 한다). 서버가 같은 건은 같은 건으로 받으므로
    // 늦게 도착해도 중복 출제가 생기지 않는다: 도착하면 이미 체크한 반의 같은 날 건만 기본에서 뺀다.
    async function loadOriginalHistory() {
      if (!usesRecent) return;
      state.historyState = "loading";
      let data;
      try {
        data = await recentCache.get(request, now());
      } catch {
        state.historyState = "error";
        emit();
        return;
      }
      const rows = Array.isArray(data?.assignments) ? data.assignments : [];
      originalIssues = groupIssuesByFile(rows);
      state.historyTruncated = rows.length >= HISTORY_LIMIT;
      state.historyState = "ready";
      if (papers.length > 1)
        for (const cls of state.classes)
          if (cls.checked) for (const paper of papers) if (dupInfo(paper.id, cls).sameDate) state.excluded.add(comboKey(paper.id, cls.id));
      emit();
    }
    // 단원별 문제지: 호출한 화면이 문항을 복원해 {questions, meta}를 준다. 본문 문자열은 보내기 직전(prepareUnits)에 만든다.
    function loadUnitPayload(paper) {
      if (!paper.loading) {
        paper.loading = Promise.resolve()
          .then(() => unitCtx.load(paper))
          .then((loaded) => {
            const questions = loaded?.questions;
            if (!Array.isArray(questions) || !questions.length) throw Object.assign(new Error("unit empty"), { unitEmpty: true });
            return { questions, meta: loaded.meta && typeof loaded.meta === "object" ? loaded.meta : {} };
          })
          .catch((error) => { paper.loading = null; throw error; });
      }
      return paper.loading;
    }
    // 원본 문항은 패널을 열 때 미리 받아 두고(실패하면 출제 직전에 다시 시도), 출제 직전에 확인한다.
    function loadOriginalQuestions(paper) {
      if (!paper.loading) {
        paper.loading = Promise.resolve()
          .then(() => originalCtx.loadQuestions(paper))
          .then((questions) => {
            if (!Array.isArray(questions) || !questions.length) throw Object.assign(new Error("source empty"), { sourceLoad: true });
            if (questions.length !== paper.count) throw Object.assign(new Error("source count mismatch"), { sourceCount: true });
            return questions;
          })
          .catch((error) => { paper.loading = null; throw error; });
      }
      return paper.loading;
    }
    async function load() {
      const seq = ++loadSeq;
      state.phase = "loading";
      state.error = "";
      emit();
      if (usesRecent) {
        loadOriginalHistory().catch(() => {});
        for (const paper of papers) if (paper.kind === "original" && typeof originalCtx.loadQuestions === "function") loadOriginalQuestions(paper).catch(() => {});
        // 단원별 문항은 권마다 원본 파일을 읽으므로 한 권씩 차례로 미리 받아 둔다(실패하면 출제 직전에 다시 시도).
        if (hasUnit && typeof unitCtx.load === "function") {
          (async () => { for (const paper of papers) if (paper.kind === "unit") { try { await loadUnitPayload(paper); } catch { /* 출제 직전에 다시 */ } } })();
        }
      }
      let data;
      try {
        data = await request("/qr-classes", { method: "GET", timeoutMs: READ_TIMEOUT_MS });
      } catch (error) {
        if (seq !== loadSeq) return false;
        const status = Number(error?.status) || 0;
        state.phase = status === 401 || status === 403 ? "login" : "error";
        state.error = state.phase === "login" ? "" : friendlyLoadError(error);
        emit();
        return false;
      }
      if (seq !== loadSeq) return false;
      const rows = Array.isArray(data?.classes) ? data.classes : Array.isArray(data?.data) ? data.data : [];
      state.classes = rows.filter((row) => text(row?.id)).map((row) => ({
        id: text(row.id),
        name: text(row.name || row.class_name) || "이름 없는 반",
        grade: classGrade(row),
        teacher: text(row.teacher_name || row.teacher),
        checked: false,
        rosterState: "idle", // idle | loading | ready | error
        roster: null,
        studentIds: null, // null = 전체
        expanded: false,
        token: 0,
      })).sort((a, b) => {
        const rank = (grade) => GRADES.indexOf(grade) < 0 ? 99 : GRADES.indexOf(grade);
        return rank(a.grade) - rank(b.grade) || a.name.localeCompare(b.name, "ko") || a.id.localeCompare(b.id);
      });
      state.phase = state.classes.length ? "select" : "empty";
      emit();
      return true;
    }
    function friendlyLoadError(error) {
      warnRaw(text(error?.message));
      return "반 목록을 불러오지 못했습니다. 다시 시도해 주세요.";
    }

    async function loadRoster(classId) {
      const cls = classById(classId);
      if (!cls) return false;
      const token = ++cls.token;
      cls.rosterState = "loading";
      emit();
      const query = `class_id=${encodeURIComponent(cls.id)}&exam_title=${encodeURIComponent(papers[0]?.originalTitle || "")}&exam_date=${encodeURIComponent(state.date)}`;
      let data;
      try {
        data = await request(`/class-exam-assignments/roster?${query}`, { method: "GET", timeoutMs: READ_TIMEOUT_MS });
      } catch (error) {
        if (token !== cls.token) return false;
        cls.rosterState = "error";
        cls.roster = null;
        if (Number(error?.status) === 401) state.authLost = true;
        emit();
        return false;
      }
      if (token !== cls.token) return false;
      const roster = (Array.isArray(data?.students) ? data.students : [])
        .filter((s) => text(s?.id)).map((s) => ({ id: text(s.id), name: text(s.name) || "이름 없음", submitted: Boolean(s.already_submitted) }));
      cls.roster = roster;
      cls.rosterState = "ready";
      cls.studentIds = null;
      if (!roster.length) cls.checked = false; // 학생 0명 반은 고를 수 없다
      emit();
      return true;
    }

    function applyAutoExclusion(cls) {
      for (const paper of papers) state.excluded.delete(comboKey(paper.id, cls.id));
      // 문제지가 여러 권이면 같은 날 이미 낸 (문제지, 반)은 기본으로 뺀다. 한 권이면 반 줄 자체가 그 확인이다.
      if (papers.length > 1 && cls.checked)
        for (const paper of papers) if (dupInfo(paper.id, cls).sameDate) state.excluded.add(comboKey(paper.id, cls.id));
    }

    function toggleClass(classId, checked) {
      if (state.phase !== "select" || state.starting) return;
      const cls = classById(classId);
      if (!cls) return;
      if (cls.rosterState === "ready" && !cls.roster.length) return;
      cls.checked = Boolean(checked);
      applyAutoExclusion(cls);
      emit();
      if (cls.checked && (cls.rosterState === "idle" || cls.rosterState === "error")) return loadRoster(cls.id);
      return undefined;
    }
    function toggleStudent(classId, studentId, included) {
      const cls = classById(classId);
      if (!cls || state.phase !== "select" || state.starting || cls.rosterState !== "ready") return;
      const next = new Set(cls.studentIds || cls.roster.map((s) => s.id));
      if (included) next.add(studentId); else next.delete(studentId);
      cls.studentIds = next.size === cls.roster.length ? null : next;
      emit();
    }
    function selectAllStudents(classId) {
      const cls = classById(classId);
      if (!cls || state.phase !== "select" || state.starting) return;
      cls.studentIds = null;
      emit();
    }
    // '아직 안 본 학생만': 이 시험을 이미 제출한 학생(roster의 already_submitted, 옛 모달의 '이 시험 미응시자만'과 같은 필드)을 뺀다.
    // 결석생에게 며칠 뒤 따로 낼 때 쓴다. 모두 제출했으면 아무것도 바꾸지 않는다.
    // 원래 제목을 알 수 없으면(또는 여러 권이면) 응시 여부를 믿을 수 없으니 빠른 선택과 "응시함" 표시를 숨긴다.
    const canCompareSubmitted = () => papers.length === 1 && Boolean(papers[0].originalTitle);
    function unsubmittedCount(cls) {
      return cls?.roster ? cls.roster.filter((student) => !student.submitted).length : 0;
    }
    function selectUnsubmitted(classId) {
      const cls = classById(classId);
      if (!cls || state.phase !== "select" || state.starting || cls.rosterState !== "ready" || !canCompareSubmitted()) return false;
      const ids = cls.roster.filter((student) => !student.submitted).map((student) => student.id);
      if (!ids.length) return false;
      cls.studentIds = ids.length === cls.roster.length ? null : new Set(ids);
      emit();
      return true;
    }
    function toggleStudentList(classId) {
      const cls = classById(classId);
      if (!cls) return;
      cls.expanded = !cls.expanded;
      emit();
    }
    function toggleCombo(key, included) {
      if (state.phase !== "select" || state.starting) return;
      if (included) state.excluded.delete(key); else state.excluded.add(key);
      emit();
    }
    function setDate(value) {
      if (state.phase !== "select" || state.starting || !validDate(value) || value === state.date) return false;
      state.date = value;
      state.excluded.clear();
      const pending = [];
      for (const cls of state.classes) {
        if (cls.checked) applyAutoExclusion(cls);
        // 출제일이 바뀌면 명단의 '이미 제출' 표시가 달라지므로 켜진 반의 명단을 다시 받는다.
        if (cls.rosterState !== "idle") { cls.token += 1; cls.rosterState = "idle"; cls.roster = null; cls.studentIds = null; }
        if (cls.checked) pending.push(loadRoster(cls.id));
      }
      emit();
      return Promise.all(pending).then(() => true);
    }
    // 원본 출제의 '한 쪽 문항 수'. 패널은 늘 4문항으로 시작하고(옛 모달의 기억값은 읽지도 쓰지도 않는다)
    // `바꾸기`로 고른 값은 이번 출제에만 쓴다.
    function toggleQpp() {
      if (!usesRecent || state.phase !== "select" || state.starting) return;
      state.qppOpen = !state.qppOpen;
      emit();
    }
    function setQpp(value) {
      const qpp = Number(value);
      if (!usesRecent || state.phase !== "select" || state.starting || !QPP_VALUES.includes(qpp) || qpp === state.qpp) return false;
      state.qpp = qpp;
      emit();
      return true;
    }

    function plan() {
      const classes = [];
      const skipped = [];
      const combos = [];
      let loading = false;
      for (const cls of state.classes) {
        if (!cls.checked) continue;
        if (cls.rosterState === "loading" || cls.rosterState === "idle") { loading = true; continue; }
        const ids = selectedIds(cls);
        if (cls.rosterState !== "ready" || !ids.length) { skipped.push(cls); continue; }
        const entry = { cls, studentIds: ids, combos: [] };
        for (const paper of papers) {
          const key = comboKey(paper.id, cls.id);
          const combo = { key, paper, cls, studentIds: ids, included: !state.excluded.has(key), dup: dupInfo(paper.id, cls) };
          entry.combos.push(combo);
          if (combo.included) combos.push(combo);
        }
        classes.push(entry);
      }
      const used = classes.filter((entry) => entry.combos.some((combo) => combo.included));
      return {
        classes, skipped, combos, loading,
        classCount: used.length,
        paperCount: new Set(combos.map((combo) => combo.paper.id)).size,
        studentCount: used.reduce((sum, entry) => sum + entry.studentIds.length, 0),
      };
    }
    const canSubmit = () => state.phase === "select" && !state.starting && !state.working && (() => {
      const current = plan();
      return !current.loading && current.combos.length > 0;
    })();

    // ---- 보내기 ----
    function bodyFor(job) {
      // 옛 모달(saved paper 경로)과 같은 키 이름·순서.
      return Object.freeze({
        contract_version: CONTRACT,
        saved_paper_id: job.paperId,
        assignment_batch_id: job.batchId,
        class_id: job.classId,
        student_ids: job.studentIds.slice(),
        exam_date: job.date,
      });
    }
    // 원본 시험지 출제 본문: 옛 구현이 보내는 것과 같은 키·값이다.
    //  - 먼저 index.html registerIndexClassExamAssignment의 원본 분기 payload(class_id … target_scope)가 만들어지고,
    //  - archive2-entry.js prepareArchive2OriginalAssignment의 본문(contract_version, index_version, student_ids,
    //    exam_title·pdf_qpp 덮어쓰기, original_payload_json)이 Object.assign으로 겹쳐진다(키 순서도 그 결과와 같다).
    // assignment_batch_id는 서버 원본 분기가 읽지 않는 값(archive2.js는 saved_paper_id 분기·lifecycle에서만 쓴다)이지만
    // 옛 구현과 같은 모양을 유지하고, 얼려 둔 본문과 함께 재전송에도 그대로 간다.
    function originalBodyFor(job, paper, cls, questions, scope, stamp) {
      const settings = paper.settings;
      const fileTag = String(paper.file).replace(/[^a-zA-Z0-9_-]+/g, "_");
      const gradeTag = String(cls.grade || paper.grade || "class").replace(/[^a-zA-Z0-9가-힣_-]+/g, "_");
      return Object.freeze({
        class_id: job.classId,
        exam_title: settings.header.title,
        exam_date: job.date,
        question_count: paper.count,
        archive_file: `exams/${paper.file}`,
        source_type: "archive",
        mixed_payload_json: "",
        pdf_qpp: state.qpp,
        subject: paper.subject || "",
        grade_label: cls.grade || paper.grade || "",
        assignment_batch_id: `batch_archive_${fileTag}_${gradeTag}_${stamp}`,
        target_scope: scope,
        contract_version: CONTRACT,
        index_version: text(originalCtx.indexVersion),
        student_ids: job.studentIds.slice(),
        original_payload_json: {
          questions,
          meta: { identityTitle: paper.identityTitle, printHeaderOptions: settings.header, qpp: state.qpp, includeQr: settings.includeQr },
        },
      });
    }
    // 단원별 기출 본문: 옛 모달(index.html registerIndexClassExamAssignment 비-저장본 분기)이 보내는 것과 키·순서·값이 같다.
    // contract_version·student_ids가 없다(서버는 받는 사람을 반 전체로 기록한다 → 일부 학생은 exclude-students로 뺀다).
    // 다른 점은 둘뿐이다: exam_date와 pdf_qpp는 패널에서 고른 값이고, 패널이 쪽당 문항을 바꿨으면 meta.qpp도 같은 값이다.
    // 문항 수는 옛 경로처럼 실제 문항 배열 길이다.
    function unitBodyFor(job, paper, cls, scope, stamp) {
      const fileTag = String(paper.snapshotKey).replace(/[^a-zA-Z0-9_-]+/g, "_");
      const gradeTag = String(cls.grade || paper.grade || "class").replace(/[^a-zA-Z0-9가-힣_-]+/g, "_");
      return Object.freeze({
        class_id: job.classId,
        exam_title: paper.identityTitle || paper.title,
        exam_date: job.date,
        question_count: paper.payloadCount,
        archive_file: `MIXED:${paper.snapshotKey}`,
        source_type: "mixed",
        mixed_payload_json: paper.payloadJson,
        pdf_qpp: state.qpp,
        subject: text(paper.payloadMeta?.subject) || paper.subject || "",
        grade_label: cls.grade || paper.grade || "",
        assignment_batch_id: `batch_archive_${fileTag}_${gradeTag}_${stamp}`,
        target_scope: scope,
      });
    }
    // 고르지 않은 학생 = 명단 − 선택. 반 전체를 골랐으면 비어 있고 제외 요청은 나가지 않는다.
    function excludedIdsOf(combo) {
      if (!combo.cls.studentIds) return [];
      const picked = new Set(combo.studentIds);
      return (combo.cls.roster || []).filter((student) => !picked.has(student.id)).map((student) => student.id);
    }
    function buildJobs(current) {
      // 문제지 순서대로(한 권을 모든 반에 낸 뒤 다음 권), 같은 권 안에서는 반 순서대로 보낸다.
      const order = (combo) => papers.findIndex((p) => p.id === combo.paper.id) * 100000 + state.classes.findIndex((c) => c.id === combo.cls.id);
      const scope = current.classCount === 1 ? "class" : "grade";
      const stamp = now();
      return current.combos.slice().sort((a, b) => order(a) - order(b)).map((combo) => {
        const original = combo.paper.kind === "original";
        const unit = combo.paper.kind === "unit";
        const batch = original || unit ? null : store.ensure(combo.paper.id, combo.cls.id, state.date);
        if (original || unit) store.touch(combo.paper.id, combo.cls.id, state.date);
        const job = {
          key: combo.key, paperId: combo.paper.id, paperTitle: combo.paper.title, kind: original ? "original" : unit ? "unit" : "saved",
          classId: combo.cls.id, className: combo.cls.name, studentIds: combo.studentIds.slice(),
          date: state.date, batchId: batch ? batch.id : "", status: "queued", attempts: 0,
          assignmentId: "", message: "", pdfError: "", pdfBusy: false, already: false, auth: false, rebuild: false,
        };
        if (unit) {
          job.excludeIds = excludedIdsOf(combo);
          job.excludeTotal = job.excludeIds.length;
          job.operationId = job.excludeIds.length ? makeUuid() : "";
          job.examTitle = combo.paper.identityTitle || combo.paper.title;
          job.archiveFile = `MIXED:${combo.paper.snapshotKey}`;
        }
        job.body = original ? originalBodyFor(job, combo.paper, combo.cls, combo.paper.questions, scope, stamp)
          : unit ? unitBodyFor(job, combo.paper, combo.cls, scope, stamp) : bodyFor(job);
        return job;
      });
    }
    const createdMs = (value) => {
      const raw = text(value);
      if (!raw) return NaN;
      return Date.parse(/[zZ]|[+-]\d{2}:?\d{2}$/.test(raw) ? raw : `${raw.replace(" ", "T")}Z`);
    };
    const isCancelledAssignment = (assignment) => Boolean(text(assignment?.cancelled_at)) || Number(assignment?.is_cancelled) === 1;
    function applySuccess(job, response, startedAt) {
      const assignment = response?.assignment;
      if (!assignment?.id) {
        job.status = "unknown";
        job.message = "서버에서 응답을 받았지만 출제 번호가 없습니다. 출제가 되었는지 확인이 필요합니다.";
        return;
      }
      // 단원별 출제는 헤더 없는 옛 경로라 서버가 같은 (반, 출제일, 문제지)의 기존 건을 그대로 갱신해 돌려준다.
      // 그 건이 취소된 상태면 학생에게 보이지 않으므로 성공으로 세지 않는다.
      if (job.kind === "unit" && isCancelledAssignment(assignment)) {
        job.assignmentId = text(assignment.id);
        job.status = "cancelled";
        job.message = ORIGINAL_CANCELLED_MESSAGE;
        job.noReissue = true;
        store.mark(job.paperId, job.classId, job.date, "failed");
        return;
      }
      job.assignmentId = text(assignment.id);
      job.pdfError = "";
      job.message = "";
      // 서버는 같은 키·같은 학생이면 기존 건을 그대로 돌려준다. 만든 시각이 이번 요청보다 한참 앞이면 '이미 있던 건'이다.
      const created = createdMs(assignment.created_at);
      job.already = Number.isFinite(created) && created < startedAt - 120000;
      const pdfStatus = text(assignment.pdf_status);
      if (pdfStatus && pdfStatus !== "ready") {
        job.status = "ok-pdf";
        warnRaw(text(assignment.pdf_error || response?.error));
        job.pdfError = PDF_DELAY_MESSAGE;
      } else job.status = "ok";
      store.clear(job.paperId, job.classId, job.date);
      issuedHere.add(job.paperId, job.classId, job.date);
      if (job.kind !== "saved") recentCache.reset(); // 다음에 열 때 방금 낸 건이 이력에 보이게 한다
      state.dirty = true;
    }
    function applyFailure(job, error) {
      const info = classifyError(error, { original: job.kind === "original", unit: job.kind === "unit" });
      job.auth = Boolean(info.auth);
      // 원본·단원별 출제는 batch id가 없어 취소된 건과 같은 키를 피할 길이 날짜뿐이다: '새로 출제'를 주지 않는다.
      job.noReissue = job.kind !== "saved";
      // 단원별: 같은 날 같은 이름의 확정 배부가 이미 있어 서버가 바꿀 수 없다고 하면 같은 본문을 다시 보내도 같은 409다.
      job.noRetry = job.kind === "unit" && info.kind === "failed" && /확정 배부는 원본을 변경할 수 없/.test(text(error?.data?.error || error?.message));
      if (info.kind === "ok-pdf" && job.kind === "unit" && isCancelledAssignment(error?.data?.assignment)) {
        job.assignmentId = text(error.data.assignment.id);
        job.status = "cancelled";
        job.message = ORIGINAL_CANCELLED_MESSAGE;
        store.mark(job.paperId, job.classId, job.date, "failed");
        return;
      }
      if (info.kind === "ok-pdf") {
        job.status = "ok-pdf";
        job.assignmentId = info.assignmentId;
        warnRaw(info.raw);
        job.pdfError = info.message;
        job.message = "";
        store.clear(job.paperId, job.classId, job.date);
        issuedHere.add(job.paperId, job.classId, job.date);
        if (job.kind !== "saved") recentCache.reset();
        state.dirty = true;
        return;
      }
      job.status = info.kind;
      job.message = info.message;
      if (info.kind === "failed" || info.kind === "cancelled") store.mark(job.paperId, job.classId, job.date, "failed");
    }
    async function sendJob(job) {
      if (job.rebuild) {
        // 교사가 '새로 출제'를 직접 눌렀을 때만: 취소된 건의 번호를 버리고 새 번호를 만든다.
        store.clear(job.paperId, job.classId, job.date);
        try {
          job.batchId = store.ensure(job.paperId, job.classId, job.date).id;
        } catch {
          job.status = "cancelled";
          job.message = ID_ERROR_MESSAGE;
          emit();
          return;
        }
        job.body = bodyFor(job);
        job.rebuild = false;
      }
      job.status = "running";
      job.attempts += 1;
      job.message = "";
      job.auth = false;
      job.noRetry = false;
      const startedAt = now();
      store.mark(job.paperId, job.classId, job.date, "sent");
      emit();
      let response;
      try {
        // 단원별 출제는 계약 헤더 없이 보낸다(서버의 헤더 경로는 단원별 문제지를 받지 못한다).
        response = await request("/class-exam-assignments", job.kind === "unit"
          ? { method: "POST", body: job.body, timeoutMs: WRITE_TIMEOUT_MS }
          : { method: "POST", headers: { "X-Archive2-Contract": CONTRACT }, body: job.body, timeoutMs: WRITE_TIMEOUT_MS });
      } catch (error) {
        applyFailure(job, error);
        emit();
        // 서버가 출제를 저장한 뒤 PDF만 실패하면 502 + assignment다: 출제는 됐으므로 이 경우에도 고르지 않은 학생을 뺀다
        // (성공 분기와 같은 길). 취소된 건(status cancelled)과 진짜 실패는 여기서 제외하지 않는다.
        if (job.kind === "unit" && job.status === "ok-pdf" && job.excludeIds.length) await excludeStep(job);
        return;
      }
      applySuccess(job, response, startedAt);
      emit();
      if (job.kind === "unit" && (job.status === "ok" || job.status === "ok-pdf") && job.excludeIds.length) await excludeStep(job);
    }
    // 단원별 출제: POST 성공 뒤 같은 작업 안에서 고르지 않은 학생을 뺀다. 서버는 학생·건마다 operation_identity로 멱등이라
    // 같은 번호로 다시 보내도 안전하다. 한 번에 최대 200명이라 나눠 보내고, 성공이 확인된 학생은 남은 목록에서 지운다.
    // 하나라도 못 빼면 성공으로 표시하지 않는다: 그동안 그 건은 반 전체에게 보인다.
    const EXCLUDE_CHUNK = 200;
    const excludeFailMessage = (job) => `출제는 됐지만 고르지 않은 학생 ${job.excludeIds.length}명을 빼지 못했습니다. 지금은 반 전체에게 보입니다.`;
    async function excludeStep(job) {
      const before = job.status;
      job.excludeFrom = job.excludeFrom || (before === "exclude-failed" ? "ok" : before); // 제외가 끝나면 돌아갈 상태(ok | ok-pdf)
      job.status = "running";
      job.message = "";
      emit();
      let failure = null;
      while (job.excludeIds.length) {
        const chunk = job.excludeIds.slice(0, EXCLUDE_CHUNK);
        let response;
        try {
          response = await request("/class-exam-assignments/exclude-students", {
            method: "POST", timeoutMs: WRITE_TIMEOUT_MS,
            body: {
              ...(job.assignmentId ? { assignment_id: job.assignmentId } : {}),
              class_id: job.classId, student_ids: chunk, operation_identity: job.operationId,
              exam_title: job.examTitle, exam_date: job.date, archive_file: job.archiveFile,
            },
          });
          if (response?.success === false) throw Object.assign(new Error("exclude failed"), { data: response });
        } catch (error) {
          failure = error;
          // 일부 학생만 성공한 응답이면 성공한 학생은 남은 목록에서 뺀다.
          const done = new Set((Array.isArray(error?.data?.results) ? error.data.results : []).filter((row) => row?.success).map((row) => text(row.student_id)));
          job.excludeIds = job.excludeIds.filter((id) => !done.has(id));
          break;
        }
        const ok = response?.results ? new Set(response.results.filter((row) => row?.success).map((row) => text(row.student_id))) : null;
        job.excludeIds = job.excludeIds.filter((id) => (ok ? !ok.has(id) : !chunk.includes(id)));
        if (ok && chunk.some((id) => !ok.has(id))) { failure = new Error("exclude partial"); break; }
      }
      if (!failure) {
        job.status = job.excludeFrom === "ok-pdf" || job.pdfError ? "ok-pdf" : "ok";
        job.excludeFrom = "";
        job.message = "";
        return;
      }
      job.status = "exclude-failed";
      job.message = excludeFailMessage(job);
      if (Number(failure?.status) === 401) {
        job.auth = true;
        job.message = `${excludeFailMessage(job)} 로그인이 끝났습니다. 다시 로그인한 뒤 다시 빼 주세요.`;
      } else warnRaw(text(failure?.data?.error || failure?.message));
    }
    // 조합을 하나씩 차례로 보낸다(동시에 둘 이상 보내지 않는다). 401이면 남은 건을 보내지 않고 멈춘다.
    async function drive(jobs, step = sendJob) {
      state.authLost = false;
      try {
        for (const job of jobs) {
          try {
            await step(job);
          } catch (error) {
            // 예상 밖 오류도 그 건을 '결과 확인 필요'로 두고 다음 건으로 간다(요청이 이미 나갔을 수 있다).
            if (step === sendJob) {
              job.status = "unknown";
              job.message = "처리 중 오류가 있었습니다. 출제가 되었는지 확인이 필요합니다.";
            } else {
              job.status = "exclude-failed";
              job.message = excludeFailMessage(job);
            }
          }
          if (job.auth) { state.authLost = true; break; }
        }
      } finally {
        state.working = false;
        state.starting = false;
        state.phase = "done";
        emit();
        notifyDone();
      }
    }
    function notifyDone() {
      if (!state.dirty) return;
      state.dirty = false;
      try { onDone({ jobs: state.jobs.slice(), succeeded: state.jobs.filter((job) => job.status === "ok" || job.status === "ok-pdf").length }); } catch { /* 보관함 새로고침 실패가 결과를 가리지 않는다 */ }
    }
    function start() {
      // 이중 클릭 방지: 첫 호출이 동기적으로 잠근다.
      if (state.starting || state.working || state.phase !== "select") return Promise.resolve(false);
      const current = plan();
      if (current.loading || !current.combos.length) return Promise.resolve(false);
      state.starting = true;
      state.working = true;
      state.startError = "";
      const wantsUnit = current.combos.some((combo) => combo.paper.kind === "unit");
      const wantsOriginal = current.combos.some((combo) => combo.paper.kind === "original");
      if (!wantsUnit && !wantsOriginal) return Promise.resolve(run());
      return (async () => {
        if (wantsUnit && !(await prepareUnits(current))) return false;
        if (wantsOriginal && !(await prepareOriginals(current))) return false;
        return run();
      })();
    }
    // 단원별 문제지: 이번에 낼 모든 권의 본문을 먼저 만들고, 하나라도 못 만들거나 서버 한도(900000자)를 넘으면 아무것도 보내지 않는다.
    // 어느 권이 왜 안 되는지 알려 주고 잠금을 풀어 교사가 고쳐 다시 누르게 한다.
    const MIXED_PAYLOAD_LIMIT = 900000;
    async function prepareUnits(current) {
      const targets = papers.filter((paper) => paper.kind === "unit" && current.combos.some((combo) => combo.paper.id === paper.id));
      let message = "";
      for (const paper of targets) {
        try {
          if (typeof unitCtx.load !== "function") throw new Error("unit loader missing");
          const loaded = await loadUnitPayload(paper);
          const meta = { ...loaded.meta, qpp: state.qpp };
          const json = JSON.stringify({ questions: loaded.questions, meta });
          if (json.length > MIXED_PAYLOAD_LIMIT) { message = `「${paper.title}」 ${UNIT_TOO_BIG_MESSAGE}`; break; }
          paper.payloadJson = json;
          paper.payloadMeta = meta;
          paper.payloadCount = loaded.questions.length;
        } catch (error) {
          warnRaw(text(error?.message));
          message = `「${paper.title}」 ${error?.unitEmpty ? UNIT_EMPTY_MESSAGE : UNIT_LOAD_MESSAGE}`;
          break;
        }
      }
      if (!message) return true;
      state.starting = false;
      state.working = false;
      state.startError = message;
      emit();
      return false;
    }
    // 원본 문항을 아직 못 받았으면 지금 받아(미리 받기에 실패했을 수 있다) 모든 건의 본문을 만들 수 있을 때만 시작한다.
    // 하나라도 못 받으면 아무것도 보내지 않고 잠금을 풀어 교사가 안내를 읽고 다시 누르게 한다.
    async function prepareOriginals() {
      const targets = papers.filter((paper) => paper.kind === "original");
      let message = "";
      if (!text(originalCtx.indexVersion) || typeof originalCtx.loadQuestions !== "function") message = SOURCE_CHANGED_MESSAGE;
      else {
        for (const paper of targets) {
          try {
            paper.questions = await loadOriginalQuestions(paper);
          } catch (error) {
            warnRaw(text(error?.message));
            message = error?.sourceCount ? SOURCE_COUNT_MESSAGE : SOURCE_LOAD_MESSAGE;
            break;
          }
        }
      }
      if (!message) return true;
      state.starting = false;
      state.working = false;
      state.startError = message;
      emit();
      return false;
    }
    function run() {
      // 준비가 끝난 뒤 계획을 다시 읽는다(준비 중 바뀌지 않게 토글을 잠가 두었지만 명단 응답은 그 사이 올 수 있다).
      const current = plan();
      if (current.loading || !current.combos.length) {
        state.starting = false;
        state.working = false;
        emit();
        return false;
      }
      try {
        state.jobs = buildJobs(current);
      } catch (error) {
        // 출제 번호를 만들 수 없으면 아무것도 보내지 않고 잠금을 풀어 교사가 안내를 읽게 한다.
        state.starting = false;
        state.working = false;
        state.jobs = [];
        state.startError = ID_ERROR_MESSAGE;
        emit();
        return false;
      }
      state.phase = "running";
      emit();
      return drive(state.jobs).then(() => true);
    }
    function pendingJobs(statuses) {
      return state.jobs.filter((job) => statuses.includes(job.status));
    }
    function resume(statuses, only = null, step = sendJob) {
      if (state.working || state.phase !== "done") return Promise.resolve(false);
      const jobs = pendingJobs(statuses).filter((job) => (!only || job.key === only) && !job.noRetry);
      if (!jobs.length) return Promise.resolve(false);
      state.working = true;
      state.phase = "running";
      state.closeWarn = false;
      emit();
      return drive(jobs, step).then(() => true);
    }
    // 실패한 건과 보내지 못한 건을 같은 본문·같은 batch id로 다시 보낸다.
    const retryFailed = () => resume(["failed", "queued"]);
    // 취소된 출제와 같은 번호(409)는 자동으로 다시 보내지 않는다. 교사가 '새로 출제'를 직접 누른 그 건만 새 번호로 보낸다.
    function reissue(key) {
      const job = state.jobs.find((row) => row.key === key);
      if (!job || job.status !== "cancelled" || job.noReissue || state.working || state.phase !== "done") return Promise.resolve(false);
      job.rebuild = true;
      return resume(["cancelled"], key);
    }
    // 응답을 못 받은 건을 같은 본문·같은 batch id로 다시 보낸다: 서버에 이미 있으면 그 건이 돌아온다.
    const confirmUnknown = (key = null) => resume(["unknown"], key);
    // 출제는 됐지만 고르지 않은 학생을 빼지 못한 건: 제외 요청만 같은 번호로 다시 보낸다(출제를 다시 보내지 않는다).
    const retryExclusion = (key = null) => resume(["exclude-failed"], key, (job) => { job.auth = false; return excludeStep(job); });
    const hasUnresolvedExclusion = () => state.jobs.some((job) => job.status === "exclude-failed");

    async function retryPdf(key) {
      const job = state.jobs.find((row) => row.key === key);
      if (!job || job.status !== "ok-pdf" || !job.assignmentId || job.pdfBusy || isBusy()) return false;
      job.pdfBusy = true;
      emit();
      try {
        const response = await request(`/class-exam-assignments/${encodeURIComponent(job.assignmentId)}/pdf`, {
          method: "POST", body: {}, timeoutMs: WRITE_TIMEOUT_MS,
        });
        const assignment = response?.assignment;
        if (text(assignment?.pdf_status) === "ready") {
          job.status = "ok";
          job.pdfError = "";
        } else { warnRaw(text(assignment?.pdf_error || response?.error)); job.pdfError = PDF_RETRY_MESSAGE; }
      } catch (error) {
        if (Number(error?.status) === 401) state.authLost = true;
        warnRaw(text(error?.data?.error || error?.message));
        job.pdfError = PDF_RETRY_MESSAGE;
      } finally {
        job.pdfBusy = false;
        emit();
      }
      return true;
    }

    function isBusy() {
      return state.starting || state.working || state.jobs.some((job) => job.pdfBusy || job.status === "running");
    }
    // 진행 중에는 닫을 수 없다(패널 닫기·바깥 누름·Esc·뒤로 가기가 모두 여기를 지난다).
    function requestClose() {
      if (isBusy()) {
        state.busyNote = true;
        emit();
        return { allowed: false, message: "출제 중입니다. 잠시만요." };
      }
      // 고르지 않은 학생을 빼지 못한 건이 있으면 한 번 알리고, 두 번째 닫기부터 허용한다.
      if (hasUnresolvedExclusion() && !state.closeWarn) {
        state.closeWarn = true;
        emit();
        return { allowed: false, warn: true, message: "학생을 빼지 못한 건이 있습니다. 지금은 반 전체에게 보입니다." };
      }
      notifyDone();
      return { allowed: true, message: "" };
    }
    function results() {
      const count = (status) => state.jobs.filter((job) => job.status === status).length;
      return {
        total: state.jobs.length, ok: count("ok"), okPdf: count("ok-pdf"), failed: count("failed"), cancelled: count("cancelled"),
        unknown: count("unknown"), queued: count("queued"), running: count("running"), excludeFailed: count("exclude-failed"),
        retryable: state.jobs.filter((job) => (job.status === "failed" && !job.noRetry) || job.status === "queued").length,
      };
    }

    return {
      state, load, loadRoster, toggleClass, toggleStudent, selectAllStudents, toggleStudentList, toggleCombo, setDate,
      plan, canSubmit, start, retryFailed, confirmUnknown, retryPdf, isBusy, requestClose, results, retryExclusion, hasUnresolvedExclusion,
      dupInfo, pendingNotes, store, canCompareSubmitted, selectUnsubmitted, unsubmittedCount, reissue,
      setQpp, toggleQpp, loadOriginalHistory,
      retryRoster: loadRoster,
      subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    };
  }

  // ---- 렌더 (상태 → HTML 문자열) ---------------------------------------------------------------------
  const APMS_URL = "../apmath/";
  function totalQuestions(papers) { return papers.reduce((sum, paper) => sum + paper.count, 0); }

  function renderHead(model) {
    const { papers, phase } = model.state;
    const busy = model.isBusy();
    const heading = phase === "done" ? "출제 결과" : "반에 출제";
    const sub = papers.length === 1
      ? `${esc(papers[0].title)} · ${papers[0].count}문항`
      : `문제지 ${papers.length}권 · ${totalQuestions(papers)}문항`;
    const list = papers.length > 1
      ? `<details class="assign-paper-list"><summary>문제지 ${papers.length}권 보기</summary><ol>${papers.map((paper) => `<li>${esc(paper.title)} <span>${paper.count}문항</span></li>`).join("")}</ol></details>`
      : "";
    return `<div class="assign-head-row"><h2 id="assign-title" tabindex="-1">${heading}</h2><button type="button" class="assign-close small" data-assign-action="close" data-focus="close"${busy ? " disabled" : ""}>닫기</button></div><p class="assign-sub">${sub}</p>${list}`;
  }

  function noteMarkup(items) {
    return items.length ? `<ul class="assign-class-notes">${items.join("")}</ul>` : "";
  }
  function classRowMarkup(model, cls) {
    const { papers, date } = model.state;
    const id = esc(cls.id);
    const empty = cls.rosterState === "ready" && !cls.roster.length;
    const noGrade = !cls.grade;
    const students = cls.rosterState === "ready" ? (cls.studentIds ? cls.studentIds.size : cls.roster.length) : 0;
    const count = cls.rosterState === "ready" && !empty ? `${students}명`
      : cls.rosterState === "loading" ? "명단 확인 중…" : "";
    const notes = [];
    if (empty) notes.push('<li class="is-warn">재원 학생이 없어 출제할 수 없습니다.</li>');
    if (noGrade) notes.push('<li class="is-warn">반 학년을 확인할 수 없어 서버가 출제를 거절할 수 있습니다. APMS에서 반 학년을 확인해 주세요.</li>');
    if (papers.length === 1) {
      const dup = model.dupInfo(papers[0].id, cls);
      if (dup.sameDate) notes.push(`<li class="is-warn">${esc(dayLabel(dup.sameDate.date, date))}에 이미 냈습니다.</li>`);
      else if (dup.cancelledSameDate) notes.push(`<li class="is-warn">${esc(dayLabel(dup.cancelledSameDate.date, date))}에 낸 출제가 취소된 상태라 같은 날짜로는 다시 낼 수 없습니다. 출제일을 바꿔 주세요.</li>`);
      else if (dup.latest) notes.push(`<li>${esc(dayLabel(dup.latest.date, date))}에 낸 적이 있습니다.</li>`);
    } else {
      const same = papers.filter((paper) => model.dupInfo(paper.id, cls).sameDate).length;
      if (same) notes.push(`<li class="is-warn">이 날짜에 ${same}권은 이미 냈습니다. 아래 출제 건에서 확인하세요.</li>`);
      const cancelled = papers.filter((paper) => model.dupInfo(paper.id, cls).cancelledSameDate).length;
      if (cancelled) notes.push(`<li class="is-warn">이 날짜에 ${cancelled}권은 낸 출제가 취소된 상태라 같은 날짜로는 다시 낼 수 없습니다.</li>`);
    }
    for (const paper of papers) {
      for (const pendingDate of model.pendingNotes(paper.id, cls)) {
        const label = papers.length > 1 ? `「${esc(paper.title)}」 ` : "";
        notes.push(pendingDate === date
          ? `<li class="is-warn">${label}이전에 보낸 출제의 결과를 확인하지 못했습니다. 다시 출제하면 같은 건으로 확인합니다.</li>`
          : `<li class="is-warn">${label}${esc(dayLabel(pendingDate, date))} 출제의 결과를 확인하지 못했습니다. 출제 내역에서 확인해 주세요.</li>`);
      }
    }
    let studentsBlock = "";
    if (cls.checked && cls.rosterState === "error") {
      studentsBlock = `<p class="assign-roster-error" role="alert">학생 명단을 불러오지 못했습니다. 이 반은 빼고 출제할 수 있습니다. <button type="button" class="assign-link" data-assign-action="roster-retry" data-class-id="${id}" data-focus="retry-${id}">다시 시도</button></p>`;
    } else if (cls.checked && cls.rosterState === "ready" && !empty) {
      const excluded = cls.roster.length - students;
      const summary = excluded ? `${students}명에게 출제 (${excluded}명 제외)` : `전체 ${students}명에게 출제`;
      const unsubmitted = model.unsubmittedCount(cls);
      const onlyUnsubmitted = Boolean(cls.studentIds) && cls.studentIds.size === unsubmitted && cls.roster.every((student) => cls.studentIds.has(student.id) !== Boolean(student.submitted));
      // 빠른 선택은 문제지가 한 권일 때만 뜻이 분명하다(제출 여부는 그 시험 기준).
      const quick = model.canCompareSubmitted()
        ? `<div class="assign-quick" role="group" aria-label="빠른 선택"><button type="button" class="small" data-assign-action="students-all" data-class-id="${id}" data-focus="all-${id}" aria-pressed="${cls.studentIds ? "false" : "true"}">전체</button><button type="button" class="small" data-assign-action="students-unsubmitted" data-class-id="${id}" data-focus="unsub-${id}" aria-pressed="${onlyUnsubmitted ? "true" : "false"}"${unsubmitted ? "" : " disabled"}>아직 안 본 학생만</button>${unsubmitted ? "" : '<span class="assign-muted">모두 응시했습니다</span>'}</div>` : "";
      const grid = cls.expanded
        ? `${quick}<ul class="assign-student-grid">${cls.roster.map((student) => {
          const on = !cls.studentIds || cls.studentIds.has(student.id);
          return `<li><label><input type="checkbox" data-assign-action="student" data-class-id="${id}" data-student-id="${esc(student.id)}" data-focus="student-${id}-${esc(student.id)}"${on ? " checked" : ""}><span>${esc(student.name)}${student.submitted && model.canCompareSubmitted() ? ' <small class="assign-muted">응시함</small>' : ""}</span></label></li>`;
        }).join("")}</ul>`
        : "";
      studentsBlock = `<div class="assign-students"><p><span>${summary}</span> <button type="button" class="assign-link" data-assign-action="students-toggle" data-class-id="${id}" data-focus="students-${id}" aria-expanded="${cls.expanded ? "true" : "false"}">${cls.expanded ? "학생 목록 접기" : "학생 고르기"}</button></p>${grid}</div>`;
    }
    const teacher = cls.teacher ? `<small>${esc(cls.teacher)}</small>` : "";
    return `<li class="assign-class${cls.checked ? " is-checked" : ""}" data-class-row="${id}"><label class="assign-class-main"><input type="checkbox" data-assign-action="class" data-class-id="${id}" data-focus="class-${id}"${cls.checked ? " checked" : ""}${empty ? " disabled" : ""}><span class="assign-class-name">${esc(cls.name)}${teacher}</span><span class="assign-class-count">${esc(count)}</span></label>${noteMarkup(notes)}${studentsBlock}</li>`;
  }

  function classGroups(model) {
    const { papers, classes, openGroups } = model.state;
    const paperGrades = new Set(papers.map((paper) => paper.grade).filter((grade) => GRADES.includes(grade)));
    const byGrade = new Map();
    for (const cls of classes) {
      const key = cls.grade || "";
      if (!byGrade.has(key)) byGrade.set(key, []);
      byGrade.get(key).push(cls);
    }
    const order = [...byGrade.keys()].sort((a, b) => {
      const aMain = !paperGrades.size || paperGrades.has(a), bMain = !paperGrades.size || paperGrades.has(b);
      if (aMain !== bMain) return aMain ? -1 : 1;
      return (GRADES.indexOf(a) < 0 ? 99 : GRADES.indexOf(a)) - (GRADES.indexOf(b) < 0 ? 99 : GRADES.indexOf(b));
    });
    return order.map((grade) => {
      const rows = byGrade.get(grade);
      const main = !paperGrades.size || paperGrades.has(grade);
      const open = main || order.length === 1 || openGroups.has(grade) || rows.some((cls) => cls.checked);
      return { grade, rows, main, open };
    });
  }
  function classesMarkup(model) {
    const groups = classGroups(model);
    const paperGrades = [...new Set(model.state.papers.map((paper) => paper.grade).filter(Boolean))];
    const original = model.state.papers.some((paper) => paper.kind === "original");
    const unsaved = model.state.papers.some((paper) => paper.kind === "original" || paper.kind === "unit");
    const hint = paperGrades.length ? `${esc(paperGrades.join("·"))} ${original ? "시험지" : "문제지"}입니다. 같은 학년 반을 먼저 보여 줍니다.` : "출제할 반을 고르세요.";
    // 원본 시험지·단원별 문제지는 이전 출제 기록을 따로 받아 온다. 못 받아도 출제는 할 수 있고, 같은 건은 서버가 같은 건으로 받는다.
    const historyNote = !unsaved ? ""
      : model.state.historyState === "loading" ? '<p class="assign-hint" role="status">이전 출제 기록을 확인하는 중…</p>'
      : model.state.historyState === "error" ? '<p class="assign-hint is-warn" role="status">이전 출제 기록을 확인하지 못했습니다. 출제는 할 수 있습니다.</p>'
      : model.state.historyTruncated ? '<p class="assign-hint" role="status">출제 기록이 많아 일부는 확인하지 못할 수 있습니다.</p>' : "";
    const body = groups.map((group) => {
      const label = group.grade || "학년 미확인";
      const chip = `<span class="assign-grade-chip ${gradeClassOf(group.grade)}">${esc(label)}</span>`;
      const rows = `<ul class="assign-class-list">${group.rows.map((cls) => classRowMarkup(model, cls)).join("")}</ul>`;
      return group.main || group.open && groups.length === 1
        ? `<section class="assign-group" data-grade="${esc(group.grade)}"><h3 class="assign-group-title">${chip}<span>${group.main ? "반" : "다른 학년 반"}</span></h3>${rows}</section>`
        : `<details class="assign-group is-other" data-grade="${esc(group.grade)}"${group.open ? " open" : ""}><summary>${chip}<span>다른 학년 반 ${group.rows.length}개</span></summary>${rows}</details>`;
    }).join("");
    return `<fieldset class="assign-classes"><legend>반 선택</legend><p class="assign-hint">${hint}</p>${historyNote}${body}</fieldset>`;
  }
  function dateMarkup(model) {
    const { date, qpp, qppOpen } = model.state;
    const today = kstToday();
    // 원본 시험지는 한 쪽 문항 수가 PDF·학생 시험지에 그대로 쓰인다(서버가 같은 날 같은 시험지의 쪽당 문항이 다르면 거절한다).
    const original = model.state.papers.some((paper) => paper.kind === "original" || paper.kind === "unit");
    const qppField = original
      ? `<section class="assign-date assign-qpp"><span class="assign-qpp-line${qpp === 4 ? "" : " is-changed"}">한 쪽 ${qpp}문항</span><button type="button" class="assign-link" data-assign-action="qpp-toggle" data-focus="qpp-toggle" aria-expanded="${qppOpen ? "true" : "false"}">${qppOpen ? "접기" : "바꾸기"}</button>${qppOpen ? `<div id="assign-qpp-choices" class="assign-quick" role="group" aria-label="한 쪽 문항 수">${QPP_VALUES.map((n) => `<button type="button" class="small" data-assign-action="qpp-set" data-qpp="${n}" data-focus="qpp-${n}" aria-pressed="${n === qpp ? "true" : "false"}">${n}문항</button>`).join("")}</div>` : ""}</section>`
      : "";
    return `<section class="assign-date"><label for="assign-date-input">출제일</label><input id="assign-date-input" type="date" value="${esc(date)}" data-assign-action="date" data-focus="date"><span>${date === today ? "오늘" : esc(dayLabel(date, today))}</span></section>${qppField}`;
  }
  function combosMarkup(model, plan) {
    if (model.state.papers.length < 2 || !plan.classes.length) return "";
    const rows = plan.classes.map((entry) => `<li><strong>${esc(entry.cls.name)}</strong> <span class="assign-muted">${entry.studentIds.length}명</span><ul>${entry.combos.map((combo) => {
      const note = combo.dup.sameDate
        ? `<span class="assign-warn">${esc(dayLabel(combo.dup.sameDate.date, model.state.date))}에 이미 냈습니다</span>`
        : combo.dup.cancelledSameDate ? '<span class="assign-warn">낸 출제가 취소된 상태라 같은 날짜로는 다시 낼 수 없습니다</span>' : "";
      return `<li><label><input type="checkbox" data-assign-action="combo" data-key="${esc(combo.key)}" data-focus="combo-${esc(combo.key)}"${combo.included ? " checked" : ""}><span>${esc(combo.paper.title)}</span></label>${note}</li>`;
    }).join("")}</ul></li>`).join("");
    return `<section class="assign-combos"><h3>출제 건 확인</h3><ul>${rows}</ul></section>`;
  }
  function summaryMarkup(model, plan) {
    const total = plan.combos.length;
    if (plan.loading) return '<p class="assign-summary" role="status">명단을 확인하는 중…</p>';
    if (!total) return '<p class="assign-summary is-empty" role="status">반을 고르면 여기에 출제 요약이 나옵니다.</p>';
    const skipped = plan.skipped.length
      ? `<span class="assign-warn">명단을 못 불러온 반은 빼고 출제합니다: ${esc(plan.skipped.map((cls) => cls.name).join(", "))}</span>` : "";
    const line = model.state.papers.length > 1
      ? `<span class="assign-summary-text">문제지 ${plan.paperCount}권 × ${plan.classCount}개 반 = ${total}건, 학생 ${plan.studentCount}명</span>`
      : `<span class="assign-summary-count">${plan.studentCount}명</span> <span>${plan.classCount}개 반</span>`;
    return `<p class="assign-summary" role="status">${line}${skipped}</p>`;
  }
  const STATUS_LABEL = {
    queued: "대기 중", running: "출제 중…", ok: "출제됨", "ok-pdf": "출제됨 · PDF만 준비 실패",
    "exclude-failed": "출제됨 · 학생 제외 실패", failed: "실패", cancelled: "취소된 출제", unknown: "결과 확인 필요",
  };
  function jobMarkup(model, job) {
    const multi = model.state.papers.length > 1;
    const authStopped = model.state.authLost && job.status === "queued";
    const label = authStopped ? "보내지 않음" : job.status === "ok" && job.already ? "이미 출제됨 (같은 건)"
      : job.status === "ok" && job.attempts > 1 ? "출제됨 (다시 확인해 같은 건으로 처리)" : STATUS_LABEL[job.status];
    const id = esc(job.assignmentId);
    const detail = job.status === "ok-pdf" ? job.pdfError : ["failed", "unknown", "cancelled", "exclude-failed"].includes(job.status) ? job.message : "";
    const actions = [];
    if (job.status === "unknown") actions.push(`<button type="button" class="small" data-assign-action="confirm" data-key="${esc(job.key)}" data-focus="confirm-${esc(job.key)}">확인하기</button>`);
    if (job.status === "exclude-failed") actions.push(`<button type="button" class="small" data-assign-action="exclude-retry" data-key="${esc(job.key)}" data-focus="exclude-${esc(job.key)}">다시 빼기</button>`);
    if (job.status === "cancelled" && !job.noReissue) actions.push(`<button type="button" class="small" data-assign-action="reissue" data-key="${esc(job.key)}" data-focus="reissue-${esc(job.key)}">새로 출제</button>`);
    if (job.status === "ok-pdf") actions.push(`<button type="button" class="small" data-assign-action="pdf" data-key="${esc(job.key)}" data-focus="pdf-${esc(job.key)}"${job.pdfBusy ? " disabled" : ""}>${job.pdfBusy ? "PDF 준비 중…" : "PDF 다시 준비"}</button>`);
    const outputs = (job.status === "ok" || job.status === "ok-pdf") && job.assignmentId && model.state.outputLinks !== false
      ? `<span class="assign-result-outputs" role="group" aria-label="출력">${[["exam", "시험지"], ["sol", "해설"], ["ans", "정답"]].map(([mode, name]) => `<button type="button" class="small" data-action="assignment-output-direct" data-assignment="${id}" data-mode="${mode}">${name}</button>`).join("")}</span>` : "";
    return `<li class="assign-result is-${job.status}" data-job="${esc(job.key)}"><div class="assign-result-head"><strong>${esc(job.className)}</strong>${multi ? `<span class="assign-result-paper">${esc(job.paperTitle)}</span>` : ""}<span class="assign-result-count">${job.studentIds.length}명</span></div><p class="assign-result-state">${esc(label)}</p>${detail ? `<p class="assign-result-detail">${esc(detail)}</p>` : ""}${actions.length || outputs ? `<div class="assign-result-actions">${actions.join("")}${outputs}</div>` : ""}</li>`;
  }
  function resultsMarkup(model) {
    const { authLost } = model.state;
    const auth = authLost
      ? `<p class="assign-auth" role="alert">로그인이 끝났습니다. 이미 출제된 건은 그대로입니다. <a href="${APMS_URL}" target="_blank" rel="noopener">APMS에서 다시 로그인</a>한 뒤 아래 버튼으로 남은 건을 이어서 출제하세요.</p>` : "";
    return `${auth}<ul class="assign-results" aria-label="출제 결과">${model.state.jobs.map((job) => jobMarkup(model, job)).join("")}</ul>`;
  }

  function renderBody(model) {
    const { phase } = model.state;
    if (phase === "loading") return '<p class="assign-state" role="status">반 목록을 불러오는 중…</p>';
    if (phase === "login") {
      return `<div class="assign-notice" data-assign-login><p>선생님 계정으로 로그인하면 출제할 수 있습니다.</p><p><a class="button-like primary" href="${APMS_URL}" target="_blank" rel="noopener">선생님 로그인</a></p><p class="assign-muted">로그인한 뒤 이 화면으로 돌아와 아래 버튼을 누르세요.</p><button type="button" data-assign-action="reload" data-focus="reload">다시 불러오기</button></div>`;
    }
    if (phase === "error") return `<div class="assign-notice"><p role="alert">${esc(model.state.error || "반 목록을 불러오지 못했습니다. 다시 시도해 주세요.")}</p><button type="button" data-assign-action="reload" data-focus="reload">다시 시도</button></div>`;
    if (phase === "empty") return `<div class="assign-notice" data-assign-empty><p>담당 반이 없습니다. 반 배정은 APMS에서 합니다.</p><p><a href="${APMS_URL}" target="_blank" rel="noopener">APMS 열기</a></p></div>`;
    if (phase === "select") {
      const plan = model.plan();
      return `${classesMarkup(model)}${dateMarkup(model)}${combosMarkup(model, plan)}`;
    }
    return resultsMarkup(model);
  }

  function renderFoot(model) {
    const { phase, busyNote } = model.state;
    if (phase === "select") {
      const plan = model.plan();
      const ready = model.canSubmit();
      const startError = model.state.startError ? `<p class="assign-auth" role="alert">${esc(model.state.startError)}</p>` : "";
      const waiting = model.state.papers.some((paper) => paper.kind === "unit") ? "문제지를 준비하는 중…" : "시험지 원본을 확인하는 중…";
      const summary = model.state.starting ? `<p class="assign-summary" role="status">${waiting}</p>` : summaryMarkup(model, plan);
      return `${startError}${summary}<button type="button" class="primary assign-submit" data-assign-action="submit" data-focus="submit"${ready ? "" : " disabled"}>출제하기</button><p class="assign-fine">출제하면 학생에게 바로 과제가 갑니다.</p>`;
    }
    if (phase === "running") {
      const r = model.results();
      const done = r.total - r.queued - r.running;
      return `<p class="assign-summary" role="status"><span class="assign-summary-count">${done}/${r.total}건</span> <span>출제 중입니다. 잠시만요.</span></p><button type="button" class="primary assign-submit" disabled aria-busy="true">출제 중…</button><p class="assign-fine${busyNote ? " is-flash" : ""}" role="status">${busyNote ? "출제 중에는 닫을 수 없습니다. 끝나면 닫을 수 있어요." : "창을 닫거나 페이지를 떠나지 마세요."}</p>`;
    }
    if (phase === "done") {
      const r = model.results();
      const bits = [];
      if (r.ok + r.okPdf + r.excludeFailed) bits.push(`출제됨 ${r.ok + r.okPdf + r.excludeFailed}건${r.okPdf ? ` (PDF만 실패 ${r.okPdf}건)` : ""}`);
      if (r.unknown) bits.push(`확인 필요 ${r.unknown}건`);
      if (r.excludeFailed) bits.push(`학생 제외 실패 ${r.excludeFailed}건 (반 전체에게 보임)`);
      if (r.failed) bits.push(`실패 ${r.failed}건`);
      if (r.cancelled) bits.push(`취소된 출제 ${r.cancelled}건`);
      if (r.queued) bits.push(`보내지 않음 ${r.queued}건`);
      const needRetry = r.retryable > 0;
      const buttons = [];
      if (r.excludeFailed) buttons.push(`<button type="button" class="${needRetry ? "" : "primary "}assign-submit" data-assign-action="exclude-retry-all" data-focus="exclude-all">다시 빼기</button>`);
      if (needRetry) buttons.push(`<button type="button" class="primary assign-submit" data-assign-action="retry" data-focus="retry">${r.queued && r.retryable === r.queued ? "남은 건 이어서 출제" : "실패한 건 다시 시도"}</button>`);
      if (r.unknown) buttons.push(`<button type="button" class="${needRetry ? "" : "primary "}assign-submit" data-assign-action="confirm-all" data-focus="confirm-all">${r.unknown > 1 ? "모두 확인하기" : "확인하기"}</button>`);
      buttons.push(`<button type="button" class="${buttons.length ? "" : "primary "}assign-submit" data-assign-action="close" data-focus="done-close">닫기</button>`);
      const closeWarn = model.state.closeWarn && r.excludeFailed
        ? '<p class="assign-auth" role="alert">고르지 않은 학생을 아직 빼지 못했습니다. 지금은 반 전체에게 보입니다. 다시 빼거나, 그대로 닫으려면 닫기를 한 번 더 누르세요.</p>' : "";
      return `${closeWarn}<p class="assign-summary" role="status">${esc(bits.join(" · ") || "출제 결과가 없습니다.")}</p><div class="assign-foot-actions">${buttons.join("")}</div>`;
    }
    return "";
  }

  function render(model) {
    return { head: renderHead(model), body: renderBody(model), foot: renderFoot(model) };
  }

  // ---- 화면 제어 --------------------------------------------------------------------------------------
  const useLegacy = (search) => {
    try { return new URLSearchParams(String(search || "")).get("assign") === "legacy"; } catch { return false; }
  };

  let active = null;
  let ignorePop = false;
  // workspace의 popstate 처리기가 맨 먼저 부른다. true면 이 이벤트는 패널이 처리했으니 화면을 다시 그리지 않는다.
  function handlePopState() {
    if (ignorePop) { ignorePop = false; return true; }
    if (!active) return false;
    active.handleBack();
    return true;
  }
  function isOpen() { return Boolean(active); }
  function isBusy() { return Boolean(active?.model.isBusy()); }

  function open(options = {}) {
    if (active) return active.api;
    const doc = options.document || (typeof document !== "undefined" ? document : null);
    if (!doc || typeof doc.createElement !== "function") throw new Error("출제 패널을 열 수 없습니다.");
    const win = doc.defaultView || (typeof window !== "undefined" ? window : null);
    let storage = options.storage || null;
    if (!storage) { try { storage = win?.localStorage || null; } catch { storage = null; } }
    const model = createModel({
      request: options.request, papers: options.papers, items: options.items, original: options.original, unit: options.unit, recentCache: options.recentCache,
      history: options.history, storage,
      uuid: options.uuid, now: options.now, doneStore: sharedDoneStore((() => { try { return win?.sessionStorage || null; } catch { return null; } })()), classGrade: options.classGrade || win?.Archive2History?.classGrade,
      onDone: options.onDone,
    });
    if (!model.state.papers.length) throw new Error(options.items ? "출제할 시험지를 확인할 수 없습니다. 목록으로 돌아가 다시 선택해 주세요." : "출제할 저장한 시험지를 확인할 수 없습니다. 목록으로 돌아가 다시 선택해 주세요.");
    model.state.outputLinks = options.outputLinks !== false;
    const opener = options.opener || doc.activeElement || null;

    const dialog = doc.createElement("dialog");
    dialog.className = "assign-panel";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "assign-title");
    dialog.innerHTML = '<div class="assign-shell"><header class="assign-head" data-region="head"></header><div class="assign-body" data-region="body"></div><footer class="assign-foot" data-region="foot"></footer></div>';
    const region = (name) => dialog.querySelector(`[data-region="${name}"]`);
    let closed = false, closing = false, sentinel = false, lastPhase = "", busyTimer = null;

    function render_() {
      if (closed) return;
      const body = region("body");
      const scroll = body ? body.scrollTop : 0;
      const focusKey = doc.activeElement?.getAttribute?.("data-focus") || "";
      const focusWasInside = Boolean(doc.activeElement && dialog.contains?.(doc.activeElement));
      // 머리를 다시 그리면 제목이 새 요소가 되어 포커스가 BODY로 빠진다(원본 출제는 이력·문항 받기로 같은 단계에서 다시 그릴 일이 많다).
      const titleFocused = doc.activeElement?.id === "assign-title";
      const parts = render(model);
      region("head").innerHTML = parts.head;
      body.innerHTML = parts.body;
      region("foot").innerHTML = parts.foot;
      if (titleFocused) region("head").querySelector("#assign-title")?.focus?.();
      if (model.state.phase === lastPhase) body.scrollTop = scroll;
      else {
        body.scrollTop = 0;
        if (lastPhase) region("head").querySelector("#assign-title")?.focus?.();
      }
      lastPhase = model.state.phase;
      if (focusKey && focusWasInside) {
        const target = dialog.querySelector(`[data-focus="${focusKey.replace(/"/g, '\\"')}"]`);
        if (target && !target.disabled) target.focus();
        else if (model.state.phase !== "loading") region("head").querySelector("#assign-title")?.focus?.();
      }
    }
    model.subscribe(render_);

    function flashBusy() {
      model.state.busyNote = true;
      render_();
      if (busyTimer) clearTimeout(busyTimer);
      busyTimer = setTimeout(() => { model.state.busyNote = false; render_(); }, 3500);
    }
    function attemptClose() {
      const result = model.requestClose();
      // 학생 제외 실패 경고는 '출제 중' 알림이 아니다: 요약 줄 위에 경고만 그리고 패널은 그대로 둔다.
      if (!result.allowed && result.warn) { render_(); return false; }
      if (!result.allowed) { flashBusy(); return false; }
      teardown(true);
      return true;
    }
    function handleBack() {
      if (model.isBusy()) {
        // 뒤로 가기를 막는다: 같은 자리에 항목을 다시 쌓아 패널을 지키고 알린다.
        try { win.history.pushState({ ...(win.history.state || {}), archive2AssignPanel: true }, "", win.location.href); } catch { /* 알림만 한다 */ }
        flashBusy();
        return;
      }
      if (model.hasUnresolvedExclusion() && !model.state.closeWarn) {
        // 고르지 않은 학생을 아직 빼지 못했다: 한 번 알리고, 한 번 더 뒤로 가면 닫는다.
        try { win.history.pushState({ ...(win.history.state || {}), archive2AssignPanel: true }, "", win.location.href); } catch { /* 알림만 한다 */ }
        model.state.closeWarn = true;
        render_();
        return;
      }
      sentinel = false; // 이미 뒤로 갔으므로 되돌릴 항목이 없다
      teardown(false);
    }
    function beforeUnload(event) {
      const excluding = model.hasUnresolvedExclusion();
      if (!model.isBusy() && !excluding) return undefined;
      event.preventDefault();
      event.returnValue = excluding && !model.isBusy()
        ? "고르지 않은 학생을 아직 빼지 못했습니다. 페이지를 떠나면 그 출제는 반 전체에게 보입니다."
        : "출제 중입니다. 페이지를 떠나면 결과를 확인하지 못할 수 있습니다.";
      return event.returnValue;
    }
    function teardown(popSentinel) {
      if (closed) return;
      closed = true;
      closing = true;
      if (busyTimer) clearTimeout(busyTimer);
      win?.removeEventListener?.("beforeunload", beforeUnload);
      try { dialog.close(); } catch { /* 이미 닫힘 */ }
      dialog.remove();
      if (popSentinel && sentinel) {
        sentinel = false;
        ignorePop = true;
        try { win.history.back(); } catch { ignorePop = false; }
      }
      active = null;
      const target = opener && opener.isConnected !== false ? opener : null;
      try { (target || doc.getElementById?.("content"))?.focus?.(); } catch { /* 포커스 복귀 실패는 무시 */ }
      try { options.onClose?.(); } catch { /* 호출자 오류 */ }
    }

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) { attemptClose(); return; }
      const el = event.target?.closest?.("[data-assign-action]");
      if (!el || el.disabled || el.tagName === "INPUT") return;
      const action = el.dataset.assignAction;
      const classId = el.dataset.classId;
      if (action === "close") attemptClose();
      else if (action === "submit") { el.disabled = true; model.start().catch(() => {}); }
      else if (action === "reload") model.load().catch(() => {});
      else if (action === "roster-retry") model.retryRoster(classId);
      else if (action === "students-toggle") model.toggleStudentList(classId);
      else if (action === "students-all") model.selectAllStudents(classId);
      else if (action === "students-unsubmitted") model.selectUnsubmitted(classId);
      else if (action === "reissue") model.reissue(el.dataset.key).catch(() => {});
      else if (action === "retry") { el.disabled = true; model.retryFailed().catch(() => {}); }
      else if (action === "confirm") model.confirmUnknown(el.dataset.key).catch(() => {});
      else if (action === "confirm-all") { el.disabled = true; model.confirmUnknown().catch(() => {}); }
      else if (action === "exclude-retry") model.retryExclusion(el.dataset.key).catch(() => {});
      else if (action === "exclude-retry-all") { el.disabled = true; model.retryExclusion().catch(() => {}); }
      else if (action === "pdf") model.retryPdf(el.dataset.key).catch(() => {});
      else if (action === "qpp-toggle") model.toggleQpp();
      else if (action === "qpp-set") model.setQpp(el.dataset.qpp);
    });
    dialog.addEventListener("change", (event) => {
      const el = event.target;
      const action = el?.dataset?.assignAction;
      if (action === "class") model.toggleClass(el.dataset.classId, el.checked);
      else if (action === "student") model.toggleStudent(el.dataset.classId, el.dataset.studentId, el.checked);
      else if (action === "combo") model.toggleCombo(el.dataset.key, el.checked);
      else if (action === "date") {
        if (!model.setDate(el.value)) render_();
      }
    });
    dialog.addEventListener("toggle", (event) => {
      const grade = event.target?.dataset?.grade;
      if (grade === undefined || !event.target.classList?.contains("is-other")) return;
      if (event.target.open) model.state.openGroups.add(grade); else model.state.openGroups.delete(grade);
    }, true);
    dialog.addEventListener("cancel", (event) => { event.preventDefault(); attemptClose(); });
    dialog.addEventListener("close", () => {
      // 일부 브라우저는 Esc를 두 번 누르면 cancel을 막아도 닫는다. 진행 중이면 다시 연다.
      if (closing || closed) return;
      if (model.isBusy()) { try { dialog.showModal(); } catch { /* 닫힌 채로 둔다 */ } flashBusy(); }
      else teardown(true);
    });

    doc.body.appendChild(dialog);
    try { dialog.showModal(); } catch { dialog.setAttribute("open", ""); }
    try {
      win.history.pushState({ ...(win.history.state || {}), archive2AssignPanel: true }, "", win.location.href);
      sentinel = true;
    } catch { sentinel = false; }
    win?.addEventListener?.("beforeunload", beforeUnload);
    render_();
    region("head").querySelector("#assign-title")?.focus?.();
    model.load();

    const handle = { model, dialog, close: attemptClose, handleBack, isBusy: () => model.isBusy() };
    active = { api: handle, model, handleBack };
    return handle;
  }

  return {
    CONTRACT, STORAGE_KEY, READ_TIMEOUT_MS, WRITE_TIMEOUT_MS, BATCH_TTL_MS,
    createModel, createBatchStore, createDoneStore, classifyError, friendlyMessage, normalizePapers, kstToday, dayLabel,
    groupIssuesByFile, createRecentCache, resetCaches: () => sharedRecent.reset(), HISTORY_LIMIT, HISTORY_TTL_MS,
    render, renderHead, renderBody, renderFoot, open, useLegacy, handlePopState, isOpen, isBusy,
  };
});
