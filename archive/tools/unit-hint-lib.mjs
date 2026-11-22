// 단원 힌트(metaHintUnit) 규칙 한 곳. 승인된 유형(PT)의 ACTIVE 연결(curriculum_bindings)이 같은 학년에서 통합 단원 하나만 가리키면 그 단원을 싣는다.
// 여러 통합 단원에 걸치면(사용자 결정 2026-11-22: 여러 단원에 나오는 유형의 문항은 마지막 단원까지 배워야 풀 수 있으면 뒤 단원) 아래 순서로 하나를 고른다.
//   1) 좁히기: 문항에 원본의 옛 대단원 키(legacyStandardUnitKey, 교재 단원 번호 키는 제외)가 있고 그 대단원에 속하는 통합 단원을 연결표로 알 수 있으면,
//      연결 단원 ∩ 그 대단원의 단원으로 좁힌다(하나만 남으면 그것, 겹침이 없으면 근거가 어긋나므로 싣지 않는다).
//   2) 다수 단원: 남은 후보가 여러 개면, 같은 학년(고등은 같은 과목)에서 같은 PT를 가진 "이미 단원이 정해진 문항"이 가장 많이 속한 후보 단원. 동률이면 마지막 단원.
//      센 값은 빌더가 카탈로그를 만들 때 그 자리에서 세는 것이며(addPlaced), 저장하는 파일·장부는 없다.
//   3) 이미 정해진 문항이 후보 안에 하나도 없으면 프로필 순서상 마지막 단원.
// "마지막"은 통합 단원 프로필(UnitCore.PROFILES[...].units)의 순서이며 새 순서표는 없다. 고등은 문항의 과목 안 단원 중에서만 고르고, 과목을 못 정했거나 그 과목 안에
// 연결 단원이 없으면 싣지 않는다(다른 과목 단원으로 보내지 않음). 통합 단원으로 옮기지 못하는 연결은 빼고 옮겨지는 연결만으로 정한다.
// 같은 입력이면 결과는 같다(후보는 프로필 순서, 동률은 마지막 단원, 센 값은 집계 순서와 무관).
// 표시·선택 전용이며 승인·정본 값이 아니다. 값의 모양: 중등은 통합 단원 이름(원본 단원 이름과 같은 길로 읽힘), 고등은 통합 단원 키(고등 단원 판정은 키로만 읽는다).
// 소비: archive2-unified-units.js unitFor가 원본의 단원 값으로 단원을 못 정한 문항에만 쓴다.
import unitCore from "../unit-past-exams-core.js";
import core from "../archive2-core.js";

