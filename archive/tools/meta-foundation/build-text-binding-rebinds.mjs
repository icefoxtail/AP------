// 재결속 기록 생성기·검증기 (메타 결속 지문 text-v1, 결정: docs/agents/metadata.md "메타 결속 지문 범위").
//
// 정본 메타·identity의 지문(sourceFingerprint 5필드 / contentFingerprint 3필드)은 등록 당시의 해설·정답·그림까지 묶어서
// 해설을 고치거나 그림을 다시 자르면 "낡은 결속"이 된다. 학생이 보는 발문·보기가 같다면 이미 한 판정은 유효하다.
// 이 도구는 그 지문 X가 가리키던 등록 당시의 문항을 git 이력에서 찾아 발문·보기 지문(text-v1)을 지금과 비교하고,
// 같은 것만 `archive/data/meta-foundation/text-binding-rebinds.v1.json`에 남긴다. **이 파일은 옛 기록(영수증·identity)용 1회
// 계산 결과로 동결되어 더 자라지 않는다**: `--write`는 파일이 이미 있으면 거절하고, `--check --against <ref>`는 기준 ref의 파일과
// 한 글자도 다르지 않아야 통과한다. 새 등록은 행(`textBindingFingerprint`)과 유형 판정(`typeApproval.textBindingFingerprint`)에 text-v1을 직접 싣는다.
// - 같지 않은 것(발문·보기가 실제로 바뀜)과 이력에서 못 찾은 것(확인 불가)은 기록하지 않는다. 추정으로 풀지 않는다.
// - 소비자(카탈로그 빌더·등록기)는 git을 보지 않고 이 파일만 읽는다.
//
// 사용:
//   node archive/tools/meta-foundation/build-text-binding-rebinds.mjs                 # 예행: 건수만 보고
//   node archive/tools/meta-foundation/build-text-binding-rebinds.mjs --write         # 파일이 없을 때만 만든다
//   node archive/tools/meta-foundation/build-text-binding-rebinds.mjs --check [--against origin/main] [--verify-history [--sample N]]
//   옵션: --root <repo>  --report-pending  --explain [N]
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  REBINDS_PATH, REBINDS_SCHEMA, TEXT_BINDING_VERSION,
  contentFingerprint, sourceFingerprint, textFingerprint,
} from "./text-binding-lib.mjs";

const require = createRequire(import.meta.url);
const examSourceReader = require("../../exam-source-reader.js");
const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const META = "archive/data/question_metadata.json";
const IDENTITY = "archive/data/question_identity_map.json";
const EXAMS = "archive/exams/";
const PENDING_STATE = ".archive-meta-register/auto/state.json";
const HEX64 = /^[a-f0-9]{64}$/;

const FAMILY_FP = { A: sourceFingerprint, B: contentFingerprint };
const ROLES = ["rowContent", "rowSource", "identitySource"];

const readJson = (root, rel) => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
const git = (root, args, input) => execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 512 * 1024 * 1024,
  stdio: ["pipe", "pipe", "pipe"], ...(input === undefined ? {} : { input }) });

function loadBank(text, name) {
  const scope = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(scope);
  vm.runInContext(text.replace(/^﻿/, "").replace(/\r\n/g, "\n"), scope, { filename: name, timeout: 5000 });
  return examSourceReader.readQuestionArray(scope.window);
}

