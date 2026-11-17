(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ExamSourceReader = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  // 원본 시험지 JS에서 "문항 배열"과 "제목"을 찾는 규칙을 한 곳에 둔다.
  // 원본은 대부분 window.questionBank = [...] 이지만, 중등 일부는 window.examData = {title, questions:[...]}
  // 형식이라 별칭 줄이 없다. 브라우저 로더·원본 엔진·node 도구가 모두 이 함수로 같은 규칙을 쓴다.
  // 이 모듈은 문항 배열만 찾는다. 본문 필드(content/question) 처리와 지문 계산은 하지 않는다.
  function pick(scope) {
    if (!scope || typeof scope !== "object") return null;
    if (Array.isArray(scope.questions)) return scope.questions;
    const bank = scope.questionBank;
    if (Array.isArray(bank)) return bank;
    // 묶음 형식: window.questionBank = { batch, questions: [...] }
    if (Array.isArray(bank?.questions)) return bank.questions;
    if (Array.isArray(bank?.problems)) return bank.problems;
    const exam = scope.examData;
    if (Array.isArray(exam)) return exam;
    if (Array.isArray(exam?.questions)) return exam.questions;
    if (Array.isArray(exam?.problems)) return exam.problems;
    return null;
  }
  // scope: 시험지 스크립트를 실행한 window(또는 vm 컨텍스트 객체). 여러 개를 주면 앞에서부터 찾는다
  // (예: node vm에서 window, 그 다음 컨텍스트 전역의 top-level var). 없으면 null.
  function readQuestionArray(...scopes) {
    for (const scope of scopes) {
      const found = pick(scope);
      if (found) return found;
    }
    return null;
  }
  // 제목: examTitle이 있으면 그것. questionBank가 없는 examData 형식일 때만 examData.title/examTitle. 없으면 "".
  function readExamTitle(scope) {
    if (!scope || typeof scope !== "object") return "";
    return scope.examTitle
      || (!scope.questionBank && (scope.examData?.title || scope.examData?.examTitle))
      || "";
  }
  // 시험지 스크립트를 실행하기 전에 앞 파일이 남긴 전역을 지우기 위한 이름 목록.
  const SOURCE_GLOBALS = Object.freeze(["questions", "questionBank", "examData"]);
  return { readQuestionArray, readExamTitle, SOURCE_GLOBALS };
});
