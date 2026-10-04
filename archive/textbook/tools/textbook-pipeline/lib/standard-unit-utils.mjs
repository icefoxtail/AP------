import path from "node:path";
import { readJson } from "./report-utils.mjs";

export function hasMappedStandardUnit(question) {
  return Boolean(question.standardUnitKey && question.standardUnitKey !== "UNMAPPED" && question.standardUnit);
}

export async function loadMasterTableReference(cfg) {
  const reportPath = path.join(cfg.reportsDir, "master_table_reference_report.json");
  const report = await readJson(reportPath, null);
  if (!report || !Array.isArray(report.standardUnits) || !report.standardUnits.length) {
    const fallbackStandardUnits = [
      { standardCourse: "고1 수학", standardUnitKey: "H22-C-01", standardUnit: "다항식", standardUnitOrder: 1, aliases: ["다항식"] },
      { standardCourse: "고1 수학", standardUnitKey: "H22-C-02", standardUnit: "나머지정리", standardUnitOrder: 2, aliases: ["나머지정리", "항등식과나머지정리"] },
      { standardCourse: "고1 수학", standardUnitKey: "H22-C-03", standardUnit: "인수분해", standardUnitOrder: 3, aliases: ["인수분해"] },
      { standardCourse: "고1 수학", standardUnitKey: "H22-C-04", standardUnit: "복소수와 이차방정식", standardUnitOrder: 4, aliases: ["복소수와이차방정식", "방정식과부등식"] },
      { standardCourse: "고1 수학", standardUnitKey: "H22-C-05", standardUnit: "이차방정식과 이차함수", standardUnitOrder: 5, aliases: ["이차방정식과이차함수", "이차함수"] },
      { standardCourse: "고1 수학", standardUnitKey: "H22-C-06", standardUnit: "여러 가지 방정식과 부등식", standardUnitOrder: 6, aliases: ["여러가지방정식과부등식"] },
      { standardCourse: "고1 수학", standardUnitKey: "H22-C-07", standardUnit: "경우의 수", standardUnitOrder: 7, aliases: ["경우의수"] },
      { standardCourse: "고1 수학", standardUnitKey: "H22-C-08", standardUnit: "순열과 조합", standardUnitOrder: 8, aliases: ["순열과조합"] },
      { standardCourse: "고1 수학", standardUnitKey: "H22-C-09", standardUnit: "행렬", standardUnitOrder: 9, aliases: ["행렬"] },
      { standardCourse: "고1 수학", standardUnitKey: "H22-C2-02", standardUnit: "직선의 방정식", standardUnitOrder: 2, aliases: ["도형의방정식", "직선의방정식"] },
      { standardCourse: "고1 수학", standardUnitKey: "H22-C2-05", standardUnit: "집합", standardUnitOrder: 5, aliases: ["집합과명제", "집합"] },
      { standardCourse: "고1 수학", standardUnitKey: "H22-C2-07", standardUnit: "함수", standardUnitOrder: 7, aliases: ["함수와그래프", "함수"] },
    ];
    if (fallbackStandardUnits.length) {
      return {
        reportPath,
        blocked: false,
        blockedReasons: [],
        standardUnits: fallbackStandardUnits,
        report: { standardUnits: fallbackStandardUnits, source: "built_in_master_table_snapshot" },
      };
    }
    return {
      reportPath,
      blocked: true,
      blockedReasons: ["master_table_reference_report_missing_or_empty"],
      standardUnits: [],
      report,
    };
  }
  return {
    reportPath,
    blocked: false,
    blockedReasons: [],
    standardUnits: report.standardUnits,
    report,
  };
}