// 파일의 모든 버전(최신 먼저)을 {commit, blob, bank}로 읽는다. follow: 이름이 바뀐 파일의 이전 이름 이력도 따라간다.
export function fileVersions(root, rel, { follow }) {
  const gitPath = EXAMS + rel;
  let out;
  try {
    out = git(root, ["log", ...(follow ? ["--follow"] : []), "--format=%H", "--raw", "--no-abbrev", "--", gitPath]);
  } catch { return []; }
  const list = [];
  let commit = null;
  for (const line of out.split("\n")) {
    if (/^[0-9a-f]{40}$/.test(line)) { commit = line; continue; }
    const m = /^:\d+ \d+ [0-9a-f]{40} ([0-9a-f]{40}) [AMRC]\d*\t/.exec(line);
    if (m && commit) list.push({ commit, blob: m[1] });
  }
  const unique = [...new Set(list.map((v) => v.blob))];
  if (!unique.length) return [];
  const result = spawnSync("git", ["cat-file", "--batch"], { cwd: root, input: unique.join("\n") + "\n", maxBuffer: 1024 * 1024 * 1024 });
  if (result.status !== 0) return [];
  const buffer = result.stdout, texts = new Map();
  let at = 0;
  for (const blob of unique) {
    const eol = buffer.indexOf(10, at);
    const header = buffer.slice(at, eol).toString().split(" ");
    const size = Number(header[2]);
    at = eol + 1;
    texts.set(blob, header[1] === "blob" ? buffer.slice(at, at + size).toString("utf8") : null);
    at += size + 1;
  }
  const banks = new Map();
  for (const blob of unique) {
    try { banks.set(blob, texts.get(blob) == null ? null : loadBank(texts.get(blob), rel)); } catch { banks.set(blob, null); }
  }
  return list.map((v) => ({ ...v, bank: banks.get(v.blob) }));
}

// 앵커 하나(uid, 지문 fp, 지문 종류 family)에 대한 판정.
// RESOLVED: 그 지문과 일치하는 모든 과거 버전의 발문·보기가 지금과 같다. TEXT_CHANGED: 하나도 같지 않다(발문·보기가 실제로 바뀜).
// AMBIGUOUS: 일부만 같다. NO_HISTORY: 그 지문과 일치하는 과거 버전을 못 찾음(확인 불가).
export function resolveAnchor(versions, ordinal, family, fp, currentText) {
  const fingerprint = FAMILY_FP[family];
  const matched = versions.filter((v) => v.bank?.[ordinal - 1] && fingerprint(v.bank[ordinal - 1]) === fp);
  if (!matched.length) return { status: "NO_HISTORY" };
  const same = matched.filter((v) => textFingerprint(v.bank[ordinal - 1]) === currentText);
  if (same.length === matched.length) return { status: "RESOLVED", commit: matched[0].commit, versions: matched.length };
  return { status: same.length ? "AMBIGUOUS" : "TEXT_CHANGED", before: matched[0].bank[ordinal - 1] };
}

function currentBankOf(root, rel) {
  try { return loadBank(fs.readFileSync(path.join(root, EXAMS, rel), "utf8"), rel); } catch { return null; }
}

// 현재 정본에서 앵커를 모은다. 현재 지문과 같은 앵커는 기존 동작으로 충분하므로 history를 보지 않는다.
// 예외: typeApproval이 판정한 내용 지문이 현재와 같은데 판정 때 text-v1 지문을 저장하지 않았다면, 이후 그림이 바뀌어도 유효하도록
// 지금의 text-v1을 "current" 근거로 미리 남긴다(git 불필요).
export function collect(root) {
  const metadata = readJson(root, META), identity = readJson(root, IDENTITY);
  const idByJoin = new Map(identity.records.map((r) => [r.sourceArchiveFile + "#" + r.sourceOrdinal, r]));
  const byFile = new Map();
  for (const row of metadata.records) {
    if (!byFile.has(row.sourceArchiveFile)) byFile.set(row.sourceArchiveFile, []);
    byFile.get(row.sourceArchiveFile).push(row);
  }
  const files = [];
  for (const [rel, rows] of [...byFile].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    const bank = currentBankOf(root, rel);
    const items = [];
    for (const row of rows.sort((a, b) => a.sourceOrdinal - b.sourceOrdinal)) {
      const id = idByJoin.get(rel + "#" + row.sourceOrdinal);
      const q = bank?.[row.sourceOrdinal - 1];
      if (!q || !id || id.questionUid !== row.questionUid) { items.push({ row, skip: !q ? "NO_QUESTION" : "ID_MISMATCH" }); continue; }
      const curText = textFingerprint(q);
      if (!curText) { items.push({ row, skip: "NO_STEM" }); continue; }
      const cur = { A: sourceFingerprint(q), B: contentFingerprint(q) };
      const anchors = new Map(); // fp -> {family, roles}
      const add = (fp, family, role) => {
        if (typeof fp !== "string" || !HEX64.test(fp)) return;
        const prior = anchors.get(fp);
        if (prior) prior.roles.add(role); else anchors.set(fp, { family, roles: new Set([role]) });
      };
      add(row.contentFingerprint, "B", "rowContent");
      add(row.sourceFingerprint, "A", "rowSource");
      add(id.sourceFingerprint, "A", "identitySource");
      items.push({ row, uid: row.questionUid, ordinal: row.sourceOrdinal, curText, cur, anchors, question: q });
    }
    files.push({ rel, items });
  }
  return files;
}

