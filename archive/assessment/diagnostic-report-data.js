(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.DiagnosticReportData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // 진단평가 결과표의 자료 층. 문항 목록(번호·단원·유형·난이도 …)과 응답(O/X)을 받아 집계만 한다.
  //
  //  * 순수 함수다. 화면·저장소·네트워크·전역 상태를 읽지 않는다(이름표 조회만 선택적으로 받는다).
  //  * 표시 문구, 판정("안정"/"보완"), 권장 학습 문장은 만들지 않는다. 숫자와 목록만 낸다.
  //  * 값이 없는 메타는 추정하지 않는다. 단원·유형·난이도가 없으면 그 문항은 "없음" 묶음으로 따로 센다.
  //    옛 하/중/상(`level`)은 1~5로 환산하지 않는다(docs/agents/metadata.md "난이도는 정수 1~5만").
  //  * 모든 묶음의 합계는 총 문항 수와 같아야 한다(`consistency`가 스스로 확인한다).
  //
  // 입력 문항(필드 이름은 아래 별칭 중 하나):
  //   no            번호 (no | order_no | number) — 없으면 목록 순서(1부터)
  //   questionUid   문항 식별자
  //   unit          대단원 (unit | majorUnit | standardUnit | unitLabel)
  //   subUnit       중단원/소단원 (subUnit | midUnit | subUnitLabel)
  //   problemTypeKey, templateKey   유형·풀이 유형 키(PT_…, TPL_…)
  //   difficulty    난이도 정수 1~5 (difficulty | difficultyBucket) — 그 밖의 값은 "단계 정보 없음"
  //   points        배점 (points | score)
  //   essay         서술형 여부 (essay | isEssay | questionType "서술형"/"객관식")
  //   crossConceptKeys, conditionKeys   배열
  //   그 밖의 필드는 `meta`로 그대로 실어 보낸다.
  // 입력 응답: [{ no, result }] 또는 { "1": "O", "2": "X" }.
  //   result: "O"/"correct"/true → 정답, "X"/"wrong"/false → 오답, 그 밖(빈 값 포함) → 미응답.

  const LEVELS = Object.freeze([1, 2, 3, 4, 5]);
  const text = (value) => (value == null ? "" : String(value)).trim();
  const firstText = (obj, names) => {
    for (const name of names) {
      const value = text(obj[name]);
      if (value) return value;
    }
    return "";
  };

  function toStatus(value) {
    if (value === true) return "correct";
    if (value === false) return "wrong";
    const raw = text(value).toLowerCase();
    if (raw === "o" || raw === "correct" || raw === "right" || raw === "정답") return "correct";
    if (raw === "x" || raw === "wrong" || raw === "오답") return "wrong";
    return "unchecked";
  }

  function toLevel(question) {
    for (const name of ["difficulty", "difficultyBucket"]) {
      const value = question[name];
      if (value === undefined || value === null || value === "") continue;
      const n = typeof value === "number" ? value : /^\s*\d+\s*$/.test(String(value)) ? Number(value) : NaN;
      return Number.isInteger(n) && n >= 1 && n <= 5 ? { level: n, invalid: false } : { level: null, invalid: true };
    }
    return { level: null, invalid: false };
  }

  function toEssay(question) {
    for (const name of ["essay", "isEssay"]) if (typeof question[name] === "boolean") return question[name];
    const type = text(question.questionType);
    if (type === "서술형") return true;
    if (type === "객관식") return false;
    return null;
  }

  const keyList = (value) => (Array.isArray(value) ? value : value == null || value === "" ? [] : [value]).map(text).filter(Boolean);
  const NORMALIZED = new Set([
    "no", "order_no", "number", "questionUid", "unit", "majorUnit", "standardUnit", "unitLabel", "subUnit", "midUnit",
    "subUnitLabel", "problemTypeKey", "templateKey", "difficulty", "difficultyBucket", "points", "score", "essay",
    "isEssay", "crossConceptKeys", "conditionKeys",
  ]);

  function normalizeQuestions(list, diagnostics) {
    const seen = new Set();
    const out = [];
    (Array.isArray(list) ? list : []).forEach((raw, index) => {
      const q = raw && typeof raw === "object" ? raw : {};
      let no = Number(q.no ?? q.order_no ?? q.number);
      if (!Number.isInteger(no)) no = index + 1;
      if (seen.has(no)) {
        diagnostics.duplicateQuestionNos.push(no);
        return;
      }
      seen.add(no);
      const { level, invalid } = toLevel(q);
      if (invalid) diagnostics.invalidDifficultyNos.push(no);
      const points = Number(q.points ?? q.score);
      const meta = {};
      for (const [key, value] of Object.entries(q)) if (!NORMALIZED.has(key)) meta[key] = value;
      out.push({
        no,
        questionUid: text(q.questionUid),
        unit: firstText(q, ["unit", "majorUnit", "standardUnit", "unitLabel"]),
        subUnit: firstText(q, ["subUnit", "midUnit", "subUnitLabel"]),
        problemTypeKey: text(q.problemTypeKey),
        templateKey: text(q.templateKey),
        difficulty: level,
        points: Number.isFinite(points) && points > 0 ? points : null,
        essay: toEssay(q),
        crossConceptKeys: keyList(q.crossConceptKeys),
        conditionKeys: keyList(q.conditionKeys),
        meta,
      });
    });
    return out.sort((a, b) => a.no - b.no);
  }

  function normalizeResponses(input, diagnostics) {
    const byNo = new Map();
    const put = (no, value) => {
      const n = Number(no);
      if (!Number.isInteger(n)) return;
      if (byNo.has(n)) diagnostics.duplicateResponseNos.push(n);
      byNo.set(n, toStatus(value));
    };
    if (Array.isArray(input)) {
      for (const item of input) {
        if (!item || typeof item !== "object") continue;
        put(item.no ?? item.order_no ?? item.number, item.result ?? item.result_status ?? item.status ?? item.mark);
      }
    } else if (input && typeof input === "object") {
      for (const [no, value] of Object.entries(input))
        put(no, value && typeof value === "object" ? value.result ?? value.result_status ?? value.status : value);
    }
    return byNo;
  }

  function newGroup(extra) {
    return {
      ...extra,
      total: 0, correct: 0, wrong: 0, unchecked: 0, answered: 0,
      rate: null, rateAll: null,
      pointsTotal: 0, pointsEarned: 0, pointsKnown: 0,
      items: [], questionNos: [], wrongNos: [],
    };
  }
  function addTo(group, question, status) {
    group.total += 1;
    group[status] += 1;
    if (status !== "unchecked") group.answered += 1;
    if (question.points !== null) {
      group.pointsKnown += 1;
      group.pointsTotal += question.points;
      if (status === "correct") group.pointsEarned += question.points;
    }
    group.items.push({ no: question.no, status, difficulty: question.difficulty });
    group.questionNos.push(question.no);
    if (status === "wrong") group.wrongNos.push(question.no);
  }
  function finish(group) {
    group.rate = group.answered ? group.correct / group.answered : null;
    group.rateAll = group.total ? group.correct / group.total : null;
    return group;
  }

  // 한 값 기준 묶음. 값이 없는 문항은 `missing`에 따로 모은다. 순서는 처음 나온 번호 순이다.
  function groupBy(rows, valueOf, makeExtra) {
    const map = new Map();
    const missing = newGroup({ key: null });
    for (const row of rows) {
      const key = valueOf(row.question);
      if (!key) {
        addTo(missing, row.question, row.status);
        continue;
      }
      if (!map.has(key)) map.set(key, newGroup({ key, ...(makeExtra ? makeExtra(row.question) : {}) }));
      addTo(map.get(key), row.question, row.status);
    }
    return { groups: [...map.values()].map(finish), missing: finish(missing) };
  }

  // 키 여러 개가 붙는 메타(CrossConcept·Condition). 한 문항이 여러 묶음에 들어가므로 묶음 합계는 총 문항보다 클 수 있다.
  function groupByMany(rows, keysOf) {
    const map = new Map();
    const missing = newGroup({ key: null });
    for (const row of rows) {
      const keys = keysOf(row.question);
      if (!keys.length) addTo(missing, row.question, row.status);
      for (const key of keys) {
        if (!map.has(key)) map.set(key, newGroup({ key }));
        addTo(map.get(key), row.question, row.status);
      }
    }
    return { groups: [...map.values()].map(finish), missing: finish(missing), multiValued: true };
  }

  // 약한 순서: 틀린 문항이 많은 것 → 정답률이 낮은 것 → 문항이 많은 것 → 처음 나온 번호 순.
  // 표본이 작을 수 있으므로 정답률과 문항 수를 함께 싣는다(순위를 다시 매기는 것은 화면 몫이다).
  function rankWeak(groups) {
    return groups
      .filter((g) => g.wrong > 0)
      .map((g, order) => ({ g, order }))
      .sort((a, b) => b.g.wrong - a.g.wrong || a.g.rate - b.g.rate || b.g.total - a.g.total || a.g.questionNos[0] - b.g.questionNos[0] || a.order - b.order)
      .map(({ g }, rank) => ({ rank: rank + 1, ...g }));
  }

  function applyLabels(section, labelOf, unlabeled) {
    for (const group of section.groups) {
      const label = labelOf ? text(labelOf(group.key)) : "";
      group.label = label && label !== group.key ? label : null;
      if (!group.label) unlabeled.add(group.key);
    }
  }

  function computeDiagnosticReport(input) {
    const options = input && typeof input === "object" ? input : {};
    const labelOf = typeof options.labelOf === "function" ? options.labelOf : null;
    const diagnostics = {
      duplicateQuestionNos: [], duplicateResponseNos: [], orphanResponseNos: [], invalidDifficultyNos: [],
      missing: {}, unlabeledKeys: [],
    };
    const questions = normalizeQuestions(options.questions, diagnostics);
    const responses = normalizeResponses(options.responses, diagnostics);
    const known = new Set(questions.map((q) => q.no));
    for (const no of responses.keys()) if (!known.has(no)) diagnostics.orphanResponseNos.push(no);
    const rows = questions.map((question) => ({ question, status: responses.get(question.no) || "unchecked" }));

    // ---- 총계 ----
    const totals = finish(newGroup({ key: "all" }));
    for (const row of rows) addTo(totals, row.question, row.status);
    finish(totals);
    totals.essayCount = questions.filter((q) => q.essay === true).length;
    totals.objectiveCount = questions.filter((q) => q.essay === false).length;
    totals.formatUnknownCount = questions.filter((q) => q.essay === null).length;

    // ---- 단계(난이도 1~5) ----
    const levelGroup = (level) => {
      const group = newGroup({ key: level });
      for (const row of rows) if (row.question.difficulty === level) addTo(group, row.question, row.status);
      return finish(group);
    };
    const byLevel = LEVELS.map(levelGroup);
    const band45 = newGroup({ key: "4-5" });
    for (const row of rows) if (row.question.difficulty === 4 || row.question.difficulty === 5) addTo(band45, row.question, row.status);
    finish(band45);
    const noLevel = newGroup({ key: null });
    for (const row of rows) if (row.question.difficulty === null) addTo(noLevel, row.question, row.status);
    finish(noLevel);

    // ---- 단원·소단원·유형·템플릿 ----
    const byUnit = groupBy(rows, (q) => q.unit);
    const bySubUnit = groupBy(rows, (q) => q.subUnit ? `${q.unit}\u0000${q.subUnit}` : "", (q) => ({ unit: q.unit || null, subUnit: q.subUnit }));
    for (const group of bySubUnit.groups) group.key = group.subUnit;
    const byProblemType = groupBy(rows, (q) => q.problemTypeKey);
    const byTemplate = groupBy(rows, (q) => q.templateKey);
    const unlabeled = new Set();
    applyLabels(byProblemType, labelOf, unlabeled);
    applyLabels(byTemplate, labelOf, unlabeled);
    diagnostics.unlabeledKeys = [...unlabeled];
    const byCrossConcept = groupByMany(rows, (q) => q.crossConceptKeys);
    const byCondition = groupByMany(rows, (q) => q.conditionKeys);
    applyLabels(byCrossConcept, labelOf, new Set());
    applyLabels(byCondition, labelOf, new Set());
    const byFormat = {
      objective: finish(rows.reduce((g, r) => (r.question.essay === false ? (addTo(g, r.question, r.status), g) : g), newGroup({ key: "objective" }))),
      essay: finish(rows.reduce((g, r) => (r.question.essay === true ? (addTo(g, r.question, r.status), g) : g), newGroup({ key: "essay" }))),
      unknown: finish(rows.reduce((g, r) => (r.question.essay === null ? (addTo(g, r.question, r.status), g) : g), newGroup({ key: null }))),
    };

    // ---- 단계 × 단원 교차표 ----
    const unitKeys = byUnit.groups.map((g) => g.key);
    const levelCell = (unit, pick) => {
      const group = newGroup({ key: unit });
      for (const row of rows) if ((row.question.unit || null) === unit && pick(row.question.difficulty)) addTo(group, row.question, row.status);
      return finish(group);
    };
    const crossRow = (unit) => ({
      unit,
      cells: {
        1: levelCell(unit, (d) => d === 1), 2: levelCell(unit, (d) => d === 2), 3: levelCell(unit, (d) => d === 3),
        4: levelCell(unit, (d) => d === 4), 5: levelCell(unit, (d) => d === 5),
        "4-5": levelCell(unit, (d) => d === 4 || d === 5), none: levelCell(unit, (d) => d === null),
      },
      total: levelCell(unit, () => true),
    });
    const levelByUnit = { rows: [...unitKeys, ...(byUnit.missing.total ? [null] : [])].map(crossRow) };

    // ---- 틀린 문항, 번호순 정오 배열 ----
    const wrongList = rows.filter((r) => r.status === "wrong").map((r) => ({
      no: r.question.no, questionUid: r.question.questionUid, unit: r.question.unit || null, subUnit: r.question.subUnit || null,
      problemTypeKey: r.question.problemTypeKey || null, templateKey: r.question.templateKey || null,
      difficulty: r.question.difficulty, points: r.question.points, essay: r.question.essay,
    }));
    let cumulativeCorrect = 0;
    let cumulativeAnswered = 0;
    const sequence = rows.map((row, index) => {
      if (row.status !== "unchecked") cumulativeAnswered += 1;
      if (row.status === "correct") cumulativeCorrect += 1;
      return { no: row.question.no, status: row.status, difficulty: row.question.difficulty, cumulativeQuestions: index + 1, cumulativeAnswered, cumulativeCorrect };
    });

    // ---- 없는 메타 건수 ----
    diagnostics.missing = {
      unit: byUnit.missing.total, subUnit: bySubUnit.missing.total, problemTypeKey: byProblemType.missing.total,
      templateKey: byTemplate.missing.total, difficulty: noLevel.total, points: questions.filter((q) => q.points === null).length,
      essay: byFormat.unknown.total,
    };

    const report = {
      totals,
      questions: questions.map((q) => ({ ...q })),
      byLevel, band45, noLevel,
      byUnit, bySubUnit, byProblemType, byTemplate, byCrossConcept, byCondition, byFormat,
      levelByUnit,
      wrongList, sequence,
      weakProblemTypes: rankWeak(byProblemType.groups),
      weakTemplates: rankWeak(byTemplate.groups),
      diagnostics,
    };
    report.consistency = checkConsistency(report);
    return report;
  }

  // 합계가 서로 맞는지 확인한다. 문제가 있으면 문장 목록을 돌려준다(화면에 쓰지 않고 검사에 쓴다).
  function checkConsistency(report) {
    const problems = [];
    const n = report.totals.total;
    const sum = (list) => list.reduce((acc, g) => acc + g.total, 0);
    const sumAll = (section) => sum(section.groups) + section.missing.total;
    if (report.totals.correct + report.totals.wrong + report.totals.unchecked !== n) problems.push("총계: 정답+오답+미응답이 총 문항과 다름");
    if (sum(report.byLevel) + report.noLevel.total !== n) problems.push("단계: 1~5단계 + 단계 정보 없음이 총 문항과 다름");
    if (report.band45.total !== report.byLevel[3].total + report.byLevel[4].total) problems.push("단계: 4~5 묶음이 4단계+5단계와 다름");
    for (const name of ["byUnit", "bySubUnit", "byProblemType", "byTemplate"]) if (sumAll(report[name]) !== n) problems.push(`${name}: 묶음 합 + 없음이 총 문항과 다름`);
    if (report.byFormat.objective.total + report.byFormat.essay.total + report.byFormat.unknown.total !== n) problems.push("byFormat: 합이 총 문항과 다름");
    if (report.wrongList.length !== report.totals.wrong) problems.push("틀린 문항 목록 수가 오답 수와 다름");
    if (report.sequence.length !== n) problems.push("번호순 정오 배열 길이가 총 문항과 다름");
    if (report.levelByUnit.rows.reduce((acc, row) => acc + row.total.total, 0) !== n) problems.push("교차표: 행 합이 총 문항과 다름");
    for (const row of report.levelByUnit.rows) {
      const cells = [1, 2, 3, 4, 5, "none"].reduce((acc, k) => acc + row.cells[k].total, 0);
      if (cells !== row.total.total) problems.push(`교차표(${row.unit ?? "단원 없음"}): 단계 칸 합이 행 합과 다름`);
    }
    return { ok: problems.length === 0, problems };
  }

  // 키 → 한글 이름. 새 이름표를 만들지 않고, 저장소가 이미 쓰는 이름표(키 해석기 Archive2KeyResolver)를 그대로 쓴다.
  //   sources: 보관함 문제지 만들기·유형 요약이 읽는 같은 JSON 4개
  //     taxonomy   archive/data/meta-foundation/compiled/taxonomy_registry.json (problemTypes[], templates[]: canonicalLabelKo)
  //     concepts   .../compiled/concept_registry.json, conditions  .../compiled/condition_registry.json
  //     extensions archive/data/archive2-extension-keys.json (EXT-… 키)
  //   resolverApi: 생략하면 전역 Archive2KeyResolver. node에서는 require("../archive2-key-resolver.js")를 넘긴다.
  // 이름이 없으면 빈 문자열을 돌려준다(키 글자를 이름으로 내보내지 않는다).
  function createLabelOf(sources, resolverApi) {
    const api = resolverApi || (typeof globalThis !== "undefined" ? globalThis.Archive2KeyResolver : null);
    if (!api || typeof api.create !== "function") throw new Error("DIAGNOSTIC_LABELS_KEY_RESOLVER_MISSING");
    const src = sources || {};
    const resolver = api.create({ taxonomy: src.taxonomy, concepts: src.concepts, conditions: src.conditions, extensions: src.extensions });
    return (key) => {
      const k = text(key);
      if (!k) return "";
      const label = text(resolver.labelOf(k));
      return label && label !== k ? label : "";
    };
  }

  // ---- 입력 규칙(화면이 쓰는 순수 함수) ----
  // 기본은 "전부 정답(O)"이고 틀린 문항만 X로 바꾼다. 그러나 기본값은 선생님이 결과표 만들기를 누른(confirmed) 뒤에야 결과가 된다.
  // 단계: empty(입력 없음) → partial(일부만 입력) → draft(전부 입력, 아직 확인 전) → confirmed(확인함, 결과표 만듦).
  // 확인하지 않은 응답은 결과표·집계에 쓰지 않는다. 이 파일은 상태를 저장하지 않는다.
  const questionNos = (questions) => (Array.isArray(questions) ? questions : []).map((q, i) => String(q && q.no != null ? q.no : i + 1));
  const isAnswer = (value) => value === "O" || value === "X";

  function allCorrectResponses(questions) {
    const out = Object.create(null);
    for (const no of questionNos(questions)) out[no] = "O";
    return out;
  }
  // 입력 안 한 문항(미입력)만 O로 채운다. 이미 O/X인 문항은 그대로 둔다.
  function fillRemainingCorrect(questions, responses) {
    const out = Object.create(null);
    const src = responses || {};
    for (const no of questionNos(questions)) out[no] = isAnswer(src[no]) ? src[no] : "O";
    return out;
  }
  // "3 7 12 15" 같은 틀린 번호 한 줄 → 그 번호만 X, 나머지는 모두 O. 범위 밖·숫자 아님은 오류(아무것도 바꾸지 않는다). 같은 번호 중복은 한 번으로 센다.
  function applyWrongNumbers(questions, textInput) {
    const nos = questionNos(questions);
    const known = new Set(nos);
    // 전각 숫자·쉼표(３，７)도 받도록 NFKC로 먼저 바꾼다.
    const tokens = String(textInput == null ? "" : textInput).normalize("NFKC").split(/[\s,.;/]+/).filter(Boolean);
    const wrong = [];
    for (const token of tokens) {
      if (!/^\d+$/.test(token) || !known.has(String(Number(token)))) return { ok: false, error: `‘${token}’은(는) 1~${nos.length}번 안의 번호가 아닙니다.`, responses: null, wrongNos: [] };
      const no = String(Number(token));
      if (!wrong.includes(no)) wrong.push(no);
    }
    const responses = allCorrectResponses(questions);
    for (const no of wrong) responses[no] = "X";
    return { ok: true, error: "", responses, wrongNos: wrong.map(Number).sort((a, b) => a - b) };
  }
  // 결과표 만들기(확정). 틀린 번호 칸에 적고 아직 적용하지 않은 글(pendingText)이 있으면 그 글을 먼저 적용한 뒤 확정한다.
  // 그 글이 잘못되었거나 비어 있는 문항이 있으면 확정하지 않고(ok=false) 오류 문구만 돌려준다. 받은 responses 객체는 바꾸지 않는다.
  function confirmInput(input) {
    const options = input && typeof input === "object" ? input : {};
    let responses = options.responses || {};
    if (String(options.pendingText == null ? "" : options.pendingText).trim() !== "") {
      const applied = applyWrongNumbers(options.questions, options.pendingText);
      if (!applied.ok) return { ok: false, error: applied.error, responses, confirmed: false };
      // 글을 적은 뒤 단추로 직접 X를 누른 문항도 잃지 않는다: 이미 X인 문항은 X로 남긴다(오답을 조용히 정답으로 바꾸지 않게).
      const kept = options.responses || {};
      responses = Object.assign({}, applied.responses);
      for (const no of Object.keys(kept)) if (kept[no] === "X" && no in responses) responses[no] = "X";
    }
    const status = inputStatus({ questions: options.questions, responses });
    if (status.unanswered) return { ok: false, error: `비어 있는 문항이 ${status.unanswered}개 있습니다.`, responses, confirmed: false };
    return { ok: true, error: "", responses, confirmed: true };
  }
  function inputStatus(input) {
    const options = input && typeof input === "object" ? input : {};
    const nos = questionNos(options.questions);
    const src = options.responses || {};
    const total = nos.length;
    const correct = nos.filter((no) => src[no] === "O").length;
    const wrong = nos.filter((no) => src[no] === "X").length;
    const answered = correct + wrong;
    let phase = "empty";
    if (answered > 0 && answered < total) phase = "partial";
    else if (total > 0 && answered === total) phase = options.confirmed === true ? "confirmed" : "draft";
    return { phase, total, answered, correct, wrong, unanswered: total - answered, counted: phase === "confirmed" };
  }

  return Object.freeze({ LEVELS, computeDiagnosticReport, checkConsistency, createLabelOf, toStatus, allCorrectResponses, fillRemainingCorrect, applyWrongNumbers, inputStatus, confirmInput });
});
