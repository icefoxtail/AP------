const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const workspaceCss = fs.readFileSync(path.join(root, "archive", "archive2.css"), "utf8");
const previewCss = fs.readFileSync(path.join(root, "archive", "archive2-preview-mobile.css"), "utf8");
const mixedHtml = fs.readFileSync(path.join(root, "archive", "mixed_engine.html"), "utf8");

function ruleBlocks(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [...css.matchAll(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "gs"))].map(match => match[1]);
}

test("Compose desktop mode tabs meet the 36px review target", () => {
  assert.match(ruleBlocks(workspaceCss, ".mode-switch button")[0], /min-height:\s*36px/);
});

test("Compose and mixed-engine desktop page-count selectors meet the 36px review target", () => {
  assert.match(ruleBlocks(workspaceCss, ".part-select select")[0], /min-height:\s*36px/);
  assert.match(ruleBlocks(mixedHtml, "#qppSelect")[0], /min-height:\s*36px/);
});

test("Compose compact controls keep 44px hit areas", () => {
  // 하단 고정 띠(.cz-bar)의 주 버튼·출력·더보기와 단계·문항 수 조절 버튼도 44px 이상이다.
  for (const selector of [".cz-bar .cz-bar-main", ".cz-bar .cz-more > summary", ".cz-stepper .cz-step-btn", ".mode-switch button", ".part-select select"]) {
    assert.ok(ruleBlocks(workspaceCss, selector).some(block => /min-height:\s*(?:4[4-9]|[5-9]\d)px/.test(block)), `${selector} must have a 44px compact target`);
  }
});

test("Original and mixed engine mode tabs keep 44px hit areas on mobile", () => {
  const mobileRule = previewCss.match(/@media\s+screen\s+and\s+\(max-width:\s*640px\)\s*\{([\s\S]*)/);
  assert.ok(mobileRule, "screen-only mobile stylesheet block exists");
  assert.match(ruleBlocks(mobileRule[1], ".mode-tabs")[0], /min-height:\s*52px/);
  assert.match(ruleBlocks(mobileRule[1], ".mode-tabs .mode-tab")[0], /min-height:\s*44px/);
  assert.doesNotMatch(previewCss, /@media\s+print/i);
});

test("Mobile MathJax wrapping is scoped to Archive2 solution boxes", () => {
  assert.match(previewCss, /html\[data-archive2-context="archive2"\]\[data-ap-render-ready="true"\] \.q-box\.sol-box \.sol-exp mjx-container\s*\{/);
  assert.match(previewCss, /html:not\(\[data-archive2-context\]\):has\(#qpp-display\)\[data-ap-render-ready="true"\] \.q-box\.sol-box \.sol-exp mjx-container\s*\{/);
  assert.match(previewCss, /\.q-box\.sol-box \.sol-exp mjx-container mjx-math\s*\{/);
  assert.doesNotMatch(previewCss, /\.q-box:not\(\.sol-box\).*mjx-container/);
});
