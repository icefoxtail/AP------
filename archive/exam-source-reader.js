(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ExamSourceReader = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  // 원본 시험지 JS에서 "문항 배열"과 "제목"을 찾는 규칙을 한 곳에 둔다.
  // 원본은 대부분 window.questionBank = [...] 이지만, 중등 일부는 window.examData = {title, questions:[...]}
  // 형식이라 별칭 줄이 없다. 브라우저 로더·원본 엔진·node 도구가 모두 이 함수로 같은 규칙을 쓴다.
  // 이 모듈은 문항 배열을 찾고(readQuestionArray), 표시용 발문을 읽는다(readQuestionBody). 지문 계산은 하지 않는다.
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
  // 발문(본문): 중등 일부 원본(examData 형식 등 63개 파일)은 발문을 content가 아니라 question 필드에 둔다.
  // 화면 표시·검색·인쇄·린트는 이 함수로 읽어 어느 형식이든 발문이 보이게 한다. content가 비어 있지 않으면 content,
  // 아니면 question, 둘 다 비면 "". 표시용 읽기이다 — 문항 지문(fingerprint)·UID·등록 파생 데이터 계산은
  // 계속 q.content만 읽는다(바꾸면 저장·배정·등록이 깨진다). 원본 엔진(engine/mixed_engine)은 이미 content||question을 쓴다.
  function readQuestionBody(question) {
    if (!question || typeof question !== "object") return "";
    const content = question.content;
    if (typeof content === "string" && content.trim()) return content;
    const stem = question.question;
    if (typeof stem === "string" && stem.trim()) return stem;
    return typeof content === "string" ? content : "";
  }
  // 메타 결속용 발문: content → question → stem 순으로 "비어 있지 않은 문자열"(공백만이면 비어 있음)을 고른다.
  // 값은 다듬지 않은 원문 그대로 돌려주고, 셋 다 비면 "". 메타 결속 지문(archive/question-binding.js)이 발문을 읽는
  // 정의가 이 한 곳이 되게 한다(복사본은 content만 읽어 question에만 발문이 있는 시험지에서 발문 수정을 놓친다).
  // readQuestionBody(표시용)와 달리 stem까지 본다. 기존 지문 함수들은 이 함수를 아직 쓰지 않는다.
  function readStemForBinding(question) {
    if (!question || typeof question !== "object") return "";
    for (const key of ["content", "question", "stem"]) {
      const value = question[key];
      if (typeof value === "string" && value.trim()) return value;
    }
    return "";
  }
  return { readQuestionArray, readExamTitle, readQuestionBody, readStemForBinding, SOURCE_GLOBALS };
});
