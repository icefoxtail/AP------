// Build a pre-filled SVG work harness for the similar exams on a branch.
// usage: node build-svg-harness.mjs <repoDir> <ref> <outDir>
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const [repo, ref, outDir] = process.argv.slice(2);
const git = (...a) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
const gitBuf = (...a) => execFileSync("git", ["-C", repo, ...a], { maxBuffer: 256 * 1024 * 1024 });
const evalBank = (src) => {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(src, ctx, { timeout: 10000 });
  return ctx.window.questionBank || ctx.window.questions || ctx.questions || ctx.questionBank || ctx.window.examData?.questions || [];
};
const exists = (r, p) => { try { git("cat-file", "-e", `${r}:${p}`); return true; } catch { return false; } };

const all = git("ls-tree", "-r", "--name-only", ref, "archive/similar-judgment", "_similar_judgment_out").split("\n").filter(Boolean);
const stages = new Map();
for (const p of all) {
  const m = p.match(/^(?:archive\/similar-judgment|_similar_judgment_out)\/([^/]+)\/stage\/\1\.js$/);
  if (m && (!stages.has(m[1]) || p.startsWith("archive/"))) stages.set(m[1], p);
}
const mainFiles = git("ls-tree", "-r", "--name-only", "origin/main", "archive/exams").split("\n").filter(Boolean);
const planFiles = git("ls-tree", "-r", "--name-only", "origin/main", "archive/tools/geometry-equation/production/plans", "archive/exams/similar").split("\n").filter(p => p.endsWith(".plan.json"));
const originals = mainFiles.filter(f => f.startsWith("archive/exams/original/") && f.endsWith(".js"));
const byBase = new Map(mainFiles.filter(f => f.endsWith(".js")).map(f => [path.basename(f, ".js"), f]));

