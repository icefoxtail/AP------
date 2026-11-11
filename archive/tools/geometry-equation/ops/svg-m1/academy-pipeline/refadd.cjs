// usage: node refadd.cjs <js>...  -> prints untracked image paths referenced by the given JS files; removes unreferenced untracked ones in the same exam folders when --clean
const fs = require("fs");
const cp = require("child_process");
const args = process.argv.slice(2);
const clean = args.includes("--clean");
const jsFiles = args.filter(a => a !== "--clean");
const js = jsFiles.map(f => fs.readFileSync(f, "utf8")).join("\n");
const exams = jsFiles.map(f => f.split("/").pop().replace(/\.js$/, ""));
const out = cp.execFileSync("git", ["-c", "core.quotepath=false", "status", "--porcelain", "--untracked-files=all"], { encoding: "utf8" });
const untr = out.split("\n").filter(l => l.startsWith("?? ")).map(l => l.slice(3).replace(/^"|"$/g, ""));
const ref = [], unref = [];
for (const p of untr) {
  if (!exams.some(e => p.includes("/" + e + "/"))) continue;
  if (js.includes(p.replace(/^archive\//, ""))) ref.push(p); else unref.push(p);
}
if (clean) for (const p of unref) fs.unlinkSync(p);
console.error("referenced", ref.length, "unreferenced", unref.length, clean ? "(removed)" : "");
console.log(ref.join("\n"));
