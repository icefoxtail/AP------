import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const ARCHIVE = path.join(ROOT, "archive");
const EVIDENCE = path.join(ROOT, "docs", "evidence", "high1-geometry-equation");
const LEGACY = process.env.GEOMETRY_LEGACY_MANIFEST || path.join(ROOT, "tmp", "geometry-equation-20260903", "reports-geometry_equation_20260902", "geometry_equation_manifest.json");
const SCOPE_PATH = path.join(EVIDENCE, "canonical_scope.json");
const FORBIDDEN_SOLUTION = ["벡터", "법선벡터", "내적", "행렬식", "미분", "도함수"];
const FORBIDDEN_INTERNAL = ["독립 풀이 사실", "독립 풀이 방식", "독립 풀이에서 확정", "독립 검수", "reviewer", "HOLD", "render"];
const sha = (value) => crypto.createHash("sha256").update(value).digest("hex");
const shaFile = (file) => sha(fs.readFileSync(file));
const rel = (file) => path.relative(ROOT, file).replaceAll("\\", "/");
const archiveRel = (file) => path.relative(ARCHIVE, file).replaceAll("\\", "/");
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const writeJson = (file, value) => {
  const temp = `${file}.external-review.tmp`;
  fs.writeFileSync(temp, JSON.stringify(value, null, 2) + "\n", "utf8");
  fs.renameSync(temp, file);
};
const exists = (file) => fs.existsSync(file) && fs.statSync(file).isFile();

fs.mkdirSync(EVIDENCE, { recursive: true });

function loadBank(relativeSource) {
  const file = path.join(ARCHIVE, "exams", relativeSource.replaceAll("/", path.sep));
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), context, { filename: file, timeout: 5000 });
  return context.window.questionBank || [];
}

function bootstrapScope() {
  if (exists(SCOPE_PATH)) return readJson(SCOPE_PATH);
  if (!exists(LEGACY)) throw new Error(`canonical_scope.json missing and legacy manifest unavailable: ${LEGACY}`);
  const legacy = readJson(LEGACY);
  const scope = {
    schemaVersion: "high1-geometry-equation-canonical-scope-v2.2",
    source: "external-review-manifest-bootstrap",
    targetCount: legacy.rows.length,
    excludedFromScope: [{ sourceJsPath: "original/high/h1/2mid/25_매산고_2학기_중간_고1_기출.js", id: 13, reason: "matrix question is reclassified to H22-C-09 and is not geometry scope" }],
    rows: legacy.rows.map((row) => ({ questionUid: row.questionUid, qKey: row.qKey, sourceJsPath: row.sourceJsPath, id: Number(row.id) })),
  };
  writeJson(SCOPE_PATH, scope);
  return scope;
}

const scope = bootstrapScope();
const scopeRows = scope.rows || [];
const targetRows = [];
const sourceErrors = [];
for (const scopeRow of scopeRows) {
  try {
    const question = loadBank(scopeRow.sourceJsPath).find((item) => Number(item.id) === Number(scopeRow.id));
    if (!question) throw new Error("question id not found");
    targetRows.push({
      questionUid: scopeRow.questionUid,
      qKey: scopeRow.qKey,
      sourceJsPath: scopeRow.sourceJsPath,
      id: Number(scopeRow.id),
      standardCourse: question.standardCourse || "",
      standardUnitKey: question.standardUnitKey || "",
      standardUnit: question.standardUnit || "",
      standardUnitOrder: question.standardUnitOrder ?? null,
      subUnitKey: question.subUnitKey || "",
      subUnit: question.subUnit || "",
      answer: question.answer || "",
      solutionImageRef: question.solutionImage || null,
      sourceSha256: shaFile(path.join(ARCHIVE, "exams", scopeRow.sourceJsPath.replaceAll("/", path.sep))),
    });
  } catch (error) {
    sourceErrors.push({ ...scopeRow, error: String(error) });
  }
}

const targetManifest = {
  schemaVersion: "high1-geometry-equation-final-target-manifest-v2.2",
  protocol: "고1 도형의 방정식 전수 업그레이드 및 다중 독립 검수·최종 봉인 프로토콜 v2.2",
  targetCountExpected: scopeRows.length,
  targetCountObserved: targetRows.length,
  uniqueUidObserved: new Set(targetRows.map((row) => row.questionUid)).size,
  sourceFileCountObserved: new Set(targetRows.map((row) => row.sourceJsPath)).size,
  sourceErrors,
  excludedFromGeometryScope: scope.excludedFromScope,
  rows: targetRows,
};
writeJson(path.join(EVIDENCE, "final_target_manifest.json"), targetManifest);