const FIG = /\[그림[^\]]*\]|<img|다음 그림|그림과 같이|그림은|산점도|히스토그램|도수분포다각형|그래프/;
const exams = [];
for (const [name, stagePath] of [...stages].sort()) {
  const bank = evalBank(git("show", `${ref}:${stagePath}`));
  const b0 = name.replace(/_유사\d*$/, "");
  const bases = [...new Set([b0, b0.replace(/_수학I$/, "_대수"), b0.replace(/_(수학I|공통수학[12]|대수)$/, "")])];
  const origCands = originals.filter(f => { const bn = path.basename(f, ".js"); return bases.some(b => bn === b || bn.startsWith(b + "_")); });
  const rank = f => { const bn = path.basename(f, ".js"); return /_기출$/.test(bn) ? 0 : /_수학$/.test(bn) ? 1 : bases.includes(bn) ? 2 : 3; };
  const origPath = origCands.sort((a, b) => rank(a) - rank(b))[0] || null;
  const origName = origPath ? path.basename(origPath, ".js") : null;
  const releasedPath = byBase.get(name) || null;
  let orig = [];
  if (origPath) { try { orig = evalBank(git("show", `origin/main:${origPath}`)); } catch { orig = []; } }
  const items = bank.map((q, i) => {
    const o = orig[i] || {};
    const text = [q.content, q.question, q.stem, ...(Array.isArray(q.choices) ? q.choices : [])].filter(x => typeof x === "string").join(" ");
    const sol = typeof q.solution === "string" ? q.solution : "";
    const probPlaceholder = (text.match(/\[그림[^\]]*\]/) || [null])[0];
    const solPlaceholder = (sol.match(/\[그림[^\]]*\]/) || [null])[0];
    const mention = FIG.test(text);
    const needProblem = !!(q.image || probPlaceholder || (o.image && mention));
    const needSolution = !!(q.solutionImage || solPlaceholder || o.solutionImage);
    return {
      qid: String(q.id ?? i + 1), ordinal: i + 1,
      figureMention: FIG.test(text),
      problem: {
        need: needProblem ? "YES" : ((mention || o.image) ? "CHECK" : "NO"),
        why: [q.image && "stage에 image 있음(원본 PNG 복사본이면 이 문항 숫자로 다시 그려야 함)", probPlaceholder && `자리표시 ${probPlaceholder}`, o.image && "원본 같은 번호에 문제 그림", mention && "발문이 그림·그래프를 언급", (o.image && !mention) && "유사 발문에는 그림 언급 없음 - 그림 없이 풀리는지 확인"].filter(Boolean).join(", "),
        currentImage: q.image || null,
        originalImage: o.image || null,
        reusePlan: null,
        design: { kind: "", basedOn: "", solutionUses: "", mustShow: [] },
        planPath: null, pngPath: null, pngObservation: "", status: "TODO", note: ""
      },
      solution: {
        need: needSolution ? "YES" : "NO",
        why: [q.solutionImage && "stage에 solutionImage 있음", solPlaceholder && `자리표시 ${solPlaceholder}`, o.solutionImage && "원본 같은 번호에 해설 그림"].filter(Boolean).join(", "),
        currentImage: q.solutionImage || null,
        originalImage: o.solutionImage || null,
        reusePlan: null,
        design: { kind: "", basedOn: "", solutionUses: "", mustShow: [] },
        planPath: null, pngPath: null, pngObservation: "", status: "TODO", note: ""
      }
    };
  });
  const base = name.replace(/_유사\d*$/, "");
  for (const it of items) for (const side of ["problem", "solution"]) {
    const n = it.ordinal, nn = String(n).padStart(2, "0");
    const found = planFiles.filter(p => {
      const m = p.match(/production\/plans\/([^/]+)\/q0*(\d+)-(problem|solution)\.plan\.json$/) || p.match(/archive\/exams\/similar\/.+\/([^/]+)_plans\/q0*(\d+)-(problem|solution)\.plan\.json$/);
      if (!m || Number(m[2]) !== n || m[3] !== side) return false;
      return m[1] !== name && (m[1] === origName || m[1].replace(/_유사\d*$/, "") === base);
    });
    it[side].reusePlan = found.length ? found : null;
  }
  const need = items.reduce((n, it) => n + (it.problem.need === "YES") + (it.solution.need === "YES"), 0);
  exams.push({ exam: name, stagePath, releasedPath, originalPath: origPath, items: items.length, figuresNeeded: need, status: "TODO", items_detail: items });
}
// Work order (user 2026-11-20): 중3 -> 중2 -> 중1 -> 고3 -> 고2 -> 고1; inside a grade 2학기 기말 -> 2학기 중간 -> 1학기 기말 -> 1학기 중간; then newer year first.
const gradeRank = n => { const g = (n.match(/_(중|고)([123])_/) || []); return g[1] === "중" ? 3 - Number(g[2]) : g[1] === "고" ? 6 - Number(g[2]) : 9; };
const termRank = n => /2학기_기말/.test(n) ? 0 : /2학기_중간/.test(n) ? 1 : /1학기_기말/.test(n) ? 2 : /1학기_중간/.test(n) ? 3 : 4;
exams.sort((a, b) => gradeRank(a.exam) - gradeRank(b.exam) || termRank(a.exam) - termRank(b.exam) || b.exam.slice(0, 2).localeCompare(a.exam.slice(0, 2)) || a.exam.localeCompare(b.exam));
fs.mkdirSync(path.join(outDir, "exams"), { recursive: true });
const summary = exams.map(e => ({ exam: e.exam, stagePath: e.stagePath, releasedPath: e.releasedPath, originalPath: e.originalPath, items: e.items, figuresNeeded: e.figuresNeeded, status: e.status }));
for (const e of exams) fs.mkdirSync(path.join(outDir, "exams", e.exam), { recursive: true }), fs.writeFileSync(path.join(outDir, "exams", e.exam, "harness.json"), JSON.stringify({ ...e, items: e.items_detail, items_detail: undefined }, null, 2) + "\n");
fs.writeFileSync(path.join(outDir, "index.json"), JSON.stringify({ ref, builtFrom: git("rev-parse", ref).trim(), exams: summary }, null, 2) + "\n");
console.log(`exams ${exams.length}, figures needed ${summary.reduce((n, e) => n + e.figuresNeeded, 0)}, with original ${summary.filter(e => e.originalPath).length}, already released ${summary.filter(e => e.releasedPath).length}`);
