(function () {
  "use strict";

  // 상담지 화면. 주소의 `class`·`assignment`·`student`(모두 내부 id)로 교사 읽기 라우트 `exam-sessions/by-class`를 읽어
  // 한 학생의 기출 시험 결과를 한 장으로 그린다. 계산·문구는 CounselReportData/CounselReportView가 맡고
  // 이 파일은 로그인 확인·읽어 오기·그리기·인쇄만 한다.
  //
  // 저장하지 않는다: 학생 이름·결과는 localStorage·sessionStorage·URL·document.title 어디에도 남기지 않는다.
  // 로그인 확인은 보관함이 공유하는 교사 세션(Bearer 토큰)을 읽기만 한다. 토큰이 없으면 안내만 보이고 아무것도 요청하지 않는다.
  const $ = (id) => document.getElementById(id);
  const Data = window.CounselReportData;
  const View = window.CounselReportView;
  const Diagnostic = window.DiagnosticReportData;

  function setState(text, error) {
    const el = $("state");
    el.hidden = !text;
    el.textContent = text || "";
    el.classList.toggle("err", Boolean(error));
  }

  function parseIds() {
    const params = new URLSearchParams(location.search);
    return {
      classId: (params.get("class") || "").trim(),
      assignmentId: (params.get("assignment") || "").trim(),
      studentId: (params.get("student") || "").trim(),
    };
  }

  function teacherSession() {
    const Session = window.Archive2Session;
    if (!Session) return null;
    const state = Session.state(Session.read());
    const session = Session.read();
    return state.loggedIn && session && session.session_token ? session : null;
  }

  const apiBase = () => (window.APMATH_API_BASE || "https://ap-math-os-v2612.js-pdf.workers.dev/api").replace(/\/+$/, "");

  async function fetchByClass(ids, session) {
    const query = new URLSearchParams({ class: ids.classId, assignment: ids.assignmentId });
    const response = await fetch(`${apiBase()}/exam-sessions/by-class?${query}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${session.session_token}` },
    });
    const body = await response.json().catch(() => ({}));
    if (response.status === 401) throw new Error("로그인이 필요합니다. 로그인이 만료되었을 수 있으니 선생님 계정으로 다시 로그인한 뒤 열어 주세요.");
    if (response.status === 403) throw new Error("이 반의 결과를 볼 권한이 없습니다.");
    if (response.status === 404) throw new Error("이 출제를 찾지 못했습니다. 삭제되었거나 주소가 잘못되었을 수 있습니다.");
    if (!response.ok) throw new Error("결과를 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요.");
    return body;
  }

  // 유형 키 → 이름. 진단평가 결과표와 같은 JSON 4개와 같은 키 해석기를 쓴다. 못 읽으면 이름 없이(모두 "유형 정보 없음") 그린다.
  async function loadLabelOf() {
    const getJson = async (rel) => {
      const response = await fetch(new URL(rel, new URL("../", location.href)), { cache: "no-cache" });
      if (!response.ok) throw new Error(`fetch ${response.status} ${rel}`);
      return response.json();
    };
    try {
      const [taxonomy, concepts, conditions, extensions] = await Promise.all([
        getJson("data/meta-foundation/compiled/taxonomy_registry.json"),
        getJson("data/meta-foundation/compiled/concept_registry.json"),
        getJson("data/meta-foundation/compiled/condition_registry.json"),
        getJson("data/archive2-extension-keys.json"),
      ]);
      return Diagnostic.createLabelOf({ taxonomy, concepts, conditions, extensions }, window.Archive2KeyResolver);
    } catch (error) {
      return null;
    }
  }

  async function main() {
    $("printBtn").addEventListener("click", () => window.print());
    const ids = parseIds();
    if (!ids.classId || !ids.assignmentId || !ids.studentId) {
      setState("열 학생과 시험 정보가 없습니다. 시험 결과 화면의 학생 줄에 있는 ‘상담지’ 링크로 열어 주세요.", true);
      return;
    }
    const session = teacherSession();
    if (!session) {
      setState("로그인이 필요합니다. 선생님 계정으로 로그인한 뒤 이 링크를 다시 열어 주세요.", true);
      return;
    }
    setState("결과를 불러오고 있습니다.");
    let response;
    let labelOf;
    try {
      [response, labelOf] = await Promise.all([fetchByClass(ids, session), loadLabelOf()]);
    } catch (error) {
      setState(error && error.message ? error.message : "결과를 불러오지 못했습니다.", true);
      return;
    }
    const model = Data.buildModel(response, ids, labelOf);
    if (!model.ok) {
      setState(model.message, true);
      return;
    }
    $("sheet").innerHTML = View.render(model).html;
    $("sheetbox").hidden = false;
    $("printBtn").disabled = false;
    setState("");
  }
  main();
})();