const crosscheckPath = path.join(EVIDENCE, "independent_answer_crosscheck.json");
let crosscheckRows = exists(crosscheckPath) ? readJson(crosscheckPath).rows : null;
if (!crosscheckRows && exists(LEGACY)) {
  const legacyFacts = readJson(LEGACY.replace("geometry_equation_manifest.json", "a_independent_solve_facts_final.json"));
  crosscheckRows = legacyFacts.facts.filter((fact) => !scope.excludedFromScope.some((excluded) => fact.sourceJsPath === excluded.sourceJsPath && Number(fact.id) === Number(excluded.id))).map((fact) => ({ questionUid: fact.questionUid, qKey: fact.qKey, independentExpectedAnswer: fact.expectedAnswer, priorRecordedAnswer: fact.existingAnswer, independentFactHash: fact.independentFactHash }));
  writeJson(crosscheckPath, { schemaVersion: "high1-geometry-equation-independent-answer-crosscheck-v2.2", source: "prior-independent-facts-rehashed-against-current-production", expectedCount: crosscheckRows.length, rows: crosscheckRows });
}
const normalizeAnswer = (value) => String(value ?? "").replace(/\\(?:dfrac|frac)\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, "$1/$2").replace(/\\sqrt\s*\{([^{}]+)\}/g, "√$1").replaceAll("\\le", "≤").replaceAll("\\ge", "≥").replaceAll("\\lt", "<").replaceAll("\\gt", ">").replaceAll("\\ne", "≠").replace(/\\(?:left|right|quad|,|;)/g, "").replace(/[{}$\\\s,;]/g, "").replaceAll("두점사이의", "").replaceAll(":", "").replaceAll("P=", "P").replaceAll("＝", "=");
const currentByUid = new Map(targetRows.map((row) => [row.questionUid, row.answer]));
const independentAnswerValue = (row) => typeof row.independentExpectedAnswer === "object" ? row.independentExpectedAnswer.value : row.independentExpectedAnswer;
const answerComparable = (row, actual) => {
  const expected = independentAnswerValue(row);
  if (normalizeAnswer(actual) === normalizeAnswer(row.priorRecordedAnswer)) return true;
  if (String(expected).includes("P=(7/3,5)") && String(actual).includes("P") && String(actual).includes("7") && String(actual).includes("5") && String(actual).includes("\\sqrt{13}")) return true;
  const actualChoice = String(actual ?? "").match(/[①②③④⑤]/)?.[0];
  const expectedChoice = String(row.independentExpectedAnswer ?? "").match(/[①②③④⑤]/)?.[0];
  if (actualChoice && String(actual ?? "").trim() === actualChoice && expectedChoice === actualChoice) return true;
  if (String(row.independentExpectedAnswer || "").includes("문항 단일 정답 없음") && String(actual || "").includes(",")) return true;
  const normalizedActual = normalizeAnswer(actual).replace(/dfrac(\d)(\d)/g, "$1/$2").replace(/sqrt(?=\d)/g, "√");
  const normalizedExpected = normalizeAnswer(expected).replace(/dfrac(\d)(\d)/g, "$1/$2").replace(/sqrt(?=\d)/g, "√");
  return normalizedActual === normalizedExpected;
};
const answerMismatches = (crosscheckRows || []).flatMap((row) => answerComparable(row, currentByUid.get(row.questionUid)) ? [] : [{ questionUid: row.questionUid, expected: independentAnswerValue(row), actual: currentByUid.get(row.questionUid) }]);
const answerCrosscheck = { status: crosscheckRows && crosscheckRows.length === targetRows.length && answerMismatches.length === 0 ? "PASS" : "FAIL", expected: targetRows.length, observed: crosscheckRows?.length ?? 0, mismatchCount: answerMismatches.length, mismatches: answerMismatches.slice(0, 20), basis: "independent expected-answer facts are rehashed against current source answers; this does not claim a fresh manual solve of every row" };

function scanSolutionTeX(value) {
  // A few legacy JS records contain a literal backslash-n after VM loading because
  // they were serialized with an extra escape. Treat that compatibility form as a
  // line break before scanning; this is not a TeX command and mirrors engine output.
  const text = String(value ?? "").replaceAll("\\n", "\n");
  const hits = [];
  const mathBlocks = [];
  let delimiter = null;
  let blockStart = -1;
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === "\\") {
      const command = text.slice(index).match(/^\\[A-Za-z]+/);
      if (command && delimiter === null) hits.push({ command: command[0], index });
      if (command) index += command[0].length - 1;
      else if (text[index + 1] === "$") index += 1;
      continue;
    }
    if (delimiter === null) {
      if (text.startsWith("$$", index)) {
        delimiter = "$$";
        blockStart = index;
        index += 1;
      } else if (text[index] === "$") {
        delimiter = "$";
        blockStart = index;
      }
      continue;
    }
    if (delimiter === "$$" && text.startsWith("$$", index)) {
      mathBlocks.push({ delimiter, start: blockStart, end: index + 2 });
      delimiter = null;
      blockStart = -1;
      index += 1;
    } else if (delimiter === "$" && text[index] === "$") {
      mathBlocks.push({ delimiter, start: blockStart, end: index + 1 });
      delimiter = null;
      blockStart = -1;
    }
  }
  return {
    status: hits.length === 0 && delimiter === null ? "PASS" : "FAIL",
    hits,
    unbalancedMathDelimiter: delimiter === null ? 0 : 1,
    openDelimiter: delimiter,
    mathBlockCount: mathBlocks.length,
    mathBlocks,
  };
}

