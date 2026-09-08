import fs from "node:fs";

const file = "archive/exams/original/high/h2/1mid/25_순천고_1학기_중간_고2_대수.js";
const source = fs.readFileSync(file, "utf8");
const start = source.search(/\r?\n  \{\r?\n    "id": 19,/);
const nextRelative = source.slice(start + 5).search(/\r?\n  \{\r?\n/);
const next = nextRelative < 0 ? -1 : start + 5 + nextRelative;
if (start < 0 || next < 0 || next <= start) throw new Error("q19 object boundary not found");
const objectStart = source[start] === "\r" ? start + 2 : start + 1;
const rawObject = source.slice(objectStart, next).trim().replace(/,$/, "");
const question = JSON.parse(rawObject);
question.answer = "9";
question.solution = "t=2^x+2^{-x}이므로 t≥2이고, 첫 번째 방정식은 t^2-kt+9=0이다. k=5이면 t=2가 근이 되어 실근이 생기므로, 첫 조건은 자연수 k≤4이다. 두 번째 이차부등식이 해를 가지려면 판별식이 0 이상이어야 하므로 (3^k-9)(3^k+5)≥0, 즉 k≥2이다. 따라서 가능한 k는 2,3,4이고 그 합은 9이다.";
const formatted = JSON.stringify(question, null, 2).split("\n").map((line) => `  ${line}`).join("\n");
fs.writeFileSync(file, source.slice(0, objectStart) + formatted + "," + source.slice(next), "utf8");
console.log(JSON.stringify({ file, id: 19, answer: question.answer }));
