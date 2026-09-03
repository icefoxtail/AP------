#!/usr/bin/env node

/*
 * Pinpoint quality pass for the 56 production H1 first-semester exams.
 *
 * The script deliberately edits scalar metadata and known, source-backed
 * repair fields only. It never serializes/reformats a whole question bank.
 * Run with --apply to write changes; without it, only the proposed counts
 * are printed.
 */

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const H1_ROOT = path.join(ROOT, "archive", "exams", "original", "high", "h1");
const APPLY = process.argv.includes("--apply");
const TARGET_DIRS = [path.join(H1_ROOT, "1mid"), path.join(H1_ROOT, "1final")];

const TARGETS = {
  "1mid/23_부영여고_1학기_중간_고1_기출.js": { 11: factorizationRepair() },
  "1mid/23_충무고_1학기_중간_고1_기출.js": {
    9: factorizationRepair(),
    19: { answer: "4", questionType: "서술형" },
  },
  "1mid/24_여수고_1학기_중간_고1_기출.js": { 16: factorizationRepair() },
  "1mid/23_여천고_1학기_중간_고1_기출.js": {
    13: quadraticFunction("H15-SA-13-QUADRATIC_GRAPH", "이차함수의 그래프"),
    14: quadraticFunction("H15-SA-13-QUADRATIC_GRAPH", "이차함수의 그래프"),
    15: quadraticFunction("H15-SA-13-QUADRATIC_APPLICATION", "이차함수의 활용"),
    16: quadraticFunction("H15-SA-13-QUADRATIC_GRAPH", "이차함수의 그래프"),
    17: quadraticFunction("H15-SA-13-QUADRATIC_GRAPH", "이차함수의 그래프"),
    20: quadraticFunction("H15-SA-13-QUADRATIC_GRAPH", "이차함수의 그래프"),
    22: quadraticFunction("H15-SA-13-QUADRATIC_APPLICATION", "이차함수의 활용"),
    23: quadraticFunction("H15-SA-13-QUADRATIC_APPLICATION", "이차함수의 활용"),
  },
};