function readExisting(root, rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function analyze(root, { existing, explain = 0 }) {
  const samples = [];
  const clip = (v) => String(v ?? "").replace(/\s+/g, " ").slice(0, 110);
  const have = new Set((existing?.entries || []).map((e) => e.uid + "|" + e.fp));
  const added = [];
  const perRole = Object.fromEntries(ROLES.map((r) => [r, {}]));
  const bump = (role, key) => { perRole[role][key] = (perRole[role][key] || 0) + 1; };
  const outcomes = new Map(); // uid|fp -> status
  const skipped = {};
  const files = collect(root);
  for (const { rel, items } of files) {
    const needHistory = items.some((it) => it.anchors && [...it.anchors].some(([fp, a]) => fp !== it.cur[a.family]));
    let versions = null, followed = false;
    const versionsFor = () => (versions ??= fileVersions(root, rel, { follow: false }));
    for (const it of items) {
      if (it.skip) { skipped[it.skip] = (skipped[it.skip] || 0) + 1; continue; }
      for (const [fp, anchor] of it.anchors) {
        const key = it.uid + "|" + fp;
        let result;
        if (fp === it.cur[anchor.family]) {
          result = { status: "MATCH_CURRENT" };
        } else if (have.has(key)) {
          result = { status: "ALREADY_RECORDED" };
        } else {
          if (!needHistory) continue;
          result = resolveAnchor(versionsFor(), it.ordinal, anchor.family, fp, it.curText);
          if (result.status === "NO_HISTORY" && !followed) {
            followed = true;
            versions = fileVersions(root, rel, { follow: true });
            result = resolveAnchor(versions, it.ordinal, anchor.family, fp, it.curText);
          }
          if (result.status === "RESOLVED") {
            added.push({ uid: it.uid, fp, family: anchor.family, text: it.curText, basis: "history", commit: result.commit, file: rel, ordinal: it.ordinal });
            have.add(key);
          }
        }
        outcomes.set(key, result.status);
        if (explain && result.status === "TEXT_CHANGED" && anchor.roles.has("rowContent") && outcomes.size % 40 === 0 && samples.length < explain) {
          const now = it.question;
          samples.push({ file: rel, ordinal: it.ordinal, beforeStem: clip(examSourceReader.readStemForBinding(result.before)), nowStem: clip(examSourceReader.readStemForBinding(now)),
            beforeChoices: clip(JSON.stringify(result.before.choices)), nowChoices: clip(JSON.stringify(now.choices)) });
        }
        for (const role of anchor.roles) bump(role, result.status);
      }
    }
  }
  return { added, perRole, skipped, outcomes, files, samples };
}

const entryLine = (e) => "    " + JSON.stringify(e);
function serialize(doc) {
  const head = { schemaVersion: doc.schemaVersion, textFingerprintVersion: doc.textFingerprintVersion, appendOnly: true,
    note: doc.note, batches: doc.batches };
  const headText = JSON.stringify(head, null, 2).replace(/\n}$/, "");
  return headText + ',\n  "entries": [\n' + doc.entries.map(entryLine).join(",\n") + "\n  ]\n}\n";
}

const NOTE = "uid의 지문 fp(등록 당시 값)가 가리키던 문항의 발문·보기(text-v1)가 text와 같다는 기록. text가 현재 문항의 text-v1과 다르면 효력이 없다. "
  + "basis=history: 그 지문과 일치하는 모든 과거 버전(git commit)의 발문·보기가 같았다. basis=current: 판정 지문이 판정 시점의 현재 원본과 같았고, 그때의 text-v1을 남긴 것이다. "
  + "추가 전용: 기존 항목은 고치거나 지우지 않는다. 발문·보기가 실제로 바뀐 문항과 이력에서 못 찾은 문항은 기록하지 않는다. 생성: build-text-binding-rebinds.mjs";

