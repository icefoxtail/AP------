"use strict";
// 노드 전용: 카탈로그 기록 → 원본 문항 파일을 읽어 "빈 문항"(정답 없음, 또는 해설·해설 그림 모두 없음)인지 판정한다.
// 카탈로그에는 정답·해설이 없으므로 archive/exams/<sourceFile>의 문항 배열에서 sourceOrdinal 번째 문항을 읽는다.
// 읽을 수 없는 파일·문항은 "빈 문항 아님"으로 두어 후보를 함부로 줄이지 않는다(stats.unreadable로 개수를 돌려준다).
// 브라우저에서는 쓰지 않는다(화면 연결 때 복원 후 같은 기준으로 판정한다).
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const SourceReader = require("../exam-source-reader.js");
const Derive = require("../archive2-derive.js");

function createBlankChecker(options) {
  const opts = options || {};
  const roots = (Array.isArray(opts.roots) ? opts.roots : [opts.root || path.resolve(__dirname, "..", "exams")]).filter(Boolean);
  const cache = new Map(); // sourceFile → 문항 배열 | null
  const stats = { checked: 0, blank: 0, unreadable: 0 };

  function readBank(sourceFile) {
    if (cache.has(sourceFile)) return cache.get(sourceFile);
    let bank = null;
    for (const root of roots) {
      const file = path.join(root, sourceFile);
      if (!fs.existsSync(file)) continue;
      try {
        const sandbox = { window: {}, document: {}, console: { log() {}, warn() {}, error() {} } };
        sandbox.globalThis = sandbox;
        const context = vm.createContext(sandbox);
        vm.runInContext(fs.readFileSync(file, "utf8"), context, { timeout: 5000 });
        bank = SourceReader.readQuestionArray(sandbox.window, sandbox, context);
      } catch (error) { bank = null; }
      if (bank) break;
    }
    cache.set(sourceFile, bank);
    return bank;
  }

  function isBlank(record) {
    stats.checked += 1;
    const bank = record && record.sourceFile ? readBank(String(record.sourceFile)) : null;
    const ordinal = Number(record && record.sourceOrdinal);
    const question = bank && Number.isInteger(ordinal) ? bank[ordinal - 1] : null;
    if (!question) { stats.unreadable += 1; return false; }
    const blank = Derive.isBlankQuestion(question);
    if (blank) stats.blank += 1;
    return blank;
  }
  return { isBlank, stats };
}

module.exports = { createBlankChecker };
