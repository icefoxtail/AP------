export function makeQuestionSkeleton(id, manifest) {
  return {
    id,
    level: "",
    category: "",
    originalCategory: "",
    standardCourse: manifest.course || "",
    standardUnitKey: "",
    standardUnit: "",
    standardUnitOrder: 0,
    questionType: "",
    layoutTag: "grid",
    tags: ["기출"],
    wide: false,
    content: "",
    choices: [],
    answer: "",
    solution: "",
    image: "",
    visualAsset: "",
    hasVisualAsset: false,
    visualAssetType: "none",
    visualAssetBBoxOnPage: null,
    visualAssetStatus: "vision_extract_required",
    examId: manifest.examId,
    sourceFile: manifest.pdfPath,
    sourceQuestionNo: String(id),
    displayNo: String(id),
    pageNo: 0,
    cropPath: "",
    fullPageImagePath: "",
    fullPageImageRelPath: "",
    imageStatus: "no_question_crop",
    contentSource: "vision_required",
    choicesSource: "vision_required",
    answerSource: "not_in_pipeline",
    solutionSource: "not_in_pipeline",
    answerStatus: "external_agent_required",
    solutionStatus: "external_agent_required",
    extractionStatus: "vision_extract_required",
    reviewStatus: "manual_review",
    reviewReason: ["vision_page_extract_required"],
    tagConfidence: "low",
    tagStatus: "manual_review"
  };
}

export function makeCandidateJs(manifest) {
  const count = Number(manifest.expectedQuestionCount || 0);
  const questions = Array.from({ length: count }, (_, index) => makeQuestionSkeleton(index + 1, manifest));
  return `window.examTitle = ${JSON.stringify(manifest.examId)};\nwindow.questionBank = ${JSON.stringify(questions, null, 2)};\n`;
}