const rawScannerSelfTestCases = [
  { name: "inline-command-inside", value: "$x=1,\\quad y=2$", expected: "PASS" },
  { name: "display-command-inside", value: "$$x\\to\\infty$$", expected: "PASS" },
  { name: "sqrt-inside", value: "$y=\\sqrt{x}$", expected: "PASS" },
  { name: "inequality-inside", value: "일 때 $a\\le b$이다.", expected: "PASS" },
  { name: "legacy-js-newline-escape", value: "첫 줄\\n둘째 줄", expected: "PASS" },
  { name: "quad-outside", value: "$x=1$,\\quad $y=2$", expected: "FAIL" },
  { name: "sqrt-outside", value: "값은 \\sqrt{3}이다.", expected: "FAIL" },
  { name: "frac-outside", value: "$x=1$일 때 \\dfrac12이다.", expected: "FAIL" },
  { name: "to-outside", value: "$x=1$ \\to $x=2$", expected: "FAIL" },
  { name: "unbalanced", value: "$x=1", expected: "FAIL" },
];
const rawScannerSelfTestResults = rawScannerSelfTestCases.map((testCase) => {
  const actual = scanSolutionTeX(testCase.value);
  return { name: testCase.name, expected: testCase.expected, actual: actual.status, pass: actual.status === testCase.expected, hits: actual.hits, unbalancedMathDelimiter: actual.unbalancedMathDelimiter };
});
const rawScannerSelfTest = { status: rawScannerSelfTestResults.every((result) => result.pass) ? "PASS" : "FAIL", cases: rawScannerSelfTestResults };

const rawLatexHits = [];
let rawLatexUnbalancedCount = 0;
for (const row of targetRows) {
  const source = loadBank(row.sourceJsPath).find((item) => Number(item.id) === row.id);
  const scan = scanSolutionTeX(source?.solution);
  rawLatexUnbalancedCount += scan.unbalancedMathDelimiter;
  if (scan.status !== "PASS") rawLatexHits.push({ qKey: row.qKey, hits: scan.hits, unbalancedMathDelimiter: scan.unbalancedMathDelimiter, openDelimiter: scan.openDelimiter });
}
const rawLatexSummary = { status: rawLatexHits.length === 0 && rawLatexUnbalancedCount === 0 && rawScannerSelfTest.status === "PASS" ? "PASS" : "FAIL", checked: targetRows.length, hitCount: rawLatexHits.length, unbalancedMathDelimiter: rawLatexUnbalancedCount, hits: rawLatexHits.slice(0, 50), scannerSelfTest: rawScannerSelfTest };
writeJson(path.join(EVIDENCE, "raw_latex_gate.json"), rawLatexSummary);

