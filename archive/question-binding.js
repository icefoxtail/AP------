(function (root, factory) {
  const api = factory(typeof module === "object" && module.exports
    ? require("./exam-source-reader.js") : root.ExamSourceReader);
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.QuestionBinding = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (examSourceReader) {
  "use strict";
  // 메타 결속 지문(텍스트 판): 검수된 메타를 문항에 묶는 지문은 발문과 보기(선택지)만 본다.
  // 해설·정답·그림·다른 메타가 바뀌어도 값이 같고, 발문·보기가 바뀔 때만 달라진다(결정: docs/agents/metadata.md
  // "메타 결속 지문 범위"). 이유: 해설을 다듬거나 그림을 SVG로 바꿀 때마다 검수된 메타가 무효가 되어 등록 대기가 쌓였다.
  // 적용 범위는 메타 결속뿐이다. 저장한 문제지·출제본의 무결성 지문(archive2-source.js 등)과 4칸은 이 모듈과 별개다.
  // 이 모듈은 아직 아무도 부르지 않는다(소비자 없음). 발문의 정의는 exam-source-reader.js의 readStemForBinding 한 곳이다.
  const VERSION = "text-v1";
  if (!examSourceReader || typeof examSourceReader.readStemForBinding !== "function")
    throw new Error("exam-source-reader.js(readStemForBinding)가 먼저 로드되어야 합니다.");

  // 발문 안의 그림 태그는 통째로 가린다: 중등 시험지는 그림이 발문 문자열 안에 있어 그림 교체가 곧 발문 변경으로 보인다.
  // 모든 <...>를 지우지 않는다(수식의 a<b, x<3이 사라져 발문 수정이 가려진다). 아래 네 가지 태그만 지운다.
  const ATTRS = "(?:[^>\"']|\"[^\"]*\"|'[^']*')*"; // 따옴표 안의 > 는 태그 끝으로 보지 않는다
  const IMG_TAG = new RegExp("<img(?=[\\s/>])" + ATTRS + ">", "gi");
  // 여는 태그가 /> 로 닫히는 것을 먼저 지우고, 그다음 짝이 있는 것을 닫는 태그까지 지운다(안쪽 <path/>에서 멈추지 않는다).
  const SELF_CLOSED_TAGS = ["svg", "figure", "picture"].map(
    (name) => new RegExp("<" + name + "(?=[\\s/>])" + ATTRS + "/>", "gi"));
  const PAIRED_TAGS = ["svg", "figure", "picture"].map(
    (name) => new RegExp("<" + name + "(?=[\\s/>])[\\s\\S]*?</" + name + "\\s*>", "gi"));
  const BR_TAG = /<br\s*\/?>/gi;
  const EMPTY_P = new RegExp("<p(?=[\\s>])" + ATTRS + ">\\s*</p\\s*>", "gi");
  // <p> 태그 바로 안팎의 공백은 그림을 지운 자리의 공백이므로 같게 본다("<p>식 <img></p>" = "<p>식</p>").
  const P_EDGE_SPACE = new RegExp("\\s*(</?p(?=[\\s>])" + ATTRS + ">)\\s*", "gi");
  // 보기 앞의 ①~⑩ 기호 한 개(와 뒤따르는 공백). 1) (1) 1. 같은 번호는 지우지 않는다(1.5가 깨진다).
  const CHOICE_MARK = /^[\u2460-\u2469]\s*/;

  function replaceUntilStable(text, pattern, replacement) {
    let current = text;
    for (let i = 0; i < 20; i += 1) {
      const next = current.replace(pattern, replacement);
      if (next === current) return next;
      current = next;
    }
    return current;
  }

  // 정규화: NFC, 줄바꿈 통일, 그림 태그 제거, <br>→줄바꿈, 빈 <p></p> 제거, 연속 공백·줄바꿈을 한 칸으로, 앞뒤 공백 제거.
  function normalizeBindingText(value) {
    let text = typeof value === "string" ? value : value == null ? "" : String(value);
    text = text.normalize("NFC").replace(/\r\n?/g, "\n");
    text = text.replace(IMG_TAG, "");
    for (const pattern of SELF_CLOSED_TAGS) text = text.replace(pattern, "");
    for (const pattern of PAIRED_TAGS) text = replaceUntilStable(text, pattern, "");
    text = text.replace(BR_TAG, "\n");
    text = replaceUntilStable(text, EMPTY_P, "");
    text = text.replace(P_EDGE_SPACE, "$1");
    return text.replace(/\s+/g, " ").trim();
  }

  // 키 순서가 고정된 직렬화를 위해 그림 값(image/images)의 객체 키는 정렬해서 쓴다.
  function stable(value) {
    if (Array.isArray(value)) return value.map(stable);
    if (value && typeof value === "object") {
      const out = {};
      for (const key of Object.keys(value).sort()) out[key] = stable(value[key]);
      return out;
    }
    return value === undefined ? null : value;
  }

  // 그림 태그를 가리지 않고 공백·줄바꿈만 정규화한 문자열(NFC, CRLF→LF, 연속 공백 한 칸, 앞뒤 공백 제거).
  function collapseSpace(value) {
    return value.normalize("NFC").replace(/\r\n?/g, "\n").replace(/\s+/g, " ").trim();
  }
  const MEDIA_TAG = /<(?:img|svg|figure|picture)(?=[\s/>])/i;
  function hasMediaTag(text) {
    return typeof text === "string" && MEDIA_TAG.test(text);
  }
  function hasValue(value) {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== "";
  }

  // 보기 한 칸의 문자열: 문자열은 그대로, 숫자·불리언은 String, 객체·배열은 키 정렬 직렬화(서로 다른 객체가 같아지지 않게),
  // null·undefined는 "".
  function choiceText(choice) {
    if (typeof choice === "string") return choice;
    if (choice === undefined || choice === null) return "";
    if (typeof choice === "object") return JSON.stringify(stable(choice));
    return String(choice);
  }

  // 보기 한 칸: 그림 태그를 가리고 맨 앞 ①~⑩ 기호를 지운 값. 그것이 비었는데 원문에 그림 태그가 있었다면
  // 그림이 곧 보기이므로 그림 태그를 가리지 않은(공백·줄바꿈만 정규화하고 맨 앞 기호만 지운) 원문을 쓴다.
  function normalizeChoice(choice) {
    const text = choiceText(choice);
    const normalized = normalizeBindingText(text).replace(CHOICE_MARK, "");
    if (normalized !== "" || !hasMediaTag(text)) return normalized;
    return collapseSpace(text).replace(CHOICE_MARK, "");
  }

  function choicesAreImages(question) {
    return question.choicesEmbeddedInImage === true
      || question.sourcePayload?.choicesEmbeddedInImage === true;
  }

  // 결속 대상 값. 발문 필드(content·question·stem)가 전부 비면 오류를 낸다(조용히 빈 지문을 만들지 않는다).
  function bindingPayload(question) {
    if (!question || typeof question !== "object")
      throw new Error("bindingPayload: 문항 객체가 아닙니다.");
    const rawStem = examSourceReader.readStemForBinding(question);
    if (!rawStem) throw new Error("bindingPayload: 발문(content·question·stem)이 모두 비어 있습니다.");
    const stem = normalizeBindingText(rawStem);
    const rawChoices = question.choices;
    if (rawChoices !== undefined && rawChoices !== null && !Array.isArray(rawChoices))
      throw new Error("bindingPayload: choices가 배열이 아닙니다(" + typeof rawChoices + ").");
    const choices = Array.isArray(rawChoices) ? rawChoices.map(normalizeChoice) : null;
    const payload = { v: VERSION, stem, choices };
    // 발문이 그림뿐이라 정규화한 발문이 빈 문자열이면 그림이 곧 문제이므로 인라인 그림 태그가 든 발문(공백·줄바꿈만
    // 정규화)과 image·images를 포함한다. 안 그러면 지문이 상수가 되어 문제가 통째로 바뀌어도 결속이 유지된다.
    const stemIsMedia = stem === "";
    // 보기 칸이 전부 비었는데(기호뿐 포함) 문항에 그림이 있으면 보기 내용이 그림 안에 있다. choicesEmbeddedInImage와 같게 본다.
    const hasFigure = hasMediaTag(rawStem) || hasValue(question.image) || hasValue(question.images);
    const choicesInFigure = Array.isArray(choices) && choices.length > 0
      && choices.every((choice) => choice === "") && hasFigure;
    if (stemIsMedia || (choicesInFigure && hasMediaTag(rawStem))) payload.stemMedia = collapseSpace(rawStem);
    // 보기가 그림 안에 든 문항은 그림이 곧 보기이므로 그림을 포함한다.
    if (stemIsMedia || choicesAreImages(question) || choicesInFigure) {
      payload.image = stable(question.image ?? null);
      payload.images = stable(question.images ?? null);
    }
    return payload;
  }

  // 키 순서가 고정된 JSON 문자열(v, stem, [stemMedia], choices, [image, images]).
  function bindingSerialize(question) {
    const payload = bindingPayload(question);
    const ordered = { v: payload.v, stem: payload.stem };
    if ("stemMedia" in payload) ordered.stemMedia = payload.stemMedia;
    ordered.choices = payload.choices;
    if ("image" in payload) {
      ordered.image = payload.image;
      ordered.images = payload.images;
    }
    return JSON.stringify(ordered);
  }

  // SHA-256(hex). 브라우저와 node(19+) 모두 전역 Web Crypto를 쓰므로 같은 비동기 API 하나로 같은 결과가 나온다.
  async function bindingFingerprint(question) {
    const subtle = typeof globalThis !== "undefined" ? globalThis.crypto?.subtle : undefined;
    if (!subtle) throw new Error("bindingFingerprint: Web Crypto(crypto.subtle)를 쓸 수 없습니다.");
    const bytes = await subtle.digest("SHA-256", new TextEncoder().encode(bindingSerialize(question)));
    return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  return { VERSION, normalizeBindingText, bindingPayload, bindingSerialize, bindingFingerprint };
});
