import fs from "node:fs";

const file = "archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js";
const source = fs.readFileSync(file, "utf8");
const start = source.search(/\r?\n  \{\r?\n    "id": 21,/);
const end = source.search(/\r?\n  \}\r?\n\];/);
if (start < 0 || end < 0) throw new Error("q21 object boundary not found");
const objectStart = source[start] === "\r" ? start + 2 : start + 1;
const closeBrace = end + (source[end] === "\r" ? 4 : 3);
const objectText = source.slice(objectStart, closeBrace + 1);
const question = JSON.parse(objectText);
question.answer = "$\\frac{81}{4}$";
question.solution = [
  "좌표를 평행이동하여 u=x-3이라 두면 두 곡선은 y=a^u, y=log_a u이고, 직선은 y=8-u이다. 두 곡선의 교점은 (u,v)와 (v,u)의 형태로 대응하므로 주어진 중점 x좌표 11/2에서 u+v=5, 즉 직선은 y=-x+8이다.",
  "",
  "삼각형의 두 교점을 A=(u+3,5-u), B=(8-u,u)라 하고 C=(3,0)이라 하자. 넓이 조건에서 1/2 |det(A-C,B-C)| = 1/2 |u^2-(5-u)^2| = 10이다.",
  "",
  "이므로 |10u-25|=20이다. 따라서 u=1/2 또는 9/2이다. a>2이고 A가 y=a^u 위에 있어야 하므로 u=1/2를 선택한다. 이때 A=(7/2,9/2)이고 a^{1/2}=9/2이므로 a=81/4이다.",
  "",
  "따라서 구하는 값은 $\\frac{81}{4}$이다."
].join("\n");
const formatted = JSON.stringify(question, null, 2).split("\n").map((line) => `  ${line}`).join("\n");
fs.writeFileSync(file, source.slice(0, objectStart) + formatted + source.slice(closeBrace + 1), "utf8");
console.log(JSON.stringify({ file, id: 21, answer: question.answer }));