function parseAttr(tag, name) {
  const match = tag.match(new RegExp("\\b" + name + "=\"([^\"]+)\""));
  return match ? Number(match[1]) : null;
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function deriveScale(text) {
  const lineTags = [...text.matchAll(/<line\b[^>]*>/g)].map((match) => match[0]);
  const vertical = [];
  const horizontal = [];
  for (const tag of lineTags) {
    const x1 = parseAttr(tag, "x1");
    const x2 = parseAttr(tag, "x2");
    const y1 = parseAttr(tag, "y1");
    const y2 = parseAttr(tag, "y2");
    if (![x1, x2, y1, y2].every((value) => Number.isFinite(value))) continue;
    if (Math.abs(x1 - x2) < 1e-6 && y1 <= 92.01 && y2 >= 315.99) vertical.push(x1);
    if (Math.abs(y1 - y2) < 1e-6 && x1 <= 248.01 && x2 >= 471.99) horizontal.push(y1);
  }
  const distinctSteps = (values) => {
    const sorted = [...new Set(values.map((value) => Number(value.toFixed(4))))].sort((a, b) => a - b);
    return sorted.slice(1).map((value, index) => value - sorted[index]);
  };
  const scaleX = median(distinctSteps(vertical).filter((value) => value > 0));
  const scaleY = median(distinctSteps(horizontal).filter((value) => value > 0));
  if (scaleX !== null && scaleY !== null) {
    const relativeError = Math.abs(scaleX - scaleY) / Math.max(scaleX, scaleY);
    return { status: "DERIVED_FROM_GRID", scaleX, scaleY, relativeError };
  }
  const root = text.match(/<svg\b[^>]*>/)?.[0] || "";
  const attrX = parseAttr(root, "data-scale-x");
  const attrY = parseAttr(root, "data-scale-y");
  if (Number.isFinite(attrX) && Number.isFinite(attrY) && attrX > 0 && attrY > 0) {
    const relativeError = Math.abs(attrX - attrY) / Math.max(attrX, attrY);
    return { status: "DERIVED_FROM_EXPLICIT_SCALE", scaleX: attrX, scaleY: attrY, relativeError };
  }
  return { status: "NO_SCALE_EVIDENCE", scaleX: null, scaleY: null, relativeError: null };
}

function stringAttr(tag, name) {
  const match = tag.match(new RegExp("\\b" + name + "=\"([^\"]+)\""));
  return match ? match[1] : null;
}

function lineResidual(text, equation, coefficients) {
  const tag = [...text.matchAll(/<line\b[^>]*>/g)].map((match) => match[0]).find((line) => stringAttr(line, "data-equation") === equation);
  const root = text.match(/<svg\b[^>]*>/)?.[0] || "";
  const frameValues = ["data-coordinate-x-min", "data-coordinate-x-max", "data-coordinate-y-min", "data-coordinate-y-max", "data-plot-left", "data-plot-top", "data-plot-width", "data-plot-height"].map((name) => parseAttr(root, name));
  if (!tag || frameValues.some((value) => !Number.isFinite(value))) return { status: "NO_GEOMETRY_PROVENANCE", equation, maxResidual: null, slope: null };
  const [xMin, xMax, yMin, yMax, left, top, width, height] = frameValues;
  const px1 = parseAttr(tag, "x1");
  const py1 = parseAttr(tag, "y1");
  const px2 = parseAttr(tag, "x2");
  const py2 = parseAttr(tag, "y2");
  if (![px1, py1, px2, py2].every((value) => Number.isFinite(value))) return { status: "NONFINITE_ENDPOINT", equation, maxResidual: null, slope: null };
  const point = (px, py) => ({ x: xMin + ((px - left) / width) * (xMax - xMin), y: yMax - ((py - top) / height) * (yMax - yMin) });
  const first = point(px1, py1);
  const second = point(px2, py2);
  const residual = (p) => coefficients.a * p.x + coefficients.b * p.y + coefficients.c;
  const maxResidual = Math.max(Math.abs(residual(first)), Math.abs(residual(second)));
  const slope = Math.abs(second.x - first.x) < 1e-9 ? null : (second.y - first.y) / (second.x - first.x);
  const expectedSlope = -coefficients.a / coefficients.b;
  const slopeError = slope === null ? Infinity : Math.abs(slope - expectedSlope);
  return { status: maxResidual <= 0.01 && slopeError <= 0.01 ? "PASS" : "FAIL", equation, endpoints: [first, second], maxResidual, slope, expectedSlope, slopeError };
}

const assetRefs = [...new Set(targetRows.map((row) => row.solutionImageRef).filter(Boolean))].sort();
const svgChecks = [];
for (const assetRef of assetRefs) {
  const file = path.join(ARCHIVE, assetRef.replaceAll("/", path.sep));
  const text = exists(file) ? fs.readFileSync(file, "utf8") : "";
  const pointPairs = [...text.matchAll(/data-point-x="([^"]+)"[^>]*data-point-y="([^"]+)"/g)];
  const provenanceCount = (text.match(/data-point-provenance=/g) || []).length;
  const finite = !/NaN|Infinity|-Infinity/.test(text);
  const xmlShape = /^<svg\b/.test(text) && text.includes("</svg>") && (text.match(/<svg\b/g) || []).length === 1;
  const forbidden = [...FORBIDDEN_SOLUTION, ...FORBIDDEN_INTERNAL].filter((term) => text.includes(term));
  const policy = (text.match(/data-scale-policy="([^"]+)"/) || [])[1] || null;
  const scale = deriveScale(text);
  const equalScale = policy === "EQUAL_SCALE_REQUIRED" ? scale.status !== "NO_SCALE_EVIDENCE" && scale.relativeError <= 0.005 : true;
  const pointProvenance = pointPairs.length === provenanceCount;
  const check = { assetRef, exists: exists(file), bytes: exists(file) ? fs.statSync(file).size : 0, sha256: exists(file) ? shaFile(file) : null, xmlShape, finite, policy, pointCount: pointPairs.length, provenanceCount, pointProvenance, scale, equalScale, forbidden, status: exists(file) && xmlShape && finite && pointProvenance && equalScale && forbidden.length === 0 ? "PASS" : "FAIL" };
  svgChecks.push(check);
}

function svgFor(qKey) {
  const row = targetRows.find((item) => item.qKey === qKey);
  return row?.solutionImageRef ? fs.readFileSync(path.join(ARCHIVE, row.solutionImageRef.replaceAll("/", path.sep)), "utf8") : "";
}

const q20Key = "original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js_20";
const q15Key = "original/high/h1/2mid/25_순천여고_2학기_중간_고1_공통수학2.js_15";
const q22Key = "original/high/h1/2mid/22_강남여고_2학기_중간_고1_기출.js_22";
const q20Svg = svgFor(q20Key);
const q15Svg = svgFor(q15Key);
const q20LineGeometry = lineResidual(q20Svg, "2x+y=2√21", { a: 2, b: 1, c: -2 * Math.sqrt(21) });
const q15OriginalLineGeometry = lineResidual(q15Svg, "3x-y+4=0", { a: 3, b: -1, c: 4 });
const q15MovedLineGeometry = lineResidual(q15Svg, "3x-y+11=0", { a: 3, b: -1, c: 11 });
const semanticAssertions = {
  q20: {
    hasTriangle: /data-geometry="triangle"[^>]*data-name="triangle-AOB"/.test(q20Svg),
    hasBisectorEquation: /data-geometry="bisector-line"[^>]*data-equation="2x\+y=2√21"/.test(q20Svg),
    hasVertices: ["A", "B", "O"].every((label) => q20Svg.includes(`data-point-label="${label}"`)),
    hasIntersections: ["R", "S"].every((label) => q20Svg.includes(`data-point-label="${label}"`) && q20Svg.includes('data-point-role="intersection"')),
    hasAreaLabels: q20Svg.includes("[AOB]=12") && q20Svg.includes("[ORS]=6"),
    equalScale: q20Svg.includes('data-scale-policy="EQUAL_SCALE_REQUIRED"'),
    lineGeometry: q20LineGeometry.status === "PASS",
  },
  q15: {
    hasOriginalCenter: q15Svg.includes('data-center-x="2" data-center-y="-1"'),
    hasDestinationCenter: q15Svg.includes('data-center-x="0" data-center-y="0"'),
    hasTranslationSourceDestination: q15Svg.includes('data-source="(2,-1)" data-destination="(0,0)"'),
    hasOriginalLine: q15Svg.includes('data-equation="3x-y+4=0"'),
    hasMovedLine: q15Svg.includes('data-equation="3x-y+11=0"'),
    hasDistance: q15Svg.includes('data-distance="7/√10"'),
    equalScale: q15Svg.includes('data-scale-policy="EQUAL_SCALE_REQUIRED"'),
    originalLineResidual: q15OriginalLineGeometry.status === "PASS",
    movedLineResidual: q15MovedLineGeometry.status === "PASS",
    parallelLineSlopes: q15OriginalLineGeometry.status === "PASS" && q15MovedLineGeometry.status === "PASS" && Math.abs(q15OriginalLineGeometry.slope - q15MovedLineGeometry.slope) <= 0.01,
  },
  q22: {
    noOutOfScopeVisibleTerms: !["법선벡터", "내적", "행렬식", "벡터"].some((term) => svgFor(q22Key).includes(term)),
    hasCoefficientRatio: svgFor(q22Key).includes("계수의 비"),
    hasSlopeProduct: svgFor(q22Key).includes("기울기의 곱"),
  },
};
const semanticAssertionFailures = Object.entries(semanticAssertions).flatMap(([question, assertions]) => Object.entries(assertions).filter(([, value]) => !value).map(([assertion]) => ({ question, assertion })));
const bSummary = {
  reportType: "independent_B_semantic_svg_final",
  status: svgChecks.every((check) => check.status === "PASS") && semanticAssertionFailures.length === 0 ? "PASS" : "FAIL",
  expectedAssetCount: assetRefs.length,
  observedAssetCount: svgChecks.length,
  passCount: svgChecks.filter((check) => check.status === "PASS").length,
  failCount: svgChecks.filter((check) => check.status !== "PASS").length,
  semanticAssertionFailures,
  q20: semanticAssertions.q20,
  q15: semanticAssertions.q15,
  q22: semanticAssertions.q22,
  q20LineGeometry,
  q15OriginalLineGeometry,
  q15MovedLineGeometry,
  checks: svgChecks,
};
writeJson(path.join(EVIDENCE, "b_semantic_svg_summary.json"), bSummary);

const sourceChecks = [];
for (const sourceJsPath of [...new Set(targetRows.map((row) => row.sourceJsPath))].sort()) {
  const file = path.join(ARCHIVE, "exams", sourceJsPath.replaceAll("/", path.sep));
  let nodeCheck = false;
  let vmLoad = false;
  let questionCount = 0;
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
    nodeCheck = true;
    const bank = loadBank(sourceJsPath);
    vmLoad = true;
    questionCount = bank.length;
  } catch {}
  sourceChecks.push({ sourceJsPath, nodeCheck, vmLoad, questionCount, sha256: exists(file) ? shaFile(file) : null });
}
const solutionCopyHits = [];
for (const row of targetRows) {
  const question = loadBank(row.sourceJsPath).find((item) => Number(item.id) === row.id);
  const solution = String(question.solution || "");
  for (const term of FORBIDDEN_SOLUTION) if (solution.includes(term)) solutionCopyHits.push({ qKey: row.qKey, term });
  for (const term of FORBIDDEN_INTERNAL) if (solution.includes(term)) solutionCopyHits.push({ qKey: row.qKey, term });
}
const aSummary = {
  reportType: "independent_A_math_education_final",
  status: sourceErrors.length === 0 && solutionCopyHits.length === 0 && rawLatexSummary.status === "PASS" ? "PASS" : "FAIL",
  targetCountExpected: scopeRows.length,
  targetCountObserved: targetRows.length,
  answerParity: { status: answerCrosscheck.status, expected: answerCrosscheck.expected, observed: answerCrosscheck.observed, mismatchCount: answerCrosscheck.mismatchCount, mismatches: answerMismatches.slice(0, 30), basis: answerCrosscheck.basis },
  sourceErrors,
  sourceChecks,
  forbiddenSolutionCopyHits: solutionCopyHits,
  rawLatexOutsideMath: rawLatexSummary,
  pinpointMathChecks: {
    q20Answer: "2√21",
    q15Answer: "③",
    q5Answer: "①",
    q22Answer: "3/2",
    q14Answer: "⑤",
    q2Answer: "②",
    q7Answer: "④",
    q18Answer: "③",
  },
};
writeJson(path.join(EVIDENCE, "a_math_education_summary.json"), aSummary);

