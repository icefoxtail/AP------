import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportsDir = path.join(root, "archive", "textbook", "generated", "reports");
const worklistPath = path.join(reportsDir, "visang_common1_gpt_worklist_20260603_061231.json");
const assetAuditPath = path.join(reportsDir, "visang_asset_audit_20260603_060726.json");
const outPath = path.join(reportsDir, "visang_common1_next_action_summary_20260603.md");

const worklist = JSON.parse(fs.readFileSync(worklistPath, "utf8"));
const assetAudit = JSON.parse(fs.readFileSync(assetAuditPath, "utf8"));

const priorityRules = [
  ["P0", "content_mojibake_or_ocr_suspected", "발문/OCR 의심. GPT 수정 전 crop/full-page 대조 필수."],
  ["P0", "objective_choices_not_5", "객관식 보기 개수 오류. crop 대조 후 choices 복원 필요."],
  ["P1", "answer_missing", "정답 공란. 발문/보기 성립 확인 후 직접 풀이 또는 정답 근거로 보완."],
  ["P1", "objective_answer_format_suspected", "객관식 answer 형식 의심. 보기 번호/서술형 여부 확인."],
  ["P2", "solution_missing", "해설 공란. answer 확정 후 해설 작성."],
];

function itemsWith(type) {
  return worklist.items.filter((item) => item.issueTypes.includes(type));
}

const lines = [
  "# 비상 공통수학1 다음 진행 요약",
  "",
  "## 범위 잠금",
  "",
  "- 대상: 중앙 `archive/textbook/generated/js`의 비상 공통수학1 15개 JS만.",
  "- 금지: 공통수학2/대수/확률과통계 중앙화, 삭제, archive/exams 편입, db.js 등록.",
  "- 수정 전제: full-page/source 근거 또는 crop 근거가 확인된 항목만 수정.",
  "",
  "## 현재 자동 검수",
  "",
  `- 문제 파일: ${worklist.filesChecked}개`,
  `- 문제 문항: ${worklist.problemItems}개`,
  ...Object.entries(worklist.issueTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => `- ${type}: ${count}`),
  "",
  "## 우선순위",
  "",
  "| Priority | Issue | Count | Action |",
  "| --- | --- | ---: | --- |",
  ...priorityRules.map(([priority, type, action]) => `| ${priority} | ${type} | ${itemsWith(type).length} | ${action} |`),
  "",
  "## GPT에 넘길 때 지시",
  "",
  "- `visang_common1_gpt_worklist_20260603_061231.json`의 `items`만 처리한다.",
  "- `content_mojibake_or_ocr_suspected`, `objective_choices_not_5`가 있으면 answer/solution보다 먼저 crop/full-page로 발문과 보기를 확정한다.",
  "- `answer_missing`은 발문/보기 성립 확인 후 직접 풀이하거나 정답 근거로 채운다.",
  "- `solution_missing`은 answer가 확정된 문항만 작성한다.",
  "- evidence가 없거나 crop이 애매하면 `manual_visual_review_needed`로 남기고 추측하지 않는다.",
  "",
  "## Evidence Pack",
  "",
  ...worklist.recommendedReviewPacks.map((pack) => `- ${pack}`),
  "",
  "## 보류/정리 후보",
  "",
  "- 개별 `generated/review_pack/비상_공통수학1_*_고1` 폴더 및 `*_input_pack.zip`은 JS/crop_index가 없어 GPT 수정용으로는 보류.",
  "- `by_unit_fresh` 4개 pack은 JS/input template/crop_index가 같이 있어 수정용으로 사용.",
  "- rendered full-page가 없는 set은 crop만으로 충분한지 검수 결과를 기다린다.",
  "",
  "## Rendered Full Page 누락 Set",
  "",
  ...assetAudit.issues
    .filter((issue) => issue.issueType === "rendered_full_pages_missing")
    .map((issue) => `- ${issue.setName}: ${issue.evidence}`),
  "",
];

fs.writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");
console.log(path.relative(root, outPath).replaceAll("\\", "/"));