const SOLUTION_REPLACEMENTS = {
  "1mid/24_한영고_1학기_중간_고1_기출.js#7": `[키포인트] 상수항이 0인 이차식을 인수분해하여 두 경우로 나눈다.
$2x^2-xy-y^2=(2x+y)(x-y)=0$이므로 $y=-2x$ 또는 $y=x$이다.

1) $y=-2x$이면 $x^2+y^2=5x^2=20$이므로 $x=\\pm2$이다. 따라서 $x+2y$의 값은 $-6$, $6$이다.
2) $y=x$이면 $2x^2=20$이므로 $x=\\pm\\sqrt{10}$이다. 따라서 $x+2y$의 값은 $3\\sqrt{10}$, $-3\\sqrt{10}$이다.

$3\\sqrt{10}>6$이므로 최댓값은 $3\\sqrt{10}$이다. 따라서 정답은 ④이다.`,
  "1mid/24_한영고_1학기_중간_고1_기출.js#14": `[키포인트] $x^2+x+1=0$의 허근이 갖는 성질을 이용하여 각 보기를 확인한다.
양변에 $x$를 곱하면 $x^2+x+1=0$이므로 $\\omega^3=1$, $\\omega^2+\\omega+1=0$이다.

ㄱ. 켤레를 취해도 $\\bar{\\omega}^2+\\bar{\\omega}+1=0$이므로 주어진 등식의 양변은 모두 $-1$이다. 참이다.
ㄴ. $\\bar{\\omega}=\\omega^2$를 이용하면 $(\\bar{\\omega}+1)(\\bar{\\omega}^2+1)=(-\\bar{\\omega}^2)(-\\bar{\\omega})=\\bar{\\omega}^3=1$이다. 참이다.
ㄷ. $\\bar{\\omega}^n=(-1)^n$이 되려면 $n$은 $6$의 배수이어야 한다. $60$ 이하의 $6$의 배수는 $10$개이므로 참이다.

따라서 옳은 것은 ㄱ, ㄴ, ㄷ이고 정답은 ⑤이다.`,
  "1mid/24_한영고_1학기_중간_고1_기출.js#17": `[키포인트] 이차방정식이 실근을 가질 조건은 판별식이 0 이상인 것이다.
$\\dfrac{D}{4}=(1-k)^2-(k^2+3)\\ge0$
$1-2k+k^2-k^2-3\\ge0$이므로 $-2k-2\\ge0$이다.
따라서 $k\\le-1$이고, 정답은 $k\\le-1$이다.`,
  "1mid/24_제일고_1학기_중간_고1_기출.js#20": `삼각형 $AOB$의 넓이는 $\\dfrac12\\cdot6\\cdot4=12$이므로 이등분되어야 하는 넓이는 $6$이다.

직선 $y=-2x+k$와 변 $OB$($y=0$)의 교점을 $R$, 변 $OA$($y=\\dfrac45x$)의 교점을 $S$라 하자.
$R=(\\dfrac{k}{2},0)$이고, $S=\\left(\\dfrac{5k}{14},\\dfrac{2k}{7}\\right)$이다.

첫째, $0<k<12$이면 $R$, $S$가 각각 선분 $OB$, $OA$ 위에 있다. 이때 원점 쪽 삼각형의 넓이는
$[ORS]=\\dfrac12\\cdot\\dfrac{k}{2}\\cdot\\dfrac{2k}{7}=\\dfrac{k^2}{14}$이다.
따라서 $\\dfrac{k^2}{14}=6$에서 $k=2\\sqrt{21}$이고, 실제로 $0<2\\sqrt{21}<12$이다.

둘째, $12\\le k<14$이면 직선은 $OA$와 $AB$를 자른다. $S$는 $OA$와의 교점이고 $T$는 $AB$와의 교점이다. $AO$ 위에서 $AS:AO=(14-k):14$이고, $AB$ 위에서 $AT:AB=(14-k):2$이다. 두 삼각형 $AST$와 $AOB$는 $A$에서 낀 각이 같으므로 넓이의 비는 두 변의 비의 곱이다. 따라서
$[AST]=[AOB]\\times\\dfrac{14-k}{14}\\times\\dfrac{14-k}{2}=12\\times\\dfrac{(14-k)^2}{28}=\\dfrac37(14-k)^2$이다.
$12\\le k<14$에서 $0<14-k\\le2$이므로 $[AST]\\le\\dfrac37\\cdot2^2=\\dfrac{12}{7}<6$이다. 따라서 원점 쪽 넓이는 $12-[AST]>6$이어서 이등분할 수 없다.

셋째, $k\\le0$이면 직선은 삼각형 내부를 가르지 못하고, $k\\ge14$이면 원점 쪽 넓이가 삼각형 전체 넓이 $12$가 되어 이등분 조건을 만족하지 않는다.

따라서 조건을 만족하는 값은 $k=2\\sqrt{21}$이다.`,
  "1final/22_팔마고_1학기_기말_고1_기출.js#5": `두 직선이 평행하려면 $x$, $y$의 계수의 비가 같아야 한다. 따라서
$\\dfrac{1-m}{2}=\\dfrac{3}{-m}$
에서 $(1-m)(-m)=3\\cdot2$이다.
정리하면 $m^2-m-6=0$이므로 $(m-3)(m+2)=0$, 따라서 $m=3$ 또는 $m=-2$이다.

$m=3$일 때 첫 번째 직선은 $-2x+3y-5=0$, 두 번째 직선은 $2x-3y+5=0$으로 서로 같은 직선이다. 따라서 서로 다른 평행선이 되는 값은 $m=-2$이다.
참고로 $m=0$이면 두 번째 직선은 수직선 $2x+5=0$이고 첫 번째 직선의 기울기는 $-1/3$이므로 평행하지 않다. 따라서 나눗셈에서 빠지는 경우도 조건을 만족하지 않는다.

따라서 정답은 ①이다.`,
};

function factorizationRepair() {
  return {
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-03",
    standardUnit: "인수분해",
    standardUnitOrder: 3,
    subUnitKey: "H15-SA-03-FACTORIZATION",
    subUnit: "인수분해",
    subUnitConfidence: "approved_source_repair",
    subUnitClassificationDepth: "complete_rule",
  };
}