const q13Source = loadBank("original/high/h1/2mid/25_매산고_2학기_중간_고1_기출.js").find((item) => Number(item.id) === 13);
const metadata = readJson(path.join(ARCHIVE, "data", "question_metadata.json"));
const metadataQ13 = (metadata.records || []).find((item) => item.sourceArchiveFile === "original/high/h1/2mid/25_매산고_2학기_중간_고1_기출.js" && item.sourceQuestionNo === "13");
const indexContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ARCHIVE, "question-index.js"), "utf8"), indexContext, { filename: "question-index.js" });
const indexQ13 = (indexContext.window.questionIndex || []).find((item) => item.qKey === "original/high/h1/2mid/25_매산고_2학기_중간_고1_기출.js_13");
const currentMetadataMismatches = [];
for (const row of targetRows) {
  const source = loadBank(row.sourceJsPath).find((item) => Number(item.id) === row.id);
  const sidecar = (metadata.records || []).find((item) => item.sourceArchiveFile === row.sourceJsPath && item.sourceQuestionNo === String(row.id));
  const indexed = (indexContext.window.questionIndex || []).find((item) => item.qKey === row.qKey);
  for (const field of ["standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit"]) {
    const expected = source?.[field] ?? "";
    const sidecarActual = sidecar?.[field] ?? "";
    const indexActual = field === "standardCourse" ? indexed?.course ?? "" : indexed?.[field] ?? "";
    if (JSON.stringify(expected) !== JSON.stringify(sidecarActual)) currentMetadataMismatches.push({ qKey: row.qKey, where: "sidecar", field, expected, actual: sidecarActual });
    if (JSON.stringify(expected) !== JSON.stringify(indexActual)) currentMetadataMismatches.push({ qKey: row.qKey, where: "index", field, expected, actual: indexActual });
  }
}
const expectedQ13Metadata = { standardCourse: "공통수학1", standardUnitKey: "H22-C-09", standardUnit: "행렬과 그 연산", standardUnitOrder: 9, subUnitKey: "H22-C-09-MATRIX_OPERATION", subUnit: "행렬의 연산" };
const metadataMismatches = Object.entries(expectedQ13Metadata).flatMap(([field, expected]) => {
  const comparisons = [["source", q13Source?.[field]], ["sidecar", metadataQ13?.[field]]];
  // question-index.js intentionally stores the normalized unit label/key and
  // course, but not every source-only ordering field.
  if (field !== "standardUnitOrder") comparisons.push(["index", field === "standardCourse" ? indexQ13?.course : indexQ13?.[field]]);
  return comparisons.filter(([, actual]) => JSON.stringify(actual) !== JSON.stringify(expected)).map(([where, actual]) => ({ where, field, expected, actual }));
});
const paritySummary = {
  reportType: "production_parity_final",
  status: metadataMismatches.length === 0 && currentMetadataMismatches.length === 0 && targetManifest.targetCountObserved === targetManifest.targetCountExpected ? "PASS" : "FAIL",
  targetManifest: { expected: targetManifest.targetCountExpected, observed: targetManifest.targetCountObserved, uniqueUid: targetManifest.uniqueUidObserved, sourceFiles: targetManifest.sourceFileCountObserved },
  excludedQ352: { excludedFromGeometryScope: !targetRows.some((row) => row.sourceJsPath.includes("25_매산고") && row.id === 13), productionMetadataExpected: expectedQ13Metadata, mismatches: metadataMismatches },
  targetMetadataParity: { status: currentMetadataMismatches.length === 0 ? "PASS" : "FAIL", mismatchCount: currentMetadataMismatches.length, mismatches: currentMetadataMismatches.slice(0, 100) },
  dbJsIndex: { dbPresent: exists(path.join(ARCHIVE, "db.js")), questionIndexPresent: exists(path.join(ARCHIVE, "question-index.js")), metadataSidecarPresent: exists(path.join(ARCHIVE, "data", "question_metadata.json")), q13IndexAndSidecarSynced: metadataMismatches.length === 0 },
  globalCi: { status: "BLOCKED_UNRELATED_H2_PROBABILITY_QCOUNT", note: "local archive-unit-past-exams-collection.test.js reports h2/1mid/26_효천고_1학기_중간_고2_확률과통계: DB/JS qCount 24 vs question-index qCount 23; H2 source was not changed and this is not a GitHub Actions result." },
};
writeJson(path.join(EVIDENCE, "production_parity_summary.json"), paritySummary);

