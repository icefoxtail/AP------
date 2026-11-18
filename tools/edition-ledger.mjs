#!/usr/bin/env node
// 판본 장부(edition ledger) 형식·검증·조회 도구. Node 내장만 쓴다. 추가 전용 장부이다.
//
// 장부는 "이 새 판본은 승인된 판본과 같은 것으로 본다"를 적는 곳이다. 승인 기록(영수증·4칸·UI 승인 proof)은 봉인이라
// 고칠 수 없으므로, 그 위에 행만 덧붙인다. 기존 행은 고치거나 지우거나 순서를 바꾸지 않는다.
// 이 파일(A1)은 형식과 검증만 둔다. 소비자(A2 렌더러 재촬영 결속, A3 소스 판본 결속)는 아직 없다.
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { BINDING_FIELDS, isOutsideBindingField } = require("../archive/question-field-layers.js");

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(HERE, "..");
export const LEDGER_PATH = "docs/operations/edition-ledger/ledger-v1.json";
export const SCHEMA_VERSION = 1;
export const KINDS = Object.freeze(["renderer", "source"]);
export const EVIDENCE_TYPES = Object.freeze(["PNG_BYTE_IDENTICAL", "SCREEN_JUDGMENT"]);
export const BINDING_VERSIONS = Object.freeze(["text-v1"]);

export class LedgerError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

const SHA1 = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;
const FIELD_NAME = /^[A-Za-z][A-Za-z0-9_]*$/;
const FINGERPRINT = /^[0-9a-f]{16,64}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

// ---- 행의 정규형(고정 키 순서) ----------------------------------------------------------------
// 정규형: 알려진 키만, 아래 순서로, 값이 없는 선택 키는 생략. 직렬화는 이 정규형만 만든다.
const ENVELOPE_HEAD = ["kind", "id"];
const ENVELOPE_TAIL = ["addedAt", "addedByPr", "note"];
const BODY_KEYS = {
  renderer: ["path", "sealed", "edition", "evidence"],
  source: ["path", "questionKey", "sealed", "edition", "binding", "changedFields"]
};
const NESTED_KEYS = {
  "renderer.sealed": ["gitBlobSha1", "sha256", "bytes"],
  "renderer.edition": ["gitBlobSha1", "sha256", "bytes"],
  "renderer.evidence": ["type", "ref", "judgedBy"],
  "source.sealed": ["gitBlobSha1"],
  "source.edition": ["gitBlobSha1"],
  "source.binding": ["version", "fingerprint"]
};

function pickKeys(obj, keys) {
  const out = {};
  for (const key of keys) if (obj[key] !== undefined) out[key] = obj[key];
  return out;
}

export function canonicalRow(row) {
  const kind = row?.kind;
  if (!BODY_KEYS[kind]) return row; // 모르는 kind 는 validate 가 거절한다.
  const out = {};
  for (const key of ENVELOPE_HEAD) if (row[key] !== undefined) out[key] = row[key];
  for (const key of BODY_KEYS[kind]) {
    if (row[key] === undefined) continue;
    const nested = NESTED_KEYS[`${kind}.${key}`];
    out[key] = nested && row[key] && typeof row[key] === "object" && !Array.isArray(row[key]) ? pickKeys(row[key], nested) : row[key];
  }
  for (const key of ENVELOPE_TAIL) if (row[key] !== undefined) out[key] = row[key];
  return out;
}