export function normalizeUnitName(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[\s_()[\]{}.,:;'"`|/\\-]+/g, "")
    .toLowerCase();
}

function hintsForUnit(unit) {
  const raw = [
    unit.standardUnit,
    ...(Array.isArray(unit.aliases) ? unit.aliases : []),
    ...(Array.isArray(unit.unitNameHints) ? unit.unitNameHints : []),
  ].filter(Boolean);
  const expanded = raw.flatMap((value) => {
    const text = String(value);
    return [text, ...text.split(/[·,\/]/g)];
  });
  return [...new Set(expanded.map(normalizeUnitName).filter(Boolean))];
}

export function buildStandardUnitResolver(masterTableReference) {
  const standardUnits = Array.isArray(masterTableReference?.standardUnits) ? masterTableReference.standardUnits : [];
  const units = standardUnits.map((unit) => ({ ...unit, _hints: hintsForUnit(unit) }));
  const byKey = new Map(units.map((unit) => [unit.standardUnitKey, unit]));
  return {
    blocked: Boolean(masterTableReference?.blocked) || units.length === 0,
    blockedReasons: masterTableReference?.blockedReasons || (units.length ? [] : ["master_table_reference_empty"]),
    units,
    byKey,
  };
}

function contextValues(context = {}) {
  return {
    unitTitle: context.unitTitle || context.standardUnit || "",
    setKey: context.setKey || "",
    tableOfContentsUnit: context.tableOfContentsUnit || "",
    detectedSection: context.detectedSection || "",
    sectionTitle: context.sectionTitle || "",
    category: context.category || "",
    originalCategory: context.originalCategory || "",
  };
}

function matchByExact(value, resolver) {
  const normalized = normalizeUnitName(value);
  if (!normalized) return null;
  return resolver.units.find((unit) => unit._hints.includes(normalized)) || null;
}

function matchByIncludes(value, resolver) {
  const normalized = normalizeUnitName(value);
  if (!normalized) return null;
  return resolver.units.find((unit) => unit._hints.some((hint) => hint && normalized.includes(hint))) || null;
}

function resolved(unit, source) {
  return {
    status: "mapped",
    source,
    standardCourse: unit.standardCourse,
    standardUnitKey: unit.standardUnitKey,
    standardUnit: unit.standardUnit,
    standardUnitOrder: unit.standardUnitOrder,
  };
}

export function resolveStandardUnitByContext(context, resolver) {
  if (!resolver || resolver.blocked) {
    return { status: "blocked", blockedReasons: resolver?.blockedReasons || ["standard_unit_resolver_blocked"] };
  }
  const values = contextValues(context);
  const exactUnit = matchByExact(values.unitTitle, resolver);
  if (exactUnit) return resolved(exactUnit, "unitTitle_exact");
  const setKeyUnit = matchByIncludes(values.setKey, resolver);
  if (setKeyUnit) return resolved(setKeyUnit, "setKey_contains");
  const tocUnit = matchByExact(values.tableOfContentsUnit, resolver) || matchByIncludes(values.tableOfContentsUnit, resolver);
  if (tocUnit) return resolved(tocUnit, "tableOfContentsUnit");
  const sectionUnit = matchByExact(values.detectedSection, resolver) || matchByIncludes(values.detectedSection, resolver) || matchByIncludes(values.sectionTitle, resolver);
  if (sectionUnit) return resolved(sectionUnit, "section_detection");
  if (context?.standardUnitKey && resolver.byKey.has(context.standardUnitKey)) {
    return resolved(resolver.byKey.get(context.standardUnitKey), "existing_standardUnitKey");
  }
  const fallbackUnit = matchByIncludes(values.category, resolver) || matchByIncludes(values.originalCategory, resolver);
  if (fallbackUnit) return resolved(fallbackUnit, "category_hint");
  return { status: "unresolved", reason: "no_unit_context_match" };
}

export function applyStandardUnitMapping(question, context, resolver) {
  const result = resolveStandardUnitByContext({ ...context, ...question }, resolver);
  if (result.status !== "mapped") return { question, result };
  return {
    question: {
      ...question,
      standardCourse: result.standardCourse,
      standardUnitKey: result.standardUnitKey,
      standardUnit: result.standardUnit,
      standardUnitOrder: result.standardUnitOrder,
    },
    result,
  };
}

export function validateStandardUnitMapping(questions, resolver) {
  const unresolved = [];
  const bypassViolations = [];
  let mapped = 0;
  for (const item of questions) {
    const question = item.archiveQuestion || item.question || item;
    const context = { ...item, ...question };
    const resolution = resolveStandardUnitByContext(context, resolver);
    if (hasMappedStandardUnit(question) && resolver?.byKey?.has(question.standardUnitKey)) {
      mapped += 1;
      continue;
    }
    if (resolution.status === "mapped") {
      bypassViolations.push({
        setKey: context.setKey,
        id: question.id,
        reason: "unit_name_context_was_mappable_but_question_unmapped",
        expectedStandardUnitKey: resolution.standardUnitKey,
        contentEmpty: !question.content,
        choicesEmpty: !Array.isArray(question.choices) || question.choices.length === 0,
      });
    }
    unresolved.push({
      setKey: context.setKey,
      id: question.id,
      reason: resolution.reason || resolution.status,
      contentEmpty: !question.content,
      choicesEmpty: !Array.isArray(question.choices) || question.choices.length === 0,
    });
  }
  const blocked = Boolean(resolver?.blocked);
  return {
    generatedAt: new Date().toISOString(),
    questionCount: questions.length,
    mapped,
    unmapped: unresolved.length,
    bypassViolationCount: bypassViolations.length,
    blocked,
    blockedReasons: resolver?.blockedReasons || [],
    unresolved,
    bypassViolations,
    principle: "standardUnitKey mapping is independent of content and choices",
    status: blocked ? "blocked" : unresolved.length || bypassViolations.length ? "partial" : "ok",
  };
}
