export function makeQuestionSkeleton(id, manifest) {
  return {
    id,
    level: "",
    category: "",
    originalCategory: "",
    standardCourse: "",
    standardUnitKey: "",
    standardUnit: "",
    standardUnitOrder: 0,
    questionType: "",
    layoutTag: "grid",
    tags: [],
    wide: false,
    content: "",
    choices: [],
    answer: "",
    solution: "",
    examId: manifest.examId,
    sourceFile: manifest.pdfPath,
    sourceQuestionNo: String(id),
    displayNo: String(id),
    pageNo: 0,
    imageStatus: "none",
    answerStatus: "missing_answer",
    solutionStatus: "missing_solution",
    reviewStatus: "generated_pending",
    tagConfidence: "low",
    tagStatus: "manual_review"
  };
}

export function makeCandidateJs(manifest) {
  const count = Number(manifest.expectedQuestionCount || 0);
  const questions = Array.from({ length: count }, (_, index) => makeQuestionSkeleton(index + 1, manifest));
  return `window.examTitle = ${JSON.stringify(manifest.examId)};\nwindow.questionBank = ${JSON.stringify(questions, null, 2)};\n`;
}
