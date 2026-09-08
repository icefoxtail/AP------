import { execFileSync } from "node:child_process";
import fs from "node:fs";

const files = [
  "archive/exams/original/high/h2/1final/25_금당고_1학기_기말_고2_수학I.js",
  "archive/exams/original/high/h2/1final/25_제일고_1학기_기말_고2_대수c.js",
  "archive/exams/original/high/h2/1final/25_효천고_1학기_기말_고2_대수c.js",
];

function safeNormalize(source) {
  return source.replace(/\\\\n(?![A-Za-z])/g, (match) => match.slice(1));
}

for (const file of files) {
  const baseline = execFileSync("git", ["show", `HEAD:${file}`], { encoding: "utf8" });
  const repaired = safeNormalize(baseline);
  fs.writeFileSync(file, repaired, "utf8");
  console.log(JSON.stringify({ file, baselineBytes: Buffer.byteLength(baseline), repairedBytes: Buffer.byteLength(repaired) }));
}