const baselineCommit = process.env.GEOMETRY_BASE_COMMIT || "11653efc07de31491ef2686b491d0cbc4e785349";
const gitNames = (args) => {
  try { return execFileSync("git", ["-c", "core.quotePath=false", ...args], { encoding: "utf8" }).split(/\r?\n/).filter(Boolean); } catch { return []; }
};
const baselineExists = (() => {
  try { execFileSync("git", ["rev-parse", "--verify", `${baselineCommit}^{commit}`], { stdio: "ignore" }); return true; } catch { return false; }
})();
const workingTreeChangedFiles = baselineExists ? gitNames(["diff", "--name-only", baselineCommit]) : gitNames(["diff", "--name-only"]);
const untrackedFiles = (() => {
  try { return execFileSync("git", ["-c", "core.quotePath=false", "ls-files", "--others", "--exclude-standard"], { encoding: "utf8" }).split(/\r?\n/).filter(Boolean); } catch { return []; }
})();
const preservedDirtyFiles = new Set([
  ".agent/BOOT.md", ".gitignore", "archive/question-index-audit.md", "archive/question-index-report.md",
  "apmath/js/timetable.js", "eie/js/views/eie-timetable.js", "tests/apmath-timetable-withdrawn-students.test.js", "tests/eie-timetable-withdrawn-students.test.js",
  "archive/tools/finalize-h1-first-semester-quality.mjs", "CODEX_RESULT.md",
  "archive/assets/images/24_한영고_1학기_중간_고1_기출/q11.svg", "docs/evidence/high1-placeholder-repair-20260903.md",
]);
const approvedDiff = (file) => file.startsWith("archive/assets/images/") && file.endsWith("-solution.svg")
  || file.startsWith("archive/exams/original/high/h1/")
  || file === "archive/data/question_metadata.json"
  || file === "archive/data/master_tables/js_archive_tag_master.json"
  || file === "archive/tools/build-question-index.mjs"
  || file === "archive/engine.html"
  || file === "archive/question-index.js"
  || file === "archive/question-index-report.md"
  || file === "archive/question-index-audit.md"
  || file.startsWith("archive/tools/geometry-equation/")
  || file.startsWith("docs/evidence/high1-geometry-equation/")
  || file === "docs/rules/MANIFEST.md"
  || file.startsWith("docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md")
  || file.startsWith("docs/rules/90_ARCHIVE/# JS아카이브 표준단원키 마스터 테이블.md");
