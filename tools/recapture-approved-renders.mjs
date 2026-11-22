#!/usr/bin/env node
// 승인된 화면(UI 승인 proof)을 다시 찍어야 할 대상 목록을 만드는 도구. 지금은 --list(읽기 전용)만 있다.
//
// 이유: UI 승인 proof(technical-proof 류)는 렌더러 파일(servedFiles)의 git blob/sha256/bytes와 승인 PNG의 해시를 봉인한다.
// 렌더러(engine.html 등)를 고치면 그 봉인이 낡는다. 이 도구는 어떤 기록이 어떤 시험지·문항을 승인했고, 봉인된 파일 중
// 현재 코드와 달라진 것이 무엇인지 보여 준다. 기록은 수정하지 않는다. --capture(재촬영)는 A2에서 구현한다.
//
// 주의: --ref 는 봉인 파일의 "현재 blob" 비교(git ls-tree)에만 쓴다. 승인 기록 JSON과 PNG는 항상 작업 트리에서 읽는다
// (출력의 recordsReadFrom 에 명시). 그래서 --ref 가 HEAD 와 다르면 기록이 그 ref 의 것이라는 뜻이 아니다.
//
// 기록의 형태가 제각각이라, 읽은 종류와 못 읽은 종류를 출력의 unparsed 로 남긴다(조용한 누락 없음).
// 인식 규칙: JSON 안에 servedFiles 배열(최상위, 또는 두 단계 안쪽)이 있으면 읽는다. 없으면 unparsed.
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");

