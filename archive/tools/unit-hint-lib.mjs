// 단원 힌트(metaHintUnit) 규칙 한 곳: 승인된 유형(PT)의 ACTIVE 연결(curriculum_bindings)이 같은 학년에서 통합 단원 하나만 가리키면 그 단원을,
// 여러 통합 단원에 걸치면 통합 단원 프로필(UnitCore.PROFILES[...].units)의 순서상 가장 뒤 단원을 싣는다(사용자 결정 2026-11-22: 두 단원 내용을 함께 쓰는
// 문항은 뒤 단원까지 배워야 풀 수 있다). 과목이 여럿인 학년(고등)은 문항의 과목 안에 있는 단원들 중에서만 고르고, 과목을 못 정했거나 그 과목 안에
// 연결 단원이 없으면 싣지 않는다(다른 과목 단원으로 보내지 않음). 통합 단원으로 옮기지 못하는 연결은 빼고 옮겨지는 연결만으로 정한다.
// 표시·선택 전용이며 승인·정본 값이 아니다. 값의 모양: 중등은 통합 단원 이름(원본 단원 이름과 같은 길로 읽힘), 고등은 통합 단원 키(고등 단원 판정은 키로만 읽는다).
// 소비: archive2-unified-units.js unitFor가 원본의 단원 값으로 단원을 못 정한 문항에만 쓴다.
import unitCore from "../unit-past-exams-core.js";
import core from "../archive2-core.js";

const MIDDLE_KEYS = (n) => new RegExp(`^M${n}-\\d\\d$`);
const HIGH2_KEYS = /^H(?:15-(?:M1|M2|PS|CALC|GV)|22-(?:A|M1|M2|PS|GE))-\d\d$/;
export const normalizeSubject = (value) => String(value || "").replace(/\s+/g, "").replace(/c$/, "");
// 고3은 켜지 않는다(미적분 5/28 = 17.9%, 측정은 docs/agents/metadata.md).
// offSubjects: 이미 단원이 정해진 문항에 같은 규칙(하나로 정해지면 그 단원, 여럿이면 마지막 단원)을 적용해 기존 단원과 비교한 일치율이 70% 미만인 과목(2026-11-22 측정)은 켜지 않는다.
const off = (...subjects) => new Set(subjects.map(normalizeSubject));
export const UNIT_HINT_GRADE_RULES = Object.freeze({
  "중1": { profile: "m1", keys: MIDDLE_KEYS(1), asKey: false, offSubjects: off() },
  "중2": { profile: "m2", keys: MIDDLE_KEYS(2), asKey: false, offSubjects: off() },
  "중3": { profile: "m3", keys: MIDDLE_KEYS(3), asKey: false, offSubjects: off() },
  "고1": { profile: "h1", keys: /^H(?:15-S[AB]|22-C2?)-\d\d$/, asKey: true, offSubjects: off() },
  "고2": { profile: "h2", keys: HIGH2_KEYS, asKey: true, offSubjects: off("기하와벡터", "미적분") },
});
const PROBE_FILE = "original/unit-hint-probe.js";

// 시험지 과목명 → 통합 단원 프로필의 과목(unit.course). 통합 단원 층(archive2-unified-units.js subjectFromName)과 같은 판정이다.
// 과목이 하나뿐인 학년(중등)은 ""(과목 제한 없음), 고등에서 과목명으로 못 정하면 null.
export function courseOf(grade, subject) {
  if (/^중/.test(grade)) return "";
  const identity = core.normalizeCourseIdentity(subject).replace(/c$/, "");
  if (!identity) return null;
  if (grade === "고1") {
    return ["공통수학1", "공통수학2"].find((course) => core.normalizeCourseIdentity(course) === identity) || null;
  }
  const value = core.highSemanticSubjectForCourseKey(identity);
  const option = value && core.highSemanticSubjectOptions().find((row) => row.value === value);
  return option ? option.label : null;
}

// bindings: curriculum_bindings.json의 bindings. unitLabelByKey/subUnitLabelByKey: 대단원·소단원 키 → 이름(태그 마스터).
// rules: 학년별 규칙(기본은 UNIT_HINT_GRADE_RULES, 측정·테스트에서 바꿔 쓴다).
export function createUnitHinter({ bindings, unitLabelByKey, subUnitLabelByKey, rules = UNIT_HINT_GRADE_RULES }) {
  const stats = { single: 0, last: 0, noBinding: 0, unresolved: 0, subjectUnknown: 0, noUnitInSubject: 0 };
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
  // PT와 학년 단위: 연결이 가리키는 통합 단원들(프로필 순서, 중복 없음). 옮기지 못한 연결은 빼고 센다.
  const unitCache = new Map();
  function boundUnits(pt, grade) {
    const cacheKey = `${grade}\u0000${pt}`;
    if (unitCache.has(cacheKey)) return unitCache.get(cacheKey);
    const rule = rules[grade];
    const profileUnits = unitCore.PROFILES[rule.profile].units;
    const rows = (byPt.get(pt) || []).filter((row) => rule.keys.test(row.standardUnitKey || ""));
    const keys = new Set(rows.map((row) => resolveBinding(row, rule)).filter(Boolean));
    const result = { bindingCount: rows.length, units: profileUnits.filter((unit) => keys.has(unit.key)) };
    unitCache.set(cacheKey, result);
    return result;
  }
  const cache = new Map();
  // reason: "single"(통합 단원 하나) | "last"(여럿 중 프로필 순서상 마지막) | "noBinding"(그 학년 연결 없음) | "unresolved"(연결은 있으나 하나도 통합 단원으로 못 옮김)
  //   | "subjectUnknown"(여러 단원인데 문항 과목을 못 정함) | "noUnitInSubject"(여러 단원인데 문항 과목 안에 연결 단원이 없음) | "off"(규칙 없는 학년·PT 없음)
  function decide(pt, grade, subject = "") {
    const rule = rules[grade];
    if (!rule || !pt) return { value: "", reason: "off" };
    const { bindingCount, units } = boundUnits(pt, grade);
    let candidates = units, reason = "";
    if (!bindingCount) reason = "noBinding";
    else if (!units.length) reason = "unresolved";
    else if (units.length === 1) reason = "single";
    else if (/^중/.test(grade)) reason = "last";
    else {
      const course = courseOf(grade, subject);
      if (course === null) reason = "subjectUnknown";
      else {
        candidates = units.filter((unit) => unit.course === course);
        reason = candidates.length ? "last" : "noUnitInSubject";
      }
    }
    const pick = reason === "single" || reason === "last" ? candidates[candidates.length - 1] : null;
    const value = pick ? (rule.asKey ? pick.key : pick.name) : "";
    return { value, reason, unitKey: pick ? pick.key : "", unitKeys: units.map((unit) => unit.key) };
  }
  // subject: 시험지 과목명(꺼 둔 과목이면 싣지 않는다).
  function hint(pt, grade, subject = "") {
    const rule = rules[grade];
    if (!rule || !pt || rule.offSubjects.has(normalizeSubject(subject))) return "";
    const key = `${grade}\u0000${pt}\u0000${subject}`;
    if (!cache.has(key)) {
      const result = decide(pt, grade, subject);
      stats[result.reason]++;
      cache.set(key, result);
    }
    return cache.get(key).value;
  }
  return { hint, decide, stats };
}
