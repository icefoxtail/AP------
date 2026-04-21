const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "pdf_list.txt");
const outputPath = path.join(__dirname, "solution_map.json");
const unmatchedPath = path.join(__dirname, "solution_unmatched.txt");

function readTextAuto(filePath) {
  const buf = fs.readFileSync(filePath);

  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    return buf.toString("utf16le");
  }

  let nulCount = 0;
  for (let i = 0; i < Math.min(buf.length, 200); i++) {
    if (buf[i] === 0x00) nulCount++;
  }
  if (nulCount > 20) {
    return buf.toString("utf16le");
  }

  return buf.toString("utf8");
}

const raw = readTextAuto(inputPath);
const cleaned = raw.replace(/^\uFEFF/, "").replace(/\u0000/g, "");

const fileList = cleaned
  .split(/\r?\n/)
  .map(s => s.trim())
  .filter(Boolean);

// 디버그용: 앞 몇 줄 확인
console.log("샘플:", fileList.slice(0, 5));

const fileSet = new Set(fileList);
const map = {};
const unmatched = [];

// 핵심: "문제지.pdf" 끝매칭 대신, "해설지.pdf" 쌍 존재 여부로 문제지 후보 판단
for (const file of fileList) {
  // 문제지 후보: pdf이고, 해설지/정답/답안이 아닌 것
  if (!file.toLowerCase().endsWith(".pdf")) continue;
  if (file.includes("해설지")) continue;
  if (file.includes("정답")) continue;
  if (file.includes("답안")) continue;

  // 가장 흔한 쌍
  let match = null;

  if (file.includes("문제지")) {
    const base = file.replace("문제지.pdf", "");
    if (fileSet.has(base + "해설지.pdf")) {
      match = base + "해설지.pdf";
    } else if (fileSet.has(base + "해설지(1).pdf")) {
      match = base + "해설지(1).pdf";
    } else {
      const relaxed = fileList.find(x =>
        x.startsWith(base) && x.includes("해설지")
      );
      if (relaxed) match = relaxed;
    }
  }

  map[file] = match;
  if (!match) unmatched.push(file);
}

fs.writeFileSync(outputPath, JSON.stringify(map, null, 2), "utf8");
fs.writeFileSync(unmatchedPath, unmatched.join("\n"), "utf8");

console.log("pdf_list 전체 줄 수:", fileList.length);
console.log("문제지 후보 수:", Object.keys(map).length);
console.log("매칭 성공:", Object.values(map).filter(Boolean).length);
console.log("매칭 실패:", unmatched.length);
console.log("저장 완료:", outputPath);
console.log("미매칭 목록:", unmatchedPath);