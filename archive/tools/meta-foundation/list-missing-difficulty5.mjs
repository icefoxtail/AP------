import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Lists the exam files whose questions still have no 5-level difficulty number in the canonical metadata.
// It is the work list for whoever rates difficulty (the Gemini reservation line): rating a file that already has
// numbers only produces ALREADY_REGISTERED / CONFLICT at intake and is thrown away. In the 2026-10-30 ~ 11-09 ledger
// about 260 of 698 submissions were such re-ratings while 333 files had no number at all.
// Read-only. "Missing" is the registrar's own rule: difficultyBucket is not an integer 1..5.
const META = "archive/data/question_metadata.json";
const KIND_ORDER = ["original", "types", "textbooks", "similar"];
const isBucket = v => Number.isInteger(v) && v >= 1 && v <= 5;

export function listMissingDifficulty5(records) {
  const files = new Map();
  for (const record of records || []) {
    const file = String(record?.sourceArchiveFile || "");
    if (!file) continue;
    const row = files.get(file) || { sourceArchiveFile: file, kind: file.split("/")[0], total: 0, missing: 0, missingOrdinals: [] };
    row.total++;
    if (!isBucket(record.difficultyBucket)) { row.missing++; row.missingOrdinals.push(record.sourceOrdinal); }
    files.set(file, row);
  }
  const rank = kind => { const i = KIND_ORDER.indexOf(kind); return i < 0 ? KIND_ORDER.length : i; };
  // Newest school exams first: they are the ones teachers reach for.
  const year = file => { const m = /(?:^|\/)(\d{2})_/.exec(file); return m ? Number(m[1]) : -1; };
  return [...files.values()]
    .filter(row => row.missing > 0 && KIND_ORDER.includes(row.kind))
    .map(row => ({
      sourceArchiveFile: row.sourceArchiveFile, kind: row.kind, total: row.total, missing: row.missing,
      // Only a partly rated file needs the ordinals; a file with nothing rated needs all of them.
      ...(row.missing < row.total ? { missingOrdinals: row.missingOrdinals.slice().sort((a, b) => a - b) } : {})
    }))
    .sort((a, b) => rank(a.kind) - rank(b.kind) || year(b.sourceArchiveFile) - year(a.sourceArchiveFile)
      || (a.sourceArchiveFile < b.sourceArchiveFile ? -1 : a.sourceArchiveFile > b.sourceArchiveFile ? 1 : 0));
}

export function summarize(rows) {
  const byKind = {};
  for (const row of rows) {
    const k = byKind[row.kind] || (byKind[row.kind] = { files: 0, questions: 0 });
    k.files++; k.questions += row.missing;
  }
  return { files: rows.length, questions: rows.reduce((n, row) => n + row.missing, 0), byKind };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const opt = n => { const i = argv.indexOf("--" + n); return i < 0 ? undefined : (argv[i + 1]?.startsWith("--") || argv[i + 1] === undefined ? true : argv[i + 1]); };
  const root = opt("repo-root") ? path.resolve(String(opt("repo-root"))) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
  const rows = listMissingDifficulty5(JSON.parse(fs.readFileSync(path.join(root, META), "utf8")).records);
  const text = opt("format") === "tsv"
    ? ["sourceArchiveFile\tkind\ttotal\tmissing\tmissingOrdinals", ...rows.map(r => [r.sourceArchiveFile, r.kind, r.total, r.missing, (r.missingOrdinals || []).join(",")].join("\t"))].join("\n") + "\n"
    : JSON.stringify({ schemaVersion: "diff5-missing-list-v1", source: META, summary: summarize(rows), files: rows }, null, 2) + "\n";
  if (opt("out") && opt("out") !== true) fs.writeFileSync(path.resolve(String(opt("out"))), text, "utf8"); else process.stdout.write(text);
}