function headCommit(root) { try { return git(root, ["rev-parse", "HEAD"]).trim(); } catch { return null; } }

function writeDoc(root, existing, added) {
  const doc = existing ? { ...existing } : { schemaVersion: REBINDS_SCHEMA, textFingerprintVersion: TEXT_BINDING_VERSION, note: NOTE, batches: [], entries: [] };
  doc.note = NOTE;
  doc.batches = [...(doc.batches || []), { index: (doc.batches || []).length + 1, headCommit: headCommit(root), entries: added.length }];
  doc.entries = [...doc.entries, ...added];
  fs.mkdirSync(path.dirname(path.join(root, REBINDS_PATH)), { recursive: true });
  fs.writeFileSync(path.join(root, REBINDS_PATH), serialize(doc));
  return doc;
}

// ---- 검증 ---------------------------------------------------------------------------------------------------------
export function checkRebinds(root, { against, verifyHistory, sample } = {}) {
  const errors = [];
  const doc = readExisting(root, REBINDS_PATH);
  if (!doc) return { errors: ["missing " + REBINDS_PATH], entries: 0 };
  if (doc.schemaVersion !== REBINDS_SCHEMA || doc.textFingerprintVersion !== TEXT_BINDING_VERSION || doc.appendOnly !== true || !Array.isArray(doc.entries))
    errors.push("schema/version/appendOnly mismatch");
  const identity = readJson(root, IDENTITY);
  const uids = new Set(identity.records.map((r) => r.questionUid));
  const seen = new Set();
  const basisValues = new Set(["history", "current"]);
  for (const e of doc.entries) {
    const key = e.uid + "|" + e.fp;
    if (!uids.has(e.uid)) errors.push("unknown uid " + e.uid);
    if (!HEX64.test(e.fp || "") || !HEX64.test(e.text || "")) errors.push("bad fingerprint " + key);
    if (!["A", "B"].includes(e.family)) errors.push("bad family " + key);
    if (!basisValues.has(e.basis)) errors.push("bad basis " + key);
    if (e.basis === "history" && !/^[0-9a-f]{40}$/.test(e.commit || "")) errors.push("history entry without commit " + key);
    if (seen.has(key)) errors.push("duplicate " + key);
    seen.add(key);
  }
  if (serialize(doc) !== fs.readFileSync(path.join(root, REBINDS_PATH), "utf8")) errors.push("file is not in canonical serialization");
  if (against) {
    let base = null, baseResolves = true;
    try { git(root, ["rev-parse", "--verify", "--quiet", against + "^{commit}"]); } catch { baseResolves = false; }
    // 기준 ref를 못 풀면(얕은 체크아웃 등) 통과로 치지 않고 따로 표시한다: 호출자는 이를 "건너뜀"과 "실패"로 구분해 보여 줘야 한다.
    if (!baseResolves) errors.push("BASE_UNAVAILABLE:" + against);
    else {
      try { base = JSON.parse(git(root, ["show", against + ":" + REBINDS_PATH])); } catch { /* 기준 ref에 파일이 없으면 모두 새 항목이다. */ }
    }
    if (base) {
      // 동결: 기준 ref의 파일과 항목이 정확히 같아야 한다(늘어나도 줄어도 안 된다).
      const baseText = base.entries.map((e) => JSON.stringify(e));
      const ours = doc.entries.map((e) => JSON.stringify(e));
      if (ours.length !== baseText.length || baseText.some((line, i) => line !== ours[i]))
        errors.push("frozen file differs from " + against);
    }
  }
  let verified = 0;
  if (verifyHistory) {
    const byFile = new Map();
    for (const e of doc.entries) if (e.basis === "history") { if (!byFile.has(e.file)) byFile.set(e.file, []); byFile.get(e.file).push(e); }
    const files = [...byFile].sort((a, b) => (a[0] < b[0] ? -1 : 1));
    let budget = Number.isInteger(sample) ? sample : Infinity;
    for (const [rel, entries] of files) {
      if (budget <= 0) break;
      let versions = fileVersions(root, rel, { follow: false });
      for (const e of entries.slice(0, budget)) {
        let result = resolveAnchor(versions, e.ordinal, e.family, e.fp, e.text);
        if (result.status === "NO_HISTORY") { versions = fileVersions(root, rel, { follow: true }); result = resolveAnchor(versions, e.ordinal, e.family, e.fp, e.text); }
        if (result.status !== "RESOLVED") errors.push("history no longer supports " + e.uid + "|" + e.fp + " (" + result.status + ")");
        verified++; budget--;
      }
    }
  }
  return { errors, entries: doc.entries.length, verified };
}

