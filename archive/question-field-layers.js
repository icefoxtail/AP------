(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.QuestionFieldLayers = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  // 문항 필드의 "층" 정본 목록. 의존성 없음. 어떤 HTML·소비자 코드도 아직 이 파일을 읽지 않는다(판본 장부 토대).
  //
  // 이유: 저장소에는 "지문에서 빼는 렌더러 전용 필드" 하드코딩 목록이 모듈마다 따로 있어 서로 다르다.
  // 배치 필드 하나만 고쳐도 관계없는 문항의 승인이 낡는 일이 반복됐다. 두 층을 한 곳에 정해 둔다.
  //
  //  1) 결속 필드(BINDING_FIELDS): 메타 결속이 보는 것은 발문과 보기뿐이다. 이 둘이 실제로 바뀌면 사람 재판정이 필요하다.
  //     (그림이 곧 문제·보기인 예외는 archive/question-binding.js 가 따로 다룬다. 여기서는 다루지 않는다.)
  //  2) 렌더 전용 필드(RENDER_ONLY_FIELDS): 문항 내용은 그대로 두고 놓이는 자리·크기만 바꾸는 필드.
  //     렌더러 판본 장부(재촬영 결속)가 쓴다.
  //  결속 밖(isOutsideBindingField) = BINDING_FIELDS의 여집합. 해설·정답·그림·배치·그 밖의 메타를 모두 포함한다.
  //  따라서 RENDER_ONLY_FIELDS 는 결속 밖의 부분집합이어야 하고 BINDING_FIELDS 와 겹치면 안 된다(테스트로 고정).
  //
  // 발문 필드: 중등 일부 원본은 발문을 content 가 아니라 question 에, 일부는 stem 에 둔다(archive/exam-source-reader.js 참고).
  const STEM_FIELDS = Object.freeze(["content", "question", "stem"]);
  const CHOICE_FIELDS = Object.freeze(["choices"]);
  const BINDING_FIELDS = Object.freeze([...STEM_FIELDS, ...CHOICE_FIELDS]);

  // 배치·크기 전용 필드만 넣는다. 근거(읽은 곳):
  //  layoutTag                 engine.html:2640-2670,2777 슬롯·전폭 배치 / layout-authority.js:29-58 placementKind
  //  layoutForce               render-state-normalizer.js renderQuestionLayout — 작성자가 한 단 전체(subjective-2up)를 고정할 때만 읽음. 자동 승격은 이 필드와 무관
  //  wide                      engine.html:2634 / layout-authority.js:800 impliedFullWidth / exam-render-executor.js:65
  //  imageSize                 engine.html:2462 크기 클래스만 정함(small|half|medium|large|full|tall)
  //  imageSizeOverride         engine.html:2463 full|tall 크기 상한만 키움
  //  solutionImageSize         engine.html:2499 해설 그림 크기 클래스
  //  solutionImageSizeOverride engine.html:2500 해설 그림 상한 클래스
  //  solutionImageLayout       solution-render-executor.js:388 fullwidth 여부(data-solution-full-width)만 정함
  //  choiceColumns             engine.html:2071-2078 보기 격자 열 수만 정함(보기 글자는 그대로)
  //  choicesLayout             equal-slot-engine.js:215 보기 배치 잠금 표시만 읽음(원본 데이터에는 쓰인 곳이 없음)
  //  imageScale, solutionImageScale  그림 하나 단위 크기 비율 덮어쓰기(단 폭 대비 %, 숫자 30~100). 묶음 1에서 엔진이 읽기 시작, 결속·판본에 영향 없음. 지금은 읽는 코드가 없다.
  // 넣지 않은 것(내용이 바뀌거나 애매함): image, imageAlt, solutionImage*, answer, solution, choicesEmbeddedInImage,
  //  preserveChoicePrefixes, solutionReminderImagePolicy 등. 보류 사유는 PR 설명 참고.
  const RENDER_ONLY_FIELDS = Object.freeze([
    "layoutTag",
    "layoutForce",
    "wide",
    "imageSize",
    "imageSizeOverride",
    "solutionImageSize",
    "solutionImageSizeOverride",
    "solutionImageLayout",
    "choiceColumns",
    "choicesLayout",
    "imageScale",
    "solutionImageScale"
  ]);

  const bindingSet = new Set(BINDING_FIELDS);
  const renderOnlySet = new Set(RENDER_ONLY_FIELDS);

  function isBindingField(name) {
    return typeof name === "string" && bindingSet.has(name);
  }
  function isRenderOnlyField(name) {
    return typeof name === "string" && renderOnlySet.has(name);
  }
  // 문자열이 아닌 이름은 "결속 밖"이라고 답하지 않는다(잘못된 입력을 조용히 통과시키지 않기 위해).
  function isOutsideBindingField(name) {
    return typeof name === "string" && name.length > 0 && !bindingSet.has(name);
  }

  return Object.freeze({
    STEM_FIELDS,
    CHOICE_FIELDS,
    BINDING_FIELDS,
    RENDER_ONLY_FIELDS,
    isBindingField,
    isRenderOnlyField,
    isOutsideBindingField
  });
});