function quadraticFunction(subUnitKey, subUnit) {
  return {
    standardCourse: "수학(상)",
    standardUnitKey: "H15-SA-13",
    standardUnit: "이차함수",
    standardUnitOrder: 13,
    subUnitKey,
    subUnit,
    subUnitConfidence: "approved_source_repair",
    subUnitClassificationDepth: "complete_rule",
  };
}

function loadQuestions(file) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), context, { filename: file });
  return Array.isArray(context.window.questionBank) ? context.window.questionBank : [];
}

function relativeKey(file) {
  return path.relative(H1_ROOT, file).replaceAll("\\", "/");
}

function findBlocks(lines) {
  const blocks = new Map();
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i] !== "  {") continue;
    const id = lines[i + 1]?.match(/^    "id":\s*(\d+),?$/)?.[1];
    if (!id) continue;
    let end = i + 1;
    while (end < lines.length && !/^  \},?$/.test(lines[end])) end += 1;
    if (end >= lines.length) throw new Error(`unterminated question block id=${id}`);
    blocks.set(Number(id), { start: i, end });
  }
  return blocks;
}

function setField(lines, block, field, value) {
  const fieldRe = new RegExp(`^    "${field}":`);
  const start = lines.findIndex((line, i) => i > block.start && i < block.end && fieldRe.test(line));
  if (start < 0) throw new Error(`field missing: ${field} in q${block.start}`);
  if (field !== "choices" && field !== "tags") {
    lines[start] = `    "${field}": ${JSON.stringify(value)},`;
    return 1;
  }
  let end = start;
  while (end < block.end && !/^    \],?$/.test(lines[end])) end += 1;
  if (end >= block.end) throw new Error(`choices array not closed in q${block.start}`);
  lines.splice(start, end - start + 1, `    "choices": ${JSON.stringify(value)},`);
  const delta = end - start;
  block.end -= delta;
  return delta + 1;
}

function isBlankChoices(choices) {
  return Array.isArray(choices) && choices.length > 0 && choices.every((choice) => !String(choice ?? "").trim());
}

function inferQuestionType(question, choices) {
  const content = String(question.content || "");
  const subjective = /서술형|서답형|서·논술형|과정을 서술/.test(content);
  if (choices.length > 0 && !isBlankChoices(choices)) return "객관식";
  if (subjective) return "서술형";
  return "단답형";
}

function buildCanonicalMaps() {
  const master = JSON.parse(fs.readFileSync(path.join(ROOT, "archive", "data", "master_tables", "js_archive_tag_master.json"), "utf8"));
  const subUnits = new Map();
  for (const row of master) {
    if (row.keyType === "subUnitKey" && row.subUnitKey) subUnits.set(row.subUnitKey, row);
  }
  const documented = JSON.parse(fs.readFileSync(path.join(ROOT, "archive", "_generated", "intelligence", "phase1", "master-audit", "master-key-integrity-report.json"), "utf8"));
  const standardUnits = new Map(documented.documentedStandardUnits.map((row) => [row.key, row]));
  // The maintained subunit master intentionally carries the legacy H15-SA-13
  // quadratic-function parent used by the production first-semester archive.
  standardUnits.set("H15-SA-13", { key: "H15-SA-13", labelKo: "이차함수", order: 13 });
  return { subUnits, standardUnits };
}

function expectedCourse(standardUnitKey) {
  if (standardUnitKey?.startsWith("H15-SA-")) return "수학(상)";
  if (standardUnitKey?.startsWith("H15-SB-")) return "수학(하)";
  if (standardUnitKey?.startsWith("H22-C2-")) return "공통수학2";
  if (standardUnitKey?.startsWith("H22-C-")) return "공통수학1";
  return null;
}

function normalizeSolution(solution) {
  return decodeLiteralNewlines(solution)
    .replaceAll("\\n eq", "\\neq")
    .replaceAll("\\n e", "\\neq")
    .replaceAll("\\ tf", "\\frac")
    .replaceAll("<b>[Logical Anchor]</b>", "[풀이의 핵심]")
    .replaceAll("iii)", "3)")
    .replaceAll("ii)", "2)")
    .replaceAll("i)", "1)")
    .replaceAll("임.", "이다.")
    .replaceAll("함.", "한다.");
}

function decodeLiteralNewlines(value) {
  return String(value || "").replace(/\\n(?![A-Za-z])/g, "\n");
}

