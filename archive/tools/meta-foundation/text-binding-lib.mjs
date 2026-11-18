// 메타 결속 지문(텍스트 판 text-v1)의 node 쪽 공용 도구: 지문 계산과 "재결속 기록" 읽기·대조.
// 결정: docs/agents/metadata.md "메타 결속 지문 범위: 발문과 보기만 본다". 지문 계산 규칙은 archive/question-binding.js 한 곳이다.
// 여기서는 그 모듈이 만든 직렬화를 node crypto로 해시할 뿐이다(bindingFingerprint와 같은 값이어야 하며 테스트가 대조한다).
// 재결속 기록(archive/data/meta-foundation/text-binding-rebinds.v1.json)은 "등록 당시의 5필드/내용 지문 X가 가리키던 문항의
// 발문·보기가 지금과 같다"는 사실을 추가 전용으로 남긴 것이다. 소비자(카탈로그 빌더·등록기)는 기존 지문이 일치하면 이전과 똑같이
// 동작하고, 일치하지 않을 때만 이 기록을 본다. 기록은 발문·보기가 지금과 같을 때만 효력이 있다(현재 text-v1과 대조).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const QuestionBinding = require("../../question-binding.js");

export const TEXT_BINDING_VERSION = QuestionBinding.VERSION; // "text-v1"
export const REBINDS_SCHEMA = "meta-text-binding-rebinds-v1";
export const REBINDS_PATH = "archive/data/meta-foundation/text-binding-rebinds.v1.json";

const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

// 기존 지문 두 가지(등록기·카탈로그의 sourceFingerprint/contentFingerprint와 같은 식. 테스트가 등록기 수출과 대조한다).
export const sourceFingerprint = (q) => sha256(JSON.stringify({
  content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
  answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null }));
export const contentFingerprint = (q) => sha256(JSON.stringify({
  content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null, image: q.image ?? null }));

// text-v1 지문(hex). 발문이 비었거나 choices 형식이 잘못된 문항은 지문을 만들 수 없으므로 null(결속 불가)을 돌려준다.
export function textFingerprint(question) {
  try { return sha256(QuestionBinding.bindingSerialize(question)); } catch { return null; }
}

const HEX64 = /^[a-f0-9]{64}$/;

// 기록 파일을 읽어 uid → [{fp, text}] 색인으로 만든다. 파일이 없으면 빈 색인(소비자는 기존 동작 그대로).
// 형식이 틀린 기록은 조용히 쓰지 않고 오류를 낸다(잘못된 기록으로 결속을 풀면 안 된다).
export function loadRebinds(root, rel = REBINDS_PATH) {
  const file = path.join(root, rel);
  const byUid = new Map();
  if (!fs.existsSync(file)) return { present: false, entries: 0, byUid };
  const doc = JSON.parse(fs.readFileSync(file, "utf8"));
  if (doc.schemaVersion !== REBINDS_SCHEMA || doc.textFingerprintVersion !== TEXT_BINDING_VERSION || !Array.isArray(doc.entries))
    throw new Error("text-binding-rebinds: unsupported schema or text fingerprint version");
  for (const entry of doc.entries) {
    if (!entry || typeof entry.uid !== "string" || !HEX64.test(entry.fp) || !HEX64.test(entry.text))
      throw new Error("text-binding-rebinds: malformed entry " + JSON.stringify(entry));
    if (!byUid.has(entry.uid)) byUid.set(entry.uid, []);
    byUid.get(entry.uid).push(entry);
  }
  return { present: true, entries: doc.entries.length, byUid };
}

// 지문 anchorFp(등록 당시 값)가 가리키던 문항의 발문·보기가 지금 문항과 같다고 기록돼 있는가.
// currentTextFp: textFingerprint(현재 문항). 같은 문항 번호의 발문·보기가 이후 바뀌었다면 기록의 text가 달라져 거짓이 된다.
export function rebindHolds(rebinds, uid, anchorFp, currentTextFp) {
  if (!rebinds?.byUid || !uid || !anchorFp || !currentTextFp) return false;
  return (rebinds.byUid.get(uid) || []).some((entry) => entry.fp === anchorFp && entry.text === currentTextFp);
}

// 유형 판정(DIRECT_JUDGMENT)이 현재 발문·보기에 대한 것인가. 판정이 text-v1 지문을 저장했으면 그것이 현재와 같아야 하고,
// 저장하지 않은 옛 판정은 판정 당시의 내용 지문(발문+보기+그림)이 현재와 같거나 재결속 기록이 그 판정 지문이 가리키던 발문·보기가
// 지금과 같다고 말해야 한다. 값이 그 판정의 결과인지(fieldStatus)도 확인한다 — 다른 길로 유형이 바뀐 행에 옛 판정을 씌우지 않는다.
export function typeJudgmentBoundToText(meta, textFp, currentContentFp, rebinds) {
  const approval = meta?.typeApproval;
  if (!approval || approval.approvalType !== "DIRECT_JUDGMENT" || meta.fieldStatus?.problemType !== "approved_direct_judgment") return false;
  if (approval.judgedTextFingerprint) return approval.judgedTextFingerprint === textFp;
  return approval.judgedContentFingerprint === currentContentFp ||
    rebindHolds(rebinds, meta.questionUid, approval.judgedContentFingerprint, textFp);
}

// 카탈로그의 metaBinding 판정(메타 힌트를 보여 줄 근거). 기존 지문이 일치하는 행은 이전과 똑같다.
//   "exact"  행이 이 문항의 5필드 지문에 묶임      "content" 발문·보기·그림 지문(3필드)에 묶임(해설·정답만 바뀜)
//   "text"   행이 발문·보기(text-v1) 기준으로 묶임(재결속 기록)   "type" 유형 판정만 발문·보기에 묶임(행의 나머지 값은 옛 본문 기준)
//   ""       근거 없음(발문·보기가 바뀌었거나 확인 불가) — 힌트를 내보내지 않는다.
export function classifyMetaBinding({ meta, question, fingerprint, assignmentFingerprint, rebinds }) {
  if (meta.contentFingerprint === assignmentFingerprint) return meta.sourceFingerprint === fingerprint ? "exact" : "content";
  const textFp = textFingerprint(question);
  if (!textFp) return "";
  if (rebindHolds(rebinds, meta.questionUid, meta.contentFingerprint, textFp)) return "text";
  if (typeJudgmentBoundToText(meta, textFp, assignmentFingerprint, rebinds)) return "type";
  return "";
}