// id = sha256(kind|path|questionKey|sealed|edition) 앞 16자. sealed/edition 은 정규형 JSON 문자열로 넣는다.
export function computeRowId(row) {
  const nested = key => JSON.stringify(pickKeys(row?.[key] ?? {}, NESTED_KEYS[`${row?.kind}.${key}`] ?? []));
  const text = [row?.kind ?? "", row?.path ?? "", row?.questionKey ?? "", nested("sealed"), nested("edition")].join("|");
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

// ---- 직렬화·파싱 ----------------------------------------------------------------------------------
// 행 하나가 한 줄. 첫 줄 `{"schemaVersion":1,"rows":[`, 행은 2칸 들여쓰기 후 JSON, 마지막 줄 `]}`, 끝 개행.
// 빈 장부는 `{"schemaVersion":1,"rows":[]}` 한 줄.
export function serializeLedger(obj) {
  const rows = (obj?.rows ?? []).map(canonicalRow);
  const head = `{"schemaVersion":${JSON.stringify(obj?.schemaVersion)},"rows":[`;
  if (rows.length === 0) return `${head}]}\n`;
  return `${head}\n${rows.map(row => `  ${JSON.stringify(row)}`).join(",\n")}\n]}\n`;
}

export function parseLedger(text) {
  if (typeof text !== "string") throw new LedgerError("PARSE_NOT_TEXT", "ledger text must be a string");
  let obj;
  try {
    obj = JSON.parse(text);
  } catch (error) {
    throw new LedgerError("PARSE_JSON", `ledger is not valid JSON: ${error.message}`);
  }
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) throw new LedgerError("PARSE_SHAPE", "ledger must be a JSON object");
  return obj;
}

// ---- 검증 ----------------------------------------------------------------------------------------
function err(errors, code, message, row, index) {
  errors.push({ code, message, rowId: typeof row?.id === "string" ? row.id : null, index: index ?? null });
}

const isObj = value => value && typeof value === "object" && !Array.isArray(value);
const isStr = value => typeof value === "string" && value.length > 0;
// 필수 문자열 필드: 앞뒤 공백이 없고 trim 뒤에도 비지 않아야 한다(공백뿐인 값이 "있는 값"으로 통과하지 않게).
const isCleanStr = value => typeof value === "string" && value.length > 0 && value.trim() === value;

function exactKeys(errors, value, allowed, required, where, row, index) {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) err(errors, "UNKNOWN_FIELD", `${where}: unknown key "${key}"`, row, index);
  }
  for (const key of required) {
    if (value[key] === undefined) err(errors, "MISSING_FIELD", `${where}: missing "${key}"`, row, index);
  }
}