function git(args) {
  const result = spawnSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 });
  return { status: result.status ?? 1, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

const byCodepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const sha256Of = buffer => createHash("sha256").update(buffer).digest("hex");

function treeBlobs(ref) {
  const result = git(["ls-tree", "-r", "-z", ref]);
  if (result.status !== 0) throw new Error(`git ls-tree ${ref} failed: ${result.stderr.trim()}`);
  const map = new Map();
  for (const entry of result.stdout.split("\0")) {
    const match = /^\d+ blob ([0-9a-f]{40})\t([\s\S]*)$/.exec(entry);
    if (match) map.set(match[2], match[1]);
  }
  return map;
}

function findServedFiles(json) {
  const isServed = value => Array.isArray(value) && value.length > 0 && value.every(item => item && typeof item.path === "string" && typeof item.gitBlobSha1 === "string");
  if (isServed(json.servedFiles)) return { served: json.servedFiles, at: "servedFiles" };
  for (const key of Object.keys(json)) {
    const inner = json[key];
    if (inner && typeof inner === "object" && !Array.isArray(inner)) {
      if (isServed(inner.servedFiles)) return { served: inner.servedFiles, at: `${key}.servedFiles` };
      for (const key2 of Object.keys(inner)) {
        const deeper = inner[key2];
        if (deeper && typeof deeper === "object" && !Array.isArray(deeper) && isServed(deeper.servedFiles)) return { served: deeper.servedFiles, at: `${key}.${key2}.servedFiles` };
      }
    }
  }
  return null;
}

function category(filePath) {
  if (filePath.startsWith("archive/exams/")) return "exam-source";
  if (filePath.startsWith("archive/assets/")) return "asset";
  return "runtime"; // engine·css·js·공유 data 등 화면이 받은 나머지 전부(렌더러 파일 + 공유 데이터)
}

function guessKind(filePath) {
  const name = path.posix.basename(filePath).toLowerCase();
  for (const word of ["review", "observation", "visual", "delta", "receipt", "manifest", "publication", "verification", "transport", "equivalence", "binding", "readback", "register"]) {
    if (name.includes(word) || filePath.includes(`/${word}`)) return `${word}-file`;
  }
  if (filePath.startsWith(".archive-meta-register/")) return "meta-register-entry";
  return "other-json";
}

function readRecord(relPath, blobs, full) {
  const text = readFileSync(path.join(ROOT, relPath), "utf8");
  let json;
  try {
    json = JSON.parse(text);
  } catch (error) {
    return { unparsed: { path: relPath, reason: "JSON_PARSE_ERROR", kind: guessKind(relPath), detail: error.message.slice(0, 120) } };
  }
  const found = json && typeof json === "object" ? findServedFiles(json) : null;
  if (!found) return { unparsed: { path: relPath, reason: "NO_SERVED_FILES_ARRAY", kind: guessKind(relPath) } };

  const recordDir = path.posix.dirname(relPath);
  const results = Array.isArray(json.results) ? json.results : [];
  const items = Array.isArray(json.items) ? json.items : [];
  const shots = Array.isArray(json.screenshotArtifacts) ? json.screenshotArtifacts : [];

  const screenshots = shots.map(shot => {
    const repoPath = `${recordDir}/${shot.path}`;
    const onDisk = path.join(ROOT, repoPath);
    const inRepo = blobs.has(repoPath) && existsSync(onDisk);
    const actual = inRepo ? sha256Of(readFileSync(onDisk)) : null;
    return { name: shot.path, sha256: shot.sha256, bytes: shot.bytes, repoPath: inRepo ? repoPath : null, inRepo, sha256Matches: inRepo ? actual === shot.sha256 : null };
  });

  const targets = items.map(item => {
    const fromResult = results.find(result => result?.key === item.key)?.sourceRef;
    const sourceRef = item.sourceRef ?? fromResult ?? null;
    return {
      key: item.key ?? null,
      questionUid: item.questionUid ?? null,
      sourceOrdinal: item.sourceOrdinal ?? null,
      sourcePath: item.sourcePath ?? sourceRef?.path ?? null,
      screenshots: item.key ? shots.filter(shot => typeof shot.path === "string" && shot.path.startsWith(`${item.key}-`)).map(shot => shot.path).sort(byCodepoint) : []
    };
  }).sort((a, b) => byCodepoint(String(a.key), String(b.key)));

  const differing = [];
  const counts = { runtime: 0, "exam-source": 0, asset: 0 };
  for (const served of found.served) {
    const kind = category(served.path);
    counts[kind] += 1;
    const current = blobs.get(served.path) ?? null;
    if (current !== served.gitBlobSha1) {
      differing.push({ path: served.path, category: kind, sealed: { gitBlobSha1: served.gitBlobSha1, sha256: served.sha256 ?? null, bytes: served.bytes ?? null }, currentGitBlobSha1: current, state: current === null ? "MISSING_IN_REF" : "BYTES_DIFFER" });
    }
  }
  differing.sort((a, b) => byCodepoint(a.path, b.path));

  const record = {
    recordPath: relPath,
    schemaVersion: json.schemaVersion ?? null,
    servedFilesAt: found.at,
    sealedFileCount: found.served.length,
    sealedFileCountByCategory: counts,
    targets,
    screenshots,
    differingFromRef: differing
  };
  if (full) record.sealedFiles = found.served.map(served => served.path).sort(byCodepoint);
  return { record };
}

export function buildList({ ref = "HEAD", full = false } = {}) {
  const commit = git(["rev-parse", "--verify", `${ref}^{commit}`]);
  if (commit.status !== 0) throw new Error(`ref "${ref}" does not resolve to a commit`);
  const blobs = treeBlobs(ref);
  const grep = git(["grep", "-l", "-z", "-E", "servedFiles|screenshotArtifacts", "--", "*.json"]);
  if (grep.status > 1) throw new Error(`git grep failed: ${grep.stderr.trim()}`);
  const candidates = grep.stdout.split("\0").filter(Boolean).sort(byCodepoint);

  const records = [];
  const unparsed = [];
  for (const relPath of candidates) {
    const out = readRecord(relPath, blobs, full);
    if (out.record) records.push(out.record);
    else unparsed.push(out.unparsed);
  }

  const unparsedByReason = {};
  for (const item of unparsed) unparsedByReason[`${item.reason}/${item.kind}`] = (unparsedByReason[`${item.reason}/${item.kind}`] ?? 0) + 1;
  const allShots = records.flatMap(record => record.screenshots);
  return {
    schema: "recapture-list-v1",
    note: "read-only; approval records are never modified. unparsed lists JSON records mentioning servedFiles/screenshotArtifacts that this tool could not read as a UI approval proof.",
    ref,
    commit: commit.stdout.trim(),
    blobsComparedAt: "ref (git ls-tree)",
    recordsReadFrom: "working tree (not --ref)",
    summary: {
      candidateJsonFiles: candidates.length,
      parsedRecords: records.length,
      unparsedRecords: unparsed.length,
      unparsedByReason: Object.fromEntries(Object.entries(unparsedByReason).sort(([a], [b]) => byCodepoint(a, b))),
      targets: records.reduce((sum, record) => sum + record.targets.length, 0),
      screenshots: allShots.length,
      screenshotsInRepo: allShots.filter(shot => shot.inRepo).length,
      screenshotsHashMismatch: allShots.filter(shot => shot.sha256Matches === false).length,
      recordsWithDifferingRuntime: records.filter(record => record.differingFromRef.some(file => file.category === "runtime")).length
    },
    records,
    unparsed
  };
}

function main(argv) {
  const args = argv.slice(2);
  if (args.includes("--capture")) {
    console.error("--capture is not implemented yet (A2에서 구현). Chrome 경로는 환경 변수 CHROME_PATH 또는 자동 탐색으로 받을 예정이다.");
    return 2;
  }
  if (!args.includes("--list")) {
    console.error("usage: node tools/recapture-approved-renders.mjs --list [--ref <git ref>] [--full]");
    return 2;
  }
  const refIndex = args.indexOf("--ref");
  const ref = refIndex >= 0 ? args[refIndex + 1] : "HEAD";
  if (!ref || ref.startsWith("--")) {
    console.error("--ref needs a git ref");
    return 2;
  }
  try {
    process.stdout.write(`${JSON.stringify(buildList({ ref, full: args.includes("--full") }), null, 2)}\n`);
    return 0;
  } catch (error) {
    console.error(`FAIL ${error.message}`);
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main(process.argv); // process.exit 는 파이프로 나가는 큰 stdout 을 잘라 먹는다(리눅스)
