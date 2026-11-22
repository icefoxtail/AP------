// 아카이브 원본 시험지 JS에서 문항 배열을 꺼내는 순수 헬퍼.
// 원본 형식 두 가지: window.questionBank = [...] (대부분) / window.examData = { questions: [...] } (middle 일부).
// 원본 JS를 실행하는 방식은 기존 questionBank 추출과 같다(window/document 가짜 객체만 넘긴 new Function).

const EXAM_DATA_ARRAY_KEYS = ['questions', 'problems', 'questionBank'];

function pickQuestionArray(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') {
    for (const key of EXAM_DATA_ARRAY_KEYS) {
      if (Array.isArray(value[key])) return value[key];
    }
  }
  return null;
}

// 반환: { questions: [], format: 'questionBank' | 'examData' | null }
export function extractArchiveQuestionsFromText(jsText) {
  const sandboxWindow = { questionBank: null, __questionBank: null, examData: null };
  const sandboxDocument = {
    createElement: () => ({ style: {}, setAttribute() {}, appendChild() {}, innerHTML: '' }),
    head: { appendChild() {} },
    body: { appendChild() {} },
    addEventListener() {},
    querySelector: () => null,
    querySelectorAll: () => []
  };
  try {
    const fn = new Function('window', 'document', `${jsText}
;return [
  window.questionBank || window.__questionBank || (typeof questionBank !== 'undefined' ? questionBank : null),
  window.examData || (typeof examData !== 'undefined' ? examData : null)
];`);
    const [bank, examData] = fn(sandboxWindow, sandboxDocument);
    // 기존 형식(questionBank)이 배열이면 결과는 예전과 같다. examData는 그 뒤 순서로만 본다.
    if (Array.isArray(bank)) return { questions: bank, format: 'questionBank' };
    const fromExamData = pickQuestionArray(examData);
    if (fromExamData) return { questions: fromExamData, format: 'examData' };
    return { questions: [], format: null };
  } catch (e) {
    console.warn('[exams] archive question list parse failed:', e);
    return { questions: [], format: null };
  }
}

export function extractQuestionBankFromArchiveText(jsText) {
  return extractArchiveQuestionsFromText(jsText).questions;
}

function digitsToPositiveInt(value) {
  const n = Number(String(value ?? '').match(/\d+/)?.[0] || 0);
  return Number.isSafeInteger(n) && n > 0 ? n : 0;
}

// 문항 번호(exam_blueprints.question_no). 0이면 호출 쪽에서 건너뛴다.
// - questionBank 형식: 예전 그대로 id의 첫 숫자(없으면 0). 이미 동기화된 행의 키를 바꾸지 않기 위해서다
//   (예: id "s01" + number 22 인 기존 파일은 예전처럼 1로 남는다).
// - examData 형식: number → id의 첫 숫자 → 배열 순번+1. ("Q01"+number, "q01", id 없이 number만, 숫자 id 모두 처리)
export function resolveArchiveQuestionNo(question, index, format) {
  if (format === 'examData') {
    return digitsToPositiveInt(question?.number) || digitsToPositiveInt(question?.id) || (Number(index) + 1);
  }
  return Number(String(question?.id ?? '').match(/\d+/)?.[0] || 0);
}