function validDate(text) {
  if (!DATE.test(text)) return false;
  const date = new Date(`${text}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === text;
}

function validPath(text) {
  return isCleanStr(text) && !text.startsWith("/") && !text.includes("\\") && !text.split("/").some(part => part === ".." || part === "" || part === ".");
}

function validateBlob(errors, value, where, row, index, { sha256 = false } = {}) {
  if (!isObj(value)) return err(errors, "BAD_FIELD", `${where}: must be an object`, row, index);
  if (!SHA1.test(value.gitBlobSha1 ?? "")) err(errors, "BAD_FIELD", `${where}.gitBlobSha1 must be 40 hex`, row, index);
  if (sha256) {
    if (!SHA256.test(value.sha256 ?? "")) err(errors, "BAD_FIELD", `${where}.sha256 must be 64 hex`, row, index);
    if (!Number.isInteger(value.bytes) || value.bytes < 0) err(errors, "BAD_FIELD", `${where}.bytes must be a non-negative integer`, row, index);
  }
}

function validateRow(errors, row, index) {
  if (!isObj(row)) return err(errors, "BAD_ROW", "row must be an object", row, index);
  if (!KINDS.includes(row.kind)) return err(errors, "UNKNOWN_KIND", `unknown kind "${row.kind}"`, row, index);
  const kind = row.kind;
  exactKeys(errors, row, [...ENVELOPE_HEAD, ...BODY_KEYS[kind], ...ENVELOPE_TAIL], [...ENVELOPE_HEAD, ...BODY_KEYS[kind], "addedAt"], `row ${index}`, row, index);
  if (!isCleanStr(row.id)) err(errors, "BAD_FIELD", "id must be a non-empty string without surrounding whitespace", row, index);
  if (!validDate(row.addedAt ?? "")) err(errors, "BAD_FIELD", "addedAt must be a valid YYYY-MM-DD date", row, index);
  if (row.addedByPr !== undefined && (!Number.isInteger(row.addedByPr) || row.addedByPr <= 0)) err(errors, "BAD_FIELD", "addedByPr must be a positive integer", row, index);
  if (row.note !== undefined && !isCleanStr(row.note)) err(errors, "BAD_FIELD", "note, when present, must be a non-empty string without surrounding whitespace", row, index);
  if (!validPath(row.path)) err(errors, "BAD_FIELD", "path must be a repo-relative path with forward slashes", row, index);

  if (kind === "renderer") {
    validateBlob(errors, row.sealed, "sealed", row, index, { sha256: true });
    validateBlob(errors, row.edition, "edition", row, index, { sha256: true });
    if (isObj(row.sealed) && isObj(row.edition) && row.sealed.gitBlobSha1 === row.edition.gitBlobSha1) {
      err(errors, "EDITION_EQUALS_SEALED", "edition must differ from sealed", row, index);
    }
    if (isObj(row.sealed)) exactKeys(errors, row.sealed, NESTED_KEYS["renderer.sealed"], NESTED_KEYS["renderer.sealed"], "sealed", row, index);
    if (isObj(row.edition)) exactKeys(errors, row.edition, NESTED_KEYS["renderer.edition"], NESTED_KEYS["renderer.edition"], "edition", row, index);
    const evidence = row.evidence;
    if (!isObj(evidence)) err(errors, "BAD_FIELD", "evidence must be an object", row, index);
    else {
      exactKeys(errors, evidence, NESTED_KEYS["renderer.evidence"], ["type", "ref"], "evidence", row, index);
      if (!EVIDENCE_TYPES.includes(evidence.type)) err(errors, "BAD_EVIDENCE_TYPE", `evidence.type must be one of ${EVIDENCE_TYPES.join("|")}`, row, index);
      if (!validPath(evidence.ref)) err(errors, "BAD_FIELD", "evidence.ref must be a repo-relative path", row, index);
      const blankJudge = typeof evidence.judgedBy !== "string" || evidence.judgedBy.trim() === "";
      if (evidence.type === "SCREEN_JUDGMENT" && blankJudge) err(errors, "MISSING_JUDGED_BY", "SCREEN_JUDGMENT requires a non-blank evidence.judgedBy", row, index);
      else if (evidence.judgedBy !== undefined && !isCleanStr(evidence.judgedBy)) err(errors, "BAD_FIELD", "evidence.judgedBy must be a non-empty string without surrounding whitespace", row, index);
    }
  } else {
    if (!isCleanStr(row.questionKey)) err(errors, "BAD_FIELD", "questionKey must be a non-empty string without surrounding whitespace", row, index);
    validateBlob(errors, row.sealed, "sealed", row, index);
    validateBlob(errors, row.edition, "edition", row, index);
    if (isObj(row.sealed) && isObj(row.edition) && row.sealed.gitBlobSha1 === row.edition.gitBlobSha1) {
      err(errors, "EDITION_EQUALS_SEALED", "edition must differ from sealed", row, index);
    }
    if (isObj(row.sealed)) exactKeys(errors, row.sealed, NESTED_KEYS["source.sealed"], NESTED_KEYS["source.sealed"], "sealed", row, index);
    if (isObj(row.edition)) exactKeys(errors, row.edition, NESTED_KEYS["source.edition"], NESTED_KEYS["source.edition"], "edition", row, index);
    const binding = row.binding;
    if (!isObj(binding)) err(errors, "BAD_FIELD", "binding must be an object", row, index);
    else {
      exactKeys(errors, binding, NESTED_KEYS["source.binding"], NESTED_KEYS["source.binding"], "binding", row, index);
      if (!BINDING_VERSIONS.includes(binding.version)) err(errors, "BAD_BINDING_VERSION", `binding.version must be one of ${BINDING_VERSIONS.join("|")}`, row, index);
      if (!FINGERPRINT.test(binding.fingerprint ?? "")) err(errors, "BAD_FIELD", "binding.fingerprint must be 16-64 hex", row, index);
    }
    const fields = row.changedFields;
    if (!Array.isArray(fields) || fields.length === 0) err(errors, "BAD_FIELD", "changedFields must be a non-empty array", row, index);
    else {
      if (new Set(fields).size !== fields.length) err(errors, "BAD_FIELD", "changedFields must not repeat a name", row, index);
      // 이 목록은 자기 신고이고 실질 방어선은 binding.fingerprint 대조(A3)이다. 여기서는 이름 형식과 결속 필드 이름(대소문자·전각 변형 포함)만 거른다.
      const bindingLower = new Set(BINDING_FIELDS.map(field => field.toLowerCase()));
      for (const name of fields) {
        if (typeof name !== "string" || !FIELD_NAME.test(name)) err(errors, "BAD_FIELD", `changedFields entry ${JSON.stringify(name)} must match ${FIELD_NAME}`, row, index);
        else if (!isOutsideBindingField(name) || bindingLower.has(name.normalize("NFKC").toLowerCase())) {
          err(errors, "CHANGED_BINDING_FIELD", `changedFields has "${name}", a binding field (${BINDING_FIELDS.join("|")}); a stem or choice change needs a human re-judgment, not a ledger row`, row, index);
        }
      }
    }
  }

  if (isStr(row.id) && row.id !== computeRowId(row)) err(errors, "ID_MISMATCH", `id does not match the row contents (expected ${computeRowId(row)})`, row, index);
}

// opts.text 가 있으면 파일이 정규형 직렬화와 글자 그대로 같은지도 본다.
export function validateLedger(obj, opts = {}) {
  const errors = [];
  if (!isObj(obj)) {
    err(errors, "BAD_LEDGER", "ledger must be an object");
    return { ok: false, errors };
  }
  exactKeys(errors, obj, ["schemaVersion", "rows"], ["schemaVersion", "rows"], "ledger", null, null);
  if (obj.schemaVersion !== SCHEMA_VERSION) err(errors, "BAD_SCHEMA_VERSION", `schemaVersion must be ${SCHEMA_VERSION}`);
  if (!Array.isArray(obj.rows)) {
    err(errors, "BAD_LEDGER", "rows must be an array");
    return { ok: false, errors };
  }
  const seen = new Map();
  obj.rows.forEach((row, index) => {
    validateRow(errors, row, index);
    if (isStr(row?.id)) {
      if (seen.has(row.id)) err(errors, "DUPLICATE_ID", `id also used by row ${seen.get(row.id)}`, row, index);
      else seen.set(row.id, index);
    }
  });
  if (typeof opts.text === "string" && errors.length === 0 && opts.text !== serializeLedger(obj)) {
    err(errors, "NOT_CANONICAL", "file text is not the canonical serialization (fixed key order, one row per line, trailing newline); rewrite with serializeLedger");
  }
  return { ok: errors.length === 0, errors };
}

// ---- 추가 전용 대조 ---------------------------------------------------------------------------------
// base 의 모든 행이 head 의 앞부분에 같은 순서·같은 내용으로 있어야 한다.
// 사유 코드: ROW_DELETED(base 행이 head 에 없음), ROW_MODIFIED(같은 id 인데 내용이 다름 또는 그 자리 행이 바뀜),
//            ROW_REORDERED(순서가 바뀜), ROW_INSERTED_IN_MIDDLE(base 행 사이에 새 행이 끼어듦)
export function checkAppendOnly(baseObj, headObj) {
  const errors = [];
  // 빈 배열로 취급하지 않는다: 모양이 틀린 장부끼리의 대조는 "통과"가 아니라 오류이다.
  if (!isObj(baseObj) || !Array.isArray(baseObj.rows)) err(errors, "BASE_LEDGER_INVALID", "base ledger must be an object with a rows array");
  if (!isObj(headObj) || !Array.isArray(headObj.rows)) err(errors, "HEAD_LEDGER_INVALID", "head ledger must be an object with a rows array");
  if (errors.length) return { ok: false, errors };
  const baseRows = baseObj.rows;
  const headRows = headObj.rows;
  const text = row => JSON.stringify(row); // 원문 그대로 비교(정규형이 아닌 변경도 수정으로 본다)
  const headById = new Map();
  headRows.forEach((row, index) => {
    if (isStr(row?.id) && !headById.has(row.id)) headById.set(row.id, { row, index });
  });

  let intact = true;
  baseRows.forEach((row, index) => {
    const found = headById.get(row?.id);
    if (!found) {
      intact = false;
      err(errors, "ROW_DELETED", `base row ${index} is missing from head`, row, index);
    } else if (text(found.row) !== text(row)) {
      intact = false;
      err(errors, "ROW_MODIFIED", `base row ${index} changed in head`, row, index);
    }
  });
  if (!intact) return { ok: false, errors };

  const order = baseRows.map(row => headById.get(row.id).index);
  if (order.some((position, i) => i > 0 && position < order[i - 1])) {
    err(errors, "ROW_REORDERED", "base rows appear in a different order in head");
  } else if (order.some((position, i) => position !== i)) {
    const firstBad = order.findIndex((position, i) => position !== i);
    err(errors, "ROW_INSERTED_IN_MIDDLE", `a new row sits before base row ${firstBad}; new rows must be appended at the end`, baseRows[firstBad], firstBad);
  }
  return { ok: errors.length === 0, errors };
}

// ---- 조회(소비자용; A1에서는 테스트만 호출) -------------------------------------------------------------
// 주어진 조건(undefined 는 무시)에 맞는 행을 장부 순서대로 돌려준다. 없으면 [].
export function lookup(obj, { kind, path: rowPath, sealedBlob, editionBlob, questionKey } = {}) {
  const rows = Array.isArray(obj?.rows) ? obj.rows : [];
  return rows.filter(row =>
    (kind === undefined || row.kind === kind) &&
    (rowPath === undefined || row.path === rowPath) &&
    (questionKey === undefined || row.questionKey === questionKey) &&
    (sealedBlob === undefined || row.sealed?.gitBlobSha1 === sealedBlob) &&
    (editionBlob === undefined || row.edition?.gitBlobSha1 === editionBlob));
}

// ---- git 대조(CLI) -------------------------------------------------------------------------------------
// runGit(args) -> { status, stdout, stderr }. 테스트는 가짜를 넣는다. git 은 rev-parse / merge-base / cat-file / show 만 쓴다.
export function defaultRunGit(root) {
  return args => {
    const result = spawnSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 1 << 26 });
    return { status: result.status ?? 1, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
  };
}

// 현재 파일 텍스트를 검증하고, base 와 추가 전용으로 대조한다. 조용한 통과 없음: base 를 못 풀면 명확한 오류.
export function checkAgainstGit({ headText, ref = "origin/main", runGit, ledgerPath = LEDGER_PATH }) {
  const errors = [];
  let head;
  try {
    head = parseLedger(headText);
  } catch (error) {
    return { ok: false, base: null, errors: [{ code: error.code ?? "PARSE", message: error.message, rowId: null, index: null }] };
  }
  const validation = validateLedger(head, { text: headText });
  errors.push(...validation.errors);

  const resolved = runGit(["rev-parse", "--verify", "--quiet", `${ref}^{commit}`]);
  if (resolved.status !== 0) {
    errors.push({ code: "BASE_REF_UNRESOLVED", message: `base ref "${ref}" does not resolve to a commit (fetch it, or pass --base <ref>); not comparing silently`, rowId: null, index: null });
    return { ok: false, base: null, errors };
  }
  const mergeBase = runGit(["merge-base", ref, "HEAD"]);
  const baseCommit = mergeBase.stdout.trim();
  if (mergeBase.status !== 0 || !baseCommit) {
    errors.push({ code: "BASE_MERGE_BASE_FAILED", message: `no merge-base between "${ref}" and HEAD (shallow clone or unrelated history); not comparing silently`, rowId: null, index: null });
    return { ok: false, base: null, errors };
  }
  const baseSpec = `${baseCommit}:${ledgerPath}`;
  // 새 파일 확정: ls-tree 가 성공하고 출력이 빌 때만. 명령 자체가 실패(나쁜 객체 등)하면 읽기 실패이지 "없음"이 아니다.
  const listed = runGit(["ls-tree", "--name-only", baseCommit, "--", ledgerPath]);
  if (listed.status !== 0) {
    errors.push({ code: "BASE_READ_FAILED", message: `git ls-tree ${baseCommit} -- ${ledgerPath} failed: ${listed.stderr.trim()}`, rowId: null, index: null });
    return { ok: false, base: { commit: baseCommit, ledger: "UNREADABLE" }, errors };
  }
  if (listed.stdout.trim() === "") {
    return { ok: errors.length === 0, base: { commit: baseCommit, ledger: "ABSENT_NEW_FILE" }, errors };
  }
  const shown = runGit(["show", baseSpec]);
  if (shown.status !== 0) {
    errors.push({ code: "BASE_READ_FAILED", message: `git show ${baseSpec} failed: ${shown.stderr.trim()}`, rowId: null, index: null });
    return { ok: false, base: { commit: baseCommit, ledger: "UNREADABLE" }, errors };
  }
  let baseObj;
  try {
    baseObj = parseLedger(shown.stdout);
  } catch (error) {
    errors.push({ code: "BASE_PARSE_FAILED", message: `base ledger is unreadable: ${error.message}`, rowId: null, index: null });
    return { ok: false, base: { commit: baseCommit, ledger: "UNREADABLE" }, errors };
  }
  const baseValidation = validateLedger(baseObj, { text: shown.stdout });
  if (!baseValidation.ok) {
    // 형식이 틀린 base 와는 대조하지 않는다. 사유가 한눈에 보이게 처음 몇 개만 붙인다.
    const first = baseValidation.errors.slice(0, 3).map(error => `${error.code}${error.index !== null ? `@${error.index}` : ""}`).join(",");
    errors.push({ code: "BASE_LEDGER_INVALID", message: `base ledger fails validation (${baseValidation.errors.length} problem(s): ${first})`, rowId: null, index: null });
    return { ok: false, base: { commit: baseCommit, ledger: "INVALID" }, errors };
  }
  errors.push(...checkAppendOnly(baseObj, head).errors);
  return { ok: errors.length === 0, base: { commit: baseCommit, ledger: "PRESENT", rows: baseObj.rows?.length ?? 0 }, errors };
}

// ---- CLI ---------------------------------------------------------------------------------------------
function main(argv) {
  const args = argv.slice(2);
  if (!args.includes("--check")) {
    console.error("usage: node tools/edition-ledger.mjs --check [--base <git ref>]");
    return 2;
  }
  const baseIndex = args.indexOf("--base");
  const ref = baseIndex >= 0 ? args[baseIndex + 1] : "origin/main";
  if (!ref || ref.startsWith("--")) {
    console.error("--base needs a git ref");
    return 2;
  }
  const file = path.join(REPO_ROOT, LEDGER_PATH);
  if (!existsSync(file)) {
    console.error(`FAIL LEDGER_MISSING ${LEDGER_PATH}`);
    return 1;
  }
  const result = checkAgainstGit({ headText: readFileSync(file, "utf8"), ref, runGit: defaultRunGit(REPO_ROOT) });
  for (const error of result.errors) console.error(`FAIL ${error.code}${error.rowId ? ` row=${error.rowId}` : ""}${error.index !== null ? ` index=${error.index}` : ""}: ${error.message}`);
  if (!result.ok) return 1;
  console.log(`PASS edition ledger (${LEDGER_PATH}); base ${ref} @ ${result.base.commit.slice(0, 10)}: ledger ${result.base.ledger}`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main(process.argv); // process.exit 는 파이프로 나가는 큰 stdout 을 잘라 먹는다(리눅스)
