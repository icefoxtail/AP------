const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

// 검수 영수증이 가리키는 원본 시험지 파일이 그 뒤 정상 수정되어 바이트가 달라졌는가.
// 달라졌다면 영수증은 옛 원본에 대한 기록이므로 "현재 원본과 같아야 한다"는 단언을 걸지 않는다
// (2026-11-18 사용자 결정: 계속 바뀌는 원본의 현재 값을 과거 기록과 비교해 실패시키지 않는다).
// 그 문항은 재등록 대기일 뿐 결함이 아니다. 영수증이 현재 원본과 같으면 false라서
// 영수증·런타임·메타 사이의 진짜 불일치는 그대로 실패한다.
function sourceChangedSinceReview({ current, nativeSource }) {
  if (!current || !nativeSource || !Buffer.isBuffer(nativeSource.bytes)) return false;
  const now = crypto.createHash("sha256").update(nativeSource.bytes).digest("hex");
  for (const ref of current.approvalEvidence || []) {
    if (typeof ref !== "string" || !ref.endsWith(".json") || path.isAbsolute(ref) || ref.includes("\\") ||
      ref.split("/").some(part => !part || part === "." || part === "..")) continue;
    let receipt;
    try { receipt = JSON.parse(fs.readFileSync(path.join(nativeSource.root, ref), "utf8")); } catch { continue; }
    const recorded = receipt?.sourceRawSha256 ?? receipt?.source?.rawSha256;
    if (typeof recorded === "string" && /^[a-f0-9]{64}$/.test(recorded) && recorded !== now) return true;
  }
  return false;
}

module.exports = { sourceChangedSinceReview };