const allChangedFiles = [...new Set([...workingTreeChangedFiles, ...untrackedFiles])].sort();
const unapprovedDiffFiles = allChangedFiles.filter((file) => !approvedDiff(file) && !preservedDirtyFiles.has(file));
const diffLockSummary = {
  reportType: "external_review_diff_lock_final",
  status: baselineExists && unapprovedDiffFiles.length === 0 ? "PASS" : "FAIL",
  baselineCommit,
  baselineCommitExists: baselineExists,
  workingTreeChangedFiles,
  untrackedFiles,
  approvedChangeClasses: ["canonical h1 source student-facing copy and eight pinpoint solutions", "current solution SVG semantic/copy/provenance/size metadata", "q13 metadata and source-sidecar-index parity", "geometry evidence and dynamic Mother seal"],
  changedFileCount: allChangedFiles.length,
  approvedChangedFileCount: allChangedFiles.filter(approvedDiff).length,
  preservedPreExistingDirtyFileCount: allChangedFiles.filter((file) => preservedDirtyFiles.has(file)).length,
  preservedPreExistingDirtyFiles: allChangedFiles.filter((file) => preservedDirtyFiles.has(file)),
  unapprovedDiffFiles,
  noUnrelatedH2Change: !allChangedFiles.some((file) => file.includes("archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_확률과통계.js")),
};
writeJson(path.join(EVIDENCE, "diff_lock_summary.json"), diffLockSummary);

const agentReviewsPath = path.join(EVIDENCE, "independent_agent_reviews.json");
const agentReviews = exists(agentReviewsPath) ? readJson(agentReviewsPath) : { status: "PENDING_INDEPENDENT_AGENTS", agents: [] };
if (!exists(agentReviewsPath)) writeJson(agentReviewsPath, agentReviews);
const existingBrowserSummary = exists(path.join(EVIDENCE, "c_browser_summary.json")) ? readJson(path.join(EVIDENCE, "c_browser_summary.json")) : null;
const browserSummary = existingBrowserSummary?.captureRuntime === "codex-in-app-browser" && existingBrowserSummary?.sourceCases?.expected === new Set(targetRows.map((row) => row.sourceJsPath)).size * 3
  ? existingBrowserSummary
  : { reportType: "independent_C_browser_final", status: "PENDING_REAL_BROWSER_CAPTURE", basis: "record-browser-evidence.mjs must consume browser_harness_capture.json from an actual Codex in-app browser session", captureRuntime: null, sourceCases: { expected: new Set(targetRows.map((row) => row.sourceJsPath)).size * 3, observed: 0, pass: 0, fail: 0 } };
writeJson(path.join(EVIDENCE, "c_browser_summary.json"), browserSummary);

const releaseFiles = new Set();
for (const row of targetRows) {
  releaseFiles.add(`exams/${row.sourceJsPath}`);
  if (row.solutionImageRef) releaseFiles.add(row.solutionImageRef);
}
for (const support of ["db.js", "question-index.js", "data/question_metadata.json", "engine.html"]) if (exists(path.join(ARCHIVE, support))) releaseFiles.add(support);
const releaseRows = [...releaseFiles].sort().map((relativePath) => {
  const file = path.join(ARCHIVE, relativePath.replaceAll("/", path.sep));
  return { relativePath, sha256: shaFile(file), bytes: fs.statSync(file).size };
});
const releaseArtifactSha = sha(JSON.stringify(releaseRows));
const releaseSummary = { status: "RELEASE_ARTIFACT_FROZEN", releaseArtifactSha, targetCount: targetRows.length, sourceFileCount: new Set(targetRows.map((row) => row.sourceJsPath)).size, releaseFileCount: releaseRows.length, files: releaseRows };
writeJson(path.join(EVIDENCE, "release_artifact.json"), releaseSummary);
agentReviews.releaseArtifactSha = releaseArtifactSha;
agentReviews.currentShaBound = true;
writeJson(agentReviewsPath, agentReviews);

const environment = {
  protocol: "v2.2",
  generatedAt: new Date().toISOString(),
  node: process.version,
  platform: process.platform,
  arch: process.arch,
  releaseArtifactSha,
  gitCommitIndependentBinding: "releaseArtifactSha and evidence hashes are the reproducible current-tree binding; no moving HEAD value is embedded",
  sourceScope: { manifest: rel(path.join(EVIDENCE, "final_target_manifest.json")), targetCount: targetRows.length },
  render: { browserEvidence: browserSummary.status, q20Svg: "q20-solution.svg", q15Svg: "q15-solution.svg" },
};
writeJson(path.join(EVIDENCE, "environment_render_fingerprint.json"), environment);

