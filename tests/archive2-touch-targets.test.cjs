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
  for (const selector of [".mobile-actions button", ".mode-switch button", ".inspector .tabs button", ".part-select select"]) {
    assert.ok(ruleBlocks(workspaceCss, selector).some(block => /min-height:\s*44px/.test(block)), `${selector} must have a 44px compact target`);
  }
});

test("Original and mixed engine mode tabs keep 44px hit areas on mobile", () => {
  const mobileRule = previewCss.match(/@media\s+screen\s+and\s+\(max-width:\s*640px\)\s*\{([\s\S]*)/);
  assert.ok(mobileRule, "screen-only mobile stylesheet block exists");
  assert.match(ruleBlocks(mobileRule[1], ".mode-tabs")[0], /min-height:\s*52px/);
  assert.match(ruleBlocks(mobileRule[1], ".mode-tabs .mode-tab")[0], /min-height:\s*44px/);
  assert.doesNotMatch(previewCss, /@media\s+print/i);
});
