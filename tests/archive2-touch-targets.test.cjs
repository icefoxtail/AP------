const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { assertLoads } = require('./helpers/html-asset-refs.cjs');

const root = path.resolve(__dirname, "..");
const workspaceCss = fs.readFileSync(path.join(root, "archive", "archive2.css"), "utf8");
const previewCss = fs.readFileSync(path.join(root, "archive", "archive2-preview-mobile.css"), "utf8");
const outputBarCss = fs.readFileSync(path.join(root, "archive", "archive2-output-bar.css"), "utf8");

function ruleBlocks(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [...css.matchAll(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "gs"))].map(match => match[1]);
}

test("Compose desktop mode tabs meet the 36px review target", () => {
  assert.match(ruleBlocks(workspaceCss, ".mode-switch button")[0], /min-height:\s*36px/);
});

test("Compose and mixed-engine desktop page-count selectors meet the 36px review target", () => {
  assert.match(ruleBlocks(workspaceCss, ".part-select select")[0], /min-height:\s*36px/);
  assert.match(ruleBlocks(outputBarCss, "#qppSelect")[0], /min-height:\s*36px/);
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

test("출력 창 조작줄은 토큰을 쓰고 종이를 건드리지 않으며 휴대폰에서 44px 이상이다", () => {
  const engineHtml = fs.readFileSync(path.join(root, "archive", "engine.html"), "utf8");
  const mixedHtml = fs.readFileSync(path.join(root, "archive", "mixed_engine.html"), "utf8");
  const readerCss = fs.readFileSync(path.join(root, "archive", "archive2-reader-controls.css"), "utf8");
  // 토큰은 layer로 불러 종이(html 배경·글꼴)가 바뀌지 않게 하고, 모든 규칙은 화면 전용이다.
  assert.match(outputBarCss, /@import url\("archive2-tokens\.css\?v=[^"]+"\) layer\(archive2-tokens\)/);
  assert.match(outputBarCss, /:root \{\s*font-family: revert;\s*font-size: revert;\s*color: revert;\s*color-scheme: revert;\s*\}/);
  assert.doesNotMatch(outputBarCss, /@media print/);
  assert.match(outputBarCss.slice(outputBarCss.indexOf("}", outputBarCss.indexOf(":root {")) + 1).trim(), /^@media screen \{/);
  // 색 숫자를 직접 쓰지 않는다(반투명 막 rgba 하나만 예외).
  assert.deepEqual(outputBarCss.match(/#[0-9a-fA-F]{3,8}\b/g) || [], []);
  assert.deepEqual(readerCss.match(/#[0-9a-fA-F]{3,8}\b/g) || [], []);
  // 휴대폰(640px 이하)에서 누르는 칸 44px 이상.
  const mobile = outputBarCss.match(/@media \(max-width: 640px\) \{([\s\S]*?)\n  \}\n\}/);
  assert.ok(mobile, "640px block exists");
  assert.match(ruleBlocks(mobile[1], ".ctrl-btn, .mode-tabs .mode-tab, #qppSelect")[0], /min-height:\s*44px/);
  assert.match(outputBarCss, /\.print-header-editor-input \{[^}]*min-height: 44px/);
  // 두 창이 같은 CSS를 같은 버전으로 불러오고, 옛 어두운 조작줄 규칙과 인라인 색은 남기지 않는다.
  for (const html of [engineHtml, mixedHtml]) {
    assertLoads(html, 'archive2-output-bar.css', 'html');
    assert.doesNotMatch(html, /#mode-ctrl \{[^}]*#0f172a/);
    assert.doesNotMatch(html, /id="btn-print[^>]*style=/);
    assert.doesNotMatch(html, /QPP: /);
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "tools", "archive-pages-release-manifest.json"), "utf8"));
  assert.ok(JSON.stringify(manifest).includes('"archive2-output-bar.css"'));
});