const MIDDLE_KEYS = (n) => new RegExp(`^M${n}-\\d\\d$`);
const HIGH2_KEYS = /^H(?:15-(?:M1|M2|PS|CALC|GV)|22-(?:A|M1|M2|PS|GE))-\d\d$/;
export const normalizeSubject = (value) => String(value || "").replace(/\s+/g, "").replace(/c$/, "");
// 고3은 켜지 않는다(미적분 5/28 = 17.9%, 측정은 docs/agents/metadata.md).
// offSubjects: 이미 단원이 정해진 문항에 같은 규칙을 적용해 기존 단원과 비교한 일치율이 70% 미만인 과목(2026-11-22 측정)은 켜지 않는다.
const off = (...subjects) => new Set(subjects.map(normalizeSubject));
export const UNIT_HINT_GRADE_RULES = Object.freeze({
  "중1": { profile: "m1", keys: MIDDLE_KEYS(1), asKey: false, offSubjects: off() },
  "중2": { profile: "m2", keys: MIDDLE_KEYS(2), asKey: false, offSubjects: off() },
  "중3": { profile: "m3", keys: MIDDLE_KEYS(3), asKey: false, offSubjects: off() },
  "고1": { profile: "h1", keys: /^H(?:15-S[AB]|22-C2?)-\d\d$/, asKey: true, offSubjects: off() },
  "고2": { profile: "h2", keys: HIGH2_KEYS, asKey: true, offSubjects: off("미적분") },
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
  const byPt = new Map();
  const allActive = [];
  for (const row of bindings) {
    if (row.status !== "ACTIVE") continue;
    allActive.push(row);
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
  const profileUnitsOf = (grade) => unitCore.PROFILES[rules[grade].profile].units;
  const sortedUnits = (grade, keys) => profileUnitsOf(grade).filter((unit) => keys.has(unit.key));

  // PT와 학년 단위: 연결이 가리키는 통합 단원들(프로필 순서, 중복 없음). 옮기지 못한 연결은 빼고 센다.
  const unitCache = new Map();
  function boundUnits(pt, grade) {
    const cacheKey = `${grade}\u0000${pt}`;
    if (unitCache.has(cacheKey)) return unitCache.get(cacheKey);
    const rule = rules[grade];
    const rows = (byPt.get(pt) || []).filter((row) => rule.keys.test(row.standardUnitKey || ""));
    const keys = new Set(rows.map((row) => resolveBinding(row, rule)).filter(Boolean));
    const result = { bindingCount: rows.length, units: sortedUnits(grade, keys) };
    unitCache.set(cacheKey, result);
    return result;
  }
  // 옛 대단원 키 → 그 대단원에 속하는 통합 단원들(연결표의 모든 ACTIVE 연결에서). 알 수 없으면 빈 배열.
  // 키로만 찾는다(이름으로 찾으면 연결 키 하나가 단원 하나로만 옮겨져, 여러 단원에 걸친 이름이 하나로 줄어든다). 교재 단원(chapter) 번호 키는 호출하는 쪽이 넘기지 않는다.
  const broadCache = new Map();
  function broadUnits(grade, legacyKey) {
    const key = String(legacyKey || "").trim();
    if (!key || !rules[grade].keys.test(key)) return [];
    const cacheKey = `${grade}\u0000${key}`;
    if (broadCache.has(cacheKey)) return broadCache.get(cacheKey);
    const keys = new Set();
    for (const row of allActive) {
      if (row.standardUnitKey !== key) continue;
      const unitKey = resolveBinding(row, rules[grade]);
      if (unitKey) keys.add(unitKey);
    }
    const result = sortedUnits(grade, keys);
    broadCache.set(cacheKey, result);
    return result;
  }

  // 이미 단원이 정해진 문항 수: `${grade}\0${pt}` → Map(통합 단원 키 → 문항 수). 빌더가 문항을 훑으며 채운다(저장 안 함).
  const placed = new Map();
  function addPlaced(pt, grade, unitKey) {
    if (!rules[grade] || !pt || !unitKey) return;
    const key = `${grade}\u0000${pt}`;
    if (!placed.has(key)) placed.set(key, new Map());
    const counts = placed.get(key);
    counts.set(unitKey, (counts.get(unitKey) || 0) + 1);
  }
  const placedCount = (grade, pt, unitKey) => placed.get(`${grade}\u0000${pt}`)?.get(unitKey) || 0;

  // reason: "single"(통합 단원 하나) | "narrowed"(옛 대단원으로 좁혀 하나) | "majority"(후보 중 이미 정해진 문항이 가장 많은 단원) | "tie"(최다가 동률이라 그중 마지막)
  //   | "last"(후보에 이미 정해진 문항이 없어 마지막) | "noBinding"(그 학년 연결 없음) | "unresolved"(연결은 있으나 하나도 통합 단원으로 못 옮김)
  //   | "subjectUnknown"(여러 단원인데 문항 과목을 못 정함) | "noUnitInSubject"(여러 단원인데 문항 과목 안에 연결 단원이 없음)
  //   | "legacyConflict"(옛 대단원의 단원과 연결 단원이 겹치지 않음) | "offSubject"(꺼 둔 과목) | "off"(규칙 없는 학년·PT 없음)
  // opts.leaveOut: 측정용. 이 단원에 정해진 문항 하나를 빼고 센다(자기 자신을 뺀 다수). opts.noLegacy: 측정용. 옛 대단원으로 좁히지 않는다.
  function decide(pt, grade, subject = "", legacy = {}, opts = {}) {
    const rule = rules[grade];
    if (!rule || !pt) return { value: "", reason: "off", unitKey: "", unitKeys: [] };
    if (rule.offSubjects.has(normalizeSubject(subject))) return { value: "", reason: "offSubject", unitKey: "", unitKeys: [] };
    const { bindingCount, units } = boundUnits(pt, grade);
    const unitKeys = units.map((unit) => unit.key);
    const finish = (reason, pick) => ({
      value: pick ? (rule.asKey ? pick.key : pick.name) : "", reason, unitKey: pick ? pick.key : "", unitKeys,
    });
    if (!bindingCount) return finish("noBinding");
    if (!units.length) return finish("unresolved");
    if (units.length === 1) return finish("single", units[0]);
    let candidates = units;
    if (!/^중/.test(grade)) {
      const course = courseOf(grade, subject);
      if (course === null) return finish("subjectUnknown");
      candidates = units.filter((unit) => unit.course === course);
      if (!candidates.length) return finish("noUnitInSubject");
    }
    if (candidates.length === 1) return finish("single", candidates[0]);
    if (!opts.noLegacy) {
      const broad = broadUnits(grade, legacy.key);
      if (broad.length) {
        const broadKeys = new Set(broad.map((unit) => unit.key));
        const narrowed = candidates.filter((unit) => broadKeys.has(unit.key));
        if (!narrowed.length) return finish("legacyConflict");
        if (narrowed.length === 1) return finish("narrowed", narrowed[0]);
        candidates = narrowed;
      }
    }
    const count = (unit) => placedCount(grade, pt, unit.key) - (opts.leaveOut === unit.key ? 1 : 0);
    const max = Math.max(...candidates.map(count));
    if (max <= 0) return finish("last", candidates[candidates.length - 1]);
    const top = candidates.filter((unit) => count(unit) === max);
    return finish(top.length === 1 ? "majority" : "tie", top[top.length - 1]);
  }
  // subject: 시험지 과목명, legacy: { key } 원본의 옛 대단원 키(꺼 둔 과목이면 싣지 않는다).
  function hint(pt, grade, subject = "", legacy = {}) {
    return decide(pt, grade, subject, legacy).value;
  }
  return { hint, decide, addPlaced, hasRule: (grade) => Boolean(rules[grade]), broadUnits, boundUnits };
}