// ---- 보고용: 등록기 pending 사유별 분포 ---------------------------------------------------------------------------------
function pendingReport(root, analysis) {
  const file = path.join(root, PENDING_STATE);
  if (!fs.existsSync(file)) return null;
  const pending = JSON.parse(fs.readFileSync(file, "utf8")).pending || {};
  const identity = readJson(root, IDENTITY);
  const idByJoin = new Map(identity.records.map((r) => [r.sourceArchiveFile + "#" + r.sourceOrdinal, r]));
  const addedKeys = new Set(analysis.added.map((e) => e.uid + "|" + e.fp));
  const out = { mismatchPending: 0, resolved: 0, textChanged: 0, ambiguous: 0, noHistory: 0, other: 0 };
  for (const [key, item] of Object.entries(pending)) {
    if (!(item.lastReasons || []).includes("IDENTITY_SOURCE_FINGERPRINT_MISMATCH")) continue;
    out.mismatchPending++;
    const id = idByJoin.get(key);
    const status = id && analysis.outcomes.get(id.questionUid + "|" + id.sourceFingerprint);
    if (id && addedKeys.has(id.questionUid + "|" + id.sourceFingerprint)) out.resolved++;
    else if (status === "ALREADY_RECORDED") out.resolved++;
    else if (status === "TEXT_CHANGED") out.textChanged++;
    else if (status === "AMBIGUOUS") out.ambiguous++;
    else if (status === "NO_HISTORY") out.noHistory++;
    else out.other++;
  }
  return out;
}

export async function main(argv) {
  const args = new Map();
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith("--")) continue;
    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith("--")) { args.set(argv[i], next); i++; } else args.set(argv[i], true);
  }
  const root = args.has("--root") ? path.resolve(args.get("--root")) : DEFAULT_ROOT;
  if (args.has("--check")) {
    const sample = args.has("--sample") ? Number(args.get("--sample")) : undefined;
    const result = checkRebinds(root, { against: args.get("--against") || undefined, verifyHistory: args.has("--verify-history"), sample });
    console.log(JSON.stringify({ check: result.errors.length ? "FAIL" : "PASS", entries: result.entries, verifiedAgainstHistory: result.verified, errors: result.errors.slice(0, 20) }, null, 2));
    process.exitCode = result.errors.length ? 1 : 0;
    return;
  }
  const existing = readExisting(root, REBINDS_PATH);
  if (args.has("--write") && existing) { console.error("FROZEN: " + REBINDS_PATH + " is a one-time result and is never extended"); process.exitCode = 1; return; }
  const analysis = analyze(root, { existing, explain: args.has("--explain") ? Number(args.get("--explain")) || 12 : 0 });
  const summary = { mode: args.has("--write") ? "write" : "dry-run", existingEntries: existing?.entries.length || 0, newEntries: analysis.added.length,
    newByBasis: analysis.added.reduce((m, e) => ({ ...m, [e.basis]: (m[e.basis] || 0) + 1 }), {}), perRole: analysis.perRole, skipped: analysis.skipped };
  if (args.has("--explain")) summary.textChangedSamples = analysis.samples;
  if (args.has("--report-pending")) summary.pending = pendingReport(root, analysis);
  if (args.has("--write") && analysis.added.length) writeDoc(root, existing, analysis.added);
  console.log(JSON.stringify(summary, null, 2));
}

if (process.argv[1] && path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1])) await main(process.argv.slice(2));
