// 중등 문항별 중단원 지정표 변환·검증 도구.
//
//   node archive/tools/build-middle-parent-assignments.mjs --ledger <final.jsonl> [--unresolved <out.jsonl>]
//       판정 원장(한 줄에 한 문항, final.jsonl 형식)을 읽어 지정표(archive/data/archive2-middle-parent-assignments.json)를 쓴다.
//       정본 키로 바로 정해진 것과, OTHER_BIG_UNIT 중 suggestBigUnit/suggestParent 이름이 같은 학년의 정본 중단원 하나와
//       정확히 일치하는 것만 넣는다. 하나로 안 풀리는 것은 추정하지 않고 지정표에 넣지 않으며 unresolved로 따로 낸다.
//       NOT_IN_2022는 지정표에 넣지 않는다(예전처럼 "중단원 미지정"에 남는다).
//   node archive/tools/build-middle-parent-assignments.mjs --check
//       지금 지정표 파일을 검증한다: 정본 중단원 키, 카탈로그에 있는 uid, 중복 없음, 학년 일치. 본문 지문이 바뀐 문항 수도 알린다
//       (그 문항은 카탈로그 빌더가 지정표를 쓰지 않는다).
//
// 판정 원장(final.jsonl)은 근거이며 용량이 커서 Git에 넣지 않는다(docs/agents/git-evidence.md). 지정표 basis에 원장의 sha256만 남긴다.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import core from "../archive2-core.js";
import {
  ASSIGNMENTS_RELATIVE_PATH,
  buildAssignmentsDocument,
  loadToc,
  sha256,
  validateAssignments,
} from "./middle-parent-assignments-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const option = (name) => { const at = args.indexOf(name); return at < 0 ? "" : String(args[at + 1] || ""); };
const target = path.join(root, ASSIGNMENTS_RELATIVE_PATH);

const catalog = core.decodeCatalog(JSON.parse(fs.readFileSync(path.join(root, "archive/data/archive2-catalog.json"), "utf8")));
const catalogByUid = new Map(catalog.records.map((record) => [record.questionUid, record]));
const toc = loadToc();

if (args.includes("--check") || !option("--ledger")) {
  if (!fs.existsSync(target)) throw new Error(`지정표가 없습니다: ${ASSIGNMENTS_RELATIVE_PATH}`);
  const doc = JSON.parse(fs.readFileSync(target, "utf8"));
  const result = validateAssignments(doc, { toc, catalogByUid });
  console.log(JSON.stringify({ rows: result.rows, errors: result.errors.length, staleFingerprint: result.stale.length }, null, 2));
  if (result.errors.length) {
    console.error(result.errors.slice(0, 20).join("\n"));
    process.exit(1);
  }
  process.exit(0);
}

const ledgerPath = path.resolve(option("--ledger"));
const ledgerText = fs.readFileSync(ledgerPath, "utf8");
const ledgerRows = ledgerText.split("\n").filter(Boolean).map((line) => JSON.parse(line));
const { doc, unresolved, skipped } = buildAssignmentsDocument(ledgerRows, {
  catalogByUid,
  toc,
  basis: {
    judgedCommit: "2a6574a4f3ac2b3e968898db2de7abee6c113e92",
    method: "문항 하나씩 읽고 중단원 판정: 1차, 독립 2차, 불일치는 최종 판정",
    ledgerSha256: sha256(ledgerText),
    ledgerRows: ledgerRows.length,
  },
});
const check = validateAssignments(doc, { toc, catalogByUid });
if (check.errors.length) throw new Error(`생성한 지정표가 검증을 통과하지 못했습니다: ${check.errors.slice(0, 5).join("; ")}`);
fs.writeFileSync(target, JSON.stringify(doc) + "\n");
const byReason = {};
for (const row of unresolved) byReason[row.reason] = (byReason[row.reason] || 0) + 1;
if (option("--unresolved"))
  fs.writeFileSync(path.resolve(option("--unresolved")), unresolved.map((row) => JSON.stringify(row)).join("\n") + (unresolved.length ? "\n" : ""));
console.log(JSON.stringify({ ledgerRows: ledgerRows.length, assigned: doc.rows.length, notIn2022: skipped.notIn2022, unresolved: unresolved.length, unresolvedByReason: byReason }, null, 2));