function normalizeBareLatexInSolution(solution) {
  return String(solution || "").split("\n").map((line) => {
    if (line.includes("$") || !/\\(?:implies|therefore|frac|dfrac|sqrt|pm|bar|omega|cdot|times)/.test(line)) return line;
    const trimmed = line.trim();
    if (/^\\(?:implies|therefore)/.test(trimmed)) {
      const command = trimmed.match(/^\\(?:implies|therefore)/)[0];
      const rest = trimmed.slice(command.length);
      if (/[가-힣]/.test(rest)) return `${line.slice(0, line.indexOf(trimmed))}$${command}$${rest}`;
      return `${line.slice(0, line.indexOf(trimmed))}$${trimmed}$`;
    }
    const colon = line.indexOf(":");
    if (colon >= 0 && /\\(?:frac|dfrac|sqrt|pm|bar|omega)/.test(line.slice(colon + 1))) {
      return `${line.slice(0, colon + 1)} $${line.slice(colon + 1).trim()}$`;
    }
    return `$${line}$`;
  }).join("\n");
}

function applyFile(file, maps, stats) {
  const beforeSource = fs.readFileSync(file, "utf8");
  const before = loadQuestions(file);
  const byId = new Map(before.map((question) => [Number(question.id), question]));
  const lines = beforeSource.split(/\r?\n/);
  const newline = beforeSource.includes("\r\n") ? "\r\n" : "\n";
  const blocks = findBlocks(lines);
  const key = relativeKey(file);
  const explicit = TARGETS[key] || {};
  let changed = false;

  // Fix malformed LaTeX in the source string representation, globally within
  // the requested 56-file scope.
  const normalizedSource = lines.join("\n")
    .replaceAll("\\\\n eq", "\\\\neq")
    .replaceAll("\\\\n e", "\\\\neq")
    .replaceAll("\\\\ tf", "\\\\frac")
    .replace(/\\\\n(?![A-Za-z])/g, "\\n");
  if (normalizedSource !== lines.join("\n")) {
    lines.splice(0, lines.length, ...normalizedSource.split("\n"));
    changed = true;
    stats.latexSourceReplacements += 1;
  }

  // Work from the bottom of the file upwards so replacing a choices array
  // cannot invalidate the line coordinates of earlier question blocks.
  const questionsToProcess = [...before].sort((left, right) =>
    blocks.get(Number(right.id)).start - blocks.get(Number(left.id)).start);
  for (const question of questionsToProcess) {
    const id = Number(question.id);
    const block = blocks.get(id);
    if (!block) throw new Error(`question block missing: ${key}#${id}`);
    const changes = {};
    const sub = maps.subUnits.get(question.subUnitKey);
    const course = expectedCourse(question.standardUnitKey);
    const unit = maps.standardUnits.get(question.standardUnitKey);
    if (course && question.standardCourse !== course) changes.standardCourse = course;
    if (unit && question.standardUnit !== unit.labelKo) changes.standardUnit = unit.labelKo;
    if (unit && Number(question.standardUnitOrder) !== Number(unit.order)) changes.standardUnitOrder = Number(unit.order);
    if (sub && question.subUnit !== sub.labelKo) changes.subUnit = sub.labelKo;

    const explicitChanges = explicit[id];
    if (explicitChanges) Object.assign(changes, explicitChanges);
    if (key === "1mid/23_한영고_1학기_중간_고1_기출.js" && id === 15
      && String(question.content || "").startsWith("[그래프필요]")) {
      changes.content = String(question.content).replace(/^\[그래프필요\]\s*/, "");
    }

    let choices = Array.isArray(question.choices) ? question.choices : [];
    if (isBlankChoices(choices)) {
      choices = [];
      if (question.choices.length !== 0) changes.choices = [];
    }

    const inferredType = inferQuestionType(question, choices);
    if (question.questionType !== inferredType) changes.questionType = inferredType;

    // The Yeocheon objective bank stores 1..5 as option indexes. Preserve the
    // selected option while bringing the answer representation to archive form.
    if (choices.length > 0 && /^\d$/.test(String(question.answer).trim())) {
      const index = Number(String(question.answer).trim());
      if (index >= 1 && index <= choices.length) changes.answer = ["", "①", "②", "③", "④", "⑤"][index];
    }

    for (const [field, value] of Object.entries(changes)) {
      if (JSON.stringify(question[field]) === JSON.stringify(value)) continue;
      setField(lines, block, field, value);
      changed = true;
      stats.fields[field] = (stats.fields[field] || 0) + 1;
      if (field === "subUnit") stats.canonicalLabelUpdates += 1;
      if (field === "standardCourse") stats.courseUpdates += 1;
    }

    const solutionKey = `${key}#${id}`;
    // The student-facing prose cleanup is intentionally limited to the two
    // files that contain the legacy internal marker. Other solutions receive
    // only the narrowly targeted LaTeX or hard-fix replacement above.
    const legacyAnchorFile = key === "1mid/23_매산고_1학기_중간_고1_기출.js"
      || key === "1mid/23_부영여고_1학기_중간_고1_기출.js";
    let solution = legacyAnchorFile ? normalizeSolution(question.solution) : question.solution;
    if (key === "1mid/24_한영고_1학기_중간_고1_기출.js") {
      solution = normalizeBareLatexInSolution(decodeLiteralNewlines(solution));
    }
    if (SOLUTION_REPLACEMENTS[solutionKey]) solution = SOLUTION_REPLACEMENTS[solutionKey];
    if (key === "1mid/23_한영고_1학기_중간_고1_기출.js" && id === 13) {
      solution = solution
        .replace("주기가 $4$인 수열 $\\{0, -2, 0, 2\\}$가 반복된다.", "값이 네 개마다 같은 순서로 $\\{0, -2, 0, 2\\}$가 반복된다.");
    }
    if (key === "1final/25_제일고_1학기_기말_고1_기출c.js" && id === 8) {
      solution = solution
        .replace("주어진 수열의 각 항을 간단히 정리하여 주기가 3임을 파악하고", "주어진 식의 값이 세 개마다 같은 순서로 반복됨을 파악하고")
        .replaceAll("수열의 각 항", "각 항")
        .replaceAll("주기가 3으로 반복된다", "세 항마다 같은 순서로 반복된다");
    }
    if (key === "1final/25_효천고_1학기_기말_고1_기출c.js" && id === 19) {
      solution = solution.replace("하나의 수열을 만든다.", "하나의 배열 방법을 만든다.");
    }
    if (key === "1final/26_광양제철고_1학기_기말_고1_기출.js" && id === 4) {
      solution = solution
        .replace("서로 다른 세 수가 등차수열을 이루는 집합은 공차 1일 때 5개, 공차 2일 때 3개, 공차 3일 때 1개", "가운데 수가 양 끝 두 수의 평균이 되는 세 수의 집합은 양 끝 수의 차가 2일 때 5개, 4일 때 3개, 6일 때 1개");
    }
    if (solution !== question.solution) {
      setField(lines, block, "solution", solution);
      changed = true;
      stats.solutionUpdates += 1;
    }

    if ((key === "1mid/23_한영고_1학기_중간_고1_기출.js" && id === 13)
      || (key === "1final/25_제일고_1학기_기말_고1_기출c.js" && id === 8)) {
      if (Array.isArray(question.tags) && question.tags.includes("수열")) {
        const nextTags = question.tags.filter((tag) => tag !== "수열");
        setField(lines, block, "tags", nextTags);
        changed = true;
        stats.tagUpdates += 1;
      }
    }
  }

  if (APPLY && changed) fs.writeFileSync(file, lines.join(newline), "utf8");
  if (changed) stats.filesChanged += 1;
}

function main() {
  const maps = buildCanonicalMaps();
  const stats = { filesChanged: 0, canonicalLabelUpdates: 0, courseUpdates: 0, latexSourceReplacements: 0, solutionUpdates: 0, tagUpdates: 0, fields: {} };
  const files = TARGET_DIRS.flatMap((dir) => fs.readdirSync(dir).filter((name) => name.endsWith(".js")).map((name) => path.join(dir, name)));
  for (const file of files) applyFile(file, maps, stats);
  console.log(JSON.stringify({ mode: APPLY ? "apply" : "dry-run", files: files.length, stats }, null, 2));
}

main();