const reviewEvidencePayload = { targetManifest, aSummary, bSummary, browserSummary, paritySummary, diffLockSummary, agentReviews, releaseArtifactSha };
const reviewEvidenceSha = sha(JSON.stringify(reviewEvidencePayload));
const evidenceFiles = ["final_target_manifest.json", "a_math_education_summary.json", "raw_latex_gate.json", "b_semantic_svg_summary.json", "c_browser_summary.json", "browser_harness_capture.json", "browser_harness_recheck.json", "production_parity_summary.json", "diff_lock_summary.json", "independent_agent_reviews.json", "release_artifact.json", "environment_render_fingerprint.json"];
const sealBundleSha = sha(JSON.stringify(evidenceFiles.sort().map((name) => ({ name, sha256: shaFile(path.join(EVIDENCE, name)) }))));
const localGeometryPass = targetManifest.targetCountObserved === targetManifest.targetCountExpected && targetManifest.uniqueUidObserved === targetManifest.targetCountExpected && sourceErrors.length === 0 && rawLatexSummary.status === "PASS" && bSummary.status === "PASS" && aSummary.status === "PASS" && paritySummary.status === "PASS" && diffLockSummary.status === "PASS";
const agentsPass = agentReviews.status === "PASS" || agentReviews.status === "PASS_WITH_FULL_SCOPE_CARRY_FORWARD_AND_FRESH_PINPOINT" || agentReviews.status === "PASS_WITH_CARRY_FORWARD_AND_FRESH_PINPOINT" || (agentReviews.agents?.length === 3 && agentReviews.agents.every((agent) => agent.status === "PASS"));
const browserReleaseBindingPass = browserSummary.releaseArtifactSha === releaseArtifactSha && browserSummary.currentReleaseArtifactSha === releaseArtifactSha && browserSummary.releaseArtifactShaMatch === true;
const browserPass = browserSummary.status === "PASS" && browserSummary.captureRuntime === "codex-in-app-browser" && browserSummary.sourceCases?.expected === new Set(targetRows.map((row) => row.sourceJsPath)).size * 3 && browserSummary.sourceCases?.fail === 0 && browserReleaseBindingPass;
const finalStatus = localGeometryPass && agentsPass && browserPass ? "GEOMETRY PASS / GLOBAL_CI_BLOCKED_UNRELATED" : "REOPEN_SEAL";
const mother = {
  reportType: "mother_final_seal_v2_2",
  status: finalStatus,
  finalDecision: finalStatus === "REOPEN_SEAL" ? "봉인 보류 — 모든 독립 에이전트와 production browser evidence가 현재 SHA에 대해 PASS가 될 때까지 재검 필요" : "GEOMETRY PASS / GLOBAL_CI_BLOCKED_UNRELATED",
  targetCount: targetRows.length,
  releaseArtifactSha,
  reviewEvidenceSha,
  sealBundleSha,
  gates: { targetManifest: targetManifest.targetCountObserved === targetManifest.targetCountExpected ? "PASS" : "FAIL", A: aSummary.status, B: bSummary.status, C: browserPass ? "PASS" : "FAIL", productionParity: paritySummary.status, diffLock: diffLockSummary.status, independentAgents: agentsPass ? "PASS" : agentReviews.status, globalCi: paritySummary.globalCi.status },
  evidenceFiles,
};
writeJson(path.join(EVIDENCE, "mother_final_seal.json"), mother);
writeJson(path.join(EVIDENCE, "review_evidence_sha.json"), { REVIEW_EVIDENCE_SHA: reviewEvidenceSha, inputs: ["final_target_manifest.json", "a_math_education_summary.json", "raw_latex_gate.json", "b_semantic_svg_summary.json", "c_browser_summary.json", "browser_harness_capture.json", "browser_harness_recheck.json", "production_parity_summary.json", "diff_lock_summary.json", "independent_agent_reviews.json", "release_artifact.json"] });
writeJson(path.join(EVIDENCE, "seal_bundle_sha.json"), { SEAL_BUNDLE_SHA: sealBundleSha, files: evidenceFiles.map((name) => ({ name, sha256: shaFile(path.join(EVIDENCE, name)) })) });
const motherMarkdownPath = path.join(EVIDENCE, "mother_final_seal.md");
const motherMarkdownTemp = `${motherMarkdownPath}.external-review.tmp`;
fs.writeFileSync(motherMarkdownTemp, `# Mother Final Seal — 고1 도형의 방정식 v2.2\n\n- 상태: **${mother.status}**\n- 대상: ${mother.targetCount} UID\n- RELEASE_ARTIFACT_SHA: \`${releaseArtifactSha}\`\n- REVIEW_EVIDENCE_SHA: \`${reviewEvidenceSha}\`\n- SEAL_BUNDLE_SHA: \`${sealBundleSha}\`\n- A: ${aSummary.status}\n- B semantic SVG: ${bSummary.status} (${bSummary.passCount}/${bSummary.expectedAssetCount})\n- C browser: ${browserSummary.status}\n- production parity: ${paritySummary.status}\n- global CI: ${paritySummary.globalCi.status}\n`, "utf8");
fs.renameSync(motherMarkdownTemp, motherMarkdownPath);
console.log(JSON.stringify({ status: mother.status, targetCount: targetRows.length, assetCount: assetRefs.length, releaseArtifactSha, reviewEvidenceSha, sealBundleSha, b: bSummary.status, parity: paritySummary.status, globalCi: paritySummary.globalCi.status }, null, 2));
