// 단원 힌트(metaHintUnit) 규칙 한 곳: 승인된 유형(PT)의 ACTIVE 연결(curriculum_bindings)이 같은 학년에서 통합 단원 하나만 가리키면 그 단원을,
// 둘 이상으로 갈리거나 하나라도 통합 단원으로 옮기지 못하면 아무것도 싣지 않는다(추정하지 않음). 표시·선택 전용이며 승인·정본 값이 아니다.
// 값의 모양: 중등은 통합 단원 이름(원본 단원 이름과 같은 길로 읽힘), 고등은 통합 단원 키(고등 단원 판정은 키로만 읽는다).
// 소비: archive2-unified-units.js unitFor가 원본의 단원 값으로 단원을 못 정한 문항에만 쓴다.
import unitCore from "../unit-past-exams-core.js";

const MIDDLE_KEYS = (n) => new RegExp(`^M${n}-\\d\\d$`);
const HIGH2_KEYS = /^H(?:15-(?:M1|M2|PS|CALC|GV)|22-(?:A|M1|M2|PS|GE))-\d\d$/;
export const normalizeSubject = (value) => String(value || "").replace(/\s+/g, "").replace(/c$/, "");
// 고3은 켜지 않는다(힌트가 붙는 문항 22건이 전부 미적분이고 일치 0건).
// offSubjects: 이미 단원이 정해진 문항에 같은 규칙을 적용해 기존 단원과 비교한 일치율이 90% 미만이었던 과목(2026-11-22 측정)은 켜지 않는다.
const off = (...subjects) => new Set(subjects.map(normalizeSubject));
export const UNIT_HINT_GRADE_RULES = Object.freeze({
  "중1": { profile: "m1", keys: MIDDLE_KEYS(1), asKey: false, offSubjects: off() },
  "중2": { profile: "m2", keys: MIDDLE_KEYS(2), asKey: false, offSubjects: off() },
  "중3": { profile: "m3", keys: MIDDLE_KEYS(3), asKey: false, offSubjects: off() },
  "고1": { profile: "h1", keys: /^H(?:15-S[AB]|22-C2?)-\d\d$/, asKey: true, offSubjects: off("", "수학(하)") },
  "고2": { profile: "h2", keys: HIGH2_KEYS, asKey: true, offSubjects: off("기하와벡터", "미적분", "공통수학1") },
});
const PROBE_FILE = "original/unit-hint-probe.js";

// bindings: curriculum_bindings.json의 bindings. unitLabelByKey/subUnitLabelByKey: 대단원·소단원 키 → 이름(태그 마스터).
export function createUnitHinter({ bindings, unitLabelByKey, subUnitLabelByKey }) {
  const stats = { hinted: 0, ambiguous: 0, unresolved: 0, noBinding: 0 };
  const byPt = new Map();
  for (const row of bindings) {
    if (row.status !== "ACTIVE") continue;
    if (!byPt.has(row.problemTypeKey)) byPt.set(row.problemTypeKey, []);
    byPt.get(row.problemTypeKey).push(row);
  }
  const classify = (profile, standardUnitKey, standardUnit) => {
    const result = unitCore.classifyRecord({ sourceFile: PROBE_FILE, id: 1, standardUnitKey, standardUnit }, profile);
    return result.status === "classified" ? result.unitKey : "";
  };
  // 연결 하나를 통합 단원 키로 옮긴다. 중등은 대단원 이름 → 안 되면 소단원 이름 순서(2015 옛 대단원 "도형의 성질"·"수와 식"은 소단원으로 갈린다).
  function resolveBinding(row, rule) {
    const unitLabel = unitLabelByKey.get(row.standardUnitKey) || "";
    if (rule.asKey) return classify(rule.profile, row.standardUnitKey, unitLabel);
    const subLabel = subUnitLabelByKey.get(row.subUnitKey) || "";
    return (unitLabel && classify(rule.profile, "", unitLabel)) || (subLabel && classify(rule.profile, "", subLabel)) || "";
  }
  const cache = new Map();
  // reason: "hinted" | "ambiguous"(둘 이상의 통합 단원) | "unresolved"(연결 하나라도 통합 단원으로 못 옮김) | "noBinding"(그 학년 연결 없음)
  function decide(pt, grade) {
    const rule = UNIT_HINT_GRADE_RULES[grade];
    if (!rule || !pt) return { value: "", reason: "off" };
    const cacheKey = `${grade}\u0000${pt}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    let value = "", reason = "";
    const rows = (byPt.get(pt) || []).filter((row) => rule.keys.test(row.standardUnitKey || ""));
    if (!rows.length) reason = "noBinding";
    else {
      const units = rows.map((row) => resolveBinding(row, rule));
      if (units.some((unitKey) => !unitKey)) reason = "unresolved";
      else if (new Set(units).size !== 1) reason = "ambiguous";
      else {
        const unit = unitCore.PROFILES[rule.profile].units.find((row) => row.key === units[0]);
        value = unit ? (rule.asKey ? unit.key : unit.name) : "";
        reason = value ? "hinted" : "unresolved";
      }
    }
    stats[reason]++;
    const result = { value, reason };
    cache.set(cacheKey, result);
    return result;
  }
  // subject: 시험지 과목명(꺼 둔 과목이면 싣지 않는다).
  function hint(pt, grade, subject = "") {
    const rule = UNIT_HINT_GRADE_RULES[grade];
    if (!rule || !pt || rule.offSubjects.has(normalizeSubject(subject))) return "";
    return decide(pt, grade).value;
  }
  return { hint, decide, stats };
}
